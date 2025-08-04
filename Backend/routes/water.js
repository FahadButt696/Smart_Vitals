import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getWaterLogs,
  addWaterLog,
  updateWaterLog,
  deleteWaterLog,
  getWaterStats
} from '../controllers/waterController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all water logs for a user
router.get('/', getWaterLogs);

// Add a new water log
router.post('/', addWaterLog);

// Update a water log
router.put('/:id', updateWaterLog);

// Delete a water log
router.delete('/:id', deleteWaterLog);

// Get water statistics
router.get('/stats', getWaterStats);

export default router; 