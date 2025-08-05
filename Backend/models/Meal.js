import mongoose from "mongoose";

// Reusable nutrient schema
const nutrientSchema = new mongoose.Schema({
  value: { type: Number, min: 0 },
  unit: { type: String }
}, { _id: false });

// Serving size schema
const servingSizeSchema = new mongoose.Schema({
  unit: { type: String, required: true },
  servingWeight: { type: Number, min: 0 }
}, { _id: false });

const mealSchema = new mongoose.Schema({
  userId: { // Clerk ID (string, not ObjectId)
    type: String,
    required: true,
    index: true
  },
  name: { // Food name
    type: String,
    required: true
  },
  mealType: { // Breakfast, lunch, etc.
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    default: 'snack'
  },
  score: { // CalorieMama confidence score
    type: Number,
    min: 0
  },
  group: String, // e.g., "Potato"
  foodId: String, // CalorieMama food_id
  calories: nutrientSchema,
  protein: nutrientSchema,
  carbs: nutrientSchema,
  fat: nutrientSchema,
  servingSizes: [servingSizeSchema],
  imageUrl: String, // Optional: save uploaded image path/URL
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

mealSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model("Meal", mealSchema);
