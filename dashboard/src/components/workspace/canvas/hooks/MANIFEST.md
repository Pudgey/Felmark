# Canvas Hooks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `useDragPlace` -- Library drag-to-place hook (dragging, ghostPos, previewLayout, startDragWithListeners)
- `useDragMove` -- Block drag-to-move hook (placeholder for future implementation)
- `useDragResize` -- Splitter resize hook (placeholder for future implementation)

## Dependencies
- `../types` -- CanvasBlock, CanvasRow, LayoutBlock, GhostPosition, CellPosition
- `../layout` -- layoutRows
- `../registry` -- BLOCK_DEFS, COLS, CELL, GAP, MAX_PER_ROW, findTargetRow

## Imported By
- `../Canvas.tsx` -- all three hooks used in main Canvas component

## Files
- `useDragPlace.ts` -- Library drag-to-place with global window listeners, ghost positioning, preview layout
- `useDragMove.ts` -- Block drag-to-move (placeholder)
- `useDragResize.ts` -- Splitter resize (placeholder)
