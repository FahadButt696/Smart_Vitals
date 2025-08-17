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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173", 
      "http://localhost:5174",
      "https://smart-vitals.vercel.app",
      "https://smartvitals.vercel.app",
      "https://smart-vitals-git-main.vercel.app",
      "https://smart-vitals-git-develop.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For mobile devices, be more permissive
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Log blocked origins for debugging
    console.log(`🚫 Blocked origin: ${origin}`);
    return callback(null, true); // Temporarily allow all for mobile debugging
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Add mobile-specific middleware
app.use((req, res, next) => {
  // Add mobile-friendly headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Add mobile debugging info
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  if (isMobile) {
    console.log(`📱 Mobile request: ${req.method} ${req.path} from ${req.ip}`);
    console.log(`📱 User-Agent: ${userAgent}`);
  }
  
  next();
});

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
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  res.json({ 
    message: 'Smart Vitals API Server is running...',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mobile: isMobile,
    userAgent: userAgent
  });
});

// Railway health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mobile-specific health check
app.get('/mobile-health', (req, res) => {
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  res.json({
    status: 'healthy',
    mobile: isMobile,
    userAgent: userAgent,
    timestamp: new Date().toISOString(),
    cors: {
      origin: req.get('Origin') || 'No origin',
      method: req.method,
      headers: req.headers
    }
  });
});

// Test endpoint for mobile debugging
app.get('/api/test-mobile', (req, res) => {
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  res.json({
    message: 'Mobile test endpoint working',
    mobile: isMobile,
    userAgent: userAgent,
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.get('Origin'),
      referer: req.get('Referer'),
      'user-agent': userAgent
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  console.error('🚨 Error occurred:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: userAgent,
    isMobile: isMobile,
    timestamp: new Date().toISOString()
  });
  
  // Mobile-specific error handling
  if (isMobile) {
    console.log(`📱 Mobile error on ${req.method} ${req.path}`);
    
    // For mobile, provide more detailed error info
    res.status(500).json({ 
      message: 'Mobile request failed', 
      error: err.message,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
      mobile: true
    });
  } else {
    // Standard error response for desktop
    res.status(500).json({ 
      message: 'Something went wrong!', 
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Smart Vitals API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
