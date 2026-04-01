# block-renderer/

## What
Renders each block with gutter buttons, type-specific content, comment buttons, and drag handlers.

## Exports
- `BlockRenderer` (default)

## Dependencies
- `@/lib/types`, `@/lib/utils`
- `../../../blocks/*` (GraphBlock, MoneyBlock, DeliverableBlock, DeadlineBlock, AudioBlock, AiBlock, CanvasBlock)
- `../../../chrome/editable-block/EditableBlock`
- `../block-registry/blockRegistry` (getContentBlockMap)
- `../../../../../activity/ActivityMargin` (BlockActivity type)

## Imported By
- `../document-surface/DocumentSurface.tsx`

## Files
- `BlockRenderer.tsx`
- `BlockRenderer.module.css`
