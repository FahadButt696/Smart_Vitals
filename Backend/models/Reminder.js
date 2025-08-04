import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['water', 'meal', 'workout', 'sleep', 'medication', 'appointment', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  time: {
    type: Date,
    required: true
  },
  frequency: {
    type: String,
    enum: ['once', 'daily', 'weekly', 'monthly'],
    default: 'once'
  },
  daysOfWeek: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  notificationType: {
    type: String,
    enum: ['push', 'email', 'both'],
    default: 'push'
  },
  lastTriggered: {
    type: Date
  },
  nextTrigger: {
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

// Virtual for time until next reminder
reminderSchema.virtual('timeUntilNext').get(function() {
  if (this.nextTrigger) {
    const now = new Date();
    const diff = this.nextTrigger - now;
    return diff > 0 ? diff : 0;
  }
  return null;
});

// Virtual for status
reminderSchema.virtual('status').get(function() {
  if (!this.isActive) return 'inactive';
  if (this.nextTrigger && this.nextTrigger < new Date()) return 'overdue';
  return 'active';
});

// Indexes for better query performance
reminderSchema.index({ userId: 1, isActive: 1 });
reminderSchema.index({ userId: 1, nextTrigger: 1 });
reminderSchema.index({ nextTrigger: 1 });

const Reminder = mongoose.model('Reminder', reminderSchema);

export default Reminder; 