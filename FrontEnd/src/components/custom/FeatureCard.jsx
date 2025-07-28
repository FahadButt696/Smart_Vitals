'use client';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const FeatureCard = ({
  title,
  description,
  image,
  steps,
  isReversed,
  index,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      className={`flex flex-col md:flex-row ${
        isReversed ? 'md:flex-row-reverse' : ''
      } items-start gap-10 md:gap-12 lg:gap-16`}
    >
      {/* Image Section with existing hover effect */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex-shrink-0 w-full md:w-[500px] h-[500px] rounded-lg overflow-hidden group"
      >
        <div className="hover:cursor-pointer relative w-full h-full rounded-lg transition-all duration-300 group-hover:shadow-[0_8px_30px_rgba(0,255,255,0.3),0_0_60px_rgba(0,255,255,0.2)]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-lg" />
        </div>
      </motion.div>

      {/* Text Section with animation */}
      <motion.div
        className="flex flex-col justify-start w-full md:w-[500px] text-white space-y-4"
        initial="hidden"
        animate={controls}
        variants={cardVariants}
      >
        <h3 className="text-2xl md:text-3xl font-bold text-cyan-400">
          {title}
        </h3>
        <p className="text-neutral-300">{description}</p>
        <ul className="list-disc pl-5 text-sm space-y-1 text-white">
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
        <div className="pt-4">
          <NavLink
            to="/Signup"
            className="inline-block mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-md transition"
          >
            Try it Now →
          </NavLink>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeatureCard;
