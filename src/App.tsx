import React, { useState } from 'react';
import { Countdown } from './components/Countdown';
import { MeltingAnimation } from './components/MeltingAnimation';
import { BirthdayMessage } from './components/BirthdayMessage';
import { ScrollableContent } from './components/ScrollableContent';
import { Letter } from './components/Letter';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentStep, setCurrentStep] = useState<'countdown' | 'melting' | 'content'>('countdown');
  const targetDate = new Date('2024-03-25');

  const handleCountdownComplete = () => {
    setCurrentStep('melting');
  };

  const handleMeltingComplete = () => {
    setCurrentStep('content');
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background stars effect */}
      <div 
        className="fixed inset-0 z-0 before:fixed before:inset-0 before:bg-black before:opacity-50"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Meteor effect */}
      <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 bg-white rounded-full animate-meteor-effect"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'countdown' && (
          <Countdown 
            targetDate={targetDate}
            onComplete={handleCountdownComplete}
          />
        )}

        {currentStep === 'melting' && (
          <MeltingAnimation onComplete={handleMeltingComplete} />
        )}

        {currentStep === 'content' && (
          <motion.div
            className="relative z-20 h-screen w-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="snap-y snap-mandatory h-screen w-screen flex flex-col overflow-y-auto">
              <div className="snap-start w-screen h-screen flex-shrink-0">
                <BirthdayMessage name="[Name]" />
              </div>
              
              <div className="snap-start w-screen h-screen flex-shrink-0">
                <ScrollableContent />
              </div>
            </div>
            
            {/* Horizontal scrolling for the letter */}
            <div className="fixed inset-0 z-30 snap-x snap-mandatory h-screen w-screen flex overflow-x-auto pointer-events-none opacity-0 transition-opacity duration-300" 
                 id="letterContainer">
              <div className="snap-center w-screen h-screen flex-shrink-0">
                {/* Empty first panel */}
              </div>
              <div className="snap-center w-screen h-screen flex-shrink-0 pointer-events-auto">
                <Letter />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;
