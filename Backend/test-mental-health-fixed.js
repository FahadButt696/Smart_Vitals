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

// Test the mental health chatbot
app.post('/test-chat', async (req, res) => {
  try {
    const testMessage = {
      userId: "test123",
      message: "I'm feeling a bit anxious today"
    };
    
    console.log('Testing mental health chatbot with message:', testMessage);
    
    // This would normally call the actual controller
    res.json({ 
      message: 'Test endpoint ready',
      testData: testMessage,
      endpoints: {
        chat: 'POST /api/mental-health/chat',
        history: 'GET /api/mental-health/chat/:userId',
        clear: 'DELETE /api/mental-health/chat/:userId',
        insights: 'GET /api/mental-health/insights/:userId'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
  console.log('Test endpoint: http://localhost:3001/test');
  console.log('Test chat endpoint: http://localhost:3001/test-chat');
  console.log('Mental health endpoints:');
  console.log('  - POST http://localhost:3001/api/mental-health/chat');
  console.log('  - GET http://localhost:3001/api/mental-health/chat/:userId');
  console.log('  - DELETE http://localhost:3001/api/mental-health/chat/:userId');
  console.log('  - GET http://localhost:3001/api/mental-health/insights/:userId');
});
