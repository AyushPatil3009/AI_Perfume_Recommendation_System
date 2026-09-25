'use me';
'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export function AmbientFragranceParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 25 floating mist/golden droplets
    const initialParticles: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: Math.random() * 0.2 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y < 0 ? 100 : p.y - p.speedY,
          x: p.x + p.speedX > 100 ? 0 : p.x + p.speedX < 0 ? 100 : p.x + p.speedX,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Ambient Radial Golden Glow Backdrops */}
      <div className="gold-glow-bg absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="gold-glow-bg absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[130px]" />
      <div className="gold-glow-bg absolute -bottom-40 left-1/3 h-[600px] w-[600px] rounded-full bg-yellow-600/10 blur-[150px]" />

      {/* Floating Golden Scent Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_#D4AF37]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            transition: 'top 50ms linear, left 50ms linear',
          }}
        />
      ))}
    </div>
  );
}
