require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const FoodCategory = require('./models/FoodCategory');
const FoodItem = require('./models/FoodItem');

const categories = [
  {
    name: 'Burgers',
    description: 'Juicy handcrafted burgers with premium ingredients',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    name: 'Pizza',
    description: 'Wood-fired pizzas with fresh toppings',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    name: 'Sushi',
    description: 'Fresh and authentic Japanese sushi',
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
  },
  {
    name: 'Salads',
    description: 'Fresh and healthy salad options',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
  {
    name: 'Desserts',
    description: 'Delightful sweet treats and desserts',
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
  },
  {
    name: 'Drinks',
    description: 'Refreshing beverages and cocktails',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('\n🌱 Starting database seeding...\n');

    // Clear existing data
    await User.deleteMany({});
    await FoodCategory.deleteMany({});
    await FoodItem.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@foodhub.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
    });
    console.log(`👑 Admin user created: admin@foodhub.com / admin123`);

    // Create a test customer
    const customerUser = await User.create({
      email: 'customer@foodhub.com',
      password: 'customer123',
      fullName: 'Test Customer',
      role: 'customer',
    });
    console.log(`👤 Customer user created: customer@foodhub.com / customer123`);

    // Create categories
    const createdCategories = await FoodCategory.insertMany(categories);
    console.log(`📁 Created ${createdCategories.length} food categories`);

    // Create a map for easy reference
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Create food items
    const foodItems = [
      // Burgers
      {
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
        price: 12.99,
        image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category_id: categoryMap['Burgers'],
        preparation_time: 15,
      },
      {
        name: 'BBQ Bacon Burger',
        description: 'Smoky BBQ sauce, crispy bacon, onion rings, and pepper jack cheese',
        price: 15.99,
        image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
        category_id: categoryMap['Burgers'],
        preparation_time: 18,
      },
      {
        name: 'Mushroom Swiss Burger',
        description: 'Sautéed mushrooms, Swiss cheese, and garlic aioli',
        price: 14.49,
        image_url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee15d?w=400',
        category_id: categoryMap['Burgers'],
        preparation_time: 15,
      },
      // Pizza
      {
        name: 'Margherita Pizza',
        description: 'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil',
        price: 16.99,
        image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        category_id: categoryMap['Pizza'],
        preparation_time: 20,
      },
      {
        name: 'Pepperoni Supreme',
        description: 'Loaded with pepperoni, mozzarella, and our signature tomato sauce',
        price: 18.99,
        image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
        category_id: categoryMap['Pizza'],
        preparation_time: 22,
      },
      // Sushi
      {
        name: 'Salmon Nigiri Set',
        description: 'Fresh Atlantic salmon on seasoned sushi rice, 8 pieces',
        price: 22.99,
        image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
        category_id: categoryMap['Sushi'],
        preparation_time: 15,
      },
      {
        name: 'Dragon Roll',
        description: 'Shrimp tempura, avocado, eel, and spicy mayo',
        price: 19.99,
        image_url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        category_id: categoryMap['Sushi'],
        preparation_time: 20,
      },
      {
        name: 'Rainbow Roll',
        description: 'California roll topped with assorted sashimi',
        price: 21.99,
        image_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400',
        category_id: categoryMap['Sushi'],
        preparation_time: 18,
      },
      // Salads
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce, parmesan, croutons, and classic Caesar dressing',
        price: 10.99,
        image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
        category_id: categoryMap['Salads'],
        preparation_time: 8,
      },
      {
        name: 'Greek Salad',
        description: 'Cucumber, tomatoes, feta, olives, and oregano vinaigrette',
        price: 11.49,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
        category_id: categoryMap['Salads'],
        preparation_time: 8,
      },
      // Desserts
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
        price: 9.99,
        image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
        category_id: categoryMap['Desserts'],
        preparation_time: 15,
      },
      {
        name: 'New York Cheesecake',
        description: 'Creamy cheesecake with graham cracker crust and berry compote',
        price: 8.99,
        image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
        category_id: categoryMap['Desserts'],
        preparation_time: 5,
      },
      {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
        price: 10.49,
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
        category_id: categoryMap['Desserts'],
        preparation_time: 5,
      },
      // Drinks
      {
        name: 'Fresh Mango Smoothie',
        description: 'Blended fresh mango with yogurt and honey',
        price: 6.99,
        image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
        category_id: categoryMap['Drinks'],
        preparation_time: 5,
      },
      {
        name: 'Iced Matcha Latte',
        description: 'Premium matcha green tea with milk over ice',
        price: 5.99,
        image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
        category_id: categoryMap['Drinks'],
        preparation_time: 5,
      },
    ];

    const createdItems = await FoodItem.insertMany(foodItems);
    console.log(`🍔 Created ${createdItems.length} food items`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('📋 Summary:');
    console.log(`   ├─ Users:           2 (1 admin, 1 customer)`);
    console.log(`   ├─ Categories:      ${createdCategories.length}`);
    console.log(`   └─ Food Items:      ${createdItems.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log(`   ├─ Admin:    admin@foodhub.com / admin123`);
    console.log(`   └─ Customer: customer@foodhub.com / customer123\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
