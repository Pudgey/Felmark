# Forge Map — Dependency & Architecture Scan

> **Last forged**: 2026-04-04
> **Codebase**: 325 `.ts` / `.tsx` / `.css` files, ~58,268 lines
> **Block types**: 55 public workstation block types
> **Workspace canvas blocks**: N/A — canvas grid replaced by pane-based surface system (7 surfaces)
> **Component directories**: 43
> **Views layer**: 15 files total (10 view wrappers, 3 routers, 1 ViewRouter, 1 MANIFEST)

---

## Route Map

| Route | Entry File | Purpose |
|-------|-----------|---------|
| `/` | `dashboard/src/app/page.tsx` | Dashboard shell. Owns hydration, persistence, shell layout state, forge wiring, rail/sidebar composition, and passes routed props into `ViewRouter`. |
| `/share/[id]` | `dashboard/src/app/share/[id]/page.tsx` | Public shared document view. |
| `/api/canvas` | `dashboard/src/app/api/canvas/route.ts` | AI canvas autodraw endpoint (new since 2026-04-03). |
| `/api/generate` | `dashboard/src/app/api/generate/route.ts` | AI generation endpoint. |
| `/api/share` | `dashboard/src/app/api/share/route.ts` | Share CRUD endpoint. |
| `/api/wire` | `dashboard/src/app/api/wire/route.ts` | The Wire data endpoint. |
| `/api/terminal/query` | `dashboard/src/app/api/terminal/query/route.ts` | Terminal command processing. |
| `/api/terminal/ambient` | `dashboard/src/app/api/terminal/ambient/route.ts` | Terminal ambient data. |

---

## Routing Topology

### Root shell

`app/page.tsx`
- Boots `INITIAL_WORKSTATIONS`, tabs, comments, activities, blocks, archived projects.
- Hydrates from local storage via `loadFromStorage`.
- Delegates persistence to `forge/hooks/usePersistence.ts`.
- Delegates shell UI state to `forge/hooks/useShellLayout.ts`.
- Delegates workstation/project/document actions to `forge/hooks/useWorkstationActions.ts`.
- Renders global frame: `Rail`, `EditorSidebar`, onboarding, launchpad, template modals, and `ViewRouter`.

### Router split

`views/ViewRouter.tsx`
- Resolves `railActive` into one of three domains: `dashboard`, `workstation`, `workspace`.

`views/routers/DashboardRouter.tsx`
- Owns dashboard-facing rail views: `home`, `calendar`, `search`, `services`, `pipeline`, `templates`, `finance`, `wire`, `team`.

`views/routers/WorkstationRouter.tsx`
- Owns document-editing flows.
- `workstations` → `views/editor.tsx` → `components/workstation/editor/Editor.tsx` → `core/EditorCore.tsx`
- `forge` → `views/forge.tsx` → `components/paper/Paper.tsx` (renamed from `ForgePaper.tsx`; 471 lines)

`views/routers/WorkspaceRouter.tsx`
- Owns the standalone workspace surface.
- Renders `WorkspaceSidebar` + `PaneLayout` (from `workspace/core/layout/`).
- No longer uses the canvas grid — canvas surface was removed entirely.
- Note: `views/workspace.tsx` does NOT exist as a discrete view file. WorkspaceRouter is the live entry.

---

## Current Hotspots

| File | Lines | Why it matters | Status |
|------|-------|----------------|--------|
| `dashboard/src/lib/types.ts` | 710 | Widest type hub in the app; central block, shell, and feature contracts. | Yellow watch |
| `dashboard/src/components/workspace/sidebar/WorkspaceSidebar.tsx` | 552 | Workspace shell nav — grew significantly; approaching split threshold. | Yellow — watch |
| `dashboard/src/components/workstation/editor/blocks/canvas/CanvasBlock.tsx` | 751 | Canvas whiteboard block with autodraw; largest single block file. | Yellow — approaching Red |
| `dashboard/src/components/workstation/editor/core/EditorCore.tsx` | 491 | Editor integration hub after the monolith split; sits just under the threshold. | Green, near threshold |
| `dashboard/src/components/paper/Paper.tsx` | 471 | Forge Paper document surface; renamed from ForgePaper.tsx, moved out of workstation/. | Green |
| `dashboard/src/app/page.tsx` | 378 | App composition root and state hub. No longer a hotspot but broad blast radius. | Green |
| `dashboard/src/forge/hooks/useWorkstationActions.ts` | 386 | Action orchestration seam between page state and forge services. | Watch |
| `dashboard/src/components/workstation/editor/core/hooks/useBlockOperations.ts` | 345 | Editor mutation hub; next hook to split on touch. | Watch |
| `dashboard/src/components/sidebar/EditorSidebar.tsx` | 306 | Document-context sidebar with workstation switcher, archive, and save state UI. | Stable |
| `dashboard/src/lib/constants.ts` | 126 | Public block registry, slash metadata, status config, and workstation seeds. | Stable |
| `dashboard/src/views/ViewRouter.tsx` | 30 | Domain dispatcher for the whole UI shell. | Stable |
| `dashboard/src/forge/index.ts` | 59 | Public forge entrypoint and block-ops export seam. | Stable |

---

## Product Surfaces

| Surface | Current entry | Notes |
|---------|---------------|-------|
| Dashboard shell | `dashboard/src/app/page.tsx` | Owns state, persistence, shell chrome, and routing. |
| Workstation editor | `dashboard/src/views/editor.tsx` | Thin wrapper into the modular editor core. |
| Forge Paper | `dashboard/src/views/forge.tsx` → `components/paper/Paper.tsx` | Renamed from `ForgePaper.tsx`; 471 lines. Lives at `components/paper/` (not `workstation/`). |
| Workspace | `views/routers/WorkspaceRouter.tsx` | Pane-based workspace: `WorkspaceSidebar` + `PaneLayout`. Canvas grid removed. |
| Dashboard home | `dashboard/src/views/home.tsx` | App-level home surface, separate from workstation/editor. |
| Dashboard tools | `calendar.tsx`, `search.tsx`, `services.tsx`, `wire.tsx`, `team.tsx`, `templates.tsx` | Routed by `DashboardRouter`. |
| Settings | `dashboard/src/components/settings/` | Directory exists; is empty. No live routed surface yet. |

---

## Workstation Editor Map

`dashboard/src/components/workstation/editor/`
- `Editor.tsx` is a 2-line re-export into `core/EditorCore.tsx`.
- `core/` contains the modular editor shell:
  - 7 component folders: `block-registry`, `block-renderer`, `breadcrumb`, `document-surface`, `tab-bar`, `toolbar` (with `split-picker`), `zen-hint`
  - 8 hooks: `useBlockOperations`, `useContentCache`, `useEditorKeys`, `useFocusManager`, `usePanelState`, `useSlashMenu`, `useTabOverflow`, `useUndoStack`
- `chrome/` contains editor UI layers:
  - `command-bar`, `command-palette`, `editable-block`, `format-bar`, `margin`, `slash-menu`, `split-pane`
- `panels/` contains `cat`, `conversation`, `share-modal`
- `blocks/` contains 39 named block directories plus `shared` helpers and `unique` catch-all

### Public workstation block registry

Source of truth: `dashboard/src/lib/constants.ts`

- Categories exposed in the slash system: `Basic`, `Blocks`, `Visual`, `Collaboration`
- Public block count: **55**
- Representative families:
  - Basic text: paragraph, h1, h2, h3, bullet, numbered, todo
  - Structured content: table, accordion, math, gallery, bookmark, deadline, audio, canvas, swatches
  - Collaboration: comment-thread, mention, question, feedback, decision, poll, handoff, signoff, annotation
  - Visual/animated: graph, timeline, flow, brandboard, moodboard, wireframe, pullquote, hero-spotlight, kinetic-type, number-cascade, stat-reveal, value-counter, drawing
  - Domain blocks: money, deliverable, ai, ai-action, pricing-config, scope-boundary, asset-checklist, decision-picker, availability-picker, progress-stream, dependency-map, revision-heatmap

### Block directories on disk (39 named + shared + unique)

`accordion`, `ai`, `ai-action`, `annotation`, `audio`, `before-after`, `bookmark`, `brand-board`, `canvas`, `comment-thread`, `deadline`, `decision`, `deliverable`, `drawing`, `feedback`, `flow`, `gallery`, `graphs`, `handoff`, `hero-spotlight`, `kinetic-type`, `math`, `mention`, `money`, `mood-board`, `number-cascade`, `poll`, `pull-quote`, `question`, `signoff`, `stat-reveal`, `swatches`, `table`, `timeline`, `unique`, `value-counter`, `wireframe`, `shared`

Note: `canvas/` block now lives here — **not** under `workspace/`. Contains `CanvasBlock.tsx`, `useAutodraw.ts`, `useCanvasUndo.ts`, `sketchy.ts`, `geometry.ts`, `rendering.tsx`, `resize.ts`, `stencils.ts`, `StencilPicker.tsx`.

---

## Workspace Pane System Map

`dashboard/src/components/workspace/` — the old canvas grid system has been fully replaced.

### Core layout
`workspace/core/layout/`
- `PaneLayout.tsx` — dual-pane shell (top/bottom surface assignment)
- `Pane.tsx` — individual pane container

### Pane surfaces (7 live surfaces)
`workspace/core/surfaces/` — `registry.ts` is the source of truth

| Surface ID | Component | Description |
|------------|-----------|-------------|
| `money` | `MoneyPane.tsx` | Invoices, revenue, payments |
| `work` | `WorkPane.tsx` | Tasks, timers, subtasks |
| `signals` | `SignalsPane.tsx` | Client activity feed |
| `pipeline` | `PipelinePane.tsx` | Deals, proposals, contracts |
| `clients` | `ClientsPane.tsx` | Client records and contacts |
| `time` | `TimePane.tsx` | Time entries and tracking |
| `terminal` | `TerminalPane.tsx` | Forge command line |

### Tabs
`workspace/core/tabs/WorkspaceTabs.tsx` — top header bar; `topSurface` + `bottomSurface` prop assignment.

### Supporting workspace modules
- `workspace/sidebar/WorkspaceSidebar.tsx` (552 lines — Yellow) — workspace shell nav
- `workspace/hub/ClientHub.tsx` — per-client hub view
- `workspace/newtab/NewTab.tsx` — new tab landing
- `workspace/pipeline/PipelineBoard.tsx` — standalone pipeline tool tab
- `workspace/finance/FinancePage.tsx` — standalone finance tool tab
- `workspace/products/ProductsTab.tsx` — standalone products/services tool tab
- `workspace/timer/FloatingTimer.tsx` — floating time tracker UI
- `workspace/toasts/Toasts.tsx` — workspace-level toast system
- `workspace/panes/SplitPanes.tsx` — legacy split pane (check if still routed)
- `workspace/Workspace.tsx` — legacy workspace root (retained but may be superseded by WorkspaceRouter)

---

## Forge Layer

`dashboard/src/forge/` — **29 files**

### Public entry
`dashboard/src/forge/index.ts` (59 lines)
- Exposes `createForge(state)`
- Re-exports shared block operations: `getBlockDefaults`, `needsTrailingParagraph`, `needsPicker`, `createEmptyBlock`, `createEmptyDocument`, `convertBlock`, `insertAfter`, `removeBlock`

### Hooks
- `usePersistence.ts` — local storage persistence, save indicator state, explicit save
- `useShellLayout.ts` — rail/sidebar/layout/zen/split shell state
- `useWorkstationActions.ts` (386 lines) — high-level shell actions and forge wiring
- `useHydrateAppState.ts` — app hydration hook

### Services
- `services/workstations.ts`
- `services/projects.ts`
- `services/documents.ts`
- `services/tabs.ts`

### Block default registries
- `services/blocks/basic.ts`
- `services/blocks/content.ts`
- `services/blocks/visual.ts`
- `services/blocks/money.ts`
- `services/blocks/collaboration.ts`
- `services/blocks/ai.ts`
- `services/blocks/unique.ts`
- `services/blocks/core.ts` — merges all above into one default registry

### Memory layer
- `memory/editor/memory.ts`
- `memory/editor/storage.ts`
- `memory/editor/migrations.ts`
- `memory/editor/debug.ts`
- `memory/editor/types.ts`
- `memory/editor/index.ts`
- `memory/index.ts`

### Types
- `forge/types.ts`

### Important seam
Forge block defaults import from the actual workstation block components. That means "is this block still live?" checks must scan the whole `dashboard/src/` tree, not just `lib/constants.ts` or the editor UI.

---

## Lib Layer

`dashboard/src/lib/` — **20 files**

- `types.ts` (710 lines, Yellow) — central type hub
- `constants.ts` (126 lines) — block registry + slash metadata
- `utils.ts` — shared utilities
- `themes.ts` — theme definitions
- `due-dates.ts` — due date helpers
- `initial-services.ts` — wire service seeds
- `starter-templates.ts` — document template seeds
- `wire-context.ts` — wire context types
- `terminal/` — full terminal subsystem:
  - `commands/` (7 files): `clear`, `client`, `index`, `pipeline`, `rate`, `status`, `theme`, `wire`
  - `parser.ts`, `session.tsx`, `types.ts`, `watcher.ts`

---

## Folder Scan

| Area | File count | Notes |
|------|------------|-------|
| `dashboard/src/components/workstation/` | 237 | Flagship product surface; editor dominates the file count. |
| `dashboard/src/components/workstation/editor/` | 218 | Blocks, chrome, panels, and modular editor core. |
| `dashboard/src/components/workspace/` | 50 | Pane-based workspace surface; canvas grid removed. |
| `dashboard/src/forge/` | 29 | State hooks, services, types, memory layer, and block default registries. |
| `dashboard/src/views/` | 15 | View wrappers plus domain routers. |
| `dashboard/src/lib/` | 20 | Types, constants, seeds, utilities, and terminal subsystem. |

---

## Drift / Watch Items

1. **`workspace/canvas/` is GONE.** The entire canvas grid surface (Canvas.tsx, registry.ts, 21 block defs, hooks/) was removed. The old map's "Workspace Canvas Map" section no longer applies. The replacement is the pane system under `workspace/core/`.

2. **`Paper.tsx` at 471 lines** (Green). Renamed from `ForgePaper.tsx` and moved from `workstation/forge-paper/` → `components/paper/`. `views/forge.tsx` imports it correctly. No issue.

3. **`WorkspaceSidebar.tsx` at 552 lines** crossed from Green into Yellow. Next touch should propose a split (nav logic vs. UI rendering).

4. **`CanvasBlock.tsx` at 751 lines** is Yellow approaching Red. The autodraw feature (`useAutodraw.ts`) was added as a hook but the main block file still holds tool state, stencil dispatch, and render logic. Good candidate for sub-component extraction.

5. **`dashboard/src/components/settings/`** directory exists and is confirmed empty. No live surface yet.

6. **`workspace/panes/SplitPanes.tsx`** — retained but unclear if it is still routed. WorkspaceRouter uses `PaneLayout` not `SplitPanes`. May be dead code.

7. **`workspace/Workspace.tsx`** — the old legacy root still exists. WorkspaceRouter.tsx is the live entry. Verify whether `Workspace.tsx` is still imported anywhere before deleting.

8. **New `/api/canvas/route.ts`** — added for autodraw. Confirm it is included in any API security review or rate-limiting policy.

9. **`types.ts` dropped from 735 → 710 lines** and `page.tsx` from 418 → 378. Both healthy moves. Continue trend.
