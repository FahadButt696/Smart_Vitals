import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChartLine, FaChartPie, FaChartBar, FaRobot } from "react-icons/fa";
import { Chart } from "@/assets/Assets";

const Analytics = () => {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState({
    calories: { current: 1850, target: 2000, trend: "up" },
    weight: { current: 73.2, target: 70, trend: "down" },
    workouts: { current: 4, target: 5, trend: "up" },
    sleep: { current: 7.8, target: 8, trend: "stable" }
  });

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={Chart}
            alt="Analytics Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-teal-900/60 to-cyan-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Health Analytics</h1>
            <p className="text-white/60">Comprehensive insights into your health journey</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analytics Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaChartLine className="text-teal-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Key Metrics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analyticsData).map(([key, data]) => (
                    <div key={key} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold capitalize">{key}</h3>
                        <FaChartPie className={`text-lg ${
                          data.trend === 'up' ? 'text-green-400' : 
                          data.trend === 'down' ? 'text-red-400' : 'text-yellow-400'
                        }`} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Current</span>
                          <span className="text-white font-bold">{data.current}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60 text-sm">Target</span>
                          <span className="text-white/80">{data.target}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-teal-400 to-cyan-400 h-2 rounded-full"
                            style={{ width: `${Math.min((data.current / data.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
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
              <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-xl border border-teal-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-teal-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Your calorie intake is on track! Great job staying within your target.</p>
                    <p className="text-white/60 text-xs">Consider adding more protein to your diet.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Weight loss is progressing well. Keep up the consistent effort.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Try to increase workout frequency to meet your weekly goal.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-xl border border-teal-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
                    <FaChartPie />
                    Export Data
                  </button>
                  <button className="w-full bg-white/10 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">
                    Share Analytics
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

export default Analytics; 