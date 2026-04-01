# timer/

Floating timer bar for time tracking in Workspace.

## Exports

| Export | File | Description |
|--------|------|-------------|
| `FloatingTimer` (default) | `FloatingTimer.tsx` | Timer bar with start/pause/stop/log/minimize states |

## Dependencies

| Dependency | Source |
|------------|--------|
| (self-contained) | No external deps |

## Imported By

| Importer | What |
|----------|------|
| `workspace-page/WorkspacePage.tsx` | Rendered above footer, receives selected task + onLog callback |

## Files

| File | Lines | Purpose |
|------|-------|---------|
| `FloatingTimer.tsx` | ~120 | Timer logic, state machine (idle/running/paused), minimize pill |
| `FloatingTimer.module.css` | ~55 | Bar styles, pulse animation, minimize pill, control buttons |
