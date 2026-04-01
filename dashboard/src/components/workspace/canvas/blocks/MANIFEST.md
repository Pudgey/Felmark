# Canvas Blocks -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `BlockContent` (default) -- Content dispatcher: routes to dedicated block components or falls back to MetricBlock/PlaceholderBlock
- `MetricBlock` (default) -- Revenue/Outstanding/Rate/Goal metric display
- `WhisperBlock` (default) -- AI Whisper content with badge, dot, text, action button
- `PlaceholderBlock` (default) -- Shimmer placeholder for tasks/activity/health/etc.
- `PipelineBlock` (default) -- Pipeline funnel with deal cards, stages, progress bars
- `CalendarBlock` (default) -- Calendar week strip with day detail, event items
- `AutomationBlock` (default) -- Automation rules list with status badges
- `ChatBlock` (default) -- Quick chat with message bubbles, input bar, send functionality
- `FileBlock` (default) -- File gallery with grid/list toggle, drop zone
- `RevenueChartBlock` (default) -- Revenue SVG area chart with by-client breakdown

## Dependencies
- `../types` -- RenderBlock
- `./BlockContent.module.css` -- shared styles for MetricBlock, WhisperBlock, PlaceholderBlock
- `./PipelineBlock.module.css` -- PipelineBlock styles
- `./CalendarBlock.module.css` -- CalendarBlock styles
- `./AutomationBlock.module.css` -- AutomationBlock styles
- `./ChatBlock.module.css` -- ChatBlock styles
- `./FileBlock.module.css` -- FileBlock styles
- `./RevenueChartBlock.module.css` -- RevenueChartBlock styles

## Imported By
- `../Canvas.tsx` -- BlockContent rendered inside each block

## Files
- `BlockContent.tsx` -- Content dispatcher (registry map pattern, routes by block type)
- `MetricBlock.tsx` -- Metric display with label, value, sub, progress bar
- `WhisperBlock.tsx` -- AI Whisper with badge, dot, text, action
- `PlaceholderBlock.tsx` -- Shimmer rows with dots, bars, timestamps
- `PipelineBlock.tsx` -- Pipeline funnel with 4 stages, 5 deal cards, progress bars
- `CalendarBlock.tsx` -- Week strip with selectable days, event detail panel, empty state
- `AutomationBlock.tsx` -- 4 automation rules with icon badges and status labels
- `ChatBlock.tsx` -- Chat with message history, online indicator, functional send
- `FileBlock.tsx` -- File gallery with grid/list views, 6 demo files, drop zone
- `RevenueChartBlock.tsx` -- SVG area chart for 6 months + client revenue bars
- `BlockContent.module.css` -- Shared styles (whisper, metric, placeholder)
- `PipelineBlock.module.css` -- Pipeline block styles
- `CalendarBlock.module.css` -- Calendar block styles
- `AutomationBlock.module.css` -- Automation block styles
- `ChatBlock.module.css` -- Chat block styles
- `FileBlock.module.css` -- File block styles
- `RevenueChartBlock.module.css` -- Revenue chart block styles
