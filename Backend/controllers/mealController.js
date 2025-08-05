import axios from "axios";
import FormData from "form-data";
import Meal from "../models/mealModel.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

/**
 * Add meal via CalorieMama image
 */
export const addMealFromImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const formData = new FormData();
    formData.append("media", req.file.buffer, { filename: req.file.originalname });

    const apiRes = await axios.post(
      `https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition?user_key=${process.env.CALORIEMAMA_API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );

    const topResult = apiRes.data.results[0]?.items[0];
    if (!topResult) return res.status(404).json({ error: "No food detected" });

    const meal = new Meal({
      userId: req.body.userId, // for Postman testing
      name: topResult.name,
      mealType: req.body.mealType || "snack",
      score: topResult.score,
      group: topResult.group,
      foodId: topResult.food_id,
      calories: { value: topResult.nutrition.calories, unit: "kcal" },
      protein: { value: topResult.nutrition.protein, unit: "g" },
      carbs: { value: topResult.nutrition.totalCarbs, unit: "g" },
      fat: { value: topResult.nutrition.totalFat, unit: "g" },
      servingSizes: topResult.servingSizes.map(s => ({
        unit: s.unit,
        servingWeight: s.servingWeight
      }))
    });

    await meal.save();
    res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error("Error adding meal from image:", err.message);
    res.status(500).json({ error: "Failed to process image" });
  }
};

/**
 * Add meal manually
 */
export const addMealManual = async (req, res) => {
  try {
    const meal = new Meal(req.body);
    await meal.save();
    res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error("Error adding manual meal:", err.message);
    res.status(500).json({ error: "Failed to add meal" });
  }
};

/**
 * Delete meal
 */
export const deleteMeal = async (req, res) => {
  try {
    const deleted = await Meal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true, message: "Meal deleted" });
  } catch (err) {
    console.error("Error deleting meal:", err.message);
    res.status(500).json({ error: "Failed to delete meal" });
  }
};

/**
 * Update meal manually
 */
export const updateMealManual = async (req, res) => {
  try {
    const updated = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true, updated });
  } catch (err) {
    console.error("Error updating manual meal:", err.message);
    res.status(500).json({ error: "Failed to update meal" });
  }
};

/**
 * Update meal via image
 */
export const updateMealFromImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const formData = new FormData();
    formData.append("media", req.file.buffer, { filename: req.file.originalname });

    const apiRes = await axios.post(
      `https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition?user_key=${process.env.CALORIEMAMA_API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );

    const topResult = apiRes.data.results[0]?.items[0];
    if (!topResult) return res.status(404).json({ error: "No food detected" });

    const updated = await Meal.findByIdAndUpdate(
      req.params.id,
      {
        name: topResult.name,
        mealType: req.body.mealType || "snack",
        score: topResult.score,
        group: topResult.group,
        foodId: topResult.food_id,
        calories: { value: topResult.nutrition.calories, unit: "kcal" },
        protein: { value: topResult.nutrition.protein, unit: "g" },
        carbs: { value: topResult.nutrition.totalCarbs, unit: "g" },
        fat: { value: topResult.nutrition.totalFat, unit: "g" },
        servingSizes: topResult.servingSizes.map(s => ({
          unit: s.unit,
          servingWeight: s.servingWeight
        }))
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true, updated });
  } catch (err) {
    console.error("Error updating meal from image:", err.message);
    res.status(500).json({ error: "Failed to update meal" });
  }
};

/**
 * Get all meals (for dashboard)
 */
export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.query.userId }).sort({ timestamp: -1 });
    res.json({ success: true, meals });
  } catch (err) {
    console.error("Error fetching meals:", err.message);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
};

/**
 * Get meal by MongoDB _id
 */
export const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true, meal });
  } catch (err) {
    console.error("Error fetching meal:", err.message);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
};

/**
 * Get meal by CalorieMama food_id
 */
export const getMealByFoodId = async (req, res) => {
  try {
    const meals = await Meal.find({ foodId: req.params.foodId });
    if (!meals.length) return res.status(404).json({ error: "No meals found with this foodId" });
    res.json({ success: true, meals });
  } catch (err) {
    console.error("Error fetching meal by foodId:", err.message);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
};

export const mealImageUpload = upload.single("mealImage");
