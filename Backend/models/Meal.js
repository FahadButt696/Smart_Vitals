// import mongoose from 'mongoose';

// const foodSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   unit: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   calories: {
//     type: Number,
//     min: 0,
//     default: 0
//   },
//   protein: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   carbs: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   fat: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   fiber: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   sugar: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   sodium: {
//     type: Number, // in mg
//     min: 0,
//     default: 0
//   },
//   barcode: {
//     type: String,
//     trim: true
//   }
// });

// const mealSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   mealType: {
//     type: String,
//     enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'],
//     required: true
//   },
//   mealName: {
//     type: String,
//     trim: true,
//     default: 'Meal'
//   },
//   foods: [foodSchema],
//   totalCalories: {
//     type: Number,
//     min: 0,
//     default: 0
//   },
//   totalProtein: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   totalCarbs: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   totalFat: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   totalFiber: {
//     type: Number, // in grams
//     min: 0,
//     default: 0
//   },
//   imageUrl: {
//     type: String,
//     trim: true
//   },
//   aiDetected: {
//     type: Boolean,
//     default: false
//   },
//   aiConfidence: {
//     type: Number, // 0-100
//     min: 0,
//     max: 100,
//     default: 0
//   },
//   notes: {
//     type: String,
//     trim: true
//   },
//   mood: {
//     type: String,
//     enum: ['great', 'good', 'okay', 'not_great', 'terrible'],
//     default: 'good'
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//     index: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Pre-save middleware to calculate totals
// mealSchema.pre('save', function(next) {
//   this.totalCalories = this.foods.reduce((sum, food) => sum + (food.calories || 0), 0);
//   this.totalProtein = this.foods.reduce((sum, food) => sum + (food.protein || 0), 0);
//   this.totalCarbs = this.foods.reduce((sum, food) => sum + (food.carbs || 0), 0);
//   this.totalFat = this.foods.reduce((sum, food) => sum + (food.fat || 0), 0);
//   this.totalFiber = this.foods.reduce((sum, food) => sum + (food.fiber || 0), 0);
//   next();
// });

// // Virtual for total foods
// mealSchema.virtual('totalFoods').get(function() {
//   return this.foods.length;
// });

// // Indexes for better query performance
// mealSchema.index({ userId: 1, date: -1 });
// mealSchema.index({ userId: 1, mealType: 1, date: -1 });
// mealSchema.index({ date: -1 });

// const Meal = mongoose.model('Meal', mealSchema);

// export default Meal; 


import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  foodName: { type: String, required: true },
  calories: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("Meal", mealSchema);
