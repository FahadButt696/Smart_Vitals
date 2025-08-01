// src/components/sections/WhyChoose.jsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const features = [
  {
    icon: (
      <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.5 2.54l2.6 1.53c.56-1.24.9-2.62.9-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
      </svg>
    ),
    title: 'AI-Powered Recommendations',
    description:
      'Smart Vitals uses intelligent algorithms to deliver personalized meal plans, workouts, and health suggestions — just for you.',
  },
  {
    icon: (
      <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
        <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
      </svg>
    ),
    title: 'Effortless Logging',
    description:
      'Track meals, workouts, water, and more with a simple tap. No complexity, just a clean and fast experience.',
  },
  {
    icon: (
      <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    title: 'Student-Friendly Interface',
    description:
      'Smart Vitals is designed to be minimal, fast, and intuitive — perfect for students and busy users.',
  },
  {
    icon: (
      <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    title: 'All-in-One Wellness',
    description:
      'Get your health, fitness, sleep, and mental well-being all under one roof. No need for 5 different apps.',
  },
];

const WhyChoose = () => {
  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-16  text-white">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Why Choose <span className="text-sky-400">Smart Vitals</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-neutral-300 mb-12 max-w-2xl mx-auto"
        >
          Your AI-powered companion for total health and wellness — built for
          simplicity and precision.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-sky-500/20 transition duration-300"
            >
                             <div className="mb-4 flex justify-center feature-icon">{feature.icon}</div>
                             <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{feature.title}</h3>
              <p className="text-sm text-neutral-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;