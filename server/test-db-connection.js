// Test MongoDB connection
require('dotenv').config();
const { connectDB } = require('./config/db');

async function testConnection() {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📝 MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'NOT FOUND');
    console.log('📝 Full MONGO_URI:', process.env.MONGO_URI);

    const connected = await connectDB();

    if (connected) {
        console.log('✅ Connection test PASSED');
        process.exit(0);
    } else {
        console.log('❌ Connection test FAILED');
        process.exit(1);
    }
}

testConnection();
