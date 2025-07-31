import '../../styles/clerk_custom.css';
"use client";

import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { logo3 } from "../../assets/Assets";

const AuthForm = ({ type = "sign-in" }) => {
  const isSignIn = type === "sign-in";
  const navigate = useNavigate();

  const appearance = {
    ...dark,
    variables: {
      colorBackground: "#0f172a",
      colorPrimary: "#22d3ee",
      colorText: "white",
    },
    elements: {
      ...dark.elements,
      card:
        "bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 shadow-lg shadow-cyan-900/40 border border-cyan-700 rounded-xl p-6",
      formButtonPrimary:
        "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full",
      socialButtonsBlockButton: "clerk-custom-provider-btn",
      socialButtonsBlockButtonText: "text-inherit",

      // 👇 Logo inside form
      logoImage: "clerk-custom-logo",
      logoImageContainer: "flex justify-center mb-6",

      // 👇 Hide the footer
      footer: "hidden",
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 px-4 py-20 relative overflow-hidden">
      {/* Return to Home Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6"
      >
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="backButton"
        >
          <ArrowLeft size={18} className="relative left-1" />
          Return to Home
        </Button>
      </motion.div>

      {/* Clerk Auth Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex justify-center"
      >
        {isSignIn ? (
          <SignIn
            signUpUrl="/Signup"
            forceRedirectUrl="/Onboarding"
            appearance={appearance}
            logo={logo3}
          />
        ) : (
          <SignUp
            signInUrl="/Login"
            forceRedirectUrl="/Onboarding"
            appearance={appearance}
            logo={logo3}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AuthForm;
