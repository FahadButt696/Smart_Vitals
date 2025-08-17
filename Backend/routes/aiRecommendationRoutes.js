import express from "express";
import { generateAndSaveRecommendations, getRecommendations } from "../controllers/aiRecommendationController.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";
import User from "../models/User.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 AI Recommendation Route: ${req.method} ${req.path}`);
  next();
});

router.post("/generate", clerkAuthMiddleware, generateAndSaveRecommendations);
router.get("/me", clerkAuthMiddleware, getRecommendations);

// Manual trigger for cron job (for testing purposes)
router.post("/trigger-cron", async (req, res) => {
  try {
    console.log("🚀 Manually triggering AI recommendations cron job...");
    
    // Import the cron function
    const { generateAndSaveForUser } = await import('../cron/aiRecommendationCron.js');
    
    // Find users who need recommendations updated
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
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

    console.log(`Found ${usersToUpdate.length} users to update`);
    
    let successCount = 0;
    for (const user of usersToUpdate) {
      try {
        await generateAndSaveForUser(user);
        successCount++;
      } catch (error) {
        console.error(`Failed for user ${user.clerkId}:`, error.message);
      }
    }

    res.json({ 
      message: "Manual cron job triggered successfully",
      usersProcessed: usersToUpdate.length,
      successCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Error in manual cron trigger:", error);
    res.status(500).json({ 
      error: "Failed to trigger cron job",
      message: error.message 
    });
  }
});

router.get("/test", (req, res) => {
  res.json({ 
    message: "AI recommendation routes are working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    geminiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
  });
});

// Test endpoint to check if a user has recommendations
router.get("/check/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const rec = await AiRecommendation.findOne({ userId });
    
    if (rec) {
      res.json({ 
        hasRecommendations: true, 
        lastUpdated: rec.lastUpdated,
        categories: Object.keys(rec.recommendations).filter(key => 
          rec.recommendations[key] && rec.recommendations[key].length > 0
        )
      });
    } else {
      res.json({ 
        hasRecommendations: false, 
        message: "No recommendations found for this user" 
      });
    }
  } catch (error) {
    console.error("Error checking recommendations:", error);
    res.status(500).json({ error: "Failed to check recommendations" });
  }
});

export default router;
