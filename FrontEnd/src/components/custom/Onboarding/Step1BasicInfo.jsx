// components/custom/Onboarding/Step1BasicInfo.jsx
"use client";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const Step1BasicInfo = () => {
  const { register } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 text-white"
    >
      <h2 className="text-2xl font-bold text-cyan-400">Step 1: Basic Info</h2>

      <input {...register("fullName")} placeholder="Full Name" className="inputStyle" />
      <input {...register("email")} placeholder="Email" type="email" className="inputStyle" />
      <input {...register("age")} placeholder="Age" type="number" className="inputStyle" />
      <select {...register("gender")} className="inputStyle">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </motion.div>
  );
};

export default Step1BasicInfo;
