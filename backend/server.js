// backend/server.js
// const express = require('express');
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// const http = require('http');
// const { Server } = require('socket.io')
// const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
app.use(cors());
app.use(express.json());

// Base de données en mémoire
let items = [
  { id: '1', name: 'Item 1', email: 'item1@example.com', age: 25 },
  { id: '2', name: 'Item 2', email: 'item2@example.com', age: 30 },
];

// GET /api/items avec pagination
app.get('/api/items', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);
  res.json({
    items: paginatedItems,
    total: items.length,
    page,
    pageSize
  });
});

// POST /api/items
app.post('/api/items', (req, res) => {
  const newItem = { ...req.body, id: Date.now().toString() };
  // Ici, on pourrait ajouter une vérification des permissions
  items.push(newItem);
  io.emit('notification', { type: 'success', message: `Item créé: ${newItem.name}` });
  res.status(201).json(newItem);
});

// PUT /api/items/:id
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Item non trouvé' });
  items[index] = { ...items[index], ...req.body };
  io.emit('notification', { type: 'info', message: `Item modifié: ${items[index].name}` });
  res.json(items[index]);
});

// DELETE /api/items/:id
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: 'Item non trouvé' });
  const deletedItem = items.splice(index, 1)[0];
  io.emit('notification', { type: 'error', message: `Item supprimé: ${deletedItem.name}` });
  res.json(deletedItem);
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(` Le Serveur en écoute tranquillement sur le port ${PORT}`);
});
