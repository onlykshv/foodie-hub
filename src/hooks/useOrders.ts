import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { OrderStatus, CartItem } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => apiService.getOrders(user?.id),
    enabled: !!user,
  });
}

export function useAdminOrders() {
  const { isAdmin } = useAuth();

  console.log('useAdminOrders - isAdmin:', isAdmin);

  return useQuery({
    queryKey: ['adminOrders'],
    queryFn: () => {
      console.log('Fetching admin orders...');
      return apiService.getOrders();
    },
    enabled: isAdmin,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      items,
      deliveryAddress,
      phone,
      notes,
    }: {
      items: CartItem[];
      deliveryAddress: string;
      phone: string;
      notes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      return apiService.createOrder({
        userId: user.id,
        items,
        deliveryAddress,
        phone,
        notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, currentStatus, newStatus }: { 
      orderId: string; 
      currentStatus: OrderStatus;
      newStatus: OrderStatus;
    }) => {
      return apiService.updateOrderStatus(orderId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
}
