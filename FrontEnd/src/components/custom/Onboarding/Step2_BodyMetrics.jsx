"use client";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

const Step2_BodyMetrics = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const heightUnit = watch("height.unit");

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
          <span className="text-2xl">📏</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Body Metrics</h3>
        <p className="text-white/70">Your physical measurements</p>
      </div>

      <div className="space-y-6">
        {/* Height */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Height</label>
          <div className="flex gap-3">
            {heightUnit === "feet" ? (
              <>
                <input
                  type="text"
                  {...register("height.feet", {
                    required: "Feet is required",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]+)?$/,
                      message: "Please enter a valid number"
                    },
                    min: { value: 3, message: "Minimum 3 feet" },
                    max: { value: 8, message: "Maximum 8 feet" }
                  })}
                  placeholder="Feet (e.g., 5.5)"
                  className="flex-1 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
                />
                <input
                  type="text"
                  {...register("height.inches", {
                    required: "Inches is required",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]+)?$/,
                      message: "Please enter a valid number"
                    },
                    min: { value: 0, message: "Minimum 0 inches" },
                    max: { value: 11, message: "Maximum 11 inches" }
                  })}
                  placeholder="Inches (e.g., 4.5)"
                  className="flex-1 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
                />
              </>
            ) : (
              <input
                type="text"
                {...register("height.value", {
                  required: "Height value is required",
                  pattern: {
                    value: /^[0-9]+(\.[0-9]+)?$/,
                    message: "Please enter a valid number"
                  },
                  min: { value: 50, message: "Height too low" },
                  max: { value: 250, message: "Height too high" }
                })}
                placeholder="Height in cm (e.g., 165.5)"
                className="flex-1 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
              />
            )}
            <div className="relative w-32">
              <select
                {...register("height.unit", { required: true })}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
              >
                <option value="cm" className="bg-gray-800 text-white">cm</option>
                <option value="feet" className="bg-gray-800 text-white">feet/inches</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {heightUnit === "feet" ? (
            <>
              {errors.height?.feet && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {errors.height.feet.message}
                </motion.p>
              )}
              {errors.height?.inches && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {errors.height.inches.message}
                </motion.p>
              )}
            </>
          ) : (
            errors.height?.value && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
              >
                {errors.height.value.message}
              </motion.p>
            )
          )}
        </motion.div>

        {/* Weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Weight</label>
          <div className="flex gap-3">
            <input
              type="text"
              {...register("weight.value", {
                required: "Weight value is required",
                pattern: {
                  value: /^[0-9]+(\.[0-9]+)?$/,
                  message: "Please enter a valid number"
                },
                min: { value: 20, message: "Weight too low" },
                max: { value: 300, message: "Weight too high" }
              })}
              placeholder="Weight (e.g., 70.5)"
              className="flex-1 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
            />
            <div className="relative w-32">
              <select
                {...register("weight.unit", { required: true })}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
              >
                <option value="kg" className="bg-gray-800 text-white">kg</option>
                <option value="lbs" className="bg-gray-800 text-white">lbs</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {errors.weight?.value && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.weight.value.message}
            </motion.p>
          )}
        </motion.div>

        {/* Target Weight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <label className="block text-white font-medium">Target Weight</label>
          <div className="flex gap-3">
            <input
              type="text"
              {...register("targetWeight.value", {
                required: "Target weight is required",
                pattern: {
                  value: /^[0-9]+(\.[0-9]+)?$/,
                  message: "Please enter a valid number"
                },
                min: { value: 20, message: "Target weight too low" },
                max: { value: 300, message: "Target weight too high" }
              })}
              placeholder="Target weight (e.g., 65.5)"
              className="flex-1 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 placeholder-white/50"
            />
            <div className="relative w-32">
              <select
                {...register("targetWeight.unit", { required: true })}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/20 focus:border-cyan-400 focus:outline-none transition-all duration-200 appearance-none pr-10"
              >
                <option value="kg" className="bg-gray-800 text-white">kg</option>
                <option value="lbs" className="bg-gray-800 text-white">lbs</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {errors.targetWeight?.value && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {errors.targetWeight.value.message}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Step2_BodyMetrics;
