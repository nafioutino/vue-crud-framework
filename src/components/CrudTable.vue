<!-- src/components/CrudTable.vue -->
<template>
  <div class="overflow-x-auto my-4">
    <table class="w-full border-collapse min-w-[600px]">
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index"
            class="p-3 border border-gray-300 text-left bg-blue-600 text-white">
            {{ col.label }}
          </th>
          <th class="p-3 border border-gray-300 text-left bg-blue-600 text-white">
            Actions
          </th>
        </tr>
      </thead>
      <transition-group name="table-row" tag="tbody">
        <tr v-for="(item, index) in paginatedItems" :key="item.id" class="even:bg-gray-50">
          <td v-for="(col, index2) in columns" :key="index2" class="p-3 border border-gray-300 text-left">
            {{ item[col.field] }}
          </td>
          <td class="p-3 border border-gray-300 text-left">
            <button v-if="hasPermission('edit')" @click="$emit('edit', item)"
              class="mr-2 py-2 px-3 rounded cursor-pointer transition-opacity hover:opacity-90 bg-green-400 text-white">
              <span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                  fill="#FFFFFF">
                  <path
                    d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                </svg></span>
            </button>
            <button v-if="hasPermission('delete')" @click="$emit('delete', item)"
              class="mr-2 py-2 px-3 rounded cursor-pointer transition-opacity hover:opacity-90 bg-red-500 text-white">
              <span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                  fill="#F3F3F3">
                  <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg></span>
            </button>
          </td>
        </tr>
      </transition-group>
    </table>
    <div class="flex justify-center items-center mt-4">
      <button :disabled="currentPage === 1" @click="prevPage"
        class="py-2 px-4 mx-4 bg-blue-600 text-white rounded disabled:opacity-50">
        Previous
      </button>
      <span class="text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button :disabled="currentPage === totalPages" @click="nextPage"
        class="py-2 px-4 mx-4 bg-blue-600 text-white rounded disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import { useCrudStore } from '../stores/crudStore';

interface Column {
  label: string;
  field: string;
}

const props = defineProps<{
  items: any[];
  columns: Column[];
  pageSize?: number;
}>();

const currentPage = ref(1);
const pageSize = props.pageSize || 5;

const totalPages = computed(() => Math.ceil(props.items.length / pageSize));
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return props.items.slice(start, start + pageSize);
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

const crudStore = useCrudStore();
function hasPermission(action: string): boolean {
  return crudStore.permissions.includes(action);
}
</script>

<style scoped>
.table-row-enter-active,
.table-row-leave-active {
  @apply transition-all duration-300;
}

.table-row-enter-from,
.table-row-leave-to {
  @apply opacity-0 translate-y-[10px];
}
</style>
