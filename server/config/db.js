const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in environment variables');
      console.log('💡 Please create a .env file with MONGO_URI=your_mongodb_connection_string');
      console.log('⚠️  Server will start but database operations will fail until MongoDB is configured');
      return false;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 Please check your MONGO_URI in .env file');
    console.log('⚠️  Server will start but database operations will fail until MongoDB is connected');
    isConnected = false;
    return false;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
  isConnected = false;
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
  isConnected = true;
});

const checkConnection = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

module.exports = { connectDB, checkConnection };
