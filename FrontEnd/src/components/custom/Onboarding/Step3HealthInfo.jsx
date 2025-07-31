// components/custom/Onboarding/Step3HealthInfo.jsx
"use client";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const Step3HealthInfo = () => {
  const { register } = useFormContext();

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5 }} className="space-y-4 text-white">
      <h2 className="text-2xl font-bold text-cyan-400">Step 3: Health Info</h2>

      <input {...register("medicalConditions")} placeholder="Medical Conditions" className="inputStyle" />
      <input {...register("allergies")} placeholder="Allergies" className="inputStyle" />
      <input {...register("medications")} placeholder="Medications" className="inputStyle" />
    </motion.div>
  );
};

export default Step3HealthInfo;
