import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Clerk Middleware Initialization...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set');
console.log('CLERK_PUBLISHABLE_KEY:', process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test Clerk middleware creation
try {
  console.log('\n🔍 Testing Clerk Middleware Creation...');
  
  const clerkAuthMiddleware = requireAuth({
    unauthorized: (req, res) => {
      return res.status(401).json({ message: 'Unauthorized' });
    },
    onError: (err, req, res) => {
      console.error('Clerk auth error:', err);
      return res.status(500).json({ message: 'Authentication error' });
    }
  });
  
  console.log('✅ Clerk Middleware Created Successfully');
  console.log('Middleware type:', typeof clerkAuthMiddleware);
  
  // Test if it's a function
  if (typeof clerkAuthMiddleware === 'function') {
    console.log('✅ Middleware is a valid function');
  } else {
    console.log('❌ Middleware is not a function');
  }
  
} catch (error) {
  console.error('❌ Error creating Clerk middleware:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
}

console.log('\n🎉 Clerk Middleware Test Completed');
