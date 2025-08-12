# Mental Health Chatbot - Gemini API Integration

## Overview

The Smart Vitals Mental Health page features a professional AI-powered chatbot that provides mental health support using Google's Gemini API. The chatbot is designed to offer compassionate, evidence-based therapeutic conversations while maintaining professional standards and safety protocols.

## Features

### 🤖 AI Companion (Dr. Sarah Chen)
- **Professional Identity**: Licensed clinical psychologist with expertise in CBT, DBT, and mindfulness
- **Evidence-Based**: Uses therapeutic techniques and coping strategies
- **24/7 Support**: Always available for emotional support and guidance
- **Safety First**: Crisis detection and immediate resource provision

### 💬 Chat Interface
- **Real-time Messaging**: Instant responses with typing indicators
- **Conversation History**: Persistent chat history and insights
- **Quick Suggestions**: Pre-written conversation starters
- **Professional Disclaimer**: Clear boundaries about AI limitations

### 🚨 Crisis Support
- **Crisis Detection**: Automatic identification of crisis situations
- **Immediate Resources**: Direct access to crisis hotlines and emergency services
- **Professional Guidance**: Clear instructions for seeking professional help

### 📊 Wellness Tracking
- **Mood Tracker**: Daily mood logging with visual feedback
- **Activity Suggestions**: Wellness activities with duration and benefits
- **Progress Insights**: Weekly mood trends and patterns
- **Personalized Recommendations**: AI-driven wellness suggestions

## Setup Instructions

### 1. Backend Configuration

#### Install Dependencies
```bash
cd Smart_VItals/Backend
npm install @google/generative-ai
```

#### Environment Variables
Create a `.env` file in the Backend directory:
```env
# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other required variables
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```

#### Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 2. Frontend Configuration

The frontend is already configured and ready to use. The MentalHealth page includes:
- Professional UI design with dark theme
- Responsive layout for all devices
- Smooth animations and transitions
- Integrated chatbot interface

### 3. Start the Application

#### Backend Server
```bash
cd Smart_VItals/Backend
npm start
```

#### Frontend Development
```bash
cd Smart_VItals/FrontEnd
npm run dev
```

## Usage Guide

### Accessing the Mental Health Page
1. Navigate to the Dashboard
2. Click on "Mental Health" in the sidebar
3. The page will open with the AI Companion tab active by default

### Starting a Conversation
1. Click "Start Talking 💬" to begin
2. Type your message in the input field
3. Press Enter or click the send button
4. Dr. Sarah Chen will respond with therapeutic guidance

### Using Quick Suggestions
- Click on pre-written suggestions like "I'm feeling anxious today"
- These help users start conversations more easily
- Customize suggestions based on common user needs

### Crisis Situations
- The AI automatically detects crisis keywords
- Crisis resources are immediately displayed
- Users are guided to professional help
- Emergency contact information is prominently shown

## Technical Architecture

### Backend Components
- **Controller**: `mentalHealthController.js` - Handles chat logic and AI integration
- **Routes**: `mentalHealthRoutes.js` - API endpoint definitions
- **Model**: `MentalHealthChat.js` - MongoDB schema for chat history
- **AI Integration**: Google Gemini API for natural language processing

### Frontend Components
- **Main Page**: `MentalHealth.jsx` - Complete mental health dashboard
- **Chatbot**: `MentalHealthChatbot.jsx` - Chat interface component
- **State Management**: React hooks for local state
- **Styling**: Tailwind CSS with custom animations

### API Endpoints
```
POST /api/mental-health/chat - Send message to AI
GET /api/mental-health/chat/:userId - Get chat history
DELETE /api/mental-health/chat/:userId - Clear chat history
GET /api/mental-health/insights/:userId - Get conversation insights
```

## Safety and Ethics

### Professional Standards
- **No Medical Diagnosis**: AI provides support, not medical advice
- **Crisis Protocols**: Immediate escalation for serious situations
- **Professional Boundaries**: Clear limitations and disclaimers
- **Privacy Protection**: Secure data handling and storage

### Crisis Detection
The AI monitors for:
- Suicidal thoughts or self-harm
- Severe mental health symptoms
- Crisis language and expressions
- Emergency situations requiring immediate attention

### Resource Provision
- **Crisis Hotlines**: 988, Crisis Text Line, Emergency Services
- **Professional Referrals**: Guidance to mental health professionals
- **Educational Resources**: Articles, coping strategies, mindfulness exercises
- **Support Networks**: Community and peer support options

## Customization Options

### AI Personality
- Modify the therapeutic prompt in `mentalHealthController.js`
- Adjust response style and tone
- Customize crisis detection keywords
- Add specialized therapeutic approaches

### UI/UX Design
- Update color schemes and themes
- Modify layout and component structure
- Add new wellness tracking features
- Customize animations and transitions

### Additional Features
- **Voice Chat**: Integrate speech-to-text capabilities
- **Video Sessions**: Add video call functionality
- **Progress Tracking**: Enhanced analytics and reporting
- **Integration**: Connect with other health tracking features

## Troubleshooting

### Common Issues

#### API Key Errors
```
Error: Invalid API key
```
**Solution**: Verify your Gemini API key in the `.env` file

#### Connection Issues
```
Failed to send message
```
**Solution**: Check if the backend server is running on port 5000

#### Database Errors
```
Database save skipped for testing
```
**Solution**: This is normal in testing mode. Set up MongoDB for production use.

### Performance Optimization
- Implement message pagination for long conversations
- Add caching for frequently used responses
- Optimize AI prompt length and complexity
- Use connection pooling for database operations

## Security Considerations

### Data Protection
- Encrypt sensitive chat data
- Implement proper authentication
- Regular security audits
- GDPR compliance measures

### API Security
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure environment variable handling
- Regular dependency updates

## Future Enhancements

### Planned Features
- **Multi-language Support**: International accessibility
- **Advanced Analytics**: Deep conversation insights
- **Integration APIs**: Connect with external mental health services
- **Mobile App**: Native mobile application

### Research Opportunities
- **AI Model Training**: Custom therapeutic response models
- **Clinical Validation**: Research partnerships for effectiveness
- **User Experience**: A/B testing for optimal support delivery
- **Accessibility**: Enhanced support for users with disabilities

## Support and Maintenance

### Regular Updates
- Monitor Gemini API changes and updates
- Update dependencies and security patches
- Review and improve crisis detection algorithms
- Enhance therapeutic response quality

### User Feedback
- Collect user experience data
- Implement feature requests
- Address accessibility concerns
- Maintain professional standards

## Conclusion

The Smart Vitals Mental Health Chatbot provides a professional, safe, and effective platform for mental health support. With proper setup and configuration, it offers users immediate access to therapeutic conversations while maintaining the highest standards of safety and professional ethics.

For technical support or feature requests, please contact the development team or refer to the project documentation.
