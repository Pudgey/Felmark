# Dashboard Home — Design Spec
**Codename:** BRIDGE  
**Inspiration:** PowerShell × Star Trek × Neovim  
**Status:** Concept / Pre-build spec  
**Date:** 2026-04-04

---

## The Idea

The dashboard home is the **bridge display** — the captain's situational awareness surface. Not a productivity app homepage. Not an admin panel. The freelancer opens Felmark and immediately understands the state of their entire operation: money, work, clients, pipeline. All at once. Dark, dense, authoritative.

Each surface has a distinct personality:
- **Workstation** — the studio. Light, editorial, creative work.
- **Workspace** — the cockpit. Operational, split-pane, client management.
- **Dashboard Home** — the bridge. Dark, strategic, business intelligence.

---

## What Makes the Other Surfaces Powertools (Code Analysis)

Before speccing the dashboard, it's worth understanding exactly what earns workstation and workspace their powertool status — from the actual CSS, not opinion.

### The 7 Powertool Signals (observed in codebase)

**1. JetBrains Mono owns ALL data**
Workspace sidebar uses JetBrains Mono at 7px, 8px, 9px, 11px, 16px, 20px for every number and label. Inter (the body font) never touches financial data. The dashboard currently uses Cormorant Garamond for stats — editorial, not instrument.

**2. Tiny ALL CAPS labels above larger bold numbers**
The compression pattern everywhere: `8px / 0.08em letterSpacing / uppercase` label sitting above a `16–20px / 700 weight` mono number. That pairing is the instrument readout. The dashboard has `11px mono label` below a `30px serif number` — the scale is too loose and the serif breaks the instrument feel.

**3. Color is a type system, not decoration**
- Teal `#26a69a` = earned / positive / growing
- Red `#ef5350` = outstanding / overdue / critical  
- Amber `var(--ember)` = active / indicator / selected
- These never swap meanings. The dashboard uses them loosely (green for this month's earnings, amber for in-progress — close but not the same semantic vocabulary).

**4. Razor-thin structural elements**
3px progress bars. 1px border dividers. 5px pulsing dots. 2px tab indicators. No element draws attention to itself — they all serve the data. The dashboard stats have no bars at all (except one sparkline), and the section cards use visible border-radius and padding to create "cards" — a web app pattern, not a tool pattern.

**5. The pulsing dot — life signal**
`ovPulse` animation on a 5px red dot for overdue items. 2s cycle, opacity 0.5→1. This is the only animation on the workspace sidebar. It signals: *this requires your attention right now*. The dashboard has no equivalent urgency signal.

**6. Full-bleed elements that break the container**
The earned sparkline: `width: calc(100% + 32px); margin-left: -16px`. It deliberately overflows its section to fill edge-to-edge. This is a confident, professional move. The dashboard stays inside its boxes.

**7. Transitions at 40–80ms**
`transition: all 0.04s` on hover states. `0.06s` on buttons. `0.08s` on rows. Professional software moves fast. The dashboard inherits these but the visual language around it doesn't reinforce the feeling.

### What the Dashboard Home Currently Gets Wrong

| Element | Current | Should be |
|---------|---------|-----------|
| Section titles | 18px Cormorant Garamond | 9px JetBrains Mono, ALL CAPS, letter-spaced |
| Stat numbers | 30px Cormorant Garamond | Large Cormorant is ok IF the label/context is mono — the number is the ONLY serif element |
| Section containers | White cards, warm-200 border | Dark panels, no card metaphor |
| Urgency | Color on text | Pulsing dot + left border + tinted row |
| Data labels | Below the number | Above the number, compressed |
| Quick actions | Website buttons (border + bg + padding) | Dark bar with flat mono-label buttons |
| Background | Parchment | Deep dark — this is the biggest gap |

---

## Inspiration Breakdown

### PowerShell
- Structured tabular output — data rendered as system output, not UI widgets
- Color-coded by data type: strings one color, numbers another, errors another
- The prompt aesthetic — sections feel like command output blocks
- Monospace as the primary reading font, not just labels
- Output streams: each category of data flows in its own "channel"

### Star Trek (LCARS)
- Amber/orange as the commanding accent — not decorative, structural
- Thick colored header bars on each section panel — the LCARS panel label strip
- Status readouts with ALL CAPS category labels
- Alert states: green (nominal), amber (attention), red (critical)
- Stardate as a real UI element — time/date rendered with ceremony
- Asymmetric layouts — panels of different widths and heights, not a grid of equals
- Rounded end caps on bars and indicators

### Neovim
- Deep warm dark background — not terminal black, more like a colorscheme (Catppuccin Mocha, Dracula, Tokyo Night)
- **Statusline at the bottom** — persistent bar showing: mode, client count, active projects, time, sync state
- Semantic color usage — green/amber/red mean the same thing everywhere, no decorative color
- Gutter column — a thin left strip with indicator dots (like vim's sign column)
- Split-buffer feel — sections feel like named buffers, not cards
- Minimal chrome — the data IS the UI, no box-shadow decoration
- Diagnostic system — errors/warnings surface as inline indicators, not separate panels

---

## Color System

All colors are semantic. No color is used for decoration alone.

| Token | Value | Meaning |
|-------|-------|---------|
| `--bridge-bg` | `#0e0c0a` | Surface background — deep warm near-black |
| `--bridge-surface` | `#151210` | Slightly elevated panels |
| `--bridge-border` | `rgba(255,255,255,0.06)` | Hairline dividers |
| `--bridge-amber` | `#c89360` | Primary accent — LCARS orange / ember (reuse `--ember`) |
| `--bridge-amber-dim` | `rgba(200,147,96,0.15)` | Amber tint for backgrounds |
| `--bridge-teal` | `#26a69a` | Secondary accent — active/connected state |
| `--bridge-green` | `#5a9a3c` | Nominal / healthy / positive delta |
| `--bridge-red` | `#c24b38` | Critical / overdue / alert |
| `--bridge-yellow` | `#d97706` | Attention / pending / watch |
| `--bridge-text-primary` | `#f0ede8` | Main readable text |
| `--bridge-text-secondary` | `rgba(240,237,232,0.5)` | Subdued labels |
| `--bridge-text-dim` | `rgba(240,237,232,0.25)` | Timestamps, metadata |
| `--bridge-label` | `#c89360` | Section label strips (LCARS) |

---

## Typography

| Use | Font | Size | Weight | Case |
|-----|------|------|--------|------|
| Section label strips | JetBrains Mono | 9px | 500 | UPPERCASE |
| Financial headline numbers | Cormorant Garamond | 36–48px | 600 | — |
| Data values (secondary) | JetBrains Mono | 14px | 500 | — |
| Row text | JetBrains Mono | 12px | 400 | — |
| Metadata / timestamps | JetBrains Mono | 11px | 400 | — |
| Alert labels | JetBrains Mono | 10px | 600 | UPPERCASE |
| Statusline | JetBrains Mono | 11px | 400 | — |

Serif (Cormorant) is used only for the largest financial numbers — the headline readouts. Everything else is mono. This is the opposite of workstation (which is serif-heavy). The contrast is intentional.

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  MASTHEAD                                                        │
│  Stardate · greeting · 3 headline financials · alert state      │
├──────────────────────────────┬──────────────────────────────────┤
│  CLIENTS                     │  MISSION LOG (activity)          │
│  Roster with health bars     │  Event stream / sensor log       │
│                              ├──────────────────────────────────┤
│                              │  PIPELINE                        │
├──────────────────────────────│  Stage progression               │
│  DEADLINES                   ├──────────────────────────────────┤
│  Priority queue              │  EARNINGS                        │
│                              │  Revenue chart                   │
└──────────────────────────────┴──────────────────────────────────┘
│  STATUSLINE                                                      │
│  [BRIDGE]  4 clients · 6 projects · $36k pipeline  ●  synced   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section Specs

### MASTHEAD

The full-width header band. This is what you see in the first 0.5 seconds.

- **Background:** `--bridge-bg`, full width
- **Left:** Stardate block
  - Tiny mono label: `STARDATE`
  - Date/time in mono: `2026.04.04 · 09:41`
  - Below: greeting in large serif — `Good morning.` + italic amber accent `Let's build.`
- **Center:** 3 headline readouts, side by side
  - Each: tiny CAPS label above, large Cormorant number below, delta indicator
  - `EARNED THIS MONTH` / `$14,800` / `↑ 40%` (green)
  - `IN PROGRESS` / `$36,200` / `6 projects` (amber)  
  - `OVERDUE` / `$4,000` / `1 invoice` (red — only shows if overdue exists)
- **Right:** 2 action buttons styled as LCARS buttons — amber left border, dark fill, mono label
- **Bottom edge:** A 2px amber line — the LCARS masthead separator

### CLIENTS — "Active Contacts"

Styled as a personnel roster / contacts panel. Not a list of workstations.

- **Section header strip:** 4px left border in amber, label `ACTIVE CONTACTS` in 9px mono caps, right-aligned count
- **Each client row:**
  - Left gutter dot: color = client health (green/amber/red)
  - Avatar (colored square, initials)
  - Client name in `--bridge-text-primary`
  - Below name: project count + owed amount in mono
  - Right: **health bar** — a thin horizontal bar (like a shield meter), filled proportionally, colored by health score. Not a progress bar — more like a power meter. `████████░░`
  - Far right: last active timestamp in dim mono
- **Row hover:** subtle amber tint background, no border

### DEADLINES — "Priority Queue"

Styled as a command queue / task scheduler output.

- **Section header:** `PRIORITY QUEUE` strip
- **Each deadline:**
  - Line number in left gutter (01, 02, 03...) — the neovim gutter aesthetic
  - Status indicator: `[OVERDUE]` in red caps, `[DUE TODAY]` in amber, `[3 DAYS]` in dim
  - Project name
  - Client avatar + name
  - Right: progress bar + percentage
- **Overdue rows:** left border 2px red, slightly elevated background

### MISSION LOG — Activity Feed

Styled as a sensor event log / ship's log.

- **Section header:** `MISSION LOG` strip
- **Each event:**
  - Timestamp left-aligned in dim mono: `09:09`
  - Event type dot (colored by category)
  - Event text in primary text color
  - Below: detail in secondary color
- **No icons** — dots only. The type is communicated by color + text, not icons.
- Feels like reading a log file, not a social feed.

### PIPELINE — "Sector Map"

Not a bar chart. A status progression display.

- **Section header:** `PIPELINE STATUS` strip
- **Visual:** horizontal segmented bar, each segment a stage, proportional to value
  - Colors: blue (lead) → amber (proposed) → green (active) → warm gray (awaiting)
  - Each segment has a rounded cap on left and right edge (LCARS pill segments)
- **Below bar:** stage data in 4 columns — count, value, stage name. Dense mono.
- **Total:** right-aligned `$36.1k TOTAL PIPELINE` in amber

### EARNINGS — "Revenue Trace"

A chart that feels like a system monitor / signal trace.

- **Section header:** `REVENUE TRACE` strip
- **Chart style:** Not bar chart columns — a **line/area chart** with a glowing amber line on dark. The area below the line is a very subtle amber gradient fill. This is the primary visual differentiator: it looks like a signal on an oscilloscope, not a bar chart.
- **Current month highlighted:** the last data point has a bright amber dot, pulsing gently
- **Y-axis values:** left-aligned in dim mono
- **Month labels:** below in dim mono

### STATUSLINE

Persistent bottom bar — the neovim statusline.

- **Background:** slightly lighter than `--bridge-bg`, a thin 1px amber top border
- **Left segment:** `[BRIDGE]` in amber, padded like a vim mode indicator
- **Center:** `4 CLIENTS  ·  6 PROJECTS  ·  $36K PIPELINE`
- **Right segment:** sync state `● SYNCED` in green / `⟳ SYNCING` in amber / `✕ OFFLINE` in red, then the live clock
- Full-width, always visible, never scrolls away

---

## Motion Notes

- **No entrance animations** — data appears immediately. This is a status display, not a landing page.
- **Number changes** animate (the existing `AnimNum` component is correct — keep it)
- **The pulsing dot on the earnings chart** — a gentle `opacity` pulse, 2s cycle, subtle
- **Row hover** — `background` transition 40ms. Fast. This is a terminal, not a web app.
- **Alert states** — overdue rows do NOT animate. They are just visually distinct. No attention-seeking.

---

## What It Must NOT Do

- No white cards or white backgrounds anywhere
- No box shadows (the neovim principle: elevation through color, not shadow)
- No gradient backgrounds on sections
- No icons that look like a SaaS product (emoji-style, rounded icon buttons)
- No "card" metaphor — sections are panels, not cards
- Does not use the parchment/warm-paper language of workstation
- Does not use the dark tab header of workspace (that's workspace's identity mark)

---

## Open Questions for UI/UX Agent

1. **Earnings chart**: line/area vs. a more LCARS-style horizontal bar trace. The area chart feels richer but the horizontal bars are more LCARS-authentic. Which wins?
2. **Client health bar**: `████████░░` block-fill style vs. a smooth gradient bar? Block-fill is more Star Trek / terminal; gradient is more polished.
3. **Gutter column**: Should the left gutter (line numbers / dots) be a persistent element across all sections, or only on deadlines?
4. **Alert state**: If everything is nominal (no overdue, no alerts), should the masthead feel different? Or does it always maintain the same commanding tone?
5. **Quick actions**: LCARS-style buttons (amber left border, flat fill) or keep current button style adapted to dark?
