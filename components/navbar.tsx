'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Sun, Moon, Volume2, VolumeX, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

type SessionUser = {
  id: string;
  username: string;
  email: string;
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSfxEnabled, setIsSfxEnabled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDarkMode = theme === 'dark' || resolvedTheme === 'dark';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    try {
      setIsSfxEnabled(localStorage.getItem('researchmap-sfx') === 'on');
    } catch {
      setIsSfxEnabled(false);
    }
  }, []);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        const payload = await response.json();
        setUser(payload?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsMobileMenuOpen(false);
      router.push('/auth/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSfx = () => {
    const next = !isSfxEnabled;
    setIsSfxEnabled(next);
    try {
      localStorage.setItem('researchmap-sfx', next ? 'on' : 'off');
    } catch {
      // no-op for restricted storage environments
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-6xl rounded-full border-2 border-transparent ${
        isScrolled
          ? 'bg-white dark:bg-black/80 backdrop-blur-md border-primary/50 shadow-[0_4px_30px_rgba(218,16,12,0.2)]'
          : 'bg-white dark:bg-black/40 backdrop-blur-sm hover:bg-white dark:bg-black/60'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(218,16,12,0.5)]">
            <Brain className="w-5 h-5 text-black dark:text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:inline text-black dark:text-white tracking-widest uppercase">ResearchMap</span>
        </div>

        {/* Desktop Nav Links (Moved to Bottom Nav) */}
        <div className="hidden md:flex items-center gap-8">
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            disabled={!isMounted}
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-2 hover:border-secondary transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-black dark:text-white" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-black dark:text-white" />
            )}
          </button>
          <button
            onClick={toggleSfx}
            disabled={!isMounted}
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-2 hover:border-secondary transition-colors"
            aria-label="Toggle sound effects mode"
          >
            {isSfxEnabled ? (
              <Volume2 className="w-4 h-4 text-secondary" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-500" />
            )}
          </button>
          {!isAuthLoading && user ? (
            <>
              <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:text-white transition-colors">
                Dashboard
              </Link>
              <Button onClick={handleLogout} disabled={isLoggingOut} className="rounded-none border-2 border-primary bg-transparent hover:bg-primary text-black dark:text-white uppercase tracking-wider font-bold text-xs h-9 px-4 transition-colors">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:text-white transition-colors">
                Login
              </Link>
              <Link href="/auth/register">
                <Button className="rounded-none border-2 border-primary bg-primary hover:bg-transparent text-black dark:text-white uppercase tracking-wider font-bold text-xs h-9 px-6 transition-colors">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            disabled={!isMounted}
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-2 hover:border-secondary transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={toggleSfx}
            disabled={!isMounted}
            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black p-2 hover:border-secondary transition-colors"
          >
            {isSfxEnabled ? (
              <Volume2 className="w-4 h-4 text-secondary" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500 dark:text-gray-500" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-black dark:text-white hover:bg-white/10 transition"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black/95 backdrop-blur-xl border border-primary/30 rounded-2xl py-4 px-4 shadow-[0_10px_40px_rgba(218,16,12,0.3)]">
          <div className="flex flex-col gap-4">
            {!isAuthLoading && user ? (
              <>
                <Link href="/dashboard" className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:text-white transition-colors">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-left text-sm font-bold uppercase tracking-widest text-primary hover:text-red-400 transition-colors disabled:opacity-60"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:text-black dark:text-white transition-colors">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full rounded-none border-2 border-primary bg-primary text-black dark:text-white uppercase tracking-wider font-bold">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
