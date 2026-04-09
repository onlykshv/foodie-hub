# Backend Setup Instructions

## Step 1: Apply Database Migration to Supabase Cloud

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/eazbvrghadxpkqxuqayh
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/20260123092410_1858d200-487c-4531-b2d2-ddc627c5cfed.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

You should see a success message. This will create:
- All database tables (profiles, food_categories, food_items, orders, order_items)
- Row Level Security policies
- Sample data (6 categories + 15 food items)

## Step 2: Verify the Setup

After running the migration, verify in your Supabase dashboard:

1. Go to **Table Editor** - you should see 5 tables
2. Click on `food_items` - you should see 15 sample items
3. Click on `food_categories` - you should see 6 categories

## Step 3: Test Authentication

The migration includes a trigger that automatically creates a profile when a user signs up.

Default test accounts (you'll need to create these in Supabase Auth):
- Admin: `admin@foodhub.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

Or just register a new account through the app!

## Step 4: Run the Frontend

Once the migration is applied, the app will automatically connect to your Supabase backend:

```bash
npm run dev
```

The app will use the credentials from `.env` file.

## Troubleshooting

If you get authentication errors:
- Check that your Supabase URL and keys in `.env` are correct
- Make sure email confirmation is disabled in Supabase Auth settings (for development)

If you get RLS policy errors:
- Make sure the migration ran successfully
- Check the Supabase logs in the dashboard
