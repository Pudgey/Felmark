# Forge Map — Dependency & Architecture Scan

> **Last forged**: 2026-04-03
> **Codebase**: 335 `.ts` / `.tsx` / `.css` files, ~60,689 lines
> **Block types**: 55 public workstation block types
> **Workspace canvas blocks**: 21 dashboard block defs
> **Component directories**: 101
> **Views layer**: 18 files total, 13 view wrappers, 3 routers

---

## Route Map

| Route | Entry File | Purpose |
|-------|-----------|---------|
| `/` | `dashboard/src/app/page.tsx` | Dashboard shell. Owns hydration, persistence, shell layout state, forge wiring, rail/sidebar composition, and passes routed props into `ViewRouter`. |
| `/share/[id]` | `dashboard/src/app/share/[id]/page.tsx` | Public shared document view. |
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
- `workstations` -> `views/editor.tsx` -> `components/workstation/editor/Editor.tsx` -> `core/EditorCore.tsx`
- `forge` -> `views/forge.tsx` -> `components/workstation/forge-paper/ForgePaper.tsx`

`views/routers/WorkspaceRouter.tsx`
- Owns the standalone workspace surface.
- Renders `views/workspace.tsx`, which now composes `WorkspaceSidebar` + `Canvas`.

---

## Current Hotspots

| File | Lines | Why it matters | Status |
|------|-------|----------------|--------|
| `dashboard/src/lib/types.ts` | 735 | Widest type hub in the app; central block, shell, and feature contracts. | Yellow watch |
| `dashboard/src/components/workspace/canvas/Canvas.tsx` | 726 | Main workspace canvas composition layer; owns grid state, drag interactions, render orchestration. | Yellow watch |
| `dashboard/src/components/workstation/editor/core/EditorCore.tsx` | 493 | Editor integration hub after the monolith split; sits just under the organization threshold. | Green, near threshold |
| `dashboard/src/components/workstation/forge-paper/ForgePaper.tsx` | 470 | Forge document surface with local block state, outline sync, slash behavior, and save handoff. | Green |
| `dashboard/src/app/page.tsx` | 418 | App composition root and state hub. No longer a red hotspot, but still broad blast radius. | Green |
| `dashboard/src/components/workspace/sidebar/WorkspaceSidebar.tsx` | 405 | Workspace shell navigation and summary layer. | Green |
| `dashboard/src/forge/hooks/useWorkstationActions.ts` | 360 | Action orchestration seam between page state and forge services. | Watch |
| `dashboard/src/components/workstation/editor/core/hooks/useBlockOperations.ts` | 345 | Editor mutation hub; next hook to split on touch. | Watch |
| `dashboard/src/components/sidebar/EditorSidebar.tsx` | 306 | Document-context sidebar with workstation switcher, archive, and save state UI. | Stable |
| `dashboard/src/lib/constants.ts` | 126 | Public block registry, slash metadata, status config, and workstation seeds. | Stable |
| `dashboard/src/components/workspace/canvas/registry.ts` | 106 | Source of truth for workspace canvas block defs and initial rows. | Stable |
| `dashboard/src/views/ViewRouter.tsx` | 30 | Domain dispatcher for the whole UI shell. | Stable |
| `dashboard/src/forge/index.ts` | 36 | Public forge entrypoint and block-ops export seam. | Stable |

---

## Product Surfaces

| Surface | Current entry | Notes |
|---------|---------------|-------|
| Dashboard shell | `dashboard/src/app/page.tsx` | Owns state, persistence, shell chrome, and routing. |
| Workstation editor | `dashboard/src/views/editor.tsx` | Thin wrapper into the modular editor core. |
| Forge Paper | `dashboard/src/views/forge.tsx` | Dedicated document surface sharing forge block operations. |
| Workspace canvas | `dashboard/src/views/workspace.tsx` | Standalone workspace made of `WorkspaceSidebar` plus grid `Canvas`. |
| Dashboard home | `dashboard/src/views/home.tsx` | App-level home surface, separate from workstation/editor. |
| Dashboard tools | `calendar.tsx`, `search.tsx`, `services.tsx`, `pipeline.tsx`, `templates.tsx`, `finance.tsx`, `wire.tsx`, `team.tsx` | Routed by `DashboardRouter`. |
| Settings | `dashboard/src/components/settings/` | Directory exists but is currently empty. No live routed surface yet. |

---

## Workstation Editor Map

`dashboard/src/components/workstation/editor/`
- `Editor.tsx` is now a 2-line re-export into `core/EditorCore.tsx`.
- `core/` contains the modular editor shell:
  - 7 component folders: `block-registry`, `block-renderer`, `breadcrumb`, `document-surface`, `tab-bar`, `toolbar`, `zen-hint`
  - 8 hooks: `useBlockOperations`, `useContentCache`, `useEditorKeys`, `useFocusManager`, `usePanelState`, `useSlashMenu`, `useTabOverflow`, `useUndoStack`
- `chrome/` contains editor UI layers:
  - `command-bar`, `command-palette`, `editable-block`, `format-bar`, `margin`, `slash-menu`, `split-pane`
- `panels/` contains `cat`, `conversation`, and `share-modal`
- `blocks/` contains 41 block directories plus shared helpers

### Public workstation block registry

Source of truth: `dashboard/src/lib/constants.ts`

- Categories exposed in the slash system: `Basic`, `Blocks`, `Visual`, `Collaboration`
- Public block count: 55
- Representative families:
  - Basic text: paragraph, headings, bullet, numbered, todo
  - Structured content: table, accordion, math, gallery, swatches, bookmark, deadline, audio, canvas
  - Collaboration: comment-thread, mention, question, feedback, decision, poll, handoff, signoff, annotation
  - Visual/animated: graph, timeline, flow, brandboard, moodboard, wireframe, pullquote, hero-spotlight, kinetic-type, number-cascade, stat-reveal, value-counter, drawing
  - Domain blocks: money, deliverable, ai, ai-action, pricing-config, scope-boundary, asset-checklist, decision-picker, availability-picker, progress-stream, dependency-map, revision-heatmap

---

## Workspace Canvas Map

`dashboard/src/components/workspace/canvas/`
- `Canvas.tsx` is the composition root for the workspace surface.
- `storage.ts` persists canvas state.
- `layout.ts` handles row-based layout calculations.
- `registry.ts` defines constants, initial rows, and 21 canvas block defs.
- `hooks/` contains:
  - `useCanvasFooter`
  - `useCanvasGrid`
  - `useCanvasLabels`
  - `useDragMove`
  - `useDragPlace`
  - `useDragResize`
- `chrome/` contains `BlockChrome`, `ReplacePopover`, `Splitter`
- `insertions/` contains row and column insertion affordances
- `library/` contains the block picker
- `toolbar/` contains the top-level workspace toolbar
- `blocks/` contains the block content dispatcher and concrete workspace block UIs

### Workspace canvas block defs

Source of truth: `dashboard/src/components/workspace/canvas/registry.ts`

`revenue`, `outstanding`, `tasks`, `activity`, `health`, `timer`, `calendar`, `chat`, `invoices`, `files`, `pipeline`, `automation`, `whisper`, `rate`, `goal`, `note`, `revenue-chart`, `project-summary`, `command-surface`, `client-pulse`, `invoice-surface`

---

## Forge Layer

`dashboard/src/forge/` currently has 20 files.

### Public entry

`dashboard/src/forge/index.ts`
- Exposes `createForge(state)`
- Re-exports shared block operations:
  - `getBlockDefaults`
  - `needsTrailingParagraph`
  - `needsPicker`
  - `createEmptyBlock`
  - `createEmptyDocument`
  - `convertBlock`
  - `insertAfter`
  - `removeBlock`

### Hooks

- `usePersistence.ts` - local storage persistence, save indicator state, explicit save
- `useShellLayout.ts` - rail/sidebar/layout/zen/split shell state
- `useWorkstationActions.ts` - high-level shell actions and forge wiring

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
- `services/blocks/core.ts` merges them into one default registry

### Important seam

Forge block defaults import from the actual workstation block components. That means "is this block still live?" checks must scan the whole `dashboard/src/` tree, not just `lib/constants.ts` or the editor UI.

---

## Folder Scan

| Area | File count | Notes |
|------|------------|-------|
| `dashboard/src/components/workstation/` | 258 | Flagship product surface; editor dominates the file count. |
| `dashboard/src/components/workstation/editor/` | 220 | Blocks, chrome, panels, and modular editor core. |
| `dashboard/src/components/workspace/` | 63 | Canvas surface, sidebar, timer, and legacy workspace page file. |
| `dashboard/src/forge/` | 20 | State hooks, services, types, and block default registries. |
| `dashboard/src/views/` | 18 | View wrappers plus domain routers. |
| `dashboard/src/lib/` | 8 | Shared constants, types, seeds, and utilities. |

---

## Drift / Watch Items

1. `dashboard/src/components/settings/` exists but is empty. The surface is still pending a rebuild.
2. `dashboard/src/components/workspace/Workspace.tsx` and `dashboard/src/components/workspace/MANIFEST.md` describe an older self-contained workspace page, but the live route now renders `WorkspaceSidebar` + `Canvas`.
3. Forge block defaults still include `columns` and `data-chips` factories via `services/blocks/content.ts`, while those types are not exposed in the public `BLOCK_TYPES` list in `lib/constants.ts`.
4. `types.ts`, `Canvas.tsx`, and `useBlockOperations.ts` remain the clearest next organization watch items.

