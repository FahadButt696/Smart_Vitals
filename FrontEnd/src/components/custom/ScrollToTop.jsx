'use client';

import React, { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return showScrollTop ? (
    <button
      onClick={scrollToTop}
      className="cursor-pointer fixed bottom-6 right-6 z-50 p-3  bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-color hover:from-cyan-900 hover:to-purple-800 transition-all duration-300 rounded-full shadow-lg text-white hover:text-black  hover:scale-110"
    >
      <FaArrowUp />
    </button>
  ) : null;
};

export default ScrollToTop;
