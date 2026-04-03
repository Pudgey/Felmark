# Active Context — 2026-04-02

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a workstation shell with modular editor core, a standalone workspace surface, a Forge Paper rail surface, a Grid Canvas homepage with 6 interactive space blocks, a workspace sidebar with client navigation, an EditorSidebar for document-editing context, a views routing layer, and a dedicated app-level home dashboard.

## Current Focus

- Extract dashboard shell state and persistence from `dashboard/src/app/page.tsx`
- Split `dashboard/src/components/workspace/canvas/Canvas.tsx` into storage, state, and render pieces
- Harden graph block typing in `GraphDataEditor.tsx` / `GraphBlock.tsx`
- FORGE_MAP.md rebuild (stale — reports 174 files vs ~325 actual)
- Settings page rebuild (component deleted, clean slate)
- TerminalWelcome split pane fix — verify in browser

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Views routing layer | Built — ViewRouter + 14 view wrappers |
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

- **Quality gates** — `npm run lint` (strict), `npm run typecheck`, `npm run check`, CI workflow
- **Lint baseline cleanup** — 99 problems → 0 across ~45 files
- **Read Before You Write rule** — added to CLAUDE.md and AGENTS.md
- **Editor core refactor** — 1,779-line monolith → modular core/
- **Home surface decision** — DashboardHome moved from workstation/ to components/home/
- **Super-brain audit** — benchmarked against 5 open source exemplars

## Pending Manual Actions

- Run `/forge` to rebuild FORGE_MAP.md
- Rebuild Settings page as a view in `views/` + component in `workstation/settings/`
