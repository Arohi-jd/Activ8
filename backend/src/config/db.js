const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    connected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    connected = false;
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⏳ Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
}

module.exports = connectDB;
