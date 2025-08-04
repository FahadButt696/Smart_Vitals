import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getDashboardData
} from '../controllers/dashboardController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get dashboard overview data
router.get('/', getDashboardData);

export default router; 