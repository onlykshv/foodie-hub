import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { io, Socket } from 'socket.io-client';

export function useRealtimeOrders() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
      socket.emit('join-admin');
    });

    socket.on('new-order', (order: any) => {
      console.log('📡 New order received:', order);
      toast.success('New order received!');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    });

    socket.on('order-updated', (order: any) => {
      console.log('📡 Order updated:', order);
      toast.info('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAdmin, queryClient]);
}

export function useRealtimeCustomerOrders(userId: string | undefined) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Customer socket connected');
      socket.emit('join-customer', userId);
    });

    socket.on('order-updated', (order: any) => {
      if (order.user_id === userId) {
        toast.success(`Order status updated: ${order.status}`);
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, queryClient]);
}
