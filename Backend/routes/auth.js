import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ clerkUserId: req.user.id });
    
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
router.post('/profile', authenticateUser, async (req, res) => {
  try {
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

    let user = await User.findOne({ clerkUserId: req.user.id });

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
        clerkUserId: req.user.id,
        email: req.user.email,
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        profilePicture: req.user.profilePicture,
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