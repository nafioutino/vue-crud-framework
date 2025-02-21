// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';

class WebSocketService {
  public socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  on(event: string, callback: any) {
    this.socket.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export const webSocketService = new WebSocketService();
