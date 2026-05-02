import { NextResponse } from 'next/server';

type OpenAlexWork = {
  id?: string;
  title?: string;
  publication_year?: number;
  cited_by_count?: number;
  authorships?: Array<{ author?: { display_name?: string } }>;
  abstract_inverted_index?: Record<string, number[]>;
  primary_location?: {
    landing_page_url?: string;
    pdf_url?: string;
  };
};

type SemanticScholarPaper = {
  paperId?: string;
  title?: string;
  authors?: Array<{ name?: string }>;
  year?: number;
  citationCount?: number;
  abstract?: string;
  url?: string;
  openAccessPdf?: { url?: string | null } | null;
};

function buildAbstractFromInvertedIndex(index?: Record<string, number[]>) {
  if (!index) return '';
  const positionedWords: Array<{ word: string; position: number }> = [];

  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) {
      positionedWords.push({ word, position });
    }
  }

  positionedWords.sort((a, b) => a.position - b.position);
  return positionedWords.map((entry) => entry.word).join(' ');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic')?.trim() ?? '';

  if (!topic) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
    topic
  )}&fields=title,authors,year,citationCount,abstract,url,openAccessPdf&limit=20`;

  const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;

  const fetchSemanticScholar = () =>
    fetch(url, {
      headers: {
        Accept: 'application/json',
        // Helpful for APIs that apply stricter bot rules to missing UA.
        'User-Agent': 'ResearchMap/1.0',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      cache: 'no-store',
    });

  const fetchOpenAlex = async () => {
    const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(topic)}&per-page=20`;
    const response = await fetch(openAlexUrl, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ResearchMap/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { ok: false, status: response.status, data: [] as unknown[] };
    }

    const payload = await response.json();
    const results = Array.isArray(payload?.results) ? payload.results : [];

    const mapped = results.map((work: OpenAlexWork) => ({
      paperId: work.id ?? '',
      title: work.title ?? 'Untitled',
      authors: Array.isArray(work.authorships)
        ? work.authorships
            .map((entry) => entry.author?.display_name)
            .filter((name): name is string => Boolean(name))
            .map((name) => ({ name }))
        : [],
      year: work.publication_year ?? null,
      citationCount: work.cited_by_count ?? 0,
      abstract: buildAbstractFromInvertedIndex(work.abstract_inverted_index),
      detailsUrl: work.primary_location?.landing_page_url ?? work.id ?? '',
      pdfUrl: work.primary_location?.pdf_url ?? '',
    }));

    return { ok: true, status: 200, data: mapped };
  };

  try {
    let response = await fetchSemanticScholar();

    // One short retry for temporary throttling.
    if (response.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      response = await fetchSemanticScholar();
    }

    if (response.status === 429) {
      const fallback = await fetchOpenAlex();
      if (fallback.ok) {
        return NextResponse.json({
          data: fallback.data,
          source: 'openalex-fallback',
          warning: 'Semantic Scholar rate limited. Showing fallback results.',
        });
      }
    }

    if (!response.ok) {
      const retryAfter = response.headers.get('retry-after');
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? 'Semantic Scholar is rate limited and fallback provider is unavailable. Please try again shortly.'
              : 'Semantic Scholar request failed.',
          status: response.status,
          retryAfter,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const papers: SemanticScholarPaper[] = Array.isArray(data.data) ? data.data : [];
    const mapped = papers.map((paper) => ({
      paperId: paper.paperId ?? '',
      title: paper.title ?? 'Untitled',
      authors: Array.isArray(paper.authors)
        ? paper.authors
            .map((author) => author.name)
            .filter((name): name is string => Boolean(name))
            .map((name) => ({ name }))
        : [],
      year: paper.year ?? null,
      citationCount: paper.citationCount ?? 0,
      abstract: paper.abstract ?? '',
      detailsUrl: paper.url ?? '',
      pdfUrl: paper.openAccessPdf?.url ?? '',
    }));

    return NextResponse.json({ data: mapped });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Semantic Scholar data' }, { status: 500 });
  }
}
