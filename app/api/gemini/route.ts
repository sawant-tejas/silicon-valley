import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
  };
};

type GeminiModel = {
  name?: string; // e.g. "models/gemini-1.5-flash"
  supportedGenerationMethods?: string[];
};

type GeminiListModelsResponse = {
  models?: GeminiModel[];
  error?: {
    message?: string;
    status?: string;
  };
};

async function postGenerate({
  apiKey,
  model,
  prompt,
}: {
  apiKey: string;
  model: string;
  prompt: string;
}): Promise<{ ok: boolean; status: number; rawText: string }> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent` +
    `?key=${encodeURIComponent(apiKey)}`;

  const geminiRequestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(geminiRequestBody),
  });

  const rawText = await response.text();
  return { ok: response.ok, status: response.status, rawText };
}

async function listModels(apiKey: string) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models' + `?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, { method: 'GET' });
  const rawText = await response.text();
  let parsed: GeminiListModelsResponse | null = null;
  try {
    parsed = rawText ? (JSON.parse(rawText) as GeminiListModelsResponse) : null;
  } catch {
    parsed = null;
  }
  return { ok: response.ok, status: response.status, rawText, parsed };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set on the server.' }, { status: 501 });
  }

  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const preferredModel = 'models/gemini-1.5-flash';

    // First attempt: required model name.
    let attempt = await postGenerate({ apiKey, model: preferredModel, prompt });
    let modelUsed = preferredModel;

    // If model isn't available for this key/project, discover an alternative.
    if (!attempt.ok && /not found/i.test(attempt.rawText)) {
      const modelsResult = await listModels(apiKey);

      if (modelsResult.ok && Array.isArray(modelsResult.parsed?.models)) {
        const candidates = modelsResult.parsed.models
          .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes('generateContent'))
          .map((m) => m.name)
          .filter((name): name is string => Boolean(name));

        const best =
          candidates.find((name) => name.includes('gemini-1.5-flash')) ??
          candidates.find((name) => name.includes('gemini-1.5')) ??
          candidates.find((name) => name.includes('gemini'));

        if (best) {
          modelUsed = best;
          attempt = await postGenerate({ apiKey, model: best, prompt });
        } else {
          console.error('Gemini ListModels had no suitable models', { raw: modelsResult.rawText });
        }
      } else {
        console.error('Gemini ListModels failed', {
          status: modelsResult.status,
          body: modelsResult.rawText,
        });
      }
    }

    let parsed: GeminiGenerateResponse | null = null;
    try {
      parsed = attempt.rawText ? (JSON.parse(attempt.rawText) as GeminiGenerateResponse) : null;
    } catch {
      parsed = null;
    }

    if (!attempt.ok) {
      console.error('Gemini API error', {
        status: attempt.status,
        modelUsed,
        body: attempt.rawText,
      });

      return NextResponse.json(
        {
          error: 'Failed to generate Gemini gap insight.',
          details: parsed?.error?.message ?? attempt.rawText ?? `HTTP ${attempt.status}`,
        },
        { status: attempt.status }
      );
    }

    const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    if (!text) {
      console.error('Gemini API returned empty text', { modelUsed, body: attempt.rawText });
      return NextResponse.json(
        { error: 'Failed to generate Gemini gap insight.', details: 'Empty response from Gemini.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ text, modelUsed });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown server error';
    console.error('Gemini proxy failed', err);
    return NextResponse.json(
      { error: 'Failed to generate Gemini gap insight.', details: message },
      { status: 500 }
    );
  }
}

