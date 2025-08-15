'use client';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import {
  dark1,
  dark2,
  dark3,
  dark4,
  dark5,
  dark6,
  dark7,
  dark8,
  dark9,
  dark10,
  dark11,
  dark12,
  dark13,
  dark14,
  dark15,
  dark16,
  dark17,
  dark18,
  dark19,
  dark20,
  dark21,
  dark22,
  dark23,
  dark24,
  dark25,
  dark26,
  dark27,
  dark28,
  dark29,
  dark30,
  dark31,
} from '@/assets/Assets';

export function ThreeDMarqueeDemoSecond() {
  const images = [
    dark1,
    dark2,
    dark3,
    dark4,
    dark5,
    dark6,
    dark27,
    dark8,
    dark9,
    dark10,
    dark11,
    dark12,
    dark13,
    dark14,
    dark15,
    dark17,
    dark18,
    dark19,
    dark20,
    dark21,
    dark22,
    dark23,
    dark24,
    dark25,
    dark26,
    dark7,
    dark28,
    dark29,
    dark30,
    dark31,
  ];

  return (
    <div className="relative mx-auto mb-10 mt-25 flex h-screen 2xl:h-[80vh] 3xl:h-[50vh] w-[100%] max-w-screen flex-col items-center justify-center overflow-hidden">
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: false }}
        className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl"
      >
        Your Personalized Path to{' '}
        <span className="relative z-20 inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Optimal Health
        </span>
        <br />
        <span className="relative z-20 inline-block rounded-xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 px-4 py-1 mt-3 text-white backdrop-blur-sm border border-cyan-400/30">
          Smart Vitals
        </span>{' '}
        Leads The Way
      </motion.h2>

      {/* Animated Description */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        viewport={{ once: false }}
        className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base"
      >
        Say goodbye to generic plans. Smart Vitals leverages advanced AI to
        provide deeply personalized insights and guidance, empowering you to
        achieve lasting vitality and peak performance effortlessly.
      </motion.p>

      {/* Animated Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: false }}
        className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4"
      >
        <NavLink to="/Signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            className="three-d-marquee-btn rounded-md border border-cyan-400/30 bg-gradient-to-r from-cyan-400 to-purple-400 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-cyan-500 hover:to-purple-500 hover:shadow-lg hover:shadow-cyan-500/25 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer backdrop-blur-sm"
          >
            Join Smart Vitals
          </motion.button>
        </NavLink>

        <NavLink to="/Features">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            className="three-d-marquee-btn rounded-md border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-lg hover:shadow-white/25 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
          >
            Explore Benefits
          </motion.button>
        </NavLink>
      </motion.div>

      {/* Background Overlay */}
      <div className="absolute inset-0 z-10 h-full w-full opacity-0.4 bg-black/70 dark:bg-black/90" />

      {/* Marquee Component */}
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}