'use client';

import { useEffect, useRef, useState } from 'react';

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function RevealSection({ children, className = '' }: RevealSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'} ${className}`}
    >
      {children}
    </section>
  );
}
