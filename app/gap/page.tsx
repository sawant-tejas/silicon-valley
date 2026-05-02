'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function GapStartPage() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const go = () => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    router.push(`/gap/${encodeURIComponent(trimmed)}`);
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-15" />
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="neon-panel rounded-2xl p-6 sm:p-7 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold">AI Gap Finder</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a topic. We’ll read the top papers and identify the single biggest unsolved gap in 2–3 sentences.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Large Language Models"
              className="bg-card/70 border-primary/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter') go();
              }}
            />
            <Button
              onClick={go}
              disabled={!topic.trim()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Find the gap
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

