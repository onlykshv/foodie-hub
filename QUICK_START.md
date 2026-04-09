# 🚀 Quick Start Guide

## What We Just Set Up

✅ Supabase client configuration  
✅ Real API service (replaced mock data)  
✅ Authentication with Supabase Auth  
✅ Real-time order updates  
✅ All hooks updated to use real backend  

## Next Steps

### 1. Apply Database Migration

**Go to Supabase Dashboard:**
1. Visit: https://supabase.com/dashboard/project/eazbvrghadxpkqxuqayh
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire content from: `supabase/migrations/20260123092410_1858d200-487c-4531-b2d2-ddc627c5cfed.sql`
5. Paste and click **Run**

This creates all tables, security policies, and sample data (15 food items + 6 categories).

### 2. Configure Supabase Auth Settings (Important!)

For development, disable email confirmation:

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Click on **Email** provider
3. **Disable** "Confirm email" (so you can test without email verification)
4. Click **Save**

### 3. Create Admin User (Optional)

You can either:

**Option A: Register through the app** (will be a customer by default)

**Option B: Create admin via SQL:**
```sql
-- First register a user through the app, then run this to make them admin:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 4. Run the App

```bash
cd foodie-hub-main
npm install  # if you haven't already
npm run dev
```

Open http://localhost:5173

## Testing the App

### As Customer:
1. Register a new account
2. Browse the menu (should see 15 items)
3. Add items to cart
4. Place an order
5. View your orders

### As Admin:
1. Make your account admin (see step 3 above)
2. Go to `/admin`
3. View all orders
4. Update order status (placed → preparing → ready → delivered)
5. Manage food items (add/edit/delete)

## Features Now Working

✅ **Authentication**: Real Supabase auth with JWT  
✅ **Food Menu**: Fetched from database  
✅ **Shopping Cart**: Persisted in localStorage  
✅ **Orders**: Stored in database with order items  
✅ **Admin Dashboard**: Manage orders and food items  
✅ **Real-time Updates**: Order changes update automatically  
✅ **Row Level Security**: Users can only see their own orders  

## Troubleshooting

### "Invalid credentials" error
- Make sure you registered the account first
- Check email/password are correct

### "Profile not found" error
- The trigger might not have run
- Check if the profile was created in the `profiles` table
- Try logging out and back in

### No food items showing
- Make sure the migration ran successfully
- Check the `food_items` table in Supabase dashboard
- Should have 15 items

### RLS policy errors
- Make sure you're logged in
- Check that the migration created all policies
- View Supabase logs for details

### Real-time not working
- Check browser console for connection errors
- Verify Supabase Realtime is enabled in project settings
- Go to Database → Replication and enable realtime for `orders` table

## What's Different from Mock Data?

| Feature | Mock | Real Backend |
|---------|------|--------------|
| Data persistence | localStorage only | PostgreSQL database |
| Authentication | Fake login | Supabase Auth (JWT) |
| Security | None | Row Level Security |
| Real-time | Polling | Supabase Realtime |
| Multi-user | No | Yes |
| Production ready | No | Yes |

## Next Enhancements

- [ ] Add image upload for food items (Supabase Storage)
- [ ] Email notifications for orders
- [ ] Payment integration
- [ ] Order history with filters
- [ ] Analytics dashboard
- [ ] Customer reviews/ratings

Need help? Check the logs in Supabase Dashboard → Logs
