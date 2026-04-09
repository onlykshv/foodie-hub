import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { FoodItem } from '@/types/database';

export function useFoodItems() {
  return useQuery({
    queryKey: ['foodItems'],
    queryFn: () => apiService.getFoodItems(),
  });
}

export function useAllFoodItems() {
  return useQuery({
    queryKey: ['allFoodItems'],
    queryFn: () => apiService.getAllFoodItems(),
  });
}

export function useFoodCategories() {
  return useQuery({
    queryKey: ['foodCategories'],
    queryFn: () => apiService.getCategories(),
  });
}

export function useCreateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>) => 
      apiService.createFoodItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['allFoodItems'] });
    },
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updates }: Partial<FoodItem> & { id: string }) => 
      apiService.updateFoodItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['allFoodItems'] });
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteFoodItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      queryClient.invalidateQueries({ queryKey: ['allFoodItems'] });
    },
  });
}
