import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import mealRoutes from './routes/mealRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkAuthMiddleware } from './middleware/clerkMiddleWare.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use("/uploads", express.static("uploads"));


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
