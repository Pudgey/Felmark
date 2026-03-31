/**
 * D3 — Natural Language Query API Route
 * POST /api/terminal/query
 *
 * Accepts a freeform question + business context.
 * Routes to Sonnet for heavy tasks, Haiku for quick lookups.
 */
import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/** Keywords that trigger the more capable (Sonnet) model */
const SONNET_TRIGGERS = [
  "write", "draft", "compose", "email", "analyze across",
  "deep dive", "compare all", "summarize everything", "rewrite",
  "generate", "create a", "build a",
];

function pickModel(query: string): string {
  const lower = query.toLowerCase();
  for (const trigger of SONNET_TRIGGERS) {
    if (lower.includes(trigger)) return "claude-sonnet-4-6-20250514";
  }
  return "claude-haiku-4-5-20251001";
}

const QUERY_SYSTEM_PROMPT = `You are Felmark Terminal — a freelancer's business copilot. The user asks questions about their business, clients, projects, pricing, and documents. Answer concisely and actionably.

RESPONSE FORMAT: Return a JSON object with this shape:
{
  "text": "<your answer — plain text, concise, 2-5 sentences>",
  "data": null | { "type": "table" | "list" | "metric" | "card", "content": <structured data> }
}

DATA TYPES (use when appropriate):
- "table": { "type": "table", "content": { "headers": ["Col1", "Col2"], "rows": [["val1", "val2"]] } }
- "list": { "type": "list", "content": ["item 1", "item 2"] }
- "metric": { "type": "metric", "content": { "label": "Effective Rate", "value": "$85/hr", "change": "+12%" } }
- "card": { "type": "card", "content": { "title": "...", "body": "...", "tags": ["tag1"] } }

RULES:
- Be specific. Reference actual client names, amounts, project names from the context.
- If you don't have enough data, say so honestly. Don't fabricate.
- Keep text under 100 words. Use data structures for anything tabular or comparative.
- For "write"/"draft" requests, put the drafted text in the text field.
- Always return valid JSON. No markdown fences.`;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { query, context } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const model = pickModel(query);

    const userMessage = [
      "BUSINESS CONTEXT:",
      context || "No business data available yet.",
      "",
      "QUESTION:",
      query,
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: QUERY_SYSTEM_PROMPT,
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
    const text = data.content?.[0]?.text || "{}";

    let result: { text: string; data?: { type: string; content: unknown } | null };
    try {
      result = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        // Fallback: treat raw text as the answer
        result = { text: text.slice(0, 500), data: null };
      }
    }

    // Ensure shape
    if (typeof result.text !== "string") {
      result = { text: String(result.text || text).slice(0, 500), data: null };
    }

    return NextResponse.json({
      text: result.text,
      data: result.data || null,
      model, // Let the client know which model was used
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", details: String(err) },
      { status: 500 }
    );
  }
}
