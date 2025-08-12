import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Clerk middleware
const clerkAuthMiddleware = requireAuth({
  unauthorized: (req, res) => {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

// Test route without auth
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Test diet plan route with auth
app.get('/api/diet-plan', clerkAuthMiddleware, (req, res) => {
  res.json({ message: 'Diet plan route working' });
});

// Test user route with auth
app.get('/api/user/me', clerkAuthMiddleware, (req, res) => {
  res.json({ message: 'User route working' });
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log(`  GET http://localhost:${PORT}/test (no auth)`);
  console.log(`  GET http://localhost:${PORT}/api/diet-plan (with auth)`);
  console.log(`  GET http://localhost:${PORT}/api/user/me (with auth)`);
  console.log('\nEnvironment check:');
  console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set');
  console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set');
});
