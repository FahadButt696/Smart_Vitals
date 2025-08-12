import mongoose from "mongoose";

const symptomCheckSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  symptomsEntered: { type: String, required: true },
  structuredSymptoms: [
    {
      id: String,
      name: String,
      choice_id: String // present / absent / unknown
    }
  ],
  diagnosisResults: [
    {
      id: String,
      name: String,
      probability: Number
    }
  ],
  triage: {
    level: String,
    description: String
  },
  userDemographics: {
    age: Number,
    sex: String
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SymptomCheck", symptomCheckSchema);
