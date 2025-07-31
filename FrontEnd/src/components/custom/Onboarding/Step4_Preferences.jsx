"use client";
import { useFormContext } from "react-hook-form";

const Step4_Preferences = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-400">Preferences</h2>

      <input type="number" {...register("waterGoal")} placeholder="Water goal (ml)" className="w-full p-2 rounded bg-white/10 text-white" />
      <input type="number" {...register("sleepGoal")} placeholder="Sleep goal (hours)" className="w-full p-2 rounded bg-white/10 text-white" />
      <input type="number" {...register("workoutDaysPerWeek")} placeholder="Workout days per week" className="w-full p-2 rounded bg-white/10 text-white" />

      <select {...register("mealPlanType")} className="w-full p-2 rounded bg-white/10 text-white">
        <option value="Balanced">Balanced</option>
        <option value="High protein">High protein</option>
        <option value="Low carb">Low carb</option>
        <option value="Custom">Custom</option>
      </select>

      <label className="flex items-center gap-2 text-white">
        <input type="checkbox" {...register("wantsMentalSupport")} />
        Want mental health support?
      </label>
    </div>
  );
};

export default Step4_Preferences;
