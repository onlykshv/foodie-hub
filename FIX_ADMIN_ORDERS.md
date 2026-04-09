# 🔧 Fix: Admin Can't See Customer Orders

## The Problem

Admin users can't see orders placed by customers. This is likely due to:
1. RLS policies not working correctly for admins
2. The `is_admin()` function not being called properly
3. Admin role not set correctly in the database

## Solution

### Step 1: Verify Your Admin Role

First, check if your account is actually set as admin:

```sql
-- Check your profile
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

If the `role` column shows `customer`, update it:

```sql
-- Make yourself admin (replace with your email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Step 2: Test the is_admin() Function

```sql
-- This should return TRUE if you're logged in as admin
SELECT public.is_admin();
```

If it returns `NULL` or `FALSE`, the function might not be working.

### Step 3: Fix the Admin Policies

Run this SQL to ensure admin policies are correct:

```sql
-- Drop and recreate the is_admin function
DROP FUNCTION IF EXISTS public.is_admin();

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

-- Drop existing order policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;

-- Recreate order policies
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

-- Fix order items policies
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
```

### Step 4: Logout and Login Again

After running the SQL:
1. **Logout** from your app
2. **Login** again as admin
3. Go to `/admin/orders`
4. You should now see all orders! ✅

### Step 5: Test It

1. **As Customer:**
   - Login with a customer account
   - Place an order
   
2. **As Admin:**
   - Login with your admin account
   - Go to `/admin/orders`
   - You should see the customer's order

## Debugging

If it still doesn't work, check these:

### Check if orders exist in database:
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Check if you're actually admin:
```sql
SELECT 
  p.email, 
  p.role, 
  p.user_id,
  auth.uid() as current_user_id
FROM profiles p
WHERE p.email = 'your-email@example.com';
```

### Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'orders';
```

Should show `rowsecurity = true`

### Temporarily disable RLS to test (DON'T DO THIS IN PRODUCTION):
```sql
-- Disable RLS temporarily
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Test if you can see orders now
-- Then re-enable it:
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
```

## Common Issues

### Issue 1: "No orders" showing for admin
**Cause:** Admin role not set or policies not working  
**Fix:** Run Step 1 and Step 3 above

### Issue 2: Orders show for customer but not admin
**Cause:** `is_admin()` function not working  
**Fix:** Run Step 2 and Step 3 above

### Issue 3: Can't update order status
**Cause:** Update policy missing  
**Fix:** Run Step 3 above

## Quick Test Query

Run this as admin to see if you can query orders directly:

```sql
-- This should return all orders if you're admin
SELECT 
  o.*,
  p.email as customer_email,
  p.full_name as customer_name
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.user_id
ORDER BY o.created_at DESC;
```

If this works but the app doesn't show orders, the issue is in the frontend. If this doesn't work, the issue is with RLS policies.
