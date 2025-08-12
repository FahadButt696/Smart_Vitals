# Diet Plan API Documentation

## Overview
The Diet Plan API integrates with Spoonacular to generate personalized meal plans based on user preferences, goals, and dietary restrictions.

## API Endpoints

### 1. Generate Diet Plan
**POST** `/api/diet-plan/generate`

Generates a personalized diet plan using Spoonacular API.

**Request Body:**
```json
{
  "userId": "string",
  "timeFrame": "day" | "week"
}
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "userId": "string",
    "timeFrame": "string",
    "planData": {
      "meals": [
        {
          "id": 12345,
          "title": "Grilled Chicken Salad",
          "readyInMinutes": 30,
          "servings": 2,
          "sourceUrl": "https://spoonacular.com/recipes/grilled-chicken-salad-12345",
          "image": "https://spoonacular.com/recipeImages/12345-312x231.jpg",
          "imageType": "jpg",
          "nutrition": {
            "nutrients": [
              {
                "name": "Calories",
                "amount": 350,
                "unit": "kcal"
              }
            ]
          },
          "instructions": ["Step 1", "Step 2"],
          "ingredients": ["chicken", "lettuce", "tomatoes"]
        }
      ],
      "nutrients": {
        "calories": 2000,
        "protein": 150,
        "fat": 70,
        "carbohydrates": 250
      },
      "planSummary": {
        "totalCalories": 2000,
        "mealCount": 5,
        "timeFrame": "day",
        "userGoals": "Lose Weight",
        "dietaryPreferences": "Vegetarian",
        "allergies": "None"
      },
      "shoppingList": [
        {
          "ingredient": "chicken breast",
          "quantity": "2 servings",
          "category": "Protein",
          "priority": "High"
        }
      ],
      "mealPrepSchedule": {
        "Sunday": ["Batch cook proteins", "Prep vegetables"],
        "Monday": ["Assemble breakfast containers"]
      }
    }
  }
}
```

### 2. Get Diet Plans
**GET** `/api/diet-plan/`

Retrieves all saved diet plans for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "userId": "string",
      "timeFrame": "string",
      "planData": {...},
      "createdAt": "date"
    }
  ]
}
```

### 3. Delete Diet Plan
**DELETE** `/api/diet-plan/:id`

Deletes a specific diet plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Diet plan deleted successfully"
}
```

### 4. Get Meal Planner Items
**GET** `/api/diet-plan/mealplanner/items/:userId`

Retrieves meal planner items for a specific user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### 5. Get Shopping List
**GET** `/api/diet-plan/shopping-list/:userId`

Retrieves the shopping list from the most recent diet plan.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ingredient": "chicken breast",
      "quantity": "2 servings",
      "category": "Protein",
      "priority": "High"
    }
  ]
}
```

### 6. Get Recipe Information
**GET** `/api/diet-plan/recipes/:recipeId/information`

Retrieves detailed information about a specific recipe from Spoonacular.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 12345,
    "title": "Recipe Title",
    "readyInMinutes": 30,
    "servings": 4,
    "instructions": [...],
    "ingredients": [...],
    "nutrition": {...}
  }
}
```

## Spoonacular Integration

The API integrates with the following Spoonacular endpoints:

- **`/mealplanner/generate`** - Generate meal plans
- **`/recipes/{id}/information`** - Get detailed recipe information
- **`/recipes/complexSearch`** - Search for additional meal options

## Data Flow

1. **User Request** → Frontend sends user preferences
2. **Spoonacular API** → Backend fetches meal data
3. **Data Processing** → Backend structures and enriches data
4. **Database Storage** → Plan is saved to MongoDB
5. **Response** → Structured data returned to frontend

## Frontend Integration

The frontend component (`MealPlanGenerator.jsx`) has been updated to:

- Display meals in a clean grid layout
- Show nutritional information for each meal
- Provide recipe links and preparation times
- Display shopping lists and meal prep schedules
- Handle the new data structure seamlessly

## Environment Variables

Required environment variables:

```env
SPOONACULAR_API_KEY=your_spoonacular_api_key
MONGODB_URI=your_mongodb_connection_string
```

## Testing

Use the provided test file to verify API functionality:

```bash
cd Backend
node test-diet-plan-api.js
```

## Error Handling

The API includes comprehensive error handling for:

- Invalid user IDs
- Missing API keys
- Spoonacular API failures
- Database connection issues
- Authentication failures

## Future Enhancements

- Meal plan customization
- Recipe rating system
- Shopping list export
- Meal plan sharing
- Nutritional goal tracking
- Recipe recommendations based on preferences
