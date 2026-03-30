# Mission: Editor Core Refactor

**Status**: APPROVED — AWAITING EXECUTION
**Priority**: High
**Created**: 2026-03-30
**Owner**: claude-main

---

## Objective

Extract `Editor.tsx` (1,525 lines, 54 imports, 24 useState, 18 useCallback) into a `core/` module architecture. Zero feature changes — pure structural refactor. Every block, every interaction, every UI state must work identically after.

## Current State

Editor.tsx is a monolith containing:
- **Block registry** — 33 CONTENT_DEFAULTS entries, 31 contentBlockMap entries
- **Block rendering** — renderBlock() with 8 special-case handlers + contentBlockMap dispatch
- **State management** — 24 useState calls, 8 useRef, 18 useCallback
- **UI chrome** — tab bar, breadcrumb, zen mode, split pane, panels
- **Keyboard handling** — Cmd+K, Cmd+Shift+Backspace, Escape
- **Block creation flow** — selectSlashItem with 7 branching paths
- **Focus management** — blockElMap, focusNew with retry logic
- **Page routing** — 10 railActive conditional renders (Calendar, Search, etc.)

## Target Architecture

```
editor/
├── core/
│   ├── EditorShell.tsx          ← Layout, panels, page routing, zen mode
│   ├── blockRegistry.ts         ← All imports, CONTENT_DEFAULTS, contentBlockMap
│   ├── blockRenderer.tsx         ← renderBlock() dispatch + gutter wrapper
│   ├── useBlockState.ts          ← Block CRUD: setBlocks, addBlockAfter, deleteBlock, deleteBlocks, duplicateBlock
│   ├── useSlashMenu.ts           ← Slash menu state + selectSlashItem logic
│   ├── useEditorKeys.ts          ← Global keyboard shortcuts (Cmd+K, Cmd+Shift+Backspace)
│   ├── usePanelState.ts          ← Panel visibility: notifications, comments, conversations, history, cat
│   ├── useTabBar.ts              ← Tab state: overflow, rename, measurement
│   ├── useFocusManager.ts        ← blockElMap, registerRef, focusNew, contentCache
│   └── REFACTORING_SOP.md        ← Rules for modifying core/
├── Editor.tsx                    ← Thin entry: composes hooks + renders EditorShell
├── Editor.module.css             ← Unchanged
├── blocks/                       ← Unchanged
├── ai-action/                    ← Unchanged
├── money/                        ← Unchanged
└── ...                           ← All block folders unchanged
```

## Extraction Plan (10 Steps)

### Step 1: Create `core/` directory + REFACTORING_SOP.md

Create the folder and the SOP that governs it.

**SOP contents:**
- To add a new block type: edit `blockRegistry.ts` only
- To change block rendering: edit `blockRenderer.tsx` only
- To add a keyboard shortcut: edit `useEditorKeys.ts` only
- To add a panel: edit `usePanelState.ts` + `EditorShell.tsx`
- NEVER add useState to `Editor.tsx` — it should only compose hooks
- NEVER add imports to `Editor.tsx` — block imports go in `blockRegistry.ts`

---

### Step 2: Extract `blockRegistry.ts`

**Move from Editor.tsx:**
- All 40+ block component imports (lines 5–28)
- All default data factory imports
- CONTENT_DEFAULTS object (currently inside selectSlashItem callback — extract to module scope)
- contentBlockMap (currently inside renderBlock — extract to module scope)

**Exports:**
```typescript
export { CONTENT_DEFAULTS }                    // Record<string, Partial<Block>>
export { contentBlockMap }                     // Record<string, (block, setBlocks) => ReactNode>
export { getDefaultDataForType }               // (type: BlockType) => Partial<Block> | null
```

**Key change:** contentBlockMap currently captures `setBlocks` via closure. Refactor entries to accept `setBlocks` as a parameter:
```typescript
// Before (closure):
table: (b) => b.tableData ? <TableBlock data={b.tableData} onChange={d => setBlocks(...)} /> : null

// After (parameter):
table: (b, onUpdate) => b.tableData ? <TableBlock data={b.tableData} onChange={d => onUpdate(b.id, { tableData: d })} /> : null
```

**Files touched:** Editor.tsx (remove imports + objects), new blockRegistry.ts
**Risk:** Medium — must handle setBlocks closure change carefully

---

### Step 3: Extract `blockRenderer.tsx`

**Move from Editor.tsx:**
- The `renderBlock` function (currently a nested function inside the component)
- All special-case block handlers (graph, money, deadline, deliverable, ai, canvas, audio)
- The gutter wrapper JSX (add/grip/delete buttons)
- The EditableBlock rendering logic with prefix/checkbox/format handling
- Drag-and-drop event handlers for blocks

**Exports:**
```typescript
export function renderBlock(
  block: Block,
  index: number,
  ctx: BlockRenderContext     // All the state/callbacks needed
): React.ReactNode
```

**BlockRenderContext type:**
```typescript
interface BlockRenderContext {
  blocks: Block[];
  setBlocks: (fn: (prev: Block[]) => Block[]) => void;
  hoverBlock: string | null;
  setHoverBlock: (id: string | null) => void;
  blockElMap: React.MutableRefObject<Record<string, HTMLDivElement>>;
  registerRef: (id: string) => (el: HTMLDivElement | null) => void;
  addBlockAfter: (id: string) => void;
  deleteBlock: (id: string) => void;
  onContentChange: (id: string, html: string) => void;
  onEnter: (id: string, before: string, after: string) => void;
  onBackspace: (id: string) => void;
  onSlash: (id: string, filter: string) => void;
  handleSelect: () => void;
  // ... graph/money picker states, comment states, etc.
}
```

**Files touched:** Editor.tsx (remove renderBlock), new blockRenderer.tsx
**Risk:** High — renderBlock uses many closure variables. Must pass all as context.

---

### Step 4: Extract `useBlockState.ts`

**Move from Editor.tsx:**
- `blocks` / `setBlocksLocal` useState
- `setBlocks` wrapper (syncs to parent via queueMicrotask)
- `addBlockAfter` callback
- `deleteBlock` callback
- `deleteBlocks` callback
- `duplicateBlockById` callback
- `onContentChange` callback
- `onEnter` callback
- `onBackspace` callback

**Exports:**
```typescript
export function useBlockState(props: {
  initialBlocks: Block[];
  activeProject: string;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  onWordCountChange: (words: number, chars: number) => void;
}) => {
  blocks, setBlocks, addBlockAfter, deleteBlock, deleteBlocks,
  duplicateBlockById, onContentChange, onEnter, onBackspace,
  contentCache, blockElMap, registerRef
}
```

**Files touched:** Editor.tsx (remove block state + callbacks), new useBlockState.ts
**Risk:** Medium — useEffect sync on activeProject change must move too

---

### Step 5: Extract `useSlashMenu.ts`

**Move from Editor.tsx:**
- `slashMenu` / `slashFilter` / `slashIndex` useState (3 states)
- `onSlash` callback (opens menu at position)
- `selectSlashItem` callback (the big one — 7 branching paths)
- `graphPicker` / `moneyPicker` useState (2 states — sub-pickers)
- `selectGraphType` / `selectMoneyType` callbacks

**Exports:**
```typescript
export function useSlashMenu(deps: {
  blocks: Block[];
  setBlocks: ...;
  blockElMap: ...;
  contentCache: ...;
  focusNew: ...;
}) => {
  slashMenu, slashFilter, slashIndex, setSlashIndex,
  onSlash, selectSlashItem, closeSlashMenu,
  graphPicker, moneyPicker, selectGraphType, selectMoneyType
}
```

**Files touched:** Editor.tsx (remove slash menu state + callbacks), new useSlashMenu.ts
**Risk:** High — selectSlashItem has complex branching and closure dependencies

---

### Step 6: Extract `useFocusManager.ts`

**Move from Editor.tsx:**
- `blockElMap` useRef
- `contentCache` useRef
- `registerRef` callback
- `focusNew` callback (with retry logic)
- `getSelectedBlockId` callback
- `handleSelect` callback (format bar positioning)

**Exports:**
```typescript
export function useFocusManager() => {
  blockElMap, contentCache, registerRef, focusNew,
  getSelectedBlockId, handleSelect
}
```

**Files touched:** Editor.tsx (remove focus refs + callbacks), new useFocusManager.ts
**Risk:** Low — these are self-contained utilities

---

### Step 7: Extract `usePanelState.ts`

**Move from Editor.tsx:**
- `cmdPalette` useState
- `convoPanelOpen` useState
- `commentPanelOpen` useState
- `commentHighlight` useState
- `commentedBlocks` useState
- `historyOpen` useState
- `notifPanelOpen` useState
- `catOpen` useState
- `shareOpen` useState
- `notifications` useState
- `splitPickerOpen` useState

**Exports:**
```typescript
export function usePanelState() => {
  panels: { cmdPalette, convo, comments, history, notif, cat, share, splitPicker },
  togglePanel, closeAllPanels,
  commentHighlight, setCommentHighlight,
  commentedBlocks, setCommentedBlocks,
  notifications, setNotifications, markAllRead, markRead
}
```

**Files touched:** Editor.tsx (remove 11 useState calls), new usePanelState.ts
**Risk:** Low — these are independent boolean toggles

---

### Step 8: Extract `useTabBar.ts`

**Move from Editor.tsx:**
- `editingTabId` / `editingTabName` useState
- `overflowCount` / `overflowOpen` useState
- `tabZoneRef` useRef
- `manuallyRenamed` useRef
- `knownTabs` useRef
- `measureOverflow` callback + ResizeObserver useEffect
- `visibleTabs` calculation logic (useMemo candidate)
- Tab rename handlers (onBlur, onKeyDown)

**Exports:**
```typescript
export function useTabBar(tabs: Tab[], onTabRename: ...) => {
  editingTabId, startEditing, stopEditing, editingTabName, setEditingTabName,
  overflowCount, overflowOpen, setOverflowOpen,
  tabZoneRef, visibleTabs, manuallyRenamed
}
```

**Files touched:** Editor.tsx (remove tab state + measurement), new useTabBar.ts
**Risk:** Low — tab management is self-contained

---

### Step 9: Extract `useEditorKeys.ts`

**Move from Editor.tsx:**
- The keyboard useEffect (Cmd+K, Cmd+Shift+Backspace, Escape)

**Exports:**
```typescript
export function useEditorKeys(deps: {
  cmdPalette: boolean;
  setCmdPalette: ...;
  getSelectedBlockId: ...;
  deleteBlock: ...;
}) => void   // just registers the effect
```

**Files touched:** Editor.tsx (remove keyboard useEffect), new useEditorKeys.ts
**Risk:** Very low — single useEffect

---

### Step 10: Compose in `EditorShell.tsx` + slim `Editor.tsx`

**EditorShell.tsx** gets:
- All JSX layout (tab bar, breadcrumb, editorRow, panels, zen mode)
- Page routing conditionals (railActive === "calendar", etc.)
- Panel rendering (ConversationPanel, ActivityMargin, NotificationPanel)

**Editor.tsx** becomes:
```typescript
export default function Editor(props: EditorProps) {
  const blockState = useBlockState(props);
  const focusManager = useFocusManager();
  const slashMenu = useSlashMenu({ ...blockState, ...focusManager });
  const panels = usePanelState();
  const tabBar = useTabBar(props.tabs, props.onTabRename);
  useEditorKeys({ ...panels, ...focusManager, ...blockState });

  return (
    <EditorShell
      {...props}
      {...blockState}
      {...focusManager}
      {...slashMenu}
      {...panels}
      {...tabBar}
    />
  );
}
```

**Files touched:** Editor.tsx (rewrite to composition), new EditorShell.tsx
**Risk:** Medium — must ensure all prop threading is correct

---

## Execution Protocol

### Agent Roles

| Agent | Role | When |
|-------|------|------|
| **Scout** | Already completed — this analysis | Before mission |
| **Builder** | Executes steps 1–10 sequentially in a worktree | During mission |
| **Verifier** | After each step: runs build, checks imports, runs type check, verifies no feature regression | After each step |

### Verifier Checklist (run after EVERY step)

```bash
# 1. TypeScript compiles
npx tsc --noEmit 2>&1 | grep "error TS" | wc -l
# Expected: 0 new errors

# 2. Build passes
npm run build 2>&1 | tail -5
# Expected: "Compiled successfully"

# 3. No broken imports
grep -r "from.*Editor" dashboard/src --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".next"
# Expected: Only valid imports

# 4. All block types still render
# Verify contentBlockMap has same number of entries as before
grep -c "=>" core/blockRegistry.ts
# Expected: 31+

# 5. CONTENT_DEFAULTS complete
grep -c ":" core/blockRegistry.ts | head -1
# Expected: 33+

# 6. Editor.tsx line count
wc -l Editor.tsx
# Expected: <200 lines (down from 1,525)
```

### Rollback Plan

Each step is independently committable. If step N fails verification:
1. Revert step N changes
2. Re-analyze why it failed
3. Adjust approach
4. Re-attempt

The worktree isolation means main branch is never at risk.

---

## Success Criteria

| Metric | Before | After |
|--------|--------|-------|
| Editor.tsx lines | 1,525 | <200 |
| Editor.tsx imports | 54 | ~10 (core modules only) |
| Editor.tsx useState | 24 | 0 (all in hooks) |
| Editor.tsx useCallback | 18 | 0 (all in hooks) |
| Total files in core/ | 0 | 10 |
| Block types working | 55 | 55 (unchanged) |
| Features broken | 0 | 0 |
| Build passes | Yes | Yes |

---

## Dependencies

- None — self-contained refactor
- No new packages
- No API changes
- No type changes (Block interface stays the same)
- No CSS changes

## Risks

1. **Closure dependencies in renderBlock** — many handlers close over local state. Must thread through context object.
2. **selectSlashItem complexity** — 7 branching paths with different state mutations. Must preserve every path.
3. **useEffect ordering** — some effects depend on state from other effects. Must maintain execution order.
4. **Prop drilling** — EditorShell will need many props. Consider context if it gets unwieldy (but start with props).

---

## Not In Scope

- No new features
- No block type changes
- No UI changes
- No CSS changes
- No type refactoring (Block interface stays flat)
- No performance optimization (that's a separate mission)
