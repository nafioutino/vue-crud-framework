// src/services/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

export const api = {
  getItems(page: number = 1, pageSize: number = 5) {
    return apiClient.get(`/items?page=${page}&pageSize=${pageSize}`);
  },
  createItem(item: any) {
    return apiClient.post('/items', item);
  },
  updateItem(id: string, item: any) {
    return apiClient.put(`/items/${id}`, item);
  },
  deleteItem(id: string) {
    return apiClient.delete(`/items/${id}`);
  }
};
