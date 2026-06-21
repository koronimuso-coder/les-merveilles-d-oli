import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const CustomCursor = () => {
  const { animationsEnabled } = useApp();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hoverType, setHoverType] = useState(''); // '', 'hovered', 'drag', 'add', 'view'
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on mobile, tablet or if reduced motion is on
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch || !animationsEnabled) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Find nearest parent with data-cursor attribute
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setHoverType(target.getAttribute('data-cursor') || 'hovered');
      } else {
        setHoverType('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [animationsEnabled]);

  if (!visible) return null;

  // Custom text based on hoverType
  let cursorText = '';
  if (hoverType === 'view') cursorText = 'Voir';
  if (hoverType === 'drag') cursorText = 'Glisser';
  if (hoverType === 'add') cursorText = 'Ajouter';
  if (hoverType === 'order') cursorText = 'Commander';
  if (hoverType === 'hovered') cursorText = '';

  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor ${hoverType ? 'hovered' : ''} ${hoverType === 'drag' ? 'drag' : ''}`} 
      style={style}
    >
      {cursorText && (
        <span style={{
          position: 'absolute',
          color: 'var(--color-ivory)',
          fontSize: '0.65rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}>
          {cursorText}
        </span>
      )}
    </div>
  );
};

export default CustomCursor;
