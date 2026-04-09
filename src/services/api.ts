import { FoodItem, FoodCategory, Order, OrderItem, Profile, OrderStatus } from '@/types/database';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// ============================================
// TOKEN MANAGEMENT
// ============================================

function getToken(): string | null {
  return localStorage.getItem('foodhub_token');
}

function setToken(token: string): void {
  localStorage.setItem('foodhub_token', token);
}

function removeToken(): void {
  localStorage.removeItem('foodhub_token');
}

// ============================================
// FETCH HELPER
// ============================================

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================
// API SERVICE
// ============================================

export const apiService = {
  // ============================================
  // AUTH
  // ============================================

  async login(email: string, password: string): Promise<{ user: { id: string; email: string }; profile: Profile }> {
    const data = await apiFetch<{ user: { id: string; email: string }; profile: Profile; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    setToken(data.token);
    return { user: data.user, profile: data.profile };
  },

  async register(email: string, password: string, fullName: string): Promise<{ user: { id: string; email: string }; profile: Profile }> {
    const data = await apiFetch<{ user: { id: string; email: string }; profile: Profile; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
      }
    );

    setToken(data.token);
    return { user: data.user, profile: data.profile };
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getCurrentUser(): Promise<{ user: { id: string; email: string } | null; profile: Profile | null }> {
    const token = getToken();
    if (!token) {
      return { user: null, profile: null };
    }

    try {
      const data = await apiFetch<{ user: { id: string; email: string }; profile: Profile }>('/auth/me');
      return { user: data.user, profile: data.profile };
    } catch {
      // Token is invalid or expired
      removeToken();
      return { user: null, profile: null };
    }
  },

  // ============================================
  // FOOD CATEGORIES
  // ============================================

  async getCategories(): Promise<FoodCategory[]> {
    return apiFetch<FoodCategory[]>('/categories');
  },

  // ============================================
  // FOOD ITEMS
  // ============================================

  async getFoodItems(): Promise<FoodItem[]> {
    return apiFetch<FoodItem[]>('/food-items');
  },

  async getAllFoodItems(): Promise<FoodItem[]> {
    return apiFetch<FoodItem[]>('/food-items/all');
  },

  async createFoodItem(item: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>): Promise<FoodItem> {
    return apiFetch<FoodItem>('/food-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    return apiFetch<FoodItem>(`/food-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteFoodItem(id: string): Promise<void> {
    await apiFetch(`/food-items/${id}`, { method: 'DELETE' });
  },

  // ============================================
  // ORDERS
  // ============================================

  async getOrders(userId?: string): Promise<(Order & { items: OrderItem[]; profile?: Profile })[]> {
    // The backend automatically filters by user role
    // If admin, returns all orders; if customer, returns only their orders
    return apiFetch<(Order & { items: OrderItem[]; profile?: Profile })[]>('/orders');
  },

  async createOrder(data: {
    userId: string;
    items: { foodItem: FoodItem; quantity: number }[];
    deliveryAddress: string;
    phone: string;
    notes?: string;
  }): Promise<Order & { items: OrderItem[] }> {
    return apiFetch<Order & { items: OrderItem[] }>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: data.items.map((item) => ({
          food_item_id: item.foodItem.id,
          quantity: item.quantity,
        })),
        delivery_address: data.deliveryAddress,
        phone: data.phone,
        notes: data.notes || null,
      }),
    });
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    return apiFetch<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
  },

  // ============================================
  // REALTIME SUBSCRIPTIONS (Socket.io)
  // ============================================

  subscribeToOrders(callback: (payload: any) => void) {
    // Dynamic import of socket.io-client to avoid issues if not installed yet
    let cleanup = () => {};

    import('socket.io-client').then(({ io }) => {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
      });

      socket.on('new-order', (order: any) => {
        callback({ eventType: 'INSERT', new: order });
      });

      socket.on('order-updated', (order: any) => {
        callback({ eventType: 'UPDATE', new: order });
      });

      cleanup = () => {
        socket.disconnect();
      };
    }).catch((err) => {
      console.warn('Socket.io not available, real-time disabled:', err.message);
    });

    return cleanup;
  },
};
