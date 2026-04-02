# Active Context — 2026-04-01

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a workstation shell, a standalone Workstation v4 surface, a Forge Paper rail surface, a Grid Canvas homepage with 6 interactive space blocks, a workspace sidebar with client navigation, and a views routing layer.

## Current Focus

- TerminalWelcome split pane fix — verify in browser
- FORGE_MAP.md rebuild (stale since restructure)
- ~~Editor.tsx at ~1,750 lines — next refactor target~~ **DONE** — decomposed into `core/`
- Settings page rebuild (component deleted, clean slate)
- Orphaned `views/terminal-welcome.tsx` — delete

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Views routing layer | Built — ViewRouter + 14 view wrappers |
| Grid Canvas | Built, 6 interactive space blocks + 10 metric/placeholder blocks |
| Workspace Sidebar | Built — client cards, sparklines, health rings, search |
| Forge Paper | Active, shared heading outline under review |
| Settings surface | Deleted, ready for rebuild |
| TerminalWelcome | Polished — full width, crisper animations, tab bar integration |

## Recent Completed Work

- **Editor core refactor** — 1,779-line Editor.tsx decomposed into `editor/core/` with 8 hooks, 7 components, block registry, 13 MANIFESTs. EditorCore.tsx is 494 lines. Editor.tsx is now a 2-line re-export.
- Workspace sidebar: faithful prototype port with all visual elements
- 6 space blocks: Pipeline, Calendar, Automation, Chat, Files, RevenueChart
- BlockContent.tsx refactored to registry map dispatcher pattern
- TerminalWelcome: removed streak, full width, crisper animations
- Tab bar now stays visible when TerminalWelcome is active
- Split pane restructured to render alongside TerminalWelcome

## Pending Manual Actions

- Verify TerminalWelcome split pane fix in browser
- Run `/forge` to rebuild FORGE_MAP.md
- Delete orphaned `views/terminal-welcome.tsx`
- Rebuild Settings page as a view in `views/` + component in `workstation/settings/`
