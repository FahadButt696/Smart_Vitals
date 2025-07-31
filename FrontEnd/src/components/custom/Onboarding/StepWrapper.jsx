"use client";
import { motion } from "framer-motion";

const stepVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const StepWrapper = ({ children }) => (
  <motion.div
    variants={stepVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }}
    className="w-full max-w-2xl mx-auto bg-white/5 border border-white/10 backdrop-blur p-6 rounded-xl shadow-md"
  >
    {children}
  </motion.div>
);

export default StepWrapper;
