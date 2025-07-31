"use client";
import { useFormContext } from "react-hook-form";

const Step3_HealthInfo = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Health Information</h2>

      <div>
        <label className="block text-white">Goal</label>
        <select {...register("goal")} className="w-full p-2 rounded bg-white/10 text-white">
          <option value="Lose Weight">Lose Weight</option>
          <option value="Gain Muscle">Gain Muscle</option>
          <option value="Maintain">Maintain</option>
        </select>
      </div>

      <div>
        <label className="block text-white">Activity Level</label>
        <select {...register("activityLevel")} className="w-full p-2 rounded bg-white/10 text-white">
          <option value="Sedentary">Sedentary</option>
          <option value="Lightly active">Lightly active</option>
          <option value="Moderately active">Moderately active</option>
          <option value="Very active">Very active</option>
        </select>
      </div>

      <div>
        <label className="block text-white">Dietary Preference</label>
        <select {...register("dietaryPreference")} className="w-full p-2 rounded bg-white/10 text-white">
          <option value="Normal">Normal</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Keto">Keto</option>
          <option value="Custom">Custom</option>
        </select>
      </div>

      <textarea {...register("medicalConditions")} placeholder="Medical conditions" className="w-full p-2 rounded bg-white/10 text-white" />
      <textarea {...register("allergies")} placeholder="Allergies" className="w-full p-2 rounded bg-white/10 text-white" />
      <textarea {...register("medications")} placeholder="Medications" className="w-full p-2 rounded bg-white/10 text-white" />
    </div>
  );
};

export default Step3_HealthInfo;
