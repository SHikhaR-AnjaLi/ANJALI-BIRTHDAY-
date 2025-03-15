import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
  targetDate: Date;
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen px-4 relative z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-3xl md:text-6xl font-bold space-y-4 md:space-y-0 md:space-x-8 flex flex-col md:flex-row items-center">
        <motion.span 
          className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
          whileHover={{ scale: 1.1 }}
        >
          {timeLeft.days}d
        </motion.span>
        <motion.span 
          className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
          whileHover={{ scale: 1.1 }}
        >
          {timeLeft.hours}h
        </motion.span>
        <motion.span 
          className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
          whileHover={{ scale: 1.1 }}
        >
          {timeLeft.minutes}m
        </motion.span>
        <motion.span 
          className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4"
          whileHover={{ scale: 1.1 }}
        >
          {timeLeft.seconds}s
        </motion.span>
      </div>
      <motion.div 
        className="mt-8 text-xl md:text-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        until the special day...
      </motion.div>
    </motion.div>
  );
};
