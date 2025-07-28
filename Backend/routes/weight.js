import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import WeightLog from '../models/WeightLog.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const logs = await WeightLog.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const log = new WeightLog({ ...req.body, userId: req.user.id });
    await log.save();
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 