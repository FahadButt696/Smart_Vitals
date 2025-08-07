import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true }, // in ml
  dailyTotal: { type: Number, default: 0 }, // Total for the day
  date: { type: String, required: true }, // YYYY-MM-DD format for daily tracking
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Water", waterSchema);
