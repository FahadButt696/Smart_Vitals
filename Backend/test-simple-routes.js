import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test routes
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

app.get('/api/diet-plan', (req, res) => {
  res.json({ message: 'Diet plan route working (no auth)' });
});

app.get('/api/user/me', (req, res) => {
  res.json({ message: 'User route working (no auth)' });
});

const PORT = 5003;
app.listen(PORT, () => {
  console.log(`Simple test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log(`  GET http://localhost:${PORT}/test`);
  console.log(`  GET http://localhost:${PORT}/api/diet-plan`);
  console.log(`  GET http://localhost:${PORT}/api/user/me`);
});

console.log('✅ Server created successfully');
console.log('✅ Routes defined successfully');
console.log('✅ Server listening on port', PORT);
