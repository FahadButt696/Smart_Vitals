import mongoose from "mongoose";

const aiRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    recommendations: {
      mealLog: [{ type: String, default: [] }],
      workoutTracker: [{ type: String, default: [] }],
      sleepTracker: [{ type: String, default: [] }],
      mentalHealthChatbot: [{ type: String, default: [] }],
      hydration: [{ type: String, default: [] }],
      weightProgress: [{ type: String, default: [] }], 
      symptomChecker: [{ type: String, default: [] }],
      generalTips: [{ type: String, default: [] }],
    },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

const AiRecommendation = mongoose.model("AiRecommendation", aiRecommendationSchema);
export default AiRecommendation;
