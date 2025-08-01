import { motion } from "framer-motion";

const ProgressDots = ({ total, current }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === current
              ? "bg-gradient-to-r from-cyan-400 to-purple-400 scale-125"
              : index < current
              ? "bg-cyan-400/60"
              : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
