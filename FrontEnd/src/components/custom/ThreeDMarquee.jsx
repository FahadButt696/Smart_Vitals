"use client";
import { NavLink } from "react-router-dom";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { dark1, dark2, dark3, dark4, dark5, dark6, dark7, dark8, dark9, dark10, dark11, dark12, dark13, dark14, dark15, dark16, dark17, dark18, dark19, dark20, dark21, dark22, dark23, dark24 ,dark25,dark26,dark27,dark28,dark29,dark30,dark31} from "@/assets/Assets";

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
    dark31
  ];
  return (
    <div
      className="relative mx-auto my-10 flex h-screen  2xl:h-[80vh] 3xl:h-[50vh]  w-[100%] max-w-screen flex-col items-center justify-center overflow-hidden ">
      <h2

        className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">

        Your Personalized Path to Optimal Health.{" "}

        <span

          className="relative z-20 inline-block rounded-xl bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 px-4 py-1 mt-5 text-white  decoration-[6px] underline-offset-[16px] backdrop-blur-sm">

          Smart Vitals

        </span>{" "}

        Leads The Way.

      </h2>

      <p

        className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">

         Say goodbye to generic plans. Smart Vitals leverages advanced AI to provide deeply personalized insights and guidance, empowering you to achieve lasting vitality and peak performance effortlessly.

      </p>
      <div
        className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <NavLink to='/Signup'>
        <button
          className="rounded-md bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer">
          Join Smart Vitals
        </button>
          
        </NavLink>
        <NavLink to='/Features'>
        <button
          className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none cursor-pointer">
          Explore Benefits
        </button>
        </NavLink>
      </div>
      {/* overlay */}
      <div
        className="absolute inset-0 z-10 h-full w-full opacity-0.4 bg-black/70 dark:bg-black/90" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images} />
    </div>
  );
}
