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
    
    // Create gradient for melting effect (dark to light)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    
    // Parameters for the melting effect
    const droplets: {
      x: number;
      y: number;
      width: number;
      height: number;
      speed: number;
      delay: number;
      active: boolean;
    }[] = [];
    
    // Create droplets across the screen
    const dropletCount = Math.floor(canvas.width / 10);
    for (let i = 0; i < dropletCount; i++) {
      droplets.push({
        x: i * (canvas.width / dropletCount) + Math.random() * 10 - 5,
        y: 0,
        width: 3 + Math.random() * 8,
        height: 0,
        speed: 0.5 + Math.random() * 2,
        delay: Math.random() * 2000, // Stagger droplet start times
        active: false
      });
    }
    
    // Main animation variables
    let startTime = Date.now();
    const meltDuration = 5000; // 5 seconds for main melting
    const drippingDuration = 3000; // 3 additional seconds for dripping
    
    // Draw the initial state (full black screen)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Animation loop
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / meltDuration, 1);
      
      // Main melting effect
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the background that's being revealed
      const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      backgroundGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
      backgroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the melting black curtain
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height * (1 - progress));
      
      // Draw the melting edge with icicle-like droplets
      for (const droplet of droplets) {
        // Activate droplet if it's time
        if (!droplet.active && elapsed >= droplet.delay) {
          droplet.active = true;
        }
        
        if (droplet.active) {
          // Update droplet position and size
          const dropletProgress = Math.max(0, (elapsed - droplet.delay) / meltDuration);
          
          // Base height of the droplet (controlled by main melting progress)
          const baseY = canvas.height * (1 - progress);
          
          // Dripping effect
          if (progress < 1) {
            // During main melting, create dripping effect
            droplet.height = Math.min(
              droplet.height + (droplet.speed * dropletProgress),
              50 + Math.random() * 50
            );
          } else {
            // After main melting, continue dripping until complete
            const drippingProgress = Math.min((elapsed - meltDuration) / drippingDuration, 1);
            droplet.y += droplet.speed * (1 + drippingProgress);
            
            // Gradually reduce droplet height as it falls
            droplet.height = Math.max(0, droplet.height - (droplet.speed * 0.1));
          }
          
          // Draw droplet
          ctx.beginPath();
          ctx.moveTo(droplet.x - droplet.width / 2, baseY);
          ctx.lineTo(droplet.x + droplet.width / 2, baseY);
          ctx.lineTo(droplet.x, baseY + droplet.height);
          ctx.closePath();
          ctx.fillStyle = 'black';
          ctx.fill();
          
          // Draw highlight on droplet for ice effect
          ctx.beginPath();
          ctx.moveTo(droplet.x - droplet.width / 4, baseY);
          ctx.lineTo(droplet.x + droplet.width / 4, baseY);
          ctx.lineTo(droplet.x, baseY + droplet.height / 2);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
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
