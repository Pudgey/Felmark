# Session Handoff — 2026-04-02

## What happened
Added quality gate infrastructure and cleaned the entire lint baseline to zero.

### Completed
1. **Quality gate scripts** — `npm run lint` (strict, `--max-warnings=0`), `npm run typecheck` (`tsc --noEmit`), `npm run check` (lint + typecheck + build).
2. **CI workflow** — `.github/workflows/dashboard-quality.yml` runs all gates on PRs touching `dashboard/`.
3. **Lint baseline cleanup** — 99 problems → 0 across ~45 files (unused vars, `any` types, setState-in-effect, exhaustive-deps, unescaped entities, immutability violations, TS errors).
4. **New ground rule** — "Read Before You Write" added to CLAUDE.md and AGENTS.md. Agents must read files before modifying and never overwrite functionality they didn't add.

## In-progress work
None.

## Remaining work
- [ ] Extract dashboard shell state and persistence from `page.tsx`
- [ ] Split `Canvas.tsx` into storage, derived state, and render pieces
- [ ] Replace `any`-based graph handling in `GraphDataEditor.tsx` / `GraphBlock.tsx`
- [ ] Rebuild `FORGE_MAP.md` (stale — reports 174 files vs ~325 actual)
- [ ] Rebuild Settings page
- [ ] Verify TerminalWelcome split pane in browser
- [ ] Start splitting `types.ts` by block family once graph work lands

## Gotchas
- **Lint worktree merge damaged EditorSidebar props.** The lint agent removed props (`tabs`, `blocksMap`, `onTabClick`) it thought were unused, but these were from new in-progress work. The user manually restored the correct EditorSidebar interface with new props (`onSelectWorkstation`, `onDuplicateProject`, `onArchiveProject`, `archived`, `onRestoreProject`). The old `onSelectWorkstationHome` prop was renamed to `onSelectWorkstation`.
- `types.ts` is still 735 lines / 89 exports — next type hub to watch.
- `npm run lint` in `dashboard/` now passes clean. Any new warning breaks the build. Do not add eslint-disable comments without a concrete reason.
- EditorSidebar.tsx and page.tsx were updated by the user after the merge — those are the source of truth, not the worktree branch versions.
