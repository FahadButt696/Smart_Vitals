'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputWithLabel } from './Input';
import { TextAreaWithLabel } from './Textarea';
import { FaUser, FaEnvelope, FaCommentDots } from 'react-icons/fa';
import { Contact } from '@/assets/Assets';
import { useUser } from '@clerk/clerk-react';
import { API_BASE_URL } from '@/config/api';

export default function ContactPage() {
  const { user, isLoaded } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-populate email and name if user is authenticated
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.firstName || ''
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError('All fields are required.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      
      // Use API configuration instead of hardcoded localhost
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
        // Add mobile-specific timeout
        signal: AbortSignal.timeout(30000) // 30 seconds for mobile
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      
      // Better error handling for mobile
      if (error.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 "
    >
      {/* Header */}
      <motion.div
        className="max-w-3xl text-center mb-14 px-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
                 <h2 className="text-4xl md:text-5xl font-bold mb-4">
           Contact <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Smart Vitals</span>
         </h2>
        <p className="text-lg text-white/70">
          Got questions, ideas, or just want to chat? We’d love to hear from
          you. Fill the form below and we’ll get back to you in no time.
        </p>
        {isLoaded && !user && (
          <p className="text-sm text-cyan-400/80 mt-2">
            💡 Sign in to auto-fill your contact information for a faster experience!
          </p>
        )}
      </motion.div>

      {/* Content */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Animated Image */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="w-full flex justify-center"
        >
          <motion.img
            src={Contact}
            alt="Contact Illustration"
            className="max-w-[500px] w-full h-auto rounded-xl shadow-xl"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          />
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full space-y-6"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <InputWithLabel
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={<FaUser />}
            disabled={isLoaded && user}
            className={isLoaded && user ? "opacity-75 cursor-not-allowed" : ""}
          />
          {isLoaded && user && (
            <div className="text-cyan-400 text-sm flex items-center gap-2">
              <FaUser />
              <span>Using your authenticated name: {user.fullName || user.firstName}</span>
            </div>
          )}
          <InputWithLabel
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={<FaEnvelope />}
            type="email"
            disabled={isLoaded && user}
            className={isLoaded && user ? "opacity-75 cursor-not-allowed" : ""}
          />
          {isLoaded && user && (
            <div className="text-cyan-400 text-sm flex items-center gap-2">
              <FaEnvelope />
              <span>Using your authenticated email: {user.primaryEmailAddress?.emailAddress}</span>
            </div>
          )}
          <TextAreaWithLabel
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            icon={<FaCommentDots />}
          />

                     <motion.button
             whileTap={{ scale: 0.97 }}
             whileHover={{ scale: 1.02 }}
             disabled={isLoading}
             className={`bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 text-white font-semibold py-3 rounded-md shadow-lg w-full ${
               isLoading ? 'opacity-50 cursor-not-allowed' : ''
             }`}
           >
             {isLoading ? 'Sending...' : 'Send Message'}
           </motion.button>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
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
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-gradient-to-br from-cyan-900 to-neutral-900 text-white rounded-lg shadow-xl p-8 w-[90%] max-w-lg text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
              <p className="text-sm mb-6">
                Thank you for contacting us. We'll get back to you soon.
              </p>
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
