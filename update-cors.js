// Script to update CORS configuration in Railway backend
// Run this after deploying your frontend to Vercel

const FRONTEND_URL = 'https://smart-vitals.vercel.app'; // Your actual Vercel URL

console.log('🔧 Updating CORS Configuration');
console.log('================================');
console.log('');
console.log('📋 Steps to update CORS in Railway:');
console.log('');
console.log('1. Go to Railway Dashboard: https://railway.app');
console.log('2. Open your Smart_Vitals backend project');
console.log('3. Go to Variables tab');
console.log('4. Add new variable:');
console.log(`   Key: FRONTEND_URL`);
console.log(`   Value: ${FRONTEND_URL}`);
console.log('');
console.log('5. Redeploy your backend');
console.log('');
console.log('6. Update your frontend environment variables:');
console.log(`   VITE_API_BASE_URL=https://smartvitals-production.up.railway.app`);
console.log(`   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key`);
console.log(`   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name`);
console.log('');
console.log('✅ CORS will be automatically updated on next deployment');
console.log('');
console.log('🌐 Your URLs:');
console.log(`   Backend: https://smartvitals-production.up.railway.app`);
console.log(`   Frontend: ${FRONTEND_URL}`);
console.log('');
console.log('🚀 Happy deploying!');
