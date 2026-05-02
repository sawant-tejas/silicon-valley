'use client';

import Link from 'next/link';
import { Compass, Map, Search, LayoutDashboard } from 'lucide-react';
import { useEffect, useState } from 'react';

export function BottomNav() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure it animates in after load
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-1/2 z-50 transition-all duration-700 ease-out floating-bottom-nav ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <nav className="bg-white/30 dark:bg-black/40 backdrop-blur-md border border-primary/50 shadow-[0_0_20px_rgba(0,229,255,0.2),inset_0_0_15px_rgba(218,16,12,0.2)] rounded-full px-6 py-3 flex items-center gap-6 sm:gap-10">
        <Link href="/explore" className="flex flex-col items-center gap-1.5 group text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
          <Compass className="w-5 h-5 group-hover:text-primary group-hover:-translate-y-1 transition-all duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Explore</span>
          <div className="absolute -bottom-2 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
        </Link>
        <Link href="/map" className="flex flex-col items-center gap-1.5 group text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
          <Map className="w-5 h-5 group-hover:text-primary group-hover:-translate-y-1 transition-all duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Map</span>
          <div className="absolute -bottom-2 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
        </Link>
        <Link href="/gap" className="flex flex-col items-center gap-1.5 group text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
          <Search className="w-5 h-5 group-hover:text-primary group-hover:-translate-y-1 transition-all duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Gap Finder</span>
          <div className="absolute -bottom-2 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
        </Link>
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-800" />
        <Link href="/dashboard" className="flex flex-col items-center gap-1.5 group text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors relative">
          <LayoutDashboard className="w-5 h-5 group-hover:text-primary group-hover:-translate-y-1 transition-all duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
          <div className="absolute -bottom-2 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
        </Link>
      </nav>
    </div>
  );
}
