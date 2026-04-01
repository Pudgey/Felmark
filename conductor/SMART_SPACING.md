# Smart Spacing — Canvas Layout Engine

> **Status**: Design spec
> **Created**: 2026-04-01
> **Applies to**: `components/workspace/canvas/`

---

## Core Principle

The canvas hates unused space. Blocks are intelligent — they move, grow, and fill gaps automatically. The user controls *what* goes on the canvas and *roughly where*. The layout engine controls the exact positioning and sizing to ensure every pixel of the 8-column grid is used well.

The Smart Spacing engine has one job: make the canvas look intentional at all times. When a freelancer drops a Revenue Counter block next to their Task Board, the engine ensures there's no awkward 1-column gap left over. When they remove a block, the surrounding blocks breathe into the space. The user never has to think about alignment, gaps, or wasted space. They think about what they want to see. The engine thinks about where it goes.

This isn't a layout library. It's ~140 lines of pure functions that run on every canvas mutation. No dependencies. No framework. Just math on an 8xN grid.

---

## Phase 1: The Occupancy Grid

Build this first because everything else depends on it.

The occupancy grid is a 2D array: 8 columns wide, N rows tall. Each cell is either `null` (empty) or holds a block ID. Given a list of blocks with x, y, w, h coordinates, iterate through each block and stamp its ID into every cell it covers.

A block at x:2, y:0, w:3, h:2 stamps cells [2,0], [3,0], [4,0], [2,1], [3,1], [4,1] with its ID.

This grid is rebuilt from scratch on every mutation. It's cheap — 8 columns x maybe 20 rows = 160 cells. Rebuilding takes microseconds. Don't try to incrementally update it. Rebuild it clean every time. Simplicity over cleverness.

The occupancy grid answers three questions instantly:
- "Is cell [col, row] empty?"
- "Which block occupies cell [col, row]?"
- "Are cells [col, row] through [col+w, row+h] all empty?"

These three queries power both collision resolution and auto-fill.

---

## Phase 2: Collision Resolution

This runs when a block is placed, moved, or when you need to cascade after a push.

**The mental model is gravity.** Blocks fall down. They never slide sideways. If you drop a block on top of another block, the lower block gets pushed down just enough to clear the overlap. If that pushed block now sits on top of a third block, the third block gets pushed down too. Cascade until everything settles.

### Algorithm

Sort all blocks by y ascending (top to bottom), then x ascending (left to right) as a tiebreaker. This ordering is critical — you always resolve higher blocks before lower ones, which prevents circular dependencies.

Walk through the sorted list. For each block, check if it overlaps any block that comes before it in the sorted order (the blocks above and to the left). "Overlap" means standard AABB intersection:

```
blockA.x < blockB.x + blockB.w AND
blockA.x + blockA.w > blockB.x AND
blockA.y < blockB.y + blockB.h AND
blockA.y + blockA.h > blockB.y
```

If an overlap is found, push the lower block's y to the bottom edge of the upper block: `pushed.y = pusher.y + pusher.h`. Then re-sort and re-walk, because the push may have created new overlaps downstream.

In practice, this converges in 1-3 passes. The canvas won't have hundreds of blocks — a complex dashboard has maybe 15-20. The performance ceiling is irrelevant.

### Critical Rules

- **Horizontal position is sacred.** If the user placed a block at column 4, collision resolution never moves it to column 3 or 5. Only y changes. This preserves the user's spatial intent. They chose "right side of the canvas" and the engine respects that.
- **Cascade depth guard.** Max 50 iterations. If exceeded, break with a console warning. If this ever triggers, the arrangement is pathological and the user should reorganize.

### Signature

```ts
resolveCollisions(blocks: GridBlock[], changedBlockId: string): GridBlock[]
```

---

## Phase 3: Upward Compaction

Collision resolution pushes blocks down. Compaction pulls them back up. Together they create the tightest possible layout — no gaps, no wasted vertical space.

After collision resolution, walk every block (sorted by y ascending). For each block, try every y from 0 up to the block's current y. Use the occupancy grid to check if the block fits at that position without overlapping anything else. Set y to the first clear position. Rebuild occupancy. Next block.

**This runs on every mutation** — place, remove, resize. A canvas with random vertical voids looks broken. An always-compact canvas looks intentional. The user doesn't care *why* there's a gap — they care that it looks bad.

Horizontal position stays sacred. Blocks never slide sideways. They only float up.

### Signature

```ts
compactUp(blocks: GridBlock[], cols: number): GridBlock[]
```

---

## Phase 4: Auto-Fill

This is the magic. The engine scans for wasted space and grows blocks to fill it.

After compaction settles (or after a block removal), rebuild the occupancy grid. Then walk through every block and check three directions — rightward, leftward, and downward:

### Rightward Expansion

Look at the cells immediately to the right of the block's right edge. If they're empty and the block's type allows width expansion, and the block hasn't been manually resized by the user (`userSized !== true`), grow the block's width by 1 column. Repeat until you hit an occupied cell, the edge of the grid (column 8), or the block's `maxW`.

### Downward Expansion

Same logic but for the cells below the block's bottom edge. Grow height by 1 row. Repeat until occupied, `maxH`, or a natural limit.

### Order Matters

Do horizontal expansion first across all blocks, then vertical. Why? Horizontal gaps are more visually jarring than vertical gaps. A 1-column gap between two blocks looks broken. A 1-row gap below a block looks like intentional spacing. Fill the ugly gaps first.

After each individual block expansion, rebuild the occupancy grid before checking the next block. This prevents two adjacent blocks from both trying to expand into the same gap. The block that's higher and further left gets priority (because we walk top-to-bottom, left-to-right).

### Block Type Sizing Constraints

| Block Type | Default | Min | Max | Expand Axis | Notes |
|------------|---------|-----|-----|-------------|-------|
| Metric (revenue, rate, goal) | 2x2 | 1x1 | 3x2 | Width only | Compact data — don't stretch too wide |
| Task Board | 3x3 | 2x2 | 8x4 | Both | Columns benefit from width |
| Activity Feed | 2x3 | 2x2 | 3x4 | Height only | List — more rows, not wider |
| Client Health | 2x3 | 2x2 | 3x4 | Height only | List — more rows, not wider |
| AI Whisper | 8x1 | 4x1 | 8x1 | Width only | Always full-width bar |
| Calendar | 3x3 | 2x2 | 6x4 | Both | Month view benefits from space |
| Timer | 2x2 | 1x1 | 2x2 | No | Fixed compact widget |
| Invoice List | 3x2 | 2x2 | 6x3 | Both | Table benefits from width |
| Pipeline | 4x3 | 3x2 | 8x4 | Width only | Columns need width |
| Quick Chat | 2x3 | 2x2 | 3x5 | Height only | Messages stack vertically |
| File Gallery | 2x2 | 2x2 | 4x3 | Both | Grid of thumbnails |
| Sticky Note | 2x2 | 1x1 | 3x3 | Both | Freeform |

These constraints are per-block-type, defined in the block registry. When a developer creates a custom Space Block through the Toolbox, they specify their min/max/expandAxis in the block definition. The layout engine doesn't need to know what the block does — it just knows its sizing constraints.

### The `userSized` Escape Hatch

If a freelancer manually drags a resize handle to make their Task Board 4x2 instead of the default 3x3, that block gets `userSized: true`. Auto-fill will never touch it again. The user's explicit choice overrides the engine's optimization. This flag clears if the user resets the block to its default size (via a "Reset size" option in the config menu).

### Signature

```ts
autoFill(blocks: GridBlock[], typeDefs: BlockTypeDef[]): GridBlock[]
```

---

## Phase 4: Wiring into the Canvas Component

The layout engine is a set of pure functions that take a block array in and return a block array out. No side effects. No DOM manipulation. Just data transformation.

Wire it in at five mutation points:

| Event | Collision Resolution | Compaction | Auto-Fill |
|-------|---------------------|------------|-----------|
| Block placed (drop) | Yes | Yes | Yes |
| Block moved (drag reposition) | Yes | Yes | Yes |
| Block resized (drag handle) | Yes | Yes | No — user is sizing manually |
| Block removed | No | Yes | Yes — fill the gap |
| Canvas first load | No | Yes | Yes — optimize initial layout |

**The pipeline is always: resolve collisions → compact up → auto-fill.** Each step takes the output of the previous. All three are pure functions.

On block resize, set `userSized: true` on the resized block.

---

## Phase 5: Animation

This is what makes it feel alive instead of mechanical.

Every block has CSS transitions on four properties: `left`, `top`, `width`, `height`. Duration: 300ms. Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — the spring curve used throughout Felmark. When the layout engine changes a block's position or size, the browser animates the transition automatically. No JavaScript animation needed. Just CSS.

### Three Animation Moments

**Push animation.** When a new block pushes others down, the pushed blocks slide downward over 300ms. The user sees: "I dropped a block and everything below it gently moved out of the way." This feels physical. Gravity.

**Expand animation.** When auto-fill grows a block to fill a gap, the block's border expands over 300ms. The user sees: "I removed a block and the one next to it grew to fill the space." This feels organic. Like the canvas is breathing.

**Ghost preview.** During drag-to-place, the ghost outline should show the final post-collision, post-auto-fill layout. This means running the full layout engine on every mouse move during placement — but only for preview (don't commit to state until drop). Since the engine is ~140 lines of pure math on ~20 blocks, this runs in under 1ms. No performance concern.

### Preview Indicators

During ghost preview:
- Blocks that will be pushed show a subtle translucency shift (20% opacity reduction) and a faint downward indicator
- Blocks that will auto-expand show a dashed outline at their future size
- Complete preview of what will happen before they commit

---

## Phase 6: Edge Cases

**Full row.** All 8 columns occupied. A new block placed there pushes everything below it down. No horizontal negotiation — the algorithm handles this naturally.

**Tall narrow block next to short wide block.** A 1x4 at column 0 next to a 7x1 at column 1. Auto-fill should NOT stretch the 7x1 block to 7x4 to "match" the tall one. Rule: only fill genuinely empty cells. "Matching neighbor height" is not a goal.

**User resized then removed neighbor.** Block A was manually resized (userSized: true). Block B next to it gets removed. Auto-fill sees the gap but A is userSized, so it's skipped. The gap stays. Correct — the user explicitly sized A and the engine shouldn't override that.

**Multiple blocks could fill the same gap.** Priority goes to the block that is **closest** to the gap (sharing an edge). If tied, the block that is **higher** (lower y value) wins.

**Template loading.** When a community template is installed, run auto-fill once on load to ensure the template fits the user's canvas. Handles adaptation if column count ever changes.

---

## Phase 7: Data Model Updates

Two additions to the existing models:

### BlockTypeDef (block registry, shared across all instances)

```ts
minW: number;    // smallest width (resize handle stops here)
minH: number;    // smallest height
maxW: number;    // largest auto-fill will grow width
maxH: number;    // largest auto-fill will grow height
expandAxis: "both" | "width" | "height" | "none";
```

### GridBlock (individual block instance on the canvas)

```ts
userSized?: boolean;  // default false. Set true on manual resize. Prevents auto-fill.
```

Both additions are backward-compatible. Existing blocks without `userSized` default to false (auto-fill eligible). Existing block types without sizing constraints default to reasonable values (min: 1x1, max: 4x4, expand: both).

---

## Implementation Sequence

1. **Occupancy grid utility** + **collision resolver**. Pure functions. (~80 lines)
2. **Upward compaction**. Pure function. Floats blocks to highest valid y. (~20 lines)
3. **Auto-fill pass** with leftward + rightward + downward expansion. (~60 lines)
4. **Wire into Canvas.tsx**. Pipeline: resolve → compact → auto-fill on every mutation. Live preview during drag.
5. **CSS transitions** on block position/size. Preview indicators on blocks that will move.
6. **Edge case hardening**. `userSized` flag, cascade depth guard, template optimization.

Total: ~160 lines of layout logic, ~50 lines of CSS transitions. No new dependencies.

---

## Why This Matters

Without Smart Spacing, the canvas is a drag-and-drop grid. With it, the canvas is alive.

Blocks don't just sit where you put them — they arrange themselves intelligently around your decisions. The freelancer drops a block and the canvas reorganizes to accommodate it. They remove a block and the canvas fills the gap. They never see wasted space. They never manually align things. They never think about layout.

The dot grid is the skeleton. The Space Blocks are the organs. Smart Spacing is the nervous system. Together, they make the canvas breathe.
