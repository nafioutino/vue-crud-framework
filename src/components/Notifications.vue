<!-- src/components/Notifications.vue -->
<template>
  <div class="fixed top-5 right-5 w-[300px] z-[9999]">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center bg-white border-l-[5px] border-blue-600 p-3 mb-4 rounded shadow"
      >
        <div class="mr-3 text-2xl">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="flex-1">
          {{ notification.message }}
        </div>
        <button
          class="bg-transparent border-0 text-xl cursor-pointer"
          @click="removeNotification(notification.id)"
        >
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCrudStore } from '@/stores/crudStore';

const crudStore = useCrudStore();

const notifications = computed(() => crudStore.notifications);

function removeNotification(id: string) {
  crudStore.removeNotification(id);
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  @apply transition-all duration-500;
}
.notification-enter-from,
.notification-leave-to {
  @apply opacity-0 translate-x-[50px];
}
</style>
