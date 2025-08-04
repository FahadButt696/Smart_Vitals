import mongoose from 'mongoose';

const calorieGoalSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  dailyCalorieGoal: {
    type: Number,
    required: true,
    min: 800,
    max: 5000
  },
  proteinGoal: {
    type: Number, // in grams
    min: 0,
    max: 500,
    default: 0
  },
  carbsGoal: {
    type: Number, // in grams
    min: 0,
    max: 1000,
    default: 0
  },
  fatGoal: {
    type: Number, // in grams
    min: 0,
    max: 200,
    default: 0
  },
  fiberGoal: {
    type: Number, // in grams
    min: 0,
    max: 100,
    default: 25
  },
  goalType: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'maintenance', 'muscle_gain'],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
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

// Virtual for goal duration in days
calorieGoalSchema.virtual('durationDays').get(function() {
  if (this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for remaining days
calorieGoalSchema.virtual('remainingDays').get(function() {
  if (this.endDate && this.isActive) {
    const now = new Date();
    const diffTime = Math.abs(this.endDate - now);
    const remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return null;
});

// Indexes for better query performance
calorieGoalSchema.index({ userId: 1, isActive: 1 });
calorieGoalSchema.index({ userId: 1, startDate: -1 });

const CalorieGoal = mongoose.model('CalorieGoal', calorieGoalSchema);

export default CalorieGoal; 