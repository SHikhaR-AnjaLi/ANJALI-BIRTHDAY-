import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const ScrollableContent: React.FC = () => {
  const handleSwipeLeft = () => {
    // Get the letter container and make it visible
    const letterContainer = document.getElementById('letterContainer');
    if (letterContainer) {
      letterContainer.classList.remove('opacity-0');
      letterContainer.classList.add('opacity-100');
      letterContainer.classList.remove('pointer-events-none');
      
      // Automatically scroll to the letter panel
      const firstChild = letterContainer.children[0] as HTMLElement;
      if (firstChild) {
        firstChild.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Scroll to the next panel after a short delay
      setTimeout(() => {
        const secondChild = letterContainer.children[1] as HTMLElement;
        if (secondChild) {
          secondChild.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  // Add swipe detection
  useEffect(() => {
    const container = document.querySelector('.scrollable-content-container');
    if (!container) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipeGesture();
    };
    
    const handleSwipeGesture = () => {
      // Detect left swipe (start - end > 0 means swipe left)
      if (touchStartX - touchEndX > 50) {
        handleSwipeLeft();
      }
    };
    
    // Add keyboard support for testing
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleSwipeLeft();
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Set up intersection observer to activate swipe feature when scrolled to
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Content is fully visible, make sure animations are running
        const container = document.querySelector('.scrollable-content-container');
        if (container) {
          container.classList.add('active');
        }
      }
    }, { threshold: 0.7 });
    
    const container = document.querySelector('.scrollable-content-container');
    if (container) {
      observer.observe(container);
    }
    
    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  const arrowMotion = {
    animate: {
      x: [0, -20, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 scrollable-content-container">
      <motion.div
        className="max-w-4xl w-full space-y-12 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Swipe Left for a Special Message
          </h2>
          <p className="text-white/80 text-lg md:text-xl">
            A heartfelt letter awaits...
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center items-center space-x-4"
          variants={arrowMotion}
          animate="animate"
          onClick={handleSwipeLeft}
        >
          <ArrowRight className="w-8 h-8 text-white/80" />
          <ArrowRight className="w-8 h-8 text-white/60" />
          <ArrowRight className="w-8 h-8 text-white/40" />
        </motion.div>
      </motion.div>
    </div>
  );
};
