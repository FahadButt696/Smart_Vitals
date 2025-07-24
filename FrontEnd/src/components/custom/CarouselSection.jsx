"use client";

import { Chart, dark14, dark2, dark5, mealLog,water, track, workout, calorieImage } from "@/assets/Assets";
import {Carousel} from "../ui/Carousel";
export function CarouselDemo() {
  const slideData = [
    {
      title: "Mystic Mountains",
      button: "Explore Component",
      src: workout,
    },
    {
      title: "Urban Dreams",
      button: "Explore Component",
      src: Chart,
    },
    {
      title: "Neon Nights",
      button: "Explore Component",
      src: calorieImage,
    },
    {
      title: "Desert Whispers",
      button: "Explore Component",
      src: water,
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}
