# Mission: Canvas Production Refactor

> **Status**: Approved
> **Created**: 2026-04-01
> **Target**: `components/workspace/canvas/`

---

## Problem

`Canvas.tsx` is 1,138 lines — deep red (threshold: 500). It handles grid engine state, drag-to-place, drag-to-move, drag-to-resize, block rendering, block content, replace popover, insertion bars, library panel, toolbar, footer, and dot grid. A new developer opening this file has no idea where to start.

---

## Target Architecture

```
canvas/
├── Canvas.tsx              ← Grid engine + state + layout (~300 lines)
├── Canvas.module.css       ← Grid, dots, ghost, toolbar, footer styles
├── layout.ts               ← Pure layout functions (unchanged)
├── types.ts                ← All canvas types (unchanged)
├── registry.ts             ← BLOCK_DEFS + INITIAL data (new)
├── hooks/
│   ├── useDragPlace.ts     ← Library drag-to-place logic
│   ├── useDragMove.ts      ← Block drag-to-move logic
│   ├── useDragResize.ts    ← Splitter resize logic
│   └── MANIFEST.md
├── chrome/
│   ├── BlockChrome.tsx     ← Chrome bar + responsive modes
│   ├── BlockChrome.module.css
│   ├── ReplacePopover.tsx  ← Block type picker popover
│   ├── ReplacePopover.module.css
│   ├── Splitter.tsx        ← Left/right resize splitter handles
│   ├── Splitter.module.css
│   └── MANIFEST.md
├── toolbar/
│   ├── Toolbar.tsx         ← Top bar (logo, spaces, edit/add buttons)
│   ├── Toolbar.module.css
│   └── MANIFEST.md
├── blocks/
│   ├── BlockContent.tsx    ← Content dispatcher (switches on type)
│   ├── BlockContent.module.css
│   ├── PlaceholderBlock.tsx ← Shimmer placeholder for unbuilt types
│   ├── WhisperBlock.tsx    ← AI Whisper content
│   ├── MetricBlock.tsx     ← Revenue, Outstanding, Rate, Goal content
│   └── MANIFEST.md
├── insertions/
│   ├── RowInsertionBar.tsx ← Horizontal "+" between rows
│   ├── ColInsertionBar.tsx ← Vertical "+" between blocks
│   ├── EmptyRow.tsx        ← Placeholder for empty rows
│   ├── Insertions.module.css
│   └── MANIFEST.md
└── MANIFEST.md             ← Root manifest
```

---

## What Each File Does

### `Canvas.tsx` (~300 lines) — The Grid Engine

State owner. Renders the grid container, dot grid, ghost, blocks, and composes all sub-components. Delegates all interaction logic to hooks.

```tsx
// State
const [blocks, setBlocks] = useState(INITIAL_BLOCK_MAP);
const [rows, setRows] = useState(INITIAL_ROWS);
const [editing, setEditing] = useState(false);
// ... other UI state

// Layout
const layout = useMemo(() => layoutRows(rows, blocks, BLOCK_DEFS, COLS), [rows, blocks]);

// Hooks
const dragPlace = useDragPlace({ blocks, rows, setBlocks, setRows, layout, ... });
const dragMove = useDragMove({ blocks, rows, setRows, layout, ... });
const dragResize = useDragResize({ blocks, setBlocks, layout, ... });

// Render: toolbar, dot grid, blocks (with chrome/splitter), insertions, library, footer
```

### `registry.ts` — Block Definitions + Initial Data

All `BLOCK_DEFS`, `INITIAL_BLOCK_MAP`, `INITIAL_ROWS`, and the `canFitInRow` helper. Constants like `CELL`, `COLS`, `GAP`, `MAX_PER_ROW`, `GRID_W`.

### `hooks/useDragPlace.ts` — Library Drag-to-Place

Encapsulates: `dragging`, `dragCursor`, `placingBlock`, `ghostPos`, `previewLayout` state. Exposes: `startDrag()`, event handlers, ghost/preview data. All the `attachDragListeners` / `startDragWithListeners` logic moves here.

### `hooks/useDragMove.ts` — Block Drag-to-Move

Encapsulates: `movingBlock`, `moveCursor`, preview computation during move. Exposes: `startMove(blockId)`, cursor position, preview layout.

### `hooks/useDragResize.ts` — Splitter Resize

Encapsulates: `resizing` state, the mousedown/mousemove/mouseup logic. Exposes: `startResize(blockId, neighborId, startX, startW, neighborStartW)`, `isResizing`.

### `chrome/BlockChrome.tsx` — Edit Mode Chrome Bar

Props: `block`, `displayW`, `displayH`, `onStartMove`, `onReplace`, `onRemove`. Handles responsive modes (wide/compact/minimal) internally.

### `chrome/ReplacePopover.tsx` — Block Type Picker

Props: `blockType`, `onReplace(newType)`, `onClose`. Renders the BLOCK_DEFS list.

### `chrome/Splitter.tsx` — Resize Handles

Props: `position: "left" | "right"`, `onStartResize`. Renders the splitter line.

### `blocks/BlockContent.tsx` — Content Dispatcher

Props: `block: RenderBlock`. Switches on `block.type` and renders the appropriate content component. This is where future real block implementations will plug in.

### `blocks/MetricBlock.tsx` — Metric Content

Renders label, value (Cormorant Garamond), sub text, optional progress bar. Used by: revenue, outstanding, rate, goal.

### `blocks/WhisperBlock.tsx` — AI Whisper Content

Renders the AI badge, dot, text, action button.

### `blocks/PlaceholderBlock.tsx` — Shimmer Placeholder

Renders label + shimmer rows with colored dots and gradient bars. Used by all types that don't have real content yet.

### `insertions/` — Row and Column Insertion Bars

Extracted from Canvas.tsx. Each component receives the layout data it needs and callbacks.

### `toolbar/Toolbar.tsx` — Top Bar

Props: `editing`, `showLibrary`, `onToggleEdit`, `onToggleLibrary`. Renders logo, space tabs, edit/add buttons, avatar.

---

## CSS Split

| Current (1,033 lines in one file) | Refactored |
|---|---|
| Toolbar styles | `toolbar/Toolbar.module.css` |
| Block chrome, responsive modes | `chrome/BlockChrome.module.css` |
| Replace popover | `chrome/ReplacePopover.module.css` |
| Splitter | `chrome/Splitter.module.css` |
| Block content (whisper, metric, placeholder) | `blocks/BlockContent.module.css` |
| Insertion zones, empty rows | `insertions/Insertions.module.css` |
| Grid, dots, ghost, footer, block shell, transitions | `Canvas.module.css` (~300 lines) |

---

## Migration Rules

1. **No behavior changes** — this is a pure structural refactor. Every feature works exactly the same after.
2. **One concern per file** — each file does one thing.
3. **Props over imports** — sub-components receive callbacks via props, not by importing state.
4. **Types stay centralized** — `types.ts` is the single source of truth for all interfaces.
5. **Registry stays centralized** — `registry.ts` is the single source for block defs and constants.
6. **Every folder gets a MANIFEST.md** — non-negotiable.

---

## Implementation Order

1. Extract `registry.ts` (constants + BLOCK_DEFS + initial data + canFitInRow)
2. Extract `toolbar/Toolbar.tsx` + CSS
3. Extract `blocks/` (BlockContent, MetricBlock, WhisperBlock, PlaceholderBlock) + CSS
4. Extract `chrome/` (BlockChrome, ReplacePopover, Splitter) + CSS
5. Extract `insertions/` (RowInsertionBar, ColInsertionBar, EmptyRow) + CSS
6. Extract `hooks/` (useDragPlace, useDragMove, useDragResize)
7. Slim Canvas.tsx to ~300 lines — grid engine + state + composition
8. Build verify after each extraction
9. Final pass: update all MANIFESTs

Total: ~25 files. Each under 150 lines. Canvas.tsx under 300.
