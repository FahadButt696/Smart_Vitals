import express from 'express';
import { clerkAuthMiddleware } from './middleware/clerkMiddleWare.js';

console.log('🔍 Testing route registration...');

// Test the middleware
try {
  console.log('✅ Clerk middleware imported successfully');
  console.log('Middleware type:', typeof clerkAuthMiddleware);
} catch (error) {
  console.error('❌ Error importing clerk middleware:', error);
}

// Test basic route creation
const testRouter = express.Router();
testRouter.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

console.log('✅ Test router created successfully');
console.log('Router type:', typeof testRouter);

console.log('🎉 Route debug test completed');
