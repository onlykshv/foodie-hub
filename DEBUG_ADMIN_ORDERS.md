# 🐛 Debug: Admin Orders Not Showing

## Step-by-Step Debugging

### Step 1: Logout and Login Again ⚠️ IMPORTANT

After updating your role to admin in the database, you MUST:

1. **Logout** from the app (click your profile → Logout)
2. **Login** again with your admin account
3. Go to `/admin/orders`

The app caches your profile, so it won't know you're admin until you re-login.

---

### Step 2: Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab.

You should see logs like:
```
Current user: your-email@example.com Role: admin
Auth state - isAdmin: true profile: {...}
useAdminOrders - isAdmin: true
Fetching admin orders...
Fetched orders: X orders
```

**What to look for:**

❌ **If you see `Role: customer`**
- Your role wasn't updated in the database
- Run this SQL again:
  ```sql
  UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
  ```
- Then logout and login

❌ **If you see `isAdmin: false`**
- You didn't logout and login after updating the role
- Logout and login again

❌ **If you see `Fetched orders: 0 orders`**
- RLS policies are blocking the query
- Continue to Step 3

✅ **If you see `Fetched orders: X orders` but nothing shows**
- Frontend rendering issue
- Continue to Step 4

---

### Step 3: Check RLS Policies

Run this in Supabase SQL Editor to test if you can query orders:

```sql
-- Make sure you're logged in as admin in the app first!
-- Then run this:

SELECT 
  o.*,
  p.email as customer_email
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.user_id
ORDER BY o.created_at DESC;
```

**If this returns orders:**
- RLS policies are working
- Issue is in the app

**If this returns empty:**
- RLS policies are blocking you
- Run the full `FIX_ADMIN_ORDERS.sql` script

---

### Step 4: Check Network Tab

In Developer Tools, go to the **Network** tab:

1. Refresh the `/admin/orders` page
2. Look for a request to Supabase (should have `supabase.co` in the URL)
3. Click on it
4. Check the **Response** tab

**What to look for:**

❌ **Error response:**
- Check the error message
- Likely RLS policy issue

✅ **Empty array `[]`:**
- No orders in database OR
- RLS blocking the query

✅ **Array with orders:**
- Data is being fetched
- Frontend rendering issue

---

### Step 5: Verify Orders Exist

Run this in Supabase SQL Editor:

```sql
-- Check if orders exist at all
SELECT COUNT(*) as total_orders FROM orders;

-- See all orders
SELECT 
  id,
  status,
  total_amount,
  created_at,
  user_id
FROM orders
ORDER BY created_at DESC;
```

If no orders exist, place a test order as a customer first.

---

### Step 6: Test with RLS Disabled (Temporary!)

**⚠️ ONLY FOR DEBUGGING - DON'T LEAVE THIS IN PRODUCTION**

```sql
-- Temporarily disable RLS
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

Now check if orders show in the app.

**If orders show now:**
- RLS policies are the issue
- Run `FIX_ADMIN_ORDERS.sql`

**Re-enable RLS after testing:**
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
```

---

## Common Issues & Solutions

### Issue 1: "Role: customer" in console
**Solution:** Update role in database, then logout/login

### Issue 2: "isAdmin: false" in console
**Solution:** Logout and login again

### Issue 3: "Fetched orders: 0" but orders exist in DB
**Solution:** RLS policies blocking - run `FIX_ADMIN_ORDERS.sql`

### Issue 4: Console shows orders but UI is empty
**Solution:** Frontend rendering issue - check AdminOrders component

### Issue 5: Network request fails with error
**Solution:** Check Supabase logs in dashboard

---

## Quick Fix Checklist

- [ ] Updated role to 'admin' in database
- [ ] Logged out from app
- [ ] Logged back in
- [ ] Checked browser console for logs
- [ ] Verified `isAdmin: true` in console
- [ ] Checked Network tab for API response
- [ ] Verified orders exist in database
- [ ] Ran `FIX_ADMIN_ORDERS.sql` if needed

---

## Still Not Working?

Share these details:

1. What do you see in the browser console?
2. What does the Network tab show?
3. What does this SQL return?
   ```sql
   SELECT email, role FROM profiles WHERE user_id = auth.uid();
   SELECT COUNT(*) FROM orders;
   ```
