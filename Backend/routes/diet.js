import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import DietPlan from '../models/DietPlan.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const plans = await DietPlan.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const plan = new DietPlan({ ...req.body, userId: req.user.id });
    await plan.save();
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 