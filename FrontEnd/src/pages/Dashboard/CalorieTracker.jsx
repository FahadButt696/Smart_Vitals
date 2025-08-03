import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaCalculator, 
  FaCamera, 
  FaSearch, 
  FaPlus, 
  FaFire,
  FaBreadSlice,
  FaTint,
  FaLeaf,
  FaChartLine,
  FaBullseye,
  FaRobot,
  FaLightbulb
} from "react-icons/fa";

const CalorieTracker = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const nutritionData = {
    consumed: 1850,
    target: 2000,
    remaining: 150,
    protein: 85,
    carbs: 220,
    fat: 65,
    fiber: 25,
    sugar: 45
  };

  const macroTargets = [
    { name: 'Protein', current: 85, target: 120, unit: 'g', color: 'from-green-400 to-emerald-500', icon: FaBreadSlice },
    { name: 'Carbs', current: 220, target: 250, unit: 'g', color: 'from-blue-400 to-cyan-500', icon: FaTint },
    { name: 'Fat', current: 65, target: 65, unit: 'g', color: 'from-purple-400 to-pink-500', icon: FaLeaf },
    { name: 'Fiber', current: 25, target: 30, unit: 'g', color: 'from-orange-400 to-red-500', icon: FaFire },
  ];

  const aiInsights = [
    {
      title: 'Calorie Balance',
      insight: 'You\'re 150 calories under your target. Consider a healthy snack.',
      type: 'info',
      icon: FaBullseye
    },
    {
      title: 'Protein Intake',
      insight: 'You\'re 35g short on protein. Try adding lean meat or legumes.',
      type: 'warning',
      icon: FaBreadSlice
    },
    {
      title: 'Sugar Alert',
      insight: 'Your sugar intake is high. Consider reducing processed foods.',
      type: 'alert',
      icon: FaLightbulb
    }
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
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Calorie Tracker</h1>
                <p className="text-white/60">Track your daily nutrition with AI-powered insights</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <FaCamera className="inline mr-2" />
                  Scan Food
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <FaPlus className="inline mr-2" />
                  Add Food
                </motion.button>
              </div>
            </div>

            {/* Main Calorie Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{nutritionData.consumed}</div>
                <div className="text-white/60 text-sm">Calories Consumed</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-4">
                  <div 
                    className="h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300" 
                    style={{ width: `${(nutritionData.consumed / nutritionData.target) * 100}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{nutritionData.remaining}</div>
                <div className="text-white/60 text-sm">Calories Remaining</div>
                <div className="text-green-400 text-sm mt-2">On track!</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{nutritionData.target}</div>
                <div className="text-white/60 text-sm">Daily Target</div>
                <div className="text-cyan-400 text-sm mt-2">Based on your goals</div>
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Macro Tracking */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Macro Nutrients</h3>
                <div className="space-y-4">
                  {macroTargets.map((macro, index) => (
                    <motion.div
                      key={macro.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${macro.color}`}>
                            <macro.icon className="text-white text-sm" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{macro.name}</p>
                            <p className="text-white/60 text-sm">{macro.current}/{macro.target} {macro.unit}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{Math.round((macro.current / macro.target) * 100)}%</div>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 bg-gradient-to-r ${macro.color} rounded-full transition-all duration-300`}
                          style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-cyan-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <insight.icon className="text-cyan-400" />
                        <span className="text-white font-medium text-sm">{insight.title}</span>
                      </div>
                      <p className="text-white/80 text-sm">{insight.insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Add */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Add</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Apple', calories: 95, macros: '0.5g protein, 25g carbs' },
                    { name: 'Chicken Breast', calories: 165, macros: '31g protein, 0g carbs' },
                    { name: 'Greek Yogurt', calories: 130, macros: '17g protein, 9g carbs' },
                    { name: 'Almonds', calories: 160, macros: '6g protein, 6g carbs' },
                  ].map((food, index) => (
                    <motion.button
                      key={food.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div>
                        <span className="text-white font-medium">{food.name}</span>
                        <p className="text-white/60 text-xs">{food.macros}</p>
                      </div>
                      <span className="text-white/60 text-sm">{food.calories} cal</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default CalorieTracker; 