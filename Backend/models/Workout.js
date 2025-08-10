import mongoose from "mongoose";

// Exercise schema for individual exercises in a workout
const exerciseSchema = new mongoose.Schema({
  // Exercise identification
  exerciseId: String, // ID from Wger API or custom ID for manual entries
  name: { type: String, required: true },
  category: String, // e.g., "Strength", "Cardio", "Flexibility"
  targetMuscle: String, // Primary muscle group
  equipment: String, // Required equipment
  
  // Exercise details
  description: String,
  instructions: String,
  
  // Performance tracking
  sets: [{
    reps: Number,
    weight: { // Weight used (for strength exercises)
      value: Number,
      unit: { type: String, enum: ["kg", "lbs"], default: "kg" }
    },
    duration: Number, // Duration in seconds (for time-based exercises)
    distance: { // Distance covered (for cardio)
      value: Number,
      unit: { type: String, enum: ["km", "miles", "meters"], default: "km" }
    },
    restTime: Number, // Rest time in seconds
    notes: String
  }],
  
  // Calculated metrics
  totalDuration: Number, // Total time spent on this exercise in seconds
  estimatedCalories: Number, // Calories burned (calculated using MET values)
  totalVolume: Number, // Total weight moved (sets × reps × weight)
  
  // Source information
  source: { 
    type: String, 
    enum: ["wger", "manual", "ai_generated"], 
    default: "manual" 
  },
  
  // Media
  imageUrl: String,
  videoUrl: String
}, { _id: false });

// Main workout schema
const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clerk user ID
  
  // Workout metadata
  workoutName: { type: String, required: true },
  workoutType: {
    type: String,
    enum: ["strength", "cardio", "flexibility", "mixed", "sports", "custom"],
    required: true
  },
  
  // Workout timing
  plannedDuration: Number, // Planned workout duration in minutes
  actualDuration: Number, // Actual workout duration in minutes
  startTime: Date,
  endTime: Date,
  
  // Exercises in this workout
  exercises: [exerciseSchema],
  
  // Workout summary
  totalCaloriesBurned: { type: Number, default: 0 },
  totalVolume: { type: Number, default: 0 }, // Total weight moved across all exercises
  avgHeartRate: Number,
  maxHeartRate: Number,
  
  // Workout rating and notes
  difficultyRating: {
    type: Number,
    min: 1,
    max: 10
  },
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 10
  },
  notes: String,
  
  // Workout status
  status: {
    type: String,
    enum: ["planned", "in_progress", "completed", "skipped"],
    default: "planned"
  },
  
  // Environmental factors
  location: String, // "Gym", "Home", "Park", etc.
  weather: String, // For outdoor workouts
  
  // Progress tracking
  isPersonalRecord: { type: Boolean, default: false },
  previousBest: {
    date: Date,
    value: Number,
    metric: String // "volume", "duration", "calories", etc.
  },
  
  // Template information
  isTemplate: { type: Boolean, default: false },
  templateName: String,
  basedOnTemplate: String, // Reference to template ID
  
  // User onboarding data (for AI recommendations)
  userFitnessLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"]
  },
  userGoals: [String], // ["weight_loss", "muscle_gain", "endurance", "strength"]
  
  timestamp: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

// Indexes for efficient queries
workoutSchema.index({ userId: 1, timestamp: -1 });
workoutSchema.index({ userId: 1, status: 1 });
workoutSchema.index({ userId: 1, workoutType: 1 });
workoutSchema.index({ userId: 1, isTemplate: 1 });

// Pre-save middleware to calculate totals
workoutSchema.pre('save', function(next) {
  // Calculate total calories and volume
  this.totalCaloriesBurned = this.exercises.reduce((total, exercise) => {
    return total + (exercise.estimatedCalories || 0);
  }, 0);
  
  this.totalVolume = this.exercises.reduce((total, exercise) => {
    return total + (exercise.totalVolume || 0);
  }, 0);
  
  // Calculate actual duration if not set
  if (this.startTime && this.endTime && !this.actualDuration) {
    this.actualDuration = Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  
  next();
});

// Virtual for workout efficiency (actual vs planned duration)
workoutSchema.virtual('efficiency').get(function() {
  if (this.plannedDuration && this.actualDuration) {
    return Math.round((this.plannedDuration / this.actualDuration) * 100);
  }
  return null;
});

export default mongoose.model("Workout", workoutSchema);