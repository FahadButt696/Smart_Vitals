import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  foodName: { 
    type: String, 
    required: true 
  },
  calories: { 
    type: Number, 
    required: true,
    min: 0
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    default: 'snack'
  },
  protein: {
    type: Number,
    min: 0,
    default: 0
  },
  carbs: {
    type: Number,
    min: 0,
    default: 0
  },
  fat: {
    type: Number,
    min: 0,
    default: 0
  },
  fiber: {
    type: Number,
    min: 0,
    default: 0
  },
  sugar: {
    type: Number,
    min: 0,
    default: 0
  },
  sodium: {
    type: Number,
    min: 0,
    default: 0
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
mealSchema.index({ userId: 1, timestamp: -1 });
mealSchema.index({ userId: 1, mealType: 1, timestamp: -1 });
mealSchema.index({ timestamp: -1 });

export default mongoose.model("Meal", mealSchema);
