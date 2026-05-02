'use client';

import { useEffect, useRef, useState } from 'react';

type SpaceshipDividerProps = {
  label: string;
};

export function SpaceshipDivider({ label }: SpaceshipDividerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto flex w-full max-w-6xl items-center justify-center py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
      <div className={`space-warp-lane ${isVisible ? 'is-active' : ''}`}>
        <div className="space-warp-stars" />
        <div className="space-ship" aria-hidden="true">
          <div className="ship-core" />
          <div className="ship-wing left" />
          <div className="ship-wing right" />
          <div className="ship-thruster" />
        </div>
      </div>
      <div className="relative z-10 rounded-full border border-primary/40 bg-card/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
        {label}
      </div>
    </div>
  );
}
