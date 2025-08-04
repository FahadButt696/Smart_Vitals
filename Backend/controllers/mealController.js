import Meal from '../models/Meal.js';

// Get all meals for a user
export const getMeals = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { date, mealType } = req.query;

    let query = { userId };

    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      query.timestamp = { $gte: startDate, $lte: endDate };
    }

    // Filter by meal type if provided
    if (mealType) {
      query.mealType = mealType;
    }

    const meals = await Meal.find(query).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving meals'
    });
  }
};

// Add a new meal
export const addMeal = async (req, res) => {
  try {
    const { userId } = req.auth;
    const mealData = {
      ...req.body,
      userId
    };

    const meal = new Meal(mealData);
    await meal.save();

    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding meal'
    });
  }
};

// Process image upload for meal recognition
export const processMealImage = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { imageUrl } = req.body;

    // Simulate CalorieMama API call
    const aiAnalysis = await analyzeMealImage(imageUrl);
    
    const mealData = {
      userId,
      foodName: aiAnalysis.foodName,
      calories: aiAnalysis.calories,
      protein: aiAnalysis.protein,
      carbs: aiAnalysis.carbs,
      fat: aiAnalysis.fat,
      fiber: aiAnalysis.fiber,
      sugar: aiAnalysis.sugar,
      sodium: aiAnalysis.sodium,
      mealType: aiAnalysis.mealType,
      notes: `AI detected: ${aiAnalysis.confidence}% confidence`,
      aiDetected: true,
      aiConfidence: aiAnalysis.confidence
    };

    const meal = new Meal(mealData);
    await meal.save();

    res.status(201).json({
      success: true,
      data: meal,
      aiAnalysis
    });
  } catch (error) {
    console.error('Error processing meal image:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing meal image'
    });
  }
};

// Simulate CalorieMama API analysis
const analyzeMealImage = async (imageUrl) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock analysis results
  const foodItems = [
    { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    { name: 'Mixed Green Salad', calories: 25, protein: 2, carbs: 4, fat: 0.3, fiber: 2, sugar: 1, sodium: 15 },
    { name: 'Olive Oil Dressing', calories: 120, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0 }
  ];

  const selectedFood = foodItems[Math.floor(Math.random() * foodItems.length)];
  
  return {
    foodName: selectedFood.name,
    calories: selectedFood.calories,
    protein: selectedFood.protein,
    carbs: selectedFood.carbs,
    fat: selectedFood.fat,
    fiber: selectedFood.fiber,
    sugar: selectedFood.sugar,
    sodium: selectedFood.sodium,
    mealType: 'lunch',
    confidence: Math.floor(Math.random() * 30) + 70 // 70-100% confidence
  };
};

// Update a meal
export const updateMeal = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const meal = await Meal.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meal'
    });
  }
};

// Delete a meal
export const deleteMeal = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const meal = await Meal.findOneAndDelete({ _id: id, userId });

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meal'
    });
  }
};

// Get meal statistics
export const getMealStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 7 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const meals = await Meal.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Calculate statistics
    const totalMeals = meals.length;
    const totalCalories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const avgCaloriesPerMeal = totalMeals > 0 ? totalCalories / totalMeals : 0;

    // Meal type distribution
    const mealTypeStats = {};
    meals.forEach(meal => {
      const type = meal.mealType || 'unknown';
      mealTypeStats[type] = (mealTypeStats[type] || 0) + 1;
    });

    // Average daily calories
    const avgDailyCalories = totalCalories / parseInt(days);

    res.json({
      success: true,
      data: {
        totalMeals,
        totalCalories,
        avgCaloriesPerMeal: Math.round(avgCaloriesPerMeal),
        avgDailyCalories: Math.round(avgDailyCalories),
        mealTypeDistribution: mealTypeStats,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting meal stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving meal statistics'
    });
  }
};
