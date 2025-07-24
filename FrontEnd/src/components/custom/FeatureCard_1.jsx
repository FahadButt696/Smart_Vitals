// import { hero } from '@/assets/Assets';
import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { DirectionAwareHoverDemo } from '../DirectionAwareSection';
import { NavLink } from 'react-router-dom';
import StepperSection from '../StepperSection';

const MotionNavLink = motion(NavLink);
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const FeatureCard = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  return (
    <div
      className="flex flex-col-reverse sm:w-[100rem] lg:flex-row lg:justify-center  items-center justify-center w-full px-4 sm:px-8 md:px-12 lg:px-20 gap-8"
      ref={ref}
    >
      <div className="flex flex-col sm:w-[35%] items-center lg:items-start text-center lg:text-left">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          className="text-xl font-bold text-white md:text-2xl lg:text-3xl my-1"
        >
          TRACK YOUR WORKOUTS.
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-white md:text-2xl lg:text-3xl my-1"
        >
          ACHIEVE YOUR FITNESS GOALS.
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-white md:text-2xl lg:text-3xl my-1"
        >
          BUILD HEALTHIER HABITS.
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.3 }}
          className="w-[90%] max-w-sm  py-6 text-sm text-neutral-200 md:text-base"
        >
           Smart Vitals help you take control of your health journey by tracking workouts, monitoring calories, and building smart habits. Personalized tools. Smarter living.
        </motion.div>

      </div>
      <StepperSection/>
      {/* <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md sm:max-w-md lg:max-w-lg"
      /> */}
    </div>
  );
};

export default FeatureCard;
