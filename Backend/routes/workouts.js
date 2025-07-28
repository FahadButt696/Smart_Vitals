import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import Workout from '../models/Workout.js';

const router = express.Router();

// @desc    Get all workouts for user
// @route   GET /api/workouts
// @access  Private
router.get('/', authenticateUser, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: workouts.length,
      data: workouts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
router.post('/', authenticateUser, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      userId: req.user.id
    });

    await workout.save();

    res.status(201).json({
      success: true,
      data: workout
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 