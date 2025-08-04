import ChatLog from '../models/ChatLog.js';

// Get chat sessions for a user
export const getChatSessions = async (req, res) => {
  try {
    const { userId } = req.auth;
    const sessions = await ChatLog.find({ userId })
      .sort({ startTime: -1 })
      .limit(20);

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat sessions',
      error: error.message
    });
  }
};

// Get a specific chat session
export const getChatSession = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { sessionId } = req.params;

    const session = await ChatLog.findOne({ sessionId, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching chat session',
      error: error.message
    });
  }
};

// Create a new chat session
export const createChatSession = async (req, res) => {
  try {
    const { userId } = req.auth;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const session = new ChatLog({
      userId,
      sessionId,
      messages: [],
      startTime: new Date()
    });

    await session.save();

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating chat session',
      error: error.message
    });
  }
};

// Add message to chat session
export const addMessage = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { sessionId } = req.params;
    const { content, mood, sentiment } = req.body;

    const session = await ChatLog.findOne({ sessionId, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content,
      mood,
      sentiment: sentiment || 'neutral'
    });

    // Generate AI response (simulated)
    const aiResponse = generateAIResponse(content, mood);
    
    session.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      sentiment: aiResponse.sentiment
    });

    // Update session data
    session.overallMood = mood || session.overallMood;
    session.aiSuggestions = aiResponse.suggestions || session.aiSuggestions;
    session.riskLevel = aiResponse.riskLevel || session.riskLevel;

    await session.save();

    res.json({
      success: true,
      data: {
        session,
        aiResponse: aiResponse.response,
        suggestions: aiResponse.suggestions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
};

// End chat session
export const endChatSession = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { sessionId } = req.params;

    const session = await ChatLog.findOne({ sessionId, userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    session.isActive = false;
    session.endTime = new Date();
    session.sessionDuration = Math.round((session.endTime - session.startTime) / (1000 * 60));

    await session.save();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ending chat session',
      error: error.message
    });
  }
};

// Generate AI response (simulated)
const generateAIResponse = (userMessage, mood) => {
  const responses = {
    positive: [
      "That's wonderful! I'm glad you're feeling positive. Keep up the great energy!",
      "Your positive attitude is inspiring! Remember to share this energy with others.",
      "Excellent! Positive thoughts lead to positive outcomes. You're doing great!"
    ],
    negative: [
      "I understand you're going through a tough time. It's okay to feel this way. Would you like to talk more about what's bothering you?",
      "I'm here to listen. Sometimes talking about our feelings can help us process them better.",
      "Remember that difficult times are temporary. You're stronger than you think."
    ],
    neutral: [
      "Thank you for sharing that with me. How are you feeling about it?",
      "I'm here to support you. Is there anything specific you'd like to discuss?",
      "Your feelings are valid. Would you like to explore this further?"
    ]
  };

  const suggestions = [
    "Consider practicing deep breathing exercises",
    "Try going for a short walk to clear your mind",
    "Write down your thoughts in a journal",
    "Listen to some calming music",
    "Reach out to a friend or family member"
  ];

  let sentiment = 'neutral';
  if (mood === 'happy' || mood === 'excited' || mood === 'grateful') {
    sentiment = 'positive';
  } else if (mood === 'sad' || mood === 'angry' || mood === 'anxious') {
    sentiment = 'negative';
  }

  const response = responses[sentiment][Math.floor(Math.random() * responses[sentiment].length)];
  const riskLevel = sentiment === 'negative' ? 'moderate' : 'low';

  return {
    response,
    sentiment,
    suggestions: suggestions.slice(0, 3),
    riskLevel
  };
}; 