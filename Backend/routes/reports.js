import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import HealthReport from '../models/HealthReport.js';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  try {
    const reports = await HealthReport.find({ userId: req.user.id }).sort({ 'dateRange.startDate': -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {
    const report = new HealthReport({ ...req.body, userId: req.user.id });
    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 