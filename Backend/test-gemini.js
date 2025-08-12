import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

console.log('Testing Gemini API...');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

const testGeminiAPI = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log('Gemini model created successfully');
    
    const prompt = "Hello, how are you? Please respond with a short, friendly message.";
    console.log('Sending prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('Gemini API Response:');
    console.log(response);
    console.log('API call successful!');
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
};

testGeminiAPI();
