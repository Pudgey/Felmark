# workspace/

> **V1 archived to `workspace-v1/`. V2 redesign pending. Current workspace rail redirects to home.**

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
| `views/workspace.tsx` | `WorkspacePage` — rendered via ViewRouter when `railActive === "workspace"` |

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `Workspace.tsx` | ~546 | Full workspace: sidebar, project header, toolbar, list/board views, detail panel |
| `Workspace.module.css` | ~242 | All workspace styles — sidebar, tasks, board, detail panel |
| `timer/FloatingTimer.tsx` | — | Floating timer widget |
| `timer/FloatingTimer.module.css` | — | Timer styles |
