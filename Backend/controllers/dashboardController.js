import Meal from '../models/Meal.js';
import Workout from '../models/Workout.js';
import WaterIntake from '../models/WaterIntake.js';
import SleepLog from '../models/SleepLog.js';
import WeightLog from '../models/WeightLog.js';
import MentalHealthLog from '../models/MentalHealthLog.js';
import CalorieGoal from '../models/CalorieGoal.js';

// Get dashboard overview data
export const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth;
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get today's meals
    const todayMeals = await Meal.find({
      userId,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 }).limit(5);

    // Get today's workouts
    const todayWorkouts = await Workout.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 }).limit(3);

    // Get today's water intake
    const todayWater = await WaterIntake.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get today's sleep log
    const todaySleep = await SleepLog.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get latest weight
    const latestWeight = await WeightLog.findOne({ userId }).sort({ date: -1 });

    // Get latest mental health log
    const latestMentalHealth = await MentalHealthLog.findOne({ userId }).sort({ date: -1 });

    // Get calorie goal
    const calorieGoal = await CalorieGoal.findOne({ userId, isActive: true });

    // Calculate today's total calories
    const todayCalories = todayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);

    // Calculate today's total water intake
    const todayWaterIntake = todayWater.reduce((sum, intake) => sum + (intake.amount || 0), 0);

    // Calculate today's total workout duration
    const todayWorkoutDuration = todayWorkouts.reduce((sum, workout) => sum + (workout.totalDuration || 0), 0);

    // Calculate today's total calories burned
    const todayCaloriesBurned = todayWorkouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);

    // Generate AI suggestions
    const aiSuggestions = generateAISuggestions({
      todayCalories,
      calorieGoal: calorieGoal?.dailyCalorieGoal || 2000,
      todayWaterIntake,
      todayWorkoutDuration,
      todaySleep,
      latestMentalHealth
    });

    // Get recent activities
    const recentActivities = await getRecentActivities(userId);

    res.json({
      success: true,
      data: {
        todayMeals,
        todayWorkouts,
        todayWater,
        todaySleep,
        latestWeight,
        latestMentalHealth,
        calorieGoal,
        summary: {
          todayCalories,
          todayWaterIntake,
          todayWorkoutDuration,
          todayCaloriesBurned,
          calorieGoal: calorieGoal?.dailyCalorieGoal || 2000
        },
        aiSuggestions,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data'
    });
  }
};

// Generate AI suggestions based on user data
const generateAISuggestions = (data) => {
  const suggestions = [];

  // Calorie suggestions
  if (data.todayCalories < data.calorieGoal * 0.8) {
    suggestions.push({
      type: 'nutrition',
      message: 'You\'re below your calorie goal. Consider adding a healthy snack.',
      priority: 'medium'
    });
  } else if (data.todayCalories > data.calorieGoal * 1.2) {
    suggestions.push({
      type: 'nutrition',
      message: 'You\'ve exceeded your calorie goal. Consider lighter options for remaining meals.',
      priority: 'high'
    });
  }

  // Water suggestions
  if (data.todayWaterIntake < 2000) {
    suggestions.push({
      type: 'hydration',
      message: 'You\'re below your daily water goal. Try to drink more water.',
      priority: 'medium'
    });
  }

  // Exercise suggestions
  if (data.todayWorkoutDuration < 30) {
    suggestions.push({
      type: 'exercise',
      message: 'You haven\'t exercised much today. Consider a short workout.',
      priority: 'medium'
    });
  }

  // Sleep suggestions
  if (data.todaySleep && data.todaySleep.sleepDuration < 7) {
    suggestions.push({
      type: 'sleep',
      message: 'You slept less than recommended. Try to get more sleep tonight.',
      priority: 'high'
    });
  }

  // Mental health suggestions
  if (data.latestMentalHealth && data.latestMentalHealth.mood < 5) {
    suggestions.push({
      type: 'mental_health',
      message: 'Your mood seems low. Consider activities that boost your mood.',
      priority: 'high'
    });
  }

  return suggestions;
};

// Get recent activities across all features
const getRecentActivities = async (userId) => {
  const activities = [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Get recent meals
  const recentMeals = await Meal.find({
    userId,
    timestamp: { $gte: oneWeekAgo }
  }).sort({ timestamp: -1 }).limit(5);

  recentMeals.forEach(meal => {
    activities.push({
      type: 'meal',
      title: `Logged meal: ${meal.foodName}`,
      time: meal.timestamp,
      calories: meal.calories
    });
  });

  // Get recent workouts
  const recentWorkouts = await Workout.find({
    userId,
    date: { $gte: oneWeekAgo }
  }).sort({ date: -1 }).limit(5);

  recentWorkouts.forEach(workout => {
    activities.push({
      type: 'workout',
      title: `Completed workout: ${workout.workoutName}`,
      time: workout.date,
      duration: workout.totalDuration
    });
  });

  // Get recent water intake
  const recentWater = await WaterIntake.find({
    userId,
    date: { $gte: oneWeekAgo }
  }).sort({ date: -1 }).limit(5);

  recentWater.forEach(intake => {
    activities.push({
      type: 'water',
      title: `Drank water: ${intake.amount}ml`,
      time: intake.date,
      amount: intake.amount
    });
  });

  // Sort by time and return latest 10
  return activities
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
}; 