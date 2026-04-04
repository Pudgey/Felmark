# Session Handoff — 2026-04-04

## What happened

Two sessions ran today. First: Client Hub V2 drawer, drawing block wiring, canvas improvements, housekeeping, pane dropdown investigation. Second (current close): structural cleanup — offboarded misplaced components from `workstation/` into correct permanent homes, no new features built.

## Completed (structural cleanup session)

1. **Pipeline moved** — `workstation/pipeline/` → `workspace/pipeline/`
2. **Finance moved** — `workstation/finance/` → `workspace/finance/`
3. **Dead view wrappers deleted** — `views/pipeline.tsx`, `views/finance.tsx` (rail routing already removed; these were orphans)
4. **Search moved** — `workstation/search/` → `components/search/` (cross-cutting, rail-accessible)
5. **Calendar moved** — `workstation/calendar/` → `components/calendar/` (cross-cutting, rail-accessible)
6. **ForgePaper rebranded to Paper** — `workstation/forge-paper/` → `components/paper/`; all component names renamed (`ForgePaper` → `Paper`, `ForgePaperOutline` → `PaperOutline`), props interfaces, internal imports, CSS module references, and `views/forge.tsx` import all updated
7. **Team moved** — `workstation/team/` → `components/team/`; `views/team.tsx` import updated

## Completed (earlier session)

1. **Client Hub V2** — Replaced fixed detail panel with animated slide-out drawer (Asana-style). Live timer, Detail/Comments tabs, property rows with keyboard shortcuts, priority bars, role badges, footer actions, section collapse, view tabs, filter/sort.
2. **Drawing block wired** — Full `/drawing` → sub-picker → 8 types → block creation flow. Added to `useSlashMenu`, `DocumentSurface`, `BlockRenderer`, `blockRegistry`, `EditorCore`.
3. **Canvas shake fixed** — `Math.random()` → deterministic `srand(seed)` in all sketchy rendering functions.
4. **Canvas resize handles** — 8-point selection handles, single + multi-element proportional scaling.
5. **Canvas undo/redo** — `useCanvasUndo` hook, 50-entry stack, toolbar buttons + ⌘Z/⌘⇧Z.
6. **Canvas split** — 779-line monolith → 6 files (geometry, sketchy, rendering, resize, useCanvasUndo, CanvasBlock at 402 lines).
7. **Housekeeping** — 8 stale missions removed, dead `visual/` block deleted, `blocks/MANIFEST.md` fixed, `editor/MANIFEST.md` created.
8. **Pane dropdown fix attempt** — Added click-outside handler + stopPropagation on menus. Did not resolve the issue.

## In-progress work

- [ ] **Workspace core extraction** — approved plan, not yet built (see below)

## Remaining work (priority order)

- [ ] **Fix pane surface dropdown** — browser debug required (see Known Bug below)
- [ ] **Workspace core extraction** — split `SplitPanes.tsx` (921 lines) and `SplitPanes.module.css` (1,292 lines) into:
  - `workspace/core/tabs/WorkspaceTabs.tsx` — HybridHeader / tab chrome
  - `workspace/core/layout/PaneLayout.tsx` — pane layout state + split logic
  - `workspace/core/layout/Pane.tsx` — individual pane chrome
  - `workspace/core/surfaces/*Pane.tsx` — 7 individual surface bodies + `registry.ts`
  - `workspace/MANIFEST.md` already reflects the target state — use it as the spec
- [ ] **Calendar-in-workspace** — queued after core extraction. Add `"calendar"` view to `WorkspaceRouter`, thin `WorkspaceCalendarView` wrapper, scoped to the active client.
- [ ] **Browser-verify** `codex-workspace-core-restructure` branch before merge
- [ ] **Browser-verify** shared terminal behavior on `main`
- [ ] **Rebuild FORGE_MAP.md** — stale; files moved and deleted this session. Run `/forge` before any dependency-sensitive work.
- [ ] **Rebuild Settings page** — clean slate at `components/settings/` + view wrapper in `views/`
- [ ] **Split Canvas.tsx** into storage, derived state, and render pieces
- [ ] **Fix graph typing** in `GraphDataEditor.tsx` / `GraphBlock.tsx` (replace `any`-based handling)
- [ ] **Verify TerminalWelcome** split pane in browser

## Known Bug — Pane Surface Dropdown Broken

The surface picker dropdown in workspace panes does not work. Clicking the label (e.g., "▸ Money ▾") should open a dropdown to switch surfaces but it doesn't respond or immediately closes.

**What's been tried:**
- Added `stopPropagation()` on all three menu containers (surface, split, context)
- Added `pointerdown` click-outside handler to close menus
- Neither fixed it

**Likely root causes to investigate:**
- The codex agent restructured `Pane.tsx` during `codex-workspace-core-restructure` — the dropdown may have lost something in the extraction from the old `SplitPanes.tsx`
- The `felmark:dismiss-ctx` event listener may be firing on every click and closing the menu immediately
- The `.paneInactive { opacity: .55 }` or parent overflow may be intercepting pointer events
- Need browser DevTools to check: is the click handler firing? Is `surfaceMenuOpen` toggling? Is the dropdown rendering but invisible (z-index, clipping)?

## Gotchas

- `SplitPanes.tsx` is the next hotspot to split. At 921 lines it is well into red territory. Do not add any code to it — only extract from it.
- `SplitPanes.module.css` at 1,292 lines must be split in the same pass as the code extraction. Each surface module gets its own `.module.css`.
- `workspace/MANIFEST.md` was pre-updated to reflect the target folder structure. Treat it as the authoritative spec for the core extraction. Do not invent new folder names.
- Missing MANIFESTs to create during core extraction: `workspace/hub/`, `workspace/newtab/`, `workspace/products/`, `workspace/toasts/`, `workspace/panes/`.
- `Paper` is the canonical name — `ForgePaper` is retired. Any lingering import or reference to `ForgePaper` is stale.
- `SplitPanes.tsx` still exists as a compatibility shim from the `codex-workspace-core-restructure` worktree; the real implementation lives under `workspace/core/` in that branch.
- `UniqueBlocks.module.css` is NOT orphaned — 8 unique block components import it as a shared stylesheet. Do not delete.
- Canvas `nextCanvasId` is a module-level `let` — not persisted across page reloads. Element IDs reset on remount.
- `npm run typecheck` can fail in a fresh worktree before a build because `tsconfig.json` includes `.next/types/**/*.ts`; run `./node_modules/.bin/next build --webpack` first, then `./node_modules/.bin/tsc --noEmit --incremental false`.
- Worktree verification still relies on the symlinked `dashboard/node_modules` setup.
