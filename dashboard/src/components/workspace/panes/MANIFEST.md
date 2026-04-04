# workspace/panes/ -- MANIFEST

## Exports
- `SplitPanes` -- compatibility export that re-exports the live pane layout
- `HybridHeader` -- compatibility alias for `WorkspaceTabs`

## Dependencies
- `../core/layout/PaneLayout` -- live pane layout implementation
- `../core/tabs/WorkspaceTabs` -- live workspace chrome implementation

## Imported By
- No live imports remain; the folder exists as a compatibility shim while the workspace core path settles.

## Files
- `SplitPanes.tsx` -- compatibility re-export for the old pane entrypoint
- `MANIFEST.md` -- this file
