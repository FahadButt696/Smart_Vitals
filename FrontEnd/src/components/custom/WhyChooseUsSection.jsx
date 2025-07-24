// src/components/sections/WhyChoose.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const features = [
  {
    emoji: "🤖",
    title: "AI-Powered Recommendations",
    description:
      "Smart Vitals uses intelligent algorithms to deliver personalized meal plans, workouts, and health suggestions — just for you.",
  },
  {
    emoji: "📲",
    title: "Effortless Logging",
    description:
      "Track meals, workouts, water, and more with a simple tap. No complexity, just a clean and fast experience.",
  },
  {
    emoji: "🧠",
    title: "Student-Friendly Interface",
    description:
      "Smart Vitals is designed to be minimal, fast, and intuitive — perfect for students and busy users.",
  },
  {
    emoji: "🩺",
    title: "All-in-One Wellness",
    description:
      "Get your health, fitness, sleep, and mental well-being all under one roof. No need for 5 different apps.",
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
          Your AI-powered companion for total health and wellness — built for simplicity and precision.
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
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-neutral-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
