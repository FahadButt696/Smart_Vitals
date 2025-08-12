import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testGeminiConnection = async () => {
  console.log('🔍 Testing Gemini API Connection...');
  console.log('Environment check:');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please check your .env file and ensure GEMINI_API_KEY is set');
    return;
  }

  // List of models to try
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro", 
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`\n🔄 Testing model: ${modelName}`);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      console.log('✅ Gemini AI initialized successfully');
      
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log('✅ Model retrieved successfully');
      
      console.log('🔄 Testing simple generation...');
      const prompt = "Hello! Please respond with 'Gemini API is working correctly' and nothing else.";
      
      const result = await model.generateContent(prompt);
      console.log('✅ Content generation successful');
      
      if (result && result.response) {
        const response = result.response;
        let text = '';
        
        // Handle different response formats
        if (response.text) {
          text = response.text();
        } else if (response.candidates && response.candidates[0] && response.candidates[0].content) {
          text = response.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Unexpected response format');
        }
        
        console.log('📝 Response received:', text);
        console.log(`✅ Gemini API is working correctly with model: ${modelName}!`);
        console.log(`💡 Use this model in your controller: ${modelName}`);
        return; // Exit on success
      } else {
        throw new Error('Invalid response structure');
      }
      
    } catch (error) {
      console.log(`❌ Model ${modelName} failed:`, error.message);
      
      if (error.message.includes('API_KEY_INVALID')) {
        console.log('💡 Solution: Check if your GEMINI_API_KEY is correct');
        return; // Exit on auth error
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        console.log('💡 Solution: Check your Gemini API quota usage');
        return; // Exit on quota error
      }
      
      // Continue to next model if this one fails
      continue;
    }
  }
  
  console.log('\n❌ All models failed. Please check your API configuration.');
};

// Run the test
testGeminiConnection().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed with unexpected error:', error);
  process.exit(1);
});
