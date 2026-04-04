# Active Context — 2026-04-04

## Product Snapshot

Felmark is in active local development in `dashboard/`. The workspace pane system is fully restructured under `workspace/core/`, the workstation has a new Single Image block, canvas autodraw is live, and the workspace now has a functional Cmd+K command palette and sidebar search filter. A dashboard home redesign spec is written and waiting for a UI/UX agent pass before build.

## Current Focus

- Browser-verify workspace pane polish + command palette on `main`
- Browser-verify canvas autodraw, text entry, undo/redo, duplicate, and reload on `main`
- Browser-verify workstation Single Image block on `main`
- Dashboard home redesign — pending UI/UX agent spec review (`conductor/DASHBOARD_HOME_SPEC.md`)
- Rebuild `components/settings/` surface
- Decide whether to keep or remove the local untracked `dashboard/.husky/` scaffold

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not built |
| Views routing layer | Built and in use |
| Workspace rail | Modular under `workspace/core/` |
| Workspace pane chrome | Polished — light header, no focus seam |
| Workspace pane surfaces | 8 surfaces live (money, work, signals, pipeline, clients, time, terminal, calendar) |
| Workspace command palette | Live — Cmd+K, 4 command groups, keyboard nav, sidebar search wired |
| Canvas block | AI autodraw live; id stability fixed |
| Editor image block | On `main` — upload, URL, caption, alt, fit toggle, Single Image in slash menu |
| Home dashboard | Active — redesign spec written, not built |
| Settings surface | Empty directory — pending rebuild |
| Quality gates | `dashboard` lint green on `main` |
| FORGE_MAP | Rebuilt 2026-04-04 — current |

## Recent Completed Work

- **Workspace command palette** — Cmd+K palette with 4 groups, sidebar search filter wired, `WorkspaceNavContext` extended
- **FORGE_MAP rebuild** — full live disk scan; workspace canvas grid confirmed gone, Paper.tsx rename confirmed, 4 drift items flagged
- **Dashboard home spec** — PowerShell × Star Trek × Neovim direction; code analysis of what makes workstation/workspace powertools; written to `conductor/DASHBOARD_HOME_SPEC.md`
- **Editor image block** — Single Image block merged on `main`
- **Workspace core restructure** — pane system under `workspace/core/`
- **Canvas autodraw** — `/api/canvas`, `useAutodraw`, inline prompt flow

## Pending Manual Actions

- Browser-check workspace command palette (Cmd+K + sidebar search)
- Browser-check canvas autodraw, text entry, undo/redo, reload
- Browser-check Single Image block in workstation editor
- UI/UX agent review of `conductor/DASHBOARD_HOME_SPEC.md` before build
- Rebuild `components/settings/`
- Investigate `workspace/panes/SplitPanes.tsx` and `workspace/Workspace.tsx` — may be dead code
