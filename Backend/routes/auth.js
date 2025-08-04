import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import User from '../models/User.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create or update user profile
// @route   POST /api/auth/profile
// @access  Private
router.post('/profile', async (req, res) => {
  try {
    const { userId } = req.auth;
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      height,
      weight,
      activityLevel,
      fitnessGoals,
      medicalConditions,
      allergies,
      preferences
    } = req.body;

    let user = await User.findOne({ clerkId: userId });

    if (user) {
      // Update existing user
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.gender = gender || user.gender;
      user.height = height || user.height;
      user.weight = weight || user.weight;
      user.activityLevel = activityLevel || user.activityLevel;
      user.fitnessGoals = fitnessGoals || user.fitnessGoals;
      user.medicalConditions = medicalConditions || user.medicalConditions;
      user.allergies = allergies || user.allergies;
      user.preferences = preferences || user.preferences;

      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId: userId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        height,
        weight,
        activityLevel,
        fitnessGoals,
        medicalConditions,
        allergies,
        preferences
      });

      await user.save();
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 