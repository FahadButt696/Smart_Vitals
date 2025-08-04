import React from "react";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FaDumbbell, 
  FaPlus, 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaEdit,
  FaTrash,
  FaClock,
  FaFire,
  FaHeart,
  FaChartLine,
  FaRobot,
  FaLightbulb,
  FaTrophy,
  FaRunning,
} from "react-icons/fa";
import DashboardLayout from "../../components/custom/DashboardLayout.jsx";

const WorkoutLogger = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('today');
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);

  const workoutTypes = [
    { id: 'strength', label: 'Strength', icon: FaDumbbell, color: 'from-purple-400 to-pink-500' },
    { id: 'cardio', label: 'Cardio', icon: FaRunning, color: 'from-cyan-400 to-blue-500' },
    { id: 'yoga', label: 'Yoga', icon: FaHeart, color: 'from-green-400 to-emerald-500' },
    { id: 'sports', label: 'Sports', icon: FaTrophy, color: 'from-orange-400 to-red-500' },
  ];

  const todayWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      type: 'strength',
      duration: '45 min',
      calories: 320,
      exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'],
      time: '09:00',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Morning Cardio',
      type: 'cardio',
      duration: '30 min',
      calories: 280,
      exercises: ['Running', 'Cycling'],
      time: '07:30',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Core Workout',
      type: 'strength',
      duration: '20 min',
      calories: 150,
      exercises: ['Planks', 'Crunches', 'Russian Twists'],
      time: '18:00',
      status: 'scheduled'
    }
  ];

  const workoutStats = [
    { label: 'This Week', value: '5', unit: 'workouts', icon: FaDumbbell, color: 'from-cyan-400 to-blue-500' },
    { label: 'Total Time', value: '4.5', unit: 'hours', icon: FaClock, color: 'from-purple-400 to-pink-500' },
    { label: 'Calories Burned', value: '2,450', unit: 'cal', icon: FaFire, color: 'from-orange-400 to-red-500' },
    { label: 'Streak', value: '7', unit: 'days', icon: FaTrophy, color: 'from-green-400 to-emerald-500' },
  ];

  const aiSuggestions = [
    {
      title: 'Based on your goals',
      suggestion: 'Try HIIT training for better fat burn',
      reason: 'You want to lose weight',
      icon: FaLightbulb
    },
    {
      title: 'Recovery recommendation',
      suggestion: 'Take a rest day tomorrow',
      reason: 'You\'ve worked out 5 days in a row',
      icon: FaHeart
    },
    {
      title: 'Progressive overload',
      suggestion: 'Increase weights by 5% next session',
      reason: 'You\'ve hit your reps consistently',
      icon: FaChartLine
    }
  ];

  return (
    <SignedIn>
      <DashboardLayout 
        title="Workout Logger" 
        subtitle="Track your fitness journey with AI-powered insights"
      >
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddWorkout(true)}
            className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            <FaPlus className="inline mr-2" />
            Add Workout
          </motion.button>
        </div>

        {/* Workout Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {workoutStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`text-xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                <span className="text-white/60 text-sm">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/40 text-xs">{stat.unit}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Workout List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex gap-4 mb-6">
                {workoutTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 ${
                      activeTab === type.id
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
                {todayWorkouts
                  .filter(workout => workout.type === activeTab)
                  .map((workout, index) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{workout.name}</h3>
                        <div className="flex items-center gap-4 text-white/60 text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {workout.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaFire className="text-xs" />
                            {workout.calories} cal
                          </span>
                          <span className="flex items-center gap-1">
                            <FaDumbbell className="text-xs" />
                            {workout.duration}
                          </span>
                        </div>
                        <div className="text-white/50 text-xs mt-2">
                          {workout.exercises.join(', ')}
                        </div>
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

          {/* AI Suggestions & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* AI Suggestions */}
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaRobot className="text-cyan-400" />
                AI Suggestions
              </h3>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <suggestion.icon className="text-cyan-400 text-sm" />
                      <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-1">{suggestion.suggestion}</p>
                    <p className="text-white/50 text-xs">{suggestion.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-xl hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-200"
                >
                  <FaPlay className="text-cyan-400" />
                  <span className="text-white font-medium">Start Workout</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-200"
                >
                  <FaChartLine className="text-purple-400" />
                  <span className="text-white font-medium">View Progress</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-xl hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-200"
                >
                  <FaTrophy className="text-green-400" />
                  <span className="text-white font-medium">Set Goals</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Add Workout Modal */}
        <AnimatePresence>
          {showAddWorkout && (
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
                <h2 className="text-2xl font-bold mb-6">Add New Workout</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2">Workout Name</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter workout name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter duration"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowAddWorkout(false)}
                      className="flex-1 p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowAddWorkout(false)}
                      className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      Add Workout
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </SignedIn>
  );
};

export default WorkoutLogger; 