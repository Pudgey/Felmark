# Session Handoff — 2026-04-02

## What happened
Editor core refactor, home surface architecture decision, workspace toolbar cleanup, deep-debug skill added.

### Completed
1. **Editor core refactor** — 1,779-line Editor.tsx → `editor/core/` with 8 hooks, 7 components, block registry, 13 MANIFESTs. EditorCore.tsx is 494 lines. Editor.tsx is a 2-line re-export.
2. **DashboardHome moved** — from `workstation/dashboard/` to `components/home/`. It's the app-level home (logo click), not a workstation feature.
3. **Workspace toolbar** — removed "Felmark [WORKSPACE]" logo+badge, replaced with clean "Workspace" title.
4. **Deep-debug skill** — full protocol added to `.claude/skills/deep-debug/` and `conductor/skills/deep-debug/`.
5. **Cleanup** — deleted orphaned `views/terminal-welcome.tsx`, unused `TerminalWelcome.module.css`.

## Architecture decisions locked
- **Home is its own surface** at `components/home/`, not owned by workstation or workspace
- **Workspace home and Logo home are separate** — similar now, will diverge as features grow
- **TerminalWelcome** stays in `workstation/terminal-welcome/` as the no-workstation onboarding state

## Remaining work
- **EditorCore.tsx at 494 lines** — higher than the 200-line target. The composition overhead is real but could be reduced by extracting handleCommandSelect and notification demo data.
- **FORGE_MAP.md still stale** — needs `/forge` rebuild (reports 174 files vs 323 actual).
- **Editor.module.css still exists** — was kept alongside new component CSS modules. May have unused classes now. Verify and delete if fully replaced.
- **Settings page rebuild** — component deleted, clean slate.
- **Verify TerminalWelcome split pane fix in browser** — still pending from prior session.

## Gotchas
- The stash pop during merge left Editor.tsx with the old 1,779 lines until manually fixed to the 2-line re-export. The worktree merge was clean but stash restore conflicted.
- codex-main has been actively modifying workspace canvas files (block chrome, insertions, drag) — those changes are in the working tree but not part of this session's commits.
- `onNewWorkstation` prop on TerminalWelcome inside EditorCore is still a no-op.
