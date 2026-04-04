# workspace/core/ -- MANIFEST

## Exports
- `tabs/WorkspaceTabs` -- workspace chrome tabs and prompt row
- `layout/PaneLayout` -- workspace split-pane layout shell
- `surfaces/*Pane` -- individual workspace pane bodies and registry

## Dependencies
- `@/views/routers/WorkspaceRouter` -- workspace navigation context
- `@/components/terminal/mounts/WorkspaceTerminalMount` -- shared terminal mount used by the terminal pane

## Imported By
- `views/routers/WorkspaceRouter.tsx` -- renders workspace chrome and pane layout
- `workspace/panes/SplitPanes.tsx` -- compatibility wrapper for the old path

## Files
- `tabs/` -- workspace tab strip and prompt UI
- `layout/` -- pane state machine and pane chrome
- `surfaces/` -- pane registry plus surface-specific components
- `MANIFEST.md` -- this file
