import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Test server is running...');
});

console.log('🔍 Testing Route Registration...\n');

// Test 1: Import and register diet plan routes
try {
  console.log('🔍 Importing Diet Plan Routes...');
  const dietPlanRoutes = await import('./routes/dietPlanRoutes.js');
  console.log('✅ Diet Plan Routes imported');
  
  console.log('🔍 Registering Diet Plan Routes...');
  app.use("/api/diet-plan", dietPlanRoutes.default);
  console.log('✅ Diet Plan Routes registered');
} catch (error) {
  console.error('❌ Error with diet plan routes:', error);
}

// Test 2: Import and register user routes
try {
  console.log('\n🔍 Importing User Routes...');
  const userRoutes = await import('./routes/userRoutes.js');
  console.log('✅ User Routes imported');
  
  console.log('🔍 Registering User Routes...');
  app.use("/api/user", userRoutes.default);
  console.log('✅ User Routes registered');
} catch (error) {
  console.error('❌ Error with user routes:', error);
}

// Test 3: Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

const PORT = 5004;
app.listen(PORT, () => {
  console.log(`\n🎉 Test server running on port ${PORT}`);
  console.log('Test endpoints:');
  console.log(`  GET http://localhost:${PORT}/`);
  console.log(`  GET http://localhost:${PORT}/test`);
  console.log(`  GET http://localhost:${PORT}/api/diet-plan`);
  console.log(`  GET http://localhost:${PORT}/api/user/me`);
});

console.log('\n✅ Server created successfully');
console.log('✅ Routes imported and registered');
console.log('✅ Server listening on port', PORT);
