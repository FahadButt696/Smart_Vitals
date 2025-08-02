// Carousel.jsx
'use client';

import BubbleText from '@/reactBit_Components/TextAnimations/BubbleText/BubbleText';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useState, useRef, useId, useEffect } from 'react';
import { ShimmerButton } from '../magicui/shimmer-button';
import { NavLink } from 'react-router-dom';

const Slide = ({ slide, index, current, handleSlideClick }) => {
  const slideRef = useRef(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;
      slideRef.current.style.setProperty('--x', `${xRef.current}px`);
      slideRef.current.style.setProperty('--y', `${yRef.current}px`);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleMouseMove = (e) => {
    const rect = slideRef.current.getBoundingClientRect();
    xRef.current = e.clientX - (rect.left + rect.width / 2);
    yRef.current = e.clientY - (rect.top + rect.height / 2);
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const { src, button, title } = slide;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin]"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? 'scale(0.98) rotateX(8deg)'
              : 'scale(1) rotateX(0deg)',
          transformOrigin: 'bottom',
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden shadow-lg"
          style={{
            transform:
              current === index
                ? 'translate3d(calc(var(--x)/30),calc(var(--y)/30),0)'
                : 'none',
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100"
            style={{ opacity: current === index ? 1 : 0.5 }}
            alt={title}
            src={src}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] ${current === index ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <h2 className="text-3xl md:text-2xl sm:text-lg xs:text-md lg:text-4xl font-semibold">
            <BubbleText title={title} />
          </h2>
          <div className="flex justify-center">
            <NavLink to="/Signup">
              <ShimmerButton className="shadow-2xl  mt-6 px-4 py-2 md:py-4">
                <span className="text-sm font-medium leading-none tracking-tight bg-gradient-to-br from bg-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text lg:text-lg">
                  {button}
                </span>
              </ShimmerButton>
            </NavLink>
          </div>
        </article>
      </li>
    </div>
  );
};

const CarouselControl = ({ type, title, handleClick }) => {
  return (
    <button
      className={`group w-10 h-10 flex mr-[.1rem] items-center justify-center rounded-full bg-black shadow-xl transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl border border-white/10 ${
        type === 'previous' ? 'rotate-180' : ''
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight
        className="  bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-blue-500 hover:to-green-500 transition duration-300 ease-in-out"
        size={26}
      />
    </button>
  );
};

export function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const id = useId();

  const handlePreviousClick = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const handleNextClick = () =>
    setCurrent((prev) => (prev + 1) % slides.length);
  const handleSlideClick = (index) => setCurrent(index);

  return (
    <div
      className="relative w-[70vmin] h-[70vmin] mx-auto"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>
      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
