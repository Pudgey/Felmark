# Journal — 2026-04-03 — Personal Tab Ghost Bug

## Tags
`debug`, `editor`, `tabs`, `state`, `codex`

## What happened

Debugged a workstation editor state bug where closing the last tab could resurrect a ghost "Personal" tab with stale pasted content, while empty workstations in the sidebar switcher could not be entered cleanly.

The root cause was two-part:
- fallback tab creation in forge services was reading stale workstation state and could recreate a no-longer-valid personal project
- saved tabs were hydrated without being reconciled against the live workstation/project tree, so orphaned tabs survived reloads

## Fix

Patched the bug in worktree branch `codex-personal-tab-bug`:
- `dashboard/src/forge/services/tabs.ts` now falls back only to the first real current project and ignores invalid tabs during close
- `dashboard/src/forge/services/projects.ts` and `dashboard/src/forge/services/workstations.ts` now compute fallback tabs from the next workstation state instead of reading stale state after archive/removal
- `dashboard/src/forge/hooks/useWorkstationActions.ts` now lets empty workstations become selectable and routes `New document` into the selected empty workstation instead of defaulting elsewhere
- `dashboard/src/app/page.tsx` now reconciles persisted tabs against real projects on hydration, removing orphaned ghost tabs and normalizing tab labels

## Verification

Verified in the worktree:
- `npm run lint -- src/app/page.tsx src/forge/hooks/useWorkstationActions.ts src/forge/services/projects.ts src/forge/services/tabs.ts src/forge/services/workstations.ts`
- `./node_modules/.bin/tsc --noEmit --incremental false`
- `./node_modules/.bin/next build --webpack`

## Gotcha

Turbopack build verification does not work in this worktree with a symlinked `node_modules`; it panics on the symlink root check. Lint/typecheck worked with the symlink, and the production build passed with `next build --webpack`.
