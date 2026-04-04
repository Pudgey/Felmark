# Active Context — 2026-04-04

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a workstation shell with modular editor core, a workspace rail whose component tree has been significantly cleaned up this session, a Grid Canvas homepage with 6 interactive space blocks, a workspace sidebar with client navigation, an EditorSidebar for document-editing context, a views routing layer, and a dedicated app-level home dashboard.

## Current Focus

- **Workspace core extraction** — approved, not yet built. Extract `SplitPanes.tsx` (921 lines) into `core/tabs/WorkspaceTabs.tsx`, `core/layout/PaneLayout.tsx`, `core/layout/Pane.tsx`, and `core/surfaces/*Pane.tsx`. `workspace/MANIFEST.md` already reflects the target state — use it as the spec.
- **Calendar-in-workspace** — queued after core extraction. New `"calendar"` view in `WorkspaceRouter` + thin `WorkspaceCalendarView` wrapper, scoped to the active client.
- Browser-verify and merge workspace core restructure from worktree `codex-workspace-core-restructure`
- FORGE_MAP.md rebuild — stale; multiple files moved and deleted this session
- Settings page rebuild (component deleted, clean slate at `components/settings/`)
- Browser-verify shared terminal parity between workspace surface and editor split pane on `main`

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Views routing layer | Built — ViewRouter + view wrappers (2 dead wrappers removed: pipeline, finance) |
| Workspace rail | Core extraction approved but not yet built — `SplitPanes.tsx` still at 921 lines |
| Workspace core restructure branch | In worktree `codex-workspace-core-restructure` — pending browser verification + merge |
| Grid Canvas | Built, 6 interactive space blocks + 10 metric/placeholder blocks |
| Workspace Sidebar | Built — client cards, sparklines, health rings, search |
| EditorSidebar | Built — document-context sidebar with workstation switcher, project list, archive |
| Paper (formerly ForgePaper) | Renamed and moved to `components/paper/` — all internal references updated |
| Pipeline | Moved from `workstation/` to `workspace/pipeline/` |
| Finance | Moved from `workstation/` to `workspace/finance/` |
| Search | Moved from `workstation/` to `components/search/` (top-level, rail-accessible) |
| Calendar | Moved from `workstation/` to `components/calendar/` (top-level, rail-accessible) |
| Team | Moved from `workstation/` to `components/team/` (top-level, rail-accessible) |
| Home Dashboard | Moved to `components/home/` — app-level surface |
| Editor Core | Refactored — `editor/core/` with 8 hooks, 7 components, block registry |
| Settings surface | Deleted, ready for rebuild |
| TerminalWelcome | Onboarding/empty state only (no-workstation fallback) |
| Quality gates | Active — lint (strict), typecheck, CI on PRs |

## Recent Completed Work

- **Workspace structural cleanup** — offboarded pipeline/finance → `workspace/`, search/calendar/team → top-level `components/`, forge-paper rebranded to Paper and moved to `components/paper/`. Dead view wrappers deleted. Workstation folder is now editor-scoped only.
- **Workspace core restructure** — in worktree `codex-workspace-core-restructure`, extracted `WorkspaceTabs`, `PaneLayout`, `Pane`, and 7 pane surface modules; retired `SplitPanes.module.css`, kept `SplitPanes.tsx` as a compatibility shim, added missing manifests for workspace subfolders, and fixed the old `ClientHub.tsx` lint blockers so `dashboard` lint passes cleanly in the branch
- **Super-brain follow-ups** — repaired `workstation/MANIFEST.md`, moved `splitProjectName`/`splitClientName` lookups upstream as memoized values, extracted hydration effect to `useHydrateAppState`, moved resize handler into `useShellLayout`, extracted 3 modal mounts to `ShellModals.tsx`. `page.tsx`: 509 → 378 lines.
- **Shared terminal session** — workspace split panes now mount the real terminal, share command/NL history with the editor split pane, keep ambient suggestions workstation-only
- **Split-pane architecture spec** — tmux-derived conductor design doc added at `conductor/FELMARK_SPLIT_PANE_ARCHITECTURE.md`
- **Quality gates** — `npm run lint` (strict), `npm run typecheck`, `npm run check`, CI workflow
- **Lint baseline cleanup** — 99 problems → 0 across ~45 files
- **Editor core refactor** — 1,779-line monolith → modular `editor/core/`
- **Home surface decision** — DashboardHome moved from `workstation/` to `components/home/`

## Pending Manual Actions

- Browser-verify workspace refactor branch `codex-workspace-core-restructure` before merge
- Browser-verify shared terminal behavior on `main`
- Run `/forge` to rebuild FORGE_MAP.md (stale — files moved/deleted this session)
- Rebuild Settings page as `components/settings/` + view in `views/`
- Create missing MANIFESTs: `workspace/hub/`, `workspace/newtab/`, `workspace/products/`, `workspace/toasts/`, `workspace/panes/` — do during core extraction pass
