import express from "express";
import {
  detectFoodFromImage,
  saveMeal,
  deleteMeal,
  updateMeal,
  getAllMeals,
  getMealById,
  getMealByFoodId,
  addManualMeal,
  searchFoods
} from "../controllers/mealController.js";
import { cloudinaryUpload, handleUploadError } from "../middleware/cloudinaryUpload.js";

const router = express.Router();

// Use Cloudinary upload middleware for image detection with correct field name
router.post("/detect", cloudinaryUpload({ fieldName: 'mealImage' }), detectFoodFromImage);
router.post("/save", saveMeal);
router.post("/manual", addManualMeal);

// Search route should come before parameterized routes
router.get("/search/:query", searchFoods);
router.get("/food/:foodId", getMealByFoodId);

// Parameterized routes should come last
router.get("/:id", getMealById);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

// Get all meals route
router.get("/", getAllMeals);

// Error handling for upload errors
router.use(handleUploadError);

export default router;
