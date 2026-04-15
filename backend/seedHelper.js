const User = require('./models/User');
const FoodCategory = require('./models/FoodCategory');
const FoodItem = require('./models/FoodItem');

async function seedDB() {
  console.log('📦 Seeding database with full menu...\n');

  // ============================================
  // 1. Users
  // ============================================
  const admin = new User({
    email: 'admin@foodhub.com',
    password: 'admin123',
    fullName: 'Admin User',
    role: 'admin',
  });
  await admin.save();

  const customer = new User({
    email: 'customer@foodhub.com',
    password: 'customer123',
    fullName: 'Test Customer',
    role: 'customer',
  });
  await customer.save();

  console.log('   ✅ Users created');

  // ============================================
  // 2. Categories
  // ============================================
  const categories = {};

  const catData = [
    { name: 'Burgers', description: 'Juicy handcrafted burgers with premium ingredients', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Pizza', description: 'Wood-fired pizzas with fresh toppings', image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
    { name: 'Drinks', description: 'Refreshing beverages, smoothies and shakes', image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
    { name: 'Continental', description: 'Classic European dishes with a modern twist', image_url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400' },
    { name: 'Combos', description: 'Value meal combos — burger + drink + sides', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
    { name: 'Chinese', description: 'Authentic Indo-Chinese favorites', image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400' },
    { name: 'Desserts', description: 'Delightful sweet treats and cakes', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
    { name: 'Salads', description: 'Fresh, healthy and filling salad bowls', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
    { name: 'Wraps & Rolls', description: 'Stuffed wraps, rolls and shawarmas', image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
    { name: 'Sides & Snacks', description: 'Fries, nuggets, appetizers and more', image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
  ];

  for (const c of catData) {
    const cat = new FoodCategory(c);
    await cat.save();
    categories[c.name] = cat._id;
  }
  console.log(`   ✅ ${catData.length} categories created`);

  // ============================================
  // 3. Food Items — Rich Menu
  // ============================================
  const foodItems = [

    // ─── BURGERS ─────────────────────────────
    { name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce', price: 199, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category_id: categories['Burgers'], preparation_time: 15 },
    { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, onion rings, and pepper jack cheese', price: 249, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', category_id: categories['Burgers'], preparation_time: 18 },
    { name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms, Swiss cheese, and garlic aioli on a brioche bun', price: 229, image_url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400', category_id: categories['Burgers'], preparation_time: 15 },
    { name: 'Spicy Chicken Burger', description: 'Crispy fried chicken with jalapeños, coleslaw, and chipotle mayo', price: 219, image_url: 'https://images.unsplash.com/photo-1525164286253-04e68b9d94c6?w=400', category_id: categories['Burgers'], preparation_time: 15 },
    { name: 'Veggie Burger', description: 'Black bean and quinoa patty with avocado, sprouts, and tahini dressing', price: 189, image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', category_id: categories['Burgers'], preparation_time: 12 },

    // ─── PIZZA ───────────────────────────────
    { name: 'Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil', price: 299, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category_id: categories['Pizza'], preparation_time: 20 },
    { name: 'Pepperoni Supreme', description: 'Loaded with pepperoni, mozzarella, and our signature tomato sauce', price: 349, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', category_id: categories['Pizza'], preparation_time: 22 },
    { name: 'BBQ Chicken Pizza', description: 'Grilled chicken, red onions, cilantro, and smoky BBQ sauce', price: 379, image_url: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400', category_id: categories['Pizza'], preparation_time: 22 },
    { name: 'Farmhouse Veggie Pizza', description: 'Bell peppers, mushrooms, olives, onions, and fresh tomatoes', price: 319, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category_id: categories['Pizza'], preparation_time: 20 },
    { name: 'Paneer Tikka Pizza', description: 'Tandoori paneer, capsicum, onions, and mint chutney drizzle', price: 339, image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', category_id: categories['Pizza'], preparation_time: 22 },

    // ─── DRINKS ──────────────────────────────
    { name: 'Fresh Mango Smoothie', description: 'Blended fresh mango with yogurt and honey', price: 129, image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400', category_id: categories['Drinks'], preparation_time: 5 },
    { name: 'Iced Matcha Latte', description: 'Premium matcha green tea with milk over ice', price: 149, image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400', category_id: categories['Drinks'], preparation_time: 5 },
    { name: 'Classic Cold Coffee', description: 'Chilled coffee blended with ice cream and chocolate syrup', price: 139, image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', category_id: categories['Drinks'], preparation_time: 5 },
    { name: 'Strawberry Milkshake', description: 'Fresh strawberries blended with vanilla ice cream and milk', price: 149, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', category_id: categories['Drinks'], preparation_time: 5 },
    { name: 'Virgin Mojito', description: 'Lime, mint, soda, and a hint of sugar — refreshing and chilled', price: 119, image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', category_id: categories['Drinks'], preparation_time: 5 },

    // ─── CONTINENTAL ─────────────────────────
    { name: 'Grilled Chicken Steak', description: 'Herb-marinated chicken breast grilled to perfection with mashed potatoes and gravy', price: 399, image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', category_id: categories['Continental'], preparation_time: 25 },
    { name: 'Pasta Alfredo', description: 'Creamy white sauce pasta with mushrooms, broccoli, and parmesan', price: 289, image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', category_id: categories['Continental'], preparation_time: 18 },
    { name: 'Fish & Chips', description: 'Beer-battered fish fillets with crispy fries and tartar sauce', price: 349, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', category_id: categories['Continental'], preparation_time: 20 },
    { name: 'Spaghetti Bolognese', description: 'Classic Italian pasta with rich meat sauce and parmesan', price: 319, image_url: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400', category_id: categories['Continental'], preparation_time: 20 },
    { name: 'Mushroom Risotto', description: 'Creamy Arborio rice with wild mushrooms, butter, and fresh herbs', price: 329, image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', category_id: categories['Continental'], preparation_time: 25 },

    // ─── COMBOS ──────────────────────────────
    { name: 'Burger Meal Combo', description: 'Classic Cheeseburger + French Fries + Coke — the perfect meal', price: 349, image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', category_id: categories['Combos'], preparation_time: 18 },
    { name: 'Pizza Combo for 2', description: 'Large Margherita Pizza + Garlic Bread + 2 Drinks', price: 549, image_url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400', category_id: categories['Combos'], preparation_time: 25 },
    { name: 'Family Feast', description: '2 Burgers + 1 Pizza + 4 Drinks + French Fries — serves 4', price: 899, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', category_id: categories['Combos'], preparation_time: 30 },
    { name: 'Snack Attack Combo', description: 'Chicken Wings + Mozzarella Sticks + Onion Rings + Dip', price: 399, image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', category_id: categories['Combos'], preparation_time: 20 },

    // ─── CHINESE ─────────────────────────────
    { name: 'Veg Manchurian', description: 'Crispy vegetable balls in tangy Manchurian sauce', price: 189, image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', category_id: categories['Chinese'], preparation_time: 15 },
    { name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken, eggs, and mixed vegetables', price: 219, image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', category_id: categories['Chinese'], preparation_time: 15 },
    { name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and Indo-Chinese spices', price: 199, image_url: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400', category_id: categories['Chinese'], preparation_time: 15 },
    { name: 'Chilli Paneer', description: 'Crispy paneer cubes tossed in spicy chilli sauce with peppers', price: 229, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', category_id: categories['Chinese'], preparation_time: 18 },
    { name: 'Spring Rolls (6 pcs)', description: 'Crispy rolls stuffed with vegetables, served with sweet chilli dip', price: 149, image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', category_id: categories['Chinese'], preparation_time: 12 },

    // ─── DESSERTS ────────────────────────────
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center, served with vanilla ice cream', price: 199, image_url: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400', category_id: categories['Desserts'], preparation_time: 15 },
    { name: 'New York Cheesecake', description: 'Creamy cheesecake with graham cracker crust and berry compote', price: 179, image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', category_id: categories['Desserts'], preparation_time: 5 },
    { name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone', price: 209, image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category_id: categories['Desserts'], preparation_time: 5 },
    { name: 'Brownie Sundae', description: 'Warm chocolate brownie topped with ice cream, whipped cream, and nuts', price: 189, image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category_id: categories['Desserts'], preparation_time: 8 },
    { name: 'Gulab Jamun (4 pcs)', description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup', price: 129, image_url: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?w=400', category_id: categories['Desserts'], preparation_time: 5 },

    // ─── SALADS ──────────────────────────────
    { name: 'Caesar Salad', description: 'Romaine lettuce, parmesan, croutons, and classic Caesar dressing', price: 199, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', category_id: categories['Salads'], preparation_time: 8 },
    { name: 'Greek Salad', description: 'Cucumber, tomatoes, feta cheese, olives, and oregano vinaigrette', price: 189, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category_id: categories['Salads'], preparation_time: 8 },
    { name: 'Grilled Chicken Salad', description: 'Grilled chicken breast on mixed greens with honey mustard dressing', price: 249, image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400', category_id: categories['Salads'], preparation_time: 10 },

    // ─── WRAPS & ROLLS ──────────────────────
    { name: 'Chicken Shawarma', description: 'Marinated chicken wrapped in pita with garlic sauce and pickles', price: 179, image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', category_id: categories['Wraps & Rolls'], preparation_time: 12 },
    { name: 'Paneer Tikka Wrap', description: 'Tandoori paneer with onions, peppers, and mint chutney in a tortilla', price: 169, image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', category_id: categories['Wraps & Rolls'], preparation_time: 12 },
    { name: 'Falafel Wrap', description: 'Crispy falafel with hummus, tahini, pickled veggies in pita bread', price: 179, image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', category_id: categories['Wraps & Rolls'], preparation_time: 10 },
    { name: 'Egg Roll (2 pcs)', description: 'Flaky paratha rolls stuffed with spiced egg, onions, and green chutney', price: 129, image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', category_id: categories['Wraps & Rolls'], preparation_time: 10 },

    // ─── SIDES & SNACKS ─────────────────────
    { name: 'French Fries', description: 'Crispy golden fries seasoned with salt and herbs', price: 99, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category_id: categories['Sides & Snacks'], preparation_time: 8 },
    { name: 'Mozzarella Sticks (6 pcs)', description: 'Breaded mozzarella sticks with marinara dipping sauce', price: 169, image_url: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?w=400', category_id: categories['Sides & Snacks'], preparation_time: 10 },
    { name: 'Chicken Wings (8 pcs)', description: 'Crispy chicken wings tossed in your choice of buffalo or BBQ sauce', price: 249, image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category_id: categories['Sides & Snacks'], preparation_time: 15 },
    { name: 'Onion Rings', description: 'Beer-battered onion rings, golden fried and served with ranch dip', price: 129, image_url: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', category_id: categories['Sides & Snacks'], preparation_time: 8 },
    { name: 'Garlic Bread (4 pcs)', description: 'Toasted bread with garlic butter, herbs, and melted cheese', price: 119, image_url: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400', category_id: categories['Sides & Snacks'], preparation_time: 8 },
  ];

  for (const item of foodItems) {
    const foodItem = new FoodItem(item);
    await foodItem.save();
  }
  console.log(`   ✅ ${foodItems.length} food items created`);

  // ============================================
  // Summary
  // ============================================
  console.log('\n📋 Seed Summary:');
  console.log(`   Users:      2 (1 admin, 1 customer)`);
  console.log(`   Categories: ${catData.length}`);
  console.log(`   Food Items: ${foodItems.length}`);
  console.log(`\n🔐 Login Credentials:`);
  console.log(`   Admin:    admin@foodhub.com / admin123`);
  console.log(`   Customer: customer@foodhub.com / customer123`);
  console.log('');
}

module.exports = seedDB;
