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
import DashboardLayout from "../../components/custom/DashboardLayout.jsx";

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
      <DashboardLayout 
        title="Calorie Tracker" 
        subtitle="Track your daily nutrition with AI-powered insights"
      >
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
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
              className="p-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <FaSearch className="inline mr-2" />
              Search Food
            </motion.button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calorie Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Today's Nutrition</h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>

              {/* Calorie Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Calories</span>
                  <span className="text-white font-medium">{nutritionData.consumed} / {nutritionData.target}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(nutritionData.consumed / nutritionData.target) * 100}%` }}
                    className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-white/60">Remaining: {nutritionData.remaining} cal</span>
                  <span className="text-white/60">{Math.round((nutritionData.consumed / nutritionData.target) * 100)}%</span>
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {macroTargets.map((macro, index) => (
                  <motion.div
                    key={macro.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <macro.icon className={`text-2xl bg-gradient-to-r ${macro.color} bg-clip-text text-transparent`} />
                    </div>
                    <div className="text-white font-bold">{macro.current}{macro.unit}</div>
                    <div className="text-white/60 text-sm">/ {macro.target}{macro.unit}</div>
                    <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                      <div
                        className={`bg-gradient-to-r ${macro.color} h-1 rounded-full`}
                        style={{ width: `${Math.min((macro.current / macro.target) * 100, 100)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaRobot className="text-cyan-400" />
                AI Insights
              </h3>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={insight.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white/5 rounded-xl"
                  >
                    <insight.icon className={`text-lg mt-1 ${
                      insight.type === 'info' ? 'text-cyan-400' :
                      insight.type === 'warning' ? 'text-orange-400' :
                      'text-red-400'
                    }`} />
                    <div>
                      <h4 className="text-white font-medium mb-1">{insight.title}</h4>
                      <p className="text-white/70 text-sm">{insight.insight}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Quick Add */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Add</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-200"
                >
                  <FaPlus className="text-cyan-400" />
                  <span className="text-white font-medium">Add Food</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-200"
                >
                  <FaCalculator className="text-purple-400" />
                  <span className="text-white font-medium">Calculate Recipe</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-200"
                >
                  <FaChartLine className="text-green-400" />
                  <span className="text-white font-medium">View Trends</span>
                </motion.button>
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Average Calories</span>
                  <span className="text-white font-medium">1,850</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Days Tracked</span>
                  <span className="text-white font-medium">5/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Goal Achievement</span>
                  <span className="text-white font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Streak</span>
                  <span className="text-white font-medium">3 days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default CalorieTracker; 