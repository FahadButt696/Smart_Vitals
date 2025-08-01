"use client";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";

const Step4_Preferences = () => {
  const { register, setValue, watch } = useFormContext();
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const workoutOptions = [
    { value: "Cardio", label: "Cardio", icon: "❤️" },
    { value: "Strength", label: "Strength", icon: "💪" },
    { value: "Yoga", label: "Yoga", icon: "🧘" },
    { value: "HIIT", label: "HIIT", icon: "⚡" },
    { value: "Walking", label: "Walking", icon: "🚶" }
  ];

  const togglePreference = (preference) => {
    const newPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference];
    
    setSelectedPreferences(newPreferences);
    setValue("workoutPreferences", newPreferences);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 mb-4">
          <span className="text-2xl">🏃</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Workout Preferences</h3>
        <p className="text-white/70">Select your preferred workout types</p>
      </div>

      <div className="space-y-6">
        {/* Workout Days Per Week */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Workout Days Per Week</label>
          <div className="relative">
            <select 
              {...register("workoutDaysPerWeek")} 
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="1" className="bg-gray-800 text-white">1 day</option>
              <option value="2" className="bg-gray-800 text-white">2 days</option>
              <option value="3" selected className="bg-gray-800 text-white">3 days</option>
              <option value="4" className="bg-gray-800 text-white">4 days</option>
              <option value="5" className="bg-gray-800 text-white">5 days</option>
              <option value="6" className="bg-gray-800 text-white">6 days</option>
              <option value="7" className="bg-gray-800 text-white">7 days</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Workout Preferences Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <label className="block text-white font-medium">Select Your Workout Types</label>
          <div className="grid grid-cols-2 gap-3">
            {workoutOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => togglePreference(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedPreferences.includes(option.value)
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                    : 'border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Meal Plan Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Preferred Meal Plan Type</label>
          <div className="relative">
            <select 
              {...register("mealPlanType")} 
              className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
            >
              <option value="Balanced" className="bg-gray-800 text-white">Balanced</option>
              <option value="High protein" className="bg-gray-800 text-white">High Protein</option>
              <option value="Low carb" className="bg-gray-800 text-white">Low Carb</option>
              <option value="Custom" className="bg-gray-800 text-white">Custom</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Mental Health Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <label className="flex items-center gap-3 text-white cursor-pointer">
            <input 
              type="checkbox" 
              {...register("wantsMentalSupport")}
              className="w-5 h-5 rounded border-white/20 bg-white/10 text-cyan-400 focus:ring-cyan-400"
            />
            <span className="font-medium">I would like mental health support and wellness tips</span>
          </label>
        </motion.div>
      </div>
    </div>
  );
};

export default Step4_Preferences;
