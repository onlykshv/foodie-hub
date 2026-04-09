-- SIMPLE FIX: Just check if you're admin and see orders
-- Run these queries one by one

-- Step 1: Check if you're admin
SELECT 
  email, 
  role, 
  user_id 
FROM profiles 
WHERE user_id = auth.uid();

-- Step 2: If role is NOT 'admin', make yourself admin (replace email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Step 3: Verify the is_admin() function works
SELECT public.is_admin();
-- Should return TRUE

-- Step 4: Check if you can see orders directly
SELECT 
  o.id,
  o.status,
  o.total_amount,
  o.created_at,
  p.email as customer_email
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.user_id
ORDER BY o.created_at DESC;

-- If Step 4 works, the issue is with the app, not the database
-- If Step 4 doesn't work, run the full FIX_ADMIN_ORDERS.sql
