---
title: Felmark UI/UX Guidelines
version: 1.0
created: 2026-03-30
last_reviewed: 2026-03-30
next_review: 2026-06-30
---

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
```

Statuses: `Active`, `In Progress`, `In Review`, `Overdue`, `Completed`, `Paused`, `Draft`, `Sent`, `Paid`

### 3.5 Avatars

```css
width: 24–40px; height: same;
border-radius: 6–10px;
background: {user.color};
color: #fff;
font-size: 9–16px;
font-weight: 600;
```

Unread badge: absolute positioned, `background: #c24b38`, `border: 2px solid #fff`, `border-radius: 50%`

### 3.6 Section Labels

```css
font-family: var(--mono);
font-size: 9px;
font-weight: 500;
color: var(--ink-400);
text-transform: uppercase;
letter-spacing: 0.1–0.14em;
/* ::after { flex: 1; height: 1px; background: var(--warm-200) } */
```

### 3.7 Dropdown Menus

```css
background: #fff;
border-radius: 10px;
box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
padding: 4px;
animation: fadeIn 0.12s ease;
```

Items: `padding: 8px 10px; border-radius: 6px;` — hover: `background: var(--ember-bg)`

### 3.8 Keyboard Shortcuts

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
Rail (48px) → Sidebar (240px resizable) → Editor Area (flex)
├─ Grid icon → Launchpad overlay
├─ Logo → Dashboard Home
├─ Search → Search screen
├─ Calendar → Full calendar
├─ Pipeline → Pipeline board
├─ Services → Services catalog
├─ Templates → Template library
├─ Finance → Finance (dark mode)
├─ The Wire → Industry signals (PRO)
└─ Settings
```

### 4.2 View Hierarchy

**Level 0 — Overlays:** Launchpad, Search, Command Palette (⌘K)
**Level 1 — Global:** Dashboard, Pipeline, Calendar, Services, Templates, The Wire, Finance
**Level 2 — Workspace:** Workspace Home (per-client)
**Level 3 — Document:** Editor with block system

---

## 5. The Block System

### 5.1 Block Taxonomy (60+ Types)

- **Data Blocks (16):** `{revenue}` `{deadline}` `{status}` `{progress}` `{timer}` `{date}` etc.
- **Money Blocks (6):** Rate calculator, payment schedule, expense, milestone, tax, payment button
- **Graph Blocks (7):** Bar, line, donut, horizontal bar, sparkline, stacked area, metric cards
- **Content Blocks (14):** Headings, callouts, code, table, accordion, dividers, embeds
- **Collaboration Blocks (9):** Comments, mentions, decisions, polls, handoffs, sign-offs
- **Deliverable Blocks (6):** Cards, uploads, previews, approvals, activity, kanban
- **AI Blocks (5):** Summarize, suggest, translate, tone-check, scope-risk
- **Client-Facing Blocks (5):** Accept/decline, selection, scheduling, payment, testimonial

### 5.2 Inline Data Block Pattern

```css
display: inline-flex; align-items: center; gap: 6px;
padding: 3px 10px; border-radius: 6px;
border: 1px solid var(--warm-200); background: #fff;
font-family: var(--mono); font-size: 12px;
```

### 5.3 Card Block Pattern

```
┌─ Head (warm-50 bg, border-bottom) ──────────┐
│  [icon] [title]              [type badge]    │
├─ Body (white bg) ───────────────────────────┤
│  [content: chart / form / list]              │
├─ Footer (optional) ─────────────────────────┤
│  [actions / summary]                         │
└──────────────────────────────────────────────┘
```

---

## 6. Interaction Patterns

### 6.1 Hover States

- **Cards:** `translateY(-1px)` + shadow lift + border shift
- **Rows:** `background: var(--warm-50)` or `var(--ember-bg)` for selected
- **Buttons:** background darkens one step

### 6.2 Active/Selected States

```css
background: var(--ember-bg);
border-color: var(--ember);
border-left: 2px solid var(--ember); /* for list items */
```

### 6.3 Animation Durations

| Animation | Duration | Usage |
|---|---|---|
| Hover | 0.06–0.12s | All hover states |
| Dropdown | 0.12s | Menu open |
| Modal | 0.15–0.2s | Panels, popovers |
| Counter | 0.9–1.2s | Revenue, stats |
| Progress | 0.3–0.5s | Bars, rings |
| Pulse | 2s infinite | Live indicators |

### 6.4 Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` | Command palette |
| `⌘/` | Search |
| `⌘G` | Launchpad |
| `⌘1`–`⌘6` | Navigate screens |
| `⌘⇧P` | New proposal |
| `⌘⇧I` | New invoice |
| `⌘N` | Quick note |
| `/` | Slash command (editor) |
| `{` | Data block (editor) |

---

## 7. Data Patterns

### 7.1 Deadline Urgency

| Condition | Color |
|---|---|
| > 7 days | `var(--ink-400)` |
| 4–7 days | `#5a9a3c` (green) |
| 1–3 days | `#c89360` (amber) + pulse |
| Overdue | `#c24b38` (red) |

### 7.2 Progress Colors

| Completion | Color |
|---|---|
| ≥ 80% | `#5a9a3c` |
| 50–79% | `#b07d4f` |
| 25–49% | `#c89360` |
| < 25% | `#c24b38` |

### 7.3 Event Types

| Type | Color |
|---|---|
| Meeting | `#5b7fa4` |
| Deep Work | `#b07d4f` |
| Deadline | `#c24b38` |
| Personal | `#7c6b9e` |

---

## 8. Special Screens

### 8.1 Finance (Dark Mode)

Only dark screen. `background: var(--ink-900)`. Text at `rgba(255,255,255, 0.85/0.7/0.5/0.3)`.

### 8.2 Terminal Welcome

Claude Code-inspired. Cascading line reveals (220ms stagger). Monospace sections. Command input with autocomplete.

### 8.3 Editor Margins

Left (220px): Document Spine + Block Gutter. Right (260px): Activity feed + inline comments.

---

## 9. Brand Voice

**Tone:** Trusted colleague. Warm, direct, occasionally witty. Never corporate.

**Yes:** "Ready when you are." / "You're $200 away from your $15k goal." / "Let's build."
**No:** "Unlock your full potential!" / "Streamline your workflow today!"

**Greeting:** Time-aware + italic ember accent: "Good afternoon. *Let's build.*"
**Empty states:** Inviting, not empty. Context + clear action.
**Errors:** Direct and helpful. Red for attention, never alarming. Always suggest next action.

---

*This document is the source of truth for all Felmark UI/UX decisions. When in doubt, choose warmth over sterility, density over emptiness, and action over decoration.*

*Leave your mark.*
