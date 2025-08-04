import Workout from '../models/Workout.js';

// Get all workout logs for a user
export const getWorkoutLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const workoutLogs = await Workout.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: workoutLogs
    });
  } catch (error) {
    console.error('Error getting workout logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving workout logs'
    });
  }
};

// Add a new workout log
export const addWorkoutLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const workoutData = {
      ...req.body,
      userId,
      date: req.body.date || new Date()
    };

    const workoutLog = new Workout(workoutData);
    await workoutLog.save();

    res.status(201).json({
      success: true,
      data: workoutLog
    });
  } catch (error) {
    console.error('Error adding workout log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding workout log'
    });
  }
};

// Update a workout log
export const updateWorkoutLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const workoutLog = await Workout.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found'
      });
    }

    res.json({
      success: true,
      data: workoutLog
    });
  } catch (error) {
    console.error('Error updating workout log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating workout log'
    });
  }
};

// Delete a workout log
export const deleteWorkoutLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const workoutLog = await Workout.findOneAndDelete({ _id: id, userId });

    if (!workoutLog) {
      return res.status(404).json({
        success: false,
        message: 'Workout log not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workout log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting workout log'
    });
  }
};

// Get workout statistics
export const getWorkoutStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const workoutLogs = await Workout.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (workoutLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No workout data available for the specified period'
        }
      });
    }

    // Calculate statistics
    const totalWorkouts = workoutLogs.length;
    const totalDuration = workoutLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const avgDuration = totalDuration / totalWorkouts;
    const totalCalories = workoutLogs.reduce((sum, log) => sum + (log.caloriesBurned || 0), 0);
    const avgCalories = totalCalories / totalWorkouts;

    // Workout type distribution
    const workoutTypeStats = {};
    workoutLogs.forEach(log => {
      const type = log.workoutType || 'other';
      workoutTypeStats[type] = (workoutTypeStats[type] || 0) + 1;
    });

    // Weekly frequency
    const weeklyWorkouts = Math.round((totalWorkouts / parseInt(days)) * 7);

    // Generate insights
    const insights = [];
    if (weeklyWorkouts < 3) {
      insights.push('You\'re working out less than the recommended 3-5 times per week. Consider increasing your frequency.');
    } else if (weeklyWorkouts >= 3 && weeklyWorkouts <= 5) {
      insights.push('Great job! You\'re maintaining a healthy workout frequency.');
    } else {
      insights.push('You\'re very active! Make sure to include rest days for recovery.');
    }

    if (avgDuration < 30) {
      insights.push('Your workouts are shorter than recommended. Try to aim for at least 30 minutes per session.');
    }

    res.json({
      success: true,
      data: {
        totalWorkouts,
        totalDuration: Math.round(totalDuration),
        avgDuration: Math.round(avgDuration),
        totalCalories: Math.round(totalCalories),
        avgCalories: Math.round(avgCalories),
        weeklyWorkouts,
        workoutTypeDistribution: workoutTypeStats,
        insights,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting workout stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving workout statistics'
    });
  }
};

 