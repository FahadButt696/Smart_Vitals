import mongoose from 'mongoose';

const sleepSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number }, // Duration in hours (calculated automatically)
  quality: { 
    type: String, 
    enum: ["excellent", "good", "fair", "poor", "restless"], 
    default: "good" 
  },
  notes: { type: String, maxlength: 500 },
  date: { type: String, required: true }, // Date in YYYY-MM-DD format for easy filtering
}, { timestamps: true });

// Calculate duration before saving
sleepSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100; // Hours with 2 decimal places
  }
  next();
});

// Virtual for formatted duration
sleepSchema.virtual('formattedDuration').get(function() {
  if (this.duration) {
    const hours = Math.floor(this.duration);
    const minutes = Math.round((this.duration - hours) * 60);
    return `${hours}h ${minutes}m`;
  }
  return '0h 0m';
});

export default mongoose.model("Sleep", sleepSchema);
