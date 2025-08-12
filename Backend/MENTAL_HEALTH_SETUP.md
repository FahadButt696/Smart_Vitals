# Mental Health Chatbot Setup Guide

## Overview
The mental health chatbot is now equipped with a smart fallback system that works without external AI services, while still supporting Google Gemini AI when available.

## Features
- **Smart Response System**: Provides evidence-based mental health support without external dependencies
- **Crisis Detection**: Automatically identifies crisis situations and provides appropriate resources
- **Professional Guidance**: Offers therapeutic techniques, coping strategies, and emotional support
- **Fallback Support**: Works even when backend services are unavailable

## Environment Variables (Optional)
To enable Google Gemini AI integration, create a `.env` file in the Backend directory with:

```bash
# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

## How It Works
1. **Primary Mode**: When backend is available and GEMINI_API_KEY is set, uses Google's AI for responses
2. **Fallback Mode**: When backend fails or AI is unavailable, uses the built-in smart response system
3. **Crisis Mode**: Automatically detects crisis keywords and provides emergency resources

## Smart Response Categories
The chatbot can intelligently respond to:
- **Anxiety & Stress**: Breathing techniques, grounding exercises, cognitive strategies
- **Depression**: Supportive guidance, self-care practices, professional help recommendations
- **Sleep Issues**: Sleep hygiene, relaxation techniques, cognitive behavioral strategies
- **Motivation**: Goal-setting strategies, habit formation, momentum building
- **Relationships**: Communication skills, boundary setting, conflict resolution
- **General Support**: Active listening, validation, resource guidance

## Crisis Resources
Automatically provides:
- National Suicide Prevention Lifeline (988)
- Crisis Text Line (Text HOME to 741741)
- Emergency Services (911)
- Professional mental health resources

## Usage
1. Navigate to the Mental Health page in your dashboard
2. Start a conversation with the AI companion
3. Share your thoughts, feelings, or concerns
4. Receive evidence-based support and coping strategies

## Safety Features
- **Professional Disclaimer**: Clear notice that this is not a substitute for professional care
- **Crisis Detection**: Automatic identification of dangerous situations
- **Resource Provision**: Immediate access to crisis hotlines and emergency services
- **Boundary Setting**: Maintains therapeutic relationship without medical advice

## Technical Notes
- Built with React and Framer Motion for smooth animations
- Responsive design that works on all devices
- Real-time typing indicators for natural conversation flow
- Persistent chat history (when backend is available)
- Conversation insights and analytics

## Support
If you encounter any issues:
1. Check that your backend server is running
2. Verify environment variables are set correctly
3. The chatbot will automatically fall back to local responses if needed
4. All responses are designed to be helpful and supportive

## Professional Standards
This chatbot follows:
- Evidence-based therapeutic principles
- Professional mental health guidelines
- Crisis intervention protocols
- Ethical AI practices
- User safety and privacy protection
