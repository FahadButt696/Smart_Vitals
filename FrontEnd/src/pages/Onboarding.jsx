"use client";
import OnboardingStepper from "@/components/custom/Onboarding/OnboardingStepper";
import { motion } from "framer-motion";

const Onboarding = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-cyan-950 to-neutral-900 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold text-cyan-400 mb-3">
          Welcome to Smart Vitals
        </h1>
        <p className="text-white/70 max-w-xl mx-auto">
          Let’s personalize your experience. Complete these quick steps to set up your health profile.
        </p>
      </motion.div>

      <OnboardingStepper />
    </div>
  );
};

export default Onboarding;
