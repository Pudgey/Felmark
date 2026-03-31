# CanvasBlock -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `CanvasBlock` -- Freeform drawing/diagramming canvas with shapes, stencils, and connections
- `getDefaultCanvasData` -- factory for default canvas data

## Dependencies
- `@/lib/types` -- CanvasBlockData, CanvasElement
- `./stencils` -- StencilDef, STENCIL_CATEGORIES, STENCILS
- `./StencilPicker` -- stencil selection UI

## Imported By
- `Editor.tsx` -- rendered for canvas block type

## Files
- `CanvasBlock.tsx` -- main component (602 lines)
- `CanvasBlock.module.css` -- canvas styles
- `StencilPicker.tsx` -- stencil browser/selector (140 lines)
- `StencilPicker.module.css` -- stencil picker styles
- `stencils.ts` -- stencil definitions and categories
