# Canvas Hooks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `useDragPlace` -- Library drag-to-place hook (dragging, ghostPos, previewLayout, startDragWithListeners)
- `useDragMove` -- Block drag-to-move hook (movingBlock, moveTarget, previewLayout, previewSlot, moveCursor, moveOffset, startMove)
- `useDragResize` -- Splitter resize hook (resizing, startResize)
- `useCanvasGrid` -- Canvas-to-grid coordinate conversion (canvasToGrid)
- `useCanvasLabels` -- Derived layout dimensions, boolean flags, and label strings
- `useCanvasFooter` -- Footer status string derivation

## Dependencies
- `../types` -- CanvasBlock, CanvasRow, LayoutBlock, GhostPosition, CellPosition
- `../layout` -- layoutRows
- `../registry` -- BLOCK_DEFS, COLS, CELL, GAP, MAX_PER_ROW, ROW_STEP, findTargetRow, spanHeightPx

## Imported By
- `../Canvas.tsx` -- all six hooks used in main Canvas component

## Files
- `useDragPlace.ts` -- Library drag-to-place with global window listeners, ghost positioning, preview layout
- `useDragMove.ts` -- Block drag-to-move with preview slots, cursor tracking, row/column targets
- `useDragResize.ts` -- Splitter resize between adjacent blocks
- `useCanvasGrid.ts` -- Converts client mouse coordinates to grid cell positions
- `useCanvasLabels.ts` -- Computes maxRow, contentHeight, dotRows, gridMinHeight, block flags, and label strings
- `useCanvasFooter.ts` -- Computes the footer status string based on editing/drag/library state
