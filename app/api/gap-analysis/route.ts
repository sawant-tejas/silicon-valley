import { NextResponse } from 'next/server';

type Paper = {
  title?: string;
  year?: number | null;
  citationCount?: number;
};

const RECENT_YEAR_WINDOW = 4;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildInsight(topic: string, papers: Paper[]) {
  const now = new Date().getFullYear();
  const total = papers.length;
  const recent = papers.filter((paper) => typeof paper.year === 'number' && now - paper.year <= RECENT_YEAR_WINDOW).length;
  const highCited = papers.filter((paper) => (paper.citationCount ?? 0) >= 120).length;
  const lowCited = papers.filter((paper) => (paper.citationCount ?? 0) <= 10).length;

  const noveltyRatio = total ? lowCited / total : 0;
  const momentumRatio = total ? recent / total : 0;
  const saturationRatio = total ? highCited / total : 0;
  const gapScore = Math.round(clamp((noveltyRatio * 60 + momentumRatio * 30 - saturationRatio * 20) * 100, 0, 100));

  const explanation =
    gapScore >= 70
      ? `High opportunity: "${topic}" has many recent low-citation papers, which often indicates emerging, less-saturated sub-problems.`
      : gapScore >= 45
      ? `Moderate opportunity: "${topic}" shows a mix of established work and under-explored areas. Narrowing to a specific niche can increase novelty.`
      : `Lower opportunity: "${topic}" appears heavily covered by highly cited work. Consider a more specific angle or interdisciplinary application.`;

  return {
    topic,
    gapScore,
    stats: {
      totalPapers: total,
      recentPapers: recent,
      highCitedPapers: highCited,
      lowCitedPapers: lowCited,
    },
    explanation,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    const papers = Array.isArray(body?.papers) ? body.papers : [];

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const insight = buildInsight(topic, papers);
    return NextResponse.json(insight);
  } catch {
    return NextResponse.json({ error: 'Failed to analyze research gap.' }, { status: 500 });
  }
}
