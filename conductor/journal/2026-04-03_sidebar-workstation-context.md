# Journal — 2026-04-03 — Sidebar Workstation Context Repair

## Tags
`debug`, `editor`, `sidebar`, `state`, `codex`

## What happened

After the first ghost-tab fix, one workstation sidebar bug remained: an active document could still render under a fake fallback "Personal" header with no avatar or archive section. This was not a second workstation in state. It was a null `activeWorkstationId` while a real owned document was active.

## Root cause

Two ownership gaps were still present:
- some create-and-focus flows were setting `activeProject` without also setting the owning `activeWorkstationId`
- returning to workstation mode with an already-active document did not repair workstation context if that id had previously been cleared

## Fix

Merged follow-up patch onto `main`:
- `dashboard/src/app/page.tsx` now restores the owning workstation when workstation mode is active and the current project has a real owner
- `dashboard/src/forge/services/projects.ts` now sets `activeWorkstationId` when creating or duplicating a project
- `dashboard/src/forge/services/workstations.ts` now sets `activeWorkstationId` when creating or quick-creating a workstation
- `dashboard/src/forge/hooks/useWorkstationActions.ts` now keeps workstation context when creating a document from a specific workstation

## Verification

Verified in the worktree:
- `npm run lint -- src/app/page.tsx src/forge/hooks/useWorkstationActions.ts src/forge/services/projects.ts src/forge/services/workstations.ts`
- `./node_modules/.bin/tsc --noEmit --incremental false`
- `./node_modules/.bin/next build --webpack`

Verified again on `main`:
- targeted lint passed
- `tsc --noEmit --incremental false` passed

## Commits

- Worktree commit: `7c640a7` `Restore workstation context for active tabs`
- Main merge commit: `b344e7a` merge of `codex-personal-tab-bug`
