import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Letter } from './Letter';
import { ScrollableContent } from './ScrollableContent';

// Direction enum for swipe transitions
enum Direction {
  Left = -1,
  Right = 1,
}

export const SwipeTransition: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(Direction.Left);
  const [touchStart, setTouchStart] = useState(0);

  // Page variants for slide animation
  const pageVariants = {
    enter: (direction: Direction) => ({
      x: direction * window.innerWidth,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: Direction) => ({
      x: direction * -window.innerWidth,
      opacity: 0,
    }),
  };

  const pageTransition = {
    duration: 0.5,
    ease: "easeInOut",
  };

  // Handle swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // If swipe is significant enough (> 50px)
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentPage === 0) {
        // Swiped left on first page
        setDirection(Direction.Left);
        setCurrentPage(1);
      } else if (diff < 0 && currentPage === 1) {
        // Swiped right on second page
        setDirection(Direction.Right);
        setCurrentPage(0);
      }
    }
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {currentPage === 0 ? (
          <motion.div
            key="content"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="absolute w-full h-full"
          >
            <ScrollableContent onSwipeLeft={() => {
              setDirection(Direction.Left);
              setCurrentPage(1);
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="absolute w-full h-full"
          >
            <Letter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
