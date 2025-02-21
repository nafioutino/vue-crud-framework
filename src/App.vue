<!-- src/App.vue -->
<template>
  <!-- Contexte global : occupe toute la hauteur, avec un dégradé en arrière-plan -->
  <div class="min-h-screen bg-gradient-to-r from-blue-50 to-blue-200 py-10 px-4">
    <!-- Container principal : un bloc blanc au centre avec ombre, angles arrondis -->
    <transition name="fade-in-scale">
      <div
        v-if="isVisible"
        class="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg p-6"
      >
        <header class="text-center mb-6">
          <h1 class="text-4xl font-bold text-gray-800 mb-2 tracking-wide">
            CRUD Framework
          </h1>

        </header>

        <Notifications />

        <!-- Section CRUD : un spacing vertical pour séparer le formulaire et le tableau -->
        <section class="space-y-8">
          <!-- Formulaire dynamique -->
          <DynamicForm
            :key="editingItem ? editingItem.id : 'create'"
            :fields="formFields"
            :initialValues="editingItem"
            @submit="handleSubmit"
            @cancelEdit="cancelEdit"
          />

          <!-- Tableau CRUD -->
          <CrudTable
            :items="store.items"
            :columns="tableColumns"
            :pageSize="5"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </section>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
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

// Simple variable pour déclencher l'animation d'apparition du container
const isVisible = ref(false);

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

// On déclenche l'animation d'apparition
onBeforeMount(() => {
  isVisible.value = false;
});
onMounted(() => {
  loadItems();
  // Animation
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  // Écoute des notifications via WebSocket
  webSocketService.on('notification', (data: any) => {
    store.addNotification({ type: data.type, message: data.message });
  });
});
</script>

<style scoped>
/* Animation d'apparition en douceur (fade + scale) */
.fade-in-scale-enter-active,
.fade-in-scale-leave-active {
  transition: all 0.5s ease;
}
.fade-in-scale-enter-from,
.fade-in-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
