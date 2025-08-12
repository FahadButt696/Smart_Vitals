// models/DietPlan.js
import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timeFrame: { type: String, enum: ["day", "week"], default: "day" },
  planData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DietPlan", dietPlanSchema);
