'use client';

import { useEffect, useRef, useState } from 'react';

type MotionDirection = 'left' | 'right' | 'up';

type ScrollMotionProps = {
  children: React.ReactNode;
  className?: string;
  direction?: MotionDirection;
  delayMs?: number;
  floatOnVisible?: boolean;
};

const hiddenClassByDirection: Record<MotionDirection, string> = {
  left: '-translate-x-14',
  right: 'translate-x-14',
  up: 'translate-y-10',
};

export function ScrollMotion({
  children,
  className = '',
  direction = 'up',
  delayMs = 0,
  floatOnVisible = false,
}: ScrollMotionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={[
        'transition-all duration-700 will-change-transform',
        isVisible ? 'translate-x-0 translate-y-0 opacity-100' : `${hiddenClassByDirection[direction]} opacity-0`,
        isVisible && floatOnVisible ? 'float-3d' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
