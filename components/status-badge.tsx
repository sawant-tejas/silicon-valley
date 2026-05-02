'use client';

import { Badge } from '@/components/ui/badge';
import { classifyPaperStatus, statusLabel, statusTone, type Paper, type PaperStatus } from '@/lib/research';

export function StatusBadge({ status }: { status: PaperStatus }) {
  return (
    <Badge
      variant={statusTone(status) as never}
      className={
        status === 'solved'
          ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40'
          : status === 'ongoing'
            ? 'bg-amber-500/10 text-amber-200 border-amber-500/35'
            : 'bg-rose-500/10 text-rose-200 border-rose-500/40'
      }
    >
      {statusLabel(status)}
    </Badge>
  );
}

export function StatusBadgeForPaper({ paper }: { paper: Pick<Paper, 'year' | 'citationCount'> }) {
  const status = classifyPaperStatus(paper);
  return <StatusBadge status={status} />;
}

