import MentalHealthChat from "../models/MentalHealthChat.js";
import axios from "axios";

// Enhanced therapeutic prompts
const getTherapeuticPrompt = (message, conversationHistory = []) => {
  const basePrompt = `
    You are Dr. Sarah Chen, a licensed clinical psychologist with 15+ years of experience in cognitive behavioral therapy (CBT), dialectical behavior therapy (DBT), and mindfulness-based interventions. You specialize in treating anxiety, depression, trauma, and stress-related disorders.

    Your role is to provide compassionate, evidence-based mental health support through:
    - Active listening and emotional validation
    - Cognitive behavioral techniques and coping strategies
    - Mindfulness and relaxation exercises
    - Crisis assessment and safety planning when needed
    - Referral guidance to professional mental health services

    IMPORTANT GUIDELINES:
    - Always maintain a warm, empathetic, and professional tone
    - Provide practical, actionable advice and techniques
    - Never give medical diagnoses or prescribe medication
    - Always assess for crisis situations and provide appropriate resources
    - Keep responses under 300 words unless crisis intervention is needed
    - Focus on immediate coping strategies and long-term wellness
    - Use inclusive, trauma-informed language
    - Encourage professional help when appropriate

    CONVERSATION CONTEXT:
    ${conversationHistory}

    USER'S MESSAGE: ${message}

    Please provide a supportive, therapeutic response that addresses their immediate needs while promoting their mental health and well-being.
  `;
  return basePrompt;
};

// Crisis detection
const detectCrisis = (message) => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live',
    'self-harm', 'cut myself', 'hurt myself', 'better off dead', 'everyone would be better off',
    'extreme crisis', 'mental breakdown', 'can\'t take it anymore', 'overwhelmed completely'
  ];
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

const getCrisisResponse = () => ({
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
});

export const sendMessage = async (req, res) => {
  try {
    const { userId, message } = req.body; // Get userId from request body

    console.log('Mental Health Chat Request:', { userId, message: message?.substring(0, 50) + '...' });

    if (!userId) return res.status(400).json({ error: "UserId is required" });
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.log('GEMINI_API_KEY not found, using fallback responses');
      const fallbackResponse = generateFallbackResponse(message);
      return res.json({ 
        reply: fallbackResponse,
        isCrisis: false,
        isFallback: true,
        reason: 'No Gemini API key configured'
      });
    }

    // Input validation and sanitization
    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length > 1000) {
      return res.status(400).json({ error: "Message too long. Please keep messages under 1000 characters." });
    }

    // Get or create chat document first
    let chat;
    try {
      chat = await MentalHealthChat.findOne({ userId });
      if (!chat) chat = new MentalHealthChat({ userId, messages: [] });
    } catch (dbError) {
      console.log("Database query failed:", dbError.message);
      // Create a temporary chat object for testing
      chat = { userId, messages: [] };
    }

    // Crisis detection
    if (detectCrisis(sanitizedMessage)) {
      const crisisResponse = getCrisisResponse();
      
      // Save user message and crisis response
      try {
        chat.messages.push({ sender: "user", text: sanitizedMessage });
        chat.messages.push({ sender: "bot", text: crisisResponse.reply });
        if (chat._id) { // Only save if it's a real document
          await chat.save();
        }
      } catch (dbError) {
        console.log("Database save failed:", dbError.message);
      }

      return res.json({ 
        reply: crisisResponse.reply, 
        isCrisis: true,
        crisisResources: true 
      });
    }

    // Save user message
    try {
      chat.messages.push({ sender: "user", text: sanitizedMessage });
      if (chat._id) { // Only save if it's a real document
        await chat.save();
      }
    } catch (dbError) {
      console.log("Database save failed:", dbError.message);
    }

    // Get conversation history for context (last 10 messages)
    const recentMessages = chat.messages.slice(-10);
    const conversationContext = recentMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    // Enhanced therapeutic prompt with conversation context
    const prompt = getTherapeuticPrompt(sanitizedMessage, conversationContext);

    try {
      console.log('Attempting Gemini API call...');
      
      // Use the same Gemini API configuration as AI recommendations
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        },
        {
          headers: {
            "Content-Type": "application/json"
          },
        }
      );

      // Handle response
      const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!aiText || aiText.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      console.log('✅ Gemini API response received, length:', aiText.length);

      // Save bot message
      try {
        chat.messages.push({ sender: "bot", text: aiText });
        if (chat._id) { // Only save if it's a real document
          await chat.save();
        }
      } catch (dbError) {
        console.log("Database save failed:", dbError.message);
      }

      res.json({ 
        reply: aiText,
        isCrisis: false,
        messageId: chat.messages[chat.messages.length - 1]?._id,
        modelUsed: 'gemini-1.5-pro'
      });
      
      return; // Exit successfully

    } catch (aiError) {
      console.error("AI Generation Error:", aiError);
      
      // Instead of immediately using fallback, let the frontend handle it
      res.status(500).json({ 
        error: "AI service error",
        message: aiError.message || 'Failed to generate response',
        shouldUseFallback: true
      });

      
      // Use enhanced fallback response
      const fallbackResponse = generateFallbackResponse(sanitizedMessage);
      
      try {
        chat.messages.push({ sender: "bot", text: fallbackResponse });
        if (chat._id) { // Only save if it's a real document
          await chat.save();
        }
      } catch (dbError) {
        console.log("Database save failed:", dbError.message);
      }

      res.json({ 
        reply: fallbackResponse,
        isCrisis: false,
        isFallback: true,
        reason: `AI service error: ${aiError.message || 'Unknown error'}`
      });
    }

  } catch (error) {
    console.error("Chatbot Error:", error);
    
    // Enhanced error logging
    console.error("Full error object:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      error: "I'm experiencing technical difficulties. Please try again in a moment, or reach out to a mental health professional if you need immediate support.",
      technicalError: true,
      fallbackResponse: generateFallbackResponse(req.body?.message || "I need help")
    });
  }
};

// Enhanced fallback response generator
const generateFallbackResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Crisis detection
  const crisisKeywords = [
    'suicide', 'kill myself', 'want to die', 'end it all', 'no reason to live',
    'self-harm', 'cut myself', 'hurt myself', 'better off dead', 'everyone would be better off',
    'extreme crisis', 'mental breakdown', 'can\'t take it anymore', 'overwhelmed completely'
  ];
  
  if (crisisKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return `I'm very concerned about what you're sharing with me. Your feelings are valid, and you're not alone in experiencing this pain. 

IMPORTANT: If you're having thoughts of harming yourself or others, please reach out for immediate help:

🆘 CRISIS RESOURCES:
• National Suicide Prevention Lifeline (US): 988 or 1-800-273-8255
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911 (US) or your local emergency number

💙 IMMEDIATE SUPPORT:
• Talk to a trusted friend, family member, or mental health professional
• Go to your nearest emergency room
• Call a crisis hotline

You deserve support and care. Please don't hesitate to reach out to these resources. They're available 24/7 and are staffed by trained professionals who want to help you.`;
  }

  // Anxiety responses
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
    return `I hear that you're feeling anxious, and I want you to know that anxiety is a very common and normal human experience. Let me share some evidence-based techniques that can help:

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

How are you feeling right now? Would you like to try one of these techniques together?`;
  }

  // Depression responses
  if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hopeless')) {
    return `I'm so sorry you're feeling this way. Depression can feel incredibly isolating and overwhelming, but you're not alone in this struggle. Your feelings are valid, and it's brave of you to reach out.

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

What would feel most supportive to you right now?`;
  }

  // Default supportive response
  return `Thank you for sharing that with me. I can hear that you're going through something challenging, and I want you to know that your feelings are completely valid.

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

What would you like to explore further?`;
};

// getChatHistory, clearChatHistory, getConversationInsights remain unchanged


export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query; // Get from query parameters
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const chat = await MentalHealthChat.findOne({ userId });
      
      if (!chat) {
        return res.json({ messages: [] });
      }
      
      // Return messages with pagination support
      const messages = chat.messages.slice(-50); // Last 50 messages
      res.json({ 
        messages,
        totalMessages: chat.messages.length,
        hasMore: chat.messages.length > 50
      });
    } catch (dbError) {
      console.log("Database query skipped for testing:", dbError.message);
      // Return empty messages for testing
      res.json({ messages: [] });
    }
  } catch (error) {
    console.error("Get Chat History Error:", error);
    res.status(500).json({ error: "Failed to retrieve chat history" });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.query; // Get from query parameters
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const result = await MentalHealthChat.findOneAndUpdate(
        { userId },
        { messages: [] },
        { new: true, upsert: true }
      );
      
      res.json({ 
        message: "Chat history cleared successfully",
        chatId: result._id
      });
    } catch (dbError) {
      console.log("Database operation skipped for testing:", dbError.message);
      res.json({ 
        message: "Chat history cleared successfully (testing mode)",
        chatId: "test_id"
      });
    }
  } catch (error) {
    console.error("Clear Chat History Error:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
};

// New endpoint for getting conversation insights
export const getConversationInsights = async (req, res) => {
  try {
    const { userId } = req.query; // Get from query parameters
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      const chat = await MentalHealthChat.findOne({ userId });
      
      if (!chat || chat.messages.length === 0) {
        return res.json({ 
          insights: {
            totalConversations: 0,
            totalMessages: 0,
            userMessages: 0,
            botMessages: 0,
            averageMessageLength: 0,
            lastConversation: null,
            conversationDuration: 0
          }
        });
      }

      // Basic conversation analytics
      const userMessages = chat.messages.filter(msg => msg.sender === 'user');
      const botMessages = chat.messages.filter(msg => msg.sender === 'bot');
      
      const insights = {
        totalConversations: Math.ceil(chat.messages.length / 2),
        totalMessages: chat.messages.length,
        userMessages: userMessages.length,
        botMessages: botMessages.length,
        averageMessageLength: Math.round(
          userMessages.reduce((sum, msg) => sum + msg.text.length, 0) / userMessages.length
        ),
        lastConversation: chat.messages[chat.messages.length - 1]?.timestamp,
        conversationDuration: chat.messages.length > 1 ? 
          new Date(chat.messages[chat.messages.length - 1].timestamp) - new Date(chat.messages[0].timestamp) : 0
      };

      res.json({ insights });
    } catch (dbError) {
      console.log("Database query skipped for testing:", dbError.message);
      // Return default insights for testing
      res.json({ 
        insights: {
          totalConversations: 0,
          totalMessages: 0,
          userMessages: 0,
          botMessages: 0,
          averageMessageLength: 0,
          lastConversation: null,
          conversationDuration: 0
        }
      });
    }
  } catch (error) {
    console.error("Get Conversation Insights Error:", error);
    res.status(500).json({ error: "Failed to retrieve conversation insights" });
  }
};
