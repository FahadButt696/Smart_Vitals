import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';
import {
  AiCalorieCounter,
  AiMeal,
  AiMental,
  AiSymptom,
  calorieImage,
} from '@/assets/Assets';
import { useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { NavLink } from 'react-router-dom';
// import { DirectionAwareHoverDemo } from '../DirectionAwareSection';
// import { NavLink } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const MotionNavLink = motion(NavLink);

export const TextParallaxContentExample = () => {
  return (
    <div className="mt-[5rem]">
      <TextParallaxContent
        imgUrl={AiCalorieCounter}
        subheading="CALORIE COUNTER"
        heading="EAT WITH MEASUREMENTS"
      >
        <ImageCalorie />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={AiMeal}
        subheading=" AI DIET PLAN GENERATOR"
        heading="GENERATE DIET PLAN FOR YOU"
      >
        <AIMeal />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={AiSymptom}
        subheading="AI SYMPTOM CHECKER"
        heading="REGULAR CHECKUP IS IMPORTANT!"
      >
        <AISymptom />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={AiMental}
        subheading="MENTAL HEALTH CHATBOT"
        heading="SHARE YOUR THOUGHTS WITH AI"
      >
        <AIMental />
      </TextParallaxContent>
    </div>
  );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({ imgUrl, subheading, heading, children }) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
      }}
    >
      <div className="relative h-[100vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy heading={heading} subheading={subheading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      ref={targetRef}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 bg-neutral-950/70"
        style={{
          opacity,
        }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        opacity,
      }}
      ref={targetRef}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

const ImageCalorie = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { threshold: 0.3 });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  return (
    <div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12"
      ref={ref}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        className="col-span-1 md:col-span-4 text-xl FONT bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold md:text-2xl lg:text-3xl my-1"
      >
        SNAP A MEAL, GET INSTANT CALORIE DATA.
      </motion.div>

      <div className="col-span-1 md:col-span-8">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.1 }}
          className="mb-10 text-xl text-neutral-200 md:text-2xl
                    "
        >
          Using AI-based APIs like CalorieMama or FoodAI, users can upload a
          food image and instantly receive a breakdown of estimated calories and
          nutrients—helping you track your intake visually and effortlessly.
        </motion.p>
        <MotionNavLink
          to="/Feature/CalorieGenerator"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.4 }}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-9 py-4 text-xl font-bold text-center transition-all duration-300 ease-in-out hover:from-cyan-500 hover:text-black  hover:to-purple-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
        >
          LEARN MORE <FiArrowUpRight className="inline" />
        </MotionNavLink>
        {/* <motion.button
                    variants={fadeUp}
                    initial="hidden"
                    animate={controls}
                    transition={{ delay: 0.2 }} // Staggered delay for the button
                    className="w-full rounded mt-5 bg-black px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit"
                >
                    Learn more <FiArrowUpRight className="inline" />
                </motion.button> */}
      </div>
    </div>
  );
};

const AIMeal = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { threshold: 0.3 });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  return (
    <div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12"
      ref={ref}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        className="col-span-1 md:col-span-4 text-xl font-bold FONT bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold md:text-2xl lg:text-3xl my-1"
      >
        SMART MEALS TAILORED TO YOUR GOALS.
      </motion.div>

      <div className="col-span-1 md:col-span-8">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.1 }}
          className="mb-10 text-xl text-neutral-200 md:text-2xl
                    "
        >
          Generate personalized, healthy meal plans using GPT-3.5 or Edamam
          APIs. Whether your goal is weight loss, muscle gain, or maintenance,
          the AI builds a daily plan suited to your dietary preferences and
          fitness targets.
        </motion.p>
        <MotionNavLink
          to="/Feature/CalorieGenerator"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.3 }}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-9 py-4 text-xl font-bold text-center hover:from-cyan-500 hover:to-purple-500 hover:text-black  transition-all duration-300 ease-in-out focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
        >
          LEARN MORE <FiArrowUpRight className="inline" />
        </MotionNavLink>
      </div>
    </div>
  );
};

const AISymptom = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { threshold: 0.3 });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  return (
    <div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12"
      ref={ref}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        className="col-span-1 md:col-span-4 text-xl font-bold FONT bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold md:text-2xl lg:text-3xl my-1"
      >
        YOUR PERSONAL HEALTH GUIDE.
      </motion.div>

      <div className="col-span-1 md:col-span-8">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.1 }}
          className="mb-10 text-xl text-neutral-200 md:text-2xl
                    "
        >
          Powered by the Infermedica API, users can input symptoms and receive
          possible health insights instantly. It mimics a mini medical
          assistant—helping you make better decisions before visiting a doctor.
        </motion.p>
        <MotionNavLink
          to="/Feature/CalorieGenerator"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.4 }}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-9 py-4 text-xl font-bold text-center hover:from-cyan-500 hover:to-purple-500 hover:text-black  transition-all duration-300 ease-in-out focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
        >
          LEARN MORE <FiArrowUpRight className="inline" />
        </MotionNavLink>
      </div>
    </div>
  );
};

const AIMental = () => {
  const ref = useRef(null);

  const inView = useInView(ref, { threshold: 0.3 });

  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  return (
    <div
      className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12"
      ref={ref}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate={controls}
        className="col-span-1 md:col-span-4 text-xl font-bold  bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold md:text-2xl lg:text-3xl my-1"
      >
        TALK IT OUT, FEEL LIGHTER.
      </motion.div>

      <div className="col-span-1 md:col-span-8">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.1 }}
          className="mb-10 text-xl text-neutral-200 md:text-2xl
                    "
        >
          Built using ChatGPT or HuggingFace models, this conversational AI
          offers mental and emotional support. Whether you're feeling anxious,
          sad, or stressed—you're never alone with a friendly bot to talk to.
        </motion.p>
        <MotionNavLink
          to="/Feature"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.4 }}
          className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-9 py-4 text-xl font-bold text-center hover:from-cyan-500 hover:to-purple-500 hover:text-black transition-all duration-300 ease-in-out focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
        >
          LEARN MORE <FiArrowUpRight className="inline" />
        </MotionNavLink>
      </div>
    </div>
  );
};
