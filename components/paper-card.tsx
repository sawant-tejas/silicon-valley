'use client';

import { Card } from '@/components/ui/card';
import { StatusBadgeForPaper } from '@/components/status-badge';
import { TiltCard } from '@/components/effects/tilt-card';
import type { Paper } from '@/lib/research';

function abstractPreview(text?: string) {
  if (!text) return 'No abstract available.';
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length > 180 ? `${cleaned.slice(0, 180)}…` : cleaned;
}

export function PaperCard({ paper }: { paper: Paper }) {
  return (
    <TiltCard>
      <Card className="neon-panel p-5 border-primary/25 bg-card/75">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground leading-snug">{paper.title}</h3>
          <StatusBadgeForPaper paper={paper} />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          <span className="text-foreground/90 font-medium">Authors:</span>{' '}
          {paper.authors && paper.authors.length > 0 ? paper.authors.map((a) => a.name).join(', ') : 'Unknown'}
        </p>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>
            <span className="text-foreground/90 font-medium">Year:</span> {paper.year ?? 'N/A'}
          </span>
          <span>
            <span className="text-foreground/90 font-medium">Citations:</span> {paper.citationCount ?? 0}
          </span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{abstractPreview(paper.abstract)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          {paper.detailsUrl ? (
            <a
              href={paper.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Details
            </a>
          ) : (
            <span className="text-muted-foreground">No details link</span>
          )}
          {paper.pdfUrl ? (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 underline underline-offset-4"
            >
              PDF
            </a>
          ) : null}
        </div>
      </Card>
    </TiltCard>
  );
}

