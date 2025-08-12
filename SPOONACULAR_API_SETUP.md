# Spoonacular API Integration Setup

This document outlines the setup and configuration for the new Spoonacular API integration in the Smart Vitals application.

## Overview

The application has been updated to use the Spoonacular API for diet plan generation instead of the previous Edamam API. This provides:

- More comprehensive recipe database
- Better nutritional information
- Enhanced meal planning capabilities
- Professional-grade food data

## Backend Changes

### 1. Environment Variables

Add the following to your `.env` file:

```bash
# Spoonacular API Configuration
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

### 2. Updated Controller

The `dietPlanController.js` has been updated to:

- Use Spoonacular's meal planner API
- Generate comprehensive meal plans with main meals and extra options
- Include snacks, pre-workout, and post-workout meals
- Handle dietary preferences and allergies
- Calculate appropriate calorie targets based on user goals

### 3. New API Endpoints

- `POST /api/diet-plan/generate` - Generate new diet plan
- `GET /api/diet-plan` - Fetch saved diet plans
- `DELETE /api/diet-plan/:id` - Delete specific diet plan

## Frontend Changes

### 1. Updated MealPlanGenerator Component

The frontend has been completely updated to:

- ✅ Remove shopping list functionality
- ✅ Work with new Spoonacular API data structure
- ✅ Display meals with proper nutritional information
- ✅ Show recipe links and cooking instructions
- ✅ Maintain user profile fetching functionality
- ✅ Provide professional diet plan interface

### 2. Key Features

- **User Profile Integration**: Fetches and displays user preferences
- **Dietary Preferences**: Respects user's dietary restrictions and allergies
- **Goal-Based Planning**: Adjusts calorie targets based on weight goals
- **Meal Categories**: Includes main meals, snacks, and workout-specific options
- **Recipe Links**: Direct links to full recipes on Spoonacular
- **Export/Print**: Save and share diet plans

## API Response Structure

The Spoonacular API returns data in this format:

```json
{
  "success": true,
  "data": {
    "_id": "plan_id",
    "userId": "user_clerk_id",
    "timeFrame": "day",
    "planData": {
      "meals": [
        {
          "id": 12345,
          "title": "Grilled Chicken Salad",
          "readyInMinutes": 25,
          "servings": 2,
          "image": "image_url",
          "sourceUrl": "recipe_url",
          "nutrition": {
            "nutrients": [
              {"name": "Calories", "amount": 350},
              {"name": "Protein", "amount": 25},
              {"name": "Carbohydrates", "amount": 15},
              {"name": "Fat", "amount": 12}
            ]
          }
        }
      ],
      "extraMeals": {
        "snacks": [...],
        "preWorkout": [...],
        "postWorkout": [...]
      }
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Testing

### 1. Backend Testing

Run the Spoonacular API test:

```bash
cd Backend
node test-spoonacular-api.js
```

This will verify:
- API key configuration
- Meal planner endpoint
- Recipe search endpoint
- Response format validation

### 2. Frontend Testing

1. Start the backend server
2. Start the frontend application
3. Navigate to the Meal Plan Generator
4. Complete user profile setup
5. Generate a diet plan
6. Verify meal display and functionality

## Setup Steps

### 1. Get Spoonacular API Key

1. Visit [Spoonacular Food API](https://spoonacular.com/food-api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Note: Free tier has 150 requests per day limit

### 2. Configure Environment

1. Copy `.env.example` to `.env`
2. Add your Spoonacular API key
3. Restart the backend server

### 3. Test Integration

1. Run the test script
2. Verify API responses
3. Check frontend functionality

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Check `.env` file configuration
   - Verify environment variable loading

2. **Rate Limit Exceeded**
   - Check your Spoonacular plan limits
   - Implement request caching if needed

3. **Authentication Errors**
   - Verify API key is correct
   - Check API key permissions

4. **Data Format Issues**
   - Run the test script to verify API responses
   - Check Spoonacular API documentation for changes

### Error Codes

- `401`: Invalid API key
- `402`: Quota exceeded
- `429`: Rate limit exceeded
- `500`: Server error

## Migration Notes

### From Edamam API

- ✅ User profile fetching maintained
- ✅ Diet plan generation functionality preserved
- ✅ UI updated for new data structure
- ❌ Shopping list functionality removed
- ❌ Old API endpoints deprecated

### Data Compatibility

- New plans use Spoonacular format
- Old plans may not display correctly
- Consider data migration if needed

## Performance Considerations

- Spoonacular API has rate limits
- Implement caching for frequently requested data
- Consider batch requests for multiple meals
- Monitor API usage and costs

## Security

- API keys are stored in environment variables
- Never commit API keys to version control
- Use proper authentication for user requests
- Validate all user inputs

## Support

For issues with:
- **Spoonacular API**: Check their [documentation](https://spoonacular.com/food-api/docs)
- **Backend Integration**: Review controller code and error logs
- **Frontend Display**: Check browser console and network requests
- **General Setup**: Refer to this documentation

## Future Enhancements

Potential improvements:
- Meal plan templates
- Nutritional analysis
- Shopping list generation from recipes
- Meal plan sharing
- Integration with fitness tracking
- Personalized recommendations
