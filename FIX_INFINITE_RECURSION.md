# 🔧 Fix: Infinite Recursion in Policies

## The Problem

The error "infinite recursion detected in policy for relation 'profiles'" happens because the RLS policies are checking the profiles table to see if someone is an admin, which creates a circular dependency.

## The Solution

Run this SQL in your Supabase SQL Editor to fix the policies:

---

## Step 1: Go to Supabase SQL Editor

1. Open your Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**

---

## Step 2: Copy and Run This SQL

Copy the ENTIRE content from the file:
**`supabase/migrations/FIXED_migration.sql`**

Or copy this:

```sql
-- FIXED MIGRATION - No Infinite Recursion

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can insert food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can update food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Admins can delete food categories" ON public.food_categories;
DROP POLICY IF EXISTS "Anyone can view available food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can insert food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can update food items" ON public.food_items;
DROP POLICY IF EXISTS "Admins can delete food items" ON public.food_items;
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Create a function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies (FIXED - no recursion)
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Food categories policies (public read, admin write)
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

-- Food items policies (public read, admin write)
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

-- Orders policies
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

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
  USING (public.is_admin());
```

---

## Step 3: Click "Run"

You should see: **"Success. No rows returned"**

---

## Step 4: Test Login

1. Go back to your app: http://localhost:8080
2. Try to register a new account
3. Should work now! ✅

---

## What Changed?

**Before:** Policies directly checked the profiles table → infinite loop  
**After:** Created a `is_admin()` function that properly handles the check

This is a common Supabase pattern to avoid RLS recursion issues.

---

## Still Having Issues?

If you still get errors:
1. Check Supabase Dashboard → Logs
2. Make sure all tables exist (Table Editor)
3. Try disabling RLS temporarily to test:
   ```sql
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   ```
   (Don't forget to re-enable it later!)
