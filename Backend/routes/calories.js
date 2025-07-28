import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import CalorieGoal from '../models/CalorieGoal.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const goals = await CalorieGoal.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const goal = new CalorieGoal({ ...req.body, userId: req.user.id });
    await goal.save();
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 