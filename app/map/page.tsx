'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import type { Paper } from '@/lib/research';
import { extractTopicNodes } from '@/lib/research';
import { TopicBubbleChart } from '@/components/topic-bubble-chart';

export default function MapPage() {
  const [topic, setTopic] = useState('Machine Learning');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const nodes = useMemo(() => extractTopicNodes(papers), [papers]);

  const load = async () => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setError('');
    setPapers([]);
    try {
      const res = await fetch(`/api/semantic-scholar?topic=${encodeURIComponent(trimmed)}`);
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error ?? 'Failed to fetch papers.');
        return;
      }
      setPapers(Array.isArray(payload?.data) ? payload.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-15" />
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="neon-panel rounded-2xl p-5 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Knowledge Map Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Instantly see what’s solved vs ongoing vs unexplored. Avoid knowledge overload by focusing on red/amber clusters.
          </p>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-3">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-card/70 border-primary/30"
                placeholder="Enter a field (e.g. Large Language Models)"
              />
            </div>
            <Button
              onClick={load}
              disabled={isLoading || !topic.trim()}
              className="lg:col-span-2 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Build Map
            </Button>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Generating knowledge map…
            </div>
          ) : null}

          {!isLoading && papers.length > 0 ? (
            <TopicBubbleChart nodes={nodes} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

