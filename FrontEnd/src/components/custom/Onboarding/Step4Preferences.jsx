// components/custom/Onboarding/Step4Preferences.jsx
"use client";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const Step4Preferences = () => {
  const { register } = useFormContext();

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }} className="space-y-4 text-white">
      <h2 className="text-2xl font-bold text-cyan-400">Step 4: Preferences</h2>

      <select {...register("dietaryPreference")} className="inputStyle">
        <option value="">Dietary Preference</option>
        <option>Vegan</option>
        <option>Vegetarian</option>
        <option>Keto</option>
        <option>Normal</option>
        <option>Custom</option>
      </select>

      <input {...register("waterGoal")} placeholder="Water Goal (ml)" type="number" className="inputStyle" />
      <input {...register("sleepGoal")} placeholder="Sleep Goal (hrs)" type="number" className="inputStyle" />
      <input {...register("workoutDaysPerWeek")} placeholder="Workout Days Per Week" type="number" className="inputStyle" />

      <label className="block text-sm text-cyan-200 mt-2">Workout Preferences</label>
      <div className="flex flex-wrap gap-3">
        {["Yoga", "Cardio", "Strength", "HIIT", "Walking"].map((type) => (
          <label key={type} className="text-white space-x-2">
            <input {...register("workoutPreferences")} type="checkbox" value={type} />
            <span>{type}</span>
          </label>
        ))}
      </div>

      <select {...register("mealPlanType")} className="inputStyle mt-4">
        <option value="">Meal Plan Type</option>
        <option>High protein</option>
        <option>Low carb</option>
        <option>Balanced</option>
        <option>Custom</option>
      </select>

      <label className="flex items-center gap-2 mt-4 text-white">
        <input type="checkbox" {...register("wantsMentalSupport")} />
        I want mental health support
      </label>
    </motion.div>
  );
};

export default Step4Preferences;
