# Mission: nox AI — Rapid Project Creation

**Created**: 2026-03-29
**Status**: Planning
**Milestone**: M1

---

## Goal

A freelancer types one sentence — "Brand guidelines for a yoga studio, $3k budget, due in 2 weeks" — and nox generates a complete project: workspace assignment, document with scope/deliverables/timeline pre-filled, budget breakdown, and calendar events — all in under 3 seconds.

---

## The Problem

Freelancers currently:
1. Create a workspace (or pick one)
2. Create a blank project
3. Manually type the scope doc
4. Set up deliverables as todos
5. Figure out a timeline
6. Manually add calendar events

That's 10-15 minutes of admin before any real work starts. Repeat per project, per client. The friction discourages proper scoping — so freelancers either skip it (and regret it later) or spend time they can't bill.

---

## How nox Works

### Entry Points

1. **Command palette**: `⌘K` → type "nox" or "new project" → opens nox
2. **Slash command**: Type `/nox` in any empty doc → inline nox prompt
3. **Quick action**: "New project" button in WorkspaceHome or sidebar
4. **Empty state**: TerminalWelcome "Start a project" CTA

### The Flow

```
┌──────────────────────────────────────────┐
│  nox                                      │
│                                           │
│  Describe your project...                 │
│  ┌─────────────────────────────────────┐  │
│  │ Brand guidelines for Meridian       │  │
│  │ Studio, $4800 budget, due April 30  │  │
│  └─────────────────────────────────────┘  │
│                                           │
│  ⏎ Generate  ·  ⌘⏎ with template         │
│                                           │
│  Recent: "Website copy for Nora Kim"      │
│          "Onboarding UX for Bolt"         │
└──────────────────────────────────────────┘
          │
          ▼  (generating... 1-2s)
┌──────────────────────────────────────────┐
│  nox — Brand Guidelines                   │
│                                           │
│  ┌─ Project ──────────────────────────┐  │
│  │ Name: Brand Guidelines             │  │
│  │ Client: Meridian Studio  [change]  │  │
│  │ Budget: $4,800           [edit]    │  │
│  │ Due: Apr 30, 2026        [edit]    │  │
│  │ Rate: $95/hr → ~50 hours          │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌─ Scope (editable) ────────────────┐  │
│  │ H1: Brand Guidelines              │  │
│  │ ◆ Client: Meridian Studio — ...   │  │
│  │                                    │  │
│  │ H2: Deliverables                  │  │
│  │ ☐ Logo usage rules (primary +     │  │
│  │   secondary)                       │  │
│  │ ☐ Color palette (hex/RGB/CMYK)    │  │
│  │ ☐ Typography scale & pairings     │  │
│  │ ☐ Imagery direction guide         │  │
│  │ ☐ Social media templates          │  │
│  │                                    │  │
│  │ H2: Timeline                      │  │
│  │ • Week 1-2: Research + moodboard  │  │
│  │ • Week 3: Logo + color system     │  │
│  │ • Week 4: Typography + imagery    │  │
│  │ • Week 5: Templates + delivery    │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌─ Calendar events ─────────────────┐  │
│  │ ◎ Kickoff call — Apr 1            │  │
│  │ ◆ Moodboard delivery — Apr 8      │  │
│  │ ◆ First draft — Apr 18            │  │
│  │ ⚑ Final delivery — Apr 30         │  │
│  └────────────────────────────────────┘  │
│                                           │
│  [Discard]              [Create Project]  │
└──────────────────────────────────────────┘
```

### What nox Generates

From a single sentence, nox produces:

| Output | Source | Editable? |
|--------|--------|-----------|
| **Project name** | Extracted from prompt | Yes |
| **Client match** | Fuzzy-matched to existing workspaces, or creates new | Yes (dropdown) |
| **Budget** | Extracted from prompt | Yes |
| **Due date** | Extracted ("2 weeks" → absolute date) | Yes |
| **Hours estimate** | Budget ÷ workspace rate | Auto-calculated |
| **Scope document** | AI-generated blocks: H1, callout, deliverables (todos), timeline (bullets) | Fully editable in preview |
| **Calendar events** | Milestone dates derived from timeline | Toggleable |

### Intelligence

- **Client matching**: "for Meridian" → matches existing "Meridian Studio" workspace. "for a new yoga studio" → offers to create new workspace.
- **Industry awareness**: Knows what deliverables are typical for "brand guidelines" vs "website copy" vs "email sequence" — freelancer-specific, not generic.
- **Rate calculation**: If workspace has a rate ($95/hr), shows hours estimate alongside budget.
- **Template influence**: If the user has saved templates (from template system), nox can incorporate them as starting structure.
- **History learning**: "Recent" section shows past nox prompts for quick re-runs with variations.

---

## Scope

### Deliverables

**D1 — nox UI shell**
- [ ] Modal component with prompt input, generate button, keyboard shortcuts
- [ ] Recent prompts list (local storage, last 5)
- [ ] CSS module with animations (modal entrance, generating state)
- [ ] Wired to `⌘K` palette as "nox" command entry

**D2 — Parser: extract structured data from prompt**
- [ ] Extract project name, client name, budget, due date from natural language
- [ ] Fuzzy-match client name to existing workspaces
- [ ] Convert relative dates ("2 weeks", "end of month", "April 30") to absolute dates
- [ ] Calculate hours estimate from budget ÷ rate
- [ ] No external API calls — rule-based parsing for M1 (AI backend in M2)

**D3 — Generator: produce project scaffold**
- [ ] Generate scope document as Block[] (H1 title, callout with metadata, H2 sections, todo deliverables, bullet timeline)
- [ ] Deliverable generation based on project type heuristics (brand, web, copy, email, etc.)
- [ ] Timeline generation: split due date into phases based on project type
- [ ] Calendar events from timeline milestones

**D4 — Preview + edit screen**
- [ ] Editable project metadata (name, client dropdown, budget, due date)
- [ ] Block preview of generated scope doc (read-only with inline edit affordance)
- [ ] Calendar event list with toggles (include/exclude)
- [ ] "Create Project" button → creates workspace project, opens doc, adds calendar events

**D5 — Wire to existing systems**
- [ ] Create project in workspace (reuse existing `handleNewTab` + `setWorkspaces` flow)
- [ ] Pre-fill blocks map with generated blocks
- [ ] Add calendar events to CalendarFull event list
- [ ] Open the new project tab automatically
- [ ] `npm run build` passes, no new lint errors

### Out of Scope
- AI/LLM API calls (M2 — rule-based heuristics for M1)
- Invoice generation from nox output
- Multi-project batch creation
- Client approval workflow
- Collaborative editing of nox preview
- nox for non-project use cases (meeting prep, proposal writing)

---

## Constraints

- No new packages without approval
- Parser is rule-based in M1 — regex + keyword matching, not LLM
- Must work offline (no network calls)
- Generated blocks must be standard Block[] — no custom types
- Calendar events integrate with existing CalendarFull event format

---

## Affected Files

### New Files
- `dashboard/src/components/nox/NoxModal.tsx` — modal UI, prompt input, preview
- `dashboard/src/components/nox/NoxModal.module.css` — styles
- `dashboard/src/lib/nox-parser.ts` — extract structured data from prompt
- `dashboard/src/lib/nox-generator.ts` — produce blocks + calendar events

### Modified Files
- `dashboard/src/app/page.tsx` — nox state, wire create-project handler
- `dashboard/src/components/editor/Editor.tsx` — nox trigger from command palette
- `dashboard/src/components/editor/CommandPalette.tsx` — add "nox" command entry

### Dependencies (read-only)
- `dashboard/src/lib/types.ts` — Block, Project, Workspace types
- `dashboard/src/lib/constants.ts` — BLOCK_TYPES, STATUS, COMMANDS
- `dashboard/src/components/calendar/CalendarFull.tsx` — event format reference

---

## Standards to Follow

- [ ] TAB_BAR_BEHAVIOR — new tab opens with correct max-width
- [ ] Code review checklist
- [ ] Polish checklist before shipping

---

## Data Model

### nox Prompt Result (internal, not persisted)

```typescript
interface NoxResult {
  projectName: string;
  clientMatch: { workspaceId: string; client: string } | null;
  newClient: string | null;
  budget: number | null;
  dueDate: string | null;    // ISO date
  daysLeft: number | null;
  hoursEstimate: number | null;
  blocks: Block[];            // generated scope doc
  calendarEvents: {
    title: string;
    date: string;
    type: "meeting" | "work" | "deadline";
  }[];
}
```

### Parser Heuristics (M1)

```
"Brand guidelines for Meridian Studio, $4800 budget, due April 30"
  → projectName: "Brand Guidelines"
  → clientMatch: { workspaceId: "w1", client: "Meridian Studio" }
  → budget: 4800
  → dueDate: "2026-04-30"

"Website copy for a new client, due in 3 weeks"
  → projectName: "Website Copy"
  → clientMatch: null
  → newClient: "New Client"
  → budget: null
  → dueDate: "2026-04-19" (3 weeks from now)
```

### Project Type Heuristics

| Keywords | Type | Typical Deliverables |
|----------|------|---------------------|
| brand, guidelines, identity, logo | branding | Logo rules, color palette, typography, imagery, templates |
| website, web, copy, landing | web-copy | Hero copy, about section, features, CTA, SEO meta |
| email, sequence, campaign, drip | email | Subject lines, body copy per email, CTA strategy, send schedule |
| social, instagram, content, posts | social | Content calendar, post copy, hashtag strategy, template designs |
| proposal, pitch, rfp | proposal | Executive summary, scope, timeline, budget breakdown, terms |
| onboarding, ux, app, flow | ux-design | User flows, wireframes, screen inventory, handoff notes |

---

## Why "nox"

Latin for "night" — the idea that a freelancer's best work happens in those late-night flow states. nox removes the admin so they can stay in the zone. Also: short, typeable, memorable, doesn't conflict with any existing command.

---

## Implementation Phases

### Phase 1 (M1) — Rule-Based nox
- Regex parser for extracting name/client/budget/date
- Heuristic deliverable generation by project type
- Local-only, no API calls
- Basic modal UI with preview

### Phase 2 (M2) — AI-Powered nox
- Claude API integration for smarter parsing and generation
- Context-aware: reads existing workspace data, past projects, templates
- Learns from edits (if user always removes a deliverable, stop suggesting it)
- Streaming generation (blocks appear one by one)

### Phase 3 (M3) — nox Proposals
- Generate client-facing proposals from nox output
- PDF export with branding
- Client approval link (client portal integration)
