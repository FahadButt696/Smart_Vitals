import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaRobot, FaPlay, FaPause } from "react-icons/fa";
import { logoChat } from "@/assets/Assets";

const VoiceAssistant = () => {
  const { user } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([
    {
      id: 1,
      type: "user",
      message: "What's my calorie goal for today?",
      timestamp: "2:30 PM"
    },
    {
      id: 2,
      type: "assistant",
      message: "Your daily calorie goal is 2000 calories. You've consumed 1850 so far, so you have 150 calories remaining.",
      timestamp: "2:30 PM"
    },
    {
      id: 3,
      type: "user",
      message: "Remind me to take my medication",
      timestamp: "2:31 PM"
    },
    {
      id: 4,
      type: "assistant",
      message: "I've set a reminder for your medication at 9:00 PM. Is there anything else you need?",
      timestamp: "2:31 PM"
    }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={logoChat}
            alt="Voice Assistant Background"
            className="w-full h-full object-cover object-center opacity-30"
            style={{ filter: 'brightness(0.4) contrast(1.2) saturate(0.8)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-violet-900/60 to-purple-900/80"></div>
        </div>
        <div className="relative z-10 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Voice Assistant</h1>
            <p className="text-white/60">Your AI health companion with voice interaction</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Voice Interface */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 h-96 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-violet-400 text-2xl" />
                  <h2 className="text-xl font-bold text-white">Voice Chat</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {conversation.map((chat) => (
                    <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-xl ${
                        chat.type === 'user' 
                          ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-white' 
                          : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white'
                      }`}>
                        <p className="text-sm">{chat.message}</p>
                        <p className="text-xs text-white/50 mt-1">{chat.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isListening 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                        : 'bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-80'
                    }`}
                  >
                    {isListening ? <FaMicrophoneSlash className="text-white text-xl" /> : <FaMicrophone className="text-white text-xl" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">
                      {isListening ? "Listening..." : "Tap the microphone to start speaking"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Voice Commands & AI Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Voice Commands */}
              <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-xl border border-violet-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaMicrophone className="text-violet-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Voice Commands</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-white text-sm font-medium">"What's my calorie goal?"</p>
                    <p className="text-white/60 text-xs">Get your daily nutrition info</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-white text-sm font-medium">"Log my workout"</p>
                    <p className="text-white/60 text-xs">Quick workout logging</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-white text-sm font-medium">"Set a reminder"</p>
                    <p className="text-white/60 text-xs">Create health reminders</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-white text-sm font-medium">"How's my progress?"</p>
                    <p className="text-white/60 text-xs">Get progress summary</p>
                  </div>
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-xl border border-violet-400/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaRobot className="text-violet-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">AI Suggestions</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Try saying "What should I eat today?" for meal suggestions.</p>
                    <p className="text-white/60 text-xs">Voice commands make tracking easier!</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200">
                    <p className="text-white text-sm mb-1">Use "Start workout timer" for timed exercise sessions.</p>
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

export default VoiceAssistant; 