import express from 'express';
import mentalHealthRoutes from './routes/mentalHealthRoutes.js';

const app = express();
app.use(express.json());

// Test the routes
app.use("/api/mental-health", mentalHealthRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
  console.log('Test endpoint: http://localhost:3001/test');
  console.log('Mental health endpoint: http://localhost:3001/api/mental-health/chat/test123');
});
