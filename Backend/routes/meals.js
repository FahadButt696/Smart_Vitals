import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  getMealStats,
  processMealImage
} from '../controllers/mealController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all meals for a user
router.get('/', getMeals);

// Add a new meal
router.post('/', addMeal);

// Process meal image for AI recognition
router.post('/image', processMealImage);

// Update a meal
router.put('/:id', updateMeal);

// Delete a meal
router.delete('/:id', deleteMeal);

// Get meal statistics
router.get('/stats', getMealStats);

export default router; 