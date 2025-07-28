import mongoose from 'mongoose';

const waterIntakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number, // in ml
    required: true,
    min: 0,
    max: 5000
  },
  dailyGoal: {
    type: Number, // in ml
    min: 0,
    max: 10000,
    default: 2000
  },
  containerType: {
    type: String,
    enum: ['glass', 'bottle', 'cup', 'mug', 'other'],
    default: 'glass'
  },
  containerSize: {
    type: Number, // in ml
    min: 0
  },
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

// Virtual for daily total intake
waterIntakeSchema.virtual('dailyTotal').get(async function() {
  try {
    const startOfDay = new Date(this.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(this.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const dailyIntakes = await mongoose.model('WaterIntake')
      .find({
        userId: this.userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      });
    
    return dailyIntakes.reduce((total, intake) => total + intake.amount, 0);
  } catch (error) {
    return this.amount;
  }
});

// Virtual for progress percentage
waterIntakeSchema.virtual('progressPercentage').get(async function() {
  try {
    const dailyTotal = await this.dailyTotal;
    return Math.min((dailyTotal / this.dailyGoal) * 100, 100).toFixed(1);
  } catch (error) {
    return 0;
  }
});

// Virtual for remaining amount
waterIntakeSchema.virtual('remainingAmount').get(async function() {
  try {
    const dailyTotal = await this.dailyTotal;
    const remaining = this.dailyGoal - dailyTotal;
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    return this.dailyGoal;
  }
});

// Indexes for better query performance
waterIntakeSchema.index({ userId: 1, date: -1 });
waterIntakeSchema.index({ date: -1 });

const WaterIntake = mongoose.model('WaterIntake', waterIntakeSchema);

export default WaterIntake; 