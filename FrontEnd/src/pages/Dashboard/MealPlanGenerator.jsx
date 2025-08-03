import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaUtensils, FaCalendarAlt, FaRobot, FaPlus, FaHeart } from "react-icons/fa";
import { DietPlanAi } from "@/assets/Assets";

const MealPlanGenerator = () => {
  const { user } = useUser();
  const [mealPlan, setMealPlan] = useState({
    monday: [
      { meal: "Breakfast", food: "Oatmeal with berries", calories: 320 },
      { meal: "Lunch", food: "Grilled chicken salad", calories: 450 },
      { meal: "Dinner", food: "Salmon with vegetables", calories: 550 }
    ],
    tuesday: [
      { meal: "Breakfast", food: "Greek yogurt with nuts", calories: 280 },
      { meal: "Lunch", food: "Quinoa bowl", calories: 420 },
      { meal: "Dinner", food: "Lean beef stir-fry", calories: 480 }
    ]
  });

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={DietPlanAi}
            alt="Meal Plan Generator Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-green-900/60 to-emerald-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">AI Meal Plan Generator</h1>
            <p className="text-white/60">Personalized meal plans based on your goals and preferences</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Meal Plan Display */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaUtensils className="text-green-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Your Meal Plan</h2>
                </div>
                <div className="space-y-6">
                  {Object.entries(mealPlan).map(([day, meals]) => (
                    <div key={day} className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-3 capitalize">{day}</h3>
                      <div className="space-y-3">
                        {meals.map((meal, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FaHeart className="text-red-400" />
                              <div>
                                <p className="text-white font-medium">{meal.meal}</p>
                                <p className="text-white/70 text-sm">{meal.food}</p>
                              </div>
                            </div>
                            <span className="text-white/80 text-sm">{meal.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-green-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Your meal plan is well-balanced with good protein distribution.</p>
                    <p className="text-white/60 text-xs">Tip: Try adding more leafy greens for better nutrition.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider meal prepping on Sundays for easier weekdays.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaCalendarAlt className="text-green-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                    <FaPlus />
                    Generate New Plan
                  </button>
                  <button className="w-full bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    Save Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default MealPlanGenerator; 