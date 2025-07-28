import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weight: {
    type: Number, // in kg
    required: true,
    min: 20,
    max: 500
  },
  bodyFatPercentage: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  muscleMass: {
    type: Number, // in kg
    min: 0,
    max: 200
  },
  bodyWaterPercentage: {
    type: Number, // percentage
    min: 0,
    max: 100
  },
  boneMass: {
    type: Number, // in kg
    min: 0,
    max: 20
  },
  bmi: {
    type: Number,
    min: 10,
    max: 100
  },
  notes: {
    type: String,
    trim: true
  },
  measurementMethod: {
    type: String,
    enum: ['scale', 'smart_scale', 'manual', 'other'],
    default: 'scale'
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

// Pre-save middleware to calculate BMI if height is available
weightLogSchema.pre('save', async function(next) {
  if (this.weight && !this.bmi) {
    try {
      const user = await mongoose.model('User').findById(this.userId);
      if (user && user.height) {
        const heightInMeters = user.height / 100;
        this.bmi = (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
      }
    } catch (error) {
      console.error('Error calculating BMI:', error);
    }
  }
  next();
});

// Virtual for weight change from previous log
weightLogSchema.virtual('weightChange').get(async function() {
  try {
    const previousLog = await mongoose.model('WeightLog')
      .findOne({ userId: this.userId, date: { $lt: this.date } })
      .sort({ date: -1 });
    
    if (previousLog) {
      return (this.weight - previousLog.weight).toFixed(1);
    }
    return 0;
  } catch (error) {
    return 0;
  }
});

// Virtual for weight trend
weightLogSchema.virtual('weightTrend').get(async function() {
  try {
    const recentLogs = await mongoose.model('WeightLog')
      .find({ userId: this.userId, date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      .sort({ date: 1 })
      .limit(7);
    
    if (recentLogs.length >= 2) {
      const firstWeight = recentLogs[0].weight;
      const lastWeight = recentLogs[recentLogs.length - 1].weight;
      const change = lastWeight - firstWeight;
      
      if (change > 0.5) return 'increasing';
      if (change < -0.5) return 'decreasing';
      return 'stable';
    }
    return 'insufficient_data';
  } catch (error) {
    return 'insufficient_data';
  }
});

// Indexes for better query performance
weightLogSchema.index({ userId: 1, date: -1 });
weightLogSchema.index({ date: -1 });

const WeightLog = mongoose.model('WeightLog', weightLogSchema);

export default WeightLog; 