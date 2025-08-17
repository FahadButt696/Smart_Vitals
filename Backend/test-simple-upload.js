import dotenv from 'dotenv';
import { uploadImage } from './utils/cloudinaryUtils.js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Simple Cloudinary Upload...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Test with a simple image buffer (1x1 pixel PNG)
const createTestImage = () => {
  // Create a minimal 1x1 pixel PNG buffer for testing
  const pngBuffer = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width: 1
    0x00, 0x00, 0x00, 0x01, // height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // compressed data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return pngBuffer;
};

// Test upload
console.log('\n📤 Testing Image Upload...');
try {
  const testImageBuffer = createTestImage();
  console.log('📁 Test image created, size:', testImageBuffer.length, 'bytes');
  
  const result = await uploadImage(testImageBuffer, 'image/png', 'smart-vitals/test');
  console.log('✅ Upload successful!');
  console.log('🌐 URL:', result.url);
  console.log('🆔 Public ID:', result.publicId);
  console.log('📏 Dimensions:', result.width, 'x', result.height);
  console.log('💾 Size:', result.size, 'bytes');
  
} catch (error) {
  console.error('❌ Upload failed:', error.message);
  
  if (error.message.includes('Invalid signature')) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your CLOUDINARY_API_SECRET');
    console.log('2. Verify your CLOUDINARY_API_KEY');
    console.log('3. Ensure your CLOUDINARY_CLOUD_NAME is correct');
  } else if (error.message.includes('Invalid API key')) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your CLOUDINARY_API_KEY');
    console.log('2. Verify your CLOUDINARY_CLOUD_NAME');
  } else if (error.message.includes('cloud_name')) {
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your CLOUDINARY_CLOUD_NAME');
    console.log('2. Verify the cloud name in your Cloudinary dashboard');
  }
}

console.log('\n🎯 Next Steps:');
console.log('1. If upload succeeds, your Cloudinary setup is working!');
console.log('2. Test the full API with: POST /api/meal/detect');
console.log('3. Check server logs for detailed debugging information');

