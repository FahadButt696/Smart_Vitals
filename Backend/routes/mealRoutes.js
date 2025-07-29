import express from 'express';
import { addMeal } from '../controllers/mealController.js';
import {requireAuth} from '@clerk/express';
// import { requireAuth } from '../middleware/clerkAuthMiddleware.js';

const router = express.Router();

router.post('/add', addMeal);

export default router;
