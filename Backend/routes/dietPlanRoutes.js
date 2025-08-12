// routes/dietPlanRoutes.js
import express from "express";
import { generateDietPlan, getDietPlans, deleteDietPlan } from "../controllers/dietPlanController.js";

const router = express.Router();

router.post("/generate", generateDietPlan);
router.get("/", getDietPlans);
router.delete("/:id", deleteDietPlan);

export default router;
