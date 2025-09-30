import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

function mergeClassNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Particle = {
  id: string;
  dx: number;
  dy: number;
  delay: number;
  duration: number;
  size: number;
  hue: number;
};

type ParticleEmitterProps = {
  emissionKey: string | null;
  className?: string;
};

export function ParticleEmitter({ emissionKey, className }: ParticleEmitterProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!emissionKey) {
      return;
    }

    const nextParticles = Array.from({ length: 8 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 8 + Math.random() * 0.6;
      const distance = 26 + Math.random() * 18;
      return {
        id: `${emissionKey}-${index}`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: Math.random() * 80,
        duration: 420 + Math.random() * 180,
        size: 6 + Math.random() * 4,
        hue: 140 + Math.random() * 80,
      } satisfies Particle;
    });

    setParticles(nextParticles);

    const timer = window.setTimeout(() => {
      setParticles([]);
    }, 640);

    return () => {
      window.clearTimeout(timer);
    };
  }, [emissionKey]);

  if (particles.length === 0) {
    return null;
  }

  return (
    <div className={mergeClassNames("eco-particle-layer", className)}>
      {particles.map((particle) => {
        const style: CSSProperties &
          Record<"--eco-particle-dx" | "--eco-particle-dy" | "--eco-particle-hue", string> = {
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          animationDuration: `${particle.duration}ms`,
          animationDelay: `${particle.delay}ms`,
          "--eco-particle-dx": `${particle.dx}px`,
          "--eco-particle-dy": `${particle.dy}px`,
          "--eco-particle-hue": `${particle.hue}`,
        };

        return <span key={particle.id} className="eco-particle" style={style} />;
      })}
    </div>
  );
}
