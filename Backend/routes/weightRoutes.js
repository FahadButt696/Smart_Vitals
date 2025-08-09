import express from "express";
import { 
  addWeight, 
  getWeight, 
  updateWeight, 
  deleteWeight, 
  getWeightStats, 
  getWeightProgress 
} from "../controllers/weightController.js";

const router = express.Router();

// Basic CRUD operations
router.post("/", addWeight);
router.get("/", getWeight);
router.put("/:id", updateWeight);
router.delete("/:id", deleteWeight);

// Analytics and stats
router.get("/stats", getWeightStats);
router.get("/progress", getWeightProgress);

export default router;
