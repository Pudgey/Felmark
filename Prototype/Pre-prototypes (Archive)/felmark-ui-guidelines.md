# Felmark UI/UX Guidelines

> **Version:** 1.0 · **Date:** March 30, 2026 · **Domain:** tryfelmark.com
> **Tagline:** Leave your mark.

---

## 1. Brand Foundation

### 1.1 What Felmark Is

Felmark is a free-forever workspace where freelancers manage proposals, invoices, projects, and payments in one place. It combines the trust model of Obsidian (free core, no VC pressure), the block editor of Notion, the terminal UX of Warp, and the payment monetization of Wave.

### 1.2 Product Thesis

The freelancer tools market is split: premium tools ($30–50/month) serve the top 0.2%, while the remaining 99.8% cobble together free tools and hope nothing falls through the cracks. Felmark serves the 99.8% with a complete workspace that costs nothing — we monetize only when freelancers get paid (2.9% via Stripe).

### 1.3 Design Philosophy

Three principles guide every Felmark interface:

**Warmth over sterility.** Felmark should feel like a leather-bound notebook, not a SaaS dashboard. Warm earth tones, serif headings, generous whitespace. The aesthetic reference is Game of Thrones — parchment, stone, firelight — translated into modern UI.

**Density without clutter.** Every screen should show the maximum useful information with the minimum visual noise. TradingView's data density, Obsidian's minimalism. No decorative elements. Every pixel earns its place.

**Keyboard-first, mouse-optional.** Power users should be able to navigate the entire app without touching a mouse. Command palette (⌘K), keyboard shortcuts on every action, tab/arrow navigation in all lists.

### 1.4 Visual References

| Reference | What We Take |
|---|---|
| Obsidian | Free-forever trust, plugin architecture, community-first |
| Notion | Block editor paradigm, slash commands, clean flat UI |
| Warp | Terminal energy, command blocks, monospace density |
| Wave | Payment monetization, free core with transaction fees |
| TradingView | Data grids, real-time feeds, information density |
| Bloomberg Terminal | Ticker strips, panel grids, dark mode for finance |

---

## 2. Design Tokens

### 2.1 Color Palette

#### Backgrounds

| Token | Hex | Usage |
|---|---|---|
| `--parchment` | `#faf9f7` | Primary background, editor canvas |
| `--warm-50` | `#f7f6f3` | Secondary background, sidebars, panels |
| `--warm-100` | `#f0eee9` | Hover states, input backgrounds |
| `--warm-200` | `#e5e2db` | Borders, dividers, separators |
| `--warm-300` | `#d5d1c8` | Strong borders, active dividers |
| `--warm-400` | `#b8b3a8` | Disabled states, muted elements |

#### Text

| Token | Hex | Usage |
|---|---|---|
| `--ink-900` | `#2c2a25` | Primary headings, highest contrast |
| `--ink-800` | `#3d3a33` | Secondary headings, bold text |
| `--ink-700` | `#4f4c44` | Primary body text |
| `--ink-600` | `#65625a` | Secondary body text |
| `--ink-500` | `#7d7a72` | Tertiary text, descriptions |
| `--ink-400` | `#9b988f` | Placeholder text, labels |
| `--ink-300` | `#b5b2a9` | Timestamps, hints, metadata |

#### Accent

| Token | Hex | Usage |
|---|---|---|
| `--ember` | `#b07d4f` | Primary accent, CTAs, active states |
| `--ember-light` | `#c89360` | Hover state for ember elements |
| `--ember-bg` | `rgba(176,125,79,0.08)` | Tinted backgrounds for ember elements |

#### Semantic Colors

| Color | Hex | Usage |
|---|---|---|
| Green | `#5a9a3c` | Success, payments received, active, positive trends |
| Blue | `#5b7fa4` | Info, in-review, links, meeting events |
| Red | `#c24b38` | Danger, overdue, errors, alerts |
| Amber | `#c89360` | Warning, urgent deadlines (≤3 days) |
| Purple | `#7c6b9e` | Strategy, personal events, tax estimates |
| Brown | `#8a7e63` | Client avatars, secondary accents |
| Stone | `#a08472` | Client avatars, warm secondary |

#### Semantic Color Patterns

Every semantic color has three expressions:

```css
/* Example: Green */
color: #5a9a3c;                    /* Text / icons */
background: rgba(90,154,60,0.06);  /* Tinted card background */
border: 1px solid rgba(90,154,60,0.10); /* Subtle border */
```

This pattern — `color`, `color + 06` background, `color + 10` border — applies to all status badges, callouts, and typed indicators across the system.

### 2.2 Typography

#### Font Stack

| Font | Role | Weight Range |
|---|---|---|
| **Cormorant Garamond** | Headings, display text, large numbers | 400–700 |
| **Outfit** | Body copy, UI elements, buttons | 300–600 |
| **JetBrains Mono** | Metadata, code, timestamps, labels | 300–500 |

```css
--font-heading: 'Cormorant Garamond', serif;
--font-body: 'Outfit', sans-serif;
--mono: 'JetBrains Mono', monospace;
```

#### Type Scale

| Size | Font | Weight | Usage |
|---|---|---|---|
| 72px | Cormorant Garamond | 500 | Landing page hero |
| 44px | Cormorant Garamond | 500 | Section headlines (marketing) |
| 32px | Cormorant Garamond | 600 | Document H1, page titles |
| 28px | Cormorant Garamond | 500–600 | Dashboard greeting, large stats |
| 22px | Cormorant Garamond | 600 | Document H2, panel titles |
| 18px | Cormorant Garamond | 600 | Section titles, card headers |
| 17px | Cormorant Garamond | 600 | Document H3 |
| 15px | Outfit | 400 | Primary body text |
| 14px | Outfit | 400–500 | Secondary body, card content |
| 13px | Outfit | 400–500 | Compact body, list items |
| 12px | JetBrains Mono | 400–500 | Inline data, small UI labels |
| 11px | JetBrains Mono | 400 | Timestamps, metadata |
| 10px | JetBrains Mono | 400–500 | Monospace labels, badges |
| 9px | JetBrains Mono | 500 | Section labels, category headers |

#### Typography Rules

- **Headings** always use Cormorant Garamond with `letter-spacing: -0.02em`
- **Body text** uses `line-height: 1.75–1.8` for comfortable reading in documents
- **Monospace labels** use `text-transform: uppercase; letter-spacing: 0.06–0.14em`
- **Numbers** in monospace use `font-variant-numeric: tabular-nums` for alignment
- Large financial numbers (stats, totals) use Cormorant Garamond at 28–40px
- Never use Cormorant Garamond below 17px — switch to Outfit at smaller sizes

### 2.3 Spacing & Layout

#### Border Radius

| Size | Usage |
|---|---|
| `2–3px` | Inline badges, tags, small chips |
| `5–6px` | Buttons, inputs, small cards |
| `7–8px` | Cards, panels, form elements |
| `10–12px` | Large cards, modal panels, sections |
| `14–16px` | Full modals, overlays, primary containers |

#### Shadows

```css
/* Hover lift */
box-shadow: 0 2px 10px rgba(0,0,0,0.03);

/* Elevated card */
box-shadow: 0 4px 20px rgba(0,0,0,0.04);

/* Modal / overlay */
box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);

/* Deep modal */
box-shadow: 0 16px 48px rgba(0,0,0,0.15);
```

#### Borders

Default border: `1px solid var(--warm-200)`
Hover border: `1px solid var(--warm-300)`
Active/focused border: `1px solid var(--ember)` with `box-shadow: 0 0 0 3px rgba(176,125,79,0.04–0.06)`

---

## 3. Component Patterns

### 3.1 Buttons

**Primary (dark):** `background: var(--ink-900); color: #fff` — used for main actions
**Primary (ember):** `background: var(--ember); color: #fff` — used for revenue/payment actions
**Ghost:** `border: 1px solid var(--warm-200); background: #fff; color: var(--ink-600)` — secondary actions
**Danger ghost:** `border: 1px solid rgba(194,75,56,0.15); color: #c24b38` — destructive actions

All buttons use `font-family: inherit; font-size: 12–15px; font-weight: 500; border-radius: 5–8px; padding: 7–14px 14–28px`.

### 3.2 Inputs

```css
padding: 10–14px 14–18px;
border: 1px solid var(--warm-200);
border-radius: 7–8px;
font-family: inherit;
font-size: 14–15px;
color: var(--ink-800);
```

Focus state: `border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.04)`
Placeholder color: `var(--warm-400)`

### 3.3 Cards

Standard card pattern:
```css
background: #fff;
border: 1px solid var(--warm-200);
border-radius: 10px;
```

Hover: `border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); transform: translateY(-1px)`
Selected/active: `border-color: var(--ember); box-shadow: 0 0 0 1px var(--ember); background: var(--ember-bg)`

### 3.4 Status Badges

Inline monospace badges using the semantic color pattern:
```css
font-family: var(--mono);
font-size: 9–10px;
font-weight: 500;
padding: 1–2px 6–8px;
border-radius: 3px;
/* Color, background, and border from semantic color */
```

Statuses used across the system: `Active`, `In Progress`, `In Review`, `Overdue`, `Completed`, `Paused`, `Draft`, `Sent`, `Paid`

### 3.5 Avatars

Client/user avatars:
```css
width: 24–40px; height: same;
border-radius: 6–10px;
background: {user.color};
color: #fff;
font-size: 9–16px;
font-weight: 600;
display: flex; align-items: center; justify-content: center;
```

Unread badge: absolute positioned, `background: #c24b38`, `border: 2px solid #fff`, `border-radius: 50%`

### 3.6 Section Labels

Monospace divider labels used throughout:
```css
font-family: var(--mono);
font-size: 9px;
font-weight: 500;
color: var(--ink-400);
text-transform: uppercase;
letter-spacing: 0.1–0.14em;
display: flex; align-items: center; gap: 8px;
/* Followed by ::after { flex: 1; height: 1px; background: var(--warm-200) } */
```

### 3.7 Dropdown Menus

```css
background: #fff;
border-radius: 10px;
box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
padding: 4px;
animation: fadeIn 0.12s ease; /* translateY(4px) → 0 */
```

Items: `padding: 8px 10px; border-radius: 6px;` — hover: `background: var(--ember-bg)`

### 3.8 Keyboard Shortcuts

Displayed as small monospace badges:
```css
font-family: var(--mono);
font-size: 9px;
color: var(--ink-300);
background: var(--warm-100);
border: 1px solid var(--warm-200);
border-radius: 3px;
padding: 1px 5px;
```

---

## 4. Screen Architecture

### 4.1 Navigation Model

```
┌─────────────────────────────────────────────┐
│ Sidebar (left, 48px collapsed / 240px open) │
│  ├─ Grid icon → Launchpad overlay           │
│  ├─ Logo → Dashboard                        │
│  ├─ Search → Search screen                  │
│  ├─ Workspaces list                         │
│  │   ├─ Workspace → Workspace Home          │
│  │   │   └─ Project → Editor                │
│  │   └─ + New workspace                     │
│  ├─ Pipeline                                │
│  ├─ Calendar                                │
│  ├─ Services                                │
│  ├─ Templates                               │
│  ├─ The Wire (PRO)                          │
│  ├─ Finance                                 │
│  └─ Settings                                │
└─────────────────────────────────────────────┘
```

### 4.2 Screen Inventory (45 Components)

#### Core Screens

| Screen | File | Purpose |
|---|---|---|
| Dashboard | `felmark-dashboard.jsx` | Bird's-eye view of entire business |
| Terminal Welcome | `felmark-terminal-welcome-v2.jsx` | Daily briefing empty state |
| Workspace Home | `felmark-workspace-home.jsx` | Per-client overview |
| Editor (with margins) | `felmark-editor-margin.jsx` | Block editor with Document Spine + Block Gutter |
| Activity Margin | `felmark-activity-margin.jsx` | Right-side collaboration layer |
| Pipeline | `felmark-pipeline.jsx` | Kanban deal tracker |
| Calendar | `felmark-calendar-cards.jsx` | Weekly view with rich event cards |
| Services | `felmark-services.jsx` | Service catalog with tiers |
| Templates | `felmark-templates.jsx` | Contract/proposal template library |
| Search | `felmark-search.jsx` | Universal search across everything |
| Finance | `felmark-finance.jsx` | Dark terminal analytics screen |
| The Wire | `felmark-wire.jsx` | Industry intelligence feed (PRO) |
| Launchpad | `felmark-launchpad.jsx` | Grid menu / mission control overlay |
| Landing Page | `felmark-landing.jsx` | Marketing page with waitlist |
| Lead Capture | `felmark-lead-capture.jsx` | Embeddable client intake forms |

#### Block Libraries

| Library | File | Block Count |
|---|---|---|
| Smart Blocks | `felmark-smart-blocks.jsx` | 9 inline data blocks |
| Data Blocks (all 16) | `felmark-data-blocks.jsx` | 16 live data blocks |
| Money Blocks | `felmark-money-blocks.jsx` | 6 financial blocks |
| Graph Blocks | `felmark-graph-blocks.jsx` | 7 chart types |
| Content Blocks | `felmark-content-blocks.jsx` | 14 content types |
| Deliverable Blocks | `felmark-deliverables.jsx` | Task/upload/review system |
| Project Meta Block | `felmark-project-meta.jsx` | Interactive project header |

#### Additional Components

| Component | File |
|---|---|
| Chrome Extension | `felmark-extension.jsx` |
| Proposal Builder | `felmark-proposal.jsx` |
| Settings | `felmark-settings.jsx` |
| Forge Animation | `felmark-forge.jsx` |
| Revenue Landscape | `felmark-revenue-landscape.jsx` |

### 4.3 Screen Hierarchy

**Level 0 — Overlays:** Launchpad, Search, Command Palette (⌘K)
**Level 1 — Global:** Dashboard, Pipeline, Calendar, Services, Templates, The Wire, Finance, Settings
**Level 2 — Workspace:** Workspace Home (per-client)
**Level 3 — Document:** Editor with block system

The user navigates deeper: Dashboard → Workspace → Project → Editor. Each level has a clear back-path via breadcrumbs and the sidebar.

---

## 5. The Block System

### 5.1 Block Architecture

The editor is the core of Felmark. Every document is composed of blocks. Blocks are inserted via slash command (`/`) or curly brace (`{` for data blocks). Each block is a self-contained React component.

### 5.2 Block Taxonomy (60+ Types)

#### Data Blocks (16) — `{block_name}`

Live values pulled from workspace data. Inline, monospace, auto-updating.

`{revenue}` `{deadline}` `{status}` `{progress}` `{timer}` `{date}` `{client.last-message}` `{client.next-meeting}` `{client.lifetime-value}` `{client.response-time}` `{project.hours}` `{project.effective-rate}` `{project.budget-burn}` `{invoice.status}` `{scope.progress}` `{contract.expiry}`

#### Money Blocks (6) — `/money`

Financial calculations and payment actions.

`{rate-calculator}` `{payment-schedule}` `{expense}` `{milestone-payment}` `{tax-estimate}` `{payment}`

#### Graph Blocks (7) — `/graph`

Bar chart · Line chart · Donut chart · Horizontal bar · Sparkline rows · Stacked area · Metric cards

#### Content Blocks (14) — `/`

Heading (H1/H2/H3) · Paragraph · Callout (info/warning/success/danger/quote) · Code block · Table · Accordion · Divider (solid/dotted/dashed/thick/labeled/timestamped) · Math/formula · Image gallery · Color swatches · Before/after slider · Bookmark card · Embed (Figma/Loom/Drive/Notion)

#### Collaboration Blocks (9)

Comment thread · Mention · Question block · Feedback request · Decision block · Poll · Handoff block · Sign-off block · Annotation block

#### Deliverable Blocks (6)

Deliverable card · File upload zone · File preview card · Approval tracker · Activity log · Kanban mini

#### AI Blocks (5)

`{ai.summarize}` `{ai.suggest}` `{ai.translate}` `{ai.tone-check}` `{ai.scope-risk}`

#### Client-Facing Blocks (5)

Accept/decline · Selection (pick A/B/C) · Scheduling · Payment button · Testimonial request

### 5.3 Inline Data Block Design Pattern

All 16 data blocks follow the same visual structure:

```css
display: inline-flex;
align-items: center;
gap: 6px;
padding: 3px 10px;
border-radius: 6px;
border: 1px solid var(--warm-200);
background: #fff;
font-family: var(--mono);
font-size: 12px;
vertical-align: middle;
```

Hover: `border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03)`

Internal anatomy: `[icon] [primary value] [separator] [secondary value] [mini-bar or ring] [percentage] [label]`

### 5.4 Card Block Design Pattern

Larger blocks (money, graph, deliverable) use the card pattern:

```css
background: #fff;
border: 1px solid var(--warm-200);
border-radius: 10px;
overflow: hidden;
```

Internal anatomy:
```
┌─ Head (warm-50 bg, border-bottom) ──────────┐
│  [icon] [title]              [type badge]    │
├─ Body (white bg) ───────────────────────────┤
│  [content: chart / form / list]              │
├─ Footer (optional, warm-50 bg) ─────────────┤
│  [actions / summary]                         │
└──────────────────────────────────────────────┘
```

---

## 6. Interaction Patterns

### 6.1 Hover States

Every interactive element has a hover state. The standard pattern:
- **Cards:** `translateY(-1px)` + shadow lift + border color shift
- **Rows:** `background: var(--warm-50)` or `background: var(--ember-bg)` for selected
- **Buttons:** `background` darkens by one step
- **Links/text:** `color` shifts one ink step darker

### 6.2 Active/Selected States

Selected items use ember tinting:
```css
background: var(--ember-bg);    /* rgba(176,125,79,0.08) */
border-color: var(--ember);
border-left: 2px solid var(--ember); /* for list items */
```

### 6.3 Animations

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| Hover transitions | 0.06–0.12s | ease | All hover states |
| Card lift | 0.12–0.15s | ease | Card hover |
| Dropdown appear | 0.12s | ease | Menu open |
| Modal appear | 0.15–0.2s | ease | Panels, popovers |
| Step transitions | 0.2s | ease | Multi-step forms |
| Number counters | 0.9–1.2s | cubic-bezier (ease-out) | Revenue, stat animations |
| Progress fills | 0.3–0.5s | ease | Bars, rings |
| Pulse | 2s | ease infinite | Live indicators, urgent dots |

### 6.4 Scroll-Triggered Reveals (Landing Page)

```css
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Triggered via `IntersectionObserver` at `threshold: 0.1`. Delay staggered within sections.

### 6.5 Live/Real-Time Indicators

- **Pulsing green dot:** `animation: pulse 2s ease infinite` (opacity 0.4 → 1 → 0.4)
- **Typing indicator:** three dots with staggered animation delays (0, 0.15s, 0.3s)
- **Ticking timestamps:** seconds update via `setInterval` at 1000ms, `font-variant-numeric: tabular-nums`
- **Animated counters:** roll up from 0 to value over 0.9–1.2s with cubic easing

### 6.6 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Command palette |
| `⌘/` | Search |
| `⌘G` | Launchpad |
| `⌘1`–`⌘6` | Navigate to screens |
| `⌘⇧P` | New proposal |
| `⌘⇧I` | New invoice |
| `⌘⇧W` | New workspace |
| `⌘N` | Quick note |
| `⌘J` | Switch workspace |
| `⌘,` | Settings |
| `/` | Slash command (in editor) |
| `{` | Insert data block (in editor) |
| `↑↓` | Navigate lists |
| `⏎` | Confirm / open |
| `⎋` | Close / cancel |
| `Tab` | Autocomplete (command input) |

---

## 7. Special Screens

### 7.1 Finance Screen (Dark Mode)

The Finance screen is the only dark screen in Felmark. It uses `background: var(--ink-900)` with white-on-dark text at reduced opacity:

```css
/* Text hierarchy in dark mode */
color: rgba(255,255,255,0.85);  /* Primary values */
color: rgba(255,255,255,0.7);   /* Secondary text */
color: rgba(255,255,255,0.5);   /* Body text */
color: rgba(255,255,255,0.3);   /* Labels */
color: rgba(255,255,255,0.15);  /* Section headers, gridlines */
color: rgba(255,255,255,0.04);  /* Borders, separators */
```

Charts use semantic colors at reduced opacity. Bars and fills at 0.2–0.4 opacity with full opacity on hover.

### 7.2 The Wire (Premium)

TradingView-style feed with column structure: Time | Type | Signal | Metric | Source. Marked with `PRO` ember badge. Niche-filterable. Relevance-scored. Client signals highlighted.

### 7.3 Terminal Welcome

Claude Code-inspired empty state with cascading line reveals (220ms stagger). Monospace sections with horizontal rule dividers. Command input at bottom with autocomplete suggestions.

### 7.4 Editor Margins

**Left margin (220px):** Document Spine (section dot navigation) + Block Gutter (type labels with line numbers)
**Right margin (260px):** Activity feed with edit indicators, typing indicators, inline comments, session timeline

Margins sync with editor on hover — highlighting corresponding elements across the boundary.

---

## 8. Data Patterns

### 8.1 Deadline Urgency Colors

| Condition | Color | Behavior |
|---|---|---|
| > 7 days | `var(--ink-400)` | Neutral |
| 4–7 days | `#5a9a3c` (green) | Healthy |
| 1–3 days | `#c89360` (amber) | Urgent, pulsing dot |
| Overdue | `#c24b38` (red) | Red text, "Xd overdue" |

### 8.2 Budget Burn Colors

| Consumed | Color |
|---|---|
| < 70% | `#5a9a3c` (green) |
| 70–89% | `#c89360` (amber) |
| ≥ 90% | `#c24b38` (red) |

### 8.3 Progress Ring Colors

| Completion | Color |
|---|---|
| ≥ 80% | `#5a9a3c` (green) |
| 50–79% | `#b07d4f` (ember) |
| 25–49% | `#c89360` (amber) |
| < 25% | `#c24b38` (red) |

### 8.4 Event Type Colors (Calendar)

| Type | Accent Color | Rail Color |
|---|---|---|
| Meeting | `#5b7fa4` (blue) | Blue |
| Deep Work | `#b07d4f` (ember) | Ember |
| Deadline | `#c24b38` (red) | Red |
| Personal | `#7c6b9e` (purple) | Purple |

---

## 9. Responsive Considerations

### 9.1 Breakpoints

| Width | Layout |
|---|---|
| ≥ 1200px | Full sidebar + content + right panel |
| 900–1199px | Collapsed sidebar + content + right panel |
| 600–899px | No sidebar + full-width content |
| < 600px | Mobile: stacked layout, bottom nav |

### 9.2 Adaptive Density

Calendar cards, pipeline cards, and data blocks adapt their content based on available space:
- **Full:** All metadata visible (title, client, status, progress, attendees, time)
- **Compact (< 60px height):** Title + client only
- **Tiny (< 44px height):** Title only, single line

---

## 10. Implementation Notes

### 10.1 Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| UI | React components (all prototyped as `.jsx`) |
| Styling | CSS-in-JS via `<style>` tags (migration path to CSS Modules or Tailwind) |
| Fonts | Google Fonts (Cormorant Garamond, Outfit, JetBrains Mono) |
| Auth | Supabase or Clerk |
| Database | Supabase (Postgres) |
| Payments | Stripe Connect (2.9% processing) |
| Real-time | Supabase Realtime or Liveblocks |
| Deployment | Vercel |

### 10.2 CSS Variable Import

Every component imports the same root variables. In production, these live in a global stylesheet:

```css
:root {
  --parchment: #faf9f7;
  --warm-50: #f7f6f3;
  --warm-100: #f0eee9;
  --warm-200: #e5e2db;
  --warm-300: #d5d1c8;
  --warm-400: #b8b3a8;
  --ink-900: #2c2a25;
  --ink-800: #3d3a33;
  --ink-700: #4f4c44;
  --ink-600: #65625a;
  --ink-500: #7d7a72;
  --ink-400: #9b988f;
  --ink-300: #b5b2a9;
  --ember: #b07d4f;
  --ember-light: #c89360;
  --ember-bg: rgba(176,125,79,0.08);
  --mono: 'JetBrains Mono', monospace;
}
```

### 10.3 Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
```

### 10.4 Component File Convention

All components are self-contained `.jsx` files with inline styles. Each exports a single default React component. All use the same design tokens. Components are located at `/mnt/user-data/outputs/felmark-*.jsx`.

### 10.5 MVP Priority

**Phase 1 — Ship the landing page:**
- `felmark-landing.jsx` → deploy to tryfelmark.com
- Email capture via Supabase or simple form backend
- Start collecting waitlist signups

**Phase 2 — One end-to-end flow:**
- Auth (Supabase)
- Workspace creation
- Block editor (basic: headings, paragraphs, todos, callouts)
- Proposal → Contract → Invoice → Payment via Stripe
- This is the flow that proves the product

**Phase 3 — Expand the system:**
- Smart blocks (data blocks pulling from real project data)
- Pipeline
- Calendar
- Services → Invoice flow
- Templates
- Search

**Phase 4 — Premium:**
- The Wire (industry intelligence)
- AI blocks
- Advanced analytics (Finance screen)
- Chrome extension
- Lead capture embeds

---

## 11. Brand Voice

### 11.1 Tone

Felmark speaks like a trusted colleague, not a corporation. Warm, direct, occasionally witty. Never corporate jargon. Never condescending.

**Yes:** "Ready when you are." / "You're $200 away from your $15k goal." / "Let's build."
**No:** "Unlock your full potential!" / "Streamline your workflow today!" / "Get started for free!"

### 11.2 Greeting Pattern

Time-aware greeting: "Good morning/afternoon/evening." followed by an italic ember-colored phrase: "*Let's build.*"

### 11.3 Empty States

Empty states should feel inviting, not empty. Use the Terminal Welcome pattern: a greeting, context about what should go here, and a clear action to take. Never show a blank white screen with a "Create your first X" button.

### 11.4 Error States

Errors are direct and helpful: "Invoice #044 is 4 days overdue" not "Payment status: Past due." Red for attention but never alarming. Always suggest a next action.

---

*This document is the source of truth for all Felmark UI/UX decisions. Every component, screen, and interaction should reference these guidelines. When in doubt, choose warmth over sterility, density over emptiness, and action over decoration.*

*Leave your mark.*
