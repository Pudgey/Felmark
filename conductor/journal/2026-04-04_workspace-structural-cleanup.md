# Journal: Workspace Structural Cleanup

**Date**: 2026-04-04
**Agent**: claude-main
**Tags**: refactor, architecture, workspace, cleanup

## Context

Offboarded pipeline, finance, search, calendar, forge-paper (now Paper), and team from the workstation component tree into their correct permanent homes in the workspace and app-layer component hierarchy.

## Discovery

The `workstation/` folder had become a catch-all. Features like pipeline, finance, search, calendar, and team have no business being scoped under the editor/workstation surface — they belong either in `workspace/` (client-scoped tools) or at the top-level `components/` (cross-cutting, rail-accessible). Letting them sit in `workstation/` was debt that would silently corrupt future navigation and import decisions.

ForgePaper's name embedded an internal code term ("Forge") that leaked into user-facing component naming. The `Paper` rename is cleaner and reduces confusion for future developers.

Deleting dead view wrappers (`views/pipeline.tsx`, `views/finance.tsx`) removed two stale routing paths that no longer reflected where those features actually lived.

## What Worked

- Moving in discrete, bounded steps (one feature at a time) rather than doing a single broad rename sweep made it easy to verify each move independently.
- Using the approved `workspace/MANIFEST.md` target structure as the spec ensured moves landed in the right final location, not a temporary holding spot.
- Updating the `views/forge.tsx` and `views/team.tsx` imports immediately after each move kept the build coherent between steps.

## What Didn't Work

- `SplitPanes.tsx` (921 lines) and `SplitPanes.module.css` (1,292 lines) were left untouched — the workspace core extraction (HybridHeader → `core/tabs/`, pane layout → `core/layout/`, 7 surfaces → `core/surfaces/`) is approved but not yet executed. The files remain oversized hotspots.
- Calendar-in-workspace integration was not started. The agreed approach (new `"calendar"` view in `WorkspaceRouter` + thin `WorkspaceCalendarView` wrapper) is queued but unbuilt.

## Future Guidance

- **Next task is workspace core extraction.** Split `SplitPanes.tsx` into `core/tabs/WorkspaceTabs.tsx`, `core/layout/PaneLayout.tsx`, `core/layout/Pane.tsx`, and `core/surfaces/*Pane.tsx`. The `workspace/MANIFEST.md` already reflects the target state — use it as the spec.
- **After core extraction**, add calendar as a workspace-level view in `WorkspaceRouter` (`"calendar"` route, thin `WorkspaceCalendarView` wrapper). Keep it scoped to the active client.
- **FORGE_MAP is stale.** Multiple files moved and two view wrappers were deleted this session. Run `/forge` before any dependency-sensitive work.
- **Missing MANIFESTs** to create during the core extraction pass: `workspace/hub/`, `workspace/newtab/`, `workspace/products/`, `workspace/toasts/`, `workspace/panes/`.
- `Paper` is now the canonical name everywhere — if any import or reference to `ForgePaper` surfaces, it is stale and should be updated.
