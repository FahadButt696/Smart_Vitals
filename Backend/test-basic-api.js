import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/symptom-check';

async function testBasicAPI() {
  console.log('🚀 Testing Basic Symptom Checker API Structure...\n');
  
  // Test 1: Health Check (should fail due to missing credentials, but endpoint should work)
  console.log('🔍 Testing Health Check Endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check Response:', response.data);
  } catch (error) {
    if (error.response?.status === 500 && error.response?.data?.error?.includes('credentials not configured')) {
      console.log('✅ Health Check Endpoint Working (Expected: No credentials configured)');
    } else {
      console.log('❌ Health Check Failed:', error.response?.data || error.message);
    }
  }
  
  // Test 2: Get Symptom Checks (should work)
  console.log('\n🔍 Testing Get Symptom Checks Endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/?userId=test-user`);
    console.log('✅ Get Symptom Checks Response:', response.data);
  } catch (error) {
    console.log('❌ Get Symptom Checks Failed:', error.response?.data || error.message);
  }
  
  // Test 3: Test Invalid Symptom Check (should fail validation)
  console.log('\n🔍 Testing Invalid Symptom Check (Validation)...');
  try {
    const response = await axios.post(`${BASE_URL}/check`, {
      userId: 'test-user',
      // Missing required fields
    });
    console.log('❌ Should have failed validation:', response.data);
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Validation Working (Expected: Missing required fields)');
      console.log('   Error:', error.response.data.error);
    } else {
      console.log('❌ Unexpected Error:', error.response?.data || error.message);
    }
  }
  
  // Test 4: Test Valid Symptom Check (should fail due to missing credentials)
  console.log('\n🔍 Testing Valid Symptom Check (API Credentials)...');
  try {
    const response = await axios.post(`${BASE_URL}/check`, {
      userId: 'test-user',
      age: 30,
      sex: 'male',
      symptomsEntered: 'headache, fever'
    });
    console.log('❌ Should have failed due to missing credentials:', response.data);
  } catch (error) {
    if (error.response?.status === 500 && error.response?.data?.error?.includes('credentials not configured')) {
      console.log('✅ API Structure Working (Expected: No Infermedica credentials configured)');
    } else {
      console.log('❌ Unexpected Error:', error.response?.data || error.message);
    }
  }
  
  console.log('\n🎉 Basic API Structure Test Completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Create a .env file in the Backend folder');
  console.log('2. Add your Infermedica credentials:');
  console.log('   INFERMEDICA_APP_ID=your_app_id_here');
  console.log('   INFERMEDICA_APP_KEY=your_app_key_here');
  console.log('3. Restart the server');
  console.log('4. Run: npm run test-symptom');
}

testBasicAPI().catch(console.error);
