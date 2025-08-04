import CalorieGoal from '../models/CalorieGoal.js';
import Meal from '../models/Meal.js';

// Get calorie data for a specific date
export const getCalorieData = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Get meals for the date
    const meals = await Meal.find({
      userId,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timestamp: -1 });

    // Get current calorie goal
    const calorieGoal = await CalorieGoal.findOne({ userId }).sort({ startDate: -1 });

    // Calculate total calories consumed
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const goalCalories = calorieGoal?.dailyCalories || 2000;
    const remainingCalories = Math.max(0, goalCalories - totalCalories);

    // Calculate macronutrients
    const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    res.json({
      success: true,
      data: {
        date: targetDate,
        meals,
        totalCalories,
        goalCalories,
        remainingCalories,
        macronutrients: {
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat
        },
        goal: calorieGoal
      }
    });
  } catch (error) {
    console.error('Error getting calorie data:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving calorie data'
    });
  }
};

// Set calorie goals
export const setCalorieGoal = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { dailyCalories, startDate, endDate, goal } = req.body;

    const calorieGoal = new CalorieGoal({
      userId,
      dailyCalories,
      startDate: startDate || new Date(),
      endDate,
      goal
    });

    await calorieGoal.save();

    res.status(201).json({
      success: true,
      data: calorieGoal
    });
  } catch (error) {
    console.error('Error setting calorie goal:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting calorie goal'
    });
  }
};

// Get AI insights for calorie tracking
export const getCalorieInsights = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get meals for the period
    const meals = await Meal.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 });

    // Calculate insights
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const avgDailyCalories = totalCalories / parseInt(days);
    const goal = await CalorieGoal.findOne({ userId }).sort({ startDate: -1 });
    const goalCalories = goal?.dailyCalories || 2000;

    // Generate AI insights (simulated)
    const insights = {
      averageDailyCalories: Math.round(avgDailyCalories),
      goalComparison: avgDailyCalories > goalCalories ? 'above' : 'below',
      percentageOfGoal: Math.round((avgDailyCalories / goalCalories) * 100),
      recommendation: avgDailyCalories > goalCalories 
        ? 'Consider reducing portion sizes or adding more physical activity'
        : 'You\'re on track! Consider adding nutrient-dense foods if you feel hungry',
      trend: 'Your calorie intake has been consistent over the past week'
    };

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error getting calorie insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving calorie insights'
    });
  }
}; 