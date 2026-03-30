# Session Handoff — 2026-03-30

## What just happened

Massive feature sprint across two days. Built and shipped:

### Conductor Maintenance
- Cleaned the shared skill library so `conductor/skills` and `.claude/commands` no longer carry stale Flutter/INDEP references
- Rewrote 13 skill docs for Felmark's React/Next.js + extension workflow
- Local checkpoint commits created during cleanup:
  - `1c32233` — skill cleanup batch 1
  - `5732e22` — skill cleanup batch 2
  - `b3464c6` — skill cleanup batch 3

### Block Editor Expansions
- **Graph blocks** (7 chart types: bar, line, donut, hbar, sparkline, stacked area, metrics) with full inline data editing, type switching, NaN guards
- **Money blocks** (6 types: rate calc, payment schedule, expenses, milestones, tax estimate, payment button) with sub-picker
- **Deadline blocks** (`/deadline`) — standalone milestone with title, date picker, assignee, completion toggle, auto-status styling
- **Inline date chips** (`@date`) — type @date mid-sentence, pick a date, inserts ember-styled chip inline
- **Deliverable blocks** — added by user, integrated into outline
- **7 more block types** added by user: table, accordion, math, gallery, swatches, before/after, bookmark
- **Block deletion** — gutter × button on every block + Cmd+Shift+Backspace keyboard shortcut
- **Slash Command Checklist** standard created (`conductor/standards/SLASH_COMMAND_CHECKLIST.md`)

### Real Dates (Not Hardcoded)
- `Project.due` converted from display string ("Apr 3") to ISO date (`"2026-04-03"`)
- `Project.daysLeft` removed — computed dynamically via `daysLeft()` utility
- Date pickers on sidebar project rows and workspace home project cards
- Calendar view simplified (`parseDueDate` now just parses ISO strings)

### Sidebar & Navigation
- **Personal workspace segment** — separate from clients, always has at least one (can't archive the last one)
- **Workspace rename** — hamburger menu option + double-click on name
- **Notification bell** — new icon in tab bar right, red badge with count
- **Services icon** in rail (star/tag shape)
- **Templates icon** in rail (document with lines)
- **"The Wire" icon** added by user in rail

### Calendar
- Fixed calendar always showing when `railActive === "calendar"` (no more blank screen trap)
- Double-click calendar event opens the project tab
- Fixed scroll-to-current-hour overshooting (capped to working hours)

### Terminal Welcome
- Fixed hydration mismatch (date/time rendering deferred to client)
- Fixed animation blinking (converted from unmounting `<Line>` components to CSS transitions on stable divs)
- Fixed top cutoff (`height: 100vh` → `height: 100%; flex: 1`, removed `justify-content: center`)
- Removed auto-focus on command input

### Outline Margin
- Widened from 200px to 230px
- Color-coded preview text matching block type colors (terminal-style)
- Drag-to-reorder blocks from the outline
- All new block types integrated (labels, colors, previews)

### Competitive Intelligence
- HoneyBook full feature list + user complaints report (`conductor/HONEYBOOK_COMPETITIVE_INTEL.md`)
- Assembly competitive intel (`conductor/Assembly_Competitive_Intelligence.md`)
- Free-forever pricing positioned as #1 structural advantage

### Mission Docs Created
- `SERVICES_CATALOG.md` — service menu + invoice builder
- `GRAPH_BLOCKS.md` — living charts inside documents
- `MONEY_BLOCKS.md` — financial blocks inside documents
- `DEADLINE_BLOCKS.md` — dates that live where work happens

### Prototypes Saved
- `Prototype/Services.jsx`, `GraphBlocks.jsx`, `MoneyBlocks.jsx`, `Templates.jsx`

## In-progress work

None — all tasks completed.

## Remaining Tasks

- [ ] Wire Services view (`railActive === "services"`) to actual component
- [ ] Wire Templates view (`railActive === "templates"`) to actual component
- [ ] Wire "The Wire" view
- [ ] Build notification panel (bell icon is placed, no panel yet)
- [ ] Connect deadline blocks to calendar view
- [ ] Connect inline @date chips to outline aggregation

## Gotchas

- `EditableBlock.tsx` was fully rewritten to support @date chip detection and inline date picker — if touching this file, be aware of the `handleInput` flow that detects both `/` (slash menu) and `@date` triggers
- Graph blocks have NaN guards on every chart component — don't remove the `|| 0` and `|| 1` guards on value accessors
- The `deleteBlock` function in Editor has a safety check: last block resets to empty paragraph instead of deleting
- `DashboardHome.tsx` prop was renamed from `onNewTab` to `onNewTabInWorkspace` — already fixed in Editor
- Personal workspace uses `personal: true` flag on Workspace interface — the last personal workspace can't be archived (guard in both UI and logic)
