export type Paper = {
  paperId: string;
  title: string;
  authors?: Array<{ name: string }>;
  year?: number | null;
  citationCount?: number;
  abstract?: string;
  detailsUrl?: string;
  pdfUrl?: string;
};

export type PaperStatus = 'solved' | 'ongoing' | 'unexplored';

export function classifyPaperStatus(paper: Pick<Paper, 'year' | 'citationCount'>): PaperStatus {
  const now = new Date().getFullYear();
  const year = typeof paper.year === 'number' ? paper.year : null;
  const cites = paper.citationCount ?? 0;

  // Simple, explainable heuristics:
  // - "Solved": older + highly cited
  // - "Ongoing": recent and/or moderately cited
  // - "Unexplored": low citations (often early-stage or niche)
  if (year !== null && now - year >= 7 && cites >= 250) return 'solved';
  if (cites <= 12) return 'unexplored';
  return 'ongoing';
}

export function statusLabel(status: PaperStatus) {
  if (status === 'solved') return 'Solved';
  if (status === 'ongoing') return 'Ongoing';
  return 'Unexplored';
}

export function statusTone(status: PaperStatus) {
  // maps to Badge variants
  if (status === 'solved') return 'secondary';
  if (status === 'ongoing') return 'outline';
  return 'destructive';
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','of','to','in','for','on','with','without','via','from','by','at','as',
  'using','use','based','towards','toward','approach','approaches','study','analysis','analyses',
  'method','methods','model','models','learning','research','paper','papers','data','system','systems',
  'new','novel','efficient','robust','deep',
]);

export type TopicNode = {
  id: string;
  label: string;
  count: number;
  avgCitations: number;
  avgYear: number;
  status: PaperStatus;
};

export function extractTopicNodes(papers: Paper[], limit = 16): TopicNode[] {
  const buckets = new Map<string, { label: string; count: number; cites: number; yearSum: number; yearCount: number }>();

  for (const p of papers) {
    const title = (p.title ?? '').toLowerCase();
    const tokens = title
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .filter((t) => t.length >= 4)
      .filter((t) => !STOP_WORDS.has(t));

    const unique = Array.from(new Set(tokens)).slice(0, 6);
    for (const token of unique) {
      const key = token;
      const entry = buckets.get(key) ?? { label: token, count: 0, cites: 0, yearSum: 0, yearCount: 0 };
      entry.count += 1;
      entry.cites += p.citationCount ?? 0;
      if (typeof p.year === 'number') {
        entry.yearSum += p.year;
        entry.yearCount += 1;
      }
      buckets.set(key, entry);
    }
  }

  const nodes = Array.from(buckets.entries())
    .map(([id, b]) => {
      const avgCitations = b.count ? b.cites / b.count : 0;
      const avgYear = b.yearCount ? b.yearSum / b.yearCount : new Date().getFullYear();
      const status = classifyPaperStatus({ year: Math.round(avgYear), citationCount: Math.round(avgCitations) });
      return {
        id,
        label: b.label,
        count: b.count,
        avgCitations,
        avgYear,
        status,
      } satisfies TopicNode;
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);

  return nodes;
}

export function relatedTopicsFromNodes(nodes: TopicNode[], max = 6) {
  return nodes
    .slice()
    .sort((a, b) => {
      const rank = (n: TopicNode) => (n.status === 'unexplored' ? 2 : n.status === 'ongoing' ? 1 : 0);
      return rank(b) - rank(a) || b.count - a.count;
    })
    .slice(0, max)
    .map((n) => n.label);
}

