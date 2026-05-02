'use client';

import { memo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { TiltCard } from '@/components/effects/tilt-card';
import { ParticleField } from '@/components/effects/particle-field';

type Paper = {
  paperId: string;
  title: string;
  authors?: Array<{ name: string }>;
  year?: number;
  citationCount?: number;
  abstract?: string;
  detailsUrl?: string;
  pdfUrl?: string;
};

const HeroBackground = memo(function HeroBackground() {
  const [enableHeavyEffects, setEnableHeavyEffects] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice =
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4 ||
      navigator.hardwareConcurrency <= 4;
    const isSmallScreen = window.innerWidth < 1024;
    setEnableHeavyEffects(!prefersReducedMotion && !lowPowerDevice && !isSmallScreen);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0e1a] dark:bg-[#0a0e1a]">
      {enableHeavyEffects ? <ParticleField /> : null}
      {enableHeavyEffects ? (
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/lyXCDL7eztsBEi-J/scene.splinecode" />
        </div>
      ) : null}
      <div className="absolute inset-0 bg-white dark:bg-black/45" />
      <div className="absolute inset-0 cyber-grid opacity-20" />
    </div>
  );
});

export function Hero() {
  const [topic, setTopic] = useState('');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [error, setError] = useState('');
  const [aiErrorDetails, setAiErrorDetails] = useState('');
  const [aiGap, setAiGap] = useState<string>('');

  const buildPaperContext = (items: Paper[]) => {
    const top = items
      .slice()
      .sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0))
      .slice(0, 8);

    if (top.length === 0) return 'Papers: (not provided)';

    const lines = top.map((p, i) => {
      const title = (p.title ?? 'Untitled').replace(/\s+/g, ' ').trim();
      const year = typeof p.year === 'number' ? p.year : 'n/a';
      const cites = p.citationCount ?? 0;
      const abs = (p.abstract ?? '').replace(/\s+/g, ' ').trim();
      const absTrimmed = abs.length > 260 ? `${abs.slice(0, 260)}…` : abs;
      return `${i + 1}. ${title} (year: ${year}, cites: ${cites})${absTrimmed ? ` — ${absTrimmed}` : ''}`;
    });

    return `Papers (top by citations):\n${lines.join('\n')}`;
  };

  const getAbstractPreview = (text?: string) => {
    if (!text) return 'No abstract available.';
    return text.length > 150 ? `${text.slice(0, 150)}...` : text;
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setPapers([]);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/semantic-scholar?topic=${encodeURIComponent(trimmedTopic)}`);
      const payload = await response.json();
      if (!response.ok) {
        setPapers([]);
        setError(payload?.error || 'Search request failed');
        return;
      }
      setPapers(Array.isArray(payload.data) ? payload.data : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to fetch papers right now. Please try again.';
      setPapers([]);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGapAnalysis = async () => {
    const trimmedTopic = topic.trim();
    if (!trimmedTopic || papers.length === 0) {
      setError('Search a topic first, then run gap analysis.');
      return;
    }

    setIsAiGenerating(true);
    setError('');
    setAiErrorDetails('');
    setAiGap('');
    try {
      const prompt = [
        `Based on these research papers about "${trimmedTopic}", identify the single biggest unsolved research gap in 2-3 sentences.`,
        '',
        buildPaperContext(papers),
      ].join('\n');

      const geminiResponse = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const geminiPayload = await geminiResponse.json();
      if (!geminiResponse.ok) {
        setError(geminiPayload?.error || 'AI generation failed.');
        setAiErrorDetails(typeof geminiPayload?.details === 'string' ? geminiPayload.details : '');
        return;
      }
      setAiGap(typeof geminiPayload?.text === 'string' ? geminiPayload.text : '');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to analyze this topic right now.';
      setError(message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const scrollToSearch = () => {
    document.getElementById('hero-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id="home" className="relative min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background Spline scene */}
      <HeroBackground />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-none border-2 border-primary bg-white dark:bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-black dark:text-white shadow-[4px_4px_0_0_#da100c]">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Research Tracker</span>
        </div>
        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 text-balance leading-none uppercase tracking-tighter">
          <span className="text-foreground block mb-2">Enter the</span>
          <span className="glitch-text text-primary" data-text="Innovation Arena">
            Innovation Arena
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 text-balance max-w-2xl mx-auto font-medium">
          Track signals, unlock unexplored topics, and level up your discovery flow with a gamified,
          animated interface built for fast research exploration.
        </p>

        {/* Search Bar */}
        <form id="hero-search" onSubmit={handleSearch} className="neon-panel max-w-2xl mx-auto mb-8 p-6 relative">
          {/* Decorative corner blocks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary" />

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Search research topics..."
              className="flex-1 rounded-none border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black/80 placeholder:text-gray-500 dark:text-gray-500 text-black dark:text-white focus-visible:ring-0 focus-visible:border-primary text-lg h-14"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="rounded-none bg-primary hover:bg-primary/80 text-black dark:text-white px-8 h-14 text-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#00e5ff] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scanning</span>
                </>
              ) : (
                <>
                  <span>Initialize</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center mt-6">
              <Loader2 className="w-10 h-10 animate-spin text-secondary" aria-label="Loading papers" />
            </div>
          )}

          {error && !isLoading && <p className="mt-4 text-sm font-bold text-red-500 bg-red-500/10 p-3 border border-red-500">{error}</p>}

          {!isLoading && !error && papers.length > 0 && (
            <div className="mt-8 grid gap-4 text-left">
              {papers.map((paper, index) => (
                <TiltCard key={paper.paperId || `${paper.title}-${index}`}>
                  <article className="rounded-none border-l-4 border-l-primary border-t border-r border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black/90 p-5 hover:border-secondary transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 -mr-8 -mt-8 rotate-45 transform group-hover:bg-secondary/20 transition-colors" />
                    <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white mb-3">{paper.title}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      <div><span className="text-primary mr-2">AUTHORS:</span> {paper.authors && paper.authors.length > 0 ? paper.authors.map((author) => author.name).join(', ') : 'Unknown'}</div>
                      <div><span className="text-primary mr-2">YEAR:</span> {paper.year ?? 'N/A'}</div>
                      <div><span className="text-primary mr-2">CITES:</span> <span className="text-secondary">{paper.citationCount ?? 0}</span></div>
                    </div>
                    <p className="text-sm text-gray-300 border-t border-gray-200 dark:border-gray-800 pt-3">{getAbstractPreview(paper.abstract)}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-wider">
                      {paper.detailsUrl ? (
                        <a href={paper.detailsUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-black dark:text-white transition-colors flex items-center gap-1">
                          [ Read Details ]
                        </a>
                      ) : (
                        <span className="text-gray-600">No Details</span>
                      )}
                      {paper.pdfUrl && (
                        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-black dark:text-white transition-colors flex items-center gap-1">
                          [ Download PDF ]
                        </a>
                      )}
                    </div>
                  </article>
                </TiltCard>
              ))}
            </div>
          )}
        </form>

        {(isAiGenerating || aiGap) && (
          <div className="mx-auto mb-8 w-full max-w-2xl border-2 border-secondary bg-white dark:bg-black/80 p-6 text-left relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary animate-pulse" />
              AI System Analysis
            </h4>
            {isAiGenerating ? (
              <div className="flex items-center gap-3 text-black dark:text-white font-mono">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Processing data streams...</span>
              </div>
            ) : (
              <p className="text-base text-gray-200 leading-relaxed relative z-10 border-l-2 border-primary pl-4">{aiGap}</p>
            )}
          </div>
        )}

        {error && !isLoading && (
          <div className="mx-auto mb-8 w-full max-w-2xl border-2 border-red-600 bg-red-950/30 p-6 text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2">System Error</h4>
            <p className="text-sm text-black dark:text-white">{error}</p>
            {aiErrorDetails && <p className="mt-3 text-xs font-mono text-red-400 bg-white dark:bg-black/50 p-2">{aiErrorDetails}</p>}
          </div>
        )}

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mt-10">
          <Button
            size="lg"
            type="button"
            onClick={scrollToSearch}
            className="w-full sm:w-auto rounded-none bg-transparent border-2 border-secondary hover:bg-secondary hover:text-black text-secondary px-10 h-14 text-lg font-bold uppercase tracking-wider transition-all"
          >
            Explore Data
          </Button>
          <Button
            size="lg"
            type="button"
            disabled={isLoading || isAiGenerating || papers.length === 0}
            onClick={handleGapAnalysis}
            className="w-full sm:w-auto rounded-none bg-primary border-2 border-primary hover:bg-transparent hover:text-primary text-black dark:text-white px-10 h-14 text-lg font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#da100c] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAiGenerating ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-5 w-5" />
                Find Gap
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
