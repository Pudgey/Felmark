# workspace-page/

Workspace — task/project management surface. ClickUp-style: tasks, subtasks, statuses, priorities, time tracking, list/board/timeline views. For freelancers who need to get stuff done.

## Exports

| Export | File | Description |
|--------|------|-------------|
| `WorkspacePage` (default) | `WorkspacePage.tsx` | Full workspace surface with sidebar, task list, board, detail panel |

## Dependencies

| Dependency | Source |
|------------|--------|
| (self-contained) | Uses local seed data — no external deps yet |

## Imported By

| Importer | What |
|----------|------|
| `editor/Editor.tsx` | `WorkspacePage` — rendered when `railActive === "workspace"` |

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `WorkspacePage.tsx` | ~340 | Full workspace: sidebar, project header, toolbar, list/board views, detail panel |
| `WorkspacePage.module.css` | ~220 | All workspace styles — sidebar, tasks, board, detail panel |
