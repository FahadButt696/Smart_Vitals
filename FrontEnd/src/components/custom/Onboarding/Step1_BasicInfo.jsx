"use client";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const Step1_BasicInfo = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Basic Information</h3>
        <p className="text-white/70">Tell us about yourself</p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Full Name</label>
          <input
            type="text"
            {...register("fullName", { 
              required: "Full name is required",
              minLength: { value: 2, message: "Name must be at least 2 characters" }
            })}
            placeholder="Enter your full name"
            className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
          />
          {errors.fullName && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.fullName.message}
            </motion.p>
          )}
        </motion.div>

        {/* Gender */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Gender</label>
          <div className="relative">
            <select
              {...register("gender", { required: "Please select your gender" })}
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="" className="bg-gray-800 text-white">Select your gender</option>
              <option value="Male" className="bg-gray-800 text-white">Male</option>
              <option value="Female" className="bg-gray-800 text-white">Female</option>
              <option value="Other" className="bg-gray-800 text-white">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.gender && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.gender.message}
            </motion.p>
          )}
        </motion.div>

        {/* Age */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Age</label>
          <input
            type="number"
            {...register("age", { 
              required: "Age is required",
              min: { value: 13, message: "Minimum age is 13" },
              max: { value: 120, message: "Maximum age is 120" }
            })}
            placeholder="Enter your age"
            className="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
          />
          {errors.age && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.age.message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Step1_BasicInfo;
