console.log('🔍 Testing Simple Route Import...\n');

// Test 1: Import diet plan routes
try {
  console.log('🔍 Importing Diet Plan Routes...');
  const dietPlanRoutes = await import('./routes/dietPlanRoutes.js');
  console.log('✅ Diet Plan Routes imported successfully');
  console.log('Default export type:', typeof dietPlanRoutes.default);
  console.log('Default export:', dietPlanRoutes.default);
} catch (error) {
  console.error('❌ Error importing diet plan routes:', error);
  console.error('Error details:', {
    name: error.name,
    message: error.message,
    stack: error.stack
  });
}

console.log('\n🎉 Simple Import Test Completed');
