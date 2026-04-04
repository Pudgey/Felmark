# workspace/core/layout/ -- MANIFEST

## Exports
- `PaneLayout` -- workspace split-pane layout shell
- `Pane` -- pane chrome, menus, and body shell

## Dependencies
- `../surfaces/registry` -- surface metadata and component registry
- `@/views/routers/WorkspaceRouter` -- workspace navigation context inside pane actions

## Imported By
- `views/routers/WorkspaceRouter.tsx` -- renders the live workspace pane layout
- `workspace/panes/SplitPanes.tsx` -- compatibility wrapper for the old path

## Files
- `PaneLayout.tsx` -- pane state machine, split layout, presets, and zoom handling
- `PaneLayout.module.css` -- outer workspace pane layout and status bar styles
- `Pane.tsx` -- pane header chrome, menus, and empty state shell
- `Pane.module.css` -- pane chrome styles
- `MANIFEST.md` -- this file
