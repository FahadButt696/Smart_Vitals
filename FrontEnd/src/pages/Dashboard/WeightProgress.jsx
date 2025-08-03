import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaWeight, FaChartLine, FaPlus, FaEdit, FaTrash, FaRobot } from "react-icons/fa";
import { weightTracker, WeightProgress as WeightProgressImg } from "@/assets/Assets";

const WeightProgress = () => {
  const { user } = useUser();
  const [weights, setWeights] = useState([
    { date: "2024-06-01", value: 75 },
    { date: "2024-06-08", value: 74.5 },
    { date: "2024-06-15", value: 74 },
    { date: "2024-06-22", value: 73.7 },
    { date: "2024-06-29", value: 73.2 },
  ]);

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={WeightProgressImg || weightTracker}
            alt="Weight Progress Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-cyan-900/60 to-neutral-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Weight Progress</h1>
            <p className="text-white/60">Track your weight changes and trends over time</p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weight Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center">
                <img
                  src={weightTracker}
                  alt="Weight Chart"
                  className="w-full max-w-xl rounded-xl shadow-lg mb-6"
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                />
                <div className="w-full flex flex-col gap-2">
                  {weights.map((entry, idx) => (
                    <div key={entry.date} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-white/80">
                      <span>{entry.date}</span>
                      <span className="font-bold text-white">{entry.value} kg</span>
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
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-cyan-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Keep up the good work! Your weight trend is moving towards your goal.</p>
                    <p className="text-white/60 text-xs">Tip: Consistency is key. Log your weight weekly for best results.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider reviewing your calorie intake if progress stalls.</p>
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

export default WeightProgress;