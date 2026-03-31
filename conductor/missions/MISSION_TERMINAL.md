# Mission: Felmark Terminal — Command Interface in Split View

**Created**: 2026-03-31
**Status**: Planning
**Milestone**: M2

---

## Goal

A freelancer opens a terminal panel via "Open Split" in the editor and runs slash commands (`/status`, `/rate`, `/wire`, `/pipeline`, `/client`, `/time`, `/invoice`) that return live, richly formatted data blocks — not a real shell, but a command router that queries their business data and renders structured results.

---

## Architecture

### Three Pieces

**1. Command Parser** (`lib/terminal/parser.ts`)
Takes raw input → extracts command + arguments.
```
"/invoice create --client 'Meridian' --amount 4800"
→ { command: "invoice", action: "create", args: { client: "Meridian", amount: 4800 } }
```

**2. Command Registry** (`lib/terminal/commands/`)
Map of command names → async handler functions. Each handler queries state or API, returns JSX.
```
commands/status.tsx  → reads workspaces/projects, returns StatusTable
commands/rate.tsx    → computes effective rate, returns RateCard
commands/pipeline.tsx → reads pipeline data, returns PipelineChart
commands/client.tsx  → looks up client workspace, returns ClientCard
commands/time.tsx    → logs time entry, returns TimeSummary
commands/invoice.tsx → creates invoice record, returns InvoiceConfirm
commands/wire.tsx    → fetches latest Wire signals, returns WirePreview
commands/export.tsx  → triggers document export, returns ExportResult
```

**3. Command Runner** (`lib/terminal/runner.ts`)
Parses input → finds handler → shows loading block → awaits result → renders output. Replaces the current hardcoded `run()` function.

### Folder Structure

```
dashboard/src/
├── components/terminal/
│   ├── Terminal.tsx            ← Main terminal component (UI shell)
│   ├── Terminal.module.css     ← Styles
│   ├── TerminalBlock.tsx       ← Single output block renderer
│   ├── TerminalInput.tsx       ← Input bar with slash autocomplete
│   └── TerminalProvider.tsx    ← Context provider for terminal state
├── lib/terminal/
│   ├── parser.ts              ← Command string parser
│   ├── runner.ts              ← Async command execution engine
│   ├── types.ts               ← TerminalBlock, ParsedCommand, CommandHandler types
│   └── commands/
│       ├── index.ts           ← Command registry (exports all handlers)
│       ├── status.tsx         ← /status — project overview table
│       ├── rate.tsx           ← /rate — effective rate calculator
│       ├── pipeline.tsx       ← /pipeline — deal funnel summary
│       ├── client.tsx         ← /client — workspace lookup
│       ├── time.tsx           ← /time — log hours
│       ├── invoice.tsx        ← /invoice — create/view invoices
│       ├── wire.tsx           ← /wire — Wire signal preview
│       ├── export.tsx         ← /export — document export
│       └── clear.ts           ← clear — reset terminal
```

### Provider Pattern

```tsx
// TerminalProvider wraps the terminal, gives commands access to app state
<TerminalProvider workspaces={workspaces} services={services} blocksMap={blocksMap}>
  <Terminal />
</TerminalProvider>
```

The provider exposes app state via context so command handlers can read workspaces, projects, services, invoices, etc. without prop drilling. New commands just `useTerminalContext()` to access whatever data they need.

### Split View Integration

The terminal opens as a split panel in the editor, categorized separately from document splits:

```
Open Split menu:
├── Documents
│   ├── Brand Guidelines v2
│   ├── Website Copy
│   └── + New document
├── Tools
│   ├── Terminal          ← NEW
│   ├── Conversations
│   └── Comments
```

The terminal panel:
- Opens on the right side (same as current split)
- Resizable via the existing drag handle
- Persists across tab switches (terminal state lives in a ref/context, not per-document)
- Can be closed via the panel's X button

---

## What Makes It Real (vs. Prototype)

| Prototype (Now) | Real (Target) |
|-----------------|---------------|
| Hardcoded `/status` output | Reads `workspaces[].projects[]` from state |
| Static `/rate` numbers | Computes from actual hours + revenue data |
| Fake `/pipeline` data | Reads from pipeline state (when wired) |
| Static `/client` card | Looks up workspace by name, shows real data |
| Simulated `/time` log | Creates time entry in state/Supabase |
| No `/invoice` handler | Creates real invoice record |
| Static `/wire` signals | Fetches from `/api/wire` cache |
| AI suggestions are pattern-matched | Can graduate to Claude call later |

### Phase 1 (M1) — Read-Only Commands
- `/status` — reads workspaces/projects from context
- `/rate` — computes from project amounts + estimated hours
- `/client [name]` — fuzzy-matches workspace, shows details
- `/pipeline` — summarizes projects by status as pipeline stages
- `/wire` — shows cached Wire signals
- `clear` — resets terminal

### Phase 2 (M2) — Write Commands
- `/time log --project "X" --hours N` — creates time entry
- `/invoice create --client "X" --amount N` — creates invoice
- `/export [format]` — triggers document export
- `/scope` — inserts scope boundary block into active document

### Phase 3 (M3) — AI Commands
- Natural language → command routing via Claude
- "how much did Meridian pay me?" → `/client Meridian` → shows lifetime revenue
- "am I on track this month?" → `/rate` + `/status` combined view
- Contextual suggestions based on what the user is typing

---

## Scope

### Deliverables

**D1 — Scaffold terminal folder structure**
- [ ] Create `components/terminal/` and `lib/terminal/` directories
- [ ] Define types: `TerminalBlock`, `ParsedCommand`, `CommandHandler`, `TerminalContext`
- [ ] Create `TerminalProvider` with context exposing workspaces, services, projects, activeProject

**D2 — Command parser**
- [ ] `parseCommand(input)` — extracts command name, action, named args (--key value), positional args
- [ ] Handles quoted strings: `--client "Meridian Studio"`
- [ ] Returns `ParsedCommand` type

**D3 — Command registry + runner**
- [ ] `commands/index.ts` exports `COMMAND_REGISTRY: Record<string, CommandHandler>`
- [ ] `runner.ts` — `executeCommand(parsed, context)` → async, returns JSX
- [ ] Loading state block while command executes
- [ ] Error handling → error output block with retry

**D4 — Read-only commands (Phase 1)**
- [ ] `/status` — table of all projects with status, client, value
- [ ] `/rate` — effective rate from total revenue / total hours
- [ ] `/client [name]` — fuzzy search workspaces, show client card
- [ ] `/pipeline` — group projects by status as pipeline stages
- [ ] `/wire` — show top 3 cached Wire signals
- [ ] `clear` — reset blocks

**D5 — Terminal UI component**
- [ ] Convert prototype to CSS modules
- [ ] Remove inline styles
- [ ] Accept props via TerminalProvider context
- [ ] Slash command palette (already in prototype — wire to registry)
- [ ] AI suggestion ghost line (keep pattern-matched for now)
- [ ] Block output rendering with copy button
- [ ] Welcome block with command hints
- [ ] Scrollable output area with auto-scroll

**D6 — Split view integration**
- [ ] Add "Terminal" option to the split view picker
- [ ] Categorize split options: "Documents" vs "Tools"
- [ ] Terminal opens as right panel with resize handle
- [ ] Terminal state persists across tab switches
- [ ] Close button on terminal panel

**D7 — Verify**
- [ ] `/status` shows real project data from workspaces
- [ ] `/client Meridian` finds and displays Meridian Studio workspace
- [ ] `/rate` computes from actual project data
- [ ] Slash palette filters and autocompletes
- [ ] Terminal opens/closes from split menu
- [ ] `npm run build` passes

### Out of Scope
- Write commands (time, invoice, export) — Phase 2
- AI natural language → command routing — Phase 3
- Real API routes (Supabase queries) — uses client-side state for now
- Terminal history persistence across sessions
- Custom user-defined commands
- Terminal themes/customization

---

## Constraints

- Must run in worktree (Ground Rule #0)
- No new packages (parser is hand-rolled, not minimist)
- Commands read from React context (TerminalProvider), not direct prop drilling
- Each command is a separate file for scalability
- Terminal state (blocks, input history) lives in component state or ref, not global state

---

## Affected Files

### New Files
- `components/terminal/Terminal.tsx` + `.module.css`
- `components/terminal/TerminalBlock.tsx`
- `components/terminal/TerminalInput.tsx`
- `components/terminal/TerminalProvider.tsx`
- `lib/terminal/parser.ts`
- `lib/terminal/runner.ts`
- `lib/terminal/types.ts`
- `lib/terminal/commands/index.ts`
- `lib/terminal/commands/status.tsx`
- `lib/terminal/commands/rate.tsx`
- `lib/terminal/commands/client.tsx`
- `lib/terminal/commands/pipeline.tsx`
- `lib/terminal/commands/wire.tsx`
- `lib/terminal/commands/clear.ts`

### Modified Files
- `components/editor/Editor.tsx` — add Terminal to split view options
- `app/page.tsx` — wrap Editor area with TerminalProvider (or pass context)

---

## Standards to Follow

- [ ] UI/UX Guidelines — monospace terminal aesthetic, warm parchment bg (not dark)
- [ ] Code review checklist
- [ ] Worktree execution (Ground Rule #0)
- [ ] Slash Command Checklist — if terminal commands create blocks in the editor

---

## Notes

- The terminal is NOT a real shell. It's a command router. No `exec`, no `spawn`, no file system access. Every command is a JavaScript function that reads app state and returns JSX.
- The provider pattern is critical for scalability. New commands just import `useTerminalContext()` and have access to everything. No prop threading through 5 components.
- The folder structure (`lib/terminal/commands/`) means adding a new command is: create a file, add it to the registry, done. No changes to the terminal UI.
- The split view categorization ("Documents" vs "Tools") prevents the terminal from feeling out of place next to document tabs. It's a tool, not a document.
- The prototype's visual design (warm parchment bg, ember prompt, block-based output with borders) is already perfect. Just convert inline styles to CSS modules.
