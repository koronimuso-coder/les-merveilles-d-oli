import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const MagneticButton = ({ children, className = '', onClick, type = 'button', disabled = false, dataCursor = '' }) => {
  const { animationsEnabled } = useApp();
  const buttonRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!animationsEnabled) return;

    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      // Calculate distance from cursor to button center
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // If cursor is within 80px radius, pull button slightly
      if (distance < 80) {
        const pullFactor = 0.25; // 25% pull
        setTransform({
          x: distanceX * pullFactor,
          y: distanceY * pullFactor
        });
      } else {
        setTransform({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setTransform({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (button) button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animationsEnabled]);

  const style = animationsEnabled ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    transition: transform.x === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
  } : {};

  return (
    <button
      ref={buttonRef}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
      data-cursor={dataCursor}
    >
      {children}
    </button>
  );
};

export default MagneticButton;
