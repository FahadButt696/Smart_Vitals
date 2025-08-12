import AiRecommendation from "../models/AiRecommendation.js";
import User from "../models/User.js";
import axios from "axios";

// Fine-tuned prompt for Gemini API
function buildGeminiPrompt(user) {
  return `
You are a knowledgeable, empathetic health and fitness expert assistant. Based on the detailed user profile below, generate concise, actionable, and personalized recommendations for each category listed.

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

Please respond ONLY in JSON format with these keys exactly:
{
  "mealLog": "string with personalized meal/nutrition advice",
  "workoutTracker": "string with workout suggestions or tips",
  "sleepTracker": "string with sleep hygiene or tracking advice",
  "mentalHealthChatbot": "string with mental health support tips",
  "hydration": "string with water intake reminders or advice",
  "weightProgress": "string with weight management guidance",
  "symptomChecker": "string with symptom management advice",
  "generalTips": "string with any additional general health tips"
}

Make the advice friendly, brief, and actionable.
`;
}

// Fallback recommendations when Gemini API fails
function createFallbackRecommendations(user) {
  const goal = user.goal.toLowerCase();
  const activityLevel = user.activityLevel.toLowerCase();
  const dietaryPreference = user.dietaryPreference.toLowerCase();
  
  return {
    mealLog: `Based on your ${goal} goal and ${dietaryPreference} diet, focus on ${goal.includes('muscle') ? 'high-protein meals' : goal.includes('weight') ? 'balanced nutrition' : 'maintaining current habits'}. Track your meals consistently to see progress.`,
    workoutTracker: `With ${user.workoutDaysPerWeek} workout days per week, you're on a great track! Focus on ${goal.includes('muscle') ? 'strength training' : goal.includes('weight') ? 'cardio and strength mix' : 'maintaining variety'}.`,
    sleepTracker: `Aim for ${user.sleepGoal || 8} hours of quality sleep. Create a consistent bedtime routine and avoid screens before bed for better rest.`,
    mentalHealthChatbot: user.wantsMentalSupport ? "Your mental health matters! Use our chatbot for daily check-ins and stress management techniques." : "Consider tracking your mood and stress levels to maintain mental wellness.",
    hydration: `Stay hydrated with your goal of ${user.waterIntakeGoal || 2000}ml daily. Carry a water bottle and set reminders throughout the day.`,
    weightProgress: `Track your weight consistently, but remember that ${goal.includes('muscle') ? 'muscle gain may show as weight increase' : goal.includes('weight') ? 'weight loss takes time' : 'maintenance requires balance'}.`,
    symptomChecker: "Monitor any unusual symptoms and track patterns. Early detection leads to better health outcomes.",
    generalTips: `Consistency is key to achieving your ${goal} goal. Small daily actions compound into significant results over time.`
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
            temperature: 0.7,
            maxOutputTokens: 800,
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
      } catch (err) {
        console.error("❌ Failed to parse AI response as JSON:", err);
        // Save the full text under generalTips if JSON parsing fails
        recommendations = { generalTips: aiText };
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
