-- FIX: Admin Can't See Customer Orders
-- Run this in Supabase SQL Editor

-- 1. Fix the is_admin() function to be more reliable
-- Use CASCADE to drop dependent policies
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Recreate ALL policies that depend on is_admin()

-- Food Categories Policies
DROP POLICY IF EXISTS "Anyone can view food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can insert food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can update food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can delete food categories" ON public.food_categories;

CREATE POLICY "Anyone can view food categories"
  ON public.food_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert food categories"
  ON public.food_categories FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update food categories"
  ON public.food_categories FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete food categories"
  ON public.food_categories FOR DELETE
  USING (public.is_admin());

-- Food Items Policies
DROP POLICY IF EXISTS "Anyone can view available food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can insert food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can update food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can delete food items" ON public.food_items;

CREATE POLICY "Anyone can view available food items"
  ON public.food_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert food items"
  ON public.food_items FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update food items"
  ON public.food_items FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete food items"
  ON public.food_items FOR DELETE
  USING (public.is_admin());

-- Order Policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;

-- 3. Recreate order policies with proper admin access
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Customers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- 4. Fix order items policies
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR public.is_admin())
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
  USING (public.is_admin());

-- 5. Verify: Check if you're admin (run this after logging in)
-- SELECT public.is_admin();

-- 6. Make yourself admin (replace with your email)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
