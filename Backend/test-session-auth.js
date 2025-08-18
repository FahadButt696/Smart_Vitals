// Test session-based authentication
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000';

// Test cases for session-based authentication
const testCases = [
  {
    name: 'Water API with userId',
    url: `${API_BASE_URL}/api/water?userId=test_user_123`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Water API without userId',
    url: `${API_BASE_URL}/api/water`,
    method: 'GET',
    expectedStatus: 400
  },
  {
    name: 'Calorie API with userId',
    url: `${API_BASE_URL}/api/calorie?userId=test_user_123&period=daily`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Calorie API without userId',
    url: `${API_BASE_URL}/api/calorie?period=daily`,
    method: 'GET',
    expectedStatus: 400
  },
  {
    name: 'Meal API with userId',
    url: `${API_BASE_URL}/api/meal?userId=test_user_123`,
    method: 'GET',
    expectedStatus: 200
  },
  {
    name: 'Meal API without userId',
    url: `${API_BASE_URL}/api/meal`,
    method: 'GET',
    expectedStatus: 400
  }
];

async function runTests() {
  console.log('🧪 Testing Session-Based Authentication...\n');
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${testCase.name}`);
      
      const response = await fetch(testCase.url, {
        method: testCase.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const status = response.status;
      const isSuccess = status === testCase.expectedStatus;
      
      if (isSuccess) {
        console.log(`✅ PASS: Expected ${testCase.expectedStatus}, got ${status}`);
        passedTests++;
      } else {
        console.log(`❌ FAIL: Expected ${testCase.expectedStatus}, got ${status}`);
        
        // Try to get error details
        try {
          const errorData = await response.json();
          console.log(`   Error details:`, errorData);
        } catch (e) {
          console.log(`   Could not parse error response`);
        }
      }
      
      console.log(`   URL: ${testCase.url}\n`);
      
    } catch (error) {
      console.log(`❌ ERROR: ${testCase.name} - ${error.message}\n`);
    }
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Session-based authentication is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the authentication setup.');
  }
}

// Run the tests
runTests().catch(console.error);

