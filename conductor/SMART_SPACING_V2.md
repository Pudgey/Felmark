# Smart Spacing v2 — Row-Based Layout Engine

> **Status**: Design spec (replaces SMART_SPACING.md)
> **Created**: 2026-04-01
> **Applies to**: `components/workspace/canvas/`
> **Supersedes**: SMART_SPACING.md (v1 — absolute positioning with collision/compaction/auto-fill)

---

## Why v2

v1 used absolute x,y positioning with four layered passes (collision resolution, upward compaction, row packing, auto-fill). This created unsolvable "puzzle piece" gaps — blocks at arbitrary positions with different heights leave voids that no algorithm can cleanly fill. The more blocks on the canvas, the worse it gets.

v2 adopts Bootstrap's proven model: **rows, not coordinates.** The canvas is a vertical stack of rows. Each row fills all 8 columns. Blocks within a row match heights. There are no gaps by construction — the layout is always clean because the rules prevent gaps from existing in the first place.

---

## Core Model

### The Canvas is a Stack of Rows

```
Row 0:  [ Revenue 2 ][ Outstanding 2 ][ Rate 2 ][ Goal 2 ]     = 8 cols
Row 1:  [ AI Whisper 8 ]                                         = 8 cols
Row 2:  [ Tasks 4 ][ Activity 2 ][ Health 2 ]                    = 8 cols
```

Each row:
- Contains 1+ blocks whose widths sum to exactly 8 columns
- Has a single height determined by the tallest block in the row
- Stacks directly below the previous row (no vertical gaps)

### Block Data Model

```ts
interface CanvasBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  w: number;           // width in grid units (1-8)
  value?: string;
  sub?: string;
  userSized?: boolean;  // user manually set width — don't auto-distribute
}

interface CanvasRow {
  id: string;
  blocks: string[];     // ordered block IDs, left to right
  height: number;       // row height in grid units (derived from tallest block)
}
```

Blocks no longer store `x`, `y`, or `h`. These are derived:
- **x** = sum of widths of all blocks before this one in its row
- **y** = sum of heights of all rows above this one
- **h** = the row's height (all blocks in a row share it)

### Block Type Definitions

```ts
interface BlockTypeDef {
  type: string;
  label: string;
  icon: string;
  color: string;
  defaultW: number;     // width when first placed
  minW: number;         // smallest width allowed
  maxW: number;         // largest width allowed
  defaultH: number;     // height contribution (sets row height if tallest)
  minH: number;         // minimum row height this block needs
  expandAxis: "both" | "width" | "height" | "none";
}
```

Height is a property of the row, not the block. But each block type has a `defaultH` and `minH` that influence the row's height calculation.

---

## Layout Algorithm: `layoutRows`

One function replaces all four v1 passes. Input: ordered list of rows with block references. Output: a flat list of blocks with computed x, y, w, h for rendering.

### Step 1 — Distribute Widths Per Row

For each row, check if blocks sum to 8:
- If sum < 8: distribute remaining columns among non-userSized blocks, proportional to their current width. Round down, give remainder to the widest block.
- If sum = 8: no change.
- If sum > 8: this shouldn't happen (placement prevents it), but if it does, shrink the last block to fit.

All blocks respect their `minW` and `maxW` during distribution.

### Step 2 — Compute Row Heights

For each row, the height = max(`defaultH`) across all blocks in the row. Minimum = max(`minH`) across all blocks.

If a block's type has `expandAxis: "none"` or `expandAxis: "width"`, its `defaultH` still influences the row but it won't be stretched beyond its own `defaultH` visually (content stays at natural height, the cell just has padding).

### Step 3 — Compute Positions

Walk rows top to bottom:
- Row y = sum of all previous row heights (in grid units), plus gaps
- Block x = sum of widths of blocks before it in the row
- Block w = the distributed width from step 1
- Block h = the row's computed height

Output: `{ id, x, y, w, h }` for every block — ready for absolute positioning in CSS.

### Signature

```ts
function layoutRows(
  rows: CanvasRow[],
  blocks: Map<string, CanvasBlock>,
  defs: BlockTypeDef[],
  cols: number,
): { id: string; x: number; y: number; w: number; h: number }[]
```

---

## Placement Rules

### Adding a Block

When the user drops a block from the library:

1. **Determine target row.** Based on the drop y-coordinate, find which row the user is targeting. If they drop between rows, insert a new row at that position.

2. **Check if it fits.** Sum the widths of the target row's blocks + the new block's `defaultW`. If sum <= 8, insert the block into the row at the appropriate x position. If sum > 8, create a new row below and place the block there.

3. **Run `layoutRows`.** Recompute all positions. The row auto-distributes widths to fill 8 columns. Heights auto-match.

### Removing a Block

1. Remove the block from its row.
2. If the row is now empty, remove the row entirely.
3. Run `layoutRows`. Remaining blocks in the row expand to fill 8 columns. Row heights recompute. Everything below shifts up.

### Reordering Blocks

Drag a block within its row to change left/right order. Drag between rows to move it to a different row. The layout engine handles the rest.

---

## Row Height Rules

| Scenario | Row Height |
|----------|-----------|
| All blocks same `defaultH` | That height |
| Mixed heights (e.g., 2 and 3) | The tallest (`3`) |
| Single block in row | That block's `defaultH` |
| Block with `expandAxis: "none"` | Still contributes its `defaultH` to the row max, but its content renders at `defaultH` with the cell stretching to fill |

The row height is always the max `defaultH` of its blocks, floored at the max `minH`. This guarantees blocks never get squished below their minimum.

---

## Width Distribution Rules

The algorithm for distributing columns within a row:

```
distributeWidth(row, blocks, defs, cols = 8):
  total = sum of block widths
  if total == cols: done
  if total < cols:
    deficit = cols - total
    expandable = blocks where !userSized and w < maxW
    if no expandable blocks: give all deficit to the last block (force fill)
    else:
      while deficit > 0 and expandable blocks exist:
        give 1 column to the widest expandable block (ties: leftmost)
        if that block hits maxW, remove from expandable
        deficit--
  if total > cols:
    shrink last block to fit (this is an error state, shouldn't happen)
```

### Examples

| Blocks in row | Initial widths | After distribution | Result |
|---------------|---------------|-------------------|--------|
| 1 block | 2 | 2 → 8 | Full width |
| 2 blocks | 2, 2 | 2→4, 2→4 | Equal split |
| 3 blocks | 2, 3, 2 | 2→3, 3→3, 2→2 | Proportional (respecting maxW) |
| 4 blocks | 2, 2, 2, 2 | All → 2 | Already fills 8 |
| 2 blocks (one userSized) | 3*, 2 | 3, 2→5 | userSized stays, other fills |

*asterisk = userSized

---

## Interaction with Edit Mode

### Normal Mode
Blocks render at their computed positions. No visible grid structure — just clean cards stacked in rows.

### Edit Mode
- Dot grid appears (same as v1)
- Blocks get dashed borders, chrome bars, resize handles
- **Resize handles only adjust width** (drag left/right edge). Height is controlled by the row.
- Dragging a block horizontally reorders it within its row
- Dragging a block vertically moves it to a different row
- The "+" button adds a block — it goes into the last row if there's room, otherwise creates a new row

### Ghost Preview During Drag
When dragging a block from the library:
- Show which row it would land in (highlight the row)
- Show how the row's blocks would redistribute width
- Show the ghost at its target position within the row
- All of this is computed by running `layoutRows` with the phantom block included

---

## What This Eliminates

| v1 Problem | v2 Solution |
|-----------|-------------|
| Puzzle-piece gaps between blocks | Rows always sum to 8 — gaps impossible |
| Height mismatches in same visual row | All blocks in a row share one height |
| Massive vertical voids | Rows stack flush — no empty space between |
| 4 layered passes (collision, compact, rowPack, autoFill) | 1 pass: `layoutRows` |
| Blocks at arbitrary x,y coordinates | Blocks positioned by row membership and order |
| Complex auto-fill heuristics | Simple width distribution per row |

---

## Migration from v1

### Data Model Change
v1 blocks: `{ id, x, y, w, h, type, label, color, value?, sub?, userSized? }`
v2 blocks: `{ id, w, type, label, color, value?, sub?, userSized? }` + row membership

To migrate the initial blocks:
```
Row 0: [Revenue w:2] [Outstanding w:2] [Rate w:2] [Goal w:2]    → sums to 8
Row 1: [Whisper w:8]                                              → sums to 8
Row 2: [Tasks w:4] [Activity w:2] [Health w:2]                   → sums to 8
```

Heights are derived from block types:
- Row 0: max(defaultH) of metrics = 2 → row height 2
- Row 1: whisper defaultH = 1 → row height 1
- Row 2: max(tasks=3, activity=3, health=3) = 3 → row height 3

### Code Changes

| File | Change |
|------|--------|
| `types.ts` | Replace `GridBlock` with `CanvasBlock` + `CanvasRow`. Keep `BlockTypeDef` with adjusted fields. |
| `layout.ts` | Delete everything. Replace with `layoutRows` (~60 lines) and `distributeWidth` (~30 lines). |
| `Canvas.tsx` | State changes from `blocks: GridBlock[]` to `rows: CanvasRow[]` + `blocks: Map<string, CanvasBlock>`. Placement logic changes from arbitrary x,y to row insertion. Rendering uses `layoutRows` output for positioning. |
| `Canvas.module.css` | No changes — blocks still use absolute positioning with left/top/width/height. The CSS doesn't care how positions are computed. |

---

## Block Type Sizing Table (v2)

| Block Type | defaultW | minW | maxW | defaultH | minH | Expand |
|------------|----------|------|------|----------|------|--------|
| Revenue Counter | 2 | 1 | 4 | 2 | 1 | width |
| Outstanding | 2 | 1 | 4 | 2 | 1 | width |
| Rate Tracker | 2 | 1 | 4 | 2 | 1 | width |
| Goal Ring | 2 | 1 | 4 | 2 | 1 | width |
| Task Board | 4 | 2 | 8 | 3 | 2 | both |
| Activity Feed | 2 | 2 | 4 | 3 | 2 | width |
| Client Health | 2 | 2 | 4 | 3 | 2 | width |
| AI Whisper | 8 | 4 | 8 | 1 | 1 | width |
| Calendar | 4 | 2 | 8 | 3 | 2 | both |
| Timer | 2 | 1 | 4 | 2 | 1 | width |
| Invoice List | 4 | 2 | 8 | 2 | 2 | width |
| Pipeline | 4 | 3 | 8 | 3 | 2 | width |
| Quick Chat | 2 | 2 | 4 | 3 | 2 | width |
| File Gallery | 2 | 2 | 6 | 2 | 2 | both |
| Automations | 3 | 2 | 6 | 2 | 2 | width |
| Sticky Note | 2 | 1 | 4 | 2 | 1 | both |

Note: `maxW` values are more generous than v1 because blocks now expand to fill rows. A Revenue Counter alone in a row becomes 8 wide (capped by maxW:4, so remaining 4 cols would need another block or the cap needs raising). Consider raising all maxW to 8 so single blocks always fill the row.

---

## Animation

Same CSS transitions as v1 — blocks have `transition: left, top, width, height` at 300ms with the spring curve. When `layoutRows` produces new positions, the browser animates the change. Adding a block to a row causes siblings to smoothly slide and resize. Removing a block causes siblings to expand. Rows below shift up. All animated.

---

## Future: Drag Reorder Within Rows

Phase 2 feature. In edit mode, drag a block horizontally within its row to reorder. The row's block list updates, `layoutRows` recomputes, siblings slide to their new positions. Drag vertically to move between rows — the source row's blocks expand to fill, the target row's blocks compress to make room.

---

## Implementation Sequence

1. **Update `types.ts`** — `CanvasBlock`, `CanvasRow`, updated `BlockTypeDef`
2. **Rewrite `layout.ts`** — `layoutRows` + `distributeWidth` (~90 lines total, replaces ~160)
3. **Update `Canvas.tsx`** — new state model (rows + blocks map), placement into rows, rendering from `layoutRows` output
4. **Test** — verify single block fills row, 2 blocks split, 3 blocks distribute, removal causes expansion, preview works during drag

Total: simpler code, fewer lines, zero gaps.
