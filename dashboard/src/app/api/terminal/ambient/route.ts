/**
 * D2 — Ambient Intelligence API Route
 * POST /api/terminal/ambient
 *
 * Accepts document + business context, returns 0-3 tiered insights
 * from Haiku. Target: <300ms response time.
 */
import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const AMBIENT_SYSTEM_PROMPT = `You are Felmark's ambient intelligence engine — a silent business copilot for freelancers. You observe the document they're writing and their business context, then surface 0-3 insights. ONLY speak when you have something genuinely useful. Silence is better than noise.

OUTPUT FORMAT: Return ONLY a raw JSON array (0-3 items). No markdown, no code fences.
Each item:
{
  "tier": "whisper" | "nudge" | "alert",
  "text": "<short insight, 1-2 sentences max>",
  "reason": "<optional: why this matters, 1 sentence>",
  "action": { "label": "<button text>", "command": "<terminal command or action>" } | null
}

TIER DEFINITIONS:
- "whisper": Ambient, low-priority. Like a sticky note in the margin. No action needed. Examples: "This proposal has 3 deliverables but no timeline." / "Avg project in this category bills $4,200."
- "nudge": Worth attention. Like a colleague tapping your shoulder. Usually has an action. Examples: "You haven't mentioned payment terms — most proposals include NET 30." / "Meridian's last project was 45 days ago. Time for a check-in?"
- "alert": Urgent, needs action NOW. Like a phone ringing. Examples: "This invoice total ($1,200) is 40% below your usual rate for this scope." / "Project deadline is in 3 days and status is still 'active'."

THE 5 INTELLIGENCE SURFACES — check all of these:
1. RISK DETECTION: Missing payment terms, no contract/signoff, scope without boundaries, overdue projects, underpriced work
2. RATE COACHING: Compare amounts to typical rates, flag if pricing below their usual, surface rate optimization opportunities
3. DOCUMENT COMPLETENESS: Missing sections for this doc type (proposal needs: scope, deliverables, timeline, pricing, terms; invoice needs: line items, total, due date, payment info)
4. CLIENT CONTEXT: Relationship health, time since last project, upsell opportunities, at-risk clients
5. TIMING NUDGES: Upcoming deadlines, follow-up reminders, seasonal patterns, end-of-month/quarter billing

RULES:
- Return [] (empty array) if nothing useful to say. Don't fabricate insights.
- Max 3 items. Usually 0-1 is right. Only 2-3 when truly warranted.
- Be specific: reference actual numbers, client names, dates from the context.
- Never be generic. "Consider adding a timeline" is bad. "This proposal has 4 deliverables but no deadline block — Meridian's last project had a 2-week turnaround" is good.
- Actions use terminal commands: "/rate", "/client ClientName", "/status", or special actions: "navigate:workstation:id", "insert:money", "insert:deadline"
- Keep total response under 300 tokens.`;

interface AmbientInsight {
  tier: "whisper" | "nudge" | "alert";
  text: string;
  reason?: string;
  action?: { label: string; command: string } | null;
}

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { documentContext, businessContext } = body;

    if (!documentContext || typeof documentContext !== "string") {
      return NextResponse.json({ error: "Missing documentContext" }, { status: 400 });
    }

    const userMessage = [
      "DOCUMENT CONTEXT:",
      documentContext,
      "",
      "BUSINESS CONTEXT:",
      businessContext || "No business data available yet.",
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: AMBIENT_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
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

    let insights: AmbientInsight[];
    try {
      insights = JSON.parse(text);
    } catch {
      // Try to extract JSON array from response
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        insights = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ insights: [] });
      }
    }

    if (!Array.isArray(insights)) {
      return NextResponse.json({ insights: [] });
    }

    // Validate and sanitize
    const validTiers = new Set(["whisper", "nudge", "alert"]);
    const validated = insights
      .filter(
        (i): i is AmbientInsight =>
          i &&
          typeof i.text === "string" &&
          validTiers.has(i.tier)
      )
      .slice(0, 3)
      .map(i => ({
        tier: i.tier,
        text: i.text,
        reason: typeof i.reason === "string" ? i.reason : undefined,
        action:
          i.action && typeof i.action.label === "string" && typeof i.action.command === "string"
            ? { label: i.action.label, command: i.action.command }
            : null,
      }));

    return NextResponse.json({ insights: validated });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 }
    );
  }
}
