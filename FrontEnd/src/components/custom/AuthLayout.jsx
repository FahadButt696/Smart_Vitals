"use client";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthLayout() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl rounded-lg shadow-2xl overflow-hidden grid md:grid-cols-2"
      >
        {/* Left Panel */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-cyan-900 via-cyan-800 to-black text-white p-10 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Welcome Back!</h2>
          <p className="text-center text-neutral-300">
            To stay connected, please login with your personal info
          </p>
          <button
            onClick={() => setIsSignIn(true)}
            className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition"
          >
            SIGN IN
          </button>
        </div>

        {/* Right Panel */}
        <div className="bg-white dark:bg-neutral-950 p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-700 dark:text-cyan-400 mb-6">
            {isSignIn ? "Sign In" : "Create Account"}
          </h2>

          {isSignIn ? (
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-md",
                },
              }}
              redirectUrl="/dashboard"
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-md",
                },
              }}
              redirectUrl="/dashboard"
            />
          )}

          <p className="text-sm text-gray-400 mt-6">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="ml-2 text-cyan-600 hover:underline"
            >
              {isSignIn ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
