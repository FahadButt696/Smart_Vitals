import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema({
  possibleConditions: [{
    condition: {
      type: String,
      trim: true
    },
    probability: {
      type: Number, // 0-100
      min: 0,
      max: 100
    },
    description: {
      type: String,
      trim: true
    }
  }],
  recommendations: [{
    type: String,
    trim: true
  }],
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'low'
  },
  confidence: {
    type: Number, // 0-100
    min: 0,
    max: 100,
    default: 0
  },
  analysisDate: {
    type: Date,
    default: Date.now
  }
});

const symptomLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symptoms: [{
    type: String,
    required: true,
    trim: true
  }],
  severity: {
    type: Number, // 1-10 scale
    required: true,
    min: 1,
    max: 10
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  bodyLocation: [{
    type: String,
    enum: ['head', 'neck', 'chest', 'abdomen', 'back', 'arms', 'legs', 'hands', 'feet', 'general']
  }],
  triggers: [{
    type: String,
    trim: true
  }],
  relievingFactors: [{
    type: String,
    trim: true
  }],
  associatedSymptoms: [{
    type: String,
    trim: true
  }],
  medications: [{
    name: {
      type: String,
      trim: true
    },
    dosage: {
      type: String,
      trim: true
    },
    frequency: {
      type: String,
      trim: true
    }
  }],
  lifestyleFactors: {
    stress: {
      type: Number, // 1-10 scale
      min: 1,
      max: 10
    },
    sleep: {
      type: Number, // hours
      min: 0,
      max: 24
    },
    exercise: {
      type: Number, // minutes
      min: 0,
      max: 1440
    },
    diet: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor']
    }
  },
  aiAnalysis: aiAnalysisSchema,
  notes: {
    type: String,
    trim: true
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
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

// Virtual for severity description
symptomLogSchema.virtual('severityDescription').get(function() {
  if (this.severity >= 9) return 'Severe';
  if (this.severity >= 7) return 'Moderate to Severe';
  if (this.severity >= 5) return 'Moderate';
  if (this.severity >= 3) return 'Mild to Moderate';
  return 'Mild';
});

// Virtual for urgency color
symptomLogSchema.virtual('urgencyColor').get(function() {
  if (this.aiAnalysis && this.aiAnalysis.urgencyLevel) {
    switch (this.aiAnalysis.urgencyLevel) {
      case 'emergency': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  }
  return 'gray';
});

// Virtual for symptom summary
symptomLogSchema.virtual('symptomSummary').get(function() {
  if (this.symptoms.length === 1) {
    return this.symptoms[0];
  } else if (this.symptoms.length > 1) {
    return `${this.symptoms.slice(0, -1).join(', ')} and ${this.symptoms[this.symptoms.length - 1]}`;
  }
  return 'No symptoms listed';
});

// Indexes for better query performance
symptomLogSchema.index({ userId: 1, date: -1 });
symptomLogSchema.index({ date: -1 });
symptomLogSchema.index({ 'aiAnalysis.urgencyLevel': 1 });

const SymptomLog = mongoose.model('SymptomLog', symptomLogSchema);

export default SymptomLog; 