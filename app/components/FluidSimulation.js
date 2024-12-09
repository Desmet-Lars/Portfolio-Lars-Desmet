'use client';
import { useEffect, useRef } from 'react';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

export default function FluidSimulation() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mousePos = useRef({ x: null, y: null });
  const lastMousePos = useRef({ x: null, y: null });
  const colorPulse = useRef(0);
  const waveRef = useRef({ x: 0, y: 0, radius: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;

    // Pre-calculate values
    const TWO_PI = Math.PI * 2;
    const CONNECTION_DISTANCE_SQ = 200 * 200;
    const MOUSE_INFLUENCE_DISTANCE_SQ = 200 * 200;

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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', setCanvasSize, { passive: true });

    setCanvasSize();

    // Add pulse wave function
    const triggerPulseWave = (x, y) => {
      waveRef.current = {
        x,
        y,
        radius: 0,
        active: true,
        startTime: Date.now()
      };
    };

    // Add double click handler for pulse wave
    const handleDoubleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      triggerPulseWave(
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    };

    canvas.addEventListener('dblclick', handleDoubleClick);

    const animate = () => {
      // Update color pulse
      colorPulse.current = (colorPulse.current + 0.005) % TWO_PI;
      const colorFactor = Math.sin(colorPulse.current) * 0.2 + 0.8;

      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update pulse wave
      if (waveRef.current.active) {
        const elapsed = Date.now() - waveRef.current.startTime;
        const duration = 2000; // 2 seconds for the wave to complete
        const progress = elapsed / duration;

        if (progress < 1) {
          waveRef.current.radius = Math.min(
            Math.max(canvas.width, canvas.height),
            progress * 1000
          );
        } else {
          waveRef.current.active = false;
        }
      }

      // Get hero section elements for repulsion
      const heroSection = document.querySelector('section');
      const heroElements = heroSection ? [
        ...Array.from(heroSection.getElementsByTagName('h1')),
        ...Array.from(heroSection.getElementsByTagName('p')),
        ...Array.from(heroSection.getElementsByTagName('button'))
      ] : [];

      // Calculate repulsion zones
      const repulsionZones = heroElements.map(element => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left - 30,
          right: rect.right + 30,
          top: rect.top - 30,
          bottom: rect.bottom + 30,
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height
        };
      });

      // Draw all connections
      const allParticles = particles.current;
      const len = allParticles.length;

      // Base color values
      const baseR = 74;
      const baseG = 144;
      const baseB = 226;

      for (let i = 0; i < len; i++) {
        const particle = allParticles[i];
        let connections = 0;

        // Apply wave effect if active
        if (waveRef.current.active) {
          const dx = particle.x - waveRef.current.x;
          const dy = particle.y - waveRef.current.y;
          const distToWave = Math.sqrt(dx * dx + dy * dy);
          const waveEffect = Math.abs(distToWave - waveRef.current.radius);

          if (waveEffect < 50) {
            const force = (1 - waveEffect / 50) * 2;
            const angle = Math.atan2(dy, dx);
            particle.vx += Math.cos(angle) * force;
            particle.vy += Math.sin(angle) * force;

            // Add extra glow to particles in wave
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, TWO_PI);
            ctx.fillStyle = `rgba(74, 144, 226, ${0.2 * (1 - waveEffect / 50)})`;
            ctx.fill();
          }
        }

        // Check repulsion for each zone
        for (const zone of repulsionZones) {
          const px = particle.x;
          const py = particle.y;

          if (px >= zone.left && px <= zone.right &&
              py >= zone.top && py <= zone.bottom) {
            const dx = px - zone.centerX;
            const dy = py - zone.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate repulsion strength based on distance from center
            const maxDimension = Math.max(zone.width, zone.height);
            const normalizedDistance = distance / maxDimension;
            const repulsionStrength = Math.min(2, 1.5 * (1 - normalizedDistance));

            // Apply repulsion with normalized direction
            const normalizedDx = dx / (distance || 1);
            const normalizedDy = dy / (distance || 1);

            // Apply capped velocity changes
            const maxVelocityChange = 1.5;
            const vx = normalizedDx * repulsionStrength;
            const vy = normalizedDy * repulsionStrength;

            particle.vx += Math.max(-maxVelocityChange, Math.min(maxVelocityChange, vx));
            particle.vy += Math.max(-maxVelocityChange, Math.min(maxVelocityChange, vy));

            // Add minimal turbulence
            particle.vx += (Math.random() - 0.5) * 0.1;
            particle.vy += (Math.random() - 0.5) * 0.1;
          }
        }

        // Draw connections
        for (let j = i + 1; j < len && connections < 5; j++) {
          const other = allParticles[j];
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DISTANCE_SQ) {
            connections++;
            const dist = Math.sqrt(distSq);

            // Calculate pulsing color
            const r = Math.floor(baseR * colorFactor);
            const g = Math.floor(baseG * colorFactor);
            const b = Math.floor(baseB * colorFactor);

            const alpha = (1 - dist / 200) * 0.7;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

            const lineWidth = Math.max(0.4, (1 - dist / 200) * 1.5);
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Add elastic force with capped strength
            const elasticForce = Math.min(0.0003, (dist - 150) * 0.0003);
            const dirX = dx / dist;
            const dirY = dy / dist;

            const maxElasticChange = 0.5;
            const elasticVx = dirX * elasticForce;
            const elasticVy = dirY * elasticForce;

            particle.vx += Math.max(-maxElasticChange, Math.min(maxElasticChange, elasticVx));
            particle.vy += Math.max(-maxElasticChange, Math.min(maxElasticChange, elasticVy));
            other.vx -= Math.max(-maxElasticChange, Math.min(maxElasticChange, elasticVx));
            other.vy -= Math.max(-maxElasticChange, Math.min(maxElasticChange, elasticVy));
          }
        }

        // Update particle position with velocity capping
        if (mousePos.current.x !== null) {
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < MOUSE_INFLUENCE_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq);
            const force = (200 - dist) / 200;
            const maxMouseForce = 1;
            particle.vx -= Math.max(-maxMouseForce, Math.min(maxMouseForce, (dx / dist) * force));
            particle.vy -= Math.max(-maxMouseForce, Math.min(maxMouseForce, (dy / dist) * force));
          }
        }

        // Natural movement with reduced randomness
        particle.vx += (Math.random() - 0.5) * 0.05;
        particle.vy += (Math.random() - 0.5) * 0.05;

        // Return to base with gentle force
        const dx = particle.baseX - particle.x;
        const dy = particle.baseY - particle.y;
        particle.vx += dx * 0.01;
        particle.vy += dy * 0.01;

        // Apply velocity with maximum speed limit
        const maxSpeed = 3;
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (currentSpeed > maxSpeed) {
          const scale = maxSpeed / currentSpeed;
          particle.vx *= scale;
          particle.vy *= scale;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Increased friction for more stability
        particle.vx *= 0.92;
        particle.vy *= 0.92;

        // Boundary checking
        if (particle.x < 0) { particle.x = 0; particle.vx *= -0.5; }
        else if (particle.x > canvas.width) { particle.x = canvas.width; particle.vx *= -0.5; }
        if (particle.y < 0) { particle.y = 0; particle.vy *= -0.5; }
        else if (particle.y > canvas.height) { particle.y = canvas.height; particle.vy *= -0.5; }

        // Draw particle with wave-affected color
        let particleR = Math.floor(baseR * colorFactor);
        let particleG = Math.floor(baseG * colorFactor);
        let particleB = Math.floor(baseB * colorFactor);

        // Enhance particle color if in wave
        if (waveRef.current.active) {
          const dx = particle.x - waveRef.current.x;
          const dy = particle.y - waveRef.current.y;
          const distToWave = Math.sqrt(dx * dx + dy * dy);
          const waveEffect = Math.abs(distToWave - waveRef.current.radius);

          if (waveEffect < 50) {
            const intensity = 1 - waveEffect / 50;
            particleR = Math.min(255, particleR + Math.floor(100 * intensity));
            particleG = Math.min(255, particleG + Math.floor(100 * intensity));
            particleB = Math.min(255, particleB + Math.floor(50 * intensity));
          }
        }

        ctx.fillStyle = `rgb(${particleR}, ${particleG}, ${particleB})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, TWO_PI);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('dblclick', handleDoubleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full bg-black"
      />
      <div className="relative z-10">
        <Hero />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
