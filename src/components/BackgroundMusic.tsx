import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Import the audio file properly
// This assumes you're using a bundler like webpack or Vite that supports importing assets
import audioFile from '../assets/AUD-20250304-WA0005.mp3';

interface BackgroundMusicProps {
  playing: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ playing }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create the audio element directly in the DOM for better browser compatibility
    const audioElement = document.createElement('audio');
    audioElement.id = 'backgroundMusic';
    audioElement.loop = true;
    audioElement.volume = 0.4;
    
    // Add the audio element to the DOM
    document.body.appendChild(audioElement);
    
    // Create a source element
    const sourceElement = document.createElement('source');
    sourceElement.src = '/AUD-20250304-WA0005.mp3'; // Place the file in the public folder
    sourceElement.type = 'audio/mpeg';
    
    // Append source to audio
    audioElement.appendChild(sourceElement);
    
    // Set the ref
    audioRef.current = audioElement;
    
    // Clean up
    return () => {
      if (audioElement) {
        audioElement.pause();
        document.body.removeChild(audioElement);
      }
    };
  }, []);

  // Handle play/pause based on the playing prop
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleUserInteraction = () => {
      if (playing && audioRef.current && !isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error('Error playing audio:', error);
            });
        }
      }
      
      // Remove event listeners after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    // Pause logic still works outside of user interaction
    if (!playing && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [playing, isPlaying]);
  
  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
          });
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
      <button 
        onClick={togglePlay}
        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <span className="w-6 h-6 flex items-center justify-center">❚❚</span>
        ) : (
          <span className="w-6 h-6 flex items-center justify-center">▶</span>
        )}
      </button>
      
      <button 
        onClick={toggleMute}
        className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};
