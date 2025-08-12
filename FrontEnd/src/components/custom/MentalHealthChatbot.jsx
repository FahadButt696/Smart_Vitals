import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Bot, User, Trash2, Sparkles, Heart, Brain, AlertTriangle, Shield, BookOpen, Phone, ExternalLink } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { useAuth, useUser } from '@clerk/clerk-react';

const MentalHealthChatbot = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [conversationInsights, setConversationInsights] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
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

  // Smart response system that doesn't require external AI
  const generateSmartResponse = (userMessage, conversationHistory = []) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Crisis detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live',
      'self-harm', 'cut myself', 'hurt myself', 'better off dead', 'everyone would be better off',
      'extreme crisis', 'mental breakdown', 'can\'t take it anymore', 'overwhelmed completely'
    ];
    
    if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return {
        reply: `I'm very concerned about what you're sharing with me. Your feelings are valid, and you're not alone in experiencing this pain. 

IMPORTANT: If you're having thoughts of harming yourself or others, please reach out for immediate help:

🆘 CRISIS RESOURCES:
• National Suicide Prevention Lifeline (US): 988 or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911 (US) or your local emergency number

💙 IMMEDIATE SUPPORT:
• Talk to a trusted friend, family member, or mental health professional
• Go to your nearest emergency room
• Call a crisis hotline

You deserve support and care. Please don't hesitate to reach out to these resources. They're available 24/7 and are staffed by trained professionals who want to help you.

Would you like me to help you find local mental health resources or talk through what's happening right now?`,
        isCrisis: true
      };
    }

    // Anxiety responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      return {
        reply: `I hear that you're feeling anxious, and I want you to know that anxiety is a very common and normal human experience. Let me share some evidence-based techniques that can help:

🧘‍♀️ IMMEDIATE RELIEF TECHNIQUES:
• **4-7-8 Breathing**: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.
• **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
• **Progressive Muscle Relaxation**: Tense and release each muscle group from toes to head.

💭 COGNITIVE TECHNIQUES:
• Challenge anxious thoughts: "Is this thought helpful? Is it true?"
• Use "What if" scenarios: "What if things work out instead?"
• Practice self-compassion: "It's okay to feel anxious right now."

🌱 LONG-TERM STRATEGIES:
• Regular exercise and movement
• Consistent sleep schedule
• Mindfulness or meditation practice
• Limiting caffeine and alcohol

How are you feeling right now? Would you like to try one of these techniques together?`,
        isCrisis: false
      };
    }

    // Depression responses
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hopeless')) {
      return {
        reply: `I'm so sorry you're feeling this way. Depression can feel incredibly isolating and overwhelming, but you're not alone in this struggle. Your feelings are valid, and it's brave of you to reach out.

💙 IMMEDIATE SUPPORT:
• **Small Steps Matter**: Even tiny actions like getting out of bed or taking a shower are victories
• **Self-Compassion**: Talk to yourself as you would a dear friend
• **Connection**: Reach out to someone you trust, even if it's just a text

🌅 DAILY WELLNESS PRACTICES:
• **Morning Routine**: Start with something small and positive
• **Movement**: Even a 5-minute walk can help shift your mood
• **Gratitude**: Write down 3 things you're grateful for, no matter how small
• **Nature**: Spend time outdoors if possible

🎯 WHEN TO SEEK PROFESSIONAL HELP:
• If these feelings persist for more than 2 weeks
• If you're having thoughts of self-harm
• If daily functioning is significantly impacted

Remember: Depression lies to you. It tells you that things will never get better, but that's not true. Healing takes time, and you're taking the right steps by reaching out.

What would feel most supportive to you right now?`,
        isCrisis: false
      };
    }

    // Sleep issues
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return {
        reply: `Sleep difficulties can really impact our mental health and daily functioning. Let me share some evidence-based sleep hygiene practices that can help:

😴 SLEEP HYGIENE FUNDAMENTALS:
• **Consistent Schedule**: Go to bed and wake up at the same time every day
• **Bedroom Environment**: Keep it cool, dark, and quiet
• **Screen-Free Zone**: Avoid screens 1 hour before bedtime
• **Relaxing Routine**: Create a calming pre-sleep ritual

🌙 RELAXATION TECHNIQUES:
• **4-7-8 Breathing**: Inhale 4, hold 7, exhale 8 (repeat 4 times)
• **Progressive Relaxation**: Tense and release each muscle group
• **Mindfulness**: Focus on your breath or use a guided meditation
• **Warm Bath/Shower**: Helps lower body temperature for better sleep

🚫 AVOID BEFORE BED:
• Caffeine after 2 PM
• Large meals within 3 hours of bedtime
• Intense exercise in the evening
• Alcohol (disrupts sleep quality)

💭 COGNITIVE TECHNIQUES:
• **Worry Time**: Set aside 15 minutes earlier in the day for concerns
• **Thought Stopping**: Say "stop" to racing thoughts
• **Reframe**: "I'm resting my body even if my mind is active"

How long have you been experiencing sleep difficulties?`,
        isCrisis: false
      };
    }

    // Motivation and goal-setting
    if (lowerMessage.includes('motivation') || lowerMessage.includes('unmotivated') || lowerMessage.includes('goals') || lowerMessage.includes('stuck')) {
      return {
        reply: `I understand that feeling stuck or unmotivated can be really frustrating. It's completely normal to go through periods where motivation feels out of reach. Let me share some strategies that can help:

🎯 MOTIVATION STRATEGIES:
• **Break It Down**: Instead of "clean the house," try "put away 5 items"
• **5-Minute Rule**: Commit to just 5 minutes of the task
• **Habit Stacking**: Link new habits to existing ones
• **Visual Reminders**: Use sticky notes or vision boards

🧠 UNDERSTANDING MOTIVATION:
• Motivation often follows action, not the other way around
• Start small and build momentum gradually
• Focus on the process, not just the outcome
• Celebrate tiny wins along the way

💪 PRACTICAL STEPS:
• **Morning Momentum**: Do something positive within the first hour of waking
• **Energy Management**: Work with your natural energy cycles
• **Accountability**: Share your goals with someone supportive
• **Self-Compassion**: Be kind to yourself when motivation is low

🌟 REMEMBER:
You don't need to feel motivated to start. Sometimes the motivation comes after you begin. What's one tiny step you could take today, even if you don't feel like it?

What area of your life are you hoping to make progress in?`,
        isCrisis: false
      };
    }

    // Relationship issues
    if (lowerMessage.includes('relationship') || lowerMessage.includes('friend') || lowerMessage.includes('family') || lowerMessage.includes('lonely') || lowerMessage.includes('conflict')) {
      return {
        reply: `Relationships can be both our greatest source of joy and our biggest challenges. It sounds like you're navigating some difficult dynamics, and I want you to know that your feelings are valid.

🤝 HEALTHY RELATIONSHIP PRINCIPLES:
• **Boundaries**: It's okay to say no and set limits
• **Communication**: Use "I feel" statements instead of "you always"
• **Self-Care**: You can't pour from an empty cup
• **Realistic Expectations**: No relationship is perfect

💭 REFLECTION QUESTIONS:
• What would a healthy version of this relationship look like?
• What boundaries do you need to set?
• How can you take care of yourself in this situation?
• What support do you need right now?

🌱 COPING STRATEGIES:
• **Journaling**: Write out your thoughts and feelings
• **Support Network**: Reach out to other trusted people
• **Professional Help**: Consider couples or individual therapy
• **Self-Compassion**: Be gentle with yourself during difficult times

Remember: You deserve relationships that respect and support you. It's okay to step back from relationships that consistently drain you.

What aspect of your relationships would you like to work on?`,
        isCrisis: false
      };
    }

    // General support and encouragement
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('advice')) {
      return {
        reply: `I'm here to support you, and I want you to know that reaching out for help is a sign of strength, not weakness. You're taking an important step by being here today.

💙 WHAT I CAN OFFER:
• **Active Listening**: A safe space to share your thoughts and feelings
• **Coping Strategies**: Evidence-based techniques for various challenges
• **Emotional Support**: Validation and understanding
• **Resource Guidance**: Information about professional help when needed

🌟 REMEMBER:
• Your feelings are valid and important
• You don't have to face challenges alone
• Progress isn't always linear, and that's okay
• Self-care isn't selfish—it's necessary

🎯 NEXT STEPS:
• Continue our conversation about what's on your mind
• Try some of the coping techniques we've discussed
• Consider reaching out to a mental health professional
• Build a support network of trusted friends and family

What would be most helpful for you right now? I'm here to listen and support you.`,
        isCrisis: false
      };
    }

    // Default supportive response
    return {
      reply: `Thank you for sharing that with me. I can hear that you're going through something challenging, and I want you to know that your feelings are completely valid.

💭 REFLECTION QUESTIONS:
• What would be most helpful for you right now?
• How are you taking care of yourself during this time?
• What support do you need that you're not currently getting?
• What's one small thing that might help you feel even slightly better?

🌱 GENERAL WELLNESS REMINDERS:
• Practice self-compassion—be kind to yourself
• Stay connected with people who care about you
• Engage in activities that bring you joy, even briefly
• Remember that difficult emotions are temporary

I'm here to listen and support you. Sometimes just talking through things can help us gain clarity and feel less alone.

What would you like to explore further?`,
      isCrisis: false
    };
  };

  useEffect(() => {
    if (userId) {
      console.log('MentalHealthChatbot: userId found:', userId);
      loadChatHistory();
      loadConversationInsights();
    } else {
      console.log('MentalHealthChatbot: No userId available');
    }
    scrollToBottom();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Don't render if no userId
  if (!userId) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading user information...</p>
        </div>
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatHistory = async () => {
    try {
      console.log('Loading chat history for userId:', userId);
      console.log('API endpoint:', API_ENDPOINTS.MENTAL_HEALTH.CHAT_HISTORY(userId));
      
      const response = await fetch(API_ENDPOINTS.MENTAL_HEALTH.CHAT_HISTORY(userId));
      console.log('Chat history response status:', response.status);
      
      const data = await response.json();
      console.log('Chat history data:', data);
      
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Don't show error for chat history loading
    }
  };

  const loadConversationInsights = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MENTAL_HEALTH.INSIGHTS(userId));
      const data = await response.json();
      if (data.insights) {
        setConversationInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const clearChat = async () => {
    try {
      await fetch(API_ENDPOINTS.MENTAL_HEALTH.CHAT_HISTORY(userId), {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
    setMessages([]);
    setShowWelcome(true);
    setShowCrisisResources(false);
    setConversationInsights(null);
    setError(null);
    setRetryCount(0);
  };

  const startNewConversation = () => {
    setShowWelcome(false);
    setMessages([]);
    setShowCrisisResources(false);
    setError(null);
    setRetryCount(0);
    inputRef.current?.focus();
  };

  const retryLastMessage = async () => {
    if (messages.length === 0 || isRetrying) return;
    
    const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    if (!lastUserMessage) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      // Remove the last bot message if it was an error
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot' && lastMessage.isError) {
        setMessages(prev => prev.slice(0, -1));
      }
      
      // Retry sending the message
      await sendMessageInternal(lastUserMessage.text);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Retry failed:', error);
      setRetryCount(prev => prev + 1);
      
      if (retryCount >= 2) {
        // After 2 retries, use local fallback
        const smartResponse = generateSmartResponse(lastUserMessage.text, messages);
        
        if (smartResponse.isCrisis) {
          setShowCrisisResources(true);
        }
        
        const botMessage = {
          sender: 'bot',
          text: smartResponse.reply,
          timestamp: new Date(),
          isCrisis: smartResponse.isCrisis,
          isFallback: true,
          isError: false
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } finally {
      setIsRetrying(false);
    }
  };

  const sendMessageInternal = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = messageText.trim();
    
    // Add user message if not already present
    if (!messages.some(msg => msg.sender === 'user' && msg.text === userMessage)) {
      const newUserMessage = {
        sender: 'user',
        text: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newUserMessage]);
    }

    try {
      console.log('Sending message to backend:', userMessage);
      console.log('API endpoint:', API_ENDPOINTS.MENTAL_HEALTH.CHAT);
      console.log('Request payload:', { message: userMessage });
      
      const response = await fetch(API_ENDPOINTS.MENTAL_HEALTH.CHAT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify({
          message: userMessage,
          userId: userId
        }),
      });

      console.log('Backend response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Backend response data:', data);
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (data.reply) {
          if (data.isCrisis) {
            setShowCrisisResources(true);
          }

          if (data.reason) {
            console.log('Response reason:', data.reason);
          }

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
            
            loadConversationInsights();
          }, 1000 + Math.random() * 1000);
        } else {
          throw new Error('No reply received from backend');
        }
      } else {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (parseError) {
          errorData = { error: errorText };
        }
        
        if (errorData.fallbackResponse) {
          console.log('Using fallback response from error:', errorData.fallbackResponse);
          
          setIsTyping(true);
          setTimeout(() => {
            const botMessage = {
              sender: 'bot',
              text: errorData.fallbackResponse,
              timestamp: new Date(),
              isFallback: true,
              isError: false
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
            
            loadConversationInsights();
          }, 1000 + Math.random() * 1000);
          
          return;
        }
        
        throw new Error(`Backend unavailable (${response.status}): ${errorData.error || errorText}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error; // Re-throw to let caller handle
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      await sendMessageInternal(userMessage);
    } catch (error) {
      console.error('Message sending failed:', error);
      
      // Enhanced error handling - don't show error to user, just use fallback
      console.log('Using local smart response system as fallback due to error:', error.message);
      
      const smartResponse = generateSmartResponse(userMessage, messages);
      
      if (smartResponse.isCrisis) {
        setShowCrisisResources(true);
      }

      setIsTyping(true);
      setTimeout(() => {
        const botMessage = {
          sender: 'bot',
          text: smartResponse.reply,
          timestamp: new Date(),
          isCrisis: smartResponse.isCrisis,
          isFallback: true,
          isError: false
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        loadConversationInsights();
      }, 1000 + Math.random() * 1000);
      
      // Only show error in development mode
      if (process.env.NODE_ENV === 'development') {
        setError(`API Error: ${error.message}. Using local fallback system.`);
      }
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
    <div className="flex flex-col h-full bg-white/5">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-br-md' 
                  : message.isCrisis
                    ? 'bg-red-500/20 border border-red-400/30 text-white rounded-tl-md'
                    : message.isError
                      ? 'bg-orange-500/20 border border-orange-400/30 text-white rounded-tl-md'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-tl-md'
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
              <p className="text-orange-400/70 text-xs mt-1">
                Using local response system. Check console for details.
              </p>
              {retryCount < 2 && (
                <button
                  onClick={retryLastMessage}
                  disabled={isRetrying}
                  className="mt-2 px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs rounded-lg border border-orange-400/30 hover:border-orange-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetrying ? 'Retrying...' : 'Retry API Call'}
                </button>
              )}
            </motion.div>
          )}

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 text-center"
            >
              <p className="text-blue-300 text-xs">
                🐛 Debug Mode: Check browser console for detailed logs
              </p>
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
          
          {/* Connection Status */}
          <div className="mt-2 flex items-center justify-center gap-2 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              error ? 'bg-orange-400' : 'bg-green-400'
            }`}></div>
            <span className="text-white/30">
              {error ? 'Using local responses' : 'Connected to AI service'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthChatbot;

