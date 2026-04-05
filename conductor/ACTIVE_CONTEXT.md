# Active Context — 2026-04-05

## Product Snapshot

Felmark is in active local development in `dashboard/`. The workspace theme color refactor is complete — all 15 workspace CSS modules now use theme-aware CSS variables. A cloud rail icon is wired (routes to home). The workspace pane system, command palette, canvas autodraw, and Single Image block are all on `main` awaiting browser verification.

## Current Focus

- Browser-verify workspace theme switching (Ember → Midnight → Ink → Obsidian)
- Browser-verify workspace pane polish + command palette on `main`
- Browser-verify canvas autodraw, text entry, undo/redo, duplicate, and reload on `main`
- Browser-verify workstation Single Image block on `main`
- Build cloud storage surface (Supabase Storage) behind cloud rail icon
- Dashboard home redesign — pending UI/UX agent spec review (`conductor/DASHBOARD_HOME_SPEC.md`)
- Rebuild `components/settings/` surface

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not built |
| Views routing layer | Built and in use |
| Workspace rail | Modular under `workspace/core/` |
| Workspace theme colors | **Refactored** — 380+ hardcoded values replaced with CSS vars |
| Workspace pane chrome | Polished — light header, no focus seam |
| Workspace pane surfaces | 8 surfaces live |
| Workspace command palette | Live — Cmd+K, 4 command groups, keyboard nav |
| Canvas block | AI autodraw live; id stability fixed |
| Editor image block | On `main` — Single Image in slash menu |
| Cloud rail icon | Wired — routes to home, surface not built |
| Home dashboard | Active — redesign spec written, not built |
| Settings surface | Empty directory — pending rebuild |
| Theme system | 10 themes, 35 CSS variables (5 new workspace semantic tokens) |
| Quality gates | `dashboard` lint green on `main` |
| FORGE_MAP | Needs rebuild — terminal surface files added since last scan |

## Recent Completed Work

- **Workspace theme color refactor** — 380+ hardcoded colors → CSS variables across 15 CSS modules; 5 new semantic tokens in all 10 themes
- **Cloud rail icon** — Cloud storage icon on rail, routes to dashboard home
- **Workspace command palette** — Cmd+K palette with 4 groups, sidebar search filter
- **FORGE_MAP rebuild** — full live disk scan (2026-04-04)
- **Dashboard home spec** — PowerShell × Star Trek × Neovim direction
- **Editor image block** — Single Image block merged on `main`

## Pending Manual Actions

- Browser-check workspace theme switching (critical — verify the refactor works)
- Browser-check workspace command palette (Cmd+K + sidebar search)
- Browser-check canvas autodraw, text entry, undo/redo, reload
- Browser-check Single Image block in workstation editor
- UI/UX agent review of `conductor/DASHBOARD_HOME_SPEC.md` before build
- Rebuild `components/settings/`
- Investigate `workspace/panes/SplitPanes.tsx` and `workspace/Workspace.tsx` — may be dead code
- Run `/forge` to rebuild FORGE_MAP.md
