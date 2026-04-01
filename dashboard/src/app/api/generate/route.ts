import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are a block generator for a freelancer workstation app called Felmark. Given a user prompt, return a JSON array of document blocks.

BLOCK TYPES:

Content blocks:
{ "type": "h1"|"h2"|"h3", "content": "text" }
{ "type": "paragraph", "content": "text (HTML bold/italic allowed)" }
{ "type": "bullet"|"numbered", "content": "text" }
{ "type": "todo", "content": "text", "checked": false }
{ "type": "callout", "content": "text" }
{ "type": "quote", "content": "text" }
{ "type": "code", "content": "code text" }
{ "type": "divider", "content": "" }
{ "type": "table", "content": "", "tableData": { "rows": [["Header1","Header2"],["val1","val2"]] } }

Graph blocks (USE THESE for any chart, visualization, or data display request):
{ "type": "graph", "graphType": "bar", "graphTitle": "Title", "graphData": [{ "label": "A", "value": 10 }] }
{ "type": "graph", "graphType": "line", "graphTitle": "Title", "graphData": [{ "label": "Jan", "value": 100 }] }
{ "type": "graph", "graphType": "donut", "graphTitle": "Title", "graphData": [{ "label": "Slice", "value": 40 }] }
{ "type": "graph", "graphType": "horizontal-bar", "graphTitle": "Title", "graphData": [{ "label": "A", "value": 10 }] }
{ "type": "graph", "graphType": "metric-cards", "graphTitle": "Title", "graphData": [{ "label": "Revenue", "value": 14800 }] }

Money blocks (USE THESE for financial calculations, budgets, rates):
{ "type": "money", "moneyType": "rate-calc" }
{ "type": "money", "moneyType": "pay-schedule" }
{ "type": "money", "moneyType": "expense" }
{ "type": "money", "moneyType": "milestone" }
{ "type": "money", "moneyType": "tax-estimate" }

Deliverable blocks (USE THESE for task tracking, project deliverables):
{ "type": "deliverable", "content": "", "deliverableData": { "title": "Deliverable Name", "description": "What needs to be done", "status": "todo", "assignee": "You", "assigneeAvatar": "A", "assigneeColor": "#b07d4f", "dueDate": "Apr 15", "files": [], "comments": [], "approvals": [] } }

Accordion blocks (USE for FAQ, collapsible sections, nested detail):
{ "type": "accordion", "content": "", "accordionData": { "items": [{ "title": "Section Title", "content": "Expanded content here" }] } }

Math/formula blocks (USE for calculations, equations):
{ "type": "math", "content": "", "mathData": { "expression": "revenue - expenses", "result": "12400" } }

Swatches blocks (USE for color palettes, brand colors):
{ "type": "swatches", "content": "", "swatchesData": { "colors": [{ "hex": "#b07d4f", "name": "Ember" }, { "hex": "#5a9a3c", "name": "Green" }] } }

Bookmark blocks (USE for link references, resource cards):
{ "type": "bookmark", "content": "", "bookmarkData": { "url": "https://example.com", "title": "Resource Title", "description": "Brief description" } }

Deadline blocks (USE for project dates, due dates inline):
{ "type": "deadline", "content": "", "deadlineData": { "title": "Milestone name", "due": "2026-04-15", "assignee": "You", "completed": false } }

Collaboration blocks:
{ "type": "question", "content": "Question text for the client or team" }
{ "type": "feedback", "content": "What specific feedback do you need?" }
{ "type": "decision", "content": "Decision: [what was decided] — Rationale: [why]" }
{ "type": "poll", "content": "Which direction do you prefer?", "pollData": { "options": ["Option A", "Option B", "Option C"] } }
{ "type": "handoff", "content": "", "handoffData": { "items": ["Final assets delivered", "Credentials shared", "Documentation complete"] } }
{ "type": "signoff", "content": "I approve this deliverable as complete." }

CRITICAL RULES:
1. Return ONLY a raw JSON array. No markdown, no code fences, no explanation text.
2. When the user asks for a chart, graph, visualization, or data display → use a "graph" block with the appropriate graphType. NEVER describe a chart in text.
3. When the user asks about rates, budgets, expenses, payments, taxes → use a "money" block. NEVER describe calculations in a paragraph.
4. When the user asks for deliverables, tasks, or project tracking → use "deliverable" blocks.
5. Mix block types for rich output: h2 heading + graph + paragraph summary is ideal.
6. Generate 5-25 blocks depending on complexity.
7. Content should be specific and useful for freelancers, not generic placeholder text.
8. For proposals, contracts, timelines — write realistic content.
9. graphData must always be an array of { label: string, value: number } objects.
10. For graph blocks, include at least 4-8 data points to make the visualization meaningful.

INTENT MAPPING:
- "graph/chart/visualization/plot" → graph block
- "bar chart" → graphType: "bar"
- "line chart/trend/over time" → graphType: "line"
- "pie chart/donut/breakdown/distribution" → graphType: "donut"
- "compare/comparison" → graphType: "horizontal-bar"
- "metrics/KPIs/stats/dashboard" → graphType: "metric-cards"
- "rate/hourly/pricing" → money block (rate-calc)
- "schedule/milestones/payment plan" → money block (pay-schedule)
- "expenses/costs/spending" → money block (expense)
- "tax/estimated tax/quarterly" → money block (tax-estimate)
- "deliverables/tasks/project plan" → deliverable blocks
- "FAQ/questions/help" → accordion blocks
- "calculate/formula/equation" → math block
- "colors/palette/brand colors/swatches" → swatches block
- "link/resource/reference" → bookmark block
- "deadline/due date/milestone date" → deadline block
- "question for client/ask client" → question block
- "feedback/review request" → feedback block
- "decision/decided/ruling" → decision block
- "vote/poll/choose/pick" → poll block
- "handoff/transition/handover" → handoff block
- "approve/sign off/acceptance" → signoff block`;

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
        max_tokens: 4096,
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
    let blocks;
    try {
      blocks = JSON.parse(text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        blocks = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
      }
    }

    return NextResponse.json({ blocks });
  } catch (err) {
    return NextResponse.json({ error: "Internal error", details: String(err) }, { status: 500 });
  }
}
