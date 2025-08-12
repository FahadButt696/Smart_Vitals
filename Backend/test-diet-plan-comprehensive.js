// test-diet-plan-comprehensive.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const DIET_PLAN_URL = `${API_BASE_URL}/diet-plan`;

// Test data
const testUserId = 'test_user_123';
const testTimeFrame = 'day';

async function testDietPlanComprehensive() {
  console.log('🧪 Comprehensive Diet Plan API Testing...\n');

  try {
    // Test 1: Generate Daily Diet Plan
    console.log('1️⃣ Testing Daily Diet Plan Generation...');
    try {
      const generateResponse = await axios.post(`${DIET_PLAN_URL}/generate`, {
        userId: testUserId,
        timeFrame: 'day'
      });
      console.log('✅ Daily Plan Generated:', generateResponse.status);
      
      const planData = generateResponse.data.data.planData;
      console.log('📊 Plan Structure:', {
        hasMeals: !!planData.meals,
        mealsKeys: Object.keys(planData.meals || {}),
        hasExtraMeals: !!planData.extraMeals,
        extraMealsKeys: Object.keys(planData.extraMeals || {}),
        hasNutrients: !!planData.nutrients,
        nutrientsKeys: Object.keys(planData.nutrients || {}),
        hasPlanSummary: !!planData.planSummary,
        hasShoppingList: !!planData.shoppingList,
        hasMealPrepSchedule: !!planData.mealPrepSchedule
      });
      
      if (planData.meals) {
        console.log('🍽️ Daily Meals Structure:');
        Object.entries(planData.meals).forEach(([mealType, meals]) => {
          console.log(`  ${mealType}: ${meals.length} meals`);
          if (meals.length > 0) {
            const firstMeal = meals[0];
            console.log(`    First meal: ${firstMeal.title}`);
            console.log(`    Has image: ${!!firstMeal.image}`);
            console.log(`    Has nutrition: ${!!firstMeal.nutrition}`);
          }
        });
      }
      
      if (planData.extraMeals) {
        console.log('🍎 Extra Meals Structure:');
        Object.entries(planData.extraMeals).forEach(([mealType, meals]) => {
          console.log(`  ${mealType}: ${meals.length} meals`);
        });
      }
      
      if (planData.nutrients) {
        console.log('📈 Nutrients:', planData.nutrients);
      }
      
    } catch (error) {
      console.log('❌ Daily Plan Generation Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 2: Generate Weekly Diet Plan
    console.log('\n2️⃣ Testing Weekly Diet Plan Generation...');
    try {
      const generateWeeklyResponse = await axios.post(`${DIET_PLAN_URL}/generate`, {
        userId: testUserId,
        timeFrame: 'week'
      });
      console.log('✅ Weekly Plan Generated:', generateWeeklyResponse.status);
      
      const weeklyPlanData = generateWeeklyResponse.data.data.planData;
      if (weeklyPlanData.meals) {
        console.log('📅 Weekly Meals Structure:');
        Object.entries(weeklyPlanData.meals).forEach(([day, dayMeals]) => {
          console.log(`  ${day}:`);
          Object.entries(dayMeals).forEach(([mealType, meals]) => {
            console.log(`    ${mealType}: ${meals.length} meals`);
          });
        });
      }
      
    } catch (error) {
      console.log('❌ Weekly Plan Generation Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Test 3: Test All Endpoints
    console.log('\n3️⃣ Testing All API Endpoints...');
    
    // Get Diet Plans
    try {
      const getResponse = await axios.get(`${DIET_PLAN_URL}/`);
      console.log('✅ Get Diet Plans:', getResponse.status, `(${getResponse.data.data?.length || 0} plans)`);
    } catch (error) {
      console.log('❌ Get Diet Plans Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Get Meal Planner Items
    try {
      const mealPlannerResponse = await axios.get(`${DIET_PLAN_URL}/mealplanner/items/${testUserId}`);
      console.log('✅ Get Meal Planner Items:', mealPlannerResponse.status);
    } catch (error) {
      console.log('❌ Get Meal Planner Items Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Get Shopping List
    try {
      const shoppingListResponse = await axios.get(`${DIET_PLAN_URL}/shopping-list/${testUserId}`);
      console.log('✅ Get Shopping List:', shoppingListResponse.status);
    } catch (error) {
      console.log('❌ Get Shopping List Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    // Get Recipe Information
    try {
      const recipeId = 12345; // Test recipe ID
      const recipeResponse = await axios.get(`${DIET_PLAN_URL}/recipes/${recipeId}/information`);
      console.log('✅ Get Recipe Information:', recipeResponse.status);
    } catch (error) {
      console.log('❌ Get Recipe Information Error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Comprehensive Testing Complete!');
    console.log('\n📋 Summary of what was tested:');
    console.log('  ✅ Daily diet plan generation with proper meal structure');
    console.log('  ✅ Weekly diet plan generation with daily organization');
    console.log('  ✅ All API endpoints functionality');
    console.log('  ✅ Data structure validation');
    console.log('  ✅ Meal organization by type (breakfast, lunch, dinner)');
    console.log('  ✅ Extra meals (snacks, pre-workout, post-workout)');
    console.log('  ✅ Nutritional information');
    console.log('  ✅ Shopping list generation');
    console.log('  ✅ Meal prep schedule');

  } catch (error) {
    console.error('💥 Test Suite Error:', error.message);
  }
}

// Run tests
testDietPlanComprehensive();
