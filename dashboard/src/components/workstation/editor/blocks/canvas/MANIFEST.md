# canvas/ -- Manifest

> Freeform drawing/diagramming canvas block with shapes, stencils, resize, and undo.

## Exports
- `CanvasBlock` (default) -- Main canvas component
- `getDefaultCanvasData` -- Factory for default canvas data

## Dependencies
- `@/lib/types` -- CanvasBlockData, CanvasElement
- `./stencils` -- StencilDef, STENCIL_CATEGORIES, STENCILS
- `./StencilPicker` -- Stencil selection UI
- `./geometry` -- Bounding box, hit testing, element movement
- `./sketchy` -- Deterministic hand-drawn SVG path generators
- `./rendering` -- SVG element + selection UI rendering
- `./resize` -- Handle positions, resize math, element remapping
- `./useCanvasUndo` -- Canvas-local undo/redo stack
- `./useAutodraw` -- AI diagram generation hook (calls /api/canvas)

## Imported By
- `editor/core/components/block-registry/blockRegistry.ts` -- content block map
- `editor/core/components/block-renderer/BlockRenderer.tsx` -- direct render for canvas blocks

## Files
- `CanvasBlock.tsx` -- Component shell: state, toolbar, pointer handlers, keyboard shortcuts (~330 lines)
- `CanvasBlock.module.css` -- Canvas styles (includes autodraw input + error styles)
- `geometry.ts` -- Box interface, getBBox, hitTest, rectsIntersect, moveElement, getSelectionBBox (~65 lines)
- `sketchy.ts` -- srand, sketchyRect/Ellipse/Diamond/Line, arrowHead, smoothPath (~55 lines)
- `rendering.tsx` -- renderEl, renderSelectionUI (~50 lines)
- `resize.ts` -- HandleId, handle positions/cursors, hitTestHandles, computeResizedBBox, remapElements (~70 lines)
- `useCanvasUndo.ts` -- useCanvasUndo hook with pushUndo/undo/redo (~40 lines)
- `useAutodraw.ts` -- AI diagram generation hook: calls /api/canvas, maps LLM elements to CanvasElement[] (~120 lines)
- `StencilPicker.tsx` -- Stencil browser/selector (~140 lines)
- `StencilPicker.module.css` -- Stencil picker styles
- `stencils.ts` -- Stencil definitions and categories
