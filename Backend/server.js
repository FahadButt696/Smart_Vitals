import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mealRoutes from './routes/mealRoutes.js'
import userRoutes from './routes/userRoutes.js'
import waterRoutes from './routes/waterRoutes.js'
import sleepRoutes from './routes/sleepRoutes.js'
import weightRoutes from './routes/weightRoutes.js'
import workoutRoutes from './routes/workoutRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import symptomCheckRoutes from './routes/symptomCheckRoutes.js'
import mentalHealthRoutes from './routes/mentalHealthRoutes.js'
import dietPlanRoutes from './routes/dietPlanRoutes.js'
import aiRecommendationRoutes from './routes/aiRecommendationRoutes.js'
import clerkWebhookRoutes from './routes/clerkWebhook.js'
import calorieRoutes from './routes/calorieRoutes.js'
import { clerkAuthMiddleware } from './middleware/clerkMiddleWare.js';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');
console.log('MONGODB_URI:', process.env.CONN_STRING ? 'Set' : 'Not set');
console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set');

// Initialize Clerk
if (!process.env.CLERK_SECRET_KEY) {
  console.warn('⚠️ CLERK_SECRET_KEY is not set in environment variables - using test key for development');
  process.env.CLERK_SECRET_KEY = 'test_clerk_secret_key_for_development';
}

// Set default MongoDB connection for development if not provided
if (!process.env.CONN_STRING) {
  console.warn('⚠️ CONN_STRING is not set - using default local MongoDB for development');
  process.env.CONN_STRING = 'mongodb://localhost:27017/smart_vitals';
}

connectDB();

// Import and start cron jobs
import './cron/aiRecommendationCron.js';
console.log('🚀 AI recommendation cron job started (runs every 3 days)');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));

// CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://your-frontend-domain.vercel.app", // Replace with your actual Vercel domain
    "https://your-frontend-domain.netlify.app"  // Replace with your actual Netlify domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Routes
console.log("Registering routes...");

try {
  app.use("/api/meal", mealRoutes);
  console.log("✅ Meal routes registered");
} catch (error) {
  console.error("❌ Error registering meal routes:", error);
}

try {
  app.use("/api/user", userRoutes);
  console.log("✅ User routes registered");
} catch (error) {
  console.error("❌ Error registering user routes:", error);
}

try {
  app.use("/api/water", waterRoutes);
  console.log("✅ Water routes registered");
} catch (error) {
  console.error("❌ Error registering water routes:", error);
}

try {
  app.use("/api/sleep", sleepRoutes);
  console.log("✅ Sleep routes registered");
} catch (error) {
  console.error("❌ Error registering sleep routes:", error);
}

try {
  app.use("/api/weight", weightRoutes);
  console.log("✅ Weight routes registered");
} catch (error) {
  console.error("❌ Error registering weight routes:", error);
}

try {
  app.use("/api/workout", workoutRoutes);
  console.log("✅ Workout routes registered");
} catch (error) {
  console.error("❌ Error registering workout routes:", error);
}

try {
  app.use("/api/contact", contactRoutes);
  console.log("✅ Contact routes registered");
} catch (error) {
  console.error("❌ Error registering contact routes:", error);
}

try {
  app.use("/api/symptom-check", symptomCheckRoutes);
  console.log("✅ Symptom check routes registered");
} catch (error) {
  console.error("❌ Error registering symptom check routes:", error);
}

try {
  app.use("/api/diet-plan", dietPlanRoutes);
  console.log("✅ Diet plan routes registered");
} catch (error) {
  console.error("❌ Error registering diet plan routes:", error);
}

try {
  app.use("/api/ai-recommendations", aiRecommendationRoutes);
  console.log("✅ AI recommendation routes registered");
} catch (error) {
  console.error("❌ Error registering AI recommendation routes:", error);
}

try {
  app.use("/api/clerk", clerkWebhookRoutes);
  console.log("✅ Clerk webhook routes registered");
} catch (error) {
  console.error("❌ Error registering clerk webhook routes:", error);
}

try {
  app.use("/api/calorie", calorieRoutes);
  console.log("✅ Calorie routes registered");
} catch (error) {
  console.error("❌ Error registering calorie routes:", error);
}

// Debug mental health routes
console.log("Registering mental health routes...");
try {
  app.use("/api/mental-health", mentalHealthRoutes);
  console.log("Mental health routes registered successfully");
} catch (error) {
  console.error("Error registering mental health routes:", error);
}

// Debug route
app.get("/api/mental-health/test", (req, res) => {
  res.json({ message: "Mental health route is working" });
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Vitals API Server is running...',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Railway health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Smart Vitals API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
