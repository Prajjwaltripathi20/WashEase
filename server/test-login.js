// Test login endpoint with database connection check
require('dotenv').config();
const axios = require('axios');

async function testLogin() {
    console.log('🧪 Testing login endpoint...\n');

    try {
        // First check server health
        console.log('1️⃣ Checking server health...');
        const healthResponse = await axios.get('http://localhost:5001/');
        console.log('   ✅ Server status:', healthResponse.data.status);
        console.log('   ✅ Database status:', healthResponse.data.database);
        console.log('');

        // Try to login (this will fail with invalid credentials, but should NOT show database error)
        console.log('2️⃣ Testing login endpoint...');
        try {
            await axios.post('http://localhost:5001/api/auth/login', {
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        } catch (error) {
            if (error.response) {
                console.log('   Status:', error.response.status);
                console.log('   Message:', error.response.data.message);

                if (error.response.status === 503) {
                    console.log('   ❌ FAIL: Still getting database connection error!');
                    process.exit(1);
                } else if (error.response.status === 401) {
                    console.log('   ✅ PASS: Got authentication error (expected for invalid credentials)');
                    console.log('   ✅ Database connection check is working correctly!');
                }
            } else {
                console.log('   ❌ Network error:', error.message);
                process.exit(1);
            }
        }

        console.log('\n✅ All tests passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testLogin();
