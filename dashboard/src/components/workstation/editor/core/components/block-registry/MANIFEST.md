# block-registry/

## What
Centralized block component imports, default data for slash-menu insertion, and content block render map.

## Exports
- `CONTENT_DEFAULTS` -- default data for each content block type
- `getDefaultDataForType(type)` -- lookup helper
- `getContentBlockMap(setBlocks)` -- render function map for content blocks

## Dependencies
- `@/lib/types` (Block)
- `../../../blocks/*` (all block components and default data factories)

## Imported By
- `../../hooks/useSlashMenu.ts` (CONTENT_DEFAULTS)
- `../block-renderer/BlockRenderer.tsx` (getContentBlockMap)

## Files
- `blockDefaults.ts` -- CONTENT_DEFAULTS record and getDefaultDataForType
- `blockRegistry.ts` -- getContentBlockMap factory

## Rules
- When adding a new block type, add its default data to blockDefaults.ts AND its render entry to blockRegistry.ts.
