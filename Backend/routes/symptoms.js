import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getSymptomLogs,
  addSymptomLog,
  updateSymptomLog,
  deleteSymptomLog,
  getSymptomStats
} from '../controllers/symptomController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all symptom logs for a user
router.get('/', getSymptomLogs);

// Add a new symptom log
router.post('/', addSymptomLog);

// Update a symptom log
router.put('/:id', updateSymptomLog);

// Delete a symptom log
router.delete('/:id', deleteSymptomLog);

// Get symptom statistics
router.get('/stats', getSymptomStats);

export default router; 