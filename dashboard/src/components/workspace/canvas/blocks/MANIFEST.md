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

## Size Requirements
- `Micro block`: design for `2x2`, survive at `1x1`, never assume more than one primary message plus one supporting cue.
- `Micro block`: allowed payload is one headline or value, one short support line, and at most one micro-visual such as a spark, ring, or badge.
- `Micro block`: no nested panels, no tabs, no secondary rails, no dense control clusters.
- `Premium block`: minimum footprint is `4x4`; preferred footprint is `4x5` or `5x4`.
- `Premium block`: must justify that size with at least three zones of information, usually hero signal, supporting detail, and action or navigation.
- `Premium block`: if the concept cannot feel complete at `4x4`, it belongs in a full surface instead of the canvas.

## Working Rule
- When inventing a new block, classify it as `micro`, `standard`, or `premium` before designing the internals.
- If the block starts with a cinematic or dashboard-hero idea, default to `premium`.
- If the block starts with a number, status, or single signal, default to `micro`.
