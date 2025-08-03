'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full text-white px-4 sm:px-6 py-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="text-center md:text-left">
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Smart Vitals
          </h1>
          <p className="text-white/70 mt-1">
            Empowering your health journey with smart AI tools.
          </p>
        </div>

        <div className="flex gap-4 text-xl">
          {/* Instagram */}
          <motion.a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 transition-all duration-300 hover:scale-110"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInstagram />
          </motion.a>
          
          {/* Facebook */}
          <motion.a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFacebook />
          </motion.a>
          
          {/* LinkedIn */}
          <motion.a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400 transition-all duration-300 hover:scale-110"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaLinkedin />
          </motion.a>
        </div>
      </div>

      <div className="text-center text-white/50 text-xs mt-8 border-t border-white/10 pt-4">
        © {new Date().getFullYear()} Smart Vitals — All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
