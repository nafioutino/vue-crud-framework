// src/stores/crudStore.ts
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface CrudState {
  items: any[];
  notifications: Notification[];
  permissions: string[]; // ex: ['edit', 'delete', 'create']
}

export const useCrudStore = defineStore('crudStore', {
  state: (): CrudState => ({
    items: [],
    notifications: [],
    permissions: ['edit', 'delete', 'create'] // Exemple de permissions
  }),
  actions: {
    addItem(item: any) {
      this.items.push(item);
    },
    updateItem(updatedItem: any) {
      const index = this.items.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        this.items.splice(index, 1, updatedItem);
      }
    },
    deleteItem(id: string) {
      this.items = this.items.filter(item => item.id !== id);
    },
    addNotification(notification: Omit<Notification, 'id'>) {
      const newNotification = { ...notification, id: uuidv4() };
      this.notifications.push(newNotification);
      // Suppression automatique après 5 secondes
      setTimeout(() => this.removeNotification(newNotification.id), 5000);
    },
    removeNotification(id: string) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    }
  }
});
