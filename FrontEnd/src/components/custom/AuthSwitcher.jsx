"use client";
import { useState } from "react";
import AuthPanel from "./AuthPanel";
import { motion } from "framer-motion";

export default function AuthSwitcher() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black text-white overflow-hidden">
      <div className="relative z-10 flex w-full max-w-6xl shadow-lg">
        {/* Left Panel */}
        <motion.div
          animate={{ x: isSignUp ? "0%" : "100%" }}
          transition={{ duration: 0.6 }}
          className="absolute z-0 h-full w-1/2 bg-gradient-to-br from-gray-900 via-cyan-900 to-neutral-900 rounded-lg"
        >
          <div className="flex h-full flex-col items-center justify-center p-10">
            <h2 className="text-3xl font-bold mb-4">
              {isSignUp ? "Welcome Back!" : "New Here?"}
            </h2>
            <p className="mb-6 text-sm text-neutral-300">
              {isSignUp
                ? "To keep connected with us please login with your personal info"
                : "Sign up and start your fitness journey with Smart Vitals"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="rounded-full border border-white px-6 py-2 hover:bg-white hover:text-black transition"
            >
              {isSignUp ? "SIGN IN" : "SIGN UP"}
            </button>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="relative z-20 flex w-full bg-white text-black rounded-lg">
          <AuthPanel isSignUp={isSignUp} />
        </div>
      </div>
    </div>
  );
}
