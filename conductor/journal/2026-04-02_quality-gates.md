# Journal — Quality Gates & Lint Baseline Cleanup

**Date**: 2026-04-02
**Agent**: claude-main
**Tags**: `tooling`, `lint`, `ci`, `cleanup`

## What happened

Added three quality gate scripts to `dashboard/package.json`:
- `lint` — strict mode (`--max-warnings=0`)
- `typecheck` — `tsc --noEmit`
- `check` — lint + typecheck + build combined

Created `.github/workflows/dashboard-quality.yml` — runs all three gates on every PR touching `dashboard/`.

Cleaned up the entire 99-problem lint baseline (40 errors, 59 warnings) + 1 TypeScript error across ~45 files in a worktree agent. Fixes included:
- 48 unused vars (removed or prefixed with `_`)
- 18 `any` types replaced with proper types
- 10 setState-in-effect restructured (lazy initializers, requestAnimationFrame deferrals)
- 6 unescaped entities
- 6 exhaustive-deps fixes
- 3 immutability violations
- 3 img element warnings
- 2 access-before-declared reorders
- 2 unused expressions
- 1 React Compiler memoization fix
- 1 TS type error (Canvas.tsx timer ref)

## Gotchas

- The worktree branch was based before recent EditorSidebar changes landed on main. Merge conflicts in page.tsx, Sidebar.tsx, and EditorCore.tsx required manual resolution. The worktree agent incorrectly renamed `onSelectWorkstation` → `onSelectWorkstationHome` in some files, which had to be corrected during merge.
- The user had to manually fix EditorSidebar props after the merge because the lint agent removed props it thought were unused, but which were part of new in-progress feature work.

## Lesson

When a lint cleanup worktree touches many files, it will inevitably conflict with concurrent feature work. The merge resolution must check every conflict against the *latest* main branch behavior, not just pick one side. Props that appear unused to lint may be newly added and not yet wired.

## Decision

Lint baseline is now zero. All future PRs are gated by CI. New rule added to CLAUDE.md: "Read Before You Write" — agents must read files before modifying them and must never overwrite functionality they didn't add.
