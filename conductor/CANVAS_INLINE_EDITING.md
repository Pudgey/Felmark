# Canvas Inline Editing — Click-to-Replace + Row Insertion Bar

> **Status**: Design spec
> **Created**: 2026-04-01
> **Applies to**: `components/workspace/canvas/`
> **Depends on**: Smart Spacing v2 (row-based layout)

---

## Overview

Two features that make the canvas editable in-place without drag-and-drop:

1. **Click-to-replace** — click a block in edit mode, pick a new type, it swaps in-place. Nothing moves.
2. **Row insertion bar** — hover between rows to reveal a "+" button. Click to insert a new row or add a block to an adjacent row.

Together they cover the two most common editing actions: "I want different content here" and "I want more content between these rows."

---

## Feature 1: Click-to-Replace

### Interaction Flow

1. User is in **edit mode** (already has dashed borders, chrome bars visible)
2. User clicks the **configure button** (gear icon) on any block's chrome bar
3. A **popover** appears anchored below the chrome bar, showing the block type picker
4. User clicks a block type → the block swaps in-place:
   - Same row, same position in the row's block list
   - Same width (keeps the current distributed width)
   - Type, label, color, icon all change to the new type
   - Content re-renders for the new type
   - Row height recalculates if `defaultH` changed (animated via CSS transitions)
5. Popover closes automatically after selection

### Popover Design

- Anchored to the block, positioned below the chrome bar (or above if near bottom of viewport)
- Width: 240px
- Background: `var(--card)`, border: `1px solid var(--border)`, border-radius: 12px
- Shadow: `0 8px 24px rgba(0,0,0,0.06)`
- Header: "Replace Block" in mono 9px uppercase
- List: same items as the library panel — icon badge, name, default size
- Hover: lavender background slide
- Current type is highlighted with a subtle lavender dot
- Click outside or press Escape closes the popover
- Animation: scale from 0.95 + fade in, 150ms

### Data Change

On replace, update the block in the `blocks` map:
```ts
setBlocks(prev => ({
  ...prev,
  [blockId]: {
    ...prev[blockId],
    type: newDef.type,
    label: newDef.label,
    color: newDef.color,
    w: prev[blockId].w,  // keep current width
    value: undefined,     // clear old content
    sub: undefined,
  }
}));
```

The row doesn't change at all. `layoutRows` recalculates height based on the new type's `defaultH`. CSS transitions animate the height change.

### Edge Cases

- Replacing a wide block (e.g., Whisper at 8 cols) with a narrow-max block (e.g., Timer maxW:4): the block's `w` stays at 8 in the `blocks` map, but `distributeWidth` will respect the new type's `maxW` and redistribute the excess to other blocks in the row. If it's the only block in the row, it gets capped at `maxW` and the remaining columns are empty (force-filled back to the block anyway since it's the only one).
- Replacing with the same type: no-op, just close the popover.

---

## Feature 2: Row Insertion Bar

### Visual Design

Between every pair of rows, render a **24px tall hover zone**. This zone is invisible by default — no visual noise when not interacting.

**On hover:**
- A 1px dashed line appears at the vertical center of the zone, spanning the full grid width
- Line color: `var(--ink-200)`, transitions to `var(--lavender)` on hover
- A centered circle button appears on the line:
  - 24px diameter, `var(--card)` background, `1px solid var(--border)` border
  - "+" text in `var(--ink-400)`, 12px
  - On hover: border turns lavender, "+" turns lavender, subtle scale(1.05)
- The zone also appears below the last row (for appending)

**On click:**
- Inserts a new empty row at that position
- The new row shows a **placeholder state**: a dashed-border rectangle spanning 8 columns, 2 rows tall, with centered text: "Drag a block here or click +" in mono 11px `var(--ink-300)`
- The library panel opens automatically, pre-targeted to fill this new row
- When a block is added to the placeholder row (via library drag or by clicking a type), the placeholder disappears and the block fills the row normally

### Implementation

The insertion bars are rendered based on the `layout` output. Between each pair of consecutive y-positions (row boundaries), render an insertion zone.

```tsx
// Compute row boundaries from layout
const rowBoundaries: number[] = [];
let lastY = -1;
for (const lb of layout) {
  if (lb.y !== lastY) {
    rowBoundaries.push(lb.y);
    lastY = lb.y;
  }
}
// Add boundary after last row
const lastBlock = layout[layout.length - 1];
if (lastBlock) rowBoundaries.push(lastBlock.y + lastBlock.h);

// Render insertion zones at each boundary
{rowBoundaries.map((y, i) => (
  <InsertionBar key={`ins-${i}`} y={y} onInsert={() => insertRowAt(i)} />
))}
```

The `InsertionBar` component:
- Positioned absolutely at `top: y * (CELL + GAP) - 12` (centered on the row boundary)
- Full grid width
- Only visible in edit mode
- Contains the hover line and "+" button

### Insertion Logic

```ts
const insertRowAt = (rowIndex: number) => {
  const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [] };
  setRows(prev => [
    ...prev.slice(0, rowIndex),
    newRow,
    ...prev.slice(rowIndex),
  ]);
  // Open library, set target row to the new empty row
  setShowLibrary(true);
  setInsertTarget(rowIndex);
};
```

Empty rows render as a placeholder until they have blocks. When a block is dragged or selected from the library while `insertTarget` is set, it goes into that specific row.

### Edge Cases

- **Empty row cleanup**: if the user opens the library via insertion bar but then closes it without adding a block, the empty row should be removed automatically. Track empty rows and clean up on library close.
- **Multiple insertion bars**: only show one "active" bar at a time. If the user hovers between row 1-2, the bar between row 2-3 shouldn't also be visible.
- **Scroll position**: insertion bars should be positioned correctly even when the canvas is scrolled.

---

## CSS Classes Needed

### Click-to-Replace Popover

```
.replacePopover        — positioned absolute, anchored to block
.replacePopoverHeader  — mono uppercase header
.replacePopoverList    — scrollable list of block types
.replacePopoverItem    — same as library item styling
.replacePopoverActive  — current type indicator (lavender dot)
```

### Row Insertion Bar

```
.insertionZone      — 24px tall, full width, invisible by default
.insertionZoneHover — visible on hover (line + button appear)
.insertionLine      — 1px dashed line spanning full width
.insertionBtn       — 24px circle with "+"
.insertionBtnHover  — lavender accent on hover
.emptyRow           — placeholder for empty rows (dashed border, centered text)
```

---

## State Changes in Canvas.tsx

New state:
```ts
const [replaceTarget, setReplaceTarget] = useState<string | null>(null);  // block ID being replaced
const [insertTarget, setInsertTarget] = useState<number | null>(null);     // row index for insertion
```

The configure button (`gear icon`) on the chrome bar gets an onClick:
```ts
onClick={() => setReplaceTarget(block.id)}
```

---

## Implementation Order

1. **Click-to-replace**: wire the gear button → popover → block type swap. ~60 lines TSX + ~40 lines CSS.
2. **Row insertion bar**: render zones between rows → "+" button → insert empty row → placeholder state. ~50 lines TSX + ~30 lines CSS.
3. **Library targeting**: when `insertTarget` is set, dropped blocks go to that specific row instead of the default row-finding logic. ~10 lines.
4. **Empty row cleanup**: remove empty rows when library closes without a block being added. ~5 lines.

Total: ~120 lines TSX + ~70 lines CSS. No new files — all additions to Canvas.tsx and Canvas.module.css.

---

## What This Enables

| Before | After |
|--------|-------|
| Replace a block: remove → reshuffles → re-add → find row → resize | Click gear → pick type → done. Nothing moves. |
| Add content between rows: drag from library → hope it lands right | Click "+" between rows → library opens → block fills the new row |
| Canvas feels like: drag-and-drop grid | Canvas feels like: editable document with blocks |
