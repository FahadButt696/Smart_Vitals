# Gemini API Troubleshooting Guide

## Common Issues and Solutions

### 1. Chat Ending Unexpectedly

**Problem**: Chat terminates after Gemini API errors
**Solution**: The updated code now includes:
- Automatic fallback to local responses
- Retry mechanism (up to 2 attempts)
- Graceful error handling without chat termination
- Connection status indicator

### 2. API Key Issues

**Problem**: "GEMINI_API_KEY not found" error
**Solution**: 
1. Check your `.env` file in the Backend directory
2. Ensure the key is named exactly `GEMINI_API_KEY`
3. Restart your backend server after adding the key

**Example .env file**:
```env
GEMINI_API_KEY=your_actual_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 3. API Response Parsing Errors

**Problem**: "Invalid response structure from Gemini API" error
**Solution**: The updated code now handles multiple response formats:
- `response.text()` method
- `response.candidates[0].content.parts[0].text` format
- Better validation and error handling

### 4. Rate Limiting and Quotas

**Problem**: "QUOTA_EXCEEDED" or rate limiting errors
**Solution**:
1. Check your Google AI Studio dashboard
2. Monitor API usage and quotas
3. Implement exponential backoff if needed
4. Use local fallback responses during high usage

### 5. Safety Filter Triggers

**Problem**: Responses blocked by safety filters
**Solution**: The updated code includes:
- Safety settings configuration
- Content filtering thresholds
- Fallback responses for blocked content

## Testing Your Setup

### Run the Connection Test

```bash
cd Smart_Vitals/Backend
node test-gemini-connection.js
```

This will test:
- API key validity
- Model availability
- Response generation
- Error handling

### Expected Output

```
🔍 Testing Gemini API Connection...
Environment check:
- GEMINI_API_KEY: ✅ Set

🔄 Initializing Gemini AI...
✅ Gemini AI initialized successfully

🔄 Getting model...
✅ Model retrieved successfully

🔄 Testing simple generation...
✅ Content generation successful
📝 Response received: Gemini API is working correctly
✅ Gemini API is working correctly!

🏁 Test completed
```

## Debugging Steps

### 1. Check Environment Variables
```bash
# In your backend directory
echo $GEMINI_API_KEY
# or check .env file
cat .env
```

### 2. Verify API Key
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check if your key is active and has proper permissions
- Ensure you're using the correct project

### 3. Test API Directly
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
```

### 4. Check Server Logs
Look for these log messages in your backend console:
- "Attempting Gemini API call..."
- "Gemini API response received, length: X"
- "AI Generation Error:" (if errors occur)

## Fallback System

The system now includes a robust fallback mechanism:

1. **Primary**: Gemini API responses
2. **Secondary**: Enhanced local responses based on message content
3. **Tertiary**: Generic supportive responses

### Local Response Categories
- Crisis detection and intervention
- Anxiety management techniques
- Depression support strategies
- Sleep hygiene advice
- Motivation and goal-setting help
- Relationship guidance
- General wellness support

## Performance Optimization

### 1. Response Caching
Consider implementing response caching for common queries to reduce API calls.

### 2. Batch Processing
For multiple messages, consider batching API calls.

### 3. Connection Pooling
Maintain persistent connections to reduce overhead.

## Monitoring and Alerts

### 1. API Usage Tracking
Monitor your API usage in Google AI Studio dashboard.

### 2. Error Rate Monitoring
Track error rates and implement alerts for high failure rates.

### 3. Response Time Monitoring
Monitor API response times and implement timeouts.

## Support Resources

- [Google AI Studio Documentation](https://ai.google.dev/docs)
- [Gemini API Reference](https://ai.google.dev/api/gemini-api)
- [Google AI Studio Console](https://makersuite.google.com/app/apikey)
- [API Status Page](https://status.cloud.google.com/)

## Emergency Fallback

If all else fails, the system will:
1. Use local responses
2. Show connection status
3. Provide retry options
4. Maintain chat continuity
5. Display crisis resources when needed

The chat will never completely terminate due to API issues.
