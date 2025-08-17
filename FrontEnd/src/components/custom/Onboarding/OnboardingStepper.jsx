"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const methods = useForm({mode: "onBlur", shouldUnregister: false});
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const currentStep = steps[step];
  const currentStepComponent = currentStep.component;

  // Notify parent component of step change
  const nextStep = (data) => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      if (onStepChange) {
        onStepChange(step + 1);
      }
      // Dispatch custom event for step change
      window.dispatchEvent(new CustomEvent('stepChange', { detail: { step: step + 1 } }));
    } else {
      // Final step - submit the form
      handleFinalSubmit(data);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      if (onStepChange) {
        onStepChange(step - 1);
      }
      // Dispatch custom event for step change
      window.dispatchEvent(new CustomEvent('stepChange', { detail: { step: step - 1 } }));
    }
  };

  const handleFinalSubmit = async (data) => {
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
        sleepGoal: data.sleepGoal || 8,
        wantsMentalSupport: data.wantsMentalSupport || false
      };

      console.log("📤 Sending payload:", payload);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/user/create`,
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
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Show toast notification
      toast.success('Registration successful! Welcome to Smart Vitals! Generating your personalized AI recommendations...', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
      });

      // Generate AI recommendations for new user
      try {
        console.log("🤖 Generating AI recommendations for new user...");
        const aiResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/ai-recommendations/generate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        
        if (aiResponse.ok || aiResponse.status === 200) {
          console.log("✅ AI recommendations generated successfully");
          toast.success('AI recommendations generated! Check your dashboard for personalized health tips.', {
            duration: 4000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          });
        }
      } catch (aiError) {
        console.error("❌ Error generating AI recommendations:", aiError);
        // Don't fail the onboarding if AI recommendations fail
      }

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/Dashboard");
      }, 3000);
      
    } catch (err) {
      console.error("❌ Error creating user:", err);
      console.error("❌ Error details:", err.response?.data);
      
      toast.error('Something went wrong. Please try again.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    nextStep(data);
  };

  return (
    <div className="w-screen max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] mx-auto font-['Inter',sans-serif] px-4 sm:px-6">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* Step Header */}
          <motion.div
            key={`header-${step}`}
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* {currentStep.title} */}
            </motion.h2>
            <motion.p 
              className="text-white/70 text-base sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* {currentStep.subtitle} */}
            </motion.p>
          </motion.div>

          {/* Step Content */}
          <motion.div
            key={`content-${step}`}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 backdrop-blur-xl border border-white/20 shadow-2xl w-full ${currentStep.bgClass}`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-transparent"></div>
            
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-between items-center mt-6 sm:mt-8"
          >
            <motion.button
              type="button"
              onClick={prevStep}
              disabled={step === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                step === 0
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm'
              }`}
              whileHover={step > 0 ? { scale: 1.05 } : {}}
              whileTap={step > 0 ? { scale: 0.95 } : {}}
            >
              Previous
            </motion.button>

            <ProgressDots currentStep={step} totalSteps={steps.length} />

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                isSubmitting
                  ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 to-purple-400 text-white shadow-lg hover:from-cyan-500 hover:to-purple-500'
              }`}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Processing...</span>
                </div>
              ) : step === steps.length - 1 ? (
                'Complete Registration'
              ) : (
                'Next'
              )}
            </motion.button>
          </motion.div>
        </form>
      </FormProvider>

      {/* Success Message Overlay */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-cyan-900 via-blue-900 to-purple-900 text-white rounded-2xl shadow-2xl p-6 sm:p-8 w-[90%] max-w-md text-center border border-cyan-400/30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
              >
                Registration Successful!
              </motion.h2>
              
                             <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="text-white/80 mb-6 text-sm sm:text-base"
               >
                 Welcome to Smart Vitals! Your health journey starts now. You can generate personalized AI recommendations from the dashboard.
               </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-cyan-300"
              >
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">Redirecting to Dashboard...</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingStepper;
