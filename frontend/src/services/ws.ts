import { io, Socket } from 'socket.io-client';
import type { Dispatch } from '@reduxjs/toolkit';
import { priceUpdate, orderUpdate } from '@/store/slices/marketSlice';

export const initWebSocket = (dispatch: Dispatch): Socket => {
  const socket = io(import.meta.env.VITE_WS_URL || '/socket.io', {
    transports: ['websocket'],
    withCredentials: true
  });

  socket.on('connect', () => console.log('🔗 WS connected:', socket.id));
  socket.on('price_update', (data) => dispatch(priceUpdate(data)));
  socket.on('order_update', (order) => dispatch(orderUpdate(order)));
  socket.on('disconnect', () => console.log('🔌 WS disconnected'));

  return socket;
};
