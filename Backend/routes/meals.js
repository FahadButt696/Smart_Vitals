import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import Meal from '../models/Meal.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, count: meals.length, data: meals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const meal = new Meal({ ...req.body, userId: req.user.id });
    await meal.save();
    res.status(201).json({ success: true, data: meal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 