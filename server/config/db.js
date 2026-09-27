const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      console.log('Connecting to configured MongoDB URI...');
      await mongoose.connect(uri);
      console.log('MongoDB Connected successfully to:', mongoose.connection.host);
      return;
    }

    // Fallback to local MongoDB memory server if no URI provided
    console.log('No MONGODB_URI found. Initializing built-in local MongoDB server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to Local MongoDB at:', uri);
    console.log('Tip: You can set MONGODB_URI in server/.env to use MongoDB Atlas if preferred.');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error during database disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
