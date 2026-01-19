const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5001/api';
const TEST_EMAIL = `test${Date.now()}@example.com`; // Unique email
const TEST_PASSWORD = 'password123';
const TEST_USER = {
    name: 'Test User',
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    roomNumber: '101',
    hostelBlock: 'A',
    phoneNumber: '1234567890'
};

async function runTests() {
    console.log('🚀 Starting CRUD Operations Test...\n');

    let token = null;
    let userId = null;
    let laundryId = null;

    // 1. CREATE USER (Register)
    try {
        console.log('1️⃣  Testing CREATE USER (Signup)...');
        const signupRes = await axios.post(`${BASE_URL}/auth/signup`, TEST_USER);
        if (signupRes.status === 201) {
            console.log('   ✅ User created successfully:', signupRes.data.email);
            // Assuming signup returns token, but let's explicit login to test that too
        }
    } catch (error) {
        console.error('   ❌ Signup Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }

    // 2. READ (Login - Get Token)
    try {
        console.log('2️⃣  Testing LOGIN (Authentication)...');
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: TEST_EMAIL,
            password: TEST_PASSWORD
        });
        if (loginRes.status === 200) {
            token = loginRes.data.token;
            console.log('   ✅ Login successful. Token received.');
        }
    } catch (error) {
        console.error('   ❌ Login Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    // 3. CREATE LAUNDRY REQUEST
    try {
        console.log('3️⃣  Testing CREATE LAUNDRY REQUEST...');
        const laundryData = {
            clothes: [
                { itemType: 'T-Shirt', quantity: 2 },
                { itemType: 'Jeans', quantity: 1 }
            ],
            specialInstructions: 'Wash carefully'
        };
        const createRes = await axios.post(`${BASE_URL}/laundry`, laundryData, config);
        if (createRes.status === 201) {
            laundryId = createRes.data._id;
            console.log('   ✅ Laundry Request created with ID:', laundryId);
        }
    } catch (error) {
        console.error('   ❌ Create Laundry Failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }

    // 4. READ LAUNDRY (Get My Laundry)
    try {
        console.log('4️⃣  Testing READ LAUNDRY (Get My Laundry)...');
        const getRes = await axios.get(`${BASE_URL}/laundry`, config);
        if (getRes.status === 200) {
            const myRequests = getRes.data;
            const found = myRequests.find(r => r._id === laundryId);
            if (found) {
                console.log('   ✅ Created request found in list.');
                console.log(`      Status: ${found.status}, Items: ${found.clothes.length}`);
            } else {
                console.error('   ❌ Created request NOT found in list.');
            }
        }
    } catch (error) {
        console.error('   ❌ Read Laundry Failed:', error.response ? error.response.data : error.message);
    }

    // 5. UPDATE LAUNDRY STATUS
    try {
        console.log('5️⃣  Testing UPDATE LAUNDRY STATUS...');
        const updateData = { status: 'in_progress' };
        const updateRes = await axios.put(`${BASE_URL}/laundry/${laundryId}`, updateData, config);
        if (updateRes.status === 200) {
            console.log('   ✅ Status updated to:', updateRes.data.status);
        }
    } catch (error) {
        console.error('   ❌ Update Status Failed:', error.response ? error.response.data : error.message);
    }

    // 6. VERIFY UPDATE
    try {
        console.log('6️⃣  Verifying Update...');
        // We can inspect the response from step 5, or fetch again.
        // Let's fetch all laundry (if we were admin) or just fetch mine again?
        // Let's just rely on step 5's response or fetch mine again.
        const verifyRes = await axios.get(`${BASE_URL}/laundry`, config);
        const found = verifyRes.data.find(r => r._id === laundryId);
        if (found && found.status === 'in_progress') {
            console.log('   ✅ Verification Successful: Status is now "in_progress" in DB.');
        } else {
            console.log('   ❌ Verification Failed: Status mismatch.');
        }

    } catch (error) {
        console.error('   ❌ Verification Failed:', error.response ? error.response.data : error.message);
    }

    // 7. DELETE LAUNDRY
    try {
        console.log('7️⃣  Testing DELETE LAUNDRY...');
        const deleteRes = await axios.delete(`${BASE_URL}/laundry/${laundryId}`, config);
        if (deleteRes.status === 200) {
            console.log('   ✅ Laundry request deleted successfully.');
        }
    } catch (error) {
        console.error('   ❌ Delete Laundry Failed:', error.response ? error.response.data : error.message);
    }

    // 8. VERIFY DELETION
    try {
        console.log('8️⃣  Verifying Deletion...');
        const verifyDelRes = await axios.get(`${BASE_URL}/laundry`, config);
        const found = verifyDelRes.data.find(r => r._id === laundryId);
        if (!found) {
            console.log('   ✅ Verification Successful: Request no longer exists in list.');
        } else {
            console.log('   ❌ Verification Failed: Request still exists.');
        }

    } catch (error) {
        console.error('   ❌ Verification Failed:', error.response ? error.response.data : error.message);
    }

    console.log('\n✨ CRUD Testing Completed.');
}

runTests();
