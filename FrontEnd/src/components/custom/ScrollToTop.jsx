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
      className="cursor-pointer fixed bottom-6 right-6 z-50 p-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg transition-all duration-300"
    >
      <FaArrowUp />
    </button>
  ) : null;
};

export default ScrollToTop;
