"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InputWithLabel } from "./Input";
import { TextAreaWithLabel } from "./Textarea";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";
// import contactImage from "@/assets/contact-image.png";
import { Contact } from "@/assets/Assets";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }

    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setError("");
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Contact Us</h1>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Animated Image */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="w-full flex justify-center"
        >
          <img
            src={Contact}
            alt="Contact Illustration"
            className="max-w-[500px] h-auto rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Form (without box) */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full space-y-6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <InputWithLabel
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={<FaUser />}
          />
          <InputWithLabel
            label="Your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<FaEnvelope />}
            type="email"
          />
          <TextAreaWithLabel
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            icon={<FaCommentDots />}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 transition-colors text-white font-semibold py-3 rounded-md shadow-md w-full"
          >
            Send Message
          </motion.button>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-red-600 text-white text-center py-2 rounded-md shadow-md"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* Success Flash Overlay */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-cyan-900 to-neutral-900 text-white rounded-lg shadow-xl p-8 w-[90%] max-w-lg text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
              <p className="text-sm mb-6">Thank you for contacting us. We'll get back to you soon.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
