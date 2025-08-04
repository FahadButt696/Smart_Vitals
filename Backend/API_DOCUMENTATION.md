# Smart Vitals API Documentation

## Overview
This API provides comprehensive backend support for all dashboard features in the Smart Vitals application. All endpoints require authentication using Clerk.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require authentication. Include the Clerk session token in the Authorization header:
```
Authorization: Bearer <clerk-session-token>
```

## Endpoints

### 1. Calorie Tracking (`/calories`)

#### GET `/calories`
Get calorie data for a specific date
- **Query Parameters:**
  - `date` (optional): Date in YYYY-MM-DD format
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "consumed": 1850,
      "target": 2000,
      "remaining": 150,
      "protein": 85,
      "carbs": 220,
      "fat": 65,
      "fiber": 25,
      "sugar": 45
    },
    "meals": [...]
  }
  ```

#### POST `/calories/goals`
Set calorie goals
- **Body:**
  ```json
  {
    "dailyCalories": 2000,
    "protein": 120,
    "carbs": 250,
    "fat": 65
  }
  ```

#### GET `/calories/insights`
Get AI insights for calorie tracking
- **Query Parameters:**
  - `date` (optional): Date in YYYY-MM-DD format
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "title": "Calorie Balance",
        "insight": "You're 150 calories under your target...",
        "type": "info"
      }
    ]
  }
  ```

### 2. Meal Logging (`/meals`)

#### GET `/meals`
Get all meals for a user
- **Query Parameters:**
  - `date` (optional): Filter by date
  - `mealType` (optional): Filter by meal type
- **Response:**
  ```json
  {
    "success": true,
    "count": 5,
    "data": [...]
  }
  ```

#### POST `/meals`
Add a new meal
- **Body:**
  ```json
  {
    "foodName": "Oatmeal with Berries",
    "calories": 320,
    "mealType": "breakfast",
    "protein": 12,
    "carbs": 45,
    "fat": 8,
    "notes": "Added honey"
  }
  ```

#### PUT `/meals/:id`
Update a meal
- **Body:** Same as POST

#### DELETE `/meals/:id`
Delete a meal

#### GET `/meals/stats`
Get meal statistics
- **Query Parameters:**
  - `date` (optional): Date in YYYY-MM-DD format
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalCalories": 1850,
      "totalProtein": 85,
      "totalCarbs": 220,
      "totalFat": 65,
      "mealCount": 5,
      "mealTypes": {...}
    }
  }
  ```

### 3. Weight Tracking (`/weight`)

#### GET `/weight`
Get weight logs
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `limit` (optional): Number of records to return

#### POST `/weight`
Add a new weight log
- **Body:**
  ```json
  {
    "weight": 75.5,
    "date": "2024-01-15",
    "notes": "After workout"
  }
  ```

#### PUT `/weight/:id`
Update a weight log

#### DELETE `/weight/:id`
Delete a weight log

#### GET `/weight/progress`
Get weight progress analysis
- **Query Parameters:**
  - `period` (optional): Number of days (default: 30)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "currentWeight": 75.5,
      "startingWeight": 78.0,
      "totalChange": -2.5,
      "averageChange": -0.5,
      "trend": "losing",
      "logs": [...]
    }
  }
  ```

#### GET `/weight/insights`
Get weight insights
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "insights": [
        "Great progress! You're losing weight consistently."
      ]
    }
  }
  ```

### 4. Water Intake (`/water`)

#### GET `/water`
Get water intake logs
- **Query Parameters:**
  - `date` (optional): Filter by date

#### POST `/water`
Add water intake
- **Body:**
  ```json
  {
    "amount": 250,
    "drinkType": "water",
    "date": "2024-01-15"
  }
  ```

#### PUT `/water/:id`
Update water intake

#### DELETE `/water/:id`
Delete water intake

#### GET `/water/summary`
Get daily water summary
- **Query Parameters:**
  - `date` (optional): Date in YYYY-MM-DD format
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalIntake": 1200,
      "targetIntake": 2000,
      "remaining": 800,
      "progress": 60,
      "logs": [...]
    }
  }
  ```

#### GET `/water/insights`
Get water intake insights

### 5. Sleep Tracking (`/sleep`)

#### GET `/sleep`
Get sleep logs
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `limit` (optional): Number of records

#### POST `/sleep`
Add a new sleep log
- **Body:**
  ```json
  {
    "sleepTime": "2024-01-15T22:00:00Z",
    "wakeTime": "2024-01-16T06:30:00Z",
    "quality": "Good",
    "notes": "Slept well",
    "deepSleepHours": 2.5,
    "lightSleepHours": 4.0,
    "remSleepHours": 1.5
  }
  ```

#### PUT `/sleep/:id`
Update a sleep log

#### DELETE `/sleep/:id`
Delete a sleep log

#### GET `/sleep/stats`
Get sleep statistics
- **Query Parameters:**
  - `period` (optional): Number of days (default: 7)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "averageSleep": 7.8,
      "averageQuality": "Good",
      "totalSleepHours": 54.6,
      "sleepEfficiency": 85,
      "logs": [...]
    }
  }
  ```

#### GET `/sleep/insights`
Get sleep insights

### 6. Workout Tracking (`/workouts`)

#### GET `/workouts`
Get workout logs
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `workoutType` (optional): Filter by workout type
  - `limit` (optional): Number of records

#### POST `/workouts`
Add a new workout
- **Body:**
  ```json
  {
    "workoutType": "strength",
    "duration": 45,
    "calories": 320,
    "exercises": ["Bench Press", "Pull-ups"],
    "notes": "Great session",
    "intensity": "High",
    "heartRate": 140
  }
  ```

#### PUT `/workouts/:id`
Update a workout

#### DELETE `/workouts/:id`
Delete a workout

#### GET `/workouts/stats`
Get workout statistics
- **Query Parameters:**
  - `period` (optional): Number of days (default: 7)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalWorkouts": 5,
      "totalDuration": 225,
      "totalCalories": 1600,
      "averageDuration": 45,
      "workoutTypes": {...},
      "logs": [...]
    }
  }
  ```

#### GET `/workouts/insights`
Get workout insights

### 7. Mental Health (`/mental-health`)

#### GET `/mental-health`
Get mental health logs
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `limit` (optional): Number of records

#### POST `/mental-health`
Add a new mental health log
- **Body:**
  ```json
  {
    "mood": "Good",
    "stressLevel": 4,
    "anxietyLevel": 3,
    "sleepQuality": 7,
    "energyLevel": 6,
    "notes": "Feeling productive today",
    "activities": ["meditation", "exercise"],
    "date": "2024-01-15"
  }
  ```

#### PUT `/mental-health/:id`
Update a mental health log

#### DELETE `/mental-health/:id`
Delete a mental health log

#### GET `/mental-health/stats`
Get mental health statistics
- **Query Parameters:**
  - `period` (optional): Number of days (default: 7)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "averageMood": "Good",
      "averageStress": 4.2,
      "averageAnxiety": 3.1,
      "averageEnergy": 6.5,
      "moodTrend": "improving",
      "logs": [...]
    }
  }
  ```

#### GET `/mental-health/insights`
Get mental health insights

### 8. Symptom Tracking (`/symptoms`)

#### GET `/symptoms`
Get symptom logs
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `limit` (optional): Number of records

#### POST `/symptoms`
Add a new symptom log
- **Body:**
  ```json
  {
    "symptoms": ["headache", "fatigue"],
    "severity": 5,
    "duration": "2 hours",
    "triggers": ["stress", "lack of sleep"],
    "notes": "Started after lunch",
    "bodyLocation": "head",
    "temperature": 98.6
  }
  ```

#### PUT `/symptoms/:id`
Update a symptom log

#### DELETE `/symptoms/:id`
Delete a symptom log

#### POST `/symptoms/analyze`
Analyze symptoms with AI
- **Body:**
  ```json
  {
    "symptoms": "headache and fatigue",
    "severity": "Medium",
    "duration": "2 hours",
    "additionalInfo": "Started after lunch"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "severity": "Low",
      "recommendations": [
        "Rest in a quiet, dark room",
        "Stay hydrated"
      ],
      "warning": "If symptoms persist for more than 48 hours...",
      "possibleConditions": ["Tension headache", "Dehydration"]
    }
  }
  ```

#### GET `/symptoms/stats`
Get symptom statistics
- **Query Parameters:**
  - `period` (optional): Number of days (default: 30)

### 9. Diet Planning (`/diet`)

#### GET `/diet`
Get diet plans
- **Query Parameters:**
  - `startDate` (optional): Start date
  - `endDate` (optional): End date
  - `limit` (optional): Number of records

#### POST `/diet/generate`
Generate AI-powered diet plan
- **Body:**
  ```json
  {
    "goal": "Lose Weight",
    "preferences": ["vegetarian"],
    "restrictions": ["gluten"],
    "duration": 7,
    "targetCalories": 1800
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "user_123",
      "goal": "Lose Weight",
      "targetCalories": 1800,
      "duration": 7,
      "preferences": ["vegetarian"],
      "restrictions": ["gluten"],
      "meals": [...],
      "date": "2024-01-15T10:00:00Z",
      "aiGenerated": true
    }
  }
  ```

#### PUT `/diet/:id`
Update a diet plan

#### DELETE `/diet/:id`
Delete a diet plan

#### GET `/diet/recommendations`
Get diet recommendations
- **Query Parameters:**
  - `goal` (optional): Fitness goal
  - `preferences` (optional): Dietary preferences
  - `restrictions` (optional): Dietary restrictions
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "general": [
        "Focus on high-protein, low-calorie foods"
      ],
      "specific": [
        "Try grilled chicken with steamed vegetables"
      ],
      "tips": [
        "Eat slowly and mindfully to avoid overeating"
      ]
    }
  }
  ```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## Data Models

### Meal
```json
{
  "userId": "string",
  "foodName": "string",
  "calories": "number",
  "mealType": "breakfast|lunch|dinner|snack|pre_workout|post_workout",
  "protein": "number",
  "carbs": "number",
  "fat": "number",
  "fiber": "number",
  "sugar": "number",
  "sodium": "number",
  "notes": "string",
  "timestamp": "date"
}
```

### Weight Log
```json
{
  "userId": "string",
  "weight": "number",
  "date": "date",
  "notes": "string"
}
```

### Water Intake
```json
{
  "userId": "string",
  "amount": "number",
  "drinkType": "string",
  "date": "date"
}
```

### Sleep Log
```json
{
  "userId": "string",
  "sleepTime": "date",
  "wakeTime": "date",
  "quality": "Excellent|Good|Fair|Poor",
  "notes": "string",
  "deepSleepHours": "number",
  "lightSleepHours": "number",
  "remSleepHours": "number",
  "date": "date"
}
```

### Workout
```json
{
  "userId": "string",
  "workoutType": "strength|cardio|yoga|sports",
  "duration": "number",
  "calories": "number",
  "exercises": ["string"],
  "notes": "string",
  "intensity": "Low|Moderate|High",
  "heartRate": "number",
  "date": "date"
}
```

### Mental Health Log
```json
{
  "userId": "string",
  "mood": "Excellent|Good|Okay|Poor|Terrible",
  "stressLevel": "number (1-10)",
  "anxietyLevel": "number (1-10)",
  "sleepQuality": "number (1-10)",
  "energyLevel": "number (1-10)",
  "notes": "string",
  "activities": ["string"],
  "date": "date"
}
```

### Symptom Log
```json
{
  "userId": "string",
  "symptoms": ["string"],
  "severity": "number (1-10)",
  "duration": "string",
  "triggers": ["string"],
  "notes": "string",
  "bodyLocation": "string",
  "temperature": "number",
  "date": "date"
}
```

### Diet Plan
```json
{
  "userId": "string",
  "goal": "string",
  "targetCalories": "number",
  "duration": "number",
  "preferences": ["string"],
  "restrictions": ["string"],
  "meals": [...],
  "date": "date",
  "aiGenerated": "boolean"
}
```

## Notes

1. **Authentication**: All endpoints require valid Clerk authentication
2. **User ID**: The user ID is automatically extracted from the Clerk session
3. **Date Format**: Use ISO 8601 format for dates (YYYY-MM-DD)
4. **Pagination**: Use `limit` parameter to control response size
5. **Filtering**: Use date range parameters to filter data
6. **AI Features**: Symptom analysis and diet planning include basic AI logic
7. **Statistics**: All tracking features provide statistical analysis
8. **Insights**: AI-powered insights are available for most features

## Testing

You can test the API using tools like Postman or curl. Make sure to:
1. Include proper authentication headers
2. Use the correct content-type (application/json)
3. Follow the data models for request bodies
4. Handle responses appropriately in your frontend 