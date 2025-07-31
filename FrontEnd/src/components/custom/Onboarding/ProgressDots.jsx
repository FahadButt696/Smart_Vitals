import { motion } from "framer-motion";

const ProgressDots = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center mt-6 gap-3">
      {Array.from({ length: totalSteps }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: currentStep === index ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
          className={`w-3 h-3 rounded-full ${
            currentStep === index ? "bg-cyan-400" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
