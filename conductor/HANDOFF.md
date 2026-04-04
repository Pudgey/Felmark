# Session Handoff — 2026-04-04

## What happened
Executed the workspace core restructure in worktree branch `codex-workspace-core-restructure`.

The live refactor split the old `workspace/panes/SplitPanes.tsx` monolith into:
1. `workspace/core/tabs/WorkspaceTabs.tsx`
2. `workspace/core/layout/PaneLayout.tsx`
3. `workspace/core/layout/Pane.tsx`
4. `workspace/core/surfaces/*Pane.tsx` + `registry.ts`

The branch also removed `SplitPanes.module.css`, left `SplitPanes.tsx` as a compatibility shim, added the missing workspace subfolder manifests, updated workspace metadata/manifests, and fixed the pre-existing `ClientHub.tsx` lint blockers so `dashboard` lint is green in the worktree.

### Completed
1. Extracted workspace chrome into `dashboard/src/components/workspace/core/tabs/WorkspaceTabs.tsx`
2. Extracted pane layout/state into `dashboard/src/components/workspace/core/layout/PaneLayout.tsx`
3. Extracted pane chrome into `dashboard/src/components/workspace/core/layout/Pane.tsx`
4. Extracted surface bodies into `dashboard/src/components/workspace/core/surfaces/`
5. Updated `WorkspaceRouter.tsx` to render `WorkspaceTabs + WorkspaceSidebar + PaneLayout`
6. Added missing MANIFESTs for `workspace/core/`, `workspace/core/layout/`, `workspace/panes/`, `workspace/hub/`, `workspace/newtab/`, `workspace/products/`, and `workspace/toasts/`
7. Fixed `ClientHub.tsx` so `npm run lint` passes in the workspace refactor branch

## In-progress work
- [ ] Browser verification and merge of `codex-workspace-core-restructure`

## Remaining work
- [ ] Browser-verify workspace core restructure on branch `codex-workspace-core-restructure`
- [ ] Browser-verify shared terminal behavior on `main`
- [ ] Split `Canvas.tsx` into storage, derived state, and render pieces
- [ ] Replace `any`-based graph handling in `GraphDataEditor.tsx` / `GraphBlock.tsx`
- [ ] Rebuild `FORGE_MAP.md` (stale — actual 405 files, map shows 335)
- [ ] Rebuild Settings page
- [ ] Verify TerminalWelcome split pane in browser

## Gotchas
- The live code uses a `TerminalPane`, not a `FinancePane`, inside the workspace split layout. The refactor followed the live code and did not invent a finance split surface.
- `SplitPanes.tsx` still exists as a compatibility shim; the real implementation now lives under `workspace/core/`.
- `page.tsx` is 378 lines — under the 500 yellow threshold but still broad. Next opportunity: extract shell state into a `useShellState` hook to get it under 300.
- `npm run typecheck` can fail in a fresh worktree before a build because `tsconfig.json` includes `.next/types/**/*.ts`; run `./node_modules/.bin/next build --webpack` first, then `./node_modules/.bin/tsc --noEmit --incremental false`.
- Worktree verification still relies on the symlinked `dashboard/node_modules` setup.
