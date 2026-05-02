'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Loader2 } from 'lucide-react';
import type { Paper } from '@/lib/research';
import { extractTopicNodes, relatedTopicsFromNodes } from '@/lib/research';
import { PaperCard } from '@/components/paper-card';

export default function GapDetailPage({ params }: { params: { topic: string } }) {
  const topic = decodeURIComponent(params.topic);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [aiGap, setAiGap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const nodes = useMemo(() => extractTopicNodes(papers), [papers]);
  const related = useMemo(() => relatedTopicsFromNodes(nodes), [nodes]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setIsLoading(true);
      setAiError('');
      setAiGap('');
      setPapers([]);
      try {
        const res = await fetch(`/api/semantic-scholar?topic=${encodeURIComponent(topic)}`);
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload?.error ?? 'Failed to fetch papers.');
        }
        const list: Paper[] = Array.isArray(payload?.data) ? payload.data : [];
        if (cancelled) return;
        setPapers(list);

        const top = list
          .slice()
          .sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0))
          .slice(0, 8)
          .map((p, i) => {
            const title = (p.title ?? 'Untitled').replace(/\s+/g, ' ').trim();
            const year = typeof p.year === 'number' ? p.year : 'n/a';
            const cites = p.citationCount ?? 0;
            const abs = (p.abstract ?? '').replace(/\s+/g, ' ').trim();
            const absTrimmed = abs.length > 260 ? `${abs.slice(0, 260)}…` : abs;
            return `${i + 1}. ${title} (year: ${year}, cites: ${cites})${absTrimmed ? ` — ${absTrimmed}` : ''}`;
          })
          .join('\n');

        const prompt = [
          `Based on these research papers about "${topic}", identify the single biggest unsolved research gap in 2-3 sentences.`,
          '',
          'Papers (top by citations):',
          top || '(not provided)',
        ].join('\n');

        const aiRes = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const aiPayload = await aiRes.json();
        if (!aiRes.ok) {
          throw new Error(aiPayload?.details ?? aiPayload?.error ?? 'AI request failed.');
        }
        if (cancelled) return;
        setAiGap(typeof aiPayload?.text === 'string' ? aiPayload.text : '');
      } catch (e) {
        if (cancelled) return;
        setAiError(e instanceof Error ? e.message : 'Failed to generate gap.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [topic]);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-15" />
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <div className="neon-panel rounded-2xl p-6 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Gap detail</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold">{topic}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Link href={`/explore`} className="text-primary underline underline-offset-4">
                Explore papers
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href={`/map`} className="text-primary underline underline-offset-4">
                View knowledge map
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-primary bg-card/70 p-4 shadow-[0_0_28px_rgba(127,119,221,0.35)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              AI-identified research gap
            </p>
            {isLoading ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Generating with Gemini…</span>
              </div>
            ) : aiError ? (
              <p className="mt-3 text-sm text-red-200/90 whitespace-pre-wrap">{aiError}</p>
            ) : (
              <p className="mt-3 text-sm text-foreground/90">{aiGap}</p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-foreground">Related topics to explore next</p>
            <p className="text-xs text-muted-foreground">
              Suggested from the most frequent terms in top papers (prioritizing unexplored/ongoing).
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {related.map((t) => (
                <Link
                  key={t}
                  href={`/gap/${encodeURIComponent(t)}`}
                  className="rounded-full border border-primary/25 bg-card/60 px-3 py-1 text-xs text-foreground hover:bg-card/80 transition"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Top papers</h2>
            <p className="text-xs text-muted-foreground">{papers.length ? `${papers.length} results` : ''}</p>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {papers.slice(0, 9).map((p) => (
              <PaperCard key={p.paperId || p.title} paper={p} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

