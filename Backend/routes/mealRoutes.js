import express from "express";
import {
  addMealFromImage,
  addMealManual,
  deleteMeal,
  updateMealManual,
  updateMealFromImage,
  getAllMeals,
  getMealById,
  getMealByFoodId,
  mealImageUpload
} from "../controllers/mealController.js";

const router = express.Router();

// Create
router.post("/add/image", mealImageUpload, addMealFromImage);
router.post("/add/manual", addMealManual);

// Read
router.get("/", getAllMeals); // <-- GET all meals for dashboard
router.get("/:id", getMealById);
router.get("/foodid/:foodId", getMealByFoodId);

// Update
router.put("/update/manual/:id", updateMealManual);
router.put("/update/image/:id", mealImageUpload, updateMealFromImage);

// Delete
router.delete("/:id", deleteMeal);

export default router;
