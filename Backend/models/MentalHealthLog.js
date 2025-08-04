import mongoose from 'mongoose';

const aiSupportSchema = new mongoose.Schema({
  suggestions: [{
    type: String,
    trim: true
  }],
  affirmations: [{
    type: String,
    trim: true
  }],
  resources: [{
    title: {
      type: String,
      trim: true
    },
    url: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['article', 'video', 'podcast', 'book', 'app', 'hotline']
    }
  }],
  moodAnalysis: {
    type: String,
    trim: true
  },
  riskAssessment: {
    level: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'low'
    },
    factors: [{
      type: String,
      trim: true
    }],
    recommendations: [{
      type: String,
      trim: true
    }]
  },
  confidence: {
    type: Number, // 0-100
    min: 0,
    max: 100,
    default: 0
  }
});

const mentalHealthLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
    type: Number, // 1-10 scale
    required: true,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  anxietyLevel: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  depressionLevel: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  energyLevel: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  sleepQuality: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  activities: [{
    type: String,
    enum: ['meditation', 'exercise', 'reading', 'music', 'social_activity', 'hobby', 'therapy', 'medication', 'journaling', 'nature_walk', 'other']
  }],
  emotions: [{
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'lonely', 'confident', 'overwhelmed', 'peaceful', 'other']
  }],
  triggers: [{
    type: String,
    trim: true
  }],
  copingStrategies: [{
    type: String,
    trim: true
  }],
  socialSupport: {
    type: Number, // 1-10 scale
    min: 1,
    max: 10,
    default: 5
  },
  medicationTaken: [{
    name: {
      type: String,
      trim: true
    },
    dosage: {
      type: String,
      trim: true
    },
    time: {
      type: Date
    }
  }],
  therapySession: {
    hadSession: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true
    },
    nextSession: {
      type: Date
    }
  },
  aiSupport: aiSupportSchema,
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

// Virtual for overall mental health score
mentalHealthLogSchema.virtual('overallScore').get(function() {
  const scores = [
    this.mood,
    this.stressLevel ? 11 - this.stressLevel : 5, // Invert stress (lower is better)
    this.anxietyLevel ? 11 - this.anxietyLevel : 5, // Invert anxiety (lower is better)
    this.depressionLevel ? 11 - this.depressionLevel : 5, // Invert depression (lower is better)
    this.energyLevel,
    this.sleepQuality,
    this.socialSupport
  ].filter(score => score !== undefined);
  
  return scores.length > 0 ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1) : 0;
});

// Virtual for mood description
mentalHealthLogSchema.virtual('moodDescription').get(function() {
  if (this.mood >= 9) return 'Excellent';
  if (this.mood >= 7) return 'Good';
  if (this.mood >= 5) return 'Okay';
  if (this.mood >= 3) return 'Not Great';
  return 'Terrible';
});

// Virtual for stress level description
mentalHealthLogSchema.virtual('stressDescription').get(function() {
  if (this.stressLevel >= 9) return 'Very High';
  if (this.stressLevel >= 7) return 'High';
  if (this.stressLevel >= 5) return 'Moderate';
  if (this.stressLevel >= 3) return 'Low';
  return 'Very Low';
});

// Virtual for risk level
mentalHealthLogSchema.virtual('riskLevel').get(function() {
  const lowMood = this.mood <= 3;
  const highStress = this.stressLevel >= 8;
  const highAnxiety = this.anxietyLevel >= 8;
  const highDepression = this.depressionLevel >= 8;
  
  if (lowMood && (highStress || highAnxiety || highDepression)) {
    return 'high';
  } else if (this.mood <= 5 || this.stressLevel >= 6 || this.anxietyLevel >= 6 || this.depressionLevel >= 6) {
    return 'moderate';
  }
  return 'low';
});

// Indexes for better query performance
mentalHealthLogSchema.index({ userId: 1, date: -1 });
mentalHealthLogSchema.index({ date: -1 });
mentalHealthLogSchema.index({ mood: 1 });

const MentalHealthLog = mongoose.model('MentalHealthLog', mentalHealthLogSchema);

export default MentalHealthLog; 