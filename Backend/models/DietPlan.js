import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
    required: true
  },
  foods: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    },
    calories: {
      type: Number,
      min: 0,
      default: 0
    },
    protein: {
      type: Number, // in grams
      min: 0,
      default: 0
    },
    carbs: {
      type: Number, // in grams
      min: 0,
      default: 0
    },
    fat: {
      type: Number, // in grams
      min: 0,
      default: 0
    },
    fiber: {
      type: Number, // in grams
      min: 0,
      default: 0
    },
    instructions: {
      type: String,
      trim: true
    }
  }],
  totalCalories: {
    type: Number,
    min: 0,
    default: 0
  },
  totalProtein: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  totalCarbs: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  totalFat: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

const dietPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  planName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in days
    required: true,
    min: 1,
    max: 365
  },
  meals: [mealPlanSchema],
  totalCalories: {
    type: Number,
    min: 0,
    default: 0
  },
  totalProtein: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  totalCarbs: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  totalFat: {
    type: Number, // in grams
    min: 0,
    default: 0
  },
  goalType: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain', 'general_health'],
    required: true
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_free', 'low_carb', 'keto', 'paleo', 'mediterranean']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to calculate totals
dietPlanSchema.pre('save', function(next) {
  // Calculate totals for each meal
  this.meals.forEach(meal => {
    meal.totalCalories = meal.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
    meal.totalProtein = meal.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
    meal.totalCarbs = meal.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
    meal.totalFat = meal.foods.reduce((sum, food) => sum + (food.fat || 0), 0);
  });

  // Calculate plan totals
  this.totalCalories = this.meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  this.totalProtein = this.meals.reduce((sum, meal) => sum + meal.totalProtein, 0);
  this.totalCarbs = this.meals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  this.totalFat = this.meals.reduce((sum, meal) => sum + meal.totalFat, 0);

  // Set end date if not provided
  if (!this.endDate && this.startDate && this.duration) {
    this.endDate = new Date(this.startDate);
    this.endDate.setDate(this.endDate.getDate() + this.duration - 1);
  }

  next();
});

// Virtual for plan progress
dietPlanSchema.virtual('progress').get(function() {
  if (this.startDate && this.endDate) {
    const now = new Date();
    const totalDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
    const elapsedDays = Math.ceil((now - this.startDate) / (1000 * 60 * 60 * 24));
    const progress = Math.min((elapsedDays / totalDays) * 100, 100);
    return Math.max(progress, 0).toFixed(1);
  }
  return 0;
});

// Virtual for remaining days
dietPlanSchema.virtual('remainingDays').get(function() {
  if (this.endDate && this.isActive) {
    const now = new Date();
    const remaining = Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return null;
});

// Virtual for daily calorie average
dietPlanSchema.virtual('dailyCalorieAverage').get(function() {
  if (this.totalCalories && this.duration) {
    return Math.round(this.totalCalories / this.duration);
  }
  return 0;
});

// Indexes for better query performance
dietPlanSchema.index({ userId: 1, isActive: 1 });
dietPlanSchema.index({ userId: 1, startDate: -1 });
dietPlanSchema.index({ goalType: 1 });

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan; 