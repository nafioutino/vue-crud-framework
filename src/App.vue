<!-- src/App.vue -->
<template>
  <div id="app">
    <header>
      <h1>CRUD Framework</h1>
    </header>
    <Notifications />

    <section class="crud-section">
      <!-- On utilise une key dynamique pour forcer le re-render du formulaire lors du changement d'édition -->
      <DynamicForm
        :key="editingItem ? editingItem.id : 'create'"
        :fields="formFields"
        :initialValues="editingItem"
        @submit="handleSubmit"
        @cancelEdit="cancelEdit"
      />

      <CrudTable
        :items="store.items"
        :columns="tableColumns"
        :pageSize="5"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCrudStore } from './stores/crudStore';
import DynamicForm from './components/DynamicForm.vue';
import CrudTable from './components/CrudTable.vue';
import Notifications from './components/Notifications.vue';
import { api } from './services/api';
import { webSocketService } from './services/websocket';

interface FormField {
  label: string;
  type: string;
  model: string;
  placeholder?: string;
}

const formFields: FormField[] = [
  { label: 'Nom', type: 'text', model: 'name', placeholder: 'Entrez le nom' },
  { label: 'Email', type: 'email', model: 'email', placeholder: 'Entrez l\'email' },
  { label: 'Age', type: 'number', model: 'age', placeholder: 'Entrez l\'âge' }
];

const tableColumns = [
  { label: 'Nom', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Age', field: 'age' }
];

const store = useCrudStore();
const editingItem = ref<any>(null);

async function loadItems() {
  try {
    const response = await api.getItems();
    store.$patch({ items: response.data.items });
  } catch (error) {
    store.addNotification({ type: 'error', message: 'Erreur lors du chargement des items' });
  }
}

function handleSubmit(formData: any) {
  if (editingItem.value) {
    // Mise à jour
    const updatedItem = { ...editingItem.value, ...formData };
    store.updateItem(updatedItem);
    api.updateItem(updatedItem.id, updatedItem);
    store.addNotification({ type: 'info', message: 'Item modifié avec succès' });
    editingItem.value = null; // sortir du mode édition
  } else {
    // Création
    const newItem = { ...formData, id: Date.now().toString() };
    store.addItem(newItem);
    api.createItem(newItem);
    store.addNotification({ type: 'success', message: 'Item créé avec succès' });
  }
}

function handleEdit(item: any) {
  // Passer l'item dans le formulaire pour édition
  editingItem.value = { ...item }; // on crée une copie
}

function cancelEdit() {
  editingItem.value = null;
}

function handleDelete(item: any) {
  store.deleteItem(item.id);
  store.addNotification({ type: 'error', message: 'Item supprimé' });
  api.deleteItem(item.id);
}

onMounted(() => {
  loadItems();
  webSocketService.on('notification', (data: any) => {
    store.addNotification({ type: data.type, message: data.message });
  });
});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 2rem;
  background: #f0f2f5;
}
header {
  text-align: center;
  margin-bottom: 2rem;
}
.crud-section {
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
