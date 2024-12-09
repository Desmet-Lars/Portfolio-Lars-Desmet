'use client';
import { useEffect, useRef, useState } from 'react';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import Terminal from './Terminal';
import TerminalButton from './TerminalButton';

export default function FluidSimulation() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: null, y: null });
  const lastMousePos = useRef({ x: null, y: null });
  const colorPulse = useRef(0);
  const waveRef = useRef({ x: 0, y: 0, radius: 0, active: false });
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [particleColors, setParticleColors] = useState({
    r: 74,
    g: 144,
    b: 226,
    mode: 'normal'
  });

  const handleColorChange = (r, g, b, preserveColor = false) => {
    if (r === -1 && g === -1 && b === -1) {
      // Rainbow - keep normal mode but set a flag for rainbow colors
      setParticleColors(prev => ({
        ...prev,
        mode: 'normal',
        effect: 'rainbow'
      }));
    } else if (r === -2 && g === -2 && b === -2) {
      // Neon - keep normal mode but set a flag for neon effect
      setParticleColors(prev => ({
        ...prev,
        mode: 'normal',
        effect: 'neon'
      }));
    } else if (r === -3 && g === -3 && b === -3) {
      // Fire - keep normal mode but set a flag for fire colors
      setParticleColors(prev => ({
        ...prev,
        mode: 'normal',
        effect: 'fire'
      }));
    } else if (r === -4 && g === -4 && b === -4) {
      // Disco - keep normal mode but set a flag for disco colors
      setParticleColors(prev => ({
        ...prev,
        mode: 'normal',
        effect: 'disco'
      }));
    } else if (r === -10 && g === -10 && b === -10) {
      setParticleColors(prev => ({ ...prev, mode: 'vortex', effect: 'none' }));
    } else if (r === -30 && g === -30 && b === -30) {
      setParticleColors(prev => ({ ...prev, mode: 'gravity', effect: 'none' }));
    } else if (r === -40 && g === -40 && b === -40) {
      setParticleColors(prev => ({ ...prev, mode: 'chaos', effect: 'none' }));
    } else {
      // Direct color change - normal mode with no special effect
      setParticleColors({
        r: r,
        g: g,
        b: b,
        mode: 'normal',
        effect: 'none'
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const particleCount = Math.min(2000, Math.floor((canvas.width * canvas.height) / 4500));
      particles.current = new Array(particleCount).fill().map(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        return {
          x,
          y,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.5 + 1,
          baseX: x,
          baseY: y
        };
      });
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      lastMousePos.current = { ...mousePos.current };
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: null, y: null };
      lastMousePos.current = { x: null, y: null };
    };

    const animate = () => {
      colorPulse.current = (colorPulse.current + 0.005) % 1;
      const colorFactor = Math.sin(colorPulse.current * Math.PI * 2) * 0.5 + 0.5;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const particle of particles.current) {
        // Handle color effects while maintaining normal behavior
        if (particleColors.effect === 'rainbow') {
          const hue = (colorPulse.current * 360 + particle.x * 0.1) % 360;
          const [r, g, b] = hslToRgb(hue / 360, 0.7, 0.5);
          particle.color = { r, g, b };
        } else if (particleColors.effect === 'neon') {
          const brightness = Math.sin(colorPulse.current * Math.PI * 2) * 0.3 + 0.7;
          particle.color = {
            r: particleColors.r * brightness,
            g: particleColors.g * brightness,
            b: particleColors.b * brightness
          };
        } else if (particleColors.effect === 'fire') {
          const flicker = Math.random() * 0.3 + 0.7;
          particle.color = {
            r: 255 * flicker,
            g: (100 + Math.random() * 50) * flicker,
            b: 0
          };
        } else if (particleColors.effect === 'disco') {
          if (Math.random() < 0.05) {
            const hue = Math.random();
            const [r, g, b] = hslToRgb(hue, 1, 0.5);
            particle.color = { r, g, b };
          }
        } else {
          particle.color = null; // Use default colors
        }

        // Handle particle behavior based on mode
        if (particleColors.mode === 'vortex' && mousePos.current.x !== null) {
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 400) {
            const angle = Math.atan2(dy, dx);
            // Stronger force when closer to center
            const force = 2 * Math.pow(1 - dist/400, 2);  // Quadratic falloff for stronger center pull
            const tangentialForce = force * 2;  // Increased for faster spinning
            // Add inward pull that gets stronger closer to center
            const pullStrength = 1 * (1 - dist/400);
            particle.vx += (Math.cos(angle + Math.PI/2) * tangentialForce + dx * pullStrength) * (1 - dist/400);
            particle.vy += (Math.sin(angle + Math.PI/2) * tangentialForce + dy * pullStrength) * (1 - dist/400);
          }
        } else if (particleColors.mode === 'gravity') {
          if (mousePos.current.x !== null) {
            const dx = mousePos.current.x - particle.x;
            const dy = mousePos.current.y - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 300 / dist;
            particle.vx += (dx / dist) * force * 0.15;
            particle.vy += (dy / dist) * force * 0.15;
          }
          particle.vy += 0.2;
        } else if (particleColors.mode === 'chaos') {
          particle.vx += (Math.random() - 0.5) * 2;
          particle.vy += (Math.random() - 0.5) * 2;
          if (Math.random() < 0.01) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 10;
            particle.vx += Math.cos(angle) * force;
            particle.vy += Math.sin(angle) * force;
          }
        } else if (mousePos.current.x !== null) {
          // Normal mouse repulsion - only in normal mode
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 40000) {
            const dist = Math.sqrt(distSq);
            const force = (200 - dist) / 200;
            const maxForce = 1;
            particle.vx -= Math.max(-maxForce, Math.min(maxForce, (dx / dist) * force));
            particle.vy -= Math.max(-maxForce, Math.min(maxForce, (dy / dist) * force));
          }
        }

        // Natural movement for all modes
        const randomForce = particleColors.mode === 'chaos' ? 0.5 : 0.05;
        particle.vx += (Math.random() - 0.5) * randomForce;
        particle.vy += (Math.random() - 0.5) * randomForce;

        // Return force
        const returnStrength =
          particleColors.mode === 'gravity' ? 0.01 :
          particleColors.mode === 'chaos' ? 0.001 :
          0.05;

        const dx = particle.baseX - particle.x;
        const dy = particle.baseY - particle.y;
        particle.vx += dx * returnStrength;
        particle.vy += dy * returnStrength;

        // Speed limits
        const maxSpeed =
          particleColors.mode === 'chaos' ? 15 :
          particleColors.mode === 'gravity' ? 10 :
          particleColors.mode === 'vortex' ? 15 :  // Increased max speed for vortex
          3;

        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (currentSpeed > maxSpeed) {
          const scale = maxSpeed / currentSpeed;
          particle.vx *= scale;
          particle.vy *= scale;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Apply friction
        const friction =
          particleColors.mode === 'gravity' ? 0.98 :
          particleColors.mode === 'chaos' ? 0.95 :
          particleColors.mode === 'vortex' ? 0.99 :  // Higher value means less friction
          0.92;

        particle.vx *= friction;
        particle.vy *= friction;

        // Draw connections
        let connections = 0;
        for (const other of particles.current) {
          if (other === particle || connections >= 5) continue;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 40000) {
            connections++;
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / 200) * 0.5;

            const color = particle.color || particleColors;
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
            ctx.lineWidth = Math.max(0.2, (1 - dist / 200));
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw particle
        const baseSize = 2;
        let particleSize = baseSize;

        const color = particle.color || particleColors;
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', setCanvasSize);

    setCanvasSize();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColors]);

  // Helper function for rainbow mode
  const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full bg-black"
      />
      <div className="relative z-10">
        <Terminal
          isOpen={isTerminalOpen}
          setIsOpen={setIsTerminalOpen}
          onColorChange={handleColorChange}
        />
        <TerminalButton onClick={() => setIsTerminalOpen(true)} />
        <Hero />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
