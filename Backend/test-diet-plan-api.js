// test-diet-plan-api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const DIET_PLAN_URL = `${API_BASE_URL}/diet-plan`;

// Test data
const testUserId = 'test_user_123';
const testTimeFrame = 'day';

async function testDietPlanAPI() {
  console.log('🧪 Testing Diet Plan API Endpoints...\n');

  try {
    // Test 1: Generate Diet Plan
    console.log('1️⃣ Testing Diet Plan Generation...');
    try {
      const generateResponse = await axios.post(`${DIET_PLAN_URL}/generate`, {
        userId: testUserId,
        timeFrame: testTimeFrame
      });
      console.log('✅ Generate Diet Plan:', generateResponse.status);
      console.log('📊 Plan Structure:', Object.keys(generateResponse.data.data.planData));
      console.log('🍽️ Meals Count:', generateResponse.data.data.planData.meals?.length || 0);
      console.log('📈 Nutrients:', generateResponse.data.data.planData.nutrients);
    } catch (error) {
      console.log('❌ Generate Diet Plan Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 2: Get Diet Plans
    console.log('\n2️⃣ Testing Get Diet Plans...');
    try {
      const getResponse = await axios.get(`${DIET_PLAN_URL}/`);
      console.log('✅ Get Diet Plans:', getResponse.status);
      console.log('📚 Plans Count:', getResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Get Diet Plans Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 3: Get Meal Planner Items
    console.log('\n3️⃣ Testing Get Meal Planner Items...');
    try {
      const mealPlannerResponse = await axios.get(`${DIET_PLAN_URL}/mealplanner/items/${testUserId}`);
      console.log('✅ Get Meal Planner Items:', mealPlannerResponse.status);
      console.log('📋 Items Count:', mealPlannerResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Get Meal Planner Items Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 4: Get Shopping List
    console.log('\n4️⃣ Testing Get Shopping List...');
    try {
      const shoppingListResponse = await axios.get(`${DIET_PLAN_URL}/shopping-list/${testUserId}`);
      console.log('✅ Get Shopping List:', shoppingListResponse.status);
      console.log('🛒 Shopping Items Count:', shoppingListResponse.data.data?.length || 0);
    } catch (error) {
      console.log('❌ Get Shopping List Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 5: Get Recipe Information (if we have a recipe ID)
    console.log('\n5️⃣ Testing Get Recipe Information...');
    try {
      const recipeId = 12345; // Test recipe ID
      const recipeResponse = await axios.get(`${DIET_PLAN_URL}/recipes/${recipeId}/information`);
      console.log('✅ Get Recipe Information:', recipeResponse.status);
      console.log('📖 Recipe Title:', recipeResponse.data.data?.title);
    } catch (error) {
      console.log('❌ Get Recipe Information Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API Testing Complete!');

  } catch (error) {
    console.error('💥 Test Suite Error:', error.message);
  }
}

// Run tests
testDietPlanAPI();




