const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // If no external MongoDB is available, use in-memory server
    if (!uri || uri.includes('localhost')) {
      try {
        // Try connecting to the provided URI first
        if (uri) {
          await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
          console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
          return;
        }
      } catch {
        // Fall through to memory server
      }

      console.log('📦 Starting MongoDB Memory Server...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`📦 MongoDB Memory Server started`);
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const getMongoServer = () => mongoServer;

module.exports = connectDB;
module.exports.getMongoServer = getMongoServer;
