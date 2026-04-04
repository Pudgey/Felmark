# workspace/core/tabs/ -- MANIFEST

## Exports
- `WorkspaceTabs` -- workspace chrome tabs and prompt bar

## Dependencies
- `@/views/routers/WorkspaceRouter` -- workspace navigation context (uses `openCommand` to open command palette)

## Imported By
- `views/routers/WorkspaceRouter.tsx` -- renders the workspace chrome above the content area

## Files
- `WorkspaceTabs.tsx` -- workspace tab strip and prompt row; clicking `.promptInput` calls `nav.openCommand()`
- `WorkspaceTabs.module.css` -- tab chrome styles
- `MANIFEST.md` -- this file
