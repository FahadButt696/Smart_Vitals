import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  getChatSessions,
  getChatSession,
  createChatSession,
  addMessage,
  endChatSession
} from '../controllers/chatController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Get all chat sessions
router.get('/sessions', getChatSessions);

// Get specific chat session
router.get('/sessions/:sessionId', getChatSession);

// Create new chat session
router.post('/sessions', createChatSession);

// Add message to session
router.post('/sessions/:sessionId/messages', addMessage);

// End chat session
router.patch('/sessions/:sessionId/end', endChatSession);

export default router; 