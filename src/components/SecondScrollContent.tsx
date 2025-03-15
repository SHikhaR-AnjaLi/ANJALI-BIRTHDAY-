import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const SecondScrollContent: React.FC = () => {
  return (
    <motion.div
      className="max-w-4xl w-full space-y-8 text-center"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Swipe Left
      </h2>
      <p className="text-white/80 text-lg md:text-xl">
        A heartfelt letter awaits...
      </p>
      <div className="flex justify-center items-center space-x-4">
        <ArrowLeft className="w-8 h-8 text-white/80" />
        <ArrowLeft className="w-8 h-8 text-white/60" />
        <ArrowLeft className="w-8 h-8 text-white/40" />
      </div>
    </motion.div>
  );
};
