import express from 'express';
import mentalHealthRoutes from './routes/mentalHealthRoutes.js';

const app = express();
app.use(express.json());

// Test the routes
app.use("/api/mental-health", mentalHealthRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Test the mental health chatbot endpoints
app.get('/test-endpoints', (req, res) => {
  res.json({ 
    message: 'Mental Health Chatbot Test Endpoints',
    endpoints: {
      chat: {
        method: 'POST',
        url: '/api/mental-health/chat',
        body: { userId: 'test123', message: 'I feel anxious today' },
        description: 'Send a message to the chatbot'
      },
      history: {
        method: 'GET',
        url: '/api/mental-health/chat/:userId',
        params: { userId: 'test123' },
        description: 'Get chat history for a user'
      },
      clear: {
        method: 'DELETE',
        url: '/api/mental-health/chat/:userId',
        params: { userId: 'test123' },
        description: 'Clear chat history for a user'
      },
      insights: {
        method: 'GET',
        url: '/api/mental-health/insights/:userId',
        params: { userId: 'test123' },
        description: 'Get conversation insights for a user'
      }
    },
    testData: {
      normalMessage: 'I feel a bit stressed about work today',
      crisisMessage: 'I feel like I want to end it all',
      longMessage: 'A'.repeat(1001) // Message that's too long
    }
  });
});

// Test crisis detection
app.get('/test-crisis-detection', (req, res) => {
  const testMessages = [
    { message: 'I feel a bit stressed about work today', expectedCrisis: false },
    { message: 'I feel like I want to end it all', expectedCrisis: true },
    { message: 'I want to kill myself', expectedCrisis: true },
    { message: 'I feel overwhelmed completely', expectedCrisis: true },
    { message: 'Just having a normal day', expectedCrisis: false }
  ];
  
  res.json({
    message: 'Crisis Detection Test Cases',
    testCases: testMessages,
    note: 'These are test cases to verify crisis detection logic'
  });
});

// Test input validation
app.get('/test-validation', (req, res) => {
  res.json({
    message: 'Input Validation Test Cases',
    validationRules: {
      message: {
        required: true,
        maxLength: 1000,
        trim: true
      },
      userId: {
        required: true,
        type: 'string'
      }
    },
    testCases: {
      validMessage: { userId: 'test123', message: 'Hello' },
      missingMessage: { userId: 'test123' },
      missingUserId: { message: 'Hello' },
      longMessage: { userId: 'test123', message: 'A'.repeat(1001) },
      emptyMessage: { userId: 'test123', message: '' }
    }
  });
});

app.listen(3001, () => {
  console.log('🚀 Comprehensive Test Server running on port 3001');
  console.log('');
  console.log('📋 Test Endpoints:');
  console.log('  - GET  http://localhost:3001/test');
  console.log('  - GET  http://localhost:3001/test-endpoints');
  console.log('  - GET  http://localhost:3001/test-crisis-detection');
  console.log('  - GET  http://localhost:3001/test-validation');
  console.log('');
  console.log('🧠 Mental Health API Endpoints:');
  console.log('  - POST http://localhost:3001/api/mental-health/chat');
  console.log('  - GET  http://localhost:3001/api/mental-health/chat/:userId');
  console.log('  - DELETE http://localhost:3001/api/mental-health/chat/:userId');
  console.log('  - GET  http://localhost:3001/api/mental-health/insights/:userId');
  console.log('');
  console.log('💡 To test the actual chatbot:');
  console.log('  curl -X POST http://localhost:3001/api/mental-health/chat \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"userId": "test123", "message": "I feel anxious today"}\'');
});
