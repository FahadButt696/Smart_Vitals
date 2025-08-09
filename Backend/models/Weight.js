import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  weight: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "lbs"], default: "kg" },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Weight", weightSchema);
