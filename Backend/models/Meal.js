import mongoose from "mongoose";

// Serving size schema (from CalorieMama API)
const servingSizeSchema = new mongoose.Schema({
  unit: { type: String, required: true },
  servingWeight: { type: Number, required: true }
}, { _id: false });

// Nutrients schema — dynamic so we can store *all* keys from CalorieMama full API
const nutrientSchema = new mongoose.Schema({}, { strict: false, _id: false });

// One food item in a meal
const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Green Bell Pepper"
  group: String, // e.g., "Bell Pepper"
  foodId: String, // CalorieMama's food_id
  score: Number, // Confidence score from API

  // All serving sizes from API
  servingSizes: [servingSizeSchema],

  // The serving size user selected
  selectedServing: servingSizeSchema,

  // Number of servings user ate
  quantity: { type: Number, default: 1 },

  // Raw nutrients from API (per serving)
  nutrients: nutrientSchema,

  // Calculated nutrients = per serving × quantity
  calculatedNutrition: nutrientSchema
}, { _id: false });

// Main meal schema
const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clerk user ID
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack", "pre_workout", "post_workout"],
    default: "snack"
  },

  // Array of multiple food items
  mealItems: [mealItemSchema],

  // Sum of all calculatedNutrition for this meal
  totalNutrition: nutrientSchema,

  // Image path for the meal photo
  imagePath: String,

  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for fast queries
mealSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model("Meal", mealSchema);
