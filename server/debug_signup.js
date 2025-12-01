const axios = require('axios');

const testSignup = async () => {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/signup', {
            name: 'Test User',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            role: 'student',
            hostelBlock: 'A',
            roomNumber: '101'
        });
        console.log('Signup Success:', response.data);
    } catch (error) {
        console.error('Full Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
        }
    }
};

testSignup();
