"use client";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const Step3_HealthInfo = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Your Health Goals</h3>
        <p className="text-white/70">What do you want to achieve?</p>
      </div>

      <div className="space-y-6">
        {/* Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Primary Goal</label>
          <div className="relative">
            <select 
              {...register("goal", { required: "Please select a goal" })} 
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="" className="bg-gray-800 text-white">Select your primary goal</option>
              <option value="Lose Weight" className="bg-gray-800 text-white">Lose Weight</option>
              <option value="Gain Muscle" className="bg-gray-800 text-white">Gain Muscle</option>
              <option value="Maintain" className="bg-gray-800 text-white">Maintain Current Weight</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.goal && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.goal.message}
            </motion.p>
          )}
        </motion.div>

        {/* Activity Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Activity Level</label>
          <div className="relative">
            <select 
              {...register("activityLevel", { required: "Please select activity level" })} 
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="" className="bg-gray-800 text-white">Select your activity level</option>
              <option value="Sedentary" className="bg-gray-800 text-white">Sedentary (Little to no exercise)</option>
              <option value="Lightly active" className="bg-gray-800 text-white">Lightly Active (Light exercise 1-3 days/week)</option>
              <option value="Moderately active" className="bg-gray-800 text-white">Moderately Active (Moderate exercise 3-5 days/week)</option>
              <option value="Very active" className="bg-gray-800 text-white">Very Active (Hard exercise 6-7 days/week)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.activityLevel && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.activityLevel.message}
            </motion.p>
          )}
        </motion.div>

        {/* Dietary Preference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Dietary Preference</label>
          <div className="relative">
            <select 
              {...register("dietaryPreference")} 
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="Normal" className="bg-gray-800 text-white">Normal (No restrictions)</option>
              <option value="Vegan" className="bg-gray-800 text-white">Vegan</option>
              <option value="Vegetarian" className="bg-gray-800 text-white">Vegetarian</option>
              <option value="Keto" className="bg-gray-800 text-white">Keto</option>
              <option value="Custom" className="bg-gray-800 text-white">Custom</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="space-y-3">
            <label className="block text-white font-medium">Medical Conditions (Optional)</label>
            <textarea 
              {...register("medicalConditions")} 
              placeholder="Any medical conditions we should know about?"
              rows="3"
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-white font-medium">Allergies (Optional)</label>
            <textarea 
              {...register("allergies")} 
              placeholder="Any food allergies or sensitivities?"
              rows="3"
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-white font-medium">Medications (Optional)</label>
            <textarea 
              {...register("medications")} 
              placeholder="Any medications you're currently taking?"
              rows="3"
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50 resize-none"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Step3_HealthInfo;
