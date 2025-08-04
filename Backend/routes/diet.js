import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getDietPlans,
  addDietPlan,
  updateDietPlan,
  deleteDietPlan,
  generateDietPlan,
  generateAIMealPlan
} from '../controllers/dietController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all diet plans for a user
router.get('/', getDietPlans);

// Add a new diet plan
router.post('/', addDietPlan);

// Update a diet plan
router.put('/:id', updateDietPlan);

// Delete a diet plan
router.delete('/:id', deleteDietPlan);

// Generate AI diet plan
router.post('/generate', generateDietPlan);

// Generate AI meal plan
router.post('/generate-ai', generateAIMealPlan);

export default router; 