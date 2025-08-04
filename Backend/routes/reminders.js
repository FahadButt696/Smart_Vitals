import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder,
  getDueReminders
} from '../controllers/reminderController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all reminders
router.get('/', getReminders);

// Get due reminders
router.get('/due', getDueReminders);

// Create new reminder
router.post('/', createReminder);

// Update reminder
router.put('/:id', updateReminder);

// Delete reminder
router.delete('/:id', deleteReminder);

// Toggle reminder status
router.patch('/:id/toggle', toggleReminder);

export default router; 