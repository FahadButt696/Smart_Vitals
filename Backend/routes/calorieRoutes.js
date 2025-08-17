import express from 'express';
import { 
  getCalorieData, 
  getCalorieGoals, 
  updateCalorieGoals, 
  getCalorieInsights 
} from '../controllers/calorieController.js';

const router = express.Router();

// Get calorie data for different time periods
router.get('/', getCalorieData);

// Get calorie goals for a user
router.get('/goals', getCalorieGoals);

// Update calorie goals for a user
router.put('/goals', updateCalorieGoals);

// Get calorie insights and recommendations
router.get('/insights', getCalorieInsights);

export default router;

