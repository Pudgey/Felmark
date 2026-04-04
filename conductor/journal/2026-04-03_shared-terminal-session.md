# Journal — 2026-04-03 — Shared Terminal Session

## Tags
`codex`, `terminal`, `workspace`

## What happened

Implemented the shared terminal session in worktree branch `codex-shared-terminal` so the workspace split-pane terminal and the workstation editor split pane now mount the same real terminal UI and share command/NL history.

## Architecture

- Added a serializable terminal session model in `dashboard/src/lib/terminal/session.tsx`
- Added an app-level `SharedTerminalProvider` in `dashboard/src/components/terminal/mounts/SharedTerminalProvider.tsx`
- Added mount adapters:
  - `WorkstationTerminalMount.tsx` for editor split panes with ambient enabled
  - `WorkspaceTerminalMount.tsx` for workspace panes with ambient disabled
- Kept `Terminal.tsx` as the terminal UI and `TerminalProvider.tsx` as the runtime/controller

## Important behavior

- Workspace and workstation now share the same terminal command and NL-response history
- Ambient insights remain workstation-only and are not persisted into the shared session
- Terminal navigation actions can route back into workstation context through the app shell

## Verification

Verified in the worktree:
- `npm run lint`
- `./node_modules/.bin/next build --webpack`
- `./node_modules/.bin/tsc --noEmit --incremental false`

## Commits

- `9b8e6ce` `Add shared terminal session core`
- `a5c4f0d` `Add shared terminal mounts`
- `4ae0b05` `Wire shared terminal into editor and workspace`
- `f9474b5` `Fix workspace verification blockers`
