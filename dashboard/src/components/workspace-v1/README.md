# Workspace V1 — Reference Archive

This is a frozen copy of the V1 workspace for redesign reference. It is not imported by anything in the live app.

## Features

- **Grid-based canvas**: 8 columns, 128px cells, 16px gap
- **21 block types** across 6 categories
- **Drag-to-place** from library modal
- **Drag-to-move** between grid slots
- **Block chrome**: drag handle, type label, size badge, configure/remove buttons
- **Edit mode toggle** (pencil icon in toolbar)
- **Row/column insertion bars** (dashed + buttons between rows/blocks)
- **Block type replacement popover** (swap block types in place)
- **Client sidebar**: search, sparklines, health rings, project tracking
- **Floating timer**: start/pause/stop/log with minimize pill
- **Toolbar**: logo, workspace badge, space tabs, edit toggle, avatar
- **LocalStorage persistence** (`felmark_workspace_canvas_v1`)

## Block Types

| Category | Types |
|----------|-------|
| Metrics | `revenue`, `outstanding`, `rate`, `goal` |
| Dashboards | `tasks`, `activity`, `health`, `timer`, `calendar`, `chat` |
| Data | `invoices`, `files`, `pipeline` |
| Automation | `automation` |
| AI | `whisper` |
| Charts | `revenue-chart` |
| Notes | `note` |
| Premium | `project-summary`, `command-surface`, `client-pulse`, `invoice-surface` |

## Block Sizes

- **Micro blocks**: 1x1 to 2x2, prefer 2x2
- **Premium blocks**: minimum 4x4, preferred 4x5 or 5x4
- **Max width**: 8 columns (full canvas)

## File Tree

| File | Lines | Purpose |
|------|-------|---------|
| `MANIFEST.md` | 30 | Folder manifest |
| `Workspace.tsx` | 550 | Legacy full workspace (sidebar, tasks, board, detail panel) |
| `Workspace.module.css` | 242 | Legacy workspace styles |
| `canvas/Canvas.tsx` | 726 | Main canvas component — grid, drag-drop, edit mode, block rendering |
| `canvas/Canvas.module.css` | 636 | Canvas styles — grid, toolbar, blocks, insertions, library overlay |
| `canvas/MANIFEST.md` | 47 | Canvas folder manifest |
| `canvas/layout.ts` | 139 | Layout engine (distributeWidth, layoutRows) |
| `canvas/registry.ts` | 106 | Block registry (BLOCK_DEFS, COLS, CELL, GRID_W) |
| `canvas/storage.ts` | 39 | LocalStorage persistence (key: felmark_workspace_canvas_v1) |
| `canvas/types.ts` | 68 | Canvas type definitions |
| `canvas/blocks/BlockContent.tsx` | 36 | Block content renderer (maps block type to component) |
| `canvas/blocks/BlockContent.module.css` | 515 | Block content styles |
| `canvas/blocks/MetricBlock.tsx` | 455 | Revenue, outstanding, rate, goal metric blocks |
| `canvas/blocks/AutomationBlock.tsx` | 82 | Automation block |
| `canvas/blocks/AutomationBlock.module.css` | 129 | Automation block styles |
| `canvas/blocks/CalendarBlock.tsx` | 110 | Calendar block |
| `canvas/blocks/CalendarBlock.module.css` | 210 | Calendar block styles |
| `canvas/blocks/ChatBlock.tsx` | 101 | Chat block |
| `canvas/blocks/ChatBlock.module.css` | 247 | Chat block styles |
| `canvas/blocks/FileBlock.tsx` | 86 | File block |
| `canvas/blocks/FileBlock.module.css` | 249 | File block styles |
| `canvas/blocks/PipelineBlock.tsx` | 82 | Pipeline block |
| `canvas/blocks/PipelineBlock.module.css` | 158 | Pipeline block styles |
| `canvas/blocks/PlaceholderBlock.tsx` | 48 | Placeholder/empty block |
| `canvas/blocks/ProjectSpotlightBlock.tsx` | 403 | Project summary / command surface block |
| `canvas/blocks/ProjectSpotlightBlock.module.css` | 560 | Project spotlight styles |
| `canvas/blocks/PulseInvoiceBlocks.tsx` | 300 | Client pulse + invoice surface blocks |
| `canvas/blocks/PulseInvoiceBlocks.module.css` | 420 | Pulse/invoice styles |
| `canvas/blocks/RevenueChartBlock.tsx` | 108 | Revenue chart block |
| `canvas/blocks/RevenueChartBlock.module.css` | 144 | Revenue chart styles |
| `canvas/blocks/WhisperBlock.tsx` | 17 | AI whisper block |
| `canvas/blocks/MANIFEST.md` | 60 | Blocks folder manifest |
| `canvas/chrome/BlockChrome.tsx` | 103 | Block chrome (drag handle, labels, buttons) |
| `canvas/chrome/BlockChrome.module.css` | 154 | Block chrome styles |
| `canvas/chrome/ReplacePopover.tsx` | 39 | Block type replacement popover |
| `canvas/chrome/ReplacePopover.module.css` | 77 | Replace popover styles |
| `canvas/chrome/Splitter.tsx` | 19 | Column splitter/divider |
| `canvas/chrome/Splitter.module.css` | 40 | Splitter styles |
| `canvas/chrome/MANIFEST.md` | 25 | Chrome folder manifest |
| `canvas/hooks/useDragPlace.ts` | 178 | Drag-to-place from library hook |
| `canvas/hooks/useDragMove.ts` | 262 | Drag-to-move between grid slots hook |
| `canvas/hooks/useDragResize.ts` | 79 | Drag-to-resize block hook |
| `canvas/hooks/useCanvasGrid.ts` | 23 | Canvas grid dimensions hook |
| `canvas/hooks/useCanvasLabels.ts` | 77 | Canvas row/column labels hook |
| `canvas/hooks/useCanvasFooter.ts` | 68 | Canvas footer state hook |
| `canvas/hooks/MANIFEST.md` | 27 | Hooks folder manifest |
| `canvas/insertions/RowInsertionBar.tsx` | 44 | Row insertion bar (add row between existing rows) |
| `canvas/insertions/ColInsertionBar.tsx` | 44 | Column insertion bar (add column between blocks) |
| `canvas/insertions/EmptyRow.tsx` | 21 | Empty row placeholder |
| `canvas/insertions/Insertions.module.css` | 159 | Insertion bar styles |
| `canvas/insertions/MANIFEST.md` | 20 | Insertions folder manifest |
| `canvas/library/Library.tsx` | 83 | Block library modal (pick block type to place) |
| `canvas/library/Library.module.css` | 212 | Library modal styles |
| `canvas/library/MANIFEST.md` | 17 | Library folder manifest |
| `canvas/toolbar/Toolbar.tsx` | 49 | Canvas toolbar (logo, badge, tabs, edit toggle, avatar) |
| `canvas/toolbar/Toolbar.module.css` | 148 | Toolbar styles |
| `canvas/toolbar/MANIFEST.md` | 16 | Toolbar folder manifest |
| `sidebar/WorkspaceSidebar.tsx` | 405 | Client sidebar (search, sparklines, health rings, projects) |
| `sidebar/WorkspaceSidebar.module.css` | 602 | Sidebar styles |
| `sidebar/MANIFEST.md` | 15 | Sidebar folder manifest |
| `timer/FloatingTimer.tsx` | 129 | Floating timer (start/pause/stop/log, minimize pill) |
| `timer/FloatingTimer.module.css` | 42 | Timer styles |
| `timer/MANIFEST.md` | 28 | Timer folder manifest |
| **Total** | **~10,308** | |

## Dependencies

- **Self-contained**: no external imports outside workspace/
- **Canvas hooks**: useDragPlace, useDragMove, useDragResize, useCanvasGrid, useCanvasLabels, useCanvasFooter
- **Layout engine**: layout.ts (distributeWidth, layoutRows)
- **Block registry**: registry.ts (BLOCK_DEFS, COLS, CELL, GRID_W)
- **Storage**: storage.ts (localStorage key: `felmark_workspace_canvas_v1`)
- **View wrapper**: `views/workspace.tsx` renders Canvas + WorkspaceSidebar
- **Router**: `views/routers/WorkspaceRouter.tsx` renders WorkspaceView
- **Rail**: planet icon button in Rail.tsx
