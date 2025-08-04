import express from 'express';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';
import {
  processVoiceCommand,
  getVoiceLogs,
  getVoiceStats
} from '../controllers/voiceAssistantController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(clerkAuthMiddleware);

// Process voice command
router.post('/process', processVoiceCommand);

// Get voice logs
router.get('/logs', getVoiceLogs);

// Get voice statistics
router.get('/stats', getVoiceStats);

export default router; 