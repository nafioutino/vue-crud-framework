<!-- src/components/Notifications.vue -->
<template>
  <div class="notifications">
    <transition-group name="notification" tag="div">
      <div class="notification" v-for="(notification, index) in notifications" :key="notification.id">
        <div class="icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="message">{{ notification.message }}</div>
        <button class="close-btn" @click="removeNotification(notification.id)">×</button>
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
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  z-index: 9999;
}
.notification {
  display: flex;
  align-items: center;
  background: #fff;
  border-left: 5px solid #007bff;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.icon {
  margin-right: 0.75rem;
  font-size: 1.5rem;
}
.message {
  flex-grow: 1;
}
.close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
}
.notification-enter-active, .notification-leave-active {
  transition: all 0.5s;
}
.notification-enter-from, .notification-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
