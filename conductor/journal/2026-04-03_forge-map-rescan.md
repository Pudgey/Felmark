# Journal — 2026-04-03 — Forge Map Rescan

## Tags
`conductor`, `docs`, `architecture`, `dashboard`

## What happened

Ran a fresh architecture scan against the live `dashboard/src` tree and rebuilt `conductor/FORGE_MAP.md` from current code instead of patching the stale pre-refactor map.

## What changed

### 1. FORGE_MAP rebuilt from disk
- Updated the codebase metrics to `335` source files and `~60,689` lines
- Replaced the old route and hotspot descriptions with the current router split:
  - `ViewRouter`
  - `views/routers/DashboardRouter`
  - `views/routers/WorkstationRouter`
  - `views/routers/WorkspaceRouter`
- Documented the current workspace surface as `WorkspaceSidebar + Canvas`
- Documented the current forge layer as hooks + services + block-default registries
- Replaced stale block notes with the live workstation block registry and workspace canvas block registry

### 2. Conductor context synced
- Updated `ACTIVE_CONTEXT.md` to reflect the rebuilt forge map and current watch items
- Updated `HANDOFF.md` to remove the stale forge-map task and preserve new architecture gotchas

## Key findings from the rescan

- `components/settings/` exists again, but it is still empty
- `components/workspace/Workspace.tsx` and `components/workspace/MANIFEST.md` still describe the old self-contained workspace page even though the live route now renders `WorkspaceSidebar + Canvas`
- Forge block defaults still import `columns` and `data-chips` factories through `forge/services/blocks/content.ts`, while those types are no longer exposed in `lib/constants.ts`
- `dashboard/npm run lint` is no longer clean: `app/page.tsx` currently trips a hook-ordering error and unused vars, and `core/components/breadcrumb/Breadcrumb.tsx` has an unused `STATUS` import
- The clearest organization watch items remain `lib/types.ts`, `workspace/canvas/Canvas.tsx`, and `editor/core/hooks/useBlockOperations.ts`

## Why this matters

The conductor had drifted far enough that the old forge map was misleading. Future planning work, reviews, and refactors now have a current routing map, current hotspot list, and current ownership picture for the workstation, workspace, and forge layers.
