# The Grid Canvas — Product Vision

> **Status**: Vision document
> **Created**: 2026-04-01
> **Core thesis**: The canvas IS the product. Blocks are what you put on it. The canvas is where you think.

---

## The Grid

Think graph paper. The entire background is a faint grid — 24x24px cells, barely visible, like a Moleskine dot grid notebook. When you're just using the Workspace, you don't notice it. It's subliminal structure. But the moment you enter edit mode, the grid comes alive: the dots brighten, the cells become droppable targets, and you see the skeleton of your operating system.

Every block snaps to this grid. A 1x1 block occupies a certain number of cells. A 2x1 occupies double width. A 3x2 occupies a big rectangle. The grid eliminates alignment problems — you can't make something ugly because everything snaps. But you can make something *yours* because you choose what goes where.

**8 columns. Fixed width. Infinite vertical scroll.** Horizontal constraint forces clean layouts — you can't sprawl sideways and make a mess. Vertical freedom lets you build as deep as your business needs. A simple freelancer has a short canvas. A power user scrolls deeper.

---

## The Dot Grid — The Skeleton

Every intersection of the 8-column grid has a dot. In normal mode, the dots are barely visible — 2px circles at 4% opacity. You sense structure without seeing it. The moment you click **Edit Canvas**, the dots transform: they grow to 3px, brighten to 18% lavender, and become the visual backbone of the composition surface. Dots that fall under existing blocks fade to 6% — you see where blocks are and where space is available.

This is the Moleskine dot grid idea. The paper has structure but doesn't impose it. You write freely, but everything aligns naturally because the dots are there.

---

## Block Placement Flow

1. Click **+ Add Block** — library panel slides in from the right with block types, each showing icon, name, and default size badge (2x2, 3x3, etc.)
2. Click a block type (e.g., "Active Timer") — cursor changes to crosshair, library closes
3. Move mouse across canvas — a **dashed lavender ghost** follows, snapping to grid cells, showing exactly where the block will land and how big it is
4. A dark bottom bar appears: "PLACING . Active Timer . Click grid to drop" with a Cancel button
5. Click on canvas — block materializes at that position, ghost disappears, back to normal mode

The ghost shows the block name and size (e.g., "2x2 . Click to place") inside the dashed outline. You always know what you're placing and where.

No modals. No menus. Direct manipulation.

---

## Block Sizing & Responsiveness

Resizing: grab any edge or corner of a block and drag. It resizes in grid increments.

**Key insight: blocks are responsive to their grid size, not to the screen.**

- A Revenue Counter at 1x1 = compact number. At 2x1 = number + sparkline. At 3x1 = number + sparkline + trend.
- A Task Board at 2x2 = four columns. At 3x3 = four columns with subtasks visible. At 1x2 = stacked list.
- The block adapts to the space you give it. Same data, different density.

---

## Edit Mode — Composition Controls

Every block gets three layers of edit chrome:

### Top Bar
Frosted glass overlay with: drag handle (cursor: grab), block type name in monospace, size badge ("2x2"), configure button, remove button (turns rose on hover). Uses `backdrop-filter: blur(6px)` so block content is still visible underneath.

### Resize Handles
Three lavender dots appear on hover:
- **Right edge** — horizontal resize (ew-resize cursor)
- **Bottom edge** — vertical resize (ns-resize cursor)
- **Bottom-right corner** — proportional resize (nwse-resize cursor)

Each handle is a 6px lavender circle with white border and subtle shadow. Only appear when hovering the block in edit mode.

### Dashed Border
Blocks switch from solid `var(--border)` to dashed `var(--ink-200)`. On hover, dashes turn lavender. Selected blocks get lavender border with 3px lavender ring.

---

## Block Types — Three Tiers

### Tier 1: Data Blocks
Pull from the Forge and display information. Read-heavy, action-light.

| Block | What It Shows |
|-------|---------------|
| Revenue Counter | Total revenue, sparkline, trend |
| Client Health | Client status indicators |
| Invoice List | Outstanding/paid invoices |
| Activity Feed | Recent actions across workspaces |
| Milestone Tracker | Project milestone progress |
| Rate Calculator | Effective hourly rate |
| Goal Ring | Progress toward financial/project goals |
| Deadline Countdown | Days until next major deadline |

### Tier 2: Action Blocks
These DO things. Inputs, buttons, states. Each replaces a separate app.

| Block | What It Replaces |
|-------|------------------|
| Quick Chat | Email/Slack for client comms |
| Timer | Toggl/Clockify |
| Invoice Builder | FreshBooks/Wave |
| Task Board | Asana/Trello |
| Calendar | Google Calendar widget |
| Automation Rules | Zapier triggers |
| File Drop | Dropbox/Google Drive widget |
| Proposal Wizard | Proposify/Better Proposals |

### Tier 3: Custom Blocks
User-defined data views built from a sentence of dropdowns:

"Show me a **[layout]** of **[source]** where **[filter]** sorted by **[sort]**"

- **Layout**: List / Board / Table / Cards / Calendar / Number / Chart
- **Source**: Tasks / Invoices / Clients / Time Entries / Files / Projects
- **Filter**: [Field] [is/is not/greater than/before/after] [Value] — stackable
- **Sort**: [Field] [ascending/descending]
- **Group**: [Field] — optional

Result: a block indistinguishable from built-in blocks. User names it, picks an icon, drops it on the grid. Refreshes live.

Example: "Upcoming Weddings This Month" = Calendar layout, source: Projects, filter: tag = wedding AND status = active, sort: date ascending. No code. Five dropdowns.

---

## Default Canvas Layout

8 pre-placed blocks demonstrating the system:

**Row 0 (stat blocks, 2x2 each):**
| Block | Value | Color |
|-------|-------|-------|
| Revenue | $14,800 | Sage |
| Outstanding | $9,600 | Rose |
| Rate | $108/hr | Lavender |
| Goal | 74% | Ember |

Each renders value in Cormorant Garamond with progress bar.

**Row 2:** AI Whisper (8x1, full width) — contextual suggestion bar spanning all columns.

**Row 3-5:** Active Tasks (4x3), Activity Feed (2x3), Client Health (2x3).

---

## Hover Effects

### Normal Mode
- 2px colored accent bar draws left-to-right at block bottom on hover
- Box-shadow lifts to `0 8px 28px rgba(0,0,0,0.03)`
- Gentle. Professional.

### Edit Mode
- Dashed border turns lavender
- Resize dots appear
- No lift, no accent line — functional, not decorative

---

## The Library Panel

- Slides in from right at 280px width with 30px shadow
- Header: "Space Blocks" in Cormorant Garamond with close button
- Lavender-tinted hint bar: "Click a block, then click on the canvas to place it."
- 16 block types listed vertically with colored icon badges:
  - Sage = money
  - Lavender = client/data
  - Ember = AI/time
  - Rose = alerts
- Hover slides row 2px right with lavender background
- Click starts placing flow

---

## Footer

- Normal mode: block count ("8 blocks"), grid spec ("8-column grid"), space name ("Dashboard")
- Edit mode: "Editing — drag, resize, + to add."

---

## Templates — The Community Layer

A Template is a saved canvas layout — blocks with pre-configured filters.

### Felmark Templates
Built by Felmark, curated, polished. The onboarding ramp.
- "Freelance Designer Starter"
- "Wedding Photographer Pro"
- "Developer Sprint Dashboard"
- "Consultant Retainer Tracker"

New user picks their niche, gets a complete operating system in one click.

### Community Templates
Built by users, shared in a gallery. Anyone publishes their canvas layout. Others preview (screenshot + block list), install, customize. The Obsidian community plugin model applied to dashboards.

### Team Templates
Share a template with VAs or subcontractors. They see the same layout scoped to their permissions. Photographer shares "Wedding Day" template with second shooter — they see shot list and timeline but not invoices.

Templates evolve like organisms. A photographer installs "Wedding Photographer Pro", customizes it for a month, shares "Luxury Wedding Photographer v2". Another photographer installs, tweaks, shares. Evolution.

---

## Developer Extension — Toolbox (Future)

Developers build custom block types with the Toolbox SDK. Output is still a block that snaps to the grid. Developer writes JavaScript to fetch from external API, render custom UI, expose config options. End user drags it onto canvas like any other block.

Example: "Stripe Revenue Heatmap" block — pulls from Stripe API, renders calendar heatmap of daily revenue. Published to Toolbox. Freelancer installs it, appears in block library, drags onto canvas, configures with their Stripe account. Live. No code seen.

This is the Obsidian plugin model: developers extend, users compose. The canvas is the universal surface.

---

## Competitive Differentiation

### vs. Notion
Notion databases are powerful but abstract — relations, rollups, formulas, linked views. Weeks to learn. Result: a page of database views, not a spatial dashboard.

Grid Canvas is spatial and opinionated. See the canvas, see the grid, drag a block, drop it, it shows data. Mental model: physical desktop, not spreadsheet.

Notion has no "this block DOES something." Notion databases display information. Space Blocks like Timer, Chat, Invoice Builder have buttons, inputs, state changes. They replace apps, not just views.

### vs. ClickUp
ClickUp dashboards are widgets on a page from a fixed set. Can't compose workflows. Can't put Chat next to Timer next to Invoice. ClickUp widgets show data from ClickUp only.

Space Blocks show data AND take action AND connect to external services AND adapt to any industry.

ClickUp customization is settings-heavy (nested menus). Space Blocks are visual — five dropdowns for Custom Block, drag-and-drop for placement, resize handles for density. Customization IS the canvas interaction.

---

## Experience Lifecycle

| Timeframe | What Happens |
|-----------|--------------|
| Day 1 | Sign up, pick niche, get template installed. 8 pre-configured blocks. Add first client. Blocks populate with real data. |
| Week 2 | Rearrange blocks. Move Timer to top. Shrink Calendar to 1x1. Add File Gallery from library. |
| Month 1 | Create Custom Block ("Overdue Tasks Across All Clients"). Save layout as personal space "Morning Triage." |
| Month 3 | Publish canvas as community template: "Brand Designer Dashboard v1." Others install it. |
| Year 1 | Developer builds "Behance Portfolio Stats" block. Designer installs it. Dashboard has a block no competitor could offer — community built it. |

---

## Core Principle

> "What does Felmark Workspace do?" — "Whatever you put on the canvas."

For a photographer, it's a wedding management system. For a developer, it's a sprint dashboard. For a consultant, it's a retainer tracker. Same canvas. Same blocks. Different product for every person.

The grid is the soul.
