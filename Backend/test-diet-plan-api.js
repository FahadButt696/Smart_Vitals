// test-diet-plan-api.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_BASE_URL = 'http://localhost:5000/api';
const DIET_PLAN_URL = `${API_BASE_URL}/diet-plan`;

const testDietPlanAPI = async () => {
  try {
    console.log('🧪 Testing Diet Plan API endpoints...');
    
    // Test 1: Check if server is running
    console.log('🔍 Testing server connectivity...');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ Server is running');
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error('❌ Server is not running. Please start your backend server first.');
        return;
      }
      console.log('⚠️ Server responded but health endpoint might not exist');
    }
    
    // Test 2: Test diet plan generation endpoint (without auth for now)
    console.log('🔍 Testing diet plan generation endpoint...');
    try {
      const response = await axios.post(`${DIET_PLAN_URL}/generate`, {
        userId: 'test_user_123',
        timeFrame: 'day'
      });
      console.log('✅ Diet plan generation endpoint is accessible');
      console.log('📊 Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Endpoint exists but requires authentication (expected)');
      } else if (error.response?.status === 500) {
        console.log('⚠️ Endpoint exists but has server error - check Spoonacular API key');
        if (error.response?.data?.message) {
          console.log('Error message:', error.response.data.message);
        }
      } else {
        console.error('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }
    
    // Test 3: Test GET endpoint
    console.log('🔍 Testing GET diet plans endpoint...');
    try {
      const response = await axios.get(`${DIET_PLAN_URL}/`);
      console.log('✅ GET endpoint is accessible');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ GET endpoint exists but requires authentication (expected)');
      } else {
        console.error('❌ GET endpoint error:', error.response?.status, error.response?.data);
      }
    }
    
    console.log('🎉 Diet Plan API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing Diet Plan API:', error.message);
  }
};

// Run the test
testDietPlanAPI();
