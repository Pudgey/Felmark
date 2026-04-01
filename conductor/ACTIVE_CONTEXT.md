# Active Context — 2026-04-01

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The product now has a renamed workstation shell, a standalone Workstation v4 surface, a dedicated Forge Paper rail surface, and a large Settings page that is built but still blocked by a rail transition bug.

## Current Focus

- Stabilize full-page rail routing, especially the Settings gear path
- Harden Forge Paper as a client-facing document surface
- Decide whether Forge Paper keeps a dedicated outline or hides outline when structure is too loose
- Continue dashboard shell polish around workstation navigation and surface transitions

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Shared Forge block model | Reused across Editor and Forge Paper |
| Forge Paper outline | Under review — shared heading outline is likely the wrong abstraction |
| Settings surface | Built, but rail transition is still unresolved |

## Recent Completed Work

- Workstation v4 built as a full standalone surface with right-panel tools, timer, chat, invoice, and command bar
- Workspace terminology largely replaced with workstation terminology across product code and UI
- Forge Paper promoted to its own rail surface with independent document state
- Forge Paper text/slash handling hardened and AI slash-block support added
- Settings page built with nine sections and live theme switching
- The unresolved settings bug is now isolated to rail/editor view priority, not missing UI

## Pending Manual Actions

- Fix the rail gear path so Settings wins over editor/workstation fallback views
- Decide on a dedicated Forge Paper outline versus hiding the outline when the paper has no meaningful section structure
- Run browser QA on rail transitions and Forge Paper live editing after the settings routing fix
