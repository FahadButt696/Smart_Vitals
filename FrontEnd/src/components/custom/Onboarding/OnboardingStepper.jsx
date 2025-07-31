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
  { id: 1, component: () => <Step1_BasicInfo /> },
  { id: 2, component: () => <Step2_BodyMetrics /> },
  { id: 3, component: () => <Step3_HealthInfo /> },
  { id: 4, component: () => <Step4_Preferences /> },
];

const OnboardingStepper = () => {
  const [step, setStep] = useState(0);
  const methods = useForm({mode: "onBlur", shouldUnregister: false});
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth(); // Clerk token for auth

  const currentStepComponent = steps[step].component;

  const nextStep = async (data) => {
    if (step === steps.length - 1) {
      try {
        const token = await getToken(); // Secure token

        // Build payload exactly as backend expects
        const payload = {
          clerkId: user?.id, // from Clerk
          fullName: data.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          age: data.age,
          height: { value: data.heightValue, unit: data.heightUnit },
          weight: { value: data.weightValue, unit: data.weightUnit },
          goal: data.goal,
          targetWeight: data.targetWeight,
          activityLevel: data.activityLevel,
          dietaryPreference: data.dietaryPreference,
          medicalConditions: data.medicalConditions,
          allergies: data.allergies,
          medications: data.medications,
          waterGoal: data.waterGoal,
          sleepGoal: data.sleepGoal,
          workoutDaysPerWeek: data.workoutDaysPerWeek,
          workoutPreferences: data.workoutPreferences,
          mealPlanType: data.mealPlanType,
          wantsMentalSupport: data.wantsMentalSupport
        };

        console.log("📤 Sending payload:", payload);

        await axios.post(
          "http://localhost:5000/api/user/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Clerk auth token
            },
            withCredentials: true,
          }
        );

        navigate("/dashboard");
      } catch (err) {
        console.error("❌ Error creating user:", err);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  const onSubmit = (data) => {
    nextStep(data);
  };

  return (
    <div className="max-w-3xl w-full mx-auto bg-black/30 rounded-xl p-6 backdrop-blur-lg shadow-lg border border-white/10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -200, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentStepComponent && currentStepComponent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex justify-between items-center">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20 transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded shadow hover:from-cyan-600 hover:to-cyan-800 transition"
            >
              {step === steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>

          {/* Progress Dots */}
          <ProgressDots total={steps.length} current={step} />
        </form>
      </FormProvider>
    </div>
  );
};

export default OnboardingStepper;
