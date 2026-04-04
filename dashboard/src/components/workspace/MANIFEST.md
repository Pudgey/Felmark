# workspace/

> **V1 deleted. V2 redesign in progress. Current workspace rail renders WorkspaceSidebar + SplitPanes.**

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
| `views/routers/WorkspaceRouter.tsx` | `WorkspaceSidebar`, `SplitPanes` — rendered when `railActive === "workspace"` |
