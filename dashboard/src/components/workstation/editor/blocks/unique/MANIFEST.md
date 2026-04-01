# Unique Blocks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `PricingConfigBlock` + `getDefaultPricingConfigData` -- pricing tier configuration
- `ScopeBoundaryBlock` + `getDefaultScopeBoundaryData` -- scope boundary definitions
- `AssetChecklistBlock` + `getDefaultAssetChecklistData` -- asset delivery checklist
- `DecisionPickerBlock` + `getDefaultDecisionPickerData` -- decision matrix picker
- `AvailabilityPickerBlock` + `getDefaultAvailabilityPickerData` -- availability scheduler
- `ProgressStreamBlock` + `getDefaultProgressStreamData` -- progress stream display
- `DependencyMapBlock` + `getDefaultDependencyMapData` -- dependency visualization
- `RevisionHeatmapBlock` + `getDefaultRevisionHeatmapData` -- revision activity heatmap

## Dependencies
- `@/lib/types` -- per-block data interfaces (PricingConfigData, ScopeBoundaryData, etc.)

## Imported By
- `Editor.tsx` -- all 8 blocks rendered in contentBlockMap

## Files
- `PricingConfigBlock.tsx` (92 lines), `ScopeBoundaryBlock.tsx` (84 lines), `AssetChecklistBlock.tsx` (96 lines), `DecisionPickerBlock.tsx` (62 lines), `AvailabilityPickerBlock.tsx` (70 lines), `ProgressStreamBlock.tsx` (65 lines), `DependencyMapBlock.tsx` (80 lines), `RevisionHeatmapBlock.tsx` (85 lines)
- `UniqueBlocks.module.css` -- shared styles
