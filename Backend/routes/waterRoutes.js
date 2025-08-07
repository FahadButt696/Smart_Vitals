import express from "express";
import { 
  addWater, 
  getWater, 
  deleteWater, 
  updateWater, 
  getWaterById, 
  getWaterStats 
} from "../controllers/waterController.js";

const router = express.Router();

// Water tracking routes
router.post("/", addWater);
router.get("/", getWater);
router.get("/stats", getWaterStats);
router.get("/:id", getWaterById);
router.put("/:id", updateWater);
router.delete("/:id", deleteWater);

export default router;
