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
import DashboardLayout from "../../components/custom/DashboardLayout.jsx";

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
      <DashboardLayout 
        title="Water Intake" 
        subtitle="Stay hydrated with smart tracking and AI recommendations"
      >
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
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
              <div className="flex items-center justify-center mb-2">
                <stat.icon className={`text-2xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.unit}</div>
              <div className="text-white/40 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Water Progress & Quick Add */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-6">Today's Progress</h3>
              
              {/* Water Bottle Visualization */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-48 bg-white/10 rounded-full border-4 border-white/20 overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(todayIntake / targetIntake) * 100}%` }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 to-blue-500 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{Math.round((todayIntake / targetIntake) * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {quickAddAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addWater(amount)}
                    className="p-3 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl hover:from-cyan-400/30 hover:to-blue-400/30 transition-all duration-200 border border-cyan-400/30"
                  >
                    <div className="text-white font-medium">+{amount}ml</div>
                  </motion.button>
                ))}
              </div>

              {/* Common Drinks */}
              <div>
                <h4 className="text-white font-medium mb-3">Common Drinks</h4>
                <div className="grid grid-cols-2 gap-3">
                  {commonDrinks.map((drink) => (
                    <motion.button
                      key={drink.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addWater(drink.amount)}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <drink.icon className="text-cyan-400" />
                      <div className="text-left">
                        <div className="text-white font-medium text-sm">{drink.name}</div>
                        <div className="text-white/60 text-xs">{drink.amount}ml</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaRobot className="text-cyan-400" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <rec.icon className={`text-sm ${
                        rec.type === 'info' ? 'text-cyan-400' :
                        rec.type === 'warning' ? 'text-orange-400' :
                        'text-green-400'
                      }`} />
                      <h4 className="text-white font-medium text-sm">{rec.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm">{rec.insight}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Average Daily</span>
                  <span className="text-white font-medium">1,850ml</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Goal Achievement</span>
                  <span className="text-white font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Best Day</span>
                  <span className="text-white font-medium">2,200ml</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Streak</span>
                  <span className="text-white font-medium">5 days</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default WaterIntake; 