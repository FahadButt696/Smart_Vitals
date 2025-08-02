'use client';
import {
  workout,
  CalorieTracker2,
  MealLogger,
  AiMeal,
  AiSymptom,
  AiMental,
  SleepTracker,
  weightTracker,
  water,
  healthReport,
  Chart,
  AiCalorieCounter,
} from '@/assets/Assets';

import FeatureCard from '@/components/custom/FeatureCard';
import '@/styles/Feature.css';
import ScrollToTop from '@/components/custom/ScrollToTop';
import { motion } from 'framer-motion';

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

const featureData = [
  {
    title: 'Workout Logger',
    description:
      'Track your workouts with customizable categories, sets, reps, and rest. Improve your fitness journey with detailed progress tracking for long-term results.',
    image: workout,
    steps: [
      '📋 Select workout type',
      '💪 Log your reps and sets',
      '📊 Analyze performance growth',
    ],
  },
  {
    title: 'Calorie Counter',
    description:
      'Monitor calories from your meals using AI-powered food recognition for smart logging and better decision-making in real time.',
    image: AiCalorieCounter,
    steps: [
      '🍽️ Upload your meal photo',
      '📈 Get instant calorie count',
      '📊 Track nutritional balance',
    ],
  },
  {
    title: 'Calorie Tracker',
    description:
      'Set daily calorie goals and monitor your intake. Stay aligned with your health objectives effortlessly with smart visual feedback.',
    image: CalorieTracker2,
    steps: [
      '🎯 Set calorie goal',
      '🍱 Add meals daily',
      '📉 See how your day stacks up',
    ],
  },
  {
    title: 'Meal Logger',
    description:
      'Log meals easily with smart detection or manual input. Build healthy eating habits and track nutrition over time.',
    image: MealLogger,
    steps: [
      '🍕 Add meals instantly',
      '📷 Use camera or search',
      '📊 Monitor meal history',
    ],
  },
  {
    title: 'AI Diet Plan Generator',
    description:
      'Generate a personalized diet plan based on your body type, lifestyle, and goals. All done through AI intelligence.',
    image: AiMeal,
    steps: [
      '🤖 Enter preferences',
      '📝 Review suggested plan',
      '🥗 Follow tailored diet',
    ],
  },
  {
    title: 'AI Symptom Checker',
    description:
      'Check your symptoms and receive AI-based suggestions. A smart way to understand your health status in seconds.',
    image: AiSymptom,
    steps: [
      '💬 Enter symptoms',
      '🤖 AI analysis begins',
      '📃 Receive suggestions',
    ],
  },
  {
    title: 'AI Mental Health Support',
    description:
      'Get daily mental wellness support from an AI companion. Receive affirmations, guidance, and emotional balance.',
    image: AiMental,
    steps: [
      '🌞 Daily mood check',
      '🧠 Get support tips',
      '💬 Chat with AI bot',
    ],
  },
  {
    title: 'Sleep Tracker',
    description:
      'Track your sleep schedule and patterns. Discover the quality of your rest and receive suggestions to improve it.',
    image: SleepTracker,
    steps: [
      '🌙 Track bedtime',
      '⏰ Analyze sleep cycles',
      '🧘 Improve sleep quality',
    ],
  },
  {
    title: 'Weight Progress',
    description:
      'Log your weight daily and watch your transformation unfold with clear progress visuals.',
    image: weightTracker,
    steps: ['📝 Log weight', '📈 View progress chart', '🏋️ Adjust goals'],
  },
  {
    title: 'Water Intake Logger',
    description:
      'Stay hydrated with timely reminders and easy water intake tracking throughout the day.',
    image: water,
    steps: [
      '💧 Set water goal',
      '🕒 Log each intake',
      '📊 Check hydration level',
    ],
  },
  {
    title: 'Health Report (PDF)',
    description:
      'Generate complete reports from your data for doctors or personal records. Simple export with one click.',
    image: healthReport,
    steps: ['📁 Compile data', '📥 Export PDF', '🩺 Share with professionals'],
  },
  {
    title: 'Charts & Visualizations',
    description:
      'See your progress in dynamic graphs — calories, water, workouts, sleep, and more all in one place.',
    image: Chart,
    steps: [
      '📊 See health insights',
      '📈 Analyze trends',
      '📤 Share visual data',
    ],
  },
];

export default function Feature() {
  return (
    <section className="my-10  text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="max-w-3xl text-center mb-14 mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
                     <motion.h2
             className="text-4xl md:text-5xl font-bold mb-4"
             custom={0}
             variants={textVariants}
           >
             Explore <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Smart Vitals</span> Features
           </motion.h2>

          <motion.p
            className="text-lg text-white/70"
            custom={1}
            variants={textVariants}
          >
            Discover how Smart Vitals uses AI to help you live healthier. From
            calorie tracking to mental health support, everything is crafted to
            make your wellness journey seamless.
          </motion.p>
        </motion.div>

        {/* Feature Cards Without Line */}
        <div className="space-y-28 relative">
          {featureData.map((feature, index) => (
            <div key={index} className="relative z-10">
              <FeatureCard {...feature} isReversed={index % 2 !== 0} />
            </div>
          ))}
        </div>
      </div>
      <ScrollToTop />
    </section>
  );
}
