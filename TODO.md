# 📋 Setup Checklist

## ⚡ Required Steps (Do These Now!)

### [ ] 1. Apply Database Migration
**Time: 2 minutes**

1. Open: https://supabase.com/dashboard/project/eazbvrghadxpkqxuqayh
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open file: `supabase/migrations/20260123092410_1858d200-487c-4531-b2d2-ddc627c5cfed.sql`
5. Copy ALL the content
6. Paste into SQL Editor
7. Click **Run** (or Ctrl+Enter)
8. ✅ Should see "Success. No rows returned"

**What this does:**
- Creates 5 database tables
- Sets up security policies
- Adds 6 food categories
- Adds 15 food items
- Creates triggers for auto-profile creation

---

### [ ] 2. Disable Email Confirmation
**Time: 1 minute**

1. In Supabase Dashboard: **Authentication** → **Providers**
2. Click on **Email** provider
3. Find "Confirm email" toggle
4. Turn it **OFF** (for development)
5. Click **Save**

**Why:** So you can test without needing to verify emails

---

### [ ] 3. Run the App
**Time: 30 seconds**

```bash
npm run dev
```

Open: http://localhost:5173

---

## 🧪 Testing Steps

### [ ] 4. Test Customer Flow

1. Click **Register**
2. Create account: `test@example.com` / `password123`
3. Should auto-login after registration
4. Browse menu - should see 15 food items
5. Click a food item → Add to Cart
6. Go to Cart (top right icon)
7. Click Checkout
8. Fill delivery details
9. Place Order
10. Go to Orders page - should see your order

---

### [ ] 5. Test Admin Flow

**First, make yourself admin:**

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this query (replace with your email):
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'test@example.com';
```

**Then test admin features:**

1. Logout and login again
2. Go to: http://localhost:5173/admin
3. Should see Admin Dashboard
4. Click **Orders** - see all orders
5. Click an order → Update status
6. Click **Food Items** - manage menu
7. Try adding a new food item

---

## ✅ Verification Checklist

### [ ] Database Setup
- [ ] Migration ran without errors
- [ ] Can see tables in Supabase Table Editor
- [ ] `food_items` table has 15 rows
- [ ] `food_categories` table has 6 rows

### [ ] Authentication
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can logout
- [ ] Profile created automatically

### [ ] Customer Features
- [ ] Can view food menu
- [ ] Can add items to cart
- [ ] Cart persists on refresh
- [ ] Can place order
- [ ] Can view order history

### [ ] Admin Features
- [ ] Can access /admin route
- [ ] Can see all orders
- [ ] Can update order status
- [ ] Can add/edit/delete food items
- [ ] Real-time updates work

---

## 🐛 Troubleshooting

### Migration fails
- Check you copied the ENTIRE file
- Make sure you're in the right project
- Check Supabase logs

### Can't login
- Make sure email confirmation is disabled
- Check you registered first
- Try different browser/incognito

### No food items showing
- Migration might not have run
- Check `food_items` table in Supabase
- Check browser console for errors

### Admin route shows 404
- Make sure you updated the profile role
- Logout and login again
- Check profile role in database

---

## 🎉 When Everything Works

You should be able to:
- ✅ Register and login
- ✅ See 15 food items in 6 categories
- ✅ Add items to cart
- ✅ Place orders
- ✅ View order history
- ✅ Admin can manage everything
- ✅ Real-time updates work

**Next:** Start customizing the menu, add your own items, and deploy! 🚀
