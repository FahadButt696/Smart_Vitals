import dotenv from 'dotenv';
import cloudinary from './config/cloudinary.js';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Cloudinary Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Test Cloudinary connection
console.log('\n🔗 Testing Cloudinary Connection...');
try {
  const result = await cloudinary.api.ping();
  console.log('✅ Cloudinary connection successful:', result);
  
  // Test configuration
  console.log('\n📋 Cloudinary Configuration:');
  console.log('Cloud Name:', cloudinary.config().cloud_name);
  console.log('API Key:', cloudinary.config().api_key ? '✅ Set' : '❌ Missing');
  console.log('API Secret:', cloudinary.config().api_secret ? '✅ Set' : '❌ Missing');
  
} catch (error) {
  console.error('❌ Cloudinary connection failed:', error.message);
  
  if (error.message.includes('Invalid signature')) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your CLOUDINARY_API_SECRET');
    console.log('2. Verify your CLOUDINARY_API_KEY');
    console.log('3. Ensure your CLOUDINARY_CLOUD_NAME is correct');
  } else if (error.message.includes('Invalid API key')) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your CLOUDINARY_API_KEY');
    console.log('2. Verify your CLOUDINARY_CLOUD_NAME');
  }
}

console.log('\n🎯 Next Steps:');
console.log('1. If all tests pass, your Cloudinary setup is ready!');
console.log('2. If there are errors, check your .env file and Cloudinary credentials');
console.log('3. Test image upload with: POST /api/meals/detect');

