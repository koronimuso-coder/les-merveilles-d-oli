import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const SauceReveal = ({ trigger, onComplete, sauceColor = 'var(--color-terracotta)' }) => {
  const { animationsEnabled } = useApp();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setAnimating(true);
      
      const duration = animationsEnabled ? 1200 : 400;
      const timer = setTimeout(() => {
        setAnimating(false);
        if (onComplete) onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, animationsEnabled, onComplete]);

  if (!animating) return null;

  // Simple fade transition if animations are disabled (Reduced Motion)
  if (!animationsEnabled) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: sauceColor,
        zIndex: 9999,
        animation: 'simple-fade 0.4s ease-in-out forwards'
      }}>
        <style>{`
          @keyframes simple-fade {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="sauce-reveal-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {/* Organic blob/sauce shape moving left to right */}
      <div 
        style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-150%',
          backgroundColor: sauceColor,
          borderRadius: '40% 60% 50% 50% / 40% 40% 60% 60%',
          animation: 'sauce-flow 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 100px rgba(0,0,0,0.2)'
        }}
      />
      <style>{`
        @keyframes sauce-flow {
          0% {
            left: -150%;
            transform: rotate(0deg) scale(0.8);
          }
          50% {
            left: -10%;
            transform: rotate(180deg) scale(1.2);
            border-radius: 30% 70% 40% 60% / 50% 30% 70% 50%;
          }
          100% {
            left: 150%;
            transform: rotate(360deg) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default SauceReveal;
