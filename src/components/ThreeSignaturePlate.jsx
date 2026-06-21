import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

const ThreeSignaturePlate = () => {
  const { performanceProfile, animationsEnabled } = useApp();
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check if WebGL is supported
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    // If device is in light mode, or WebGL is not supported, or animations are disabled, don't run canvas
    if (performanceProfile === 'light' || !animationsEnabled || !webglSupported) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    // Mouse coords
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) - width / 2;
      mouse.targetY = (e.clientY - rect.top) - height / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle representation of spices
    const particles = [];
    const particleCount = performanceProfile === 'high' ? 80 : 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: 80 + Math.random() * 120,
        speed: 0.005 + Math.random() * 0.01,
        size: 1 + Math.random() * 3,
        color: ['#D4AF37', '#C85C32', '#F4C430'][Math.floor(Math.random() * 3)],
        z: Math.random() * 100 - 50,
        zSpeed: (Math.random() - 0.5) * 0.5
      });
    }

    let rotationAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (magnetic effect)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const centerX = width / 2 + mouse.x * 0.15;
      const centerY = height / 2 + mouse.y * 0.15;

      // Draw shadow
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 80, 110, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(28, 17, 11, 0.25)';
      ctx.fill();

      // Draw outer plate
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
      ctx.fillStyle = '#2C1A11';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      ctx.fill();
      ctx.stroke();
      
      // Reset shadows
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Draw inner plate (pattern border)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 105, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 15]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw base of the meal (Ndolé center)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
      ctx.fillStyle = '#1E2F23'; // Forest Green Ndolé
      ctx.fill();

      // Prawn details (crescent shapes in bordeaux and terracotta)
      rotationAngle += 0.003;
      for (let i = 0; i < 4; i++) {
        const shrimpAngle = rotationAngle + (i * Math.PI / 2);
        const sx = centerX + Math.cos(shrimpAngle) * 45;
        const sy = centerY + Math.sin(shrimpAngle) * 45;
        
        ctx.beginPath();
        ctx.arc(sx, sy, 12, shrimpAngle - Math.PI / 3, shrimpAngle + Math.PI / 3, false);
        ctx.strokeStyle = '#C85C32';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Draw floating spices/particles
      particles.forEach(p => {
        p.angle += p.speed;
        p.z += p.zSpeed;
        if (p.z > 50 || p.z < -50) p.zSpeed = -p.zSpeed;

        // Apply 3D perspective based on z depth and mouse coords
        const perspective = 300 / (300 + p.z);
        const px = centerX + Math.cos(p.angle) * p.distance * perspective + (mouse.x * 0.05 * (p.z / 50));
        const py = centerY + Math.sin(p.angle) * p.distance * perspective + (mouse.y * 0.05 * (p.z / 50));
        
        ctx.beginPath();
        ctx.arc(px, py, p.size * perspective, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.2, Math.min(1, perspective));
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Draw steam / vapor waves (sine waves)
      const time = Date.now() * 0.001;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      
      for (let i = -1; i <= 1; i++) {
        const steamX = centerX + i * 20;
        ctx.moveTo(steamX, centerY - 20);
        ctx.bezierCurveTo(
          steamX - Math.sin(time + i) * 10, centerY - 50,
          steamX + Math.sin(time - i) * 10, centerY - 80,
          steamX, centerY - 110
        );
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.width = canvasRef.current.offsetWidth;
        height = canvasRef.current.height = canvasRef.current.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [performanceProfile, animationsEnabled, webglSupported]);

  // Fallback image container if canvas shouldn't run
  const useFallback = performanceProfile === 'light' || !animationsEnabled || !webglSupported;

  return (
    <div style={{
      width: '100%',
      height: '450px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {useFallback ? (
        <div style={{
          position: 'relative',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          boxShadow: '0 20px 45px rgba(44, 26, 17, 0.15)',
          overflow: 'hidden',
          border: '6px solid var(--color-cacao)',
          outline: '2px solid var(--color-gold)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80" 
            alt="Ndolé Camerounais Premium" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Subtle overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(44,26,11,0.8), transparent)',
            padding: '1rem',
            textAlign: 'center',
            color: 'var(--color-ivory)',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            NDOLÉ ROYAL DES MERVEILLES
          </div>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};

export default ThreeSignaturePlate;
