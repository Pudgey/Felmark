# Mission: AI Block System Prompt — Felmark-Aware AI Output

**Created**: 2026-03-30
**Status**: Planning
**Milestone**: M1

---

## Goal

When a freelancer uses an AI block (`/ai`) in the editor, the AI returns structured Felmark blocks (graphs, tables, deliverables, money blocks) — not plain text descriptions of what those blocks would look like.

---

## The Problem

The AI model has no awareness of Felmark's block system. When a user types "make a graph of my hours this month," the AI describes a graph in prose instead of outputting a graph block that Felmark can render. Every AI response is flat text because the model doesn't know:

1. What block types exist (60+)
2. How to format output so Felmark can parse it into real blocks
3. What workspace/project context is available
4. That it should act, not describe

---

## How It Works

### The Flow

```
User types in /ai block: "make a graph of my hours this month"
            ↓
System prompt injected (hidden, includes block taxonomy + context)
            ↓
AI returns structured JSON: [{ "type": "graph", "graphType": "bar", ... }]
            ↓
Felmark parser converts JSON → Block[] with real components
            ↓
User sees: an interactive bar chart in their document
```

### System Prompt Template

The hidden prompt is injected before every AI request. It's stored in `lib/ai-prompt.ts` and interpolated with live workspace/project data.

```
You are Felmark AI, an assistant inside a freelancer workspace app. You generate structured blocks, not plain text.

AVAILABLE BLOCKS:

Graph blocks (use when the user asks for any chart, visualization, or data display):
- bar: { type: "graph", graphType: "bar", title: string, data: [{ label: string, value: number }] }
- line: { type: "graph", graphType: "line", title: string, data: [{ label: string, value: number }] }
- donut: { type: "graph", graphType: "donut", title: string, data: [{ label: string, value: number, color?: string }] }
- horizontal-bar: { type: "graph", graphType: "horizontal-bar", title: string, data: [{ label: string, value: number }] }
- sparkline: { type: "graph", graphType: "sparkline", title: string, rows: [{ label: string, values: number[] }] }
- stacked-area: { type: "graph", graphType: "stacked-area", title: string, labels: string[], series: [{ name: string, values: number[] }] }
- metric-cards: { type: "graph", graphType: "metric-cards", cards: [{ label: string, value: string, change?: string, trend?: "up"|"down" }] }

Money blocks (use for financial calculations, budgets, invoicing):
- rate-calculator: { type: "money", moneyType: "rate-calc", hourlyRate: number, hoursPerWeek: number }
- payment-schedule: { type: "money", moneyType: "pay-schedule", milestones: [{ name: string, amount: number, due: string }] }
- expense: { type: "money", moneyType: "expense", items: [{ name: string, amount: number, category: string }] }
- milestone-payment: { type: "money", moneyType: "milestone", title: string, amount: number, status: "pending"|"paid" }
- tax-estimate: { type: "money", moneyType: "tax-estimate", income: number, expenses: number, rate: number }

Content blocks (use for text, structure, lists):
- heading: { type: "h1"|"h2"|"h3", content: string }
- paragraph: { type: "paragraph", content: string }
- callout: { type: "callout", content: string, variant?: "info"|"warning"|"success"|"danger" }
- code: { type: "code", content: string, language?: string }
- table: { type: "table", headers: string[], rows: string[][] }
- todo: { type: "todo", content: string, checked: boolean }
- bullet: { type: "bullet", content: string }
- numbered: { type: "numbered", content: string }
- divider: { type: "divider" }

Data blocks (use for live values, inline metrics):
- status: { type: "data", dataType: "status", status: "active"|"review"|"completed"|"paused"|"overdue" }
- progress: { type: "data", dataType: "progress", value: number, label?: string }
- deadline: { type: "data", dataType: "deadline", date: string, label?: string }
- revenue: { type: "data", dataType: "revenue", value: number, total: number }

Deliverable blocks (use for task tracking, approvals):
- deliverable: { type: "deliverable", title: string, status: "todo"|"in-progress"|"review"|"approved", assignee?: string, dueDate?: string }

RESPONSE FORMAT:
Always respond with a JSON array of blocks. Example:
[
  { "type": "h2", "content": "Monthly Hours Breakdown" },
  { "type": "graph", "graphType": "bar", "title": "Hours by Week", "data": [
    { "label": "Week 1", "value": 12 },
    { "label": "Week 2", "value": 18 },
    { "label": "Week 3", "value": 15 },
    { "label": "Week 4", "value": 22 }
  ]},
  { "type": "paragraph", "content": "Total: 67 hours across 4 weeks. Your busiest week was Week 4." }
]

INTENT MAPPING:
- "make a graph/chart/visualization" → graph block with appropriate graphType
- "calculate/budget/rate/estimate" → money block
- "list tasks/deliverables/todo" → deliverable or todo blocks
- "create a timeline/schedule" → table with date columns
- "summarize/overview" → heading + paragraph + relevant data blocks
- "compare" → horizontal-bar or table
- "breakdown/distribution" → donut chart
- "trend/over time" → line chart or stacked-area
- "metrics/KPIs/stats" → metric-cards

CURRENT CONTEXT:
- Workspace: {{workspace.client}}
- Project: {{project.name}}
- Budget: {{project.amount}}
- Due date: {{project.due}}
- Rate: {{workspace.rate}}
- Projects in workspace: {{workspace.projects}}

RULES:
1. ALWAYS output a JSON array of blocks — never raw text
2. If the user asks for something visual, USE a graph/chart block
3. Mix block types for rich output: heading + graph + summary paragraph
4. Use real data from context when available, sample data when not
5. Keep paragraph blocks concise — the blocks carry the information
6. When unsure which block type, prefer the most visual/interactive option
7. For financial requests, always include a money block with real numbers
8. Never describe what a block would look like — create it
```

---

## Scope

### Deliverables

**D1 — System prompt template**
- [ ] Create `dashboard/src/lib/ai-prompt.ts` with the system prompt
- [ ] Template interpolation: `{{workspace.client}}`, `{{project.name}}`, etc.
- [ ] Export `buildSystemPrompt(workspace, project)` function

**D2 — Response parser**
- [ ] Create `dashboard/src/lib/ai-parser.ts`
- [ ] Parse AI JSON response → Felmark `Block[]`
- [ ] Map each AI block type to the correct Felmark component props
- [ ] Handle graph blocks → `GraphBlock` with `graphType` and `data`
- [ ] Handle money blocks → `MoneyBlock` with `moneyType` and props
- [ ] Handle content blocks → standard `Block` types (h1, paragraph, todo, etc.)
- [ ] Handle data blocks → inline smart block components
- [ ] Handle deliverable blocks → `DeliverableBlock` with status/assignee

**D3 — Fallback handling**
- [ ] If AI returns plain text (not JSON), wrap in paragraph block
- [ ] If AI returns malformed JSON, attempt partial parse, fallback to paragraph
- [ ] If AI returns unknown block type, skip it with a warning callout
- [ ] Always produce at least one block (never empty output)

**D4 — Wire to AI block component**
- [ ] Update the `/ai` block to inject system prompt before API call
- [ ] Pass workspace/project context from Editor props
- [ ] Render parsed blocks inline in the document
- [ ] Loading state: skeleton blocks while AI generates
- [ ] Error state: callout block with retry button

**D5 — Verify**
- [ ] Test: "make a bar chart" → produces GraphBlock with bar type
- [ ] Test: "calculate my rate" → produces MoneyBlock rate calculator
- [ ] Test: "list my deliverables" → produces DeliverableBlock cards
- [ ] Test: "summarize this project" → heading + paragraph + data blocks
- [ ] Test: malformed response → graceful fallback to paragraph
- [ ] `npm run build` passes

### Out of Scope
- Actual AI API calls (Claude/OpenAI) — that's M2. For M1, use mock responses that demonstrate the parsing pipeline
- Streaming generation (blocks appearing one by one)
- AI learning from user edits
- Custom block type creation via AI

---

## Constraints

- No new packages without approval
- System prompt must work with Claude (Haiku for speed, Sonnet for quality) and be model-agnostic
- Response parser must handle partial/malformed JSON gracefully
- All generated blocks must be standard Felmark types — no custom rendering

---

## Affected Files

### New Files
- `dashboard/src/lib/ai-prompt.ts` — system prompt template + builder
- `dashboard/src/lib/ai-parser.ts` — JSON response → Block[] converter

### Modified Files
- AI block component (TBD — wherever `/ai` slash command renders)
- `dashboard/src/components/editor/Editor.tsx` — pass workspace/project context to AI block

### Dependencies (read-only)
- `dashboard/src/lib/types.ts` — Block, Workspace, Project types
- `dashboard/src/components/editor/graphs/GraphBlock.tsx` — graph rendering
- `dashboard/src/components/editor/money/MoneyBlock.tsx` — money rendering
- `dashboard/src/components/editor/deliverable/DeliverableBlock.tsx` — deliverable rendering

---

## Standards to Follow

- [ ] UI/UX Guidelines — loading skeleton, error callout patterns
- [ ] Code review checklist

---

## Notes

- The system prompt is the most critical piece. If the AI doesn't know what blocks exist, it can't generate them. The prompt must be comprehensive but concise — Haiku has limited context.
- The parser is the safety net. Even if the AI hallucinates a block type, the parser maps it to the closest valid type or falls back to a paragraph.
- M1 uses mock responses to prove the pipeline works. M2 wires to Claude API with streaming.
- Future: the system prompt can be extended with user-specific context (their saved templates, past AI generations, workspace-specific terminology).
