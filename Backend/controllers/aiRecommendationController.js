import AiRecommendation from "../models/AiRecommendation.js";
import User from "../models/User.js";
import axios from "axios";

// Fine-tuned prompt for Gemini API to generate 4 recommendations per category
function buildGeminiPrompt(user) {
  return `
You are a knowledgeable, empathetic health and fitness expert assistant. Based on the detailed user profile below, generate 4 unique, actionable, and personalized recommendations for each category listed.

User Profile:
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height.value} ${user.height.unit}
- Weight: ${user.weight.value} ${user.weight.unit}
- Goal: ${user.goal}
- Target Weight: ${user.targetWeight}
- Activity Level: ${user.activityLevel}
- Dietary Preference: ${user.dietaryPreference}
- Medical Conditions: ${user.medicalConditions || "None"}
- Allergies: ${user.allergies || "None"}
- Medications: ${user.medications || "None"}
- Workout Days Per Week: ${user.workoutDaysPerWeek}
- Workout Preferences: ${user.workoutPreferences.length > 0 ? user.workoutPreferences.join(", ") : "None"}
- Meal Plan Type: ${user.mealPlanType}
- Water Intake Goal: ${user.waterIntakeGoal} ml
- Wants Mental Support: ${user.wantsMentalSupport ? "Yes" : "No"}

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
}

// Fallback recommendations when Gemini API fails - now with 4 per category
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

export const generateAndSaveRecommendations = async (req, res) => {
  try {
    const userId = req.auth.userId; // Get from authenticated request
    console.log("🔍 Generating AI recommendations for user:", userId);
    
    // Check if recommendations already exist
    const existingRec = await AiRecommendation.findOne({ userId });
    if (existingRec) {
      console.log("✅ Recommendations already exist for user:", userId);
      return res.json({ 
        message: "Recommendations already exist", 
        data: existingRec,
        alreadyExists: true 
      });
    }
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      console.log("❌ User not found for clerkId:", userId);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ User found:", user.fullName);

    const prompt = buildGeminiPrompt(user);
    console.log("📝 Generated prompt for Gemini API");

    // Call Gemini API
    console.log("🚀 Calling Gemini API...");
    let recommendations = {};
    
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      console.log("🤖 Gemini API response received:", aiText.substring(0, 100) + "...");

      try {
        recommendations = JSON.parse(aiText);
        console.log("✅ Successfully parsed AI response as JSON");
        
        // Validate that each category has an array with 4 recommendations
        const categories = ['mealLog', 'workoutTracker', 'sleepTracker', 'mentalHealthChatbot', 'hydration', 'weightProgress', 'symptomChecker', 'generalTips'];
        for (const category of categories) {
          if (!Array.isArray(recommendations[category]) || recommendations[category].length < 4) {
            console.log(`⚠️ Category ${category} doesn't have 4 recommendations, using fallback`);
            recommendations[category] = createFallbackRecommendations(user)[category];
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse AI response as JSON:", err);
        // Use fallback recommendations if JSON parsing fails
        recommendations = createFallbackRecommendations(user);
      }
    } catch (apiError) {
      console.error("❌ Gemini API failed, using fallback recommendations:", apiError.message);
      
      // Create fallback recommendations based on user profile
      recommendations = createFallbackRecommendations(user);
      console.log("✅ Generated fallback recommendations");
    }

    console.log("💾 Saving recommendations to database...");
    const updatedRec = await AiRecommendation.findOneAndUpdate(
      { userId },
      { recommendations, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    console.log("✅ AI recommendations saved successfully");
    res.json({ message: "AI recommendations updated", data: updatedRec });
  } catch (error) {
    console.error("Error generating AI recommendations:", error.response?.data || error.message);
    
    // Check if it's a rate limit error
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        message: "AI recommendations temporarily unavailable due to high demand. Please try again later.",
        error: "RATE_LIMIT_EXCEEDED"
      });
    }
    
    // Check if it's an API key error
    if (error.response?.status === 400 && error.response?.data?.error?.message?.includes('API key')) {
      return res.status(400).json({ 
        message: "AI service configuration error. Please contact support.",
        error: "API_KEY_ERROR"
      });
    }
    
    res.status(500).json({ 
      message: "Failed to generate AI recommendations. Please try again later.",
      error: "INTERNAL_ERROR"
    });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.auth.userId; // Get from authenticated request
    console.log("🔍 Fetching AI recommendations for user:", userId);
    
    const rec = await AiRecommendation.findOne({ userId });
    if (!rec) {
      console.log("❌ No recommendations found for user:", userId);
      return res.status(404).json({ message: "Recommendations not found" });
    }
    
    console.log("✅ Recommendations found for user:", userId);
    res.json(rec);
  } catch (error) {
    console.error("❌ Error fetching AI recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
