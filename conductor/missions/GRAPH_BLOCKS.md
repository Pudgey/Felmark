# Graph Blocks — Living Charts Inside Documents

**Created**: 2026-03-29
**Type**: Mission
**Milestone**: M1 (MVP block type) — extends the slash menu
**Prototype**: `Prototype/GraphBlocks.jsx`

---

## Mission Statement

Give freelancers **living charts that breathe inside their documents**. Type `/graph` in the block editor and insert a bar chart, line chart, donut, sparkline, or metric card that renders inline with their notes, proposals, and reports. Data is editable in-place. Charts animate on hover. No export to Google Sheets, no screenshot-paste — the data visualization lives where the thinking happens.

This is what makes Felmark's editor more than a notepad. It's a freelancer's Notion + Observable mashup — documents that contain live business intelligence.

---

## Why This Matters

1. **Freelancers create client reports constantly** — quarterly reviews, project updates, budget summaries. They currently screenshot charts from Sheets/Excel and paste them as dead images.
2. **Proposals with live data convert better** — "Here's your project budget breakdown" with an interactive donut chart beats a bullet list.
3. **No competitor has this** — HoneyBook, Bonsai, Moxie, Assembly: none offer inline charts in their editor. This is a genuine differentiator.
4. **Feeds the intelligence layer** — as Felmark tracks time, invoices, and payments, these charts can auto-populate with real data instead of manual entry.

---

## Chart Types (7 total)

| Type | Use case | Slash command |
|---|---|---|
| **Vertical Bar** | Revenue by month, service comparison | `/graph bar` |
| **Line Chart** | Trends over time, growth trajectory | `/graph line` |
| **Donut Chart** | Revenue distribution, time allocation | `/graph donut` |
| **Horizontal Bar** | Hours by project, ranked comparisons | `/graph hbar` |
| **Sparkline Row** | Compact multi-metric dashboard | `/graph sparkline` |
| **Stacked Area** | Revenue composition over time | `/graph area` |
| **Metric Cards** | KPI row (revenue, projects, rate, pipeline) | `/graph metrics` |

All 7 types are prototyped and working in `Prototype/GraphBlocks.jsx`.

---

## Layout — Charts in Editor Context

```
┌──────────────────────────────────────────────────────────────┐
│ Q1 2026 — Business Review                           [h1]    │
│ Meridian Studio · March 29, 2026 · Quarterly Report [meta]  │
├──────────────────────────────────────────────────────────────┤
│ This quarter saw strong growth across all service lines...   │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ $14.8k    │ 8         │ $95/hr    │ $22k                │ │
│ │ revenue   │ projects  │ avg rate  │ pipeline             │ │
│ │ ↑ 40%     │ ↑ 12%     │ ↑ 5%     │                      │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ## Revenue Trend                                             │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Monthly Revenue (12 months)              [line chart]    │ │
│ │         ╱──·                                             │ │
│ │      ╱──   ╲──·                                          │ │
│ │  ╱──·        ╲──·──·                                     │ │
│ │ ·                                                        │ │
│ │ Apr May Jun Jul Aug Sep Oct Nov Dec Jan Feb Mar          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ## Revenue by Client                                         │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Revenue Distribution                     [donut]         │ │
│ │  ╭───╮   Meridian Studio  $12.4k  50%                   │ │
│ │  │$24│   Bolt Fitness     $4.8k   19%                   │ │
│ │  │.8k│   Nora Kim         $4.8k   19%                   │ │
│ │  ╰───╯   Other            $2.8k   11%                   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ (more document content continues...)                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Interaction Design

### Inserting a Graph
1. Type `/graph` in the editor
2. Slash menu shows graph subtypes (bar, line, donut, etc.) with preview thumbnails
3. Select one — inserts an empty chart block with placeholder data
4. Click the chart to enter edit mode — inline data table appears below

### Editing Data
- Click a chart block → data table expands below it (spreadsheet-style)
- Edit cells directly — chart updates in real-time
- Add/remove rows with +/- buttons
- Paste from clipboard (tab-separated values)
- Each chart type has sensible defaults ("Month" + "Value" columns for line/bar)

### Hover Behavior
- **Bar chart**: Tooltip with value + optional subtitle, bar scales up slightly
- **Line chart**: Dot expands, vertical dashed guide line, tooltip with value
- **Donut**: Segment expands, others fade to 30% opacity, center shows % + label
- **Horizontal bar**: Fill brightens, row highlights
- **Sparkline**: No hover (compact by design)
- **Stacked area**: Hovered series highlights, others fade, legend item highlights
- **Metric cards**: No hover animation (data is always visible)

### Resize
- Charts respect the editor's max-width (720px)
- Height is configurable per chart type (default varies)
- Drag bottom edge to resize height (future)

---

## Technical Architecture

### Block Type Extension

```typescript
// New block type added to existing BlockType union
type BlockType = "paragraph" | "h1" | "h2" | "h3" | "bullet" | "numbered"
  | "todo" | "quote" | "callout" | "divider" | "code"
  | "graph";  // NEW

interface GraphBlockData {
  graphType: "bar" | "line" | "donut" | "hbar" | "sparkline" | "area" | "metrics";
  title: string;
  data: any;       // Shape varies by graphType
  height?: number;  // Optional override
  config?: {
    showLegend?: boolean;
    showTooltips?: boolean;
    animate?: boolean;
    colors?: string[];
  };
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked: boolean;
  graphData?: GraphBlockData;  // Only present when type === "graph"
}
```

### Component Structure

```
dashboard/src/components/editor/
├── graphs/
│   ├── GraphBlock.tsx          ← Router: picks the right chart component
│   ├── GraphDataEditor.tsx     ← Inline spreadsheet for editing data
│   ├── BarChart.tsx
│   ├── LineChart.tsx
│   ├── DonutChart.tsx
│   ├── HorizontalBar.tsx
│   ├── SparklineRow.tsx
│   ├── StackedArea.tsx
│   ├── MetricCards.tsx
│   ├── shared/
│   │   ├── AnimatedNumber.tsx
│   │   ├── palette.ts
│   │   └── chartUtils.ts
│   └── GraphBlock.module.css
```

### Slash Menu Integration

Add to the existing slash menu items:

```typescript
{ type: "graph", label: "Graph", icon: "📊", desc: "Insert a live chart" }
```

Selecting "Graph" opens a sub-picker showing the 7 chart types with thumbnails.

---

## CSS Architecture Notes (From Prototype Review)

| Issue in prototype | Fix for production |
|---|---|
| Global `* { margin: 0 }` reset | Remove — conflicts with editor styles |
| Inline `<style>` tag with all CSS | Split into `GraphBlock.module.css` |
| `min-height: 100vh` on page wrapper | Charts are inline blocks, not full-page — no height needed |
| Shared class names (`.gb-*`) | Convert to CSS modules (auto-scoped) |
| Font imports via `<link>` | Already loaded by the app layout |

---

## Phases

### Phase 1: Static Charts (MVP)
- 7 chart types render in editor with hardcoded/manual data
- Slash menu integration (`/graph`)
- Hover interactions (tooltips, highlights)
- Charts save/load with document blocks
- No data editor yet — data set via code/props

### Phase 2: Inline Data Editor
- Click chart → spreadsheet-style data editor expands below
- Edit cells, add/remove rows
- Paste from clipboard
- Charts update in real-time as data changes

### Phase 3: Live Data Binding
- Connect charts to Felmark data sources:
  - Revenue from invoices
  - Hours from time tracking
  - Projects from workspaces
  - Services from catalog
- "Auto-update" toggle — chart refreshes when underlying data changes
- Template charts: "Insert revenue chart" auto-populates with your actual numbers

---

## Open Questions

1. **Should charts be resizable by dragging?** Or fixed height per type with a config option?
2. **Export**: Should users be able to export a chart as PNG/SVG for use outside Felmark?
3. **Dark mode**: Charts need a dark variant. Prototype only shows light mode.
4. **Print/PDF**: When exporting a document, charts need to render as static images.
5. **Collaboration**: When two users view the same doc, should chart hover states sync? (Probably not — too noisy.)
