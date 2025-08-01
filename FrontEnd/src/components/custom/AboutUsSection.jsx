'use client';
import { motion } from 'framer-motion';
import { About } from '@/assets/Assets';
import { DirectionAwareHover } from '@/components/ui/Direction_Aware_Hover';

const textVariants = {
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

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="my-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900"
    >
      {/* Intro Text Above */}
      <motion.div
        className="max-w-3xl text-center mb-14"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
                 <motion.h2
           className="text-4xl md:text-5xl font-bold mb-4"
           custom={0}
           variants={textVariants}
         >
           Welcome to <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Smart Vitals</span>
         </motion.h2>

        <motion.p
          className="text-lg text-white/70"
          custom={1}
          variants={textVariants}
        >
          Discover how technology and AI come together to simplify your fitness
          goals. Get personalized insights, powerful tools, and effortless
          tracking — all in one place.
        </motion.p>
      </motion.div>

      {/* Main Content Grid (Matches ContactPage Layout) */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Animated Image */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex justify-center"
        >
          <DirectionAwareHover
            imageUrl={About}
            className="w-[500px] cursor-pointer h-[500px] rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Right Animated Text */}
        <motion.div
          className="w-full text-white space-y-6 text-center md:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
                     <motion.h2
             className="text-3xl md:text-4xl font-bold leading-tight"
             custom={0}
             variants={textVariants}
           >
             About <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Smart Vitals</span>
           </motion.h2>

          <motion.p
            className="text-lg text-white/70"
            custom={1}
            variants={textVariants}
          >
            Smart Vitals is your AI-powered health and fitness companion — built
            for modern users seeking simplicity, intelligence, and complete
            control over their lifestyle.
          </motion.p>

          <motion.p
            className="text-white/50"
            custom={2}
            variants={textVariants}
          >
            Whether it’s tracking your meals, logging workouts, monitoring
            sleep, or keeping up with hydration, we offer a sleek, intuitive
            interface that adapts to your personal goals.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutUs;
