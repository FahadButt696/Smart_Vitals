import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaTint, 
  FaPlus, 
  FaMinus, 
  FaBell, 
  FaChartLine,
  FaThermometerHalf,
  FaSun,
  FaWineGlass,
  FaRobot,
  FaLightbulb
} from "react-icons/fa";

const WaterIntake = () => {
  const { user } = useUser();
  const [todayIntake, setTodayIntake] = useState(1200);
  const [targetIntake] = useState(2000);

  const quickAddAmounts = [200, 300, 500, 750];
  const commonDrinks = [
    { name: 'Water Glass', amount: 250, icon: FaWineGlass },
    { name: 'Water Bottle', amount: 500, icon: FaTint },
    { name: 'Coffee', amount: 200, icon: FaSun },
    { name: 'Tea', amount: 200, icon: FaSun },
  ];

  const hydrationStats = [
    { label: 'Today\'s Intake', value: todayIntake, unit: 'ml', icon: FaTint, color: 'from-cyan-400 to-blue-500' },
    { label: 'Target', value: targetIntake, unit: 'ml', icon: FaBell, color: 'from-purple-400 to-pink-500' },
    { label: 'Remaining', value: targetIntake - todayIntake, unit: 'ml', icon: FaChartLine, color: 'from-green-400 to-emerald-500' },
    { label: 'Progress', value: Math.round((todayIntake / targetIntake) * 100), unit: '%', icon: FaThermometerHalf, color: 'from-orange-400 to-red-500' },
  ];

  const aiRecommendations = [
    {
      title: 'Hydration Status',
      insight: 'You\'re 60% hydrated. Drink 2 more glasses to reach your goal.',
      type: 'info',
      icon: FaLightbulb
    },
    {
      title: 'Weather Alert',
      insight: 'It\'s hot today! Increase your intake by 500ml.',
      type: 'warning',
      icon: FaSun
    },
    {
      title: 'Activity Based',
      insight: 'You worked out today. Add 300ml for recovery.',
      type: 'recommendation',
      icon: FaTint
    }
  ];

  const addWater = (amount) => {
    setTodayIntake(prev => Math.min(prev + amount, targetIntake));
  };

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
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Water Intake</h1>
                <p className="text-white/60">Stay hydrated with smart tracking and AI recommendations</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                <FaBell className="inline mr-2" />
                Set Reminders
              </motion.button>
            </div>

            {/* Main Water Display */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {hydrationStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="text-white text-sm" />
                    </div>
                    <span className="text-white/60 text-sm">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/40 text-xs">{stat.unit}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Water Bottle Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Today's Hydration</h3>
                
                {/* Water Bottle Visualization */}
                <div className="flex justify-center mb-8">
                  <div className="relative w-32 h-64 bg-gradient-to-b from-cyan-400/20 to-blue-400/20 rounded-2xl border-2 border-cyan-400/30 overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-blue-400 transition-all duration-1000 ease-out"
                      style={{ height: `${(todayIntake / targetIntake) * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FaTint className="text-white/60 text-2xl" />
                    </div>
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {quickAddAmounts.map((amount, index) => (
                    <motion.button
                      key={amount}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addWater(amount)}
                      className="p-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 border border-cyan-400/30 rounded-xl text-white font-medium hover:from-cyan-400/30 hover:to-blue-400/30 transition-all duration-200"
                    >
                      +{amount}ml
                    </motion.button>
                  ))}
                </div>

                {/* Common Drinks */}
                <div className="space-y-3">
                  <h4 className="text-white font-medium mb-3">Common Drinks</h4>
                  {commonDrinks.map((drink, index) => (
                    <motion.button
                      key={drink.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addWater(drink.amount)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <drink.icon className="text-cyan-400" />
                        <span className="text-white font-medium">{drink.name}</span>
                      </div>
                      <span className="text-white/60 text-sm">{drink.amount}ml</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* AI Insights */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-cyan-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                  {aiRecommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <recommendation.icon className="text-cyan-400" />
                        <span className="text-white font-medium text-sm">{recommendation.title}</span>
                      </div>
                      <p className="text-white/80 text-sm">{recommendation.insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Weekly Progress</h3>
                <div className="space-y-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                    >
                      <span className="text-white font-medium">{day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" 
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white/60 text-sm">{Math.floor(Math.random() * 2000)}ml</span>
                      </div>
                    </motion.div>
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

export default WaterIntake; 