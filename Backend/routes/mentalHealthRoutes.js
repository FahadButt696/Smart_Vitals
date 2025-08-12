import express from "express";
import { sendMessage, getChatHistory, clearChatHistory, getConversationInsights } from "../controllers/mentalHealthController.js";
import { clerkAuthMiddleware } from "../middleware/clerkMiddleWare.js";

const router = express.Router();

router.post("/chat", clerkAuthMiddleware, sendMessage);
router.get("/chat/me", clerkAuthMiddleware, getChatHistory);
router.delete("/chat/me", clerkAuthMiddleware, clearChatHistory);
router.get("/insights/me", clerkAuthMiddleware, getConversationInsights);

export default router;
