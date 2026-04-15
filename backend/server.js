require('dotenv').config();

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible to routes via app
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Admin joins admin room for real-time order notifications
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log(`👑 Admin joined admin-room: ${socket.id}`);
  });

  // Customer joins their own room for order updates
  socket.on('join-customer', (userId) => {
    socket.join(`customer-${userId}`);
    console.log(`👤 Customer ${userId} joined their room: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Auto-seed if database is empty (only happens on first run)
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('\n📦 Database is empty — running first-time seed...');
      const seedDB = require('./seedHelper');
      await seedDB();
    } else {
      console.log(`   Existing data found: ${userCount} users in database`);
    }

    server.listen(PORT, () => {
      console.log(`\n🚀 FoodHub Backend Server`);
      console.log(`   ├─ HTTP:      http://localhost:${PORT}`);
      console.log(`   ├─ API:       http://localhost:${PORT}/api`);
      console.log(`   ├─ Health:    http://localhost:${PORT}/api/health`);
      console.log(`   ├─ Socket.io: ws://localhost:${PORT}`);
      console.log(`   └─ Frontend:  ${process.env.FRONTEND_URL || 'http://localhost:8080'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
