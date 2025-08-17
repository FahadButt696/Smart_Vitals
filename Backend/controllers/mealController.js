import axios from "axios";
import FormData from "form-data";
import Meal from "../models/Meal.js";
import { uploadImage, deleteImage } from "../utils/cloudinaryUtils.js";

/**
 * Phase 1: Detect food from image (no DB save yet)
 */
export const detectFoodFromImage = async (req, res) => {
  try {
    console.log('🔍 detectFoodFromImage called');
    console.log('📁 File received:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer ? 'Buffer present' : 'No buffer'
    } : 'No file');

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Check if API key is configured
    if (!process.env.CALORIEMAMA_API_KEY) {
      return res.status(500).json({ 
        error: "CalorieMama API key not configured. Please add CALORIEMAMA_API_KEY to your .env file." 
      });
    }

    console.log('☁️ Uploading to Cloudinary...');
    // Upload image to Cloudinary first
    const cloudinaryResult = await uploadImage(req.file.buffer, req.file.mimetype, 'smart-vitals/meals');
    console.log('✅ Cloudinary upload successful:', cloudinaryResult);
    
    // Prepare file for CalorieMama using the uploaded image URL
    const formData = new FormData();
    
    // Download the image from Cloudinary for CalorieMama API
    const imageResponse = await axios.get(cloudinaryResult.url, { responseType: 'stream' });
    formData.append("media", imageResponse.data);

    console.log('🔍 Calling CalorieMama API...');
    const apiRes = await axios.post(
      `https://api-2445582032290.production.gw.apicast.io/v1/foodrecognition/full?user_key=${process.env.CALORIEMAMA_API_KEY}`,
      formData,
      { headers: formData.getHeaders() }
    );

    console.log('📊 CalorieMama API Response Structure:', JSON.stringify(apiRes.data, null, 2));

    const items = apiRes.data.results[0]?.items || [];
    if (!items.length) return res.status(404).json({ error: "No food detected" });

    // Process and normalize nutrition data from CalorieMama API
    const processedItems = items.map(item => {
      console.log('🍎 Processing item:', item.name, 'Raw nutrition:', item.nutrition);
      
      // Normalize nutrition data to ensure consistent structure
      const normalizedNutrition = {
        calories: item.nutrition?.calories || 0,
        protein: item.nutrition?.protein || item.nutrition?.protein_g || 0,
        carbs: item.nutrition?.totalCarbs || item.nutrition?.carbohydrates || item.nutrition?.carbs || 0,
        fat: item.nutrition?.totalFat || item.nutrition?.fat || item.nutrition?.total_fat || 0,
        fiber: item.nutrition?.fiber || 0,
        sugar: item.nutrition?.sugar || 0,
        sodium: item.nutrition?.sodium || 0,
        cholesterol: item.nutrition?.cholesterol || 0
      };
      
      console.log('✅ Normalized nutrition:', normalizedNutrition);
      
      return {
        ...item,
        nutrition: normalizedNutrition
      };
    });

    console.log('🍽️ Food detection successful, items found:', processedItems.length);
    res.json({
      success: true,
      imageData: cloudinaryResult, // Send Cloudinary data
      items: processedItems
    });
  } catch (err) {
    console.error("❌ Error detecting food:", err.message);
    res.status(500).json({ 
      error: "Failed to process image", 
      details: err.message 
    });
  }
};

/**
 * Phase 2: Save meal with multiple items
 */
export const saveMeal = async (req, res) => {
  try {
    const { userId, mealType, mealItems, imageData } = req.body;

    if (!mealItems || !Array.isArray(mealItems) || !mealItems.length) {
      return res.status(400).json({ error: "Meal must contain at least one item" });
    }

    // Calculate nutrition
    const calculatedItems = mealItems.map(item => {
      const quantity = item.quantity || 1;
      const nutrients = item.nutrients || {};
      const calculatedNutrition = {};

      for (let key in nutrients) {
        if (typeof nutrients[key] === "number") {
          calculatedNutrition[key] = nutrients[key] * quantity;
        } else {
          calculatedNutrition[key] = nutrients[key];
        }
      }

      return {
        name: item.name,
        group: item.group,
        foodId: item.foodId,
        score: item.score,
        servingSizes: item.servingSizes || [],
        selectedServing: item.selectedServing || null,
        quantity,
        nutrients,
        calculatedNutrition
      };
    });

    const totalNutrition = {};
    calculatedItems.forEach(item => {
      for (let key in item.calculatedNutrition) {
        if (typeof item.calculatedNutrition[key] === "number") {
          totalNutrition[key] = (totalNutrition[key] || 0) + item.calculatedNutrition[key];
        }
      }
    });

    console.log('🍽️ Calculated total nutrition:', totalNutrition);
    console.log('📊 Individual meal items nutrition:', calculatedItems.map(item => ({
      name: item.name,
      nutrients: item.nutrients,
      calculatedNutrition: item.calculatedNutrition
    })));

    const meal = new Meal({
      userId,
      mealType: mealType || "snack",
      mealItems: calculatedItems,
      totalNutrition,
      imagePath: imageData?.url || null, // Save Cloudinary URL
      imagePublicId: imageData?.publicId || null // Save Cloudinary public ID for future deletion
    });

    await meal.save();
    console.log('💾 Meal saved with totalNutrition:', meal.totalNutrition);
    res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error("Error saving meal:", err.message);
    res.status(500).json({ error: "Failed to save meal" });
  }
};

/**
 * Phase 3: Manual meal addition with food search
 */
export const addManualMeal = async (req, res) => {
  try {
    const { userId, mealType, foodName, servingSize, quantity, group, calories } = req.body;

    if (!userId || !mealType || !foodName || !servingSize || !quantity || !calories) {
      return res.status(400).json({ 
        error: "Missing required fields: userId, mealType, foodName, servingSize, quantity, calories" 
      });
    }

    // Use only the calories provided by user - no API calls
    const calculatedNutrition = {
      calories: parseFloat(calories),
      protein: 0,
      totalCarbs: 0,
      totalFat: 0
    };

    // Create meal item
    const mealItem = {
      name: foodName,
      group: group || "Manual Entry",
      foodId: `manual_${Date.now()}_${Math.random()}`,
      score: 100,
      servingSize: {
        unit: servingSize,
        servingWeight: 1
      },
      quantity: quantity,
      nutrients: calculatedNutrition
    };

    // Create and save the meal
    const meal = new Meal({
      userId,
      mealType: mealType || "snack",
      mealItems: [mealItem],
      totalNutrition: calculatedNutrition
    });

    await meal.save();
    res.status(201).json({ success: true, meal });
  } catch (err) {
    console.error("Error adding manual meal:", err.message);
    res.status(500).json({ error: "Failed to add manual meal", details: err.message });
  }
};

/**
 * Search foods for manual entry
 */
export const searchFoods = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ error: "Search query must be at least 2 characters" });
    }

    // Check if API key is configured
    if (!process.env.CALORIEMAMA_API_KEY) {
      return res.status(500).json({
        error: "CalorieMama API key not configured. Please add CALORIEMAMA_API_KEY to your .env file."
      });
    }

    const searchResponse = await axios.get(
      `https://api-2445582032290.production.gw.apicast.io/v1/food/search?user_key=${process.env.CALORIEMAMA_API_KEY}&q=${encodeURIComponent(query)}`
    );

    const foods = searchResponse.data?.foods || [];
    res.json({ success: true, foods });
  } catch (err) {
    console.error("Error searching foods:", err.message);
    
    if (err.response?.status === 401) {
      res.status(401).json({ error: "Invalid CalorieMama API key" });
    } else if (err.response?.status === 429) {
      res.status(429).json({ error: "API rate limit exceeded" });
    } else {
      res.status(500).json({ error: "Failed to search foods", details: err.message });
    }
  }
};

// Delete
export const deleteMeal = async (req, res) => {
  try {
    const deleted = await Meal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Meal not found" });

    // Remove image from uploads
    if (deleted.imagePublicId) {
      await deleteImage(deleted.imagePublicId);
    }

    res.json({ success: true, message: "Meal deleted" });
  } catch (err) {
    console.error("Error deleting meal:", err.message);
    res.status(500).json({ error: "Failed to delete meal" });
  }
};

// Update
export const updateMeal = async (req, res) => {
  try {
    const updated = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Meal not found" });
    res.json({ success: true, updated });
  } catch (err) {
    console.error("Error updating meal:", err.message);
    res.status(500).json({ error: "Failed to update meal" });
  }
};

// Get all
export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ userId: req.query.userId }).sort({ timestamp: -1 });
    res.json({ success: true, meals });
  } catch (err) {
    console.error("Error fetching meals:", err.message);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
};

// Get one
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

// Get by foodId
export const getMealByFoodId = async (req, res) => {
  try {
    const meals = await Meal.find({ "mealItems.foodId": req.params.foodId });
    if (!meals.length) return res.status(404).json({ error: "No meals found with this foodId" });
    res.json({ success: true, meals });
  } catch (err) {
    console.error("Error fetching meal by foodId:", err.message);
    res.status(500).json({ error: "Failed to fetch meal" });
  }
};
