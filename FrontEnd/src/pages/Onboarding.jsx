"use client";
import OnboardingStepper from "@/components/custom/Onboarding/OnboardingStepper";
import { motion } from "framer-motion";
import { dark1, basicInfo, bodyMetrics, healthGoals, fitnessPreference, logoChat } from "../assets/Assets.js";
import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const stepImages = [
    { image: basicInfo, title: "Basic Information" },
    { image: bodyMetrics, title: "Body Metrics" },
    { image: healthGoals, title: "Health Goals" },
    { image: fitnessPreference, title: "Fitness Preferences" }
  ];

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      console.log("🔍 Checking onboarding status for user:", user?.id);
      if (user) {
        try {
          setIsCheckingStatus(true);
          const token = await getToken();
          console.log("🔑 Got token, checking user profile...");
          const response = await fetch(`http://localhost:5000/api/user/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log("✅ User data received:", userData);
            // If user exists and has all required onboarding fields, show message and redirect
            if (userData && userData.fullName && userData.age && userData.height && userData.weight && userData.goal) {
              console.log("🎯 User has completed onboarding, redirecting...");
              setOnboardingCompleted(true);
              setShowRedirectMessage(true);
              // Redirect after showing message
              setTimeout(() => {
                navigate("/Dashboard");
              }, 2000);
            } else {
              console.log("📝 User exists but hasn't completed onboarding");
              setOnboardingCompleted(false);
            }
          } else {
            console.log("❌ User not found, showing onboarding");
            setOnboardingCompleted(false);
          }
        } catch (error) {
          console.error("❌ Error checking onboarding status:", error);
          // On error, show onboarding (safer default)
          setOnboardingCompleted(false);
        } finally {
          setIsCheckingStatus(false);
        }
      } else {
        console.log("👤 No user found, showing onboarding");
        setIsCheckingStatus(false);
      }
    };

    checkOnboardingStatus();
  }, [user, getToken, navigate]);

  // Debug: Log the current image
  useEffect(() => {
    console.log("Current step:", currentStep);
    console.log("Current image:", stepImages[currentStep]?.image);
  }, [currentStep]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("🔄 State update:", {
      isCheckingStatus,
      onboardingCompleted,
      showRedirectMessage,
      user: user?.id
    });
  }, [isCheckingStatus, onboardingCompleted, showRedirectMessage, user]);

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
      {/* Redirect Message Box */}
      {showRedirectMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl border border-green-200 rounded-2xl shadow-2xl p-6 max-w-md mx-4"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Welcome Back!</h3>
              <p className="text-sm text-gray-600">Your profile is already set up. Redirecting to dashboard...</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}

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
          className=""
        >
          <img 
            src={logoChat} 
            alt="Smart Vitals Logo" 
            className="h-24 md:h-32 w-auto"
          />
        </motion.div>

        {/* Show loading state while checking */}
        {isCheckingStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-white/80 text-lg">Checking your profile...</p>
          </motion.div>
        )}

        {/* Show onboarding content only for new users or when status check is complete */}
        {!isCheckingStatus && !onboardingCompleted && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
