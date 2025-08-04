import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getCalorieData,
  setCalorieGoal,
  getCalorieInsights
} from '../controllers/calorieController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get calorie data for a specific date
router.get('/', getCalorieData);

// Set calorie goals
router.post('/goals', setCalorieGoal);

// Get AI insights for calorie tracking
router.get('/insights', getCalorieInsights);

export default router; 