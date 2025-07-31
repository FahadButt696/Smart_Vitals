// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import compression from 'compression';
// import morgan from 'morgan';
// import rateLimit from 'express-rate-limit';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Import database connection
// import connectDB from './config/database.js';

// // Import routes
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// import workoutRoutes from './routes/workouts.js';
// import mealRoutes from './routes/meals.js';
// import calorieRoutes from './routes/calories.js';
// import weightRoutes from './routes/weight.js';
// import waterRoutes from './routes/water.js';
// import sleepRoutes from './routes/sleep.js';
// import dietRoutes from './routes/diet.js';
// import symptomRoutes from './routes/symptoms.js';
// import mentalHealthRoutes from './routes/mentalHealth.js';
// import reportRoutes from './routes/reports.js';

// // Import middleware
// import { errorHandler } from './middleware/errorHandler.js';
// import { notFound } from './middleware/notFound.js';

// // Load environment variables
// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://your-frontend-domain.com'] 
//     : ['http://localhost:5173', 'http://localhost:3000'],
//   credentials: true
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Compression middleware
// app.use(compression());

// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // Static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Smart Vitals API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/workouts', workoutRoutes);
// app.use('/api/meals', mealRoutes);
// app.use('/api/calories', calorieRoutes);
// app.use('/api/weight', weightRoutes);
// app.use('/api/water', waterRoutes);
// app.use('/api/sleep', sleepRoutes);
// app.use('/api/diet', dietRoutes);
// app.use('/api/symptoms', symptomRoutes);
// app.use('/api/mental-health', mentalHealthRoutes);
// app.use('/api/reports', reportRoutes);

// // Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Smart Vitals API Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV}`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
// });

// export default app; 




// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import mealRoutes from "./routes/mealRoutes.js";
// import cors from "cors";
// import morgan from "morgan";
// import clerkWebhook from './routes/clerkWebhook.js';

// dotenv.config();



// const app = express();

// app.use('/api/clerk', clerkWebhook);
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// connectDB();

// // Routes
// app.use("/api/meals", mealRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mealRoutes from './routes/mealRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { requireAuth } from '@clerk/express';

dotenv.config();
connectDB();

const app = express();

app.use(requireAuth())
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended:false} ));

app.use(cors());
app.use(express.json());
app.use("/api/meal", mealRoutes)
app.use("api/user",requireAuth(), userRoutes)

// Routes
// app.use('/api/protected', protectedRoutes);

app.get('/', (req, res) => {
  res.send('Server is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
