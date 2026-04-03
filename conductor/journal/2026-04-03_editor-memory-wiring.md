# Journal — 2026-04-03 — Editor Memory Wiring

**Date**: 2026-04-03
**Agent**: codex-main
**Tags**: `dashboard`, `editor`, `persistence`, `architecture`

## What happened

Moved the live editor persistence flow onto the new `forge/memory/` boundary so editor hydration, migration, and saves now go through one typed path.

## What changed

### 1. Hydration now uses editor memory
- Updated `dashboard/src/app/page.tsx`
- Editor block hydration now calls `loadEditorMemory()`
- The app only replaces the seeded document when a real editor snapshot or non-empty legacy block map exists
- Legacy block storage is promoted forward into the new `editorMemory` snapshot on load
- Memory debug anomalies now log through a single `console.warn` entry with source + report

### 2. Saves now use editor memory
- Updated `dashboard/src/forge/hooks/usePersistence.ts`
- Editor block saves now call `saveEditorMemory(blocksMap, savedAt)`
- `lastSavedAt` now initializes from the editor snapshot instead of the legacy standalone key
- Generic `loadFromStorage()` went back to being generic; block migration logic is no longer duplicated there

### 3. Memory API tightened
- Updated `dashboard/src/forge/memory/types.ts`
- Updated `dashboard/src/forge/memory/memory.ts`
- `loadEditorMemory()` now reports whether it loaded from:
  - `snapshot`
  - `legacy`
  - `empty`

That lets the app distinguish “nothing stored yet” from “a real empty snapshot” and avoid wiping the seeded state accidentally.

### 4. Cleanup while verifying
- Removed an unused `STATUS` import from `dashboard/src/components/workstation/editor/core/components/breadcrumb/Breadcrumb.tsx`
- This was the only remaining full-lint warning in the worktree

## Verification

- `npm run lint`
- `./node_modules/.bin/tsc --noEmit --incremental false`
- `npm run build`

## Notes

- The wiring was committed in worktree branch `codex-editor-unmounted-cleanup` at `8849802`
- A symlinked worktree `node_modules` tree was enough for lint/typecheck but not for Turbopack build verification
- Installed a real local `node_modules` in the worktree before rerunning `npm run build`
