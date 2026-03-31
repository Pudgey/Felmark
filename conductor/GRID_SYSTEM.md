# Felmark Grid System — URGENT

**Status:** Concept — needs decision before more UI is built
**Priority:** Critical path — every new component inherits either the right system or technical debt
**Author:** Architecture discussion, March 31 2026

---

## The problem

Every component picks its own widths. The editor is `700px`. Forge Paper is `900px`. The sidebar is `260px`. The share page is `680px`. The Wire is `420px` preview. Finance is `1fr 1fr`. There's no shared grid. No breakpoints. No column system. No spacing scale.

This means:
- Every new feature reinvents layout
- Nothing aligns across views
- Responsive is impossible (nothing responds today)
- Forge Paper can't do intelligent block layout without a grid to snap to
- The dashboard will break on tablet/mobile

## The proposal

A single grid system that is the source of truth for all layout in Felmark. Every component, every page, every block renders within this grid. It lives in forge as the layout engine.

---

## Grid specification

### The 12-column grid

```
|  1  |  2  |  3  |  4  |  5  |  6  |  7  |  8  |  9  | 10  | 11  | 12  |
```

- 12 columns with `1fr` each
- Column gap: `16px` (desktop), `12px` (tablet), `8px` (mobile)
- Row gap: `0` (blocks manage their own vertical spacing)
- Max container: `1200px` centered with `auto` margins
- Padding: `24px` (desktop), `16px` (tablet), `12px` (mobile)

### Spacing scale

All spacing uses a 4px base:

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Between related elements |
| `--space-3` | 12px | Section padding |
| `--space-4` | 16px | Column gap, card padding |
| `--space-5` | 20px | Section margins |
| `--space-6` | 24px | Page padding, major gaps |
| `--space-8` | 32px | Section dividers |
| `--space-10` | 40px | Page sections |
| `--space-12` | 48px | Page header/footer |
| `--space-16` | 64px | Forge Paper margins |

### Breakpoints

| Name | Width | Columns | Behavior |
|---|---|---|---|
| `desktop` | > 1024px | 12 | Full grid, all features visible |
| `tablet` | 768–1024px | 8 | Sidebar collapses, pairs stack to single |
| `mobile` | < 768px | 4 | Single column, rail becomes bottom nav |

### Container variants

| Container | Max width | Columns used | Where |
|---|---|---|---|
| `full` | 100% | 12 | Dashboard layout shell |
| `wide` | 1200px | 12 | Finance, Pipeline, Wire, Calendar |
| `content` | 900px | 10 (centered) | Forge Paper |
| `prose` | 700px | 8 (centered) | Editor, Share page |
| `narrow` | 480px | 6 (centered) | Modals, onboarding |
| `card` | 360px | 4 | Preview panels, side panels |

---

## Block grid mapping (Forge Paper)

Every block type has a default grid column span. Forge Paper's layout engine reads the block type and assigns grid placement automatically.

| Block type | Grid columns | Alignment |
|---|---|---|
| `h1` | 1–12 (full) | Center |
| `h2` | 1–12 (full) | Left, section number in margin |
| `h3` | 2–12 (indented) | Left |
| `paragraph` | 2–11 (narrow) | Left, max `65ch` for readability |
| `bullet`, `numbered`, `todo` | 2–11 | Left, marker in col 1 gutter |
| `quote` | 3–10 (extra indent) | Left, ember border |
| `callout` | 1–12 (full) | Full width card |
| `code` | 1–12 (full) | Full width, mono |
| `table` | 1–12 (full) | Stretches to fill |
| `graph` | 1–12 or 1–6 (half) | Auto-pairs with adjacent graph |
| `deliverable` | 1–6 or 7–12 (half) | Auto-pairs adjacent deliverables |
| `pricing` | 1–12 (full) | Full width table |
| `scope-boundary` | 1–6 + 7–12 | Always two-column |
| `timeline` | 1–12 (full) | Horizontal |
| `signature` | 1–6 + 7–12 | Always two-column |
| `image`, `canvas` | 1–12 or 1–6 | Auto based on content |
| `divider` | 1–12 (full) | Thin line or labeled |
| `columns` | 1–12 (full) | User-defined sub-grid |

### Auto-pairing rules

When two blocks of the same type appear adjacent, the grid engine can pair them side-by-side:

```
deliverable + deliverable → 6 + 6
callout + callout → 6 + 6
graph + graph → 6 + 6
table + graph → 6 + 6
```

When three of the same type appear:
```
deliverable × 3 → 4 + 4 + 4
```

When the viewport is too narrow for pairing → stack to single column.

---

## Dashboard layout grid

The dashboard itself follows the grid:

```
| Rail (56px fixed) | Sidebar (var, 220-520px) | Content (flex: 1) |
```

At tablet breakpoint:
```
| Rail (48px) | Content (flex: 1) |  ← Sidebar becomes overlay
```

At mobile breakpoint:
```
| Content (flex: 1) |
| Bottom nav (56px fixed) |  ← Rail moves to bottom
```

### Content area sub-grids

The content area uses the 12-column grid internally:

- **Editor:** 8-column prose centered within 12
- **Forge Paper:** 10-column content centered within 12
- **Finance:** Full 12-column with 2×2 panel grid
- **Pipeline:** Full 12-column with 5 kanban columns
- **Wire:** 8-column feed + 4-column preview
- **Calendar:** Full 12-column weekly grid
- **Services:** 12-column with card grid
- **Templates:** 12-column with sidebar + card grid

---

## Implementation plan

### Files

```
src/styles/
├── grid.css              ← Grid tokens, container classes, breakpoints
├── spacing.css           ← Spacing scale tokens
└── breakpoints.css       ← Media query tokens

src/forge/
└── layout/
    ├── grid.ts           ← Grid calculation logic for Forge Paper
    ├── containers.ts     ← Container width constants
    └── responsive.ts     ← Breakpoint detection hook
```

### CSS approach

Use CSS custom properties + utility classes, NOT a CSS framework:

```css
/* grid.css */
:root {
  --grid-columns: 12;
  --grid-gap: 16px;
  --grid-max: 1200px;
}

.grid { display: grid; grid-template-columns: repeat(var(--grid-columns), 1fr); gap: var(--grid-gap); max-width: var(--grid-max); margin: 0 auto; }
.col-full { grid-column: 1 / -1; }
.col-prose { grid-column: 3 / 11; }
.col-content { grid-column: 2 / 12; }
.col-half-l { grid-column: 1 / 7; }
.col-half-r { grid-column: 7 / 13; }
.col-third { grid-column: span 4; }

@media (max-width: 1024px) {
  :root { --grid-columns: 8; --grid-gap: 12px; }
  .col-prose { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  :root { --grid-columns: 4; --grid-gap: 8px; }
  .col-half-l, .col-half-r { grid-column: 1 / -1; }
}
```

### Migration order

1. **Add grid tokens** to `globals.css` — spacing scale, breakpoints, container widths. Non-breaking, additive only.
2. **Add container classes** — `.grid`, `.col-*` utilities. No existing code changes.
3. **Wrap Forge Paper body** in the grid. Map block types to column spans. This is the first real consumer.
4. **Wrap Editor `.page`** in the grid for prose width. Replace the hardcoded `max-width: 700px`.
5. **Wrap Finance, Pipeline, Wire** in appropriate containers.
6. **Add responsive breakpoints** — sidebar collapse, rail to bottom nav, pair unstacking.
7. **Add `useBreakpoint()` hook** to forge — components can query current breakpoint.

### What NOT to do

- Don't use Tailwind grid classes — they're verbose and fight CSS modules
- Don't add a grid framework (no Bootstrap, no Chakra grid) — the system is 30 lines of CSS
- Don't migrate everything at once — add the tokens first, migrate one view at a time
- Don't break existing layouts — the grid is additive until a component opts in

---

## Why this is urgent

Every day without the grid system:
- New components hardcode widths that will need changing later
- Forge Paper can't do intelligent auto-layout
- Responsive is impossible
- The dashboard can't scale to tablet/mobile
- Chrome extension users on small screens get a broken experience

The grid is ~30 lines of CSS + a layout function for Forge Paper. It's not a rewrite. It's foundation that every future component builds on.

---

## Decision needed

1. **Adopt the 12-column grid?** (recommended yes)
2. **Add spacing scale tokens now?** (recommended yes — 10 CSS variables)
3. **Start with Forge Paper as first consumer?** (recommended yes — it needs it most)
4. **Target responsive breakpoints?** (recommended: build the tokens now, implement mobile later)

This system makes Felmark look like it was designed by a team of 10. It's the difference between "nice app" and "this feels enterprise."
