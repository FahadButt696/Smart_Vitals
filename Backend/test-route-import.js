import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Route File Imports...\n');

// Test 1: Import diet plan routes
try {
  console.log('🔍 Testing Diet Plan Routes Import...');
  const dietPlanRoutes = await import('./routes/dietPlanRoutes.js');
  console.log('✅ Diet Plan Routes imported successfully');
  console.log('Routes object:', dietPlanRoutes);
  console.log('Default export:', dietPlanRoutes.default);
} catch (error) {
  console.error('❌ Error importing diet plan routes:', error);
}

// Test 2: Import user routes
try {
  console.log('\n🔍 Testing User Routes Import...');
  const userRoutes = await import('./routes/userRoutes.js');
  console.log('✅ User Routes imported successfully');
  console.log('Routes object:', userRoutes);
  console.log('Default export:', userRoutes.default);
} catch (error) {
  console.error('❌ Error importing user routes:', error);
}

// Test 3: Test basic express router
try {
  console.log('\n🔍 Testing Express Router Creation...');
  const express = await import('express');
  const router = express.default.Router();
  console.log('✅ Express Router created successfully');
  console.log('Router type:', typeof router);
} catch (error) {
  console.error('❌ Error creating express router:', error);
}

console.log('\n🎉 Route Import Test Completed');
