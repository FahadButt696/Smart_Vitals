import fetch from 'node-fetch';

const testMentalHealthAPI = async () => {
  try {
    console.log('Testing Mental Health API...');
    
    // Test the health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/mental-health/test');
    console.log('Health endpoint status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health endpoint response:', healthData);
    }
    
    // Test the chat endpoint
    const chatResponse = await fetch('http://localhost:5000/api/mental-health/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'test123',
        message: 'I am feeling sad today'
      }),
    });
    
    console.log('Chat endpoint status:', chatResponse.status);
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('Chat endpoint response:', chatData);
      console.log('Reply received:', chatData.reply ? 'Yes' : 'No');
      console.log('Is fallback:', chatData.isFallback);
      console.log('Reason:', chatData.reason);
    } else {
      const errorText = await chatResponse.text();
      console.error('Chat endpoint error:', errorText);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testMentalHealthAPI();
