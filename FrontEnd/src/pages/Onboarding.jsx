"use client";
import OnboardingStepper from "@/components/custom/Onboarding/OnboardingStepper";
import { motion } from "framer-motion";
import { dark1, basicInfo, bodyMetrics, healthGoals, fitnessPreference, logoChat } from "../assets/Assets.js";
import { useState, useEffect } from "react";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const stepImages = [
    { image: basicInfo, title: "Basic Information" },
    { image: bodyMetrics, title: "Body Metrics" },
    { image: healthGoals, title: "Health Goals" },
    { image: fitnessPreference, title: "Fitness Preferences" }
  ];

  // Debug: Log the current image
  useEffect(() => {
    console.log("Current step:", currentStep);
    console.log("Current image:", stepImages[currentStep]?.image);
  }, [currentStep]);

  // Listen for step changes from the stepper
  useEffect(() => {
    const handleStepChange = (event) => {
      if (event.detail && typeof event.detail.step === 'number') {
        setCurrentStep(event.detail.step);
      }
    };

    window.addEventListener('stepChange', handleStepChange);
    return () => window.removeEventListener('stepChange', handleStepChange);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden font-['Inter',sans-serif]">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <motion.img
          key={`bg-${currentStep}`}
          src={stepImages[currentStep]?.image || dark1}
          alt="background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full object-cover"
          style={{ 
            filter: 'brightness(0.6) contrast(1.1) saturate(0.9)',
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/10 rounded-full blur-xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4"
        >
          <img 
            src={logoChat} 
            alt="Smart Vitals Logo" 
            className="h-24 md:h-32 w-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-8"
        >
          {/* Enhanced Title Design */}
          <div className="mb-6">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Welcome to Smart Vitals
              </span>
            </motion.h1>
            
            {/* Decorative Elements */}
            <motion.div 
              className="flex justify-center items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              <div className="w-4 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
            </motion.div>
          </div>

          <motion.p 
            className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Let's personalize your health journey. Complete these quick steps to set up your personalized health profile and start your wellness transformation.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <OnboardingStepper onStepChange={(step) => setCurrentStep(step)} />
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
