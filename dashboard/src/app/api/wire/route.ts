import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are The Wire — a real-time business intelligence engine for freelancers using Felmark. You analyze the freelancer's actual services, clients, and project data to generate 10 actionable signal cards.

OUTPUT FORMAT: Return ONLY a raw JSON array of exactly 10 objects. No markdown, no code fences, no explanation.

Each object must have these fields:
{
  "type": "rate" | "trend" | "insight" | "signal" | "alert" | "benchmark",
  "title": "Short punchy headline (under 80 chars)",
  "body": "2-3 sentence analysis that references the freelancer's specific data — their services, prices, clients, projects. Be concrete, not generic.",
  "relevance": 60-99 (integer — how relevant this signal is to THIS freelancer based on their data),
  "source": "Where this insight comes from (e.g., 'Your pricing data', 'Market trends', 'Client activity', 'Industry benchmarks', 'Felmark Intelligence')"
}

SIGNAL TYPE GUIDANCE:
- "rate": Pricing insights — compare their rates to market, suggest adjustments, identify underpriced services
- "trend": Market or industry trends relevant to their specific services and niche
- "insight": Data-driven observations about their business — utilization, revenue patterns, client mix
- "signal": Client-specific signals — upsell opportunities, at-risk clients, expansion potential
- "alert": Things needing attention — overdue projects, pricing below market, capacity issues
- "benchmark": How they compare to industry averages — rates, project volume, service mix

CRITICAL RULES:
1. Reference the freelancer's ACTUAL service names, prices, client names, and project counts
2. Every signal must be actionable — end with what the freelancer should DO
3. Mix signal types — don't give all the same type
4. Higher relevance (85+) for signals that directly reference their specific data
5. Lower relevance (60-75) for general market trends
6. Be specific: "$2,400 for Brand Identity Essential is 15% below the $2,800 market average" not "your prices might be low"
7. If they have no services or clients, generate onboarding-focused signals about setting up their business`;

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
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Here is my freelance business data. Generate 10 personalized signal cards:\n\n${context}`,
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

    const validTypes = new Set(["rate", "trend", "insight", "signal", "alert", "benchmark"]);
    const validated = signals
      .filter(
        (s: Record<string, unknown>) =>
          s &&
          typeof s.title === "string" &&
          typeof s.body === "string" &&
          validTypes.has(s.type as string)
      )
      .map((s: Record<string, unknown>) => ({
        type: s.type as string,
        title: s.title as string,
        body: s.body as string,
        relevance: typeof s.relevance === "number" ? Math.min(99, Math.max(0, s.relevance)) : 75,
        source: typeof s.source === "string" ? s.source : "Felmark Intelligence",
      }));

    return NextResponse.json({ signals: validated });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 }
    );
  }
}
