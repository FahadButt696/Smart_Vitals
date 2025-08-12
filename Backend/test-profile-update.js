import fetch from 'node-fetch';

// Test the profile update API
async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update API...\n');

    // Test 1: Check if the server is running
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch('http://localhost:5000/');
    console.log('Health check status:', healthResponse.status);
    console.log('Health check response:', await healthResponse.text());
    console.log('');

    // Test 2: Check if user routes are accessible
    console.log('2️⃣ Testing user routes accessibility...');
    try {
      const userRoutesResponse = await fetch('http://localhost:5000/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('User routes status:', userRoutesResponse.status);
      console.log('User routes response:', await userRoutesResponse.text());
    } catch (error) {
      console.log('User routes error (expected without valid token):', error.message);
    }
    console.log('');

    // Test 3: Check the update endpoint specifically
    console.log('3️⃣ Testing update endpoint structure...');
    try {
      const updateResponse = await fetch('http://localhost:5000/api/user/update', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: 'Test User',
          age: 25
        })
      });
      console.log('Update endpoint status:', updateResponse.status);
      console.log('Update endpoint response:', await updateResponse.text());
    } catch (error) {
      console.log('Update endpoint error (expected without valid token):', error.message);
    }
    console.log('');

    console.log('✅ Profile Update API test completed!');
    console.log('\n📋 Analysis:');
    console.log('- If health check returns 200, server is running');
    console.log('- If user routes return 401, authentication is working');
    console.log('- If update endpoint returns 401, the route exists and is protected');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testProfileUpdate();
