import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are The Wire — a real-time business intelligence engine for freelancers using Felmark. You analyze the freelancer's actual services, clients, and project data to generate 12-14 actionable signal cards.

OUTPUT FORMAT: Return ONLY a raw JSON array of 12-14 objects. No markdown, no code fences, no explanation.

Each object must have ALL of these fields:
{
  "id": <integer, sequential starting from 1>,
  "type": "trend" | "opportunity" | "insight" | "alert" | "client" | "market" | "tool" | "community",
  "source": "<realistic source name>",
  "time": "<relative time string like '2m', '14m', '1h', '3h', '6h', '1d'>",
  "live": <boolean — true for 2-3 signals that are breaking/live>,
  "title": "<Short punchy headline, under 80 chars>",
  "body": "<2-3 sentence analysis referencing the freelancer's specific data — services, prices, clients, projects. Be concrete, not generic. End with what they should DO.>",
  "tags": ["<2-3 short tags relevant to the signal, e.g. 'pricing', 'design', 'upwork'>"],
  "relevance": <integer 70-98>,
  "metric": { "label": "<key metric value, e.g. '+23%', '$4,200', '18 leads'>", "sub": "<metric context, e.g. 'vs last month', 'avg project value', 'this week'>" },
  "spark": [<array of exactly 12 numbers showing a mini trend, values 20-100>],
  "isClientSignal": <boolean — true for 2-3 signals about specific clients>,
  "group": "live" | "today" | "earlier",
  "relatedAction": "<action text for client signals, e.g. 'Send follow-up', 'Review proposal', null for non-client signals>"
}

SOURCES — use realistic, varied sources:
"Dribbble", "Behance", "LinkedIn", "Upwork", "Google Trends", "Hacker News", "ProductHunt", "Awwwards", "Twitter/X", "Industry Report", "Felmark Intelligence", "Client Activity"

SIGNAL TYPE GUIDANCE:
- "trend": Market or industry trends relevant to their specific services and niche
- "opportunity": New business opportunities, underserved markets, pricing gaps
- "insight": Data-driven observations about their business — utilization, revenue patterns, client mix
- "alert": Things needing attention — overdue projects, pricing below market, capacity issues
- "client": Client-specific signals — upsell opportunities, at-risk clients, activity patterns
- "market": Broader market movements, competitor activity, industry shifts
- "tool": New tools, platforms, or techniques relevant to their work
- "community": Community trends, discussions, or events in their niche

DISTRIBUTION RULES:
1. Mark 2-3 signals as live:true with group:"live" and time under 15m ("2m", "5m", "14m")
2. Mark 2-3 signals as isClientSignal:true with a relatedAction string — these should reference actual client names from the data
3. Put 4-5 signals in group:"today" with time "1h"-"6h"
4. Put the rest in group:"earlier" with time "8h"-"1d"
5. Relevance scores should range from 70-98, with client signals and alerts scoring highest (85+)
6. Every signal MUST have a spark array of exactly 12 numbers (integers 20-100) showing a plausible trend
7. Every signal MUST have a metric object with label and sub

CRITICAL RULES:
1. Reference the freelancer's ACTUAL service names, prices, client names, and project counts
2. Every signal must be actionable — end with what the freelancer should DO
3. Mix signal types — use at least 5 different types
4. Be specific: "$2,400 for Brand Identity Essential is 15% below the $2,800 market average" not "your prices might be low"
5. If they have no services or clients, generate onboarding-focused signals about setting up their business
6. The spark array should tell a visual story — uptrends for opportunities, spikes for alerts, steady for benchmarks`;

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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Here is my freelance business data. Generate 12-14 personalized signal cards with full metadata (spark arrays, metrics, tags, group assignments):\n\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}`, details: err },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";

    let signals;
    try {
      signals = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        signals = JSON.parse(match[0]);
      } else {
        return NextResponse.json(
          { error: "Failed to parse AI response", raw: text },
          { status: 500 }
        );
      }
    }

    // Validate shape
    if (!Array.isArray(signals)) {
      return NextResponse.json(
        { error: "Response is not an array", raw: text },
        { status: 500 }
      );
    }

    const validTypes = new Set(["trend", "opportunity", "insight", "alert", "client", "market", "tool", "community"]);
    const validGroups = new Set(["live", "today", "earlier"]);
    const validated = signals
      .filter(
        (s: Record<string, unknown>) =>
          s &&
          typeof s.title === "string" &&
          typeof s.body === "string" &&
          validTypes.has(s.type as string)
      )
      .map((s: Record<string, unknown>, idx: number) => ({
        id: typeof s.id === "number" ? s.id : idx + 1,
        type: s.type as string,
        source: typeof s.source === "string" ? s.source : "Felmark Intelligence",
        time: typeof s.time === "string" ? s.time : "1h",
        live: typeof s.live === "boolean" ? s.live : false,
        title: s.title as string,
        body: s.body as string,
        tags: Array.isArray(s.tags) ? (s.tags as string[]).slice(0, 5) : [],
        relevance: typeof s.relevance === "number" ? Math.min(98, Math.max(70, s.relevance)) : 75,
        metric: s.metric && typeof (s.metric as Record<string, unknown>).label === "string"
          ? { label: (s.metric as Record<string, unknown>).label as string, sub: ((s.metric as Record<string, unknown>).sub as string) || "" }
          : { label: "—", sub: "" },
        spark: Array.isArray(s.spark) ? (s.spark as number[]).slice(0, 12) : [50, 55, 48, 60, 58, 65, 70, 68, 72, 75, 78, 80],
        isClientSignal: typeof s.isClientSignal === "boolean" ? s.isClientSignal : false,
        group: validGroups.has(s.group as string) ? (s.group as string) : "today",
        relatedAction: typeof s.relatedAction === "string" ? s.relatedAction : null,
      }));

    return NextResponse.json({ signals: validated });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 }
    );
  }
}
