<!-- src/components/CrudTable.vue (corrigé) -->
<template>
  <div class="crud-table">
    <table>
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :key="index">{{ col.label }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <transition-group name="table-row" tag="tbody">
        <tr v-for="(item, index) in paginatedItems" :key="item.id">
          <td v-for="(col, index2) in columns" :key="index2">{{ item[col.field] }}</td>
          <td>
            <button v-if="hasPermission('edit')" @click="$emit('edit', item)">Edit</button>
            <button v-if="hasPermission('delete')" @click="$emit('delete', item)">Delete</button>
          </td>
        </tr>
      </transition-group>
    </table>
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">Next</button>
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
.crud-table {
  overflow-x: auto;
  margin: 1rem 0;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}
th, td {
  padding: 0.75rem;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background-color: #007bff;
  color: #fff;
}
button {
  margin-right: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
button:hover {
  opacity: 0.9;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}
.pagination button {
  padding: 0.5rem 1rem;
  margin: 0 1rem;
  background-color: #007bff;
  color: white;
}
.table-row-enter-active, .table-row-leave-active {
  transition: all 0.3s;
}
.table-row-enter-from, .table-row-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
/* Responsive */
@media (max-width: 768px) {
  th, td {
    padding: 0.5rem;
  }
  .pagination {
    flex-direction: column;
  }
  .pagination button {
    margin: 0.5rem 0;
  }
}
</style>
