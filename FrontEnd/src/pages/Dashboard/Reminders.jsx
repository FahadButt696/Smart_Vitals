import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBell, FaClock, FaPlus, FaRobot, FaCheck, FaTrash } from "react-icons/fa";
import { track } from "@/assets/Assets";

const Reminders = () => {
  const { user } = useUser();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Take medication",
      time: "09:00 AM",
      type: "Health",
      completed: false
    },
    {
      id: 2,
      title: "Drink water",
      time: "10:00 AM",
      type: "Hydration",
      completed: true
    },
    {
      id: 3,
      title: "Workout session",
      time: "06:00 PM",
      type: "Fitness",
      completed: false
    },
    {
      id: 4,
      title: "Sleep reminder",
      time: "10:00 PM",
      type: "Sleep",
      completed: false
    }
  ]);

  const toggleReminder = (id) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={track}
            alt="Reminders Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-amber-900/60 to-orange-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Health Reminders</h1>
            <p className="text-white/60">Stay on track with your health goals</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reminders List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-amber-400 text-2xl" />
                    <h2 className="text-xl font-bold text-white">Your Reminders</h2>
                  </div>
                  <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:opacity-80 transition-opacity flex items-center gap-2">
                    <FaPlus />
                    Add Reminder
                  </button>
                </div>
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className={`bg-white/5 rounded-xl p-4 transition-all duration-200 ${
                      reminder.completed ? 'opacity-60' : 'hover:bg-white/10'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              reminder.completed 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-white/40 hover:border-white/60'
                            }`}
                          >
                            {reminder.completed && <FaCheck className="text-white text-xs" />}
                          </button>
                          <div>
                            <h3 className={`font-semibold ${reminder.completed ? 'line-through text-white/60' : 'text-white'}`}>
                              {reminder.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <FaClock className="text-amber-400 text-sm" />
                              <span className="text-white/60 text-sm">{reminder.time}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                reminder.type === 'Health' ? 'bg-red-500/20 text-red-300' :
                                reminder.type === 'Hydration' ? 'bg-blue-500/20 text-blue-300' :
                                reminder.type === 'Fitness' ? 'bg-green-500/20 text-green-300' :
                                'bg-purple-500/20 text-purple-300'
                              }`}>
                                {reminder.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all">
                          <FaTrash className="text-white/60 hover:text-red-400" />
                        </button>
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
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-amber-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Great job completing your hydration reminder!</p>
                    <p className="text-white/60 text-xs">Keep up the consistent water intake.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider setting a reminder for meal prep this weekend.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Don't forget to schedule your next health checkup.</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl border border-amber-400/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Completed Today</span>
                    <span className="text-white font-bold">1/4</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">This Week</span>
                    <span className="text-white font-bold">12/20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Success Rate</span>
                    <span className="text-green-400 font-bold">85%</span>
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

export default Reminders; 