import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const letterVariants = {
  initial: { 
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.95
  },
  animate: { 
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    filter: 'blur(10px)',
    scale: 0.95
  }
};

// Animation for each character in the text
const characterVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: 0.03 * i,
    }
  })
};

export const Letter: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState("auto");
  const contentRef = React.useRef<HTMLDivElement>(null);

  const lines = [
    "Dear [Name],",
    "On this special day,",
    "I wanted to take a moment",
    "to wish you the happiest of birthdays.",
    "May your day be filled with joy,",
    "laughter, and unforgettable moments.",
    "With love,"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Update content height when content changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [isVisible, lines]);

  // Create an array of characters for each line for the writing animation
  const splitLines = lines.map(line => [...line]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="relative max-w-2xl w-full"
            variants={letterVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Background blur effect - enhanced for better paper effect */}
            <motion.div 
              className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-lg shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />

            {/* Letter content with dynamic height and scrolling */}
            <div 
              className="relative z-10 p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar"
              ref={contentRef}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent'
              }}
            >
              <div className="space-y-4">
                {splitLines.map((line, lineIndex) => (
                  <p 
                    key={lineIndex} 
                    className="text-lg md:text-xl text-white/90 font-light"
                  >
                    {line.map((char, charIndex) => (
                      <motion.span
                        key={`${lineIndex}-${charIndex}`}
                        custom={lineIndex * 20 + charIndex}
                        variants={characterVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: "inline-block" }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
