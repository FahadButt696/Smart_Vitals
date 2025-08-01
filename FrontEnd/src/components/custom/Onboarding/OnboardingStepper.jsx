"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import ProgressDots from "./ProgressDots";

// Step components
import Step1_BasicInfo from "./Step1_BasicInfo";
import Step2_BodyMetrics from "./Step2_BodyMetrics";
import Step3_HealthInfo from "./Step3_HealthInfo";
import Step4_Preferences from "./Step4_Preferences";

const steps = [
  { 
    id: 1, 
    component: () => <Step1_BasicInfo />,
    title: "Basic Information",
    subtitle: "Tell us about yourself",
    bgClass: "bg-gradient-to-br from-blue-600/30 to-indigo-600/30"
  },
  { 
    id: 2, 
    component: () => <Step2_BodyMetrics />,
    title: "Body Metrics",
    subtitle: "Your physical measurements",
    bgClass: "bg-gradient-to-br from-green-600/30 to-emerald-600/30"
  },
  { 
    id: 3, 
    component: () => <Step3_HealthInfo />,
    title: "Health Goals",
    subtitle: "What do you want to achieve?",
    bgClass: "bg-gradient-to-br from-purple-600/30 to-pink-600/30"
  },
  { 
    id: 4, 
    component: () => <Step4_Preferences />,
    title: "Preferences",
    subtitle: "Customize your experience",
    bgClass: "bg-gradient-to-br from-orange-600/30 to-red-600/30"
  },
];

const OnboardingStepper = ({ onStepChange }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({mode: "onBlur", shouldUnregister: false});
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const currentStep = steps[step];
  const currentStepComponent = currentStep.component;

  // Notify parent component of step change
  const handleStepChange = (newStep) => {
    setStep(newStep);
    if (onStepChange) {
      onStepChange(newStep);
    }
  };

  const nextStep = async (data) => {
    if (step === steps.length - 1) {
      setIsSubmitting(true);
      try {
        const token = await getToken();

        const payload = {
          fullName: data.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          gender: data.gender,
          imageUrl: user?.imageUrl,
          age: parseInt(data.age),
          height: { 
            value: data.height?.unit === "feet" 
              ? (parseFloat(data.height?.feet || 0) * 30.48 + parseFloat(data.height?.inches || 0) * 2.54) // Convert to cm
              : parseFloat(data.height?.value || data.heightValue), 
            unit: data.height?.unit === "feet" ? "cm" : (data.height?.unit || data.heightUnit)
          },
          weight: { 
            value: parseFloat(data.weight?.value || data.weightValue), 
            unit: data.weight?.unit || data.weightUnit 
          },
          goal: data.goal,
          targetWeight: parseFloat(data.targetWeight?.value || data.targetWeight),
          activityLevel: data.activityLevel,
          dietaryPreference: data.dietaryPreference,
          medicalConditions: data.medicalConditions || "",
          allergies: data.allergies || "",
          medications: data.medications || "",
          workoutDaysPerWeek: parseInt(data.workoutDaysPerWeek) || 3,
          workoutPreferences: data.workoutPreferences || [],
          mealPlanType: data.mealPlanType || "Balanced",
          wantsMentalSupport: data.wantsMentalSupport || false
        };

        console.log("📤 Sending payload:", payload);

        const response = await axios.post(
          "http://localhost:5000/api/user/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log("✅ Response:", response.data);
        alert("Onboarding completed successfully!");
        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Error creating user:", err);
        console.error("❌ Error details:", err.response?.data);
        alert(`Failed to complete onboarding: ${err.response?.data?.message || err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      handleStepChange(step + 1);
    }
  };

  const prevStep = () => handleStepChange(Math.max(0, step - 1));

  const onSubmit = (data) => {
    nextStep(data);
  };

  return (
    <div className="w-full max-w-[70vw] mx-auto font-['Inter',sans-serif]">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Step Header */}
          <motion.div
            key={`header-${step}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {currentStep.title}
            </motion.h2>
            <motion.p 
              className="text-white/70 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {currentStep.subtitle}
            </motion.p>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={`content-${step}`}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-3xl p-12 md:p-16 backdrop-blur-xl border border-white/20 shadow-2xl w-full ${currentStep.bgClass}`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentStepComponent && currentStepComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            key={`nav-${step}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex justify-between items-center"
          >
            {step > 0 ? (
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back
              </motion.button>
            ) : (
              <div />
            )}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl shadow-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                step === steps.length - 1 ? "Complete Setup" : "Continue"
              )}
            </motion.button>
          </motion.div>

          {/* Progress Dots */}
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProgressDots total={steps.length} current={step} />
          </motion.div>
        </form>
      </FormProvider>
    </div>
  );
};

export default OnboardingStepper;
