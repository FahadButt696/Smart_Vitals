import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import HealthReport from '../models/HealthReport.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

router.get('/', async (req, res) => {
  try {
    const { userId } = req.auth;
    const reports = await HealthReport.find({ userId }).sort({ 'dateRange.startDate': -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId } = req.auth;
    const report = new HealthReport({ ...req.body, userId });
    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router; 