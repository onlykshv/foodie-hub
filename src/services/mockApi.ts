import { FoodItem, FoodCategory, Order, OrderItem, Profile, OrderStatus } from '@/types/database';

// ============================================
// MOCK DATA - Replace with your API calls
// ============================================

export const mockCategories: FoodCategory[] = [
  { id: '1', name: 'Burgers', description: 'Juicy handcrafted burgers', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', created_at: new Date().toISOString() },
  { id: '2', name: 'Pizza', description: 'Authentic wood-fired pizzas', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', created_at: new Date().toISOString() },
  { id: '3', name: 'Sushi', description: 'Fresh Japanese cuisine', image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', created_at: new Date().toISOString() },
  { id: '4', name: 'Salads', description: 'Fresh and healthy options', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', created_at: new Date().toISOString() },
  { id: '5', name: 'Desserts', description: 'Sweet treats to finish', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', created_at: new Date().toISOString() },
  { id: '6', name: 'Drinks', description: 'Refreshing beverages', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', created_at: new Date().toISOString() },
];

export const mockFoodItems: FoodItem[] = [
  { id: '1', name: 'Classic Cheeseburger', description: 'Angus beef patty with aged cheddar, lettuce, tomato, and special sauce', price: 12.99, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category_id: '1', is_available: true, preparation_time: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'BBQ Bacon Burger', description: 'Smoky bacon, crispy onion rings, BBQ sauce on a brioche bun', price: 14.99, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', category_id: '1', is_available: true, preparation_time: 18, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Mushroom Swiss', description: 'Sautéed mushrooms and Swiss cheese with truffle aioli', price: 13.99, image_url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', category_id: '1', is_available: true, preparation_time: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil', price: 16.99, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category_id: '2', is_available: true, preparation_time: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', name: 'Pepperoni Supreme', description: 'Double pepperoni, mozzarella, oregano', price: 18.99, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category_id: '2', is_available: true, preparation_time: 22, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', name: 'Veggie Delight', description: 'Bell peppers, mushrooms, olives, artichokes', price: 17.99, image_url: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', category_id: '2', is_available: true, preparation_time: 20, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '7', name: 'Salmon Nigiri Set', description: '8 pieces of fresh Atlantic salmon nigiri', price: 22.99, image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', category_id: '3', is_available: true, preparation_time: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '8', name: 'Dragon Roll', description: 'Eel, avocado, cucumber with unagi sauce', price: 18.99, image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', category_id: '3', is_available: true, preparation_time: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '9', name: 'Rainbow Roll', description: 'California roll topped with assorted sashimi', price: 21.99, image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', category_id: '3', is_available: true, preparation_time: 15, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '10', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons, house Caesar dressing', price: 11.99, image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category_id: '4', is_available: true, preparation_time: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '11', name: 'Greek Salad', description: 'Cucumbers, tomatoes, feta, olives, red onion', price: 12.99, image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', category_id: '4', is_available: true, preparation_time: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '12', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center, vanilla ice cream', price: 9.99, image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', category_id: '5', is_available: true, preparation_time: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '13', name: 'Tiramisu', description: 'Classic Italian dessert with espresso and mascarpone', price: 8.99, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category_id: '5', is_available: true, preparation_time: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '14', name: 'Fresh Lemonade', description: 'House-made with fresh lemons and mint', price: 4.99, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', category_id: '6', is_available: true, preparation_time: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '15', name: 'Iced Coffee', description: 'Cold brew with your choice of milk', price: 5.99, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', category_id: '6', is_available: true, preparation_time: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// ============================================
// MOCK AUTH STATE - Replace with your auth
// ============================================

let mockUser: { id: string; email: string } | null = null;
let mockProfile: Profile | null = null;

// Simulated users database
const mockUsers: { email: string; password: string; profile: Profile }[] = [
  {
    email: 'admin@foodhub.com',
    password: 'admin123',
    profile: {
      id: 'admin-1',
      user_id: 'user-admin-1',
      full_name: 'Admin User',
      email: 'admin@foodhub.com',
      role: 'admin',
      phone: '555-0100',
      address: '123 Admin St',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    email: 'customer@example.com',
    password: 'customer123',
    profile: {
      id: 'customer-1',
      user_id: 'user-customer-1',
      full_name: 'John Customer',
      email: 'customer@example.com',
      role: 'customer',
      phone: '555-0200',
      address: '456 Customer Ave',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// ============================================
// MOCK ORDERS STATE
// ============================================

let mockOrders: (Order & { items: OrderItem[] })[] = [
  {
    id: 'order-1',
    user_id: 'user-customer-1',
    status: 'delivered',
    total_amount: 28.98,
    delivery_address: '456 Customer Ave, City',
    phone: '555-0200',
    notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { id: 'item-1', order_id: 'order-1', food_item_id: '1', food_item_name: 'Classic Cheeseburger', quantity: 2, unit_price: 12.99, subtotal: 25.98, created_at: new Date().toISOString() },
      { id: 'item-2', order_id: 'order-1', food_item_id: '14', food_item_name: 'Fresh Lemonade', quantity: 1, unit_price: 4.99, subtotal: 4.99, created_at: new Date().toISOString() },
    ],
  },
];

// ============================================
// API SERVICE - Replace these with real API calls
// ============================================

export const apiService = {
  // AUTH
  async login(email: string, password: string): Promise<{ user: { id: string; email: string }; profile: Profile }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) {
      throw new Error('Invalid credentials');
    }
    
    mockUser = { id: found.profile.user_id, email: found.email };
    mockProfile = found.profile;
    
    // Store in localStorage for persistence
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockProfile', JSON.stringify(mockProfile));
    
    return { user: mockUser, profile: mockProfile };
  },

  async register(email: string, password: string, fullName: string): Promise<{ user: { id: string; email: string }; profile: Profile }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      email,
      password,
      profile: {
        id: `profile-${Date.now()}`,
        user_id: `user-${Date.now()}`,
        full_name: fullName,
        email,
        role: 'customer' as const,
        phone: null,
        address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
    
    mockUsers.push(newUser);
    mockUser = { id: newUser.profile.user_id, email };
    mockProfile = newUser.profile;
    
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockProfile', JSON.stringify(mockProfile));
    
    return { user: mockUser, profile: mockProfile };
  },

  async logout(): Promise<void> {
    mockUser = null;
    mockProfile = null;
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockProfile');
  },

  async getCurrentUser(): Promise<{ user: { id: string; email: string } | null; profile: Profile | null }> {
    // Check localStorage for persisted session
    const storedUser = localStorage.getItem('mockUser');
    const storedProfile = localStorage.getItem('mockProfile');
    
    if (storedUser && storedProfile) {
      mockUser = JSON.parse(storedUser);
      mockProfile = JSON.parse(storedProfile);
    }
    
    return { user: mockUser, profile: mockProfile };
  },

  // FOOD ITEMS
  async getFoodItems(): Promise<FoodItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFoodItems.filter(item => item.is_available);
  },

  async getAllFoodItems(): Promise<FoodItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockFoodItems;
  },

  async createFoodItem(item: Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>): Promise<FoodItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newItem: FoodItem = {
      ...item,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockFoodItems.push(newItem);
    return newItem;
  },

  async updateFoodItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    mockFoodItems[index] = { ...mockFoodItems[index], ...updates, updated_at: new Date().toISOString() };
    return mockFoodItems[index];
  },

  async deleteFoodItem(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index !== -1) mockFoodItems.splice(index, 1);
  },

  // CATEGORIES
  async getCategories(): Promise<FoodCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },

  // ORDERS
  async getOrders(userId?: string): Promise<(Order & { items: OrderItem[] })[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (userId) {
      return mockOrders.filter(o => o.user_id === userId);
    }
    return mockOrders;
  },

  async createOrder(data: {
    userId: string;
    items: { foodItem: FoodItem; quantity: number }[];
    deliveryAddress: string;
    phone: string;
    notes?: string;
  }): Promise<Order & { items: OrderItem[] }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalAmount = data.items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
    const orderId = `order-${Date.now()}`;
    
    const orderItems: OrderItem[] = data.items.map((item, idx) => ({
      id: `item-${orderId}-${idx}`,
      order_id: orderId,
      food_item_id: item.foodItem.id,
      food_item_name: item.foodItem.name,
      quantity: item.quantity,
      unit_price: item.foodItem.price,
      subtotal: item.foodItem.price * item.quantity,
      created_at: new Date().toISOString(),
    }));
    
    const order: Order & { items: OrderItem[] } = {
      id: orderId,
      user_id: data.userId,
      status: 'placed',
      total_amount: totalAmount,
      delivery_address: data.deliveryAddress,
      phone: data.phone,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
    };
    
    mockOrders.unshift(order);
    return order;
  },

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    // Validate transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      placed: ['preparing'],
      preparing: ['ready'],
      ready: ['delivered'],
      delivered: [],
    };
    
    if (!validTransitions[order.status].includes(newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }
    
    order.status = newStatus;
    order.updated_at = new Date().toISOString();
    
    return order;
  },
};
