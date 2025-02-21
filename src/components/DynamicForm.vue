<!-- src/components/DynamicForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="dynamic-form">
    <transition-group name="fade" tag="div">
      <div v-for="(field, index) in fields" :key="index" class="form-group">
        <label :for="field.model">{{ field.label }}</label>
        <input
          :id="field.model"
          :type="field.type"
          v-model="formData[field.model]"
          class="form-control"
          :placeholder="field.placeholder || ''"
          required
        />
      </div>
    </transition-group>
    <div class="actions">
      <button type="submit" class="btn-submit">{{ editingMode ? 'Update' : 'Submit' }}</button>
      <button v-if="editingMode" type="button" class="btn-cancel" @click="cancelEdit">Cancel</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, computed } from 'vue';

interface Field {
  label: string;
  type: string;
  model: string;
  placeholder?: string;
}

const props = defineProps<{
  fields: Field[];
  initialValues?: Record<string, any>;
}>();

const emit = defineEmits<{
  (e: 'submit', payload: Record<string, any>): void;
  (e: 'cancelEdit'): void;
}>();

const formData = reactive<Record<string, any>>({});

// Fonction d'initialisation du formulaire
function initializeForm() {
  props.fields.forEach(field => {
    formData[field.model] = props.initialValues?.[field.model] || '';
  });
}

// Initialisation dès le montage
initializeForm();

// Si les initialValues changent, on réinitialise le formulaire
watch(
  () => props.initialValues,
  () => {
    initializeForm();
  },
  { immediate: true }
);

// Mode édition si initialValues est défini
const editingMode = computed(() => !!props.initialValues);

function onSubmit() {
  emit('submit', { ...formData });
  // On ne vide le formulaire que si on était en mode création
  if (!editingMode.value) {
    props.fields.forEach(field => {
      formData[field.model] = '';
    });
  }
}

function cancelEdit() {
  // Émettre un événement pour annuler l'édition
  emit('cancelEdit');
  // Réinitialiser le formulaire
  props.fields.forEach(field => {
    formData[field.model] = '';
  });
}
</script>

<style scoped>
.dynamic-form {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
  background: #f7f9fc;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.form-control {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.3s;
}
.form-control:focus {
  border-color: #007bff;
  outline: none;
}
.actions {
  display: flex;
  gap: 1rem;
}
.btn-submit, .btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-submit {
  background: #007bff;
  color: white;
}
.btn-submit:hover {
  background: #0056b3;
}
.btn-cancel {
  background: #ccc;
  color: #333;
}
.btn-cancel:hover {
  background: #999;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
