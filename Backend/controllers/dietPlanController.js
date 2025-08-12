// controllers/dietPlanController.js
import axios from "axios";
import DietPlan from "../models/DietPlan.js";
import User from "../models/User.js";

export const generateDietPlan = async (req, res) => {
  try {
    const { userId, timeFrame = "day" } = req.body;

    // 1️⃣ Fetch user preferences from DB
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2️⃣ Calculate target calories based on user data
    const targetCalories = calculateTargetCalories(user);
    
    // 3️⃣ Prepare parameters for Spoonacular API with all user preferences
    const params = {
      timeFrame,
      targetCalories,
      diet: user.dietaryPreference !== "Normal" ? user.dietaryPreference.toLowerCase() : undefined,
      exclude: user.allergies || "",
      intolerances: user.allergies || "",
      apiKey: process.env.SPOONACULAR_API_KEY,
    };

    console.log('🚀 Calling Spoonacular API with params:', params);

    // 4️⃣ Get main meals from mealplanner API
    const { data: mainMeals } = await axios.get(
      "https://api.spoonacular.com/mealplanner/generate",
      { params }
    );

    console.log('✅ Main meals received:', mainMeals);

    // 5️⃣ Get detailed recipe information for each meal
    const getRecipeDetails = async (recipeId) => {
      try {
        const { data } = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information`,
          {
            params: { apiKey: process.env.SPOONACULAR_API_KEY }
          }
        );
        return data;
      } catch (error) {
        console.error(`Error fetching recipe ${recipeId}:`, error.message);
        return null;
      }
    };

    // 6️⃣ Get extra meal categories (snacks, pre-workout, post-workout)
    const getExtraMeals = async (type) => {
      const queryMap = {
        snacks: "healthy snacks",
        "pre-workout": "high carb snack",
        "post-workout": "high protein meal",
      };
      
      try {
        const { data } = await axios.get(
          "https://api.spoonacular.com/recipes/complexSearch",
          {
            params: {
              query: queryMap[type],
              number: timeFrame === 'week' ? 4 : 2,
              diet: user.dietaryPreference !== "Normal" ? user.dietaryPreference.toLowerCase() : undefined,
              intolerances: user.allergies || "",
              apiKey: process.env.SPOONACULAR_API_KEY,
            },
          }
        );
        return data.results;
      } catch (error) {
        console.error(`Error fetching ${type} meals:`, error.message);
        return [];
      }
    };

    // 7️⃣ Fetch extra meals
    const [snacks, preWorkout, postWorkout] = await Promise.all([
      getExtraMeals("snacks"),
      getExtraMeals("pre-workout"),
      getExtraMeals("post-workout"),
    ]);

    // 8️⃣ Organize meals by type for proper display
    const organizeMealsByType = (meals, timeFrame) => {
      if (timeFrame === 'day') {
        // For daily plan, organize by meal type
        const breakfast = meals.filter(m => 
          m.title.toLowerCase().includes('breakfast') || 
          m.title.toLowerCase().includes('oatmeal') || 
          m.title.toLowerCase().includes('eggs') ||
          m.title.toLowerCase().includes('pancake') ||
          m.title.toLowerCase().includes('waffle')
        );
        
        const lunch = meals.filter(m => 
          m.title.toLowerCase().includes('lunch') || 
          m.title.toLowerCase().includes('salad') || 
          m.title.toLowerCase().includes('sandwich') ||
          m.title.toLowerCase().includes('soup') ||
          m.title.toLowerCase().includes('wrap')
        );
        
        const dinner = meals.filter(m => 
          m.title.toLowerCase().includes('dinner') || 
          m.title.toLowerCase().includes('chicken') || 
          m.title.toLowerCase().includes('fish') ||
          m.title.toLowerCase().includes('steak') ||
          m.title.toLowerCase().includes('pasta')
        );

        return {
          breakfast: breakfast.length > 0 ? breakfast : [meals[0]],
          lunch: lunch.length > 0 ? lunch : [meals[1] || meals[0]],
          dinner: dinner.length > 0 ? dinner : [meals[2] || meals[0]]
        };
      } else {
        // For weekly plan, create daily structure
        const dailyMeals = {};
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach((day, index) => {
          const startIndex = index * 3;
          dailyMeals[day] = {
            breakfast: [meals[startIndex] || meals[0]],
            lunch: [meals[startIndex + 1] || meals[1] || meals[0]],
            dinner: [meals[startIndex + 2] || meals[2] || meals[0]]
          };
        });
        
        return dailyMeals;
      }
    };

    // 9️⃣ Get detailed nutrition information for all meals
    const getMealsWithDetails = async (meals) => {
      return await Promise.all(
        meals.map(async (meal) => {
          const recipeDetails = await getRecipeDetails(meal.id);
          
          return {
            id: meal.id,
            title: meal.title,
            readyInMinutes: meal.readyInMinutes || recipeDetails?.readyInMinutes || 30,
            servings: meal.servings || recipeDetails?.servings || 2,
            sourceUrl: meal.sourceUrl || `https://spoonacular.com/recipes/${meal.title.toLowerCase().replace(/\s+/g, '-')}-${meal.id}`,
            image: meal.image || recipeDetails?.image || `https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`,
            imageType: meal.imageType || 'jpg',
            nutrition: recipeDetails?.nutrition || null,
            instructions: recipeDetails?.instructions || [],
            ingredients: recipeDetails?.ingredients || []
          };
        })
      );
    };

    // 🔟 Organize main meals by type
    const organizedMainMeals = organizeMealsByType(mainMeals.meals, timeFrame);
    
    // 1️⃣1️⃣ Get detailed info for main meals
    let detailedMainMeals;
    if (timeFrame === 'day') {
      detailedMainMeals = {
        breakfast: await getMealsWithDetails(organizedMainMeals.breakfast),
        lunch: await getMealsWithDetails(organizedMainMeals.lunch),
        dinner: await getMealsWithDetails(organizedMainMeals.dinner)
      };
    } else {
      // For weekly plan, get details for each day
      detailedMainMeals = {};
      for (const [day, meals] of Object.entries(organizedMainMeals)) {
        detailedMainMeals[day] = {
          breakfast: await getMealsWithDetails(meals.breakfast),
          lunch: await getMealsWithDetails(meals.lunch),
          dinner: await getMealsWithDetails(meals.dinner)
        };
      }
    }

    // 1️⃣2️⃣ Get detailed info for extra meals
    const detailedExtraMeals = {
      snacks: await getMealsWithDetails(snacks),
      preWorkout: await getMealsWithDetails(preWorkout),
      postWorkout: await getMealsWithDetails(postWorkout)
    };

    // 1️⃣3️⃣ Calculate total nutrients
    const totalNutrients = {
      calories: targetCalories,
      protein: Math.round(targetCalories * 0.25 / 4), // 25% of calories from protein
      fat: Math.round(targetCalories * 0.30 / 9),     // 30% of calories from fat
      carbohydrates: Math.round(targetCalories * 0.45 / 4) // 45% of calories from carbs
    };

    // 1️⃣4️⃣ Generate shopping list
    const allMealsArray = [
      ...Object.values(detailedMainMeals).flat().flat(),
      ...Object.values(detailedExtraMeals).flat()
    ];
    const shoppingList = await generateShoppingList(allMealsArray);

    // 1️⃣5️⃣ Generate meal prep schedule
    const mealPrepSchedule = generateMealPrepSchedule(timeFrame);

    // 1️⃣6️⃣ Create the final plan structure
    const finalPlan = {
      meals: detailedMainMeals,
      extraMeals: detailedExtraMeals,
      nutrients: totalNutrients,
      planSummary: {
        totalCalories: totalNutrients.calories,
        mealCount: allMealsArray.length,
        timeFrame,
        userGoals: user.goal,
        dietaryPreferences: user.dietaryPreference,
        allergies: user.allergies || 'None'
      },
      shoppingList,
      mealPrepSchedule,
      nutritionGoals: totalNutrients
    };

    // 1️⃣7️⃣ Save to database
    const plan = await DietPlan.create({
      userId: user.clerkId,
      timeFrame,
      planData: finalPlan,
    });

    console.log('✅ Final plan created:', finalPlan);

    // 1️⃣8️⃣ Return response
    console.log('📊 Final plan structure:', {
      timeFrame,
      mealsCount: Object.keys(finalPlan.meals).length,
      extraMealsCount: Object.keys(finalPlan.extraMeals).length,
      nutrients: finalPlan.nutrients,
      planSummary: finalPlan.planSummary
    });
    
    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('❌ Error generating diet plan:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error generating diet plan" });
  }
};

export const getDietPlans = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Extract user ID from token (you may need to adjust this based on your auth setup)
    // For now, we'll get all plans - you can filter by user later
    const plans = await DietPlan.find().sort({ createdAt: -1 });
    
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    res.status(500).json({ success: false, message: "Error fetching diet plans" });
  }
};

export const deleteDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const deletedPlan = await DietPlan.findByIdAndDelete(id);
    
    if (!deletedPlan) {
      return res.status(404).json({ success: false, message: "Diet plan not found" });
    }

    res.json({ success: true, message: "Diet plan deleted successfully" });
  } catch (error) {
    console.error('Error deleting diet plan:', error);
    res.status(500).json({ success: false, message: "Error deleting diet plan" });
  }
};

export const getMealPlannerItems = async (req, res) => {
  try {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Get user's meal planner items from Spoonacular
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // This would typically call Spoonacular's /mealplanner/items endpoint
    // For now, we'll return the user's saved plans
    const plans = await DietPlan.find({ userId: user.clerkId }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching meal planner items:', error);
    res.status(500).json({ success: false, message: "Error fetching meal planner items" });
  }
};

export const getShoppingList = async (req, res) => {
  try {
    const { userId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get the most recent diet plan for the user
    const latestPlan = await DietPlan.findOne({ userId: user.clerkId }).sort({ createdAt: -1 });
    
    if (!latestPlan) {
      return res.status(404).json({ success: false, message: "No diet plan found" });
    }

    res.json({ success: true, data: latestPlan.planData.shoppingList || [] });
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    res.status(500).json({ success: false, message: "Error fetching shopping list" });
  }
};

export const getRecipeInformation = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Get detailed recipe information from Spoonacular
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: { apiKey: process.env.SPOONACULAR_API_KEY }
      }
    );

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching recipe information:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Error fetching recipe information" });
  }
};

// Helper function to get meal timing
const getMealTiming = (mealType, index) => {
  const baseTimings = {
    breakfast: { start: '7:00 AM', end: '9:00 AM' },
    lunch: { start: '12:00 PM', end: '2:00 PM' },
    dinner: { start: '6:00 PM', end: '8:00 PM' },
    snacks: { start: '10:00 AM', end: '11:00 AM' },
    'pre-workout': { start: '5:00 PM', end: '6:00 PM' },
    'post-workout': { start: '7:00 PM', end: '8:00 PM' }
  };

  const timing = baseTimings[mealType];
  if (index > 0) {
    // Adjust timing for multiple meals of same type
    const startHour = parseInt(timing.start.split(':')[0]);
    const adjustedStart = `${startHour + index}:00 ${timing.start.split(' ')[1]}`;
    const adjustedEnd = `${startHour + index + 1}:00 ${timing.end.split(' ')[1]}`;
    return { start: adjustedStart, end: adjustedEnd };
  }
  return timing;
};

// Helper function to get eating location
const getEatingLocation = (mealType, user) => {
  const locations = {
    breakfast: 'Home',
    lunch: user.workoutDaysPerWeek > 3 ? 'Work/Gym' : 'Work',
    dinner: 'Home',
    snacks: 'Anywhere (portable)',
    'pre-workout': 'Gym/Home',
    'post-workout': 'Gym/Home'
  };
  return locations[mealType];
};

// Helper function to get preparation tips
const getPreparationTips = (meal, mealType) => {
  const tips = {
    breakfast: [
      'Prepare the night before for quick morning assembly',
      'Use meal prep containers for easy grab-and-go',
      'Keep ingredients organized in the fridge'
    ],
    lunch: [
      'Pack in insulated containers to maintain temperature',
      'Include ice packs for perishable items',
      'Prepare multiple servings for the week'
    ],
    dinner: [
      'Batch cook proteins for the week',
      'Prep vegetables in advance',
      'Use slow cooker for easy evening meals'
    ],
    snacks: [
      'Portion out in small containers',
      'Keep in visible locations for easy access',
      'Combine protein and fiber for satiety'
    ],
    'pre-workout': [
      'Eat 1-2 hours before workout',
      'Focus on easily digestible carbs',
      'Avoid high-fat foods that slow digestion'
    ],
    'post-workout': [
      'Eat within 30 minutes after workout',
      'Include protein for muscle recovery',
      'Replenish glycogen with carbs'
    ]
  };
  return tips[mealType] || [];
};

// Helper function to get meal priority
const getMealPriority = (mealType) => {
  const priorities = {
    breakfast: 'High',
    lunch: 'High',
    dinner: 'High',
    snacks: 'Medium',
    'pre-workout': 'Medium',
    'post-workout': 'High'
  };
  return priorities[mealType];
};

// Helper function to generate shopping list
const generateShoppingList = async (allMeals) => {
  const ingredients = new Map();
  
  allMeals.forEach(meal => {
    // Add common ingredients based on meal title/keywords
    const mealTitle = meal.title.toLowerCase();
    let commonIngredients = [];
    
    if (mealTitle.includes('breakfast') || mealTitle.includes('oatmeal') || mealTitle.includes('eggs')) {
      commonIngredients = ['eggs', 'oatmeal', 'berries', 'milk', 'yogurt'];
    } else if (mealTitle.includes('lunch') || mealTitle.includes('salad') || mealTitle.includes('sandwich')) {
      commonIngredients = ['chicken breast', 'mixed greens', 'tomatoes', 'cucumber', 'olive oil'];
    } else if (mealTitle.includes('dinner') || mealTitle.includes('chicken') || mealTitle.includes('fish')) {
      commonIngredients = ['salmon', 'quinoa', 'broccoli', 'garlic', 'lemon'];
    } else if (mealTitle.includes('snack') || mealTitle.includes('healthy')) {
      commonIngredients = ['nuts', 'fruits', 'cheese', 'hummus'];
    } else if (mealTitle.includes('workout') || mealTitle.includes('protein')) {
      commonIngredients = ['protein powder', 'milk', 'banana', 'oats'];
    } else {
      // Default ingredients for any meal
      commonIngredients = ['olive oil', 'salt', 'pepper', 'garlic'];
    }
    
    commonIngredients.forEach(ingredient => {
      if (ingredients.has(ingredient)) {
        ingredients.set(ingredient, ingredients.get(ingredient) + 1);
      } else {
        ingredients.set(ingredient, 1);
      }
    });
  });
  
  return Array.from(ingredients.entries()).map(([ingredient, quantity]) => ({
    ingredient,
    quantity: `${quantity} servings`,
    category: getIngredientCategory(ingredient),
    priority: getIngredientPriority(ingredient)
  }));
};

// Helper function to categorize ingredients
const getIngredientCategory = (ingredient) => {
  const categories = {
    'eggs': 'Protein',
    'chicken breast': 'Protein',
    'salmon': 'Protein',
    'milk': 'Dairy',
    'yogurt': 'Dairy',
    'cheese': 'Dairy',
    'oatmeal': 'Grains',
    'quinoa': 'Grains',
    'bread': 'Grains',
    'berries': 'Fruits',
    'banana': 'Fruits',
    'tomatoes': 'Vegetables',
    'broccoli': 'Vegetables',
    'mixed greens': 'Vegetables',
    'nuts': 'Healthy Fats',
    'olive oil': 'Healthy Fats',
    'peanut butter': 'Healthy Fats'
  };
  return categories[ingredient] || 'Other';
};

// Helper function to get ingredient priority
const getIngredientPriority = (ingredient) => {
  const priorities = {
    'eggs': 'High',
    'chicken breast': 'High',
    'salmon': 'High',
    'milk': 'Medium',
    'oatmeal': 'Medium',
    'berries': 'Low',
    'olive oil': 'Medium'
  };
  return priorities[ingredient] || 'Medium';
};

// Helper function to generate meal prep schedule
const generateMealPrepSchedule = (timeFrame) => {
  const schedule = {
    'Sunday': [
      'Batch cook proteins (chicken, fish)',
      'Prep vegetables and wash greens',
      'Cook grains (quinoa, rice)',
      'Portion out snacks and pre-workout meals'
    ],
    'Monday': [
      'Assemble breakfast containers',
      'Pack lunch containers',
      'Prepare dinner ingredients'
    ],
    'Tuesday': [
      'Restock perishable items',
      'Prep mid-week meals',
      'Update shopping list'
    ],
    'Wednesday': [
      'Cook additional proteins if needed',
      'Prep vegetables for remaining days',
      'Assemble meal containers'
    ],
    'Thursday': [
      'Use remaining prepared ingredients',
      'Plan weekend meals',
      'Clean and organize containers'
    ],
    'Friday': [
      'Finish week\'s prepared meals',
      'Plan next week\'s menu',
      'Update shopping list for weekend'
    ],
    'Saturday': [
      'Grocery shopping for next week',
      'Light meal prep if needed',
      'Rest and enjoy prepared meals'
    ]
  };
  
  return timeFrame === 'day' ? { 'Today': schedule['Monday'] } : schedule;
};

// Helper function to calculate target calories based on user data
const calculateTargetCalories = (user) => {
  // Basic BMR calculation using Mifflin-St Jeor Equation
  let bmr;
  if (user.gender === 'Male') {
    bmr = 10 * user.weight.value + 6.25 * user.height.value - 5 * user.age + 5;
  } else {
    bmr = 10 * user.weight.value + 6.25 * user.height.value - 5 * user.age - 161;
  }

  // Activity level multiplier
  const activityMultipliers = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Extremely Active': 1.9
  };

  const tdee = bmr * (activityMultipliers[user.activityLevel] || 1.2);

  // Goal-based calorie adjustment
  let targetCalories;
  switch (user.goal) {
    case 'Lose Weight':
      targetCalories = Math.round(tdee - 500); // 500 calorie deficit
      break;
    case 'Gain Muscle':
      targetCalories = Math.round(tdee + 300); // 300 calorie surplus
      break;
    case 'Maintain Weight':
    default:
      targetCalories = Math.round(tdee);
      break;
  }

  // Ensure minimum calories
  const minCalories = user.gender === 'Male' ? 1500 : 1200;
  return Math.max(targetCalories, minCalories);
};