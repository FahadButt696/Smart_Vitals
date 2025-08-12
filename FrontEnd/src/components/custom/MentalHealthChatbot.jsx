import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Bot, User, Trash2, Sparkles, Heart, Brain, AlertTriangle, Shield, BookOpen, Phone, ExternalLink } from 'lucide-react';

const MentalHealthChatbot = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [conversationInsights, setConversationInsights] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeMessages = [
    "Hello! I'm Dr. Sarah Chen, your AI mental health companion. 🌟",
    "I'm a licensed clinical psychologist with expertise in CBT, DBT, and mindfulness-based interventions.",
    "I'm here to provide evidence-based support, coping strategies, and a safe space for you to share your thoughts and feelings.",
    "How are you feeling today? I'm listening with care and professional understanding. ❤️"
  ];

  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support and suicide prevention",
      link: "https://988lifeline.org/"
    },
    {
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Text-based crisis support",
      link: "https://www.crisistextline.org/"
    },
    {
      title: "Emergency Services",
      number: "911",
      description: "Immediate emergency assistance",
      link: null
    }
  ];

  useEffect(() => {
    loadChatHistory();
    loadConversationInsights();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/mental-health/chat/${userId}`);
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setError('Failed to load chat history. Please refresh the page.');
    }
  };

  const loadConversationInsights = async () => {
    try {
      const response = await fetch(`/api/mental-health/insights/${userId}`);
      const data = await response.json();
      if (data.insights) {
        setConversationInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const newUserMessage = {
      sender: 'user',
      text: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('/api/mental-health/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message: userMessage
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.reply) {
        // Check if this is a crisis response
        if (data.isCrisis) {
          setShowCrisisResources(true);
        }

        // Simulate typing effect
        setIsTyping(true);
        setTimeout(() => {
          const botMessage = {
            sender: 'bot',
            text: data.reply,
            timestamp: new Date(),
            isCrisis: data.isCrisis,
            isFallback: data.isFallback
          };
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          
          // Reload insights after new message
          loadConversationInsights();
        }, 1000 + Math.random() * 1000); // Random delay for natural feel
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        sender: 'bot',
        text: "I'm sorry, I'm experiencing technical difficulties right now. Please try again in a moment, or if you need immediate support, consider reaching out to a mental health professional or crisis hotline. 💙",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await fetch(`/api/mental-health/chat/${userId}`, {
        method: 'DELETE'
      });
      setMessages([]);
      setShowWelcome(true);
      setShowCrisisResources(false);
      setConversationInsights(null);
    } catch (error) {
      console.error('Failed to clear chat:', error);
      setError('Failed to clear chat. Please try again.');
    }
  };

  const startNewConversation = () => {
    setShowWelcome(false);
    setMessages([]);
    setShowCrisisResources(false);
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[700px] bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Dr. Sarah Chen</h3>
            <p className="text-white/60 text-sm">Licensed Clinical Psychologist</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {conversationInsights && (
            <div className="text-right text-xs text-white/60">
              <div>{conversationInsights.totalConversations} conversations</div>
              <div>{conversationInsights.totalMessages} messages</div>
            </div>
          )}
          <button
            onClick={clearChat}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Crisis Resources Banner */}
      {showCrisisResources && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/20 border border-red-400/30 p-3"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold text-sm">Crisis Support Available</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {crisisResources.map((resource, index) => (
              <div key={index} className="bg-red-500/10 rounded-lg p-2 text-center">
                <div className="text-red-300 font-medium text-sm">{resource.title}</div>
                <div className="text-red-400 font-bold">{resource.number}</div>
                <div className="text-red-300 text-xs">{resource.description}</div>
                {resource.link && (
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-red-300 hover:text-red-200 text-xs mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Visit
                  </a>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {/* Welcome Messages */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {welcomeMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]">
                    <p className="text-white text-sm leading-relaxed">{message}</p>
                  </div>
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={startNewConversation}
                className="ml-11 px-4 py-2 bg-gradient-to-r from-purple-400 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                Start Talking 💬
              </motion.button>
            </motion.div>
          )}

          {/* Chat Messages */}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-br-md'
                  : message.isCrisis
                    ? 'bg-red-500/20 border border-red-400/30 text-white rounded-tl-md'
                    : message.isError
                      ? 'bg-orange-500/20 border border-orange-400/30 text-white rounded-tl-md'
                      : 'bg-white/10 backdrop-blur-sm text-white rounded-tl-md'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-white/40'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 text-center"
            >
              <p className="text-orange-300 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20 bg-white/5">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts and feelings..."
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isLoading || !inputMessage.trim()
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white hover:shadow-lg'
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Quick Response Suggestions */}
        {messages.length === 0 && !showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {[
              "I'm feeling anxious today",
              "I need some motivation",
              "I'm having trouble sleeping",
              "I feel overwhelmed",
              "I want to learn coping strategies",
              "I'm feeling sad"
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs rounded-lg transition-all duration-200 border border-white/20"
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Professional Disclaimer */}
        <div className="mt-3 text-center">
          <p className="text-white/40 text-xs">
            <Shield className="w-3 h-3 inline mr-1" />
            This AI companion provides support but is not a substitute for professional mental health care.
            {showCrisisResources && (
              <span className="text-red-400 ml-1">
                If you're in crisis, please use the resources above or call emergency services.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChatbot;

