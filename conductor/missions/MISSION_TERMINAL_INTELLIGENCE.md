# Mission: Terminal Intelligence — Ambient AI Business Copilot

**Created**: 2026-03-31
**Status**: Planning
**Milestone**: M2

---

## Goal

The terminal silently watches the freelancer's document, workspace, and business data — then surfaces risks, rate coaching, document gaps, client context, and timing nudges unprompted, at three tiers of urgency (whispers, nudges, alerts), powered by Haiku for speed and Sonnet for depth.

---

## The Vision

The terminal shouldn't feel like a command line. It should feel like a coworker sitting next to you who happens to know everything about your business.

It's always listening. You're writing a proposal for a $6,500 brand identity project. The terminal quietly shows:

> Your last 3 brand identity projects averaged $4,800. This one is 35% higher. Your close rate on proposals above $5k is 40% vs 67% below. Consider adding a payment plan block to reduce sticker shock.

You didn't ask for that. It just appeared. You glance at it. You either act or you don't. It fades after you scroll past.

Not like ChatGPT. Not a conversation. More like a Bloomberg terminal's alert feed mixed with a mentor's sticky notes.

---

## The Five Intelligence Surfaces

### 1. Risk Detection
- Scope section without a scope boundary block
- "Unlimited revisions" mentioned in text
- $4,000 project with no payment schedule
- Deadline 3 days away but project is 20% complete
- Haiku reads text, cross-references project data, flags risks before they become problems

### 2. Rate Coaching
- About to invoice at $100/hr but effective rate on last project was $78/hr due to scope creep
- "This client has paid every invoice within 3 days — consider offering a retainer"
- Rate comparison against market data from The Wire

### 3. Document Completeness
- Proposal without social proof
- Contract without termination clauses
- Invoice without payment terms
- Brand guidelines without digital usage section
- Not a checklist — a sentence explaining *why* it matters

### 4. Client Context
- "Sarah last viewed your proposal 4 days ago but hasn't signed. She opened it 3 times. Last message was about budget concerns."
- Assembled from activity data, surfaced because it's relevant to what you're working on right now

### 5. Timing Nudges
- "You haven't invoiced Nora Kim for the completed milestone. That was 8 days ago."
- "Bolt Fitness invoice is overdue by 4 days. Average collection time increases 3x after 7 days. Send a reminder now?"

---

## Three Tiers of Presence

### Whispers
- Tiny one-line observations in muted text at the bottom of the terminal
- "Meridian proposal: 4 days unsigned."
- Generated on every document focus change
- Fade after scrolling past
- Cost: ~nothing (Haiku, <200ms)

### Nudges
- Small bordered card with insight, reason, and action button
- "Your effective rate on this project just dropped below $100/hr." → [View time breakdown]
- 2-3 per session
- Dismissable

### Alerts
- Red-tinted border, only interruptive tier
- "Invoice #47 is 7 days overdue. $4,000 outstanding." → [Send reminder] [Dismiss]
- Rare — maybe once a day
- Only for things that cost money if ignored

---

## Natural Language Layer

Slash commands stay for power users. Anyone can also type plain English:

- "How much has Meridian paid me total?" → Client summary card
- "Am I on track this month?" → Revenue + hours + pipeline dashboard snippet
- "Write a follow-up email to Sarah about the unsigned proposal" → Drafted email using proposal context + client history
- "What should I charge for a logo redesign for a Series A startup?" → Rate suggestion with reasoning from history + Wire data

---

## Model Routing

| Task | Model | Latency | Cost |
|------|-------|---------|------|
| Whispers | Haiku | <200ms | ~$0.0001 |
| Nudges | Haiku | <300ms | ~$0.0003 |
| Alerts | Haiku | <200ms | ~$0.0001 |
| Quick queries | Haiku | <500ms | ~$0.0005 |
| Email drafts | Sonnet | 1-3s | ~$0.005 |
| Deep analysis | Sonnet | 2-5s | ~$0.01 |
| Wire reports | Sonnet | 3-8s | ~$0.02 |

Terminal routes to the right model based on complexity. Haiku for ambient intelligence (fast, cheap, always-on). Sonnet for heavy lifts (drafting, deep analysis).

---

## Trust Boundary

**The terminal NEVER auto-modifies the document.** It observes and suggests. It never changes text, adds blocks, or sends messages without explicit confirmation. The freelancer is in control. The AI is the advisor, not the author.

---

## Scope

### Deliverables

**D1 — Document context watcher**
- [ ] Create `lib/terminal/watcher.ts`
- [ ] Watches active document blocks via a debounced effect (500ms after last edit)
- [ ] Extracts: document type heuristic (proposal/contract/invoice/brief/notes), block types present, text content summary, dollar amounts mentioned, client name from workspace, project status/deadline
- [ ] Outputs a `DocumentContext` object (<500 tokens) for Haiku consumption
- [ ] Runs in the terminal provider, updates on active project change and block edits

**D2 — API route: `/api/terminal/ambient`**
- [ ] POST route accepting `{ documentContext, businessContext }`
- [ ] `documentContext`: current doc summary from watcher
- [ ] `businessContext`: workspace/project/service/invoice data (reuse wire-context pattern)
- [ ] System prompt instructs Haiku to return 0-3 insights as JSON: `{ tier: "whisper"|"nudge"|"alert", text: string, reason?: string, action?: { label: string, command: string } }`
- [ ] Calls Haiku (claude-haiku-4-5-20251001) with <1000 token context
- [ ] Returns in <300ms

**D3 — API route: `/api/terminal/query`**
- [ ] POST route accepting `{ query, context }`
- [ ] Routes to Haiku for quick queries, Sonnet for complex ones (email drafts, deep analysis)
- [ ] Model selection heuristic: if query contains "write", "draft", "compose", "analyze across" → Sonnet; else → Haiku
- [ ] System prompt includes business context + instructs structured response (text + optional data cards)
- [ ] Returns response formatted for terminal output

**D4 — Whisper/Nudge/Alert rendering in Terminal**
- [ ] Add three new block types to terminal: `whisper`, `nudge`, `alert`
- [ ] `whisper`: muted one-line text at bottom, fades on scroll, no border
- [ ] `nudge`: bordered card with icon, text, reason line, action button
- [ ] `alert`: red-tinted border, text, two buttons (primary action + dismiss)
- [ ] Add styles to Terminal.module.css matching existing terminal aesthetic
- [ ] Dismissed items tracked in session state (don't re-show)

**D5 — Ambient intelligence loop**
- [ ] In TerminalProvider: on document context change, debounce 2 seconds, then call `/api/terminal/ambient`
- [ ] Insert returned whispers/nudges/alerts into terminal blocks
- [ ] Max 1 ambient call per 30 seconds (throttle)
- [ ] Don't call if terminal panel is closed
- [ ] Don't call if document hasn't meaningfully changed (hash the context, skip if same)

**D6 — Natural language query handling**
- [ ] Update terminal input: if input doesn't start with `/`, treat as natural language query
- [ ] Show loading block while awaiting response
- [ ] Call `/api/terminal/query` with the question + current document/business context
- [ ] Render response as a formatted terminal block (text + optional structured data)
- [ ] Support "copy" on response blocks

**D7 — Action routing**
- [ ] Nudge/alert action buttons route to existing app functions:
  - "View time breakdown" → runs `/rate` command in terminal
  - "Send reminder" → opens conversation panel with client pre-selected
  - "Add payment schedule" → inserts money block into document
  - "Open workspace" → navigates to workspace home
  - "View invoice" → opens invoice in services
- [ ] Actions dispatched via TerminalProvider context (which has access to all app handlers)

**D8 — Verify**
- [ ] Open a document → terminal shows ambient whispers/nudges within 3 seconds
- [ ] Type a natural language question → structured answer appears
- [ ] Nudge action button triggers correct app navigation
- [ ] Alert dismiss removes it from the feed
- [ ] Ambient calls throttled (no spam)
- [ ] Terminal closed → no ambient API calls
- [ ] `npm run build` passes

### Out of Scope
- Real Supabase data (uses client-side state for now)
- Email sending (draft only, copy to clipboard)
- Auto-modifying the document (trust boundary)
- Training/fine-tuning on user data
- Conversation history (each query is independent)
- Voice input
- Mobile terminal

---

## Constraints

- Must run in worktree (Ground Rule #0)
- Haiku for ambient + quick queries (<500ms responses)
- Sonnet only for drafting/deep analysis (user-initiated, not ambient)
- Max 1 ambient API call per 30 seconds
- Document context must be <500 tokens (compressed, not raw block dump)
- Business context reuses `buildWireContext()` pattern (<1000 tokens)
- Terminal never auto-modifies the document

---

## Affected Files

### New Files
- `dashboard/src/lib/terminal/watcher.ts` — document context extractor
- `dashboard/src/app/api/terminal/ambient/route.ts` — ambient intelligence endpoint
- `dashboard/src/app/api/terminal/query/route.ts` — natural language query endpoint

### Modified Files
- `dashboard/src/components/terminal/Terminal.tsx` — whisper/nudge/alert blocks, NL input handling
- `dashboard/src/components/terminal/Terminal.module.css` — whisper/nudge/alert styles
- `dashboard/src/components/terminal/TerminalProvider.tsx` — document watcher integration, ambient loop, action routing
- `dashboard/src/lib/terminal/types.ts` — WhisperBlock, NudgeBlock, AlertBlock types

### Dependencies (read-only)
- `dashboard/src/lib/wire-context.ts` — reuse business context builder pattern
- `dashboard/src/lib/types.ts` — Block, Workspace, Project types
- `.env` — ANTHROPIC_API_KEY

---

## Standards to Follow

- [ ] UI/UX Guidelines — whisper/nudge/alert visual hierarchy
- [ ] Slash Command Checklist — if NL queries generate blocks for the editor
- [ ] Code review checklist
- [ ] Worktree execution (Ground Rule #0)

---

## Why This Matters

The terminal isn't a feature. It's the nervous system of Felmark. It connects every part of the product — the editor, the pipeline, the invoicing, the Wire, the time tracker, the client portal — into a single intelligent surface. You never have to navigate away from your document to check on anything. The terminal brings the information to you, at the right time, in the right format, with the right amount of urgency.

Freelancers forget to invoice. They undercharge. They miss scope creep signals. They don't follow up on unsigned proposals. They lose money not because they're bad at their craft, but because they're too busy doing the work to manage the business around it.

The terminal watches the business so the freelancer can focus on the craft.
