# AI Recommendations Usage Guide

## Overview
The AI recommendation system is designed to call the Gemini API only once per user - either immediately after onboarding or when a signed-in user doesn't have recommendations. Once generated, recommendations are stored in the database and fetched from there for all subsequent requests.

## Available Hooks

### 1. `useAIRecommendations` - For Initial Generation
Use this hook when you need to generate AI recommendations for the first time (e.g., during onboarding or dashboard initialization).

```jsx
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const Dashboard = () => {
  const { recommendations, isLoading, error, hasGenerated } = useAIRecommendations();
  
  if (isLoading) return <div>Generating AI recommendations...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {recommendations && (
        <div>
          <h3>AI Recommendations</h3>
          <p>{recommendations.mealLog}</p>
          <p>{recommendations.workoutTracker}</p>
          {/* ... other recommendations */}
        </div>
      )}
    </div>
  );
};
```

### 2. `useExistingAIRecommendations` - For Feature-Specific Usage
Use this hook in different features when you only need to display existing recommendations without triggering generation.

```jsx
import { useExistingAIRecommendations } from '@/hooks/useAIRecommendations';

// In MealLogger component
const MealLogger = () => {
  const { recommendations, isLoading } = useExistingAIRecommendations();
  
  if (isLoading) return <div>Loading recommendations...</div>;
  
  return (
    <div>
      {recommendations?.mealLog && (
        <div className="ai-tip">
          <h4>AI Tip</h4>
          <p>{recommendations.mealLog}</p>
        </div>
      )}
    </div>
  );
};

// In WorkoutTracker component
const WorkoutTracker = () => {
  const { recommendations, isLoading } = useExistingAIRecommendations();
  
  if (isLoading) return <div>Loading recommendations...</div>;
  
  return (
    <div>
      {recommendations?.workoutTracker && (
        <div className="ai-tip">
          <h4>AI Workout Tip</h4>
          <p>{recommendations.workoutTracker}</p>
        </div>
      )}
    </div>
  );
};

// In SleepTracker component
const SleepTracker = () => {
  const { recommendations, isLoading } = useExistingAIRecommendations();
  
  if (isLoading) return <div>Loading recommendations...</div>;
  
  return (
    <div>
      {recommendations?.sleepTracker && (
        <div className="ai-tip">
          <h4>AI Sleep Tip</h4>
          <p>{recommendations.sleepTracker}</p>
        </div>
      )}
    </div>
  );
};
```

## How It Works

### 1. **Initial Generation (ONCE)**
- When a user first accesses the dashboard or completes onboarding
- `useAIRecommendations` hook is used
- If no recommendations exist, Gemini API is called
- Recommendations are stored in the database
- Future calls will fetch from database, not API

### 2. **Feature-Specific Usage**
- Different features use `useExistingAIRecommendations`
- This hook only fetches existing recommendations
- No API calls to Gemini are made
- Fast and efficient data retrieval

### 3. **Database Storage**
- All recommendations are stored in the `AiRecommendation` collection
- Key fields: `userId` (Clerk ID), `recommendations` (object), `lastUpdated` (timestamp)
- Recommendations persist across sessions

## Recommendation Categories

Each user gets personalized recommendations for:

- **mealLog**: Nutrition and meal advice
- **workoutTracker**: Exercise suggestions and tips
- **sleepTracker**: Sleep hygiene and tracking advice
- **mentalHealthChatbot**: Mental health support tips
- **hydration**: Water intake reminders and advice
- **weightProgress**: Weight management guidance
- **symptomChecker**: Symptom management advice
- **generalTips**: Additional general health tips

## Best Practices

1. **Use `useAIRecommendations` only once** - typically in the main dashboard or onboarding flow
2. **Use `useExistingAIRecommendations` everywhere else** - in individual features and components
3. **Handle loading states** - show appropriate loading indicators
4. **Handle missing recommendations gracefully** - some users might not have recommendations yet
5. **Don't call generation multiple times** - the system prevents duplicate API calls

## Example Implementation in Features

```jsx
// Feature: Weight Tracker
const WeightTracker = () => {
  const { recommendations } = useExistingAIRecommendations();
  
  return (
    <div>
      <h2>Weight Tracker</h2>
      
      {/* Weight tracking functionality */}
      <WeightChart />
      <WeightInput />
      
      {/* AI Recommendation */}
      {recommendations?.weightProgress && (
        <div className="ai-recommendation">
          <h4>💡 AI Recommendation</h4>
          <p>{recommendations.weightProgress}</p>
        </div>
      )}
    </div>
  );
};
```

This approach ensures that:
- Gemini API is called only once per user
- Recommendations are efficiently reused across features
- No duplicate API calls or unnecessary costs
- Fast loading times for existing recommendations
- Personalized content throughout the application

