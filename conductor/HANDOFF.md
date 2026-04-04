# Session Handoff — 2026-04-03

## What happened
Executed the three "Fix now" items from the 2026-04-03 workstation super-brain refresh:
1. Repaired `workstation/MANIFEST.md` — removed stale `dashboard/` entry and two root-file rows for files that don't exist.
2. Moved `splitProjectName` / `splitClientName` lookups from `views/editor.tsx` IIFEs upstream to `page.tsx` as `useMemo` values.
3. Extracted shell composition from `page.tsx` (509 → 378 lines): hydration to `useHydrateAppState`, resize to `useShellLayout`, 3 floating modals to `ShellModals`.

Note: `CreationAnimation` and `WorkstationOnboarding` are content-area replacements (not floating overlays) and were NOT moved to `ShellModals` — they remain in `page.tsx` inside the layout ternary.

### Completed
1. `workstation/MANIFEST.md` — stale rows removed.
2. `views/editor.tsx` — IIFEs gone; `splitProjectName` / `splitClientName` now plain props.
3. `forge/hooks/useHydrateAppState.ts` — new hook, full hydration logic extracted.
4. `forge/hooks/useShellLayout.ts` — returns `onResizeHandleMouseDown`.
5. `app/ShellModals.tsx` — new component: Launchpad, SaveTemplateModal, TemplatePicker.
6. `forge/hooks/MANIFEST.md` — updated with new exports.

## In-progress work
None.

## Remaining work
- [ ] Browser-verify shared terminal behavior on `main`
- [ ] Split `Canvas.tsx` into storage, derived state, and render pieces
- [ ] Replace `any`-based graph handling in `GraphDataEditor.tsx` / `GraphBlock.tsx`
- [ ] Rebuild `FORGE_MAP.md` (stale — actual 405 files, map shows 335)
- [ ] Rebuild Settings page
- [ ] Verify TerminalWelcome split pane in browser
- [ ] Pre-existing lint errors in `ClientHub.tsx` and `SplitPanes.tsx` (from commit `b8d1e4d`) — not touched, still open

## Gotchas
- `page.tsx` is 378 lines — under the 500 yellow threshold but still broad. Next opportunity: extract shell state into a `useShellState` hook to get it under 300.
- `npm run typecheck` can fail in a fresh worktree before a build because `tsconfig.json` includes `.next/types/**/*.ts`; run `./node_modules/.bin/next build --webpack` first, then `./node_modules/.bin/tsc --noEmit --incremental false`.
- Worktree verification still relies on the symlinked `dashboard/node_modules` setup.
