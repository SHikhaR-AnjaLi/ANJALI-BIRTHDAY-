import React, { useState, useEffect, useRef } from 'react';
import { FlipWords } from './FlipWords';
import { motion } from 'framer-motion';

interface BirthdayMessageProps {
  name: string;
}

export const BirthdayMessage: React.FC<BirthdayMessageProps> = ({ name }) => {
  const [isVisible, setIsVisible] = useState(true);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when visibility changes
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Consider it visible when 30% is in view
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" ref={componentRef}>
      <motion.div 
        className="text-center space-y-12"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Happy Birthday
        </motion.h1>
        
          {isVisible ? (
            <FlipWords
              words={[name, "Beautiful", "Amazing", "Wonderful"]}
              className="text-2xl md:text-4xl font-bold"
              duration={2000}
            />
          ): (
    <div className="text-2xl md:text-4xl font-bold">{name}</div>
  )}
          <motion.div
          className="text-white/80 text-lg mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Scroll down to continue...
        </motion.div>
      </motion.div>
    </div>
  );
};
