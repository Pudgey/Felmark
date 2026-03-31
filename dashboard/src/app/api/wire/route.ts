import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const WIRE_RESEARCH_MODEL = process.env.ANTHROPIC_WIRE_RESEARCH_MODEL || "claude-haiku-4-5-20251001";
const WIRE_COMPILATION_MODEL = process.env.ANTHROPIC_WIRE_COMPILATION_MODEL || "claude-sonnet-4-6";

type AnthropicTextBlock = {
  type: string;
  text?: string;
};

type AnthropicMessageResponse = {
  content?: AnthropicTextBlock[];
};

type WireMetric = {
  label: string;
  sub: string;
};

type WireSignalCandidate = {
  id?: number;
  type?: string;
  source?: string;
  time?: string;
  live?: boolean;
  title?: string;
  body?: string;
  tags?: string[];
  relevance?: number;
  metric?: Partial<WireMetric> | null;
  spark?: number[];
  isClientSignal?: boolean;
  group?: string;
  relatedAction?: string | null;
  evidence?: string[];
};

const RESEARCH_SYSTEM_PROMPT = `You are The Wire research analyst for Felmark.

Your job is to turn a freelancer's business context into candidate intelligence notes that a senior editor will later compile into the final briefing.

Return ONLY a raw JSON array of 16-20 objects. No markdown, no explanation, no code fences.

Each object must use this shape:
{
  "id": <integer starting at 1>,
  "type": "trend" | "opportunity" | "insight" | "alert" | "client" | "market" | "tool" | "community",
  "source": "<realistic source name>",
  "time": "<relative time string like '2m', '14m', '1h', '3h', '8h', '1d'>",
  "live": <boolean>,
  "title": "<working headline under 80 chars>",
  "body": "<rough analytical note in 2-3 sentences, grounded in the user's actual context>",
  "tags": ["<2-4 short tags>"],
  "relevance": <integer 70-98>,
  "metric": { "label": "<key number>", "sub": "<metric context>" },
  "spark": [<exactly 12 integers between 20 and 100>],
  "isClientSignal": <boolean>,
  "group": "live" | "today" | "earlier",
  "relatedAction": "<action text or null>",
  "evidence": ["<2-4 short evidence bullets explaining why this candidate exists>"]
}

Rules:
1. Use the freelancer's actual services, prices, clients, project counts, and statuses whenever available.
2. Produce candidates, not polished prose. Prioritize signal quality and coverage.
3. Be conservative. Do not invent specific real-world facts that are unsupported by the provided context.
4. If outside-market framing is useful, phrase it as an informed candidate angle, not a fabricated hard claim.
5. Include at least 3 client-specific candidates when client data exists.
6. Include a mix of urgent/live, same-day, and earlier candidates.
7. If the context is sparse, generate setup-oriented candidates about pricing, positioning, niching, and client acquisition.
8. Every candidate must end in a clear suggested next move in either body or relatedAction.`;

const COMPILATION_SYSTEM_PROMPT = `You are The Wire briefing editor for Felmark.

You will receive:
1. The freelancer's original context
2. Candidate research notes prepared by a faster analyst model

Return ONLY a raw JSON array of 12-14 final signal cards. No markdown, no explanation, no code fences.

Each object must have this exact shape:
{
  "id": <integer starting at 1>,
  "type": "trend" | "opportunity" | "insight" | "alert" | "client" | "market" | "tool" | "community",
  "source": "<realistic source name>",
  "time": "<relative time string like '2m', '14m', '1h', '3h', '8h', '1d'>",
  "live": <boolean>,
  "title": "<short punchy headline under 80 chars>",
  "body": "<2-3 sentence final analysis that references the freelancer's specific context and ends with what they should do next>",
  "tags": ["<2-4 short tags>"],
  "relevance": <integer 70-98>,
  "metric": { "label": "<key number>", "sub": "<metric context>" },
  "spark": [<exactly 12 integers between 20 and 100>],
  "isClientSignal": <boolean>,
  "group": "live" | "today" | "earlier",
  "relatedAction": "<action text or null>"
}

Editorial rules:
1. Use only claims supported by the provided context and candidate notes.
2. Deduplicate aggressively. Merge overlapping candidates into the strongest version.
3. Prioritize specificity, actionability, and trust over flourish.
4. Keep a healthy spread across signal types instead of overfilling one category.
5. Put the highest-value client and alert signals near the top via relevance.
6. Preserve realistic timing/group distribution across live, today, and earlier.
7. Final copy should feel sharp and composed, not rough research notes.`;

const DEFAULT_SPARK = [50, 55, 48, 60, 58, 65, 70, 68, 72, 75, 78, 80];
const VALID_TYPES = new Set(["trend", "opportunity", "insight", "alert", "client", "market", "tool", "community"]);
const VALID_GROUPS = new Set(["live", "today", "earlier"]);

function clampSpark(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 50;
  return Math.max(20, Math.min(100, Math.round(value)));
}

function normalizeSpark(values: unknown): number[] {
  const base = Array.isArray(values) && values.length > 0 ? values : DEFAULT_SPARK;
  return Array.from({ length: 12 }, (_, index) => clampSpark(base[Math.min(index, base.length - 1)]));
}

function extractText(data: AnthropicMessageResponse): string {
  return (data.content || [])
    .filter(block => block.type === "text" && typeof block.text === "string")
    .map(block => block.text || "")
    .join("\n")
    .trim();
}

function parseJsonArray<T>(text: string): T[] {
  try {
    const parsed = JSON.parse(text) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [];
    try {
      const parsed = JSON.parse(match[0]) as T[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

function fallbackCompile(candidates: WireSignalCandidate[]): WireSignalCandidate[] {
  return candidates
    .slice()
    .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
    .slice(0, 14)
    .map((candidate, index) => ({
      ...candidate,
      id: index + 1,
      body: candidate.body || candidate.evidence?.join(" ") || "Review this signal and decide on the next move.",
      relatedAction: candidate.relatedAction || null,
    }));
}

function normalizeSignals(signals: WireSignalCandidate[]) {
  return signals
    .filter(signal => signal && typeof signal.title === "string" && typeof signal.body === "string" && VALID_TYPES.has(signal.type || ""))
    .map((signal, index) => ({
      id: typeof signal.id === "number" ? signal.id : index + 1,
      type: signal.type as string,
      source: typeof signal.source === "string" ? signal.source : "Felmark Intelligence",
      time: typeof signal.time === "string" ? signal.time : "1h",
      live: typeof signal.live === "boolean" ? signal.live : false,
      title: signal.title as string,
      body: signal.body as string,
      tags: Array.isArray(signal.tags) ? signal.tags.filter(tag => typeof tag === "string").slice(0, 5) : [],
      relevance: typeof signal.relevance === "number" ? Math.min(98, Math.max(70, Math.round(signal.relevance))) : 75,
      metric: signal.metric && typeof signal.metric.label === "string"
        ? {
            label: signal.metric.label,
            sub: typeof signal.metric.sub === "string" ? signal.metric.sub : "",
          }
        : { label: "—", sub: "" },
      spark: normalizeSpark(signal.spark),
      isClientSignal: typeof signal.isClientSignal === "boolean" ? signal.isClientSignal : false,
      group: VALID_GROUPS.has(signal.group || "") ? (signal.group as string) : "today",
      relatedAction: typeof signal.relatedAction === "string" ? signal.relatedAction : null,
    }));
}

async function callAnthropicMessage({
  model,
  system,
  userPrompt,
  maxTokens,
}: {
  model: string;
  system: string;
  userPrompt: string;
  maxTokens: number;
}) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Anthropic API error (${model}): ${response.status} ${details}`);
  }

  const data = await response.json() as AnthropicMessageResponse;
  return extractText(data);
}

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured. Add ANTHROPIC_API_KEY to your environment." },
      { status: 500 }
    );
  }

  try {
    const { context } = await req.json();
    if (!context || typeof context !== "string") {
      return NextResponse.json({ error: "Missing context" }, { status: 400 });
    }

    const researchText = await callAnthropicMessage({
      model: WIRE_RESEARCH_MODEL,
      maxTokens: 8192,
      system: RESEARCH_SYSTEM_PROMPT,
      userPrompt: `Freelancer context:\n\n${context}\n\nGenerate candidate Wire research notes.`,
    });

    const researchCandidates = parseJsonArray<WireSignalCandidate>(researchText);
    if (researchCandidates.length === 0) {
      return NextResponse.json(
        { error: "Failed to parse Wire research response", raw: researchText },
        { status: 500 }
      );
    }

    let usedFallbackCompilation = false;
    let compiledSignals: WireSignalCandidate[] = [];

    try {
      const compilationText = await callAnthropicMessage({
        model: WIRE_COMPILATION_MODEL,
        maxTokens: 8192,
        system: COMPILATION_SYSTEM_PROMPT,
        userPrompt: `Freelancer context:\n\n${context}\n\nCandidate research JSON:\n\n${JSON.stringify(researchCandidates, null, 2)}\n\nCompile the final Wire briefing now.`,
      });

      compiledSignals = parseJsonArray<WireSignalCandidate>(compilationText);
      if (compiledSignals.length === 0) {
        throw new Error("Compilation response did not parse as a JSON array.");
      }
    } catch {
      usedFallbackCompilation = true;
      compiledSignals = fallbackCompile(researchCandidates);
    }

    const validated = normalizeSignals(compiledSignals);
    if (validated.length === 0) {
      const fallback = normalizeSignals(fallbackCompile(researchCandidates));
      return NextResponse.json({
        signals: fallback,
        meta: {
          researchModel: WIRE_RESEARCH_MODEL,
          compilationModel: WIRE_COMPILATION_MODEL,
          usedFallbackCompilation: true,
        },
      });
    }

    return NextResponse.json({
      signals: validated,
      meta: {
        researchModel: WIRE_RESEARCH_MODEL,
        compilationModel: WIRE_COMPILATION_MODEL,
        usedFallbackCompilation,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { error: message, details: String(err) },
      { status: message.includes("Anthropic API error") ? 502 : 500 }
    );
  }
}
