import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getWeightLogs,
  addWeightLog,
  updateWeightLog,
  deleteWeightLog,
  getWeightStats
} from '../controllers/weightController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all weight logs for a user
router.get('/', getWeightLogs);

// Add a new weight log
router.post('/', addWeightLog);

// Update a weight log
router.put('/:id', updateWeightLog);

// Delete a weight log
router.delete('/:id', deleteWeightLog);

// Get weight statistics
router.get('/stats', getWeightStats);

export default router; 