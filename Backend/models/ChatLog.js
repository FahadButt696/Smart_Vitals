import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'lonely', 'confident', 'overwhelmed', 'peaceful', 'other']
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  }
});

const chatLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [messageSchema],
  overallMood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated', 'grateful', 'lonely', 'confident', 'overwhelmed', 'peaceful', 'other']
  },
  aiSuggestions: [{
    type: String,
    trim: true
  }],
  riskLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'low'
  },
  sessionDuration: {
    type: Number, // in minutes
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
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

// Virtual for session duration
chatLogSchema.virtual('calculatedDuration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  return null;
});

// Virtual for message count
chatLogSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for user message count
chatLogSchema.virtual('userMessageCount').get(function() {
  return this.messages.filter(msg => msg.role === 'user').length;
});

// Virtual for assistant message count
chatLogSchema.virtual('assistantMessageCount').get(function() {
  return this.messages.filter(msg => msg.role === 'assistant').length;
});

// Indexes for better query performance
chatLogSchema.index({ userId: 1, startTime: -1 });
chatLogSchema.index({ sessionId: 1 });
chatLogSchema.index({ overallMood: 1 });
chatLogSchema.index({ riskLevel: 1 });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

export default ChatLog; 