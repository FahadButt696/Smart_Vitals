# AI Recommendation Cron Job Setup (Gemini API)

## Overview
This cron job automatically updates AI recommendations for users every 3 days using the existing Gemini API.

## What It Does
- **Runs every 3 days** at midnight (00:00)
- **Finds users** who need recommendations updated:
  - Users with no existing recommendations
  - Users with recommendations older than 3 days
- **Generates new recommendations** using Gemini API
- **Saves to database** automatically
- **Logs all activities** for monitoring

## Prerequisites
✅ `node-cron` package is already installed  
✅ `GEMINI_API_KEY` environment variable is set  
✅ MongoDB connection is working  
✅ User and AiRecommendation models exist  

## How It Works

### Automatic Schedule
- **Cron Expression**: `0 0 */3 * *` (every 3rd day at midnight)
- **Time Zone**: Server's local timezone
- **Frequency**: Every 3 days

### Process Flow
1. **Find Users**: Queries database for users needing updates
2. **Generate Recommendations**: Calls Gemini API with user profile
3. **Save Results**: Updates database with new recommendations
4. **Log Progress**: Records success/failure for each user

## Testing

### Manual Trigger
Test the cron job manually without waiting 3 days:
```bash
POST /api/ai-recommendations/trigger-cron
```

Response:
```json
{
  "message": "Manual cron job triggered successfully",
  "usersProcessed": 5,
  "successCount": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Monitor Logs
Watch server console for cron job activity:
```
🚀 AI recommendation cron job started (runs every 3 days)
⏰ AI recommendations cron job scheduled to run every 3 days at midnight
📋 Next run: Every 3rd day at 00:00

🕐 Running AI recommendations update job every 3 days...
📅 Current time: 2024-01-15T00:00:00.000Z
🔍 Looking for users with recommendations older than: 2024-01-12T00:00:00.000Z
✅ Found 3 users to update AI recommendations for.
✅ Successfully updated recommendations for user: user_123
🎯 Cron job completed: 3 successful, 0 failed
```

## Environment Variables
Make sure your `.env` file has:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Start the Server
```bash
npm run dev
# or
npm start
```

The cron job will automatically start and you'll see the startup messages in the console.

## Customization

### Change Frequency
Modify the cron expression in `aiRecommendationCron.js`:
```javascript
// Daily at midnight
cron.schedule("0 0 * * *", async () => { ... });

// Weekly on Sunday at midnight  
cron.schedule("0 0 * * 0", async () => { ... });

// Every 6 hours
cron.schedule("0 */6 * * *", async () => { ... });
```

## Troubleshooting

### Cron Job Not Starting
- Check if server.js imports the cron file
- Verify console shows cron startup messages
- Ensure no syntax errors in cron file

### API Errors
- Verify `GEMINI_API_KEY` environment variable
- Check Gemini API quota/limits
- Monitor error logs in console

### Database Issues
- Ensure MongoDB connection is working
- Check User and AiRecommendation models exist
- Verify database permissions

## Security Notes
- Cron job runs with server permissions
- API keys stored in environment variables
- Database operations use proper authentication
- No user data exposed in logs

