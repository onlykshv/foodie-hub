-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('placed', 'preparing', 'ready', 'delivered');

-- Create profiles table for storing user roles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'customer',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food categories table
CREATE TABLE public.food_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food items table
CREATE TABLE public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  preparation_time INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status public.order_status NOT NULL DEFAULT 'placed',
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
  food_item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Food categories policies (public read, admin write)
CREATE POLICY "Anyone can view food categories"
  ON public.food_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert food categories"
  ON public.food_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update food categories"
  ON public.food_categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete food categories"
  ON public.food_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Food items policies (public read, admin write)
CREATE POLICY "Anyone can view available food items"
  ON public.food_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert food items"
  ON public.food_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update food items"
  ON public.food_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete food items"
  ON public.food_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Orders policies
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at
  BEFORE UPDATE ON public.food_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample food categories
INSERT INTO public.food_categories (name, description, image_url) VALUES
  ('Burgers', 'Juicy handcrafted burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
  ('Pizza', 'Authentic wood-fired pizzas', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
  ('Sushi', 'Fresh Japanese cuisine', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400'),
  ('Salads', 'Fresh and healthy options', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'),
  ('Desserts', 'Sweet treats to finish', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400'),
  ('Drinks', 'Refreshing beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400');

-- Insert sample food items
INSERT INTO public.food_items (name, description, price, image_url, category_id, preparation_time) VALUES
  ('Classic Cheeseburger', 'Angus beef patty with aged cheddar, lettuce, tomato, and special sauce', 12.99, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', (SELECT id FROM public.food_categories WHERE name = 'Burgers'), 15),
  ('BBQ Bacon Burger', 'Smoky bacon, crispy onion rings, BBQ sauce on a brioche bun', 14.99, 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', (SELECT id FROM public.food_categories WHERE name = 'Burgers'), 18),
  ('Mushroom Swiss', 'Sautéed mushrooms and Swiss cheese with truffle aioli', 13.99, 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', (SELECT id FROM public.food_categories WHERE name = 'Burgers'), 15),
  ('Margherita Pizza', 'San Marzano tomatoes, fresh mozzarella, basil', 16.99, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', (SELECT id FROM public.food_categories WHERE name = 'Pizza'), 20),
  ('Pepperoni Supreme', 'Double pepperoni, mozzarella, oregano', 18.99, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', (SELECT id FROM public.food_categories WHERE name = 'Pizza'), 22),
  ('Veggie Delight', 'Bell peppers, mushrooms, olives, artichokes', 17.99, 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400', (SELECT id FROM public.food_categories WHERE name = 'Pizza'), 20),
  ('Salmon Nigiri Set', '8 pieces of fresh Atlantic salmon nigiri', 22.99, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', (SELECT id FROM public.food_categories WHERE name = 'Sushi'), 12),
  ('Dragon Roll', 'Eel, avocado, cucumber with unagi sauce', 18.99, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', (SELECT id FROM public.food_categories WHERE name = 'Sushi'), 15),
  ('Rainbow Roll', 'California roll topped with assorted sashimi', 21.99, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', (SELECT id FROM public.food_categories WHERE name = 'Sushi'), 15),
  ('Caesar Salad', 'Romaine, parmesan, croutons, house Caesar dressing', 11.99, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', (SELECT id FROM public.food_categories WHERE name = 'Salads'), 8),
  ('Greek Salad', 'Cucumbers, tomatoes, feta, olives, red onion', 12.99, 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', (SELECT id FROM public.food_categories WHERE name = 'Salads'), 8),
  ('Chocolate Lava Cake', 'Warm chocolate cake with molten center, vanilla ice cream', 9.99, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', (SELECT id FROM public.food_categories WHERE name = 'Desserts'), 12),
  ('Tiramisu', 'Classic Italian dessert with espresso and mascarpone', 8.99, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', (SELECT id FROM public.food_categories WHERE name = 'Desserts'), 5),
  ('Fresh Lemonade', 'House-made with fresh lemons and mint', 4.99, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', (SELECT id FROM public.food_categories WHERE name = 'Drinks'), 3),
  ('Iced Coffee', 'Cold brew with your choice of milk', 5.99, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', (SELECT id FROM public.food_categories WHERE name = 'Drinks'), 3);