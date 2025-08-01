// CarouselDemo.jsx
'use client';

import {
  Chart,
  water,
  calorieImage,
  track,
  CalorieTracker,
  CalorieTracker2,
  SleepTracker,
  WeightProgress,
  healthReport,
  MealLogger,
  weightTracker,
  weightTracker2,
} from '@/assets/Assets';
import { Carousel } from '../ui/Carousel';

export function CarouselDemo() {
  const slideData = [
    {
      title: 'WORKOUT LOGGER',
      button: 'ADD WORKOUT',
      src: track,
    },
    {
      title: 'CALORIE COUNT',
      button: 'TRACK CALORIES',
      src: CalorieTracker2,
    },
    {
      title: 'MEAL LOGGER',
      button: 'LOG A MEAL',
      src: MealLogger,
    },
    {
      title: 'WATER INTAKE',
      button: 'LOG WATER',
      src: water,
    },
    {
      title: 'SLEEP TRACKER',
      button: 'TRACK SLEEP',
      src: SleepTracker,
    },
    {
      title: 'WEIGHT PROGRESS',
      button: 'VIEW PROGRESS',
      src: weightTracker,
    },
    {
      title: 'CHARTS',
      button: 'VIEW STATS',
      src: Chart,
    },
    {
      title: 'HEALTH REPORT PDF',
      button: 'GENERATE REPORT',
      src: healthReport,
    },
  ];

  return (
    <div className="relative overflow-hidden w-full h-full py-20 bg-gradient-to-r from-gray-900 via-cyan-900 to-purple-900">
      <Carousel slides={slideData} />
    </div>
  );
}
