# Felmark Split-Pane Architecture

> Derived from tmux's layout tree model. Adapted for a React workspace.
> Read alongside: `SKILL.md` (design system), `product-architecture.md` (four surfaces)

## Table of Contents
1. What tmux Got Right
2. The Felmark Translation
3. Layout Tree Model
4. Three Concerns, Three Modules
5. Split Operations
6. Navigation & Focus
7. Resize System
8. Zoom (Focus Mode)
9. Preset Layouts
10. Pane Lifecycle
11. Synchronized Context
12. Data Structures
13. Implementation Plan
14. What We Don't Need from tmux

---

## 1. What tmux Got Right

tmux's pane system has survived 15+ years of production use because of one architectural decision: **separation of concerns**.

Three files own three things:
- `layout.c` owns **structure and geometry** — where panes are, how big they are, how splits nest
- `window.c` owns **pane lifecycle and focus** — creating panes, destroying them, tracking which is active, zoom state
- `cmd-split-window.c` owns **user intent** — parsing what the user asked for, then delegating to the other two

The command layer is thin. It translates "split this pane horizontally at 60%" into two function calls: one to the layout engine (split the geometry) and one to the window manager (spawn the new pane). That's it.

This separation is why tmux stays stable as splits get deeply nested. The layout engine doesn't know what's inside a pane. The pane doesn't know where it sits in the layout. The command doesn't know how either works internally. Each module has one job.

**Felmark must replicate this separation exactly.**

---

## 2. The Felmark Translation

| tmux concept | Felmark equivalent | Notes |
|---|---|---|
| Session | Workspace session | A saved arrangement (Daily, Finance, Meridian) |
| Window | Workspace view | The visible area — one per session at a time |
| Layout tree | `LayoutTree` | Binary tree of split containers and leaf panes |
| Layout cell (internal) | `SplitNode` | A container that splits children horizontally or vertically |
| Layout cell (leaf) | `PaneNode` | A leaf that holds a surface instance |
| Window pane | `Surface` | One of the six surfaces (Money, Work, Signals, Pipeline, Clients, Time) |
| Pane content (pty) | `SurfaceRenderer` | The React component that renders a surface's content |
| Active pane | `focusedPaneId` | Which pane receives keyboard input and shows the highlight strip |
| Zoom | Focus mode | Maximize one pane to fill the entire view, hiding all others |
| Preset layout | Layout preset | Even-split, main+sidebar, quad, single, wide-narrow |
| Synchronize-panes | Client scope | When all panes filter to the same client simultaneously |

---

## 3. Layout Tree Model

tmux models each window as a **binary tree**. Internal nodes are split containers. Leaf nodes are panes. Felmark does the same.

```text
Root (horizontal split, 50/50)
├── Leaf: Money surface
└── Leaf: Work surface
```

A more complex arrangement:

```text
Root (horizontal split, 60/40)
├── Leaf: Money surface
└── Node (vertical split, 50/50)
    ├── Leaf: Work surface
    └── Leaf: Signals surface
```

This is a 3-pane layout: Money takes 60% top, Work and Signals split the bottom 40% side by side.

**Key rules from tmux:**
- Every internal node has exactly two children (binary tree)
- Every internal node has an orientation: `horizontal` (split top/bottom) or `vertical` (split left/right)
- Every internal node has a ratio (percentage or pixel size for the split point)
- Leaf nodes hold a surface ID and nothing else
- The tree root represents the entire available workspace area

**Why a tree and not a flat array:**
A flat list of panes (like v2.1's tab system) can't represent nested splits. "Money on the left, Work top-right, Signals bottom-right" requires hierarchy. The tree structure is the only model that handles arbitrary nesting while keeping resize math clean.

---

## 4. Three Concerns, Three Modules

### `layout-engine.ts` — Structure & Geometry
**tmux equivalent:** `layout.c`

Owns:
- The layout tree data structure
- Split operations (split a leaf into two children)
- Close operations (remove a leaf, merge space back)
- Resize operations (move a split boundary)
- Geometry calculation (given a bounding box, compute each pane's pixel rect)
- Minimum size enforcement (no pane smaller than 200px width or 120px height)
- Preset layout application

Does NOT own:
- What surfaces are loaded in panes
- Which pane is focused
- Any UI rendering

**API surface:**
```typescript
splitPane(paneId: string, direction: 'horizontal' | 'vertical', ratio?: number): LayoutTree
closePane(paneId: string): LayoutTree
resizeSplit(splitNodeId: string, newRatio: number): LayoutTree
swapPanes(paneA: string, paneB: string): LayoutTree
applyPreset(preset: PresetName, paneCount: number): LayoutTree
getGeometry(tree: LayoutTree, bounds: Rect): Map<string, Rect>
```

### `surface-manager.ts` — Pane Lifecycle
**tmux equivalent:** `window.c`

Owns:
- Which surface is loaded in each pane
- Surface state (scroll position, expanded rows, filter state)
- Spawning new surfaces when panes are created
- Destroying surface state when panes are closed
- Focus tracking (which pane is active)
- Zoom state (which pane is maximized, if any)
- Pane adjacency (which pane is above/below/left/right of current)

Does NOT own:
- Pane geometry or positioning
- Split math
- User command parsing

**API surface:**
```typescript
setSurface(paneId: string, surfaceId: SurfaceId): void
getFocusedPane(): string
setFocus(paneId: string): void
focusDirection(direction: 'up' | 'down' | 'left' | 'right'): void
zoomPane(paneId: string): void
unzoom(): void
isZoomed(): boolean
getSurfaceState(paneId: string): SurfaceState
```

### `workspace-commands.ts` — User Intent
**tmux equivalent:** `cmd-split-window.c` and other `cmd-*.c` files

Owns:
- Parsing keyboard shortcuts and command palette input
- Translating user intent into layout-engine + surface-manager calls
- Zoom-awareness (unzoom before split, restore zoom after close)
- Undo/redo stack for layout changes

Does NOT own:
- Layout math
- Surface rendering
- Focus adjacency calculation

**Command map:**
```typescript
// Split
'⇧H' → splitCurrentPane('horizontal')     // split below
'⇧V' → splitCurrentPane('vertical')        // split right
'⇧F' → splitCurrentPane('horizontal', 70)  // split below, 70/30

// Navigate
'⌘]' → focusNextPane()
'⌘[' → focusPrevPane()
'⌘↑' → focusDirection('up')
'⌘↓' → focusDirection('down')
'⌘←' → focusDirection('left')
'⌘→' → focusDirection('right')

// Manage
'⇧W' → closeCurrentPane()
'⇧S' → swapWithAdjacentPane()
'⇧Z' → toggleZoom()
'⌘1-5' → applyPreset(1-5)

// Surface
'⇧.' → openSurfaceSelector()  // change what surface is in the focused pane
```

---

## 5. Split Operations

### Splitting a Pane
When the user hits `⇧H` (split horizontal):

1. **Command layer** identifies the focused pane ID
2. **Command layer** checks zoom state — if zoomed, unzoom first
3. **Layout engine** receives `splitPane(focusedId, 'horizontal', 50)`
4. **Layout engine** finds the leaf node for `focusedId`
5. **Layout engine** replaces that leaf with a new internal node:
   - Orientation: horizontal
   - Ratio: 50%
   - Child A: original leaf (keeps the original surface)
   - Child B: new leaf (gets a new pane ID)
6. **Layout engine** checks minimum sizes — if the parent is too small, reject the split
7. **Surface manager** receives `spawnPane(newPaneId)` — assigns a default surface
8. **Surface manager** sets focus to the new pane (tmux behavior: focus moves to new pane)

### Same-Orientation Optimization
From tmux: if you split a pane whose parent already has the same orientation, **reuse the parent** instead of creating a new nesting level.

Example: You have a horizontal split (Money top, Work bottom). You split Work horizontally again. Instead of:

```text
Root (horizontal)
├── Money
└── Node (horizontal)    ← unnecessary nesting
    ├── Work
    └── Signals
```

The engine produces:

```text
Root (horizontal, 3 children)
├── Money
├── Work
└── Signals
```

This keeps the tree flat when possible. tmux does this and it's why you can split a pane 10 times without performance degradation.

**For Felmark:** Extend the binary tree to support N children when all share the same orientation. Internal nodes become: `{ orientation, children: [{pane, flex}...] }`.

### Closing a Pane
Inverse of split:

1. **Layout engine** receives `closePane(paneId)`
2. Find the leaf node and its parent
3. Remove the leaf from the parent's children
4. If the parent now has one child, **collapse**: replace the parent with that single child
5. The sibling absorbs the freed space
6. **Surface manager** destroys the closed pane's state
7. **Surface manager** moves focus to the sibling (or nearest pane)

---

## 6. Navigation & Focus

### Directional Focus (tmux's geometry-based neighbor lookup)
tmux doesn't use pane index order for navigation. It uses **geometry**. "Move focus up" means: find the pane whose bottom edge is closest to the current pane's top edge, overlapping horizontally.

For Felmark:

```typescript
function focusDirection(direction: 'up' | 'down' | 'left' | 'right'): string | null {
  const currentRect = getGeometry(tree, bounds).get(focusedPaneId);
  const candidates = getAllLeafPanes()
    .filter(p => p.id !== focusedPaneId)
    .filter(p => isInDirection(currentRect, getRect(p.id), direction))
    .sort((a, b) => overlapScore(currentRect, getRect(b.id), direction)
                   - overlapScore(currentRect, getRect(a.id), direction));
  return candidates[0]?.id ?? null;
}
```

This means: in a complex 4-pane layout, pressing `⌘↑` always moves to the pane that's visually above you, regardless of creation order.

### Tab Order (`⌘]` / `⌘[`)
For simple next/prev, use depth-first traversal order of the layout tree. This gives a predictable "tab through all panes" behavior.

### Focus Visual
When focus changes, the active pane gets the highlight strip (Style A: top edge glow from the highlight strips kit). The surface manager emits a `focus-changed` event that the React layer uses to apply the CSS class.

---

## 7. Resize System

### Drag Resize
The separator between two sibling panes is draggable. During drag:

1. Mouse position maps to a new ratio for the parent split node
2. **Layout engine** enforces minimum sizes (clamp the ratio)
3. **Layout engine** recalculates geometry for all affected panes
4. React re-renders with new pixel dimensions
5. The resize indicator tags appear (Style from the elements kit: `62% · 780px`)

### Keyboard Resize
`⌘⇧↑/↓/←/→` moves the nearest split boundary by a fixed increment (e.g., 5% per keystroke).

### From tmux
tmux's `cmd-resize-pane.c` handles both directional and absolute resize. The key insight: resize always operates on the **split boundary**, not the pane. Moving a boundary affects two panes simultaneously. The layout engine recalculates both.

---

## 8. Zoom (Focus Mode)

tmux's zoom is elegant: maximize one pane to fill the entire window, but **don't destroy the layout tree**. The tree stays in memory. Unzoom restores everything.

For Felmark:

```typescript
// Zoom
zoomPane(paneId) {
  this.zoomedPaneId = paneId;
  // The React layer hides all panes except the zoomed one
  // The layout tree is NOT modified
}

// Unzoom
unzoom() {
  this.zoomedPaneId = null;
  // All panes become visible again with their original geometry
}
```

**Zoom-awareness in commands (from tmux):**
- Splitting while zoomed: unzoom first, then split, then optionally re-zoom the original pane
- Closing the zoomed pane: unzoom first, then close
- Navigating while zoomed: unzoom first, then navigate
- Resizing while zoomed: no-op (nothing to resize)

---

## 9. Preset Layouts

tmux's `layout-set.c` defines 7 preset layouts. Felmark needs 5:

### 1. Stack (default)
```text
┌──────────────────┐
│     Pane A       │
├──────────────────┤
│     Pane B       │
└──────────────────┘
```
Horizontal split, 50/50. The default Workspace view (Money + Work).

### 2. Side
```text
┌─────────┬────────┐
│         │        │
│ Pane A  │ Pane B │
│         │        │
└─────────┴────────┘
```
Vertical split, 50/50.

### 3. Focus
```text
┌──────────────────┐
│                  │
│     Pane A       │
│                  │
└──────────────────┘
```
Single pane. Not zoom (zoom preserves the tree). Focus is a preset that collapses to one leaf.

### 4. Quad
```text
┌─────────┬────────┐
│ Pane A  │ Pane B │
├─────────┼────────┤
│ Pane C  │ Pane D │
└─────────┴────────┘
```
Two horizontal, each containing two vertical. Bloomberg energy.

### 5. Main + Sidebar
```text
┌─────────────┬────┐
│             │ B  │
│   Pane A    ├────┤
│             │ C  │
└─────────────┴────┘
```
Vertical split 70/30, right side split horizontal 50/50. Main surface dominates, two secondary surfaces stacked on the right.

### Applying a Preset
```typescript
function applyPreset(preset: PresetName, surfaces: SurfaceId[]): LayoutTree {
  // 1. Build a new tree from the preset template
  // 2. Assign surfaces to leaf nodes in order
  // 3. If fewer surfaces than panes, reuse or leave empty
  // 4. If more surfaces than panes, truncate
  return newTree;
}
```

Presets destroy and rebuild the tree. They don't try to morph the existing tree (tmux works the same way).

---

## 10. Pane Lifecycle

### Creation
1. Layout engine creates a leaf node with a unique ID
2. Surface manager assigns a default surface (or the user-selected one)
3. React mounts the `SurfaceRenderer` component with the surface ID
4. Surface state initializes (empty filter, default scroll position)

### Destruction
1. Layout engine removes the leaf and collapses the parent
2. Surface manager saves any persistent state (scroll position, expanded rows)
3. React unmounts the `SurfaceRenderer`
4. Surface state is archived (available if the user re-opens the same surface)

### Surface Swapping
Changing what surface is in a pane (clicking the dropdown selector):
1. Surface manager saves current surface state for this pane
2. Surface manager loads new surface state (or initializes fresh)
3. React swaps the `SurfaceRenderer` component
4. Layout tree is NOT modified (geometry stays the same)

This is analogous to tmux's `respawn-pane` — same pane slot, different content.

---

## 11. Synchronized Context

tmux's `synchronize-panes` sends the same keystroke to all panes simultaneously. Felmark's equivalent is **client scope**: when you select a client in the sidebar, all panes filter to that client's data.

```typescript
function setClientScope(clientId: string | null) {
  // Broadcast to all active surfaces
  for (const pane of getAllLeafPanes()) {
    surfaceManager.getRenderer(pane.id).applyFilter({ clientId });
  }
}
```

When "Meridian Studio" is selected in the sidebar:
- Money pane shows only Meridian invoices
- Work pane shows only Meridian tasks
- Signals pane shows only Meridian activity
- Pipeline pane shows only Meridian deals

Deselecting returns to the unfiltered view.

---

## 12. Data Structures

```typescript
// Layout tree node
type LayoutNode = SplitNode | PaneNode;

interface SplitNode {
  type: 'split';
  id: string;
  orientation: 'horizontal' | 'vertical';
  children: { node: LayoutNode; flex: number }[];  // flex is the ratio weight
}

interface PaneNode {
  type: 'pane';
  id: string;
  surfaceId: SurfaceId;
}

type SurfaceId = 'money' | 'work' | 'signals' | 'pipeline' | 'clients' | 'time';

// Session — a saved workspace arrangement
interface WorkspaceSession {
  id: string;
  name: string;                // "Daily", "Finance", "Meridian"
  tree: LayoutNode;            // The full layout tree
  focusedPaneId: string;
  clientScope: string | null;  // Active client filter
  surfaceStates: Map<string, SurfaceState>;  // Per-pane state snapshots
}

// Geometry output
interface PaneRect {
  paneId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Surface state (persisted per pane)
interface SurfaceState {
  surfaceId: SurfaceId;
  scrollTop: number;
  expandedRowId: string | null;
  filterState: Record<string, any>;
}
```

---

## 13. Implementation Plan

### Phase 1: Static Split (Week 1-2)
- Implement `LayoutTree` data structure
- Implement `getGeometry()` — given a tree and bounds, output pane rects
- Render panes with absolute positioning based on computed geometry
- Hardcode a 2-pane Stack layout
- Wire up surface selectors in pane headers

### Phase 2: Split & Close (Week 3)
- Implement `splitPane()` and `closePane()`
- Wire up keyboard shortcuts (`⇧H`, `⇧V`, `⇧W`)
- Implement same-orientation optimization
- Implement minimum size enforcement

### Phase 3: Resize (Week 4)
- Implement drag-to-resize on split boundaries
- Implement keyboard resize (`⌘⇧` arrow keys)
- Add resize indicator tags
- Enforce min/max constraints during drag

### Phase 4: Focus & Navigation (Week 5)
- Implement focus tracking with highlight strips
- Implement directional navigation (`⌘` arrow keys)
- Implement tab-order navigation (`⌘]` / `⌘[`)
- Add `focus-changed` event for highlight strip CSS

### Phase 5: Zoom & Presets (Week 6)
- Implement zoom/unzoom (`⇧Z`)
- Make all commands zoom-aware
- Implement 5 preset layouts
- Wire presets to `⌘1-5` shortcuts

### Phase 6: Sessions (Week 7-8)
- Implement session save/restore
- Session tab strip in the header
- Auto-save session on layout change
- Per-session client scope

---

## 14. What We Don't Need from tmux

tmux solves problems Felmark doesn't have:

- **PTY management** — tmux allocates pseudo-terminals for each pane. Felmark renders React components. No PTYs.
- **Terminal escape sequence parsing** — tmux's `screen.c` and `input.c` parse ANSI codes. Felmark uses HTML/CSS.
- **Copy mode / scroll-back buffer** — tmux buffers terminal output. Felmark surfaces manage their own scroll state via React.
- **Client-server architecture** — tmux runs as a detached server. Felmark runs in the browser.
- **Status line rendering** — tmux renders a text-mode status line with format strings. Felmark's status bar is a React component.

**What we DO take from tmux:**
- The layout tree model (binary tree with split orientation)
- The separation of layout / lifecycle / commands
- Geometry-based directional navigation
- Zoom as a view toggle, not a tree mutation
- Preset layouts as tree rebuilds, not morphs
- Same-orientation optimization to keep trees flat
- Minimum size enforcement during split and resize
- Close-pane sibling absorption with parent collapse
