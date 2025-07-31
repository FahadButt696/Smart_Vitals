// components/custom/Onboarding/OnboardingForm.jsx
"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2BodyMetrics from "./Step2BodyMetrics";
import Step3HealthInfo from "./Step3HealthInfo";
import Step4Preferences from "./Step4Preferences";
import axios from "axios";

const steps = [
  Step1BasicInfo,
  Step2BodyMetrics,
  Step3HealthInfo,
  Step4Preferences,
];

const OnboardingForm = () => {
  const methods = useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const StepComponent = steps[currentStep];

  const onSubmit = async (data) => {
    try {
      await axios.post("/api/user/create", data);
      alert("Onboarding complete!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit data");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto bg-[#0d1b2a] p-6 rounded-lg shadow-xl space-y-6">
        <AnimatePresence mode="wait">
          <StepComponent key={currentStep} />
        </AnimatePresence>

        <div className="flex justify-between pt-6">
          {currentStep > 0 && (
            <button type="button" onClick={() => setCurrentStep((s) => s - 1)} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={() => setCurrentStep((s) => s + 1)} className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
              Next
            </button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default OnboardingForm;
