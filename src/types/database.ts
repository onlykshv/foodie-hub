export type UserRole = 'customer' | 'admin';

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_available: boolean;
  preparation_time: number | null;
  created_at: string;
  updated_at: string;
  category?: FoodCategory;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  delivery_address: string;
  phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string | null;
  food_item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}
