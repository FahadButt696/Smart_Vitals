"use client";

import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { logo3 } from "../../assets/Assets"; // Make sure logo is a valid image URL

const AuthForm = ({ type = "sign-in" }) => {
  const isSignIn = type === "sign-in";
  const navigate = useNavigate();

  const appearance = {
    ...dark,
    elements: {
      ...dark.elements,
      formButtonPrimary:
        "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full",
      logoImage:
        "w-24 h-24 mx-auto mb-6 rounded-full shadow-lg shadow-cyan-500/40",
      logoImageContainer: "flex justify-center mb-6",
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-cyan-950 to-neutral-900 px-4 py-20 relative overflow-hidden">
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
          className="border border-cyan-700 bg-transparent text-cyan-300 hover:bg-cyan-800/30 hover:text-white"
        >
          <ArrowLeft size={18} className="mr-2" />
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
            forceRedirectUrl="/Dashboard"
            appearance={appearance}
            logo={logo3}
          />
        ) : (
          <SignUp
            signInUrl="/Login"
            forceRedirectUrl="/Dashboard"
            appearance={appearance}
            logo={logo3}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AuthForm;
