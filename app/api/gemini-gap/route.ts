import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Paper = {
  title?: string;
  abstract?: string;
  year?: number | null;
  citationCount?: number;
};

function buildPaperContext(papers: Paper[]) {
  const top = papers
    .slice()
    .sort((a, b) => (b.citationCount ?? 0) - (a.citationCount ?? 0))
    .slice(0, 8);

  if (top.length === 0) return '';

  return top
    .map((p, i) => {
      const title = (p.title ?? 'Untitled').replace(/\s+/g, ' ').trim();
      const year = typeof p.year === 'number' ? p.year : 'n/a';
      const cites = p.citationCount ?? 0;
      const abs = (p.abstract ?? '').replace(/\s+/g, ' ').trim();
      const absTrimmed = abs.length > 260 ? `${abs.slice(0, 260)}…` : abs;
      return `${i + 1}. ${title} (year: ${year}, cites: ${cites})${absTrimmed ? ` — ${absTrimmed}` : ''}`;
    })
    .join('\n');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : '';
    const papers = Array.isArray(body?.papers) ? (body.papers as Paper[]) : [];

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set on the server.' },
        { status: 501 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const paperContext = buildPaperContext(papers);
    const prompt = [
      `Based on these research papers about "${topic}", identify the single biggest unsolved research gap in 2-3 sentences.`,
      '',
      'Constraints:',
      '- Output ONLY 2-3 sentences.',
      '- Be specific and testable (name what is missing and what would move the field forward).',
      '- Do not use bullet points.',
      '',
      paperContext ? 'Papers (top by citations):\n' + paperContext : 'Papers: (not provided)',
    ].join('\n');

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ topic, gap: text });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Unknown Gemini error';

    return NextResponse.json(
      {
        error: 'Failed to generate Gemini gap insight.',
        details: message,
      },
      { status: 500 }
    );
  }
}

