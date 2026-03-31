# Graphs -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `GraphBlock` -- Meta-block rendering 7 chart types based on graph data
- `GraphDataEditor` -- Spreadsheet-style data editor for graph blocks
- `getDefaultGraphData` / `GRAPH_TYPE_OPTIONS` -- factories and config
- Chart components: `BarChart`, `LineChart`, `DonutChart`, `HorizontalBar`, `SparklineRow`, `StackedArea`, `MetricCards`
- `AnimatedNumber` -- animated number display utility

## Dependencies
- `@/lib/types` -- GraphBlockData, GraphType
- `./palette` -- PALETTE color constants

## Imported By
- `Editor.tsx` -- GraphBlock + GraphDataEditor rendered for graph block type

## Files
- `GraphBlock.tsx` -- meta-block router (131 lines)
- `GraphBlock.module.css` -- shared chart styles
- `GraphDataEditor.tsx` -- data editor (417 lines)
- `GraphDataEditor.module.css` -- editor styles
- `BarChart.tsx`, `LineChart.tsx`, `DonutChart.tsx`, `HorizontalBar.tsx`, `SparklineRow.tsx`, `StackedArea.tsx`, `MetricCards.tsx` -- chart renderers
- `AnimatedNumber.tsx` -- number animation (21 lines)
- `palette.ts` -- color constants
