'use client';

import { Card } from '@/components/ui/card';
import { Search, Brain, Zap, Gamepad2, ArrowRight } from 'lucide-react';
import { TiltCard } from '@/components/effects/tilt-card';
import { ScrollMotion } from '@/components/effects/scroll-motion';

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Search',
    description: 'Enter your research topic or keyword to start exploring the research landscape.',
  },
  {
    number: 2,
    icon: Brain,
    title: 'Analyze',
    description: 'Our AI identifies patterns, gaps, and emerging trends in the research community.',
  },
  {
    number: 3,
    icon: Zap,
    title: 'Discover',
    description: 'Find opportunities to contribute to your field and access the papers that matter.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-none border-2 border-primary bg-white dark:bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black dark:text-white shadow-[4px_4px_0_0_#da100c]">
            <Gamepad2 className="h-4 w-4 text-secondary" />
            Game Loop
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">
            Mission Flow
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Scan, synthesize, and ship insights in a loop designed like a strategy game.
          </p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-4 items-stretch justify-between max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const direction = index === 1 ? 'up' : index % 2 === 0 ? 'left' : 'right';
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                {/* Step Card */}
                <div className="relative w-full mb-6">
                  <ScrollMotion direction={direction} delayMs={index * 140} floatOnVisible>
                    <TiltCard>
                      <Card className="rounded-none border-2 border-primary bg-white dark:bg-black/90 p-8 h-full hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#00e5ff] transition-all duration-300 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-secondary/20 transform rotate-45 translate-x-4 -translate-y-4 group-hover:bg-secondary transition-colors" />
                        
                        {/* Number Circle */}
                        <div className="w-16 h-16 rounded-none border-2 border-secondary bg-white dark:bg-black flex items-center justify-center mx-auto mb-6 shadow-[inset_0_0_15px_rgba(0,229,255,0.2)] group-hover:bg-secondary/10 transition-colors">
                          <span className="text-black dark:text-white font-black text-2xl">{step.number}</span>
                        </div>

                        {/* Icon */}
                        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6">
                          <Icon className="w-10 h-10 text-primary group-hover:animate-pulse" />
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-black text-black dark:text-white text-center mb-3 uppercase tracking-wider group-hover:text-secondary transition-colors">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 text-center font-medium leading-relaxed">
                          {step.description}
                        </p>
                      </Card>
                    </TiltCard>
                  </ScrollMotion>
                </div>

                {/* Connector Arrow - Only show on desktop and not for last item */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex h-12 items-center justify-center absolute left-1/2 transform translate-x-1/2 -bottom-14 z-0">
                    <svg
                      className="w-10 h-10 text-primary opacity-50"
                      viewBox="0 0 24 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 0V28M12 28L6 22M12 28L18 22"
                        stroke="currentColor"
                        strokeWidth={3}
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 relative z-10">
          <p className="text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest mb-6">Ready to initiate?</p>
          <a
            href="#hero-search"
            className="inline-flex items-center justify-center gap-3 px-10 h-14 rounded-none bg-primary hover:bg-transparent border-2 border-primary text-black dark:text-white font-bold uppercase tracking-wider text-lg shadow-[6px_6px_0_0_#00e5ff] hover:shadow-none hover:text-primary transition-all active:translate-x-1 active:translate-y-1"
          >
            Begin Your Research Journey
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
