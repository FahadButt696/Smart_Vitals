import express from 'express';
import { sendContactEmail, emailHealthCheck } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contact - Send contact form email
router.post('/', sendContactEmail);

// GET /api/contact/health - Health check for email service
router.get('/health', emailHealthCheck);

export default router;
