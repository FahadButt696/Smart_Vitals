import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/mental-health';

// Test data
const testUserId = 'test_user_123';
const testMessage = 'I\'m feeling anxious today and need some help';

async function testMentalHealthAPI() {
  console.log('🧠 Testing Mental Health Chatbot API...\n');

  try {
    // Test 1: Send a message
    console.log('1️⃣ Testing message sending...');
    const sendResponse = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        message: testMessage
      }),
    });

    if (sendResponse.ok) {
      const sendData = await sendResponse.json();
      console.log('✅ Message sent successfully!');
      console.log('Reply:', sendData.reply);
      console.log('Is Crisis:', sendData.isCrisis);
      console.log('Message ID:', sendData.messageId);
    } else {
      const errorData = await sendResponse.json();
      console.log('❌ Failed to send message:', errorData);
    }

    console.log('\n2️⃣ Testing chat history retrieval...');
    const historyResponse = await fetch(`${BASE_URL}/chat/${testUserId}`);
    
    if (historyResponse.ok) {
      const historyData = await historyResponse.json();
      console.log('✅ Chat history retrieved successfully!');
      console.log('Total messages:', historyData.totalMessages);
      console.log('Messages returned:', historyData.messages.length);
      console.log('Has more:', historyData.hasMore);
    } else {
      const errorData = await historyResponse.json();
      console.log('❌ Failed to retrieve chat history:', errorData);
    }

    console.log('\n3️⃣ Testing conversation insights...');
    const insightsResponse = await fetch(`${BASE_URL}/insights/${testUserId}`);
    
    if (insightsResponse.ok) {
      const insightsData = await insightsResponse.json();
      console.log('✅ Conversation insights retrieved successfully!');
      console.log('Insights:', insightsData.insights);
    } else {
      const errorData = await insightsResponse.json();
      console.log('❌ Failed to retrieve insights:', errorData);
    }

    console.log('\n4️⃣ Testing crisis detection...');
    const crisisResponse = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        message: 'I\'m having thoughts of harming myself'
      }),
    });

    if (crisisResponse.ok) {
      const crisisData = await crisisResponse.json();
      console.log('✅ Crisis message handled successfully!');
      console.log('Is Crisis:', crisisData.isCrisis);
      console.log('Crisis Resources:', crisisData.crisisResources);
    } else {
      const errorData = await crisisResponse.json();
      console.log('❌ Failed to handle crisis message:', errorData);
    }

    console.log('\n5️⃣ Testing chat history clearing...');
    const clearResponse = await fetch(`${BASE_URL}/chat/${testUserId}`, {
      method: 'DELETE'
    });
    
    if (clearResponse.ok) {
      const clearData = await clearResponse.json();
      console.log('✅ Chat history cleared successfully!');
      console.log('Clear result:', clearData);
    } else {
      const errorData = await clearResponse.json();
      console.log('❌ Failed to clear chat history:', errorData);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testMentalHealthAPI();
