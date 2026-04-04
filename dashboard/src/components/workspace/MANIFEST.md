# workspace/

> **V1 deleted. V2 redesign in progress. Current workspace rail renders WorkspaceTabs + WorkspaceSidebar + PaneLayout through `WorkspaceRouter`.**

Workspace — task/project management surface. ClickUp-style: tasks, subtasks, statuses, priorities, time tracking, list/board/timeline views. For freelancers who need to get stuff done.

## Exports

| Export | File | Description |
|--------|------|-------------|
| `Workspace` (default) | `Workspace.tsx` | Full workspace surface with sidebar, task list, board, detail panel |

## Dependencies

| Dependency | Source |
|------------|--------|
| (self-contained) | Uses local seed data — no external deps yet |

## Imported By

| Importer | What |
|----------|------|
| `views/routers/WorkspaceRouter.tsx` | `WorkspaceTabs`, `WorkspaceSidebar`, `PaneLayout`, `ClientHub`, `NewTab`, `PipelineBoard`, `FinancePage`, `ProductsTab`, `Toasts` |

## Tool Tabs (opened via WorkspaceRouter)

| Folder | Component | Description |
|--------|-----------|-------------|
| `pipeline/` | `PipelineBoard` | Kanban-style project pipeline board |
| `finance/` | `FinancePage` | Revenue tracking, invoicing, and financial overview |

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `core/tabs/WorkspaceTabs.tsx` | ~90 | Workspace chrome tabs and prompt bar |
| `core/layout/PaneLayout.tsx` | ~260 | Split-pane layout state machine, zoom, presets, and composition |
| `core/layout/Pane.tsx` | ~230 | Pane shell, menus, and empty state wrapper |
| `core/surfaces/` | — | Individual workspace pane bodies and surface registry |
| `sidebar/WorkspaceSidebar.tsx` | ~380 | Workspace client sidebar and context menus |
| `Workspace.tsx` | ~550 | Legacy standalone workspace surface, not the live router entrypoint |
