# 🍔 FoodHub - Food Ordering & Kitchen Management System

## Backend Architecture Documentation

This document explains the complete backend architecture so you can build it with your preferred stack (Node.js/Express, Django, Spring Boot, etc.).

---

## 📊 Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   auth.users    │       │    profiles     │       │  food_categories│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────▶│ user_id (FK)    │       │ id (PK)         │
│ email           │       │ id (PK)         │       │ name            │
│ password_hash   │       │ full_name       │       │ description     │
│ created_at      │       │ email           │       │ image_url       │
└─────────────────┘       │ role (enum)     │       │ created_at      │
                          │ phone           │       └────────┬────────┘
                          │ address         │                │
                          │ created_at      │                │
                          │ updated_at      │                ▼
                          └─────────────────┘       ┌─────────────────┐
                                                    │   food_items    │
┌─────────────────┐       ┌─────────────────┐       ├─────────────────┤
│     orders      │       │   order_items   │       │ id (PK)         │
├─────────────────┤       ├─────────────────┤       │ name            │
│ id (PK)         │──────▶│ order_id (FK)   │       │ description     │
│ user_id (FK)    │       │ id (PK)         │       │ price           │
│ status (enum)   │       │ food_item_id(FK)│◀──────│ image_url       │
│ total_amount    │       │ food_item_name  │       │ category_id(FK) │
│ delivery_address│       │ quantity        │       │ is_available    │
│ phone           │       │ unit_price      │       │ preparation_time│
│ notes           │       │ subtotal        │       │ created_at      │
│ created_at      │       │ created_at      │       │ updated_at      │
│ updated_at      │       └─────────────────┘       └─────────────────┘
└─────────────────┘
```

---

## 📋 Database Tables

### 1. Users Table (Authentication)
```sql
-- Most frameworks have built-in auth. If building from scratch:
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. User Roles Enum
```sql
CREATE TYPE user_role AS ENUM ('customer', 'admin');
```

### 3. Order Status Enum
```sql
CREATE TYPE order_status AS ENUM ('placed', 'preparing', 'ready', 'delivered');
```

### 4. Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Food Categories Table
```sql
CREATE TABLE food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Food Items Table
```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES food_categories(id) ON DELETE SET NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  preparation_time INTEGER DEFAULT 15, -- in minutes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL DEFAULT 'placed',
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 8. Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
  food_item_name VARCHAR(255) NOT NULL, -- Denormalized for history
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication

1. **Register**: Hash password with bcrypt, create user + profile
2. **Login**: Verify password, return JWT token
3. **Protected Routes**: Verify JWT in Authorization header

### Role-Based Access Control

| Resource | Customer | Admin |
|----------|----------|-------|
| View Menu | ✅ | ✅ |
| Place Order | ✅ | ✅ |
| View Own Orders | ✅ | ✅ |
| View All Orders | ❌ | ✅ |
| Update Order Status | ❌ | ✅ |
| CRUD Food Items | ❌ | ✅ |
| CRUD Categories | ❌ | ✅ |

### Middleware Example (Express.js)
```javascript
// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin middleware
const requireAdmin = async (req, res, next) => {
  const profile = await db.profiles.findOne({ user_id: req.user.id });
  if (profile.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

---

## 🛣️ API Endpoints

### Authentication APIs

```
POST /api/auth/register
Body: { email, password, fullName }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user, profile }
```

### Food Categories APIs

```
GET /api/categories
Response: [{ id, name, description, image_url }]

POST /api/categories (Admin only)
Body: { name, description, image_url }
Response: { id, name, ... }

PUT /api/categories/:id (Admin only)
Body: { name, description, image_url }
Response: { id, name, ... }

DELETE /api/categories/:id (Admin only)
Response: { success: true }
```

### Food Items APIs

```
GET /api/food-items
Query: ?category_id=xxx&available=true
Response: [{ id, name, price, category, ... }]

GET /api/food-items/:id
Response: { id, name, price, category, ... }

POST /api/food-items (Admin only)
Body: { name, description, price, category_id, image_url, is_available, preparation_time }
Response: { id, name, ... }

PUT /api/food-items/:id (Admin only)
Body: { name, description, price, ... }
Response: { id, name, ... }

DELETE /api/food-items/:id (Admin only)
Response: { success: true }
```

### Orders APIs

```
GET /api/orders
Headers: Authorization: Bearer <token>
Response: [{ id, status, total_amount, items: [...], ... }]
Note: Returns user's orders only, or all orders for admin

GET /api/orders/:id
Headers: Authorization: Bearer <token>
Response: { id, status, total_amount, items: [...], ... }

POST /api/orders
Headers: Authorization: Bearer <token>
Body: {
  items: [{ food_item_id, quantity }],
  delivery_address,
  phone,
  notes
}
Response: { id, status: 'placed', ... }

PATCH /api/orders/:id/status (Admin only)
Body: { status: 'preparing' | 'ready' | 'delivered' }
Response: { id, status, ... }
Note: Must validate status transitions!
```

---

## 🔄 Order Status Lifecycle

```
┌─────────┐     ┌───────────┐     ┌─────────┐     ┌───────────┐
│ PLACED  │────▶│ PREPARING │────▶│  READY  │────▶│ DELIVERED │
└─────────┘     └───────────┘     └─────────┘     └───────────┘
```

### Valid Transitions (Enforce in Backend!)

```javascript
const validTransitions = {
  'placed': ['preparing'],
  'preparing': ['ready'],
  'ready': ['delivered'],
  'delivered': [] // Terminal state
};

function canTransition(currentStatus, newStatus) {
  return validTransitions[currentStatus]?.includes(newStatus);
}
```

---

## 📡 Real-Time Updates (WebSocket/SSE)

For real-time order notifications:

### Option 1: WebSocket (Socket.io)
```javascript
// Server
io.on('connection', (socket) => {
  socket.on('join-admin', () => socket.join('admin-room'));
  socket.on('join-customer', (userId) => socket.join(`customer-${userId}`));
});

// When order created
io.to('admin-room').emit('new-order', order);

// When order status updated
io.to(`customer-${order.user_id}`).emit('order-updated', order);
```

### Option 2: Server-Sent Events (SSE)
```javascript
app.get('/api/orders/stream', authenticate, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Subscribe to order events
  orderEmitter.on('update', sendEvent);
  
  req.on('close', () => {
    orderEmitter.off('update', sendEvent);
  });
});
```

---

## 🏗️ Backend Folder Structure (Node.js/Express Example)

```
backend/
├── config/
│   └── database.js        # DB connection
│   └── auth.js            # JWT config
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   ├── foodItemController.js
│   └── orderController.js
├── middleware/
│   ├── authenticate.js    # JWT verification
│   ├── requireAdmin.js    # Admin check
│   └── validateRequest.js # Input validation
├── models/
│   ├── User.js
│   ├── Profile.js
│   ├── FoodCategory.js
│   ├── FoodItem.js
│   ├── Order.js
│   └── OrderItem.js
├── routes/
│   ├── auth.js
│   ├── categories.js
│   ├── foodItems.js
│   └── orders.js
├── utils/
│   └── statusTransitions.js
├── app.js
├── server.js
└── .env
```

---

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/foodhub
# or for PostgreSQL:
# DATABASE_URL=postgresql://user:pass@localhost:5432/foodhub

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

---

## 📦 Recommended Packages

### Node.js/Express
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",        // MongoDB
    "pg": "^8.11.0",             // PostgreSQL
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "socket.io": "^4.6.0",
    "express-validator": "^7.0.0"
  }
}
```

---

## 🎯 Key Implementation Notes

1. **Password Security**: Always hash passwords with bcrypt (min 10 rounds)
2. **Status Validation**: Never trust client for status transitions - validate on server
3. **Denormalization**: Store `food_item_name` in order_items for historical accuracy
4. **Soft Deletes**: Consider soft-deleting food items instead of hard delete
5. **Indexing**: Add indexes on `user_id`, `status`, `category_id` for performance
6. **Rate Limiting**: Protect auth endpoints from brute force attacks

---

## 🚀 Quick Start Commands

```bash
# Initialize project
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv

# Create folder structure
mkdir -p config controllers middleware models routes utils

# Start server
node server.js
```

Good luck building your backend! 🎉
