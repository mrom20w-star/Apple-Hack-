import { useMemo } from 'react';

interface ParticleSpec {
  left: number;
  duration: number;
  delay: number;
  size: number;
}

export function AmbientParticles() {
  const particles = useMemo<ParticleSpec[]>(
    () =>
      Array.from({ length: 12 }, (_, idx) => ({
        left: (idx * 37 + 11) % 100,
        duration: 14 + (idx % 5) * 2,
        delay: (idx % 4) * 2,
        size: 1 + (idx % 3),
      })),
    []
  );

  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
