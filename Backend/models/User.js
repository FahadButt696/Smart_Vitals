import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
    },
    height: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["cm", "feet"],
        required: true,
      },
    },
    weight: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["kg", "lbs"],
        required: true,
      },
    },
    goal: {
      type: String,
      enum: ["Lose Weight", "Gain Muscle", "Maintain"],
      required: true,
    },
    targetWeight: {
      type: Number,
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["Sedentary", "Lightly active", "Moderately active", "Very active"],
      required: true,
    },
    dietaryPreference: {
      type: String,
      enum: ["Normal", "Vegan", "Vegetarian", "Keto", "Custom"],
      default: "Normal",
    },
    medicalConditions: {
      type: String,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    medications: {
      type: String,
      trim: true,
    },
    workoutDaysPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      default: 3,
    },
    workoutPreferences: {
      type: [String],
      enum: ["Cardio", "Strength", "Yoga", "HIIT", "Walking"],
      default: [],
    },
    mealPlanType: {
      type: String,
      enum: ["Balanced", "High protein", "Low carb", "Custom"],
      default: "Balanced",
    },
    waterIntakeGoal: {
      type: Number,
      default: 3000, // Default 2 liters in ml
      min: 500,
      max: 5000,
    },
    wantsMentalSupport: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
 