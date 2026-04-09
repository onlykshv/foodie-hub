-- COMPLETE FIX: Orders not showing for anyone
-- This will fix ALL RLS policies from scratch

-- ============================================
-- STEP 1: Drop ALL existing policies
-- ============================================

-- Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Food Categories
DROP POLICY IF EXISTS "Anyone can view food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can insert food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can update food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can delete food categories" ON public.food_categories;

-- Food Items
DROP POLICY IF EXISTS "Anyone can view available food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can insert food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can update food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can delete food items" ON public.food_items;

-- Orders
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;

-- Order Items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- ============================================
-- STEP 2: Recreate is_admin() function
-- ============================================

DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- STEP 3: Create SIMPLE policies that work
-- ============================================

-- PROFILES: Users can manage their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- FOOD CATEGORIES: Everyone can read, admins can write
CREATE POLICY "food_categories_select_all"
  ON public.food_categories FOR SELECT
  USING (true);

CREATE POLICY "food_categories_admin_all"
  ON public.food_categories FOR ALL
  USING (public.is_admin());

-- FOOD ITEMS: Everyone can read, admins can write
CREATE POLICY "food_items_select_all"
  ON public.food_items FOR SELECT
  USING (true);

CREATE POLICY "food_items_admin_all"
  ON public.food_items FOR ALL
  USING (public.is_admin());

-- ORDERS: Users see their own, admins see all
CREATE POLICY "orders_select_own_or_admin"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "orders_insert_own"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- ORDER ITEMS: Users see their own order items, admins see all
CREATE POLICY "order_items_select_own_or_admin"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "order_items_insert_own"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- ============================================
-- STEP 4: Verify setup
-- ============================================

-- Check if you're admin (should return true if you are)
SELECT public.is_admin() as am_i_admin;

-- Check your profile
SELECT email, role FROM profiles WHERE user_id = auth.uid();

-- Try to see orders (should work now)
SELECT COUNT(*) as total_orders FROM orders;
