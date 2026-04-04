# Journal — 2026-04-04 — Workspace Core Restructure

## Tags
`codex`, `workspace`, `architecture`, `refactor`

## What happened

Implemented the workspace core restructure in worktree branch `codex-workspace-core-restructure` to break the old `SplitPanes` hotspot into dedicated tabs, layout, and surface modules without changing the user-facing workspace flow.

## Architecture

- Extracted workspace chrome into `dashboard/src/components/workspace/core/tabs/WorkspaceTabs.tsx`
- Extracted pane state/orchestration into `dashboard/src/components/workspace/core/layout/PaneLayout.tsx`
- Extracted pane chrome into `dashboard/src/components/workspace/core/layout/Pane.tsx`
- Extracted surface bodies into `dashboard/src/components/workspace/core/surfaces/`
- Left `dashboard/src/components/workspace/panes/SplitPanes.tsx` as a compatibility shim and removed `SplitPanes.module.css`
- Added missing MANIFESTs for `workspace/core/`, `workspace/core/layout/`, `workspace/panes/`, `workspace/hub/`, `workspace/newtab/`, `workspace/products/`, and `workspace/toasts/`

## Important behavior

- The workspace route now renders `WorkspaceTabs + WorkspaceSidebar + PaneLayout`
- Pane surfaces are independently editable instead of being inlined into one 900-line component
- The live seventh pane is `TerminalPane`, not `FinancePane`; the refactor followed the live code rather than the initial proposal outline
- `ClientHub.tsx` no longer trips lint with synchronous state resets on client switches because the router remounts it per client tab

## Verification

Verified in the worktree:
- `npm run lint`

## Commits

- `280c080` `checkpoint: pre-workspace-core-restructure 20260404-0313`
- `3860b35` `Extract workspace tabs from split panes`
- `8b89ff8` `Extract workspace pane surface modules`
- `c047aa2` `Extract workspace pane layout shell`
