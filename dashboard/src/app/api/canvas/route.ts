import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You generate diagrams as JSON arrays of positioned elements.

CANVAS GRID: 5 columns (0–4, left→right) × 4 rows (0–3, top→bottom).
Slots are named by [col, row] index. Elements snap to slot centers.

ELEMENT TYPES (return exactly these shapes):
  Box:      { "type": "rect",    "col": 2, "row": 1, "label": "Server" }
  Circle:   { "type": "circle",  "col": 0, "row": 1, "label": "Start" }
  Diamond:  { "type": "diamond", "col": 2, "row": 2, "label": "Error?" }
  Arrow:    { "type": "arrow",   "fromCol": 0, "fromRow": 1, "toCol": 2, "toRow": 1, "label": "HTTP" }
  Text:     { "type": "text",    "col": 2, "row": 0, "text": "System Diagram" }

RULES:
1. Return ONLY a raw JSON array — no markdown, no code fences.
2. Use circle for start/end nodes, rect for processes, diamond for decisions.
3. Flow diagrams go left→right or top→bottom.
4. Arrow labels are optional — use them when the relationship has a name.
5. 3–14 elements max. Focus on the diagram, not decoration.
6. Every shape that isn't self-explanatory should have a label.`;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
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
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Anthropic API error: ${response.status}`, details: err }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";

    // Parse the JSON response
    let elements;
    try {
      elements = JSON.parse(text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        elements = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
      }
    }

    return NextResponse.json({ elements });
  } catch (err) {
    return NextResponse.json({ error: "Internal error", details: String(err) }, { status: 500 });
  }
}
