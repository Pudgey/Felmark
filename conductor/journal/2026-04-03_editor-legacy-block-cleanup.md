# Journal — 2026-04-03 — Editor Legacy Block Cleanup

**Date**: 2026-04-03
**Agent**: codex-main
**Tags**: `dashboard`, `editor`, `cleanup`, `migration`

## What happened

Debugged the workstation editor for dead or unmounted block paths and found one concrete mismatch: `columns` and `data-chips` still existed in persistence/default plumbing even though the live editor could no longer mount them.

## What changed

### 1. Root cause isolated
- Confirmed the mounted editor route still runs through `WorkstationRouter -> EditorView -> EditorCore`
- Confirmed `columns` and `data-chips` were absent from:
  - `lib/constants.ts` block registry
  - `BlockRenderer.tsx`
  - `blockRegistry.ts`
  - slash-menu insertion paths
- Confirmed they were still present in:
  - `forge/services/blocks/content.ts`
  - `forge/services/blocks/core.ts`
  - `lib/types.ts`
  - legacy block folders under `components/workstation/editor/blocks/`

### 2. Legacy hydration migration added
- Updated `forge/hooks/usePersistence.ts`
- Old stored `columns` blocks now hydrate as `callout` blocks containing recovered column labels/content
- Old stored `data-chips` blocks now hydrate as `callout` blocks containing recovered chip labels
- This prevents silent empty rendering for historical local documents after cleanup

### 3. Dead editor code removed
- Deleted:
  - `blocks/columns/ColumnsBlock.tsx`
  - `blocks/columns/ColumnsBlock.module.css`
  - `blocks/data-chips/DataChipsBlock.tsx`
  - `blocks/data-chips/DataChipsBlock.module.css`
  - both per-folder manifests
- Removed stale shared model/default references from:
  - `lib/types.ts`
  - `forge/services/blocks/content.ts`
  - `forge/services/blocks/core.ts`

### 4. Inventory/docs synced
- Updated `dashboard/src/forge/MANIFEST.md`
- Updated `dashboard/src/components/workstation/editor/blocks/MANIFEST.md`
- Updated `conductor/GUARDRAIL.md`

## Verification

- Targeted lint passed for:
  - `src/forge/hooks/usePersistence.ts`
  - `src/forge/services/blocks/content.ts`
  - `src/forge/services/blocks/core.ts`
  - `src/lib/types.ts`
- Non-incremental typecheck passed in the worktree:
  - `./node_modules/.bin/tsc --noEmit --incremental false`

## Notes

- The cleanup was committed in worktree branch `codex-editor-unmounted-cleanup` at `50ce2a6`
- Full-app lint was not rerun from main; only the touched scope plus typecheck were verified here
