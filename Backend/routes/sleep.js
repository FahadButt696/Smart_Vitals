import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getSleepLogs,
  addSleepLog,
  updateSleepLog,
  deleteSleepLog,
  getSleepStats
} from '../controllers/sleepController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all sleep logs for a user
router.get('/', getSleepLogs);

// Add a new sleep log
router.post('/', addSleepLog);

// Update a sleep log
router.put('/:id', updateSleepLog);

// Delete a sleep log
router.delete('/:id', deleteSleepLog);

// Get sleep statistics
router.get('/stats', getSleepStats);

export default router; 