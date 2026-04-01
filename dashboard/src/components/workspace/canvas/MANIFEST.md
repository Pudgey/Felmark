# Canvas -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `Canvas` (default) -- Grid dashboard canvas with drag-to-place blocks, edit mode, library panel, click-to-replace popover, row insertion bars

## Dependencies
- `./types` -- CanvasBlock, CanvasRow, BlockTypeDef, LayoutBlock, GhostPosition, CellPosition
- `./layout` -- layoutRows, distributeWidth (row-based layout engine)

## Imported By
- `Workspace.tsx` -- rendered as workspace canvas view (pending integration)

## Files
- `Canvas.tsx` (797 lines) -- main component: toolbar, grid, blocks, library, footer, replace popover, insertion zones
- `Canvas.module.css` (989 lines) -- all visual styles including replace popover and insertion bar styles
- `types.ts` -- TypeScript interfaces for row-based canvas model (CanvasBlock, CanvasRow, LayoutBlock)
- `layout.ts` -- row-based layout engine: distributeWidth + layoutRows (replaces collision/autoFill)
