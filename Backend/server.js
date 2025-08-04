import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mealRoutes from './routes/mealRoutes.js'
import userRoutes from './routes/userRoutes.js'
import calorieRoutes from './routes/calories.js';
import weightRoutes from './routes/weight.js';
import waterRoutes from './routes/water.js';
import sleepRoutes from './routes/sleep.js';
import workoutRoutes from './routes/workouts.js';
import mentalHealthRoutes from './routes/mentalHealth.js';
import symptomRoutes from './routes/symptoms.js';
import dietRoutes from './routes/diet.js';
import reminderRoutes from './routes/reminders.js';
import chatRoutes from './routes/chat.js';
import voiceAssistantRoutes from './routes/voiceAssistant.js';
import dashboardRoutes from './routes/dashboard.js';
import { clerkAuthMiddleware } from './middleware/clerkMiddleWare.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Routes
app.use("/api/meal", mealRoutes);
app.use("/api/user", userRoutes);
app.use("/api/calories", calorieRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/mental-health", mentalHealthRoutes);
app.use("/api/symptoms", symptomRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/voice-assistant", voiceAssistantRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Smart Vitals API Server is running...');
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
