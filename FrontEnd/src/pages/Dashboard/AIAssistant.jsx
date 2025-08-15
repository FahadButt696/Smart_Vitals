import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, Brain, TrendingUp, Lightbulb } from 'lucide-react';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hello! I\'m your AI health assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: 'I understand your question. Let me provide you with some helpful insights based on your health data.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const healthInsights = [
    {
      title: 'Hydration Status',
      description: 'You\'re 80% towards your daily water goal. Great progress!',
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      title: 'Sleep Quality',
      description: 'Your sleep pattern shows improvement. Keep up the good work!',
      icon: Brain,
      color: 'from-purple-400 to-pink-400'
    },
    {
      title: 'Nutrition Balance',
      description: 'Consider adding more protein to your next meal.',
      icon: Lightbulb,
      color: 'from-green-400 to-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* AI Chat Interface */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Bot className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Health Assistant</h3>
            <p className="text-white/60">Ask me anything about your health</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 custom-scrollbar">
          {chatHistory.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                chat.type === 'user' 
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white' 
                  : 'bg-white/10 text-white border border-white/20'
              }`}>
                <p className="text-sm">{chat.message}</p>
                <p className="text-xs opacity-60 mt-2">
                  {chat.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your health..."
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Health Insights */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="text-cyan-400" />
          AI Health Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="ai-assistant-card p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center mb-3`}>
                <insight.icon className="text-white text-xl" />
              </div>
              <h4 className="text-white font-semibold mb-2">{insight.title}</h4>
              <p className="text-white/70 text-sm">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="ai-assistant-btn p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Generate Health Report</h4>
            <p className="text-white/60 text-sm">Get a comprehensive overview of your health status</p>
          </button>
          <button className="ai-assistant-btn p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left">
            <h4 className="text-white font-semibold mb-2">Nutrition Advice</h4>
            <p className="text-white/60 text-sm">Get personalized nutrition recommendations</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 