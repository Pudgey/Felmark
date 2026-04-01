# Canvas Blocks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `BlockContent` (default) -- Content dispatcher: routes to MetricBlock, WhisperBlock, or PlaceholderBlock
- `MetricBlock` (default) -- Revenue/Outstanding/Rate/Goal metric display
- `WhisperBlock` (default) -- AI Whisper content with badge, dot, text, action button
- `PlaceholderBlock` (default) -- Shimmer placeholder for tasks/activity/health/etc.

## Dependencies
- `../types` -- RenderBlock
- `./BlockContent.module.css` -- shared styles for all block content types

## Imported By
- `../Canvas.tsx` -- BlockContent rendered inside each block

## Files
- `BlockContent.tsx` -- Content dispatcher (routes by block type)
- `MetricBlock.tsx` -- Metric display with label, value, sub, progress bar
- `WhisperBlock.tsx` -- AI Whisper with badge, dot, text, action
- `PlaceholderBlock.tsx` -- Shimmer rows with dots, bars, timestamps
- `BlockContent.module.css` -- All block content styles (whisper, metric, placeholder)
