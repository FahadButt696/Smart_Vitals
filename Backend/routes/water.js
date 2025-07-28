import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import WaterIntake from '../models/WaterIntake.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const intakes = await WaterIntake.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, count: intakes.length, data: intakes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const intake = new WaterIntake({ ...req.body, userId: req.user.id });
    await intake.save();
    res.status(201).json({ success: true, data: intake });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 