# Meal Plan Generator - Smart Vitals

## Overview
The Meal Plan Generator is a comprehensive feature that integrates with the Edamam API to create personalized meal plans based on user preferences, health goals, and dietary restrictions.

## Features

### 🎯 **Personalized Meal Planning**
- **AI-Powered Generation**: Uses Edamam API for recipe recommendations
- **User Profile Integration**: Automatically fetches user data (age, height, weight, activity level, goals)
- **Smart Calorie Calculation**: BMR-based calorie needs with goal adjustments
- **Dietary Preferences**: Supports various diet types (Balanced, Vegetarian, Vegan, Keto, Custom)
- **Allergy Awareness**: Considers user allergies and restrictions

### 🍽️ **Meal Plan Features**
- **Flexible Duration**: 3, 5, 7, or 14-day meal plans
- **Three Meals Daily**: Breakfast, Lunch, and Dinner
- **Nutritional Information**: Calories, protein, carbs, and fat for each meal
- **Recipe Details**: Ingredients, instructions, prep time, and cooking time
- **Recipe Links**: Direct links to full recipes on Edamam

### 💾 **Data Management**
- **Save Plans**: Store generated meal plans for future reference
- **Plan History**: View all previously generated meal plans
- **Export Functionality**: Download meal plans as JSON files
- **Delete Plans**: Remove unwanted meal plans

## Technical Implementation

### Backend Architecture

#### 1. **Server Configuration** (`server.js`)
```javascript
// Added diet plan routes
import dietPlanRoutes from './routes/dietPlanRoutes.js';
app.use("/api/diet-plan", dietPlanRoutes);
```

#### 2. **API Routes** (`routes/dietPlanRoutes.js`)
- `POST /api/diet-plan/generate` - Generate new meal plan
- `GET /api/diet-plan` - Get user's saved meal plans
- `DELETE /api/diet-plan/:id` - Delete specific meal plan

#### 3. **Controller** (`controllers/dietPlanController.js`)
- **Calorie Calculation**: BMR formula with activity level multipliers
- **Edamam API Integration**: Recipe search with dietary filters
- **Meal Generation**: Creates structured meal plans with nutritional data
- **Data Persistence**: Saves plans to MongoDB

#### 4. **Data Model** (`models/DietPlan.js`)
```javascript
const mealSchema = new mongoose.Schema({
  mealType: String,
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  recipeUrl: String,
  image: String,
  ingredients: [String],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
});
```

### Frontend Architecture

#### 1. **Component Structure** (`MealPlanGenerator.jsx`)
- **User Data Fetching**: Integrates with Clerk authentication
- **Form Validation**: Checks required user information
- **Dynamic UI**: Responsive design with Tailwind CSS
- **State Management**: React hooks for component state

#### 2. **API Integration** (`config/api.js`)
```javascript
export const API_ENDPOINTS = {
  DIET_PLAN: {
    GENERATE: `${API_BASE_URL}/api/diet-plan/generate`,
    GET_ALL: (userId) => `${API_BASE_URL}/api/diet-plan?userId=${userId}`,
    DELETE: (id) => `${API_BASE_URL}/api/diet-plan/${id}`,
  },
  USER: {
    GET_BY_CLERK_ID: (clerkId) => `${API_BASE_URL}/api/user/clerk/${clerkId}`,
  },
};
```

## Setup Instructions

### 1. **Environment Variables**
Add the following to your `.env` file:
```bash
# Edamam API Configuration
EDAMAM_APP_ID=your_edamam_app_id_here
EDAMAM_APP_KEY=your_edamam_app_key_here
```

### 2. **Get Edamam API Credentials**
1. Visit [Edamam Developer Portal](https://developer.edamam.com/)
2. Create an account and register your application
3. Get your `APP_ID` and `APP_KEY`
4. Add them to your environment variables

### 3. **Install Dependencies**
```bash
cd Backend
npm install axios
```

### 4. **Test API Integration**
```bash
cd Backend
node test-edamam-api.js
```

## User Experience Flow

### 1. **Initial Access**
- User navigates to Meal Plan Generator
- System automatically fetches user profile data
- Displays current user information (age, goals, activity level)

### 2. **Data Validation**
- **Complete Profile**: If all required fields are present, proceed to generation
- **Incomplete Profile**: Show form to collect missing information
  - Age, Height, Weight, Activity Level, Goals
  - Dietary Preferences and Allergies

### 3. **Meal Plan Configuration**
- **Diet Type**: Select from available options
- **Goal**: Weight loss, maintenance, or muscle gain
- **Duration**: Choose plan length (3-14 days)

### 4. **Generation Process**
- **API Call**: Backend requests recipes from Edamam
- **Recipe Selection**: AI selects appropriate meals based on criteria
- **Plan Creation**: Structured meal plan with nutritional data
- **Storage**: Plan saved to database for future access

### 5. **Plan Display**
- **Daily Overview**: Complete meal breakdown for each day
- **Nutritional Summary**: Daily totals for calories and macros
- **Recipe Details**: Ingredients, instructions, and cooking times
- **Quick Actions**: Save, export, or delete plans

## API Endpoints

### Generate Meal Plan
```http
POST /api/diet-plan/generate
Content-Type: application/json

{
  "userId": "user_id_here",
  "days": 7,
  "mealsPerDay": 3
}
```

### Get User's Meal Plans
```http
GET /api/diet-plan?userId=user_id_here
```

### Delete Meal Plan
```http
DELETE /api/diet-plan/:plan_id
```

### Get User by Clerk ID
```http
GET /api/user/clerk/:clerk_id
```

## Error Handling

### Backend Errors
- **Missing User Data**: Returns 400 with specific field requirements
- **API Failures**: Logs detailed error information for debugging
- **Database Issues**: Graceful error handling with user-friendly messages

### Frontend Errors
- **Network Issues**: Displays user-friendly error messages
- **Validation Errors**: Form validation with clear feedback
- **Loading States**: Visual indicators during API calls

## Performance Considerations

### 1. **API Rate Limiting**
- Edamam API has rate limits (10,000 requests/month for free tier)
- Implement caching for frequently requested recipes
- Consider batch processing for multiple meal plans

### 2. **Database Optimization**
- Index user ID for faster meal plan queries
- Implement pagination for large plan collections
- Regular cleanup of old meal plans

### 3. **Frontend Performance**
- Lazy loading of meal plan components
- Image optimization for recipe photos
- Efficient state management to prevent unnecessary re-renders

## Future Enhancements

### 1. **Advanced Features**
- **Shopping List Generation**: Automatic ingredient lists
- **Meal Substitutions**: Alternative recipe suggestions
- **Nutritional Goals**: Custom macro and micronutrient targets
- **Meal Timing**: Optimal eating schedule recommendations

### 2. **Integration Opportunities**
- **Calendar Integration**: Sync meal plans with user calendars
- **Social Sharing**: Share meal plans with friends and family
- **Progress Tracking**: Monitor adherence to meal plans
- **Recipe Ratings**: User feedback and rating system

### 3. **AI Improvements**
- **Machine Learning**: Learn from user preferences over time
- **Seasonal Recommendations**: Weather and seasonal ingredient suggestions
- **Health Monitoring**: Integrate with health tracking devices
- **Personalized Coaching**: AI-powered nutrition advice

## Troubleshooting

### Common Issues

#### 1. **Edamam API Errors**
```bash
# Test API connection
node test-edamam-api.js

# Check environment variables
echo $EDAMAM_APP_ID
echo $EDAMAM_APP_KEY
```

#### 2. **User Data Issues**
- Verify Clerk authentication is working
- Check user route permissions
- Validate user data structure in database

#### 3. **Meal Plan Generation Failures**
- Check backend logs for detailed error messages
- Verify Edamam API credentials
- Ensure user has required profile information

### Debug Mode
Enable detailed logging in the controller:
```javascript
console.log('User data:', user);
console.log('Calculated calories:', calories);
console.log('API response:', response.data);
```

## Security Considerations

### 1. **API Key Protection**
- Never expose Edamam API keys in frontend code
- Use environment variables for sensitive data
- Implement API key rotation if needed

### 2. **User Data Privacy**
- Validate user permissions before data access
- Sanitize user inputs to prevent injection attacks
- Implement proper authentication middleware

### 3. **Rate Limiting**
- Monitor API usage to prevent abuse
- Implement user-specific rate limiting
- Cache responses to reduce API calls

## Support and Maintenance

### 1. **Regular Updates**
- Monitor Edamam API changes and updates
- Update dependencies for security patches
- Review and optimize database queries

### 2. **User Feedback**
- Collect user experience feedback
- Monitor error rates and user complaints
- Implement improvements based on usage patterns

### 3. **Performance Monitoring**
- Track API response times
- Monitor database query performance
- Analyze user engagement metrics

---

## Conclusion
The Meal Plan Generator provides a comprehensive, user-friendly solution for personalized nutrition planning. With proper setup and maintenance, it offers a robust foundation for health and wellness applications while maintaining security and performance standards.

For additional support or questions, please refer to the main project documentation or contact the development team.
