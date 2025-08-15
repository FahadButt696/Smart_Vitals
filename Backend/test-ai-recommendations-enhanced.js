import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'http://localhost:5000';

// Test user data
const testUser = {
  age: 28,
  gender: "Male",
  height: { value: 175, unit: "cm" },
  weight: { value: 70, unit: "kg" },
  goal: "Build Muscle",
  targetWeight: 75,
  activityLevel: "Moderate",
  dietaryPreference: "Balanced",
  medicalConditions: "None",
  allergies: "None",
  medications: "None",
  workoutDaysPerWeek: 4,
  workoutPreferences: ["Strength Training", "Cardio"],
  mealPlanType: "High Protein",
  waterIntakeGoal: 2500,
  wantsMentalSupport: true
};

// Test the enhanced prompt
async function testEnhancedPrompt() {
  console.log('🧪 Testing Enhanced AI Recommendation Prompt...\n');
  
  const prompt = `
You are a knowledgeable, empathetic health and fitness expert assistant. Based on the detailed user profile below, generate 4 unique, actionable, and personalized recommendations for each category listed.

User Profile:
- Age: ${testUser.age}
- Gender: ${testUser.gender}
- Height: ${testUser.height.value} ${testUser.height.unit}
- Weight: ${testUser.weight.value} ${testUser.weight.unit}
- Goal: ${testUser.goal}
- Target Weight: ${testUser.targetWeight}
- Activity Level: ${testUser.activityLevel}
- Dietary Preference: ${testUser.dietaryPreference}
- Medical Conditions: ${testUser.medicalConditions || "None"}
- Allergies: ${testUser.allergies || "None"}
- Medications: ${testUser.medications || "None"}
- Workout Days Per Week: ${testUser.workoutDaysPerWeek}
- Workout Preferences: ${testUser.workoutPreferences.length > 0 ? testUser.workoutPreferences.join(", ") : "None"}
- Meal Plan Type: ${testUser.mealPlanType}
- Water Intake Goal: ${testUser.waterIntakeGoal} ml
- Wants Mental Support: ${testUser.wantsMentalSupport ? "Yes" : "No"}

Please respond ONLY in JSON format with these keys exactly. Each category should contain an array of 4 unique recommendations:
{
  "mealLog": [
    "First personalized meal/nutrition advice",
    "Second personalized meal/nutrition advice", 
    "Third personalized meal/nutrition advice",
    "Fourth personalized meal/nutrition advice"
  ],
  "workoutTracker": [
    "First workout suggestion or tip",
    "Second workout suggestion or tip",
    "Third workout suggestion or tip", 
    "Fourth workout suggestion or tip"
  ],
  "sleepTracker": [
    "First sleep hygiene or tracking advice",
    "Second sleep hygiene or tracking advice",
    "Third sleep hygiene or tracking advice",
    "Fourth sleep hygiene or tracking advice"
  ],
  "mentalHealthChatbot": [
    "First mental health support tip",
    "Second mental health support tip",
    "Third mental health support tip",
    "Fourth mental health support tip"
  ],
  "hydration": [
    "First water intake reminder or advice",
    "Second water intake reminder or advice",
    "Third water intake reminder or advice",
    "Fourth water intake reminder or advice"
  ],
  "weightProgress": [
    "First weight management guidance",
    "Second weight management guidance",
    "Third weight management guidance",
    "Fourth weight management guidance"
  ],
  "symptomChecker": [
    "First symptom management advice",
    "Second symptom management advice",
    "Third symptom management advice",
    "Fourth symptom management advice"
  ],
  "generalTips": [
    "First additional general health tip",
    "Second additional general health tip",
    "Third additional general health tip",
    "Fourth additional general health tip"
  ]
}

Make each recommendation:
- Specific to the user's profile
- Actionable and practical
- Friendly and encouraging
- Different from other recommendations in the same category
- Brief but informative (1-2 sentences each)
`;

  try {
    console.log('📝 Sending enhanced prompt to Gemini API...');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2000,
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );

    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log('✅ Gemini API response received successfully!');
    console.log('📄 Response length:', aiText.length, 'characters');
    
    try {
      const recommendations = JSON.parse(aiText);
      console.log('✅ Successfully parsed AI response as JSON');
      
      // Validate structure
      const categories = ['mealLog', 'workoutTracker', 'sleepTracker', 'mentalHealthChatbot', 'hydration', 'weightProgress', 'symptomChecker', 'generalTips'];
      let isValid = true;
      
      for (const category of categories) {
        if (!Array.isArray(recommendations[category])) {
          console.log(`❌ Category ${category} is not an array`);
          isValid = false;
        } else if (recommendations[category].length < 4) {
          console.log(`❌ Category ${category} has only ${recommendations[category].length} recommendations (expected 4)`);
          isValid = false;
        } else {
          console.log(`✅ Category ${category}: ${recommendations[category].length} recommendations`);
        }
      }
      
      if (isValid) {
        console.log('\n🎉 All categories have 4 recommendations!');
        
        // Display sample recommendations
        console.log('\n📋 Sample Recommendations:');
        console.log('🍽️  Meal Log:', recommendations.mealLog[0]);
        console.log('💪 Workout:', recommendations.workoutTracker[0]);
        console.log('😴 Sleep:', recommendations.sleepTracker[0]);
        console.log('🧠 Mental Health:', recommendations.mentalHealthChatbot[0]);
      } else {
        console.log('\n⚠️  Some categories are missing recommendations');
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError.message);
      console.log('📄 Raw response preview:', aiText.substring(0, 200) + '...');
    }
    
  } catch (apiError) {
    console.error('❌ Gemini API failed:', apiError.response?.data || apiError.message);
  }
}

// Test fallback recommendations
function testFallbackRecommendations() {
  console.log('\n🧪 Testing Fallback Recommendations...\n');
  
  const fallbackRecs = createFallbackRecommendations(testUser);
  
  const categories = ['mealLog', 'workoutTracker', 'sleepTracker', 'mentalHealthChatbot', 'hydration', 'weightProgress', 'symptomChecker', 'generalTips'];
  
  for (const category of categories) {
    if (Array.isArray(fallbackRecs[category]) && fallbackRecs[category].length === 4) {
      console.log(`✅ ${category}: ${fallbackRecs[category].length} fallback recommendations`);
    } else {
      console.log(`❌ ${category}: Invalid fallback structure`);
    }
  }
  
  console.log('\n📋 Sample Fallback Recommendations:');
  console.log('🍽️  Meal Log:', fallbackRecs.mealLog[0]);
  console.log('💪 Workout:', fallbackRecs.workoutTracker[0]);
  console.log('😴 Sleep:', fallbackRecs.sleepTracker[0]);
}

// Fallback recommendations function (copied from controller)
function createFallbackRecommendations(user) {
  const goal = user.goal.toLowerCase();
  const activityLevel = user.activityLevel.toLowerCase();
  const dietaryPreference = user.dietaryPreference.toLowerCase();
  
  return {
    mealLog: [
      `Based on your ${goal} goal and ${dietaryPreference} diet, focus on ${goal.includes('muscle') ? 'high-protein meals' : goal.includes('weight') ? 'balanced nutrition' : 'maintaining current habits'}. Track your meals consistently to see progress.`,
      `Consider meal prepping on Sundays to stay on track with your ${dietaryPreference} diet throughout the week.`,
      `Include a variety of colorful vegetables in your meals to ensure you're getting all necessary nutrients for your ${goal} journey.`,
      `Monitor your portion sizes and use smaller plates to help with ${goal.includes('weight') ? 'weight management' : 'portion control'}.`
    ],
    workoutTracker: [
      `With ${user.workoutDaysPerWeek} workout days per week, you're on a great track! Focus on ${goal.includes('muscle') ? 'strength training' : goal.includes('weight') ? 'cardio and strength mix' : 'maintaining variety'}.`,
      `Try incorporating high-intensity interval training (HIIT) 2-3 times per week to maximize your workout efficiency.`,
      `Don't forget to include rest days and stretching sessions to prevent injury and improve recovery.`,
      `Track your workout progress by logging sets, reps, and weights to see your strength improvements over time.`
    ],
    sleepTracker: [
      `Aim for ${user.sleepGoal || 8} hours of quality sleep. Create a consistent bedtime routine and avoid screens before bed for better rest.`,
      `Keep your bedroom cool, dark, and quiet to create an optimal sleep environment.`,
      `Try to go to bed and wake up at the same time every day, even on weekends, to maintain your circadian rhythm.`,
      `Avoid caffeine after 2 PM and heavy meals close to bedtime to improve sleep quality.`
    ],
    mentalHealthChatbot: [
      user.wantsMentalSupport ? "Your mental health matters! Use our chatbot for daily check-ins and stress management techniques." : "Consider tracking your mood and stress levels to maintain mental wellness.",
      "Practice mindfulness or meditation for 10 minutes daily to reduce stress and improve mental clarity.",
      "Set aside time each day for activities you enjoy to boost your mood and reduce stress.",
      "Connect with friends and family regularly, as social connections are crucial for mental well-being."
    ],
    hydration: [
      `Stay hydrated with your goal of ${user.waterIntakeGoal || 2000}ml daily. Carry a water bottle and set reminders throughout the day.`,
      "Start your day with a glass of water to kickstart your metabolism and rehydrate after sleep.",
      "Add lemon, cucumber, or mint to your water to make it more enjoyable and encourage regular consumption.",
      "Monitor your urine color - it should be light yellow, indicating proper hydration levels."
    ],
    weightProgress: [
      `Track your weight consistently, but remember that ${goal.includes('muscle') ? 'muscle gain may show as weight increase' : goal.includes('weight') ? 'weight loss takes time' : 'maintenance requires balance'}.`,
      "Take progress photos and measurements weekly, as the scale doesn't always tell the full story.",
      "Focus on non-scale victories like improved energy, better sleep, and increased strength.",
      "Be patient with your progress - sustainable changes take time and consistency."
    ],
    symptomChecker: [
      "Monitor any unusual symptoms and track patterns. Early detection leads to better health outcomes.",
      "Keep a symptom diary to identify triggers and patterns that may help with diagnosis.",
      "Don't ignore persistent symptoms - consult with healthcare professionals when needed.",
      "Track your symptoms alongside lifestyle factors like diet, sleep, and stress to identify correlations."
    ],
    generalTips: [
      `Consistency is key to achieving your ${goal} goal. Small daily actions compound into significant results over time.`,
      "Listen to your body and adjust your routine based on how you feel each day.",
      "Celebrate small wins and progress, no matter how small they may seem.",
      "Remember that health is a journey, not a destination - focus on building sustainable habits."
    ]
  };
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Enhanced AI Recommendations Test Suite...\n');
  
  if (!GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('💡 Please add your Gemini API key to .env file');
    return;
  }
  
  await testEnhancedPrompt();
  testFallbackRecommendations();
  
  console.log('\n✨ Test suite completed!');
}

runTests().catch(console.error);
