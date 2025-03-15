import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MeltingAnimationProps {
  onComplete: () => void;
}

export const MeltingAnimation: React.FC<MeltingAnimationProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match container
    const updateCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Parameters for the melting effect
    const droplets: {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      delay: number;
      active: boolean;
      extensionFactor: number; // How much the icicle extends downward
    }[] = [];
    
    // Create droplets across the screen
    const dropletCount = Math.floor(canvas.width / 8); // More droplets for better ice effect
    for (let i = 0; i < dropletCount; i++) {
      droplets.push({
        x: i * (canvas.width / dropletCount) + Math.random() * 10 - 5,
        y: 0,
        width: 4 + Math.random() * 12, // Wider icicles
        height: 0,
        speed: 0.3 + Math.random() * 1.5,
        delay: Math.random() * 1000, // Stagger droplet start times
        active: false,
        extensionFactor: 0.5 + Math.random() * 1.5 // Randomize icicle extension
      });
    }
    
    // Main animation variables
    let startTime = Date.now();
    const meltDuration = 5000; // 5 seconds for main melting
    const drippingDuration = 4000; // 4 additional seconds for dripping
    
    // Draw the initial state (full black screen)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animation loop
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / meltDuration, 1);
      
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the background that's being revealed
      const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      backgroundGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      backgroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate the melting line position - starts from top
      const meltingLineY = canvas.height * progress;
      
      // Draw the remaining ice (black part)
      ctx.fillStyle = 'black';
      ctx.fillRect(0, meltingLineY, canvas.width, canvas.height - meltingLineY);
      
      // Draw the melting edge with icicle-like droplets
      for (const droplet of droplets) {
        // Activate droplet if it's time
        if (!droplet.active && elapsed >= droplet.delay) {
          droplet.active = true;
          droplet.y = meltingLineY - Math.random() * 10; // Start at the melting line
        }
        
        if (droplet.active) {
          // Update droplet position - icicles should extend downward from the melting line
          droplet.y = meltingLineY;
          
          // Calculate how much the icicle extends downward
          const icicleExtension = progress * droplet.extensionFactor * 100;
          
          // Draw the icicle
          ctx.beginPath();
          ctx.moveTo(droplet.x - droplet.width / 2, droplet.y);
          ctx.lineTo(droplet.x + droplet.width / 2, droplet.y);
          ctx.lineTo(droplet.x, droplet.y + icicleExtension);
          ctx.closePath();
          
          // Create a gradient for the icicle for a more ice-like effect
          const icicleGradient = ctx.createLinearGradient(droplet.x, droplet.y, droplet.x, droplet.y + icicleExtension);
          icicleGradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
          icicleGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
          ctx.fillStyle = icicleGradient;
          ctx.fill();
          
          // Add highlights for the ice effect
          ctx.beginPath();
          ctx.moveTo(droplet.x - droplet.width / 4, droplet.y);
          ctx.lineTo(droplet.x + droplet.width / 4, droplet.y);
          ctx.lineTo(droplet.x, droplet.y + icicleExtension / 2);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
          
          // Draw water droplets falling from the icicles
          if (progress > 0.3) {
            const dropletCount = Math.floor(progress * 3);
            
            for (let i = 0; i < dropletCount; i++) {
              const dropletSize = 2 + Math.random() * 3;
              const dropletX = droplet.x + (Math.random() * 10 - 5);
              const dropletY = droplet.y + icicleExtension * (0.5 + i * 0.2) + (Math.random() * 20);
              
              ctx.beginPath();
              ctx.arc(dropletX, dropletY, dropletSize, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 150, 255, 0.4)';
              ctx.fill();
            }
          }
        }
      }
      
      // Continue animation until complete
      if (elapsed < meltDuration + drippingDuration) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Fade out the canvas
        const fadeOutAnimation = () => {
          const fadeOpacity = parseFloat(canvas.style.opacity || '1');
          
          if (fadeOpacity > 0) {
            canvas.style.opacity = (fadeOpacity - 0.05).toString();
            animationRef.current = requestAnimationFrame(fadeOutAnimation);
          } else {
            // Complete animation
            onComplete();
          }
        };
        
        animationRef.current = requestAnimationFrame(fadeOutAnimation);
      }
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-20 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'opacity 0.5s ease-out'
        }} 
      />
    </div>
  );
};
