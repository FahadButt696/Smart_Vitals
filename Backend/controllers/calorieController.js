import Meal from '../models/Meal.js';
import Workout from '../models/Workout.js';

// Get calorie data for different time periods
export const getCalorieData = async (req, res) => {
  try {
    const { userId, period = 'daily' } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "userId is required" 
      });
    }

    const now = new Date();
    let startDate, endDate;
    
    // Calculate date range based on period
    switch (period) {
      case 'daily':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7); // Last 7 days
        break;
      case 'weekly':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 28); // Last 4 weeks
        break;
      case 'monthly':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
    }

    // Fetch meals within the date range
    const meals = await Meal.find({
      userId,
      timestamp: { $gte: startDate, $lte: now }
    }).sort({ timestamp: 1 });

    // Fetch workouts within the date range
    const workouts = await Workout.find({
      userId,
      status: 'completed',
      timestamp: { $gte: startDate, $lte: now }
    }).sort({ timestamp: 1 });

    // Process data based on period
    let processedData = [];
    
    if (period === 'daily') {
      // Group by day for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayMeals = meals.filter(meal => {
          const mealDate = meal.timestamp.toISOString().split('T')[0];
          return mealDate === dateStr;
        });
        
        const dayWorkouts = workouts.filter(workout => {
          const workoutDate = workout.timestamp.toISOString().split('T')[0];
          return workoutDate === dateStr;
        });
        
        const consumed = dayMeals.reduce((sum, meal) => 
          sum + (meal.totalNutrition?.calories || 0), 0);
        const burned = dayWorkouts.reduce((sum, workout) => 
          sum + (workout.totalCaloriesBurned || 0), 0);
        
        processedData.push({
          date: dateStr,
          consumed,
          burned,
          net: consumed - burned,
          mealCount: dayMeals.length,
          workoutCount: dayWorkouts.length
        });
      }
    } else if (period === 'weekly') {
      // Group by week for the last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekMeals = meals.filter(meal => 
          meal.timestamp >= weekStart && meal.timestamp <= weekEnd);
        const weekWorkouts = workouts.filter(workout => 
          workout.timestamp >= weekStart && workout.timestamp <= weekEnd);
        
        const totalConsumed = weekMeals.reduce((sum, meal) => 
          sum + (meal.totalNutrition?.calories || 0), 0);
        const totalBurned = weekWorkouts.reduce((sum, workout) => 
          sum + (workout.totalCaloriesBurned || 0), 0);
        
        processedData.push({
          week: `Week ${4 - i}`,
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd.toISOString().split('T')[0],
          consumed: totalConsumed,
          burned: totalBurned,
          net: totalConsumed - totalBurned,
          avgDaily: Math.round(totalConsumed / 7),
          mealCount: weekMeals.length,
          workoutCount: weekWorkouts.length
        });
      }
    } else if (period === 'monthly') {
      // Group by month for the last 6 months
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now);
        month.setMonth(month.getMonth() - i);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        
        const monthMeals = meals.filter(meal => 
          meal.timestamp >= monthStart && meal.timestamp <= monthEnd);
        const monthWorkouts = workouts.filter(workout => 
          workout.timestamp >= monthStart && workout.timestamp <= monthEnd);
        
        const totalConsumed = monthMeals.reduce((sum, meal) => 
          sum + (meal.totalNutrition?.calories || 0), 0);
        const totalBurned = monthWorkouts.reduce((sum, workout) => 
          sum + (workout.totalCaloriesBurned || 0), 0);
        
        const daysInMonth = monthEnd.getDate();
        
        processedData.push({
          month: month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          startDate: monthStart.toISOString().split('T')[0],
          endDate: monthEnd.toISOString().split('T')[0],
          consumed: totalConsumed,
          burned: totalBurned,
          net: totalConsumed - totalBurned,
          avgDaily: Math.round(totalConsumed / daysInMonth),
          mealCount: monthMeals.length,
          workoutCount: monthWorkouts.length
        });
      }
    }

    res.json({
      success: true,
      data: processedData,
      period,
      summary: {
        totalConsumed: meals.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0),
        totalBurned: workouts.reduce((sum, workout) => sum + (workout.totalCaloriesBurned || 0), 0),
        totalMeals: meals.length,
        totalWorkouts: workouts.length,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0]
        }
      }
    });

  } catch (error) {
    console.error('Error fetching calorie data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calorie data',
      details: error.message
    });
  }
};

// Get calorie goals for a user
export const getCalorieGoals = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "userId is required" 
      });
    }

    // This would typically fetch from a user profile/settings table
    // For now, returning default values
    const goals = {
      dailyCalories: 2000,
      protein: 150, // grams
      carbs: 225,   // grams
      fat: 67,      // grams
      fiber: 25,    // grams
      sugar: 50     // grams
    };

    res.json({
      success: true,
      goals
    });

  } catch (error) {
    console.error('Error fetching calorie goals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calorie goals',
      details: error.message
    });
  }
};

// Update calorie goals for a user
export const updateCalorieGoals = async (req, res) => {
  try {
    const { userId, goals } = req.body;
    
    if (!userId || !goals) {
      return res.status(400).json({ 
        success: false, 
        error: "userId and goals are required" 
      });
    }

    // This would typically update a user profile/settings table
    // For now, just returning success
    console.log('Updating calorie goals for user:', userId, goals);

    res.json({
      success: true,
      message: 'Calorie goals updated successfully',
      goals
    });

  } catch (error) {
    console.error('Error updating calorie goals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update calorie goals',
      details: error.message
    });
  }
};

// Get calorie insights and recommendations
export const getCalorieInsights = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "userId is required" 
      });
    }

    // Get recent data for insights
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentMeals = await Meal.find({
      userId,
      timestamp: { $gte: weekAgo }
    }).sort({ timestamp: -1 });

    const recentWorkouts = await Workout.find({
      userId,
      status: 'completed',
      timestamp: { $gte: weekAgo }
    }).sort({ timestamp: -1 });

    // Calculate insights
    const totalConsumed = recentMeals.reduce((sum, meal) => 
      sum + (meal.totalNutrition?.calories || 0), 0);
    const totalBurned = recentWorkouts.reduce((sum, workout) => 
      sum + (workout.totalCaloriesBurned || 0), 0);
    const avgDailyConsumed = totalConsumed / 7;
    const avgDailyBurned = totalBurned / 7;

    const insights = [];

    // Calorie balance insights
    if (avgDailyConsumed < 1200) {
      insights.push({
        type: 'warning',
        title: 'Low Calorie Intake',
        message: 'Your daily calorie intake is below the recommended minimum. Consider adding more nutrient-dense foods.',
        action: 'Add more meals or increase portion sizes'
      });
    } else if (avgDailyConsumed > 3000) {
      insights.push({
        type: 'warning',
        title: 'High Calorie Intake',
        message: 'Your daily calorie intake is above typical recommendations. Consider portion control.',
        action: 'Review portion sizes and meal frequency'
      });
    }

    // Workout balance insights
    if (recentWorkouts.length === 0) {
      insights.push({
        type: 'info',
        title: 'No Recent Workouts',
        message: 'Adding regular workouts can help create a calorie deficit and improve overall health.',
        action: 'Start with light exercises like walking or yoga'
      });
    } else if (recentWorkouts.length < 3) {
      insights.push({
        type: 'info',
        title: 'Increase Workout Frequency',
        message: 'You\'re working out less than 3 times per week. More frequent exercise can improve results.',
        action: 'Aim for 3-5 workouts per week'
      });
    }

    // Nutrition balance insights
    const avgProtein = recentMeals.reduce((sum, meal) => 
      sum + (meal.totalNutrition?.protein || 0), 0) / 7;
    const avgCarbs = recentMeals.reduce((sum, meal) => 
      sum + (meal.totalNutrition?.carbs || meal.totalNutrition?.totalCarbs || 0), 0) / 7;
    const avgFat = recentMeals.reduce((sum, meal) => 
      sum + (meal.totalNutrition?.fat || meal.totalNutrition?.totalFat || 0), 0) / 7;

    if (avgProtein < 80) {
      insights.push({
        type: 'info',
        title: 'Increase Protein Intake',
        message: 'Your protein intake is below recommended levels. Protein helps with muscle building and recovery.',
        action: 'Add lean meats, eggs, or plant-based proteins'
      });
    }

    if (avgCarbs < 150) {
      insights.push({
        type: 'info',
        title: 'Low Carbohydrate Intake',
        message: 'Your carb intake is low. Carbs provide energy for workouts and daily activities.',
        action: 'Include whole grains, fruits, and vegetables'
      });
    }

    // Positive insights
    if (recentMeals.length >= 14) { // At least 2 meals per day
      insights.push({
        type: 'success',
        title: 'Consistent Meal Logging',
        message: 'Great job maintaining consistent meal tracking! This helps with accurate calorie monitoring.',
        action: 'Keep up the good work!'
      });
    }

    if (recentWorkouts.length >= 3) {
      insights.push({
        type: 'success',
        title: 'Active Lifestyle',
        message: 'You\'re maintaining an active lifestyle with regular workouts. This helps with calorie balance.',
        action: 'Continue your workout routine'
      });
    }

    res.json({
      success: true,
      insights,
      summary: {
        avgDailyConsumed: Math.round(avgDailyConsumed),
        avgDailyBurned: Math.round(avgDailyBurned),
        netCalories: Math.round(avgDailyConsumed - avgDailyBurned),
        mealCount: recentMeals.length,
        workoutCount: recentWorkouts.length
      }
    });

  } catch (error) {
    console.error('Error fetching calorie insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calorie insights',
      details: error.message
    });
  }
};


