# Active Context — 2026-04-04

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a workstation shell with modular editor core, a split workspace rail whose tabs/layout/surfaces have been extracted in worktree `codex-workspace-core-restructure`, a Forge Paper rail surface, a Grid Canvas homepage with 6 interactive space blocks, a workspace sidebar with client navigation, an EditorSidebar for document-editing context, a views routing layer, and a dedicated app-level home dashboard.

## Current Focus

- Browser-verify and merge workspace core restructure from worktree `codex-workspace-core-restructure`
- Browser-verify shared terminal parity between workspace surface and editor split pane on `main`
- Split `dashboard/src/components/workspace/canvas/Canvas.tsx` into storage, state, and render pieces
- Harden graph block typing in `GraphDataEditor.tsx` / `GraphBlock.tsx`
- FORGE_MAP.md rebuild (stale — actual file count is 405, map shows 335)
- Settings page rebuild (component deleted, clean slate)
- TerminalWelcome split pane fix — verify in browser

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Views routing layer | Built — ViewRouter + 14 view wrappers |
| Workspace rail | Refactored in worktree — tabs, layout, and pane surfaces split under `workspace/core/` |
| Grid Canvas | Built, 6 interactive space blocks + 10 metric/placeholder blocks |
| Workspace Sidebar | Built — client cards, sparklines, health rings, search |
| EditorSidebar | Built — document-context sidebar with workstation switcher, project list, archive |
| Forge Paper | Active, shared heading outline under review |
| Home Dashboard | Moved to `components/home/` — app-level surface |
| Editor Core | Refactored — `editor/core/` with 8 hooks, 7 components, block registry |
| Settings surface | Deleted, ready for rebuild |
| TerminalWelcome | Onboarding/empty state only (no-workstation fallback) |
| Quality gates | Active — lint (strict), typecheck, CI on PRs |

## Recent Completed Work

- **Workspace core restructure** — in worktree `codex-workspace-core-restructure`, extracted `WorkspaceTabs`, `PaneLayout`, `Pane`, and 7 pane surface modules; retired `SplitPanes.module.css`, kept `SplitPanes.tsx` as a compatibility shim, added missing manifests for workspace subfolders, and fixed the old `ClientHub.tsx` lint blockers so `dashboard` lint passes cleanly in the branch
- **Super-brain follow-ups** — repaired `workstation/MANIFEST.md` (removed stale `dashboard/` entry), moved `splitProjectName`/`splitClientName` lookups upstream as memoized values, extracted hydration effect to `useHydrateAppState`, moved resize handler into `useShellLayout`, extracted 3 modal mounts to `ShellModals.tsx`. `page.tsx`: 509 → 378 lines.
- **Shared terminal session** — workspace split panes now mount the real terminal, share command/NL history with the editor split pane, keep ambient suggestions workstation-only, and the worktree branch `codex-shared-terminal` is already contained by `main`
- **Split-pane architecture spec** — tmux-derived conductor design doc added at `conductor/FELMARK_SPLIT_PANE_ARCHITECTURE.md`
- **Sidebar workstation-context repair** — active documents now restore their owning workstation context instead of rendering under a fake fallback Personal header
- **Personal tab ghost bug fix** — worktree patch removes stale personal fallback creation, lets empty workstations be selected, and filters orphan tabs on hydration
- **Quality gates** — `npm run lint` (strict), `npm run typecheck`, `npm run check`, CI workflow
- **Lint baseline cleanup** — 99 problems → 0 across ~45 files
- **Read Before You Write rule** — added to CLAUDE.md and AGENTS.md
- **Editor core refactor** — 1,779-line monolith → modular core/
- **Home surface decision** — DashboardHome moved from workstation/ to components/home/
- **Workstation super-brain refresh** — benchmarked the live Workstation shell against Dub, Formbricks, Novel, Vercel Platforms, and Papermark; current guidance is to thin `dashboard/src/app/page.tsx`, reduce prop threading, and fix manifest drift without forcing a rewrite

## Pending Manual Actions

- Browser-verify workspace refactor branch `codex-workspace-core-restructure` before merge
- Browser-verify shared terminal behavior on `main`
- Run `/forge` to rebuild FORGE_MAP.md
- Rebuild Settings page as a view in `views/` + component in `workstation/settings/`
