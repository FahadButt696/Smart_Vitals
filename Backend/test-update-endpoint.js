import fetch from 'node-fetch';

// Test the update endpoint specifically
async function testUpdateEndpoint() {
  try {
    console.log('🧪 Testing Update Endpoint...\n');

    // Test 1: Check if the update endpoint is accessible
    console.log('1️⃣ Testing update endpoint accessibility...');
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

    // Test 2: Check if the route order is correct by testing other endpoints
    console.log('2️⃣ Testing route order...');
    try {
      const meResponse = await fetch('http://localhost:5000/api/user/me', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      console.log('/me endpoint status:', meResponse.status);
      console.log('/me endpoint response:', await meResponse.text());
    } catch (error) {
      console.log('/me endpoint error (expected without valid token):', error.message);
    }
    console.log('');

    console.log('✅ Update endpoint test completed!');
    console.log('\n📋 Analysis:');
    console.log('- If update endpoint returns 401, the route exists and is protected (GOOD)');
    console.log('- If /me endpoint returns 401, the route exists and is protected (GOOD)');
    console.log('- If both return 404, there are still routing issues (BAD)');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testUpdateEndpoint();
