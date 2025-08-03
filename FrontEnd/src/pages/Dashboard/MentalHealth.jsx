import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaBrain, FaHeart,  FaRobot,  FaSmile } from "react-icons/fa";
import { AiMental  } from "@/assets/Assets";

const MentalHealth = () => {
  const { user } = useUser();
  const [mood, setMood] = useState("Good");
  const [chatHistory, setChatHistory] = useState([
    { type: "user", message: "I've been feeling anxious lately" },
    { type: "ai", message: "I understand. Can you tell me more about what's causing this anxiety?" },
    { type: "user", message: "Work stress and lack of sleep" },
    { type: "ai", message: "That's common. Let's work on some stress management techniques together." },
  ]);

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={AiMental}
            alt="Mental Health Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-pink-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Mental Health Assistant</h1>
            <p className="text-white/60">Your AI companion for mental wellness</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-96 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <FaBrain className="text-purple-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">AI Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatHistory.map((chat, idx) => (
                    <div key={idx} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-xl ${
                        chat.type === 'user' 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
                          : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white'
                      }`}>
                        <p className="text-sm">{chat.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:opacity-80 transition-opacity">
                    Send
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Mood Tracker & AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Mood Tracker */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaHeart className="text-pink-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Mood Tracker</h3>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <FaSmile className="text-4xl text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-semibold">Current Mood: {mood}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Happy', 'Good', 'Okay', 'Sad', 'Anxious', 'Stressed'].map((moodOption) => (
                      <button
                        key={moodOption}
                        onClick={() => setMood(moodOption)}
                        className={`p-2 rounded-lg text-xs transition-all ${
                          mood === moodOption 
                            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white' 
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {moodOption}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-purple-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Based on your mood, try some deep breathing exercises.</p>
                    <p className="text-white/60 text-xs">5 minutes of focused breathing can help reduce anxiety.</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Consider taking a short walk outside for fresh air.</p>
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

export default MentalHealth; 