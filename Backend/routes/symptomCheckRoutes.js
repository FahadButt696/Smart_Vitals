import express from "express";
import {
  runSymptomCheck,
  getSymptomChecks,
  getSymptomCheckById,
  deleteSymptomCheck,
  healthCheck
} from "../controllers/symptomCheckController.js";

const router = express.Router();

// POST - Run a new symptom check
router.post("/check", runSymptomCheck);

// GET - Health check for Infermedica API
router.get("/health", healthCheck);

// GET - All checks for a user
router.get("/", getSymptomChecks);

// GET - Single check by ID
router.get("/:id", getSymptomCheckById);

// DELETE - Delete a symptom check
router.delete("/:id", deleteSymptomCheck);

export default router;
