# Session Handoff — 2026-04-03

## What happened
Debugged and fixed the workstation editor ghost-tab bug in a dedicated worktree, merged it onto `main`, then shipped a follow-up workstation-context repair for the remaining fake Personal sidebar state.

### Completed
1. **Ghost personal tab root cause isolated** — stale fallback creation in forge services plus unreconciled persisted tabs on hydration.
2. **Fallback repair** — tab/project/workstation services now resolve last-tab fallback only against real current projects, not a stale personal project.
3. **Empty workstation repair** — selecting a workstation with `0` projects now enters that workstation cleanly, and `New document` targets the selected workstation instead of defaulting elsewhere.
4. **Hydration cleanup** — saved tabs are now reconciled against the live workstation/project tree, which removes orphaned ghost tabs on load.
5. **Workstation-context repair** — active documents now restore their owning workstation context in workstation mode, and create/duplicate flows set that owner immediately.
6. **Verification** — targeted lint and `tsc --noEmit --incremental false` passed; production webpack builds passed in the worktree.

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
- The ghost-tab fix was committed in worktree branch `codex-personal-tab-bug` as `f86ae89` and merged onto `main`.
- The workstation-context follow-up was committed as `7c640a7` and merged onto `main`.
- Worktree lint/typecheck ran with a symlinked `dashboard/node_modules`.
- Turbopack build verification still panics on symlinked `node_modules` in a worktree. In the worktree, `./node_modules/.bin/next build --webpack` was the reliable production-build check.
- On `main`, targeted lint and typecheck passed after merge. A direct `npm run build` retry hit an existing Next build lock (`dashboard/.next/lock`) because another build process is already running or did not exit cleanly.
