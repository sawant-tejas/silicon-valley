'use client';

import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { FeatureCards } from '@/components/feature-cards';
import { HowItWorks } from '@/components/how-it-works';
import { Footer } from '@/components/footer';
import { RevealSection } from '@/components/effects/reveal-section';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="crt-overlay" />
      <div className="pointer-events-none fixed inset-0 cyber-grid opacity-30 z-0" />
      
      {/* Background glow effects */}
      <div className="pointer-events-none fixed left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[150px] z-0" />
      <div className="pointer-events-none fixed right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary/10 blur-[120px] z-0" />
      
      <div className="relative z-10">
        <Navbar />
        <RevealSection>
          <Hero />
        </RevealSection>
        <div className="py-24">
          <RevealSection>
            <FeatureCards />
          </RevealSection>
        </div>
        <div className="py-24 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-y border-black/5 dark:border-white/5">
          <RevealSection>
            <HowItWorks />
          </RevealSection>
        </div>
        <RevealSection>
          <Footer />
        </RevealSection>
      </div>
    </main>
  );
}
