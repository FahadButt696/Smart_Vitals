import express from "express";
import {
  detectFoodFromImage,
  saveMeal,
  deleteMeal,
  updateMeal,
  getAllMeals,
  getMealById,
  getMealByFoodId,
  mealImageUpload,
  addManualMeal,
  searchFoods
} from "../controllers/mealController.js";

const router = express.Router();

router.post("/detect", mealImageUpload, detectFoodFromImage);
router.post("/save", saveMeal);
router.post("/manual", addManualMeal);
router.get("/search", searchFoods);
router.delete("/:id", deleteMeal);
router.put("/:id", updateMeal);
router.get("/", getAllMeals);
router.get("/:id", getMealById);
router.get("/foodid/:foodId", getMealByFoodId);

export default router;
