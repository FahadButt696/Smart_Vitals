// Test script for API endpoints
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test user creation (this will fail without auth, but we can see the error)
    console.log('\nTesting user creation endpoint...');
    try {
      const userResponse = await axios.post(`${BASE_URL}/user/create`, {
        fullName: 'Test User',
        email: 'test@example.com',
        age: 25,
        height: { value: 170, unit: 'cm' },
        weight: { value: 70, unit: 'kg' },
        goal: 'Maintain',
        targetWeight: 70,
        activityLevel: 'Moderately active',
        dietaryPreference: 'Normal'
      });
      console.log('✅ User creation test passed:', userResponse.data);
    } catch (error) {
      console.log('❌ User creation test failed (expected without auth):', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testAPI(); 