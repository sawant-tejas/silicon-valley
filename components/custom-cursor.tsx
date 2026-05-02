'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');

  // useMotionValue ensures zero-lag, bypassing React state renders completely for position updates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Offset by -16 to align the tip of the diagonal shuttle (top-left) with the actual click point
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    let timeoutId: NodeJS.Timeout;

    // Use wheel event for instant, reliable scroll direction detection (bypassing smooth scroll wrappers)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setScrollDirection('down');
      } else if (e.deltaY < 0) {
        setScrollDirection('up');
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScrollDirection('none');
      }, 150);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(timeoutId);
    };
  }, [cursorX, cursorY]);

  // Don't render on server or touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  // Calculate rotation based on state
  // Native image points RIGHT (0 deg).
  // Normal cursor: top-left = -135
  // Scroll down: straight down = 90
  // Scroll up: straight up = -90
  let rotation = -135;
  if (scrollDirection === 'down') rotation = 90;
  else if (scrollDirection === 'up') rotation = -90;

  return (
    <div className="hidden md:block pointer-events-none z-[99999] fixed inset-0 overflow-hidden">
      {/* Shuttle Icon */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none origin-center"
        style={{ x: cursorX, y: cursorY }}
        animate={{ 
          scale: isHovering ? 1.2 : 1,
          rotate: rotation
        }}
        transition={{ 
          scale: { type: 'spring', damping: 15, stiffness: 300 },
          rotate: { type: 'spring', damping: 20, stiffness: 200 }
        }}
      >
        <img 
          src="https://cdn.jsdelivr.net/gh/rd6260/h2f_26@main/public/rocket.webp" 
          alt="Shuttle Cursor"
          className="w-10 h-10 object-contain"
        />
      </motion.div>
    </div>
  );
}
