// components/custom/Onboarding/Step2BodyMetrics.jsx
"use client";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const Step2BodyMetrics = () => {
  const { register } = useFormContext();

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }} className="space-y-4 text-white">
      <h2 className="text-2xl font-bold text-cyan-400">Step 2: Body Metrics & Goals</h2>

      <div className="flex gap-2">
        <input {...register("height.value")} type="number" placeholder="Height" className="inputStyle" />
        <select {...register("height.unit")} className="inputStyle">
          <option value="cm">cm</option>
          <option value="inches">inches</option>
        </select>
      </div>

      <div className="flex gap-2">
        <input {...register("weight.value")} type="number" placeholder="Weight" className="inputStyle" />
        <select {...register("weight.unit")} className="inputStyle">
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
      </div>

      <select {...register("goal")} className="inputStyle">
        <option value="">Select Goal</option>
        <option>Lose Weight</option>
        <option>Gain Muscle</option>
        <option>Maintain</option>
      </select>

      <input {...register("targetWeight")} placeholder="Target Weight (kg/lbs)" type="number" className="inputStyle" />

      <select {...register("activityLevel")} className="inputStyle">
        <option value="">Activity Level</option>
        <option>Sedentary</option>
        <option>Lightly active</option>
        <option>Moderately active</option>
        <option>Very active</option>
      </select>
    </motion.div>
  );
};

export default Step2BodyMetrics;
