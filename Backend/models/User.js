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
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    age: {
      type: Number,
      required: true,
      min: [12, "Minimum age is 12"],
      max: [100, "Maximum age is 100"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    // Height (value + unit)
    height: {
      value: {
        type: Number,
        required: true,
        min: [50, "Height too low"],
        max: [250, "Height too high"],
      },
      unit: {
        type: String,
        enum: ["cm", "inches"],
        required: true,
      },
    },

    // Weight (value + unit)
    weight: {
      value: {
        type: Number,
        required: true,
        min: [20, "Weight too low"],
        max: [300, "Weight too high"],
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
      enum: [
        "Sedentary",
        "Lightly active",
        "Moderately active",
        "Very active",
      ],
      required: true,
    },
    dietaryPreference: {
      type: String,
      enum: ["Vegan", "Vegetarian", "Keto", "Normal", "Custom"],
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

    waterGoal: {
      type: Number,
      default: 2500, // in ml
    },
    sleepGoal: {
      type: Number,
      default: 8, // hours
    },
    workoutDaysPerWeek: {
      type: Number,
      min: 0,
      max: 7,
      default: 3,
    },
    workoutPreferences: {
      type: [String],
      enum: ["Yoga", "Cardio", "Strength", "HIIT", "Walking"],
      default: [],
    },
    mealPlanType: {
      type: String,
      enum: ["High protein", "Low carb", "Balanced", "Custom"],
      default: "Balanced",
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
 