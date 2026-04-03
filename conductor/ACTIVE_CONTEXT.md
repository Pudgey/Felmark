# Active Context — 2026-04-03

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product currently has a modular workstation editor core, a standalone workspace surface routed through `WorkspaceSidebar + Canvas`, a Forge Paper rail surface, a workspace sidebar with client navigation, an EditorSidebar for document-editing context, a three-router views layer, and a dedicated app-level home dashboard. The editor no longer carries orphaned `columns` / `data-chips` block types in its live model; persisted legacy blocks now migrate into supported callouts on load, and live editor hydration/saves now run through `forge/memory/` instead of a split legacy path.

## Current Focus

- Draft the workstation rail/sidebar redesign spec in `conductor/` before any further implementation
- Capture the intended workstation rail prototype in `Prototype/`
- Rebuild the Settings surface
- Verify TerminalWelcome split-pane behavior in browser
- Split `dashboard/src/components/workstation/editor/core/hooks/useBlockOperations.ts` on next touch
- Split `dashboard/src/lib/types.ts` by block family on next touch
- Reconcile stale workspace docs with the live `WorkspaceSidebar + Canvas` route

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Views routing layer | Built — ViewRouter + 3 domain routers + 13 view wrappers |
| Workspace canvas | Built — standalone workspace route renders `WorkspaceSidebar` + grid `Canvas` |
| Workspace Sidebar | Built — client cards, sparklines, health rings, search |
| EditorSidebar | Built — document-context sidebar with workstation switcher, project list, archive |
| Forge Paper | Active |
| Home Dashboard | App-level surface in `components/home/` |
| Editor Core | Refactored — `editor/core/` with 8 hooks, 7 components, block registry |
| Forge memory boundary | Active — `forge/memory/` owns editor snapshot load/save, legacy block migration, and debug reporting; `page.tsx` + `usePersistence.ts` are wired to it |
| Settings surface | Directory exists, no implementation yet |
| TerminalWelcome | Onboarding/empty state only (no-workstation fallback) |
| Quality gates | Configured — lint (strict), typecheck, CI on PRs exist, but lint is currently failing locally after recent app changes |
| Redesign workflow | Active — prototype-first redesign skill exists in `conductor/skills/redesign/` |

## Recent Completed Work

- **FORGE_MAP sync** — conductor architecture scan rebuilt from the live `dashboard/src` tree (335 source files, ~60.7K lines)
- **Legacy editor block cleanup** — removed dead `columns` / `data-chips` workstation blocks from forge defaults, shared types, and block folders; `loadFromStorage()` now migrates old saved blocks into supported callouts
- **Forge memory scaffold** — added `dashboard/src/forge/memory/` with typed storage adapter, snapshot model, migration pipeline, and debug report builder for the next persistence refactor
- **Editor memory wiring** — `page.tsx` now hydrates blocks through `loadEditorMemory()`, legacy snapshots get promoted forward, and `usePersistence.ts` now saves editor state through `saveEditorMemory()`
- **Redesign skill** — added a prototype-first redesign protocol that requires spec + plan before structural UI implementation
- **Quality gates** — `npm run lint` (strict), `npm run typecheck`, `npm run check`, CI workflow
- **Lint baseline cleanup** — repo-wide dashboard lint baseline driven to zero
- **page.tsx decomposition** — persistence and shell layout extracted from the app shell
- **Canvas decomposition** — storage/state/footer pieces extracted from `Canvas.tsx`
- **Editor core refactor** — monolith split into modular `editor/core/`

## Pending Manual Actions

- Write the workstation rail redesign spec in `conductor/`
- Preserve the workstation rail visual direction in `Prototype/`
- Rebuild Settings as a routed view + workstation feature component
- Verify TerminalWelcome split pane in browser
