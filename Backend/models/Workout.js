import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    min: 0,
    required: true
  },
  weight: {
    type: Number, // in kg
    min: 0,
    default: 0
  },
  duration: {
    type: Number, // in seconds
    min: 0,
    default: 0
  },
  restTime: {
    type: Number, // in seconds
    min: 0,
    default: 60
  },
  notes: {
    type: String,
    trim: true
  }
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: [setSchema],
  notes: {
    type: String,
    trim: true
  },
  exerciseType: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'other'],
    default: 'strength'
  }
});

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutType: {
    type: String,
    enum: ['strength', 'cardio', 'yoga', 'pilates', 'hiit', 'flexibility', 'sports', 'other'],
    required: true
  },
  workoutName: {
    type: String,
    trim: true,
    default: 'Workout'
  },
  exercises: [exerciseSchema],
  totalDuration: {
    type: Number, // in minutes
    min: 0,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    min: 0,
    default: 0
  },
  intensity: {
    type: String,
    enum: ['low', 'moderate', 'high', 'very_high'],
    default: 'moderate'
  },
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'tired', 'exhausted'],
    default: 'good'
  },
  notes: {
    type: String,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total sets
workoutSchema.virtual('totalSets').get(function() {
  return this.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
});

// Virtual for total exercises
workoutSchema.virtual('totalExercises').get(function() {
  return this.exercises.length;
});

// Indexes for better query performance
workoutSchema.index({ userId: 1, date: -1 });
workoutSchema.index({ date: -1 });
workoutSchema.index({ workoutType: 1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout; 