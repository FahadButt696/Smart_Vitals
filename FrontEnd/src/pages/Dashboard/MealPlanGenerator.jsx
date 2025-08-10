import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Calendar, Target, Clock, Heart, Leaf, Zap, Plus } from 'lucide-react';

const MealPlanGenerator = () => {
  const [selectedDiet, setSelectedDiet] = useState('balanced');
  const [selectedGoal, setSelectedGoal] = useState('maintain');
  const [selectedDays, setSelectedDays] = useState(7);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const dietTypes = [
    { id: 'balanced', label: 'Balanced', description: 'All food groups in moderation', icon: Leaf },
    { id: 'vegetarian', label: 'Vegetarian', description: 'Plant-based with dairy and eggs', icon: Leaf },
    { id: 'vegan', label: 'Vegan', description: 'Plant-based only', icon: Leaf },
    { id: 'keto', label: 'Keto', description: 'Low-carb, high-fat', icon: Zap },
    { id: 'paleo', label: 'Paleo', description: 'Whole foods, no processed items', icon: Heart },
    { id: 'mediterranean', label: 'Mediterranean', description: 'Heart-healthy, olive oil focus', icon: Heart }
  ];

  const goals = [
    { id: 'lose', label: 'Weight Loss', description: 'Calorie deficit for fat loss' },
    { id: 'maintain', label: 'Maintain Weight', description: 'Calorie balance for current weight' },
    { id: 'gain', label: 'Weight Gain', description: 'Calorie surplus for muscle building' }
  ];

  const dayOptions = [3, 5, 7, 14];

  const generateMealPlan = () => {
    // Simulate meal plan generation
    const plan = {
      diet: dietTypes.find(d => d.id === selectedDiet)?.label,
      goal: goals.find(g => g.id === selectedGoal)?.label,
      days: selectedDays,
      meals: []
    };

    // Generate sample meals for each day
    for (let day = 1; day <= selectedDays; day++) {
      plan.meals.push({
        day,
        breakfast: {
          name: 'Healthy Breakfast Bowl',
          calories: 350,
          protein: '15g',
          carbs: '45g',
          fat: '12g',
          ingredients: ['Oatmeal', 'Berries', 'Nuts', 'Greek yogurt']
        },
        lunch: {
          name: 'Grilled Chicken Salad',
          calories: 420,
          protein: '28g',
          carbs: '22g',
          fat: '18g',
          ingredients: ['Mixed greens', 'Chicken breast', 'Avocado', 'Olive oil']
        },
        dinner: {
          name: 'Salmon with Vegetables',
          calories: 480,
          protein: '32g',
          carbs: '18g',
          fat: '24g',
          ingredients: ['Salmon fillet', 'Broccoli', 'Quinoa', 'Lemon']
        },
        snacks: [
          {
            name: 'Apple with Almonds',
            calories: 180,
            protein: '4g',
            carbs: '22g',
            fat: '8g'
          }
        ]
      });
    }

    setGeneratedPlan(plan);
  };

  const calculateDailyTotals = (dayMeals) => {
    const total = {
      calories: dayMeals.breakfast.calories + dayMeals.lunch.calories + dayMeals.dinner.calories + dayMeals.snacks.reduce((sum, snack) => sum + snack.calories, 0),
      protein: 0,
      carbs: 0,
      fat: 0
    };

    // Parse and sum macros
    [dayMeals.breakfast, dayMeals.lunch, dayMeals.dinner, ...dayMeals.snacks].forEach(meal => {
      total.protein += parseInt(meal.protein);
      total.carbs += parseInt(meal.carbs);
      total.fat += parseInt(meal.fat);
    });

    return total;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Utensils className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Meal Plan Generator</h3>
            <p className="text-white/60">Create personalized meal plans based on your preferences</p>
          </div>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Plan Configuration</h3>
        
        {/* Diet Type Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-4">Select Diet Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dietTypes.map((diet) => (
              <motion.button
                key={diet.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDiet(diet.id)}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  selectedDiet === diet.id
                    ? 'border-cyan-400/50 bg-cyan-400/10'
                    : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <diet.icon className="text-white w-4 h-4" />
                  </div>
                  <h5 className="text-white font-medium">{diet.label}</h5>
                </div>
                <p className="text-white/60 text-sm text-left">{diet.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Goal Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-4">Select Goal</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {goals.map((goal) => (
              <motion.button
                key={goal.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  selectedGoal === goal.id
                    ? 'border-cyan-400/50 bg-cyan-400/10'
                    : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5'
                }`}
              >
                <h5 className="text-white font-medium mb-2">{goal.label}</h5>
                <p className="text-white/60 text-sm text-left">{goal.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-4">Plan Duration</h4>
          <div className="flex gap-3">
            {dayOptions.map((days) => (
              <motion.button
                key={days}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDays(days)}
                className={`px-6 py-3 rounded-xl border transition-all duration-200 ${
                  selectedDays === days
                    ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-400'
                    : 'border-white/20 hover:border-cyan-400/30 hover:bg-white/5 text-white'
                }`}
              >
                {days} Days
              </motion.button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateMealPlan}
          className="w-full p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Meal Plan
        </button>
      </div>

      {/* Generated Meal Plan */}
      {generatedPlan && (
        <div className="space-y-6">
          {/* Plan Summary */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Meal Plan Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-2">Diet Type</h4>
                <p className="text-white/60">{generatedPlan.diet}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-2">Goal</h4>
                <p className="text-white/60">{generatedPlan.goal}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-white font-semibold mb-2">Duration</h4>
                <p className="text-white/60">{generatedPlan.days} Days</p>
              </div>
            </div>
          </div>

          {/* Daily Meals */}
          {generatedPlan.meals.map((dayMeals, dayIndex) => {
            const dailyTotals = calculateDailyTotals(dayMeals);
            return (
              <motion.div
                key={dayIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
                className="backdrop-blur-xl border border-white/20 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Day {dayMeals.day}</h3>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">Daily Totals</p>
                    <p className="text-white font-semibold">{dailyTotals.calories} cal</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Breakfast */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Breakfast
                    </h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-white font-medium mb-2">{dayMeals.breakfast.name}</h5>
                      <p className="text-white/60 text-sm mb-3">{dayMeals.breakfast.calories} calories</p>
                      <div className="space-y-1 text-xs text-white/60">
                        <p>Protein: {dayMeals.breakfast.protein}</p>
                        <p>Carbs: {dayMeals.breakfast.carbs}</p>
                        <p>Fat: {dayMeals.breakfast.fat}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/60 text-xs">Ingredients:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayMeals.breakfast.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Lunch
                    </h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-white font-medium mb-2">{dayMeals.lunch.name}</h5>
                      <p className="text-white/60 text-sm mb-3">{dayMeals.lunch.calories} calories</p>
                      <div className="space-y-1 text-xs text-white/60">
                        <p>Protein: {dayMeals.lunch.protein}</p>
                        <p>Carbs: {dayMeals.lunch.carbs}</p>
                        <p>Fat: {dayMeals.lunch.fat}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/60 text-xs">Ingredients:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayMeals.lunch.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      Dinner
                    </h4>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <h5 className="text-white font-medium mb-2">{dayMeals.dinner.name}</h5>
                      <p className="text-white/60 text-sm mb-3">{dayMeals.dinner.calories} calories</p>
                      <div className="space-y-1 text-xs text-white/60">
                        <p>Protein: {dayMeals.dinner.protein}</p>
                        <p>Carbs: {dayMeals.dinner.carbs}</p>
                        <p>Fat: {dayMeals.dinner.fat}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-white/60 text-xs">Ingredients:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {dayMeals.dinner.ingredients.map((ingredient, idx) => (
                            <span key={idx} className="px-2 py-1 bg-cyan-400/20 text-cyan-400 text-xs rounded">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Snacks */}
                <div className="mt-6">
                  <h4 className="text-white font-semibold mb-4">Snacks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dayMeals.snacks.map((snack, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h5 className="text-white font-medium mb-2">{snack.name}</h5>
                        <p className="text-white/60 text-sm">{snack.calories} calories</p>
                        <div className="space-y-1 text-xs text-white/60 mt-2">
                          <p>Protein: {snack.protein}</p>
                          <p>Carbs: {snack.carbs}</p>
                          <p>Fat: {snack.fat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Save Plan</h4>
            <p className="text-white/60 text-sm">Save this meal plan for later</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Shopping List</h4>
            <p className="text-white/60 text-sm">Generate shopping list for ingredients</p>
          </button>
          <button className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Export Plan</h4>
            <p className="text-white/60 text-sm">Download or share your meal plan</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanGenerator; 