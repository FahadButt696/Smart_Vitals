import React, { useEffect,useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { AiMeal, calorieImage, DietPlanAi, } from "@/assets/Assets";
import { useAnimation } from "framer-motion";
import { useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
// import { DirectionAwareHoverDemo } from '../DirectionAwareSection';
// import { NavLink } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const MotionNavLink= motion(NavLink);

export const TextParallaxContentExample = () => {
    
  return (
    <div className="my-[5rem]">
      <TextParallaxContent
        imgUrl={calorieImage}
        subheading="CALORIE CONVERTER"
        heading="EAT WITH MEASUREMENTS"
      >
        <ImageCalorie/>
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl={AiMeal}
        subheading="Collaborate"
        heading="Built for all of us."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Collaborate"
        heading="Built for all of us."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Collaborate"
        heading="Built for all of us."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Quality"
        heading="Never compromise."
      >
        <ExampleContent />
      </TextParallaxContent>
      <TextParallaxContent
        imgUrl="https://images.unsplash.com/photo-1504610926078-a1611febcad3?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        subheading="Modern"
        heading="Dress for the best."
      >
        <ExampleContent />
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
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
    offset: ["start end", "end start"],
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

const ExampleContent = () => (
  <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
    <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
      Additional content explaining the above card here
    </h2>
    <div className="col-span-1 md:col-span-8">
      <p className="mb-4 text-xl text-neutral-600 md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
        blanditiis soluta eius quam modi aliquam quaerat odit deleniti minima
        maiores voluptate est ut saepe accusantium maxime doloremque nulla
        consectetur possimus.
      </p>
      <p className="mb-8 text-xl text-neutral-600 md:text-2xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
        reiciendis blanditiis aliquam aut fugit sint.
      </p>
      <button className="w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit">
        Learn more <FiArrowUpRight className="inline" />
      </button>
    </div>
  </div>
);

const ImageCalorie = () => {
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
        
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12" ref={ref}>
        
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate={controls}
                className="col-span-1 md:col-span-4 text-xl font-bold text-white md:text-2xl lg:text-3xl my-1"
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
                    Using AI-based APIs like CalorieMama or FoodAI, users can upload a food image and instantly receive a breakdown of estimated calories and nutrients—helping you track your intake visually and effortlessly.
                </motion.p>
                <MotionNavLink
  to="/Feature/CalorieGenerator"
  variants={fadeUp}
  initial="hidden"
  animate={controls}
  transition={{ delay: 0.4 }}
  className="w-full bg-black text-white  px-9 py-4 text-xl font-bold text-center transition-all duration-300 ease-in-out hover:bg-white hover:text-black focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer"
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