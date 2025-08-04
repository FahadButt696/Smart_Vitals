import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getWorkoutLogs,
  addWorkoutLog,
  updateWorkoutLog,
  deleteWorkoutLog,
  getWorkoutStats
} from '../controllers/workoutController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all workout logs for a user
router.get('/', getWorkoutLogs);

// Add a new workout log
router.post('/', addWorkoutLog);

// Update a workout log
router.put('/:id', updateWorkoutLog);

// Delete a workout log
router.delete('/:id', deleteWorkoutLog);

// Get workout statistics
router.get('/stats', getWorkoutStats);

export default router; 