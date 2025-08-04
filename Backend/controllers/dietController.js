import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';

// Get all diet plans for a user
export const getDietPlans = async (req, res) => {
  try {
    const { userId } = req.auth;
    const dietPlans = await DietPlan.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: dietPlans
    });
  } catch (error) {
    console.error('Error getting diet plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving diet plans'
    });
  }
};

// Add a new diet plan
export const addDietPlan = async (req, res) => {
  try {
    const { userId } = req.auth;
    const dietPlanData = {
      ...req.body,
      userId
    };

    const dietPlan = new DietPlan(dietPlanData);
    await dietPlan.save();

    res.status(201).json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Error adding diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding diet plan'
    });
  }
};

// Update a diet plan
export const updateDietPlan = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const dietPlan = await DietPlan.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Error updating diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating diet plan'
    });
  }
};

// Delete a diet plan
export const deleteDietPlan = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const dietPlan = await DietPlan.findOneAndDelete({ _id: id, userId });

    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting diet plan'
    });
  }
};

// Generate AI diet plan
export const generateDietPlan = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { 
      goal, 
      dietaryRestrictions, 
      calorieTarget, 
      mealCount = 3,
      duration = 7 
    } = req.body;

    // Simulate AI diet plan generation
    const generatedPlan = {
      userId,
      name: `${goal} Diet Plan`,
      goal,
      duration,
      calorieTarget,
      mealCount,
      dietaryRestrictions: dietaryRestrictions || [],
      meals: [],
      recommendations: []
    };

    // Generate sample meals based on goal
    const sampleMeals = {
      'weight_loss': [
        { name: 'Oatmeal with Berries', calories: 300, protein: 12, carbs: 45, fat: 8 },
        { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 15, fat: 20 },
        { name: 'Salmon with Vegetables', calories: 450, protein: 40, carbs: 20, fat: 25 }
      ],
      'muscle_gain': [
        { name: 'Protein Smoothie Bowl', calories: 500, protein: 30, carbs: 60, fat: 15 },
        { name: 'Turkey and Rice Bowl', calories: 600, protein: 45, carbs: 70, fat: 20 },
        { name: 'Steak with Sweet Potato', calories: 650, protein: 50, carbs: 55, fat: 30 }
      ],
      'maintenance': [
        { name: 'Greek Yogurt Parfait', calories: 350, protein: 20, carbs: 40, fat: 12 },
        { name: 'Quinoa Buddha Bowl', calories: 450, protein: 25, carbs: 55, fat: 18 },
        { name: 'Baked Cod with Rice', calories: 500, protein: 35, carbs: 45, fat: 22 }
      ]
    };

    const meals = sampleMeals[goal] || sampleMeals['maintenance'];
    generatedPlan.meals = meals;

    // Generate recommendations
    const recommendations = [
      `Focus on ${goal === 'weight_loss' ? 'calorie deficit' : goal === 'muscle_gain' ? 'protein intake' : 'balanced nutrition'}`,
      'Stay hydrated throughout the day',
      'Include a variety of colorful vegetables',
      'Plan meals ahead to avoid unhealthy choices'
    ];

    generatedPlan.recommendations = recommendations;

    // Create the diet plan in database
    const dietPlan = new DietPlan(generatedPlan);
    await dietPlan.save();

    res.status(201).json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Error generating diet plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating diet plan'
    });
  }
};

// Generate AI meal plan with OpenAI/Edamam simulation
export const generateAIMealPlan = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { dietType, goal, duration = 7 } = req.body;

    // Simulate OpenAI/Edamam API call
    const aiMealPlan = await generateMealPlanWithAI(dietType, goal, duration);
    
    const dietData = {
      userId,
      planName: `${dietType} ${goal} Plan`,
      description: `AI-generated ${dietType} meal plan for ${goal}`,
      duration,
      goalType: goal,
      dietaryRestrictions: [dietType],
      aiGenerated: true,
      aiPrompt: `Generate a ${dietType} meal plan for ${goal} goals`,
      meals: aiMealPlan.meals,
      totalCalories: aiMealPlan.totalCalories,
      totalProtein: aiMealPlan.totalProtein,
      totalCarbs: aiMealPlan.totalCarbs,
      totalFat: aiMealPlan.totalFat
    };

    const dietPlan = new DietPlan(dietData);
    await dietPlan.save();

    res.status(201).json({
      success: true,
      data: dietPlan,
      aiAnalysis: aiMealPlan
    });
  } catch (error) {
    console.error('Error generating AI meal plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI meal plan'
    });
  }
};

// Simulate AI meal plan generation
const generateMealPlanWithAI = async (dietType, goal, duration) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const mealTemplates = {
    breakfast: [
      { name: 'Oatmeal with Berries', calories: 250, protein: 8, carbs: 45, fat: 5 },
      { name: 'Greek Yogurt Parfait', calories: 200, protein: 15, carbs: 25, fat: 8 },
      { name: 'Egg White Omelette', calories: 180, protein: 20, carbs: 5, fat: 10 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 15, fat: 18 },
      { name: 'Quinoa Bowl', calories: 400, protein: 12, carbs: 60, fat: 12 },
      { name: 'Turkey Wrap', calories: 320, protein: 25, carbs: 35, fat: 10 }
    ],
    dinner: [
      { name: 'Salmon with Vegetables', calories: 450, protein: 40, carbs: 20, fat: 25 },
      { name: 'Lean Beef Stir-Fry', calories: 380, protein: 35, carbs: 25, fat: 15 },
      { name: 'Vegetarian Pasta', calories: 420, protein: 15, carbs: 65, fat: 12 }
    ]
  };

  const meals = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  // Generate meals for each day
  for (let day = 1; day <= duration; day++) {
    const dayMeals = [];
    
    // Add breakfast
    const breakfast = mealTemplates.breakfast[Math.floor(Math.random() * mealTemplates.breakfast.length)];
    dayMeals.push({
      day,
      mealType: 'breakfast',
      foods: [breakfast],
      totalCalories: breakfast.calories,
      totalProtein: breakfast.protein,
      totalCarbs: breakfast.carbs,
      totalFat: breakfast.fat
    });

    // Add lunch
    const lunch = mealTemplates.lunch[Math.floor(Math.random() * mealTemplates.lunch.length)];
    dayMeals.push({
      day,
      mealType: 'lunch',
      foods: [lunch],
      totalCalories: lunch.calories,
      totalProtein: lunch.protein,
      totalCarbs: lunch.carbs,
      totalFat: lunch.fat
    });

    // Add dinner
    const dinner = mealTemplates.dinner[Math.floor(Math.random() * mealTemplates.dinner.length)];
    dayMeals.push({
      day,
      mealType: 'dinner',
      foods: [dinner],
      totalCalories: dinner.calories,
      totalProtein: dinner.protein,
      totalCarbs: dinner.carbs,
      totalFat: dinner.fat
    });

    meals.push(...dayMeals);
    
    // Calculate totals
    totalCalories += breakfast.calories + lunch.calories + dinner.calories;
    totalProtein += breakfast.protein + lunch.protein + dinner.protein;
    totalCarbs += breakfast.carbs + lunch.carbs + dinner.carbs;
    totalFat += breakfast.fat + lunch.fat + dinner.fat;
  }

  return {
    meals,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    confidence: Math.floor(Math.random() * 15) + 85 // 85-100% confidence
  };
};

 