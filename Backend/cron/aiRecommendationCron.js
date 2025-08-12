import cron from "node-cron";
import AiRecommendation from "../models/AiRecommendation.js";
import User from "../models/User.js";
import axios from "axios";

// Reuse or import your AI recommendation generation function
async function generateAndSaveForUser(user) {
  try {
    // Check if recommendations already exist and are recent (less than 3 days old)
    const existingRec = await AiRecommendation.findOne({ userId: user.clerkId });
    if (existingRec && existingRec.lastUpdated) {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      if (existingRec.lastUpdated > threeDaysAgo) {
        console.log(`AI recommendations are recent for user ${user.clerkId}, skipping generation`);
        return;
      }
    }
    
    console.log(`Generating AI recommendations for user ${user.clerkId}...`);
    const prompt = buildGeminiPrompt(user);

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

    let recommendations = {};
    try {
      recommendations = JSON.parse(aiText);
    } catch (err) {
      console.error("Failed to parse AI response as JSON:", err);
      recommendations = { generalTips: aiText };
    }

    await AiRecommendation.findOneAndUpdate(
      { userId: user.clerkId },
      { recommendations, lastUpdated: new Date() },
      { upsert: true }
    );

    console.log(`AI recommendations updated for user ${user.clerkId}`);
  } catch (error) {
    console.error(`Failed to update AI recommendations for user ${user.clerkId}`, error.response?.data || error.message);
  }
}

// Helper function to build the Gemini prompt (same as controller)
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

// Schedule cron job: Runs every 3rd day at midnight
cron.schedule("0 0 */3 * *", async () => {
  console.log("🕐 Running AI recommendations update job every 3 days...");
  console.log(`📅 Current time: ${new Date().toISOString()}`);

  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    console.log(`🔍 Looking for users with recommendations older than: ${threeDaysAgo.toISOString()}`);

    // Find users who either:
    // 1. Have no AI recommendations yet
    // 2. Have AI recommendations last updated more than 3 days ago
    const usersToUpdate = await User.aggregate([
      {
        $lookup: {
          from: "airecommendations",
          localField: "clerkId",
          foreignField: "userId",
          as: "aiRec",
        },
      },
      {
        $match: {
          $or: [
            { "aiRec": { $size: 0 } },
            { "aiRec.lastUpdated": { $lte: threeDaysAgo } }
          ]
        },
      },
    ]);

    console.log(`✅ Found ${usersToUpdate.length} users to update AI recommendations for.`);

    if (usersToUpdate.length === 0) {
      console.log("📝 No users need recommendations updated at this time.");
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersToUpdate) {
      try {
        await generateAndSaveForUser(user);
        successCount++;
        console.log(`✅ Successfully updated recommendations for user: ${user.clerkId}`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to update recommendations for user ${user.clerkId}:`, error.message);
      }
    }

    console.log(`🎯 Cron job completed: ${successCount} successful, ${errorCount} failed`);
    
  } catch (error) {
    console.error("💥 Critical error running AI recommendations update job:", error);
    console.error("Stack trace:", error.stack);
  }
});

// Log when cron job is scheduled
console.log("⏰ AI recommendations cron job scheduled to run every 3 days at midnight");
console.log("📋 Next run: Every 3rd day at 00:00");
