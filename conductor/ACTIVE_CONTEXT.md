# Active Context — 2026-04-02

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a workstation shell with modular editor core, a standalone workspace surface, a Forge Paper rail surface, a Grid Canvas homepage with 6 interactive space blocks, a workspace sidebar with client navigation, a views routing layer, and a dedicated app-level home dashboard.

## Current Focus

- FORGE_MAP.md rebuild (stale — reports 174 files vs 323 actual)
- EditorCore.tsx at 494 lines — could extract handleCommandSelect + demo data to reduce further
- Editor.module.css — verify fully replaced by component CSS modules, delete if so
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
| Forge Paper | Active, shared heading outline under review |
| Home Dashboard | Moved to `components/home/` — app-level surface |
| Editor Core | Refactored — `editor/core/` with 8 hooks, 7 components, block registry |
| Settings surface | Deleted, ready for rebuild |
| TerminalWelcome | Onboarding/empty state only (no-workstation fallback) |

## Recent Completed Work

- **Editor core refactor** — 1,779-line monolith → modular core/ (8 hooks, 7 components, 13 MANIFESTs)
- **Home surface decision** — DashboardHome moved from workstation/ to components/home/
- **Workspace toolbar** — removed redundant Felmark branding, clean "Workspace" title
- **Deep-debug skill** — full root-cause analysis protocol added
- **Redesign skill** — prototype-first redesign planning protocol added to force spec + plan before structural UI implementation
- **Cleanup** — deleted orphaned views/terminal-welcome.tsx, unused TerminalWelcome.module.css

## Pending Manual Actions

- Run `/forge` to rebuild FORGE_MAP.md
- Verify Editor.module.css can be deleted (check for remaining references)
- Rebuild Settings page as a view in `views/` + component in `workstation/settings/`
