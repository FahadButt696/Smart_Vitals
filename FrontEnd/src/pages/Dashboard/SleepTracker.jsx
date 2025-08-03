import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBed, FaMoon, FaSun, FaClock, FaRobot, FaPlus } from "react-icons/fa";
import { SleepTracker } from "@/assets/Assets";

const SleepTrackerPage = () => {
  const { user } = useUser();
  const [sleepData, setSleepData] = useState([
    { date: "2024-06-01", hours: 7.5, quality: "Good" },
    { date: "2024-06-02", hours: 8.2, quality: "Excellent" },
    { date: "2024-06-03", hours: 6.8, quality: "Fair" },
    { date: "2024-06-04", hours: 7.9, quality: "Good" },
    { date: "2024-06-05", hours: 8.5, quality: "Excellent" },
  ]);

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={SleepTracker}
            alt="Sleep Tracker Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-purple-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Sleep Tracker</h1>
            <p className="text-white/60">Monitor your sleep patterns and quality</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sleep Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaBed className="text-blue-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Sleep Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-blue-400" />
                      <span className="text-white/80 text-sm">Average Sleep</span>
                    </div>
                    <p className="text-2xl font-bold text-white">7.8 hours</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMoon className="text-green-400" />
                      <span className="text-white/80 text-sm">Sleep Quality</span>
                    </div>
                    <p className="text-2xl font-bold text-white">Good</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {sleepData.map((entry, idx) => (
                    <div key={entry.date} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FaSun className="text-yellow-400" />
                        <span className="text-white/80">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-semibold">{entry.hours}h</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          entry.quality === 'Excellent' ? 'bg-green-500/20 text-green-300' :
                          entry.quality === 'Good' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {entry.quality}
                        </span>
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
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-blue-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Your sleep quality has improved! Keep maintaining this routine.</p>
                    <p className="text-white/60 text-xs">Tip: Try to go to bed at the same time every night.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider reducing screen time 1 hour before bed.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default SleepTrackerPage; 