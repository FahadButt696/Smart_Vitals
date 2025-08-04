import mongoose from 'mongoose';

const voiceAssistantLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  command: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    enum: ['log_meal', 'check_calories', 'log_workout', 'log_water', 'log_sleep', 'log_weight', 'check_weather', 'set_reminder', 'other'],
    required: true
  },
  success: {
    type: Boolean,
    default: true
  },
  response: {
    type: String,
    trim: true
  },
  confidence: {
    type: Number, // 0-100
    min: 0,
    max: 100,
    default: 0
  },
  processingTime: {
    type: Number, // in milliseconds
    min: 0
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for success rate
voiceAssistantLogSchema.virtual('successRate').get(async function() {
  try {
    const totalCommands = await mongoose.model('VoiceAssistantLog')
      .countDocuments({ userId: this.userId });
    const successfulCommands = await mongoose.model('VoiceAssistantLog')
      .countDocuments({ userId: this.userId, success: true });
    return totalCommands > 0 ? (successfulCommands / totalCommands * 100).toFixed(1) : 0;
  } catch (error) {
    return 0;
  }
});

// Indexes for better query performance
voiceAssistantLogSchema.index({ userId: 1, timestamp: -1 });
voiceAssistantLogSchema.index({ action: 1 });
voiceAssistantLogSchema.index({ success: 1 });

const VoiceAssistantLog = mongoose.model('VoiceAssistantLog', voiceAssistantLogSchema);

export default VoiceAssistantLog; 