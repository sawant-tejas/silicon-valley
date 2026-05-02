'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PaperCard } from '@/components/paper-card';
import type { Paper } from '@/lib/research';
import { Loader2, Search } from 'lucide-react';

type SortMode = 'relevance' | 'citations' | 'year';

export default function ExplorePage() {
  const [topic, setTopic] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [yearFrom, setYearFrom] = useState<number>(2018);
  const [yearTo, setYearTo] = useState<number>(new Date().getFullYear());
  const [minCitations, setMinCitations] = useState<number>(0);
  const [sortMode, setSortMode] = useState<SortMode>('relevance');

  const [page, setPage] = useState(1);
  const pageSize = 9;

  const filtered = useMemo(() => {
    const base = papers.filter((p) => {
      const yOk =
        typeof p.year !== 'number' ? true : p.year >= yearFrom && p.year <= yearTo;
      const cOk = (p.citationCount ?? 0) >= minCitations;
      return yOk && cOk;
    });

    const sorted =
      sortMode === 'citations'
        ? base.slice().sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0))
        : sortMode === 'year'
          ? base.slice().sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
          : base;

    return sorted;
  }, [minCitations, papers, sortMode, yearFrom, yearTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const search = async () => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    setIsLoading(true);
    setError('');
    setPapers([]);
    setPage(1);
    try {
      const res = await fetch(`/api/semantic-scholar?topic=${encodeURIComponent(trimmed)}`);
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error ?? 'Failed to fetch papers.');
        return;
      }
      setPapers(Array.isArray(payload?.data) ? payload.data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed.');
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
            Explore papers in one place
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search once. Filter by year and citations. Avoid duplicated effort with Solved/Ongoing/Unexplored badges.
          </p>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-3">
            <div className="lg:col-span-3">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type a topic (e.g. Large Language Models)"
                className="bg-card/70 border-primary/30"
              />
            </div>
            <Button
              onClick={search}
              disabled={isLoading || !topic.trim()}
              className="lg:col-span-2 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="rounded-xl border border-primary/20 bg-card/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Year from</div>
              <Input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(Number(e.target.value))}
                className="mt-2 bg-card/70 border-primary/20"
              />
            </div>
            <div className="rounded-xl border border-primary/20 bg-card/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Year to</div>
              <Input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(Number(e.target.value))}
                className="mt-2 bg-card/70 border-primary/20"
              />
            </div>
            <div className="rounded-xl border border-primary/20 bg-card/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Min citations</div>
              <Input
                type="number"
                value={minCitations}
                onChange={(e) => setMinCitations(Number(e.target.value))}
                className="mt-2 bg-card/70 border-primary/20"
              />
            </div>
            <div className="rounded-xl border border-primary/20 bg-card/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sort</div>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="mt-2 w-full rounded-md border border-primary/20 bg-card/70 px-3 py-2"
              >
                <option value="relevance">Relevance</option>
                <option value="citations">Citations</option>
                <option value="year">Newest</option>
              </select>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading papers…
            </div>
          ) : null}

          {!isLoading && papers.length > 0 ? (
            <>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {paged.length} of {filtered.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-primary/25"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Page {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    className="border-primary/25"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paged.map((p) => (
                  <PaperCard key={p.paperId || p.title} paper={p} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}

