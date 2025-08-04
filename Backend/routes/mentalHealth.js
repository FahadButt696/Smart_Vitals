import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getMentalHealthLogs,
  addMentalHealthLog,
  updateMentalHealthLog,
  deleteMentalHealthLog,
  getMentalHealthStats
} from '../controllers/mentalHealthController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all mental health logs for a user
router.get('/', getMentalHealthLogs);

// Add a new mental health log
router.post('/', addMentalHealthLog);

// Update a mental health log
router.put('/:id', updateMentalHealthLog);

// Delete a mental health log
router.delete('/:id', deleteMentalHealthLog);

// Get mental health statistics
router.get('/stats', getMentalHealthStats);

export default router; 