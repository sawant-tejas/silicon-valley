'use client';

import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import type { TopicNode } from '@/lib/research';

function statusColor(status: TopicNode['status']) {
  if (status === 'solved') return 'rgba(16, 185, 129, 0.85)'; // emerald
  if (status === 'ongoing') return 'rgba(245, 158, 11, 0.85)'; // amber
  return 'rgba(244, 63, 94, 0.85)'; // rose
}

export function TopicBubbleChart({ nodes }: { nodes: TopicNode[] }) {
  const data = nodes.map((n) => ({
    ...n,
    x: n.avgYear,
    y: n.avgCitations,
    z: n.count,
    fill: statusColor(n.status),
  }));

  return (
    <div className="neon-panel rounded-2xl border border-primary/25 bg-card/70 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Knowledge Map</p>
          <p className="text-xs text-muted-foreground">
            Bubble size = topic frequency • Y = avg citations • X = avg year • Color = solved/ongoing/unexplored
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Solved
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Ongoing
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Unexplored
          </span>
        </div>
      </div>

      <div className="h-[320px] sm:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <XAxis
              dataKey="x"
              type="number"
              domain={['dataMin - 1', 'dataMax + 1']}
              tick={{ fill: 'rgba(245,245,245,0.7)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(127,119,221,0.25)' }}
              tickLine={{ stroke: 'rgba(127,119,221,0.25)' }}
            />
            <YAxis
              dataKey="y"
              type="number"
              tick={{ fill: 'rgba(245,245,245,0.7)', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(127,119,221,0.25)' }}
              tickLine={{ stroke: 'rgba(127,119,221,0.25)' }}
            />
            <ZAxis dataKey="z" range={[110, 850]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const item = payload[0]?.payload as TopicNode & { x: number; y: number; z: number };
                return (
                  <div className="rounded-lg border border-primary/35 bg-card/90 px-3 py-2 text-xs">
                    <div className="font-semibold text-foreground">{item.label}</div>
                    <div className="text-muted-foreground">Papers tagged: {item.count}</div>
                    <div className="text-muted-foreground">Avg year: {Math.round(item.avgYear)}</div>
                    <div className="text-muted-foreground">Avg citations: {Math.round(item.avgCitations)}</div>
                    <div className="text-muted-foreground">Status: {item.status}</div>
                  </div>
                );
              }}
            />
            <Scatter data={data} fillOpacity={0.9} shape={(props) => {
              const { cx, cy, size, payload } = props as unknown as { cx: number; cy: number; size: number; payload: { fill: string } };
              return <circle cx={cx} cy={cy} r={Math.sqrt(size) / 2.1} fill={payload.fill} />;
            }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

