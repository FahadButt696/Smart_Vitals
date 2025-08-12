import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Test diet plan route
app.get('/api/diet-plan', (req, res) => {
  res.json({ message: 'Diet plan route working' });
});

// Test user route
app.get('/api/user/me', (req, res) => {
  res.json({ message: 'User route working' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log(`  GET http://localhost:${PORT}/test`);
  console.log(`  GET http://localhost:${PORT}/api/diet-plan`);
  console.log(`  GET http://localhost:${PORT}/api/user/me`);
});
