<!-- src/components/DynamicForm.vue -->
<template>
  <form @submit.prevent="onSubmit" class="max-w-[500px] mx-auto p-4 bg-[#f7f9fc] rounded-lg shadow">
    <transition-group name="fade" tag="div">
      <div
        v-for="(field, index) in fields"
        :key="index"
        class="mb-4 flex flex-col"
      >
        <label :for="field.model" class="mb-2 font-bold">
          {{ field.label }}
        </label>
        <input
          :id="field.model"
          :type="field.type"
          v-model="formData[field.model]"
          :placeholder="field.placeholder || ''"
          required
          class="p-2 border border-gray-300 rounded transition-colors focus:border-blue-600 focus:outline-none"
        />
      </div>
    </transition-group>
    <div class="flex gap-4">
      <button type="submit" class="flex-1 py-3 rounded cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-700">
        {{ editingMode ? 'Update' : 'Submit' }}
      </button>
      <button
        v-if="editingMode"
        type="button"
        class="flex-1 py-3 rounded cursor-pointer transition-colors bg-gray-300 text-gray-700 hover:bg-gray-500"
        @click="cancelEdit"
      >
        Cancel
      </button>
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
  emit('cancelEdit');
  props.fields.forEach(field => {
    formData[field.model] = '';
  });
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-300;
}
.fade-enter-from,
.fade-leave-to {
  @apply opacity-0 translate-y-[10px];
}
</style>
