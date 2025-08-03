import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FaUtensils, 
  FaCamera, 
  FaSearch, 
  FaPlus, 
  FaTrash, 
  FaEdit,
  FaClock,
  FaFire,
  FaTint,
  FaBreadSlice,
  FaAppleAlt,
  FaHamburger,
  FaPizzaSlice,
  FaCoffee,
  FaLeaf
} from "react-icons/fa";

const MealLogger = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('today');
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: FaBreadSlice, color: 'from-orange-400 to-yellow-500' },
    { id: 'lunch', label: 'Lunch', icon: FaHamburger, color: 'from-green-400 to-emerald-500' },
    { id: 'dinner', label: 'Dinner', icon: FaPizzaSlice, color: 'from-purple-400 to-pink-500' },
    { id: 'snacks', label: 'Snacks', icon: FaAppleAlt, color: 'from-cyan-400 to-blue-500' },
  ];

  const todayMeals = [
    {
      id: 1,
      name: 'Oatmeal with Berries',
      type: 'breakfast',
      time: '08:30',
      calories: 320,
      protein: 12,
      carbs: 45,
      fat: 8,
      image: '🍓'
    },
    {
      id: 2,
      name: 'Grilled Chicken Salad',
      type: 'lunch',
      time: '12:30',
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 22,
      image: '🥗'
    },
    {
      id: 3,
      name: 'Greek Yogurt with Nuts',
      type: 'snacks',
      time: '15:45',
      calories: 180,
      protein: 15,
      carbs: 12,
      fat: 10,
      image: '🥜'
    }
  ];

  const nutritionSummary = {
    totalCalories: 950,
    targetCalories: 2000,
    protein: 62,
    carbs: 72,
    fat: 40,
    water: 1200
  };

  const quickAddFoods = [
    { name: 'Apple', calories: 95, icon: FaAppleAlt },
    { name: 'Banana', calories: 105, icon: FaAppleAlt },
    { name: 'Coffee', calories: 5, icon: FaCoffee },
    { name: 'Salad', calories: 150, icon: FaLeaf },
  ];

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><radialGradient id="a" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="%230ea5e9" stop-opacity="0.1"/><stop offset="100%" stop-color="%238b5cf6" stop-opacity="0.05"/></radialGradient><pattern id="b" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" fill-opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23a)"/><rect width="100%" height="100%" fill="url(%23b)"/></svg>')`,
              filter: 'brightness(0.3) contrast(1.2) saturate(0.8)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-cyan-900/60 to-neutral-900/80"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Meal Logger</h1>
                <p className="text-white/60">Track your meals and nutrition with AI-powered recognition</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddMeal(true)}
                className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <FaPlus className="inline mr-2" />
                Add Meal
              </motion.button>
            </div>

            {/* Nutrition Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaFire className="text-orange-400" />
                  <span className="text-white/60 text-sm">Calories</span>
                </div>
                <div className="text-2xl font-bold text-white">{nutritionSummary.totalCalories}</div>
                <div className="text-white/40 text-xs">/ {nutritionSummary.targetCalories}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaBreadSlice className="text-green-400" />
                  <span className="text-white/60 text-sm">Protein</span>
                </div>
                <div className="text-2xl font-bold text-white">{nutritionSummary.protein}g</div>
                <div className="text-white/40 text-xs">Target: 80g</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                                          <FaTint className="text-blue-400" />
                  <span className="text-white/60 text-sm">Carbs</span>
                </div>
                <div className="text-2xl font-bold text-white">{nutritionSummary.carbs}g</div>
                <div className="text-white/40 text-xs">Target: 250g</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <FaLeaf className="text-purple-400" />
                  <span className="text-white/60 text-sm">Fat</span>
                </div>
                <div className="text-2xl font-bold text-white">{nutritionSummary.fat}g</div>
                <div className="text-white/40 text-xs">Target: 65g</div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Meal List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex gap-4 mb-6">
                  {mealTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMealType(type.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                        selectedMealType === type.id
                          ? 'bg-gradient-to-r ' + type.color + ' text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <type.icon />
                      <span className="font-medium">{type.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="space-y-4">
                  {todayMeals
                    .filter(meal => meal.type === selectedMealType)
                    .map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="text-3xl">{meal.image}</div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{meal.name}</h3>
                          <div className="flex items-center gap-4 text-white/60 text-sm">
                            <span className="flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {meal.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaFire className="text-xs" />
                              {meal.calories} cal
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-white/60 text-sm">
                          <div>P: {meal.protein}g</div>
                          <div>C: {meal.carbs}g</div>
                          <div>F: {meal.fat}g</div>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-cyan-400 hover:bg-cyan-400/20 rounded-lg transition-all duration-200"
                          >
                            <FaEdit className="text-sm" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-200"
                          >
                            <FaTrash className="text-sm" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Add & AI Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Quick Add */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Add</h3>
                <div className="space-y-3">
                  {quickAddFoods.map((food, index) => (
                    <motion.button
                      key={food.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <food.icon className="text-cyan-400" />
                        <span className="text-white font-medium">{food.name}</span>
                      </div>
                      <span className="text-white/60 text-sm">{food.calories} cal</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* AI Features */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">AI Features</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-200"
                  >
                    <FaCamera className="text-cyan-400" />
                    <span className="text-white font-medium">Photo Recognition</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-200"
                  >
                    <FaSearch className="text-purple-400" />
                    <span className="text-white font-medium">Voice Search</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-200"
                  >
                    <FaLeaf className="text-green-400" />
                    <span className="text-white font-medium">Nutrition Analysis</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Add Meal Modal */}
        <AnimatePresence>
          {showAddMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8 w-[90%] max-w-md border border-white/20"
              >
                <h2 className="text-2xl font-bold mb-6">Add New Meal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Meal Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter meal name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Calories</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter calories"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowAddMeal(false)}
                      className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowAddMeal(false)}
                      className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Add Meal
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SignedIn>
  );
};

export default MealLogger; 