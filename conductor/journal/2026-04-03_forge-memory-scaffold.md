# Journal — 2026-04-03 — Forge Memory Scaffold

**Date**: 2026-04-03
**Agent**: codex-main
**Tags**: `dashboard`, `editor`, `architecture`, `persistence`

## What happened

Built the folder structure for a dedicated editor persistence boundary so saved document state, migrations, and debugging can live in one place instead of leaking across hooks and block code.

## What changed

### 1. Added a forge-level memory folder
- Created `dashboard/src/forge/memory/`
- Added:
  - `types.ts`
  - `storage.ts`
  - `migrations.ts`
  - `debug.ts`
  - `memory.ts`
  - `index.ts`

### 2. Defined the intended seam
- `storage.ts` owns the storage adapter and key-slot generation
- `types.ts` owns the snapshot, migration, and debug report contracts
- `migrations.ts` owns block-shape normalization and legacy fallback conversions
- `debug.ts` builds a report for unknown block types, deprecated types, and fallback conversions
- `memory.ts` exposes the high-level load/save API that `usePersistence.ts` can move onto later

### 3. Kept the runtime stable
- Exported the new memory module from `dashboard/src/forge/index.ts`
- Updated `dashboard/src/forge/MANIFEST.md`
- Did **not** rewire `usePersistence.ts` yet

## Verification

- `npm run lint -- src/forge/memory src/forge/index.ts`
- `./node_modules/.bin/tsc --noEmit --incremental false`

## Notes

- The scaffold was committed in worktree branch `codex-editor-unmounted-cleanup` at `d2466fe`
- The current live persistence path is still `forge/hooks/usePersistence.ts`
- The next pass should replace the direct `blocksMap` / `lastSavedAt` storage flow with the new `editorMemory` snapshot boundary
