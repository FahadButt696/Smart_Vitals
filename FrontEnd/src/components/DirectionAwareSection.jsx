"use client";
import { dark10, dark15, dark7, feature1, hero } from "@/assets/Assets";
import { DirectionAwareHover } from "../components/ui/Direction_Aware_Hover";

export function DirectionAwareHoverDemo() {
  const imageUrl =
    hero
  return (
    <div className='flex justify-center w-full max-w-md sm:max-w-md lg:max-w-lg '>
      <DirectionAwareHover className="brightness-50" imageUrl={imageUrl}>
      </DirectionAwareHover>
    </div>
  );
}
