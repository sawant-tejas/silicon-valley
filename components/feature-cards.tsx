'use client';

import { Card } from '@/components/ui/card';
import { Zap, BookOpen, Network, Trophy } from 'lucide-react';
import { TiltCard } from '@/components/effects/tilt-card';
import { ScrollMotion } from '@/components/effects/scroll-motion';

const features = [
  {
    icon: Zap,
    title: 'Find the gaps',
    description:
      'Identify unexplored areas and research opportunities in your field. Our AI analyzes millions of papers to surface the questions nobody has answered yet.',
  },
  {
    icon: BookOpen,
    title: 'Real papers',
    description:
      'Access curated research from Semantic Scholar. Get direct links to PDFs, citations, and influential works that shaped your field.',
  },
  {
    icon: Network,
    title: 'Visual maps',
    description:
      'See the relationships between concepts, authors, and institutions. Understand the landscape of research at a glance with interactive visualizations.',
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-6 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-none border-2 border-primary bg-white dark:bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black dark:text-white shadow-[4px_4px_0_0_#da100c]">
            <Trophy className="h-4 w-4 text-secondary" />
            Core Systems
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-black dark:text-white mb-4 uppercase tracking-tighter">
            Unlock Core Abilities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Progress through quests and use these abilities to dominate your research domain.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const direction = index % 2 === 0 ? 'left' : 'right';
            return (
              <ScrollMotion key={index} direction={direction} delayMs={index * 120} floatOnVisible>
                <TiltCard>
                  <Card className="group rounded-none border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-black/90 relative transition-all duration-300 p-8 hover:border-primary hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0_0_#da100c] overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 -mr-12 -mt-12 rotate-45 transform group-hover:bg-primary transition-colors" />
                    
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-primary/20 transition-all shadow-[inset_0_0_10px_rgba(0,229,255,0.1)] group-hover:shadow-[inset_0_0_20px_rgba(218,16,12,0.4)]">
                      <Icon className="w-8 h-8 text-secondary group-hover:text-black dark:text-white transition-colors" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-black dark:text-white mb-4 uppercase tracking-wide group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </Card>
                </TiltCard>
              </ScrollMotion>
            );
          })}
        </div>
      </div>
    </section>
  );
}
