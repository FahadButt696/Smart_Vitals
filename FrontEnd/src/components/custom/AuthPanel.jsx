'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SignIn, SignUp } from '@clerk/clerk-react';

const AuthPanel = () => {
  const [isSignIn, setIsSignIn] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-cyan-950 to-neutral-900 overflow-hidden px-4">
      <div className="relative w-full max-w-5xl h-[2000px] bg-white rounded-2xl shadow-xl flex overflow-hidden transition-all duration-700 ease-in-out">
        {/* Moving Panel */}
        <motion.div
          animate={{ x: isSignIn ? '100%' : '0%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute z-10 h-full w-1/2 bg-gradient-to-br from-cyan-800 to-cyan-950 text-white p-10 rounded-2xl"
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h2 className="text-3xl font-bold">
              {isSignIn ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-sm">
              {isSignIn
                ? 'To keep connected with us please login with your personal info'
                : 'Start your journey with Smart Vitals'}
            </p>
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition"
            >
              {isSignIn ? 'SIGN UP' : 'SIGN IN'}
            </button>
          </div>
        </motion.div>

        {/* Clerk Forms (render conditionally) */}
        <div className="relative flex w-full z-0">
          {isSignIn ? (
            <div className="w-1/2 p-8 pt-14">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6">Sign In</h2>
              <SignUp
                path="/Signup"
                routing="path"
                signInUrl="/Login"
                fallbackRedirectUrl="/"
                className="bg-amber-300"
              />
            </div>
          ) : (
            <div className="w-1/2 p-8 pt-14">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6">Sign Up</h2>
              <SignIn
                className="bg-amber-300"
                path="/Login"
                routing="path"
                signUpUrl="/Signup"
                fallbackRedirectUrl="/"
              />
              {/* <SignUp path="/sign-up" routing="virtual" signInUrl="/sign-in" /> */}
            </div>
          )}

          {/* Empty panel to preserve layout symmetry */}
          <div className="w-1/2" />
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;
