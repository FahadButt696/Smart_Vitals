import mongoose from 'mongoose';

const dataSummarySchema = new mongoose.Schema({
  weightProgress: {
    startWeight: Number,
    currentWeight: Number,
    change: Number,
    trend: String,
    bmi: Number
  },
  calorieIntake: {
    averageDaily: Number,
    totalDays: Number,
    goalMet: Number, // percentage of days goal was met
    averageProtein: Number,
    averageCarbs: Number,
    averageFat: Number
  },
  workoutSummary: {
    totalWorkouts: Number,
    totalDuration: Number, // in hours
    totalCaloriesBurned: Number,
    averageDuration: Number,
    mostCommonType: String,
    strengthWorkouts: Number,
    cardioWorkouts: Number
  },
  sleepData: {
    averageDuration: Number,
    averageQuality: Number,
    totalNights: Number,
    bestQuality: Number,
    worstQuality: Number,
    averageBedtime: String,
    averageWakeTime: String
  },
  waterIntake: {
    averageDaily: Number,
    totalDays: Number,
    goalMet: Number, // percentage of days goal was met
    averageGoal: Number
  },
  mentalHealth: {
    averageMood: Number,
    averageStress: Number,
    averageAnxiety: Number,
    totalEntries: Number,
    moodTrend: String
  }
});

const healthReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reportType: {
    type: String,
    enum: ['weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
    required: true
  },
  reportName: {
    type: String,
    trim: true,
    default: 'Health Report'
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  data: dataSummarySchema,
  insights: [{
    category: {
      type: String,
      enum: ['weight', 'nutrition', 'fitness', 'sleep', 'mental_health', 'overall']
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['positive', 'negative', 'neutral', 'recommendation']
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  recommendations: [{
    category: {
      type: String,
      enum: ['weight', 'nutrition', 'fitness', 'sleep', 'mental_health', 'lifestyle']
    },
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    actionItems: [{
      type: String,
      trim: true
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  goals: [{
    category: {
      type: String,
      enum: ['weight', 'nutrition', 'fitness', 'sleep', 'mental_health']
    },
    title: {
      type: String,
      trim: true
    },
    currentValue: Number,
    targetValue: Number,
    unit: String,
    deadline: Date,
    progress: Number // percentage
  }],
  pdfUrl: {
    type: String,
    trim: true
  },
  isGenerated: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date
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

// Virtual for report duration in days
healthReportSchema.virtual('durationDays').get(function() {
  const diffTime = Math.abs(this.dateRange.endDate - this.dateRange.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

// Virtual for overall health score
healthReportSchema.virtual('overallHealthScore').get(function() {
  if (!this.data) return 0;
  
  const scores = [];
  
  // Weight score (0-100)
  if (this.data.weightProgress && this.data.weightProgress.bmi) {
    const bmi = this.data.weightProgress.bmi;
    if (bmi >= 18.5 && bmi <= 24.9) {
      scores.push(100); // Healthy BMI
    } else if (bmi >= 17 && bmi <= 29.9) {
      scores.push(70); // Acceptable range
    } else {
      scores.push(40); // Needs attention
    }
  }
  
  // Nutrition score (0-100)
  if (this.data.calorieIntake && this.data.calorieIntake.goalMet) {
    scores.push(this.data.calorieIntake.goalMet);
  }
  
  // Fitness score (0-100)
  if (this.data.workoutSummary && this.data.workoutSummary.totalWorkouts) {
    const workoutScore = Math.min(this.data.workoutSummary.totalWorkouts * 10, 100);
    scores.push(workoutScore);
  }
  
  // Sleep score (0-100)
  if (this.data.sleepData && this.data.sleepData.averageQuality) {
    scores.push(this.data.sleepData.averageQuality * 10);
  }
  
  // Water score (0-100)
  if (this.data.waterIntake && this.data.waterIntake.goalMet) {
    scores.push(this.data.waterIntake.goalMet);
  }
  
  // Mental health score (0-100)
  if (this.data.mentalHealth && this.data.mentalHealth.averageMood) {
    scores.push(this.data.mentalHealth.averageMood * 10);
  }
  
  return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
});

// Virtual for health status
healthReportSchema.virtual('healthStatus').get(function() {
  const score = this.overallHealthScore;
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Improvement';
});

// Indexes for better query performance
healthReportSchema.index({ userId: 1, 'dateRange.startDate': -1 });
healthReportSchema.index({ userId: 1, reportType: 1 });
healthReportSchema.index({ isGenerated: 1 });

const HealthReport = mongoose.model('HealthReport', healthReportSchema);

export default HealthReport; 