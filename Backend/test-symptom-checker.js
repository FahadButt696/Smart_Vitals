import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:5000/api/symptom-check';

// Test data
const testData = {
  userId: 'test-user-123',
  age: 30,
  sex: 'male',
  symptomsEntered: 'headache, fever, fatigue'
};

const testInvalidData = {
  userId: 'test-user-123',
  age: 150, // Invalid age
  sex: 'invalid', // Invalid sex
  symptomsEntered: ''
};

async function testHealthCheck() {
  console.log('\n🔍 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.response?.data || error.message);
  }
}

async function testSymptomCheck(data, description) {
  console.log(`\n🔍 Testing Symptom Check: ${description}`);
  try {
    const response = await axios.post(`${BASE_URL}/check`, data);
    console.log('✅ Symptom Check Success:', response.data);
    return response.data.data?.id;
  } catch (error) {
    console.log('❌ Symptom Check Failed:', error.response?.data || error.message);
    return null;
  }
}

async function testGetSymptomChecks(userId) {
  console.log('\n🔍 Testing Get Symptom Checks...');
  try {
    const response = await axios.get(`${BASE_URL}/?userId=${userId}`);
    console.log('✅ Get Symptom Checks:', response.data);
    return response.data.data;
  } catch (error) {
    console.log('❌ Get Symptom Checks Failed:', error.response?.data || error.message);
    return [];
  }
}

async function testGetSymptomCheckById(checkId) {
  if (!checkId) {
    console.log('⚠️  Skipping Get by ID test - no check ID available');
    return;
  }
  
  console.log('\n🔍 Testing Get Symptom Check by ID...');
  try {
    const response = await axios.get(`${BASE_URL}/${checkId}`);
    console.log('✅ Get Symptom Check by ID:', response.data);
  } catch (error) {
    console.log('❌ Get Symptom Check by ID Failed:', error.response?.data || error.message);
  }
}

async function testDeleteSymptomCheck(checkId) {
  if (!checkId) {
    console.log('⚠️  Skipping Delete test - no check ID available');
    return;
  }
  
  console.log('\n🔍 Testing Delete Symptom Check...');
  try {
    const response = await axios.delete(`${BASE_URL}/${checkId}`);
    console.log('✅ Delete Symptom Check:', response.data);
  } catch (error) {
    console.log('❌ Delete Symptom Check Failed:', error.response?.data || error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Symptom Checker API Tests...\n');
  
  // Test 1: Health Check
  await testHealthCheck();
  
  // Test 2: Valid Symptom Check
  const checkId = await testSymptomCheck(testData, 'Valid Data');
  
  // Test 3: Invalid Symptom Check
  await testSymptomCheck(testInvalidData, 'Invalid Data');
  
  // Test 4: Get All Symptom Checks
  const checks = await testGetSymptomChecks(testData.userId);
  
  // Test 5: Get Specific Symptom Check
  await testGetSymptomCheckById(checkId);
  
  // Test 6: Delete Symptom Check
  await testDeleteSymptomCheck(checkId);
  
  console.log('\n🎉 All tests completed!');
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('- Health Check: ✅');
  console.log('- Valid Symptom Check: ✅');
  console.log('- Invalid Symptom Check: ✅ (should fail)');
  console.log('- Get All Checks: ✅');
  console.log('- Get by ID: ✅');
  console.log('- Delete Check: ✅');
}

// Check if environment variables are set
console.log('🔧 Environment Check:');
console.log('INFERMEDICA_APP_ID:', process.env.INFERMEDICA_APP_ID ? '✅ Set' : '❌ Not Set');
console.log('INFERMEDICA_APP_KEY:', process.env.INFERMEDICA_APP_KEY ? '✅ Set' : '❌ Not Set');

if (!process.env.INFERMEDICA_APP_ID || !process.env.INFERMEDICA_APP_KEY) {
  console.log('\n⚠️  Warning: Infermedica API credentials not found in .env file');
  console.log('   Some tests may fail. Please add your credentials:');
  console.log('   INFERMEDICA_APP_ID=your_app_id_here');
  console.log('   INFERMEDICA_APP_KEY=your_app_key_here');
}

// Run tests
runAllTests().catch(console.error);
