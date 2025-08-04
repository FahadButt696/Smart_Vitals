import mongoose from 'mongoose';

const sleepLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  bedtime: {
    type: Date,
    required: true
  },
  wakeTime: {
    type: Date,
    required: true
  },
  sleepDuration: {
    type: Number, // in hours
    min: 0,
    max: 24
  },
  sleepQuality: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  deepSleepPercentage: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  remSleepPercentage: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  lightSleepPercentage: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  sleepEfficiency: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  sleepLatency: {
    type: Number, // in minutes
    min: 0,
    max: 300
  },
  wakeCount: {
    type: Number, // number of times woke up
    min: 0,
    default: 0
  },
  sleepEnvironment: {
    temperature: {
      type: Number, // in celsius
      min: 10,
      max: 40
    },
    noise: {
      type: String,
      enum: ['quiet', 'moderate', 'loud', 'very_loud']
    },
    light: {
      type: String,
      enum: ['dark', 'dim', 'moderate', 'bright']
    }
  },
  activities: [{
    type: String,
    enum: ['exercise', 'caffeine', 'alcohol', 'screen_time', 'meditation', 'reading', 'other']
  }],
  notes: {
    type: String,
    trim: true
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

// Pre-save middleware to calculate sleep duration
sleepLogSchema.pre('save', function(next) {
  if (this.bedtime && this.wakeTime) {
    const durationMs = this.wakeTime - this.bedtime;
    this.sleepDuration = (durationMs / (1000 * 60 * 60)).toFixed(2);
  }
  next();
});

// Virtual for sleep efficiency calculation
sleepLogSchema.virtual('calculatedEfficiency').get(function() {
  if (this.sleepDuration && this.sleepLatency) {
    const totalTimeInBed = this.sleepDuration + (this.sleepLatency / 60);
    const efficiency = (this.sleepDuration / totalTimeInBed) * 100;
    return Math.min(efficiency, 100).toFixed(1);
  }
  return null;
});

// Virtual for sleep quality description
sleepLogSchema.virtual('qualityDescription').get(function() {
  if (this.sleepQuality >= 9) return 'Excellent';
  if (this.sleepQuality >= 7) return 'Good';
  if (this.sleepQuality >= 5) return 'Fair';
  if (this.sleepQuality >= 3) return 'Poor';
  return 'Very Poor';
});

// Virtual for sleep recommendation
sleepLogSchema.virtual('sleepRecommendation').get(function() {
  if (this.sleepDuration < 6) {
    return 'Consider increasing sleep duration for better health';
  } else if (this.sleepDuration > 9) {
    return 'Consider reducing sleep duration to avoid oversleeping';
  } else if (this.sleepQuality < 6) {
    return 'Focus on improving sleep quality through better sleep hygiene';
  }
  return 'Great sleep pattern! Keep it up!';
});

// Indexes for better query performance
sleepLogSchema.index({ userId: 1, date: -1 });
sleepLogSchema.index({ date: -1 });

const SleepLog = mongoose.model('SleepLog', sleepLogSchema);

export default SleepLog; 