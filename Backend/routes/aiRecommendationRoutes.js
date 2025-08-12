import express from "express";
import { generateAndSaveRecommendations, getRecommendations } from "../controllers/aiRecommendationController.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔍 AI Recommendation Route: ${req.method} ${req.path}`);
  next();
});

router.post("/generate", clerkAuthMiddleware, generateAndSaveRecommendations);
router.get("/me", clerkAuthMiddleware, getRecommendations);
router.get("/test", (req, res) => {
  res.json({ message: "AI recommendation routes are working!" });
});

export default router;
