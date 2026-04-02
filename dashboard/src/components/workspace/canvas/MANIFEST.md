# Canvas -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `Canvas` (default) -- Grid dashboard canvas with drag-to-place blocks, edit mode, library panel, click-to-replace popover, row/column insertion bars

## Dependencies
- `./types` -- CanvasBlock, CanvasRow, BlockTypeDef, LayoutBlock, GhostPosition, CellPosition, RenderBlock, TargetRowResult
- `./layout` -- layoutRows, distributeWidth (row-based layout engine)
- `./registry` -- BLOCK_DEFS, CELL, COLS, GAP, GRID_W, MAX_PER_ROW, INITIAL_BLOCK_MAP, INITIAL_ROWS, findTargetRow, canFitInRow, blockRect
- `./hooks/useDragPlace` -- Library drag-to-place hook
- `./hooks/useDragMove` -- Block drag-to-move hook (placeholder)
- `./hooks/useDragResize` -- Splitter resize hook (placeholder)
- `./toolbar/Toolbar` -- Top bar component
- `./chrome/BlockChrome` -- Per-block chrome bar
- `./chrome/ReplacePopover` -- Block type picker popover
- `./blocks/BlockContent` -- Block content dispatcher
- `./library/Library` -- Block type library panel
- `./insertions/RowInsertionBar` -- Horizontal row insertion
- `./insertions/ColInsertionBar` -- Vertical column insertion
- `./insertions/EmptyRow` -- Empty row placeholder

## Imported By
- `Workspace.tsx` -- rendered as workspace canvas view (pending integration)

## Files
- `Canvas.tsx` (~280 lines) -- Grid engine + state + composition
- `Canvas.module.css` (~280 lines) -- Grid, dots, ghost, block shell, footer, drag preview, placing bar
- `types.ts` -- TypeScript interfaces (CanvasBlock, CanvasRow, LayoutBlock, RenderBlock, TargetRowResult, etc.)
- `layout.ts` -- Row-based layout engine: distributeWidth + layoutRows
- `registry.ts` -- Constants, BLOCK_DEFS, initial data, helper functions

## Subdirectories
- `hooks/` -- useDragPlace, useDragMove, useDragResize
- `chrome/` -- BlockChrome, ReplacePopover, Splitter
- `blocks/` -- BlockContent, MetricBlock, WhisperBlock, PlaceholderBlock
- `toolbar/` -- Toolbar
- `insertions/` -- RowInsertionBar, ColInsertionBar, EmptyRow
- `library/` -- Library panel

## Size Contracts
- `Micro blocks` live in the `1x1` to `2x2` band. Preferred target is `2x2`, but the concept must still read cleanly at `1x1`.
- `Premium blocks` start at `4x4`. Preferred target is `4x5` or `5x4` so the design has room for hierarchy, atmosphere, and an action layer.
- Anything that needs more than `2x2` is not a micro block.
- Anything that cannot stay coherent at `4x4` is not a premium block.
- Anything that needs more than the full `8` columns should stop being a block and become a full workspace surface.
