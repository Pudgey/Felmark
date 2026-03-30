# Dashboard Home — Freelancer Command Center

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1

---

## Concept

The Dashboard Home is the top-level overview a freelancer sees when they click the Felmark logo or a dedicated home icon in the Rail. It's the "mission control" — everything across all workspaces at a glance: earnings, active projects, pipeline health, deadlines, and activity feed. Unlike WorkspaceHome (which is scoped to one client), this is the full business view.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Good afternoon. Let's build.                                  │
│ Saturday, March 29, 2026        [◆ New proposal] [$ Invoice] │
├──────────────────────────────────────────────────────────────┤
│ $14.8k     │ $11.4k    │ $36.7k   │ 3          │ $22k      │
│ earned     │ active    │ pipeline │ deadlines  │ lifetime  │
│ ████░░     │           │          │ 1 overdue  │           │
├──────────────────────────────┬───────────────────────────────┤
│ WORKSPACES                   │ ACTIVITY                      │
│ ┌ Meridian Studio ─────────┐│ $ Payment — $1,800 Nora  32m │
│ │ Active · 3 pj · $12.4k  ││ ◎ Sarah viewed Invoice   1h  │
│ │ $4,200 active · 5d left  ││ → Sarah: "logo section"  2h  │
│ └──────────────────────────┘│ ✓ Nora signed proposal   3h  │
│ ┌ Nora Kim ────────────────┐│ ↗ Proposal sent Luna     5h  │
│ │ Active · 2 pj · $4.8k   ││ ✎ Jamie edited typo      6h  │
│ └──────────────────────────┘│ ! Bolt invoice overdue   Yest │
│ ┌ Bolt Fitness ────────────┐│                               │
│ │ Overdue · 1 pj · $4.8k  ││ PIPELINE                      │
│ └──────────────────────────┘│ [==Lead===Proposed=Active=Pmt]│
│                              │ 3 $10.9k │ 2 $11.2k │ ...   │
│ DEADLINES                    │                               │
│ ! App Onboarding — 4d over  │ EARNINGS                      │
│ ▸ Brand Guidelines — 5d     │ $22k lifetime ↑ 18%          │
│ ▸ Website Copy — 10d        │ [Oct Nov Dec Jan Feb Mar]     │
│ ▸ Course Landing — 14d      │                               │
└──────────────────────────────┴───────────────────────────────┘
```

---

## Components

### Header
- Time-based greeting (Good morning/afternoon/evening) with italic ember accent "Let's build."
- Current date (full format)
- Quick action buttons: New proposal (primary), New invoice, New workspace, Quick note — each with keyboard shortcut badge

### Stats Row (5 cells)
- Earned this month (animated counter, mini sparkline bar chart)
- In progress (sum of active project values)
- Total pipeline (all open deals)
- Upcoming deadlines (count + overdue warning)
- Lifetime earnings (total across all clients)

### Left Column

**Workspaces** — Rich cards for each client workspace:
- Avatar with unread badge
- Client name, status badge, project count, total earned
- Active value, next deadline countdown, last activity timestamp
- Hover: ember highlight

**Deadlines** — Sorted by urgency (overdue first):
- Client avatar, project name, client name, value
- Days left (color-coded: red/amber/neutral)
- Progress bar with percentage

### Right Column

**Activity** — Chronological feed with typed icons:
- Payment received, invoice viewed, client comment, proposal signed, proposal sent, edit, overdue alert
- Each: icon (colored badge), text, detail line, relative timestamp

**Pipeline** — Condensed funnel view:
- Color-coded bar showing stage proportions
- Stage breakdown: count + value per stage (Lead, Proposed, Active, Awaiting)

**Earnings** — 6-month chart:
- Lifetime total with quarter-over-quarter trend
- Bar chart with monthly values, current month highlighted in ember

---

## Integration Path

### Where It Renders
- Felmark logo click in Rail → shows Dashboard Home in editor area
- New home icon in Rail (top position) → same
- This replaces TerminalWelcome as the "no active tab" default view

### Data Sources

| Data | M1 Source | M2 Source |
|------|-----------|-----------|
| Workspaces | `workspaces` state (exists) | Supabase |
| Earnings | Sum of project amounts | Stripe Connect |
| Pipeline | Seed data | Pipeline feature (M2) |
| Activity | Seed data | Activity log (M2) |
| Deadlines | Derived from project due dates | Supabase |

---

## Implementation Phases

### Phase 1 (M1) — Static Dashboard
- DashboardHome component + CSS module
- Reads from existing workspace/project data
- Activity + pipeline + earnings use seed data
- Renders when railActive === "home" or no active tab and no workspace selected

### Phase 2 (M2) — Connected
- Real activity feed from event log
- Pipeline from deal board
- Earnings from Stripe/invoice data
- Live updates via Supabase Realtime

---

## Review Notes

### Must Fix Before Integration
- Inline styles → CSS modules
- Remove `<style>` tag, `@import` font, and duplicate `:root` vars
- TypeScript types for all data structures
- `AnimNum` uses `requestAnimationFrame` without ref cleanup
- Revenue chart `maxMonth` could be 0 if all months are 0 (divide by zero)
- `now` state updates every 60s but greeting only needs hour resolution

### Design Decisions
- Greeting is personal — "Good afternoon. Let's build." sets the tone
- Stats row spans full width (same pattern as WorkspaceHome)
- Two-column layout with workspaces + deadlines left, activity + pipeline + earnings right
- Everything is clickable — workspace cards navigate to workspace home, deadlines to calendar, activity items to the relevant context

---

## Prototype Code

### Data

```jsx
const WORKSPACES = [
  { id: "w1", name: "Meridian Studio", avatar: "M", color: "#7c8594", projects: 3, activeValue: 4200, totalEarned: 12400, lastActivity: "2m ago", status: "active", nextDeadline: "Apr 3", daysLeft: 5, unread: 2 },
  { id: "w2", name: "Nora Kim", avatar: "N", color: "#a08472", projects: 2, activeValue: 3200, totalEarned: 4800, lastActivity: "1h ago", status: "active", nextDeadline: "Apr 12", daysLeft: 14, unread: 0 },
  { id: "w3", name: "Bolt Fitness", avatar: "B", color: "#8a7e63", projects: 1, activeValue: 4000, totalEarned: 4800, lastActivity: "3d ago", status: "overdue", nextDeadline: "Mar 25", daysLeft: -4, unread: 1 },
  { id: "w4", name: "Luna Boutique", avatar: "L", color: "#7c6b9e", projects: 0, activeValue: 0, totalEarned: 0, lastActivity: "New", status: "lead", nextDeadline: null, daysLeft: null, unread: 0 },
];

const REVENUE_MONTHS = [
  { month: "Oct", value: 8200 }, { month: "Nov", value: 11400 }, { month: "Dec", value: 9800 },
  { month: "Jan", value: 13200 }, { month: "Feb", value: 10600 }, { month: "Mar", value: 14800 },
];

const DEADLINES = [
  { id: 1, title: "Brand Guidelines v2", client: "Meridian Studio", avatar: "M", color: "#7c8594", date: "Apr 3", daysLeft: 5, progress: 65, value: 2400 },
  { id: 2, title: "Website Copy", client: "Meridian Studio", avatar: "M", color: "#7c8594", date: "Apr 8", daysLeft: 10, progress: 40, value: 1800 },
  { id: 3, title: "Course Landing Page", client: "Nora Kim", avatar: "N", color: "#a08472", date: "Apr 12", daysLeft: 14, progress: 25, value: 3200 },
  { id: 4, title: "App Onboarding UX", client: "Bolt Fitness", avatar: "B", color: "#8a7e63", date: "Mar 25", daysLeft: -4, progress: 70, value: 4000, overdue: true },
];

const ACTIVITY = [
  { id: 1, icon: "$", color: "#5a9a3c", text: "Payment received — $1,800 from Nora Kim", detail: "Invoice #046 · Retainer (March)", time: "32m ago" },
  { id: 2, icon: "◎", color: "#5b7fa4", text: "Sarah viewed Invoice #047", detail: "Meridian Studio · 2nd view", time: "1h ago" },
  { id: 3, icon: "→", color: "#8a7e63", text: "Sarah: \"Can we make the logo section more specific?\"", detail: "Brand Guidelines v2 · Comment", time: "2h ago" },
  { id: 4, icon: "✓", color: "#5a9a3c", text: "Nora signed the Course Landing Page proposal", detail: "Proposal accepted · $3,200", time: "3h ago" },
  { id: 5, icon: "↗", color: "#b07d4f", text: "Proposal sent to Luna Boutique", detail: "E-commerce Rebrand · $6,500", time: "5h ago" },
  { id: 6, icon: "✎", color: "#7c8594", text: "Jamie edited Typography section", detail: "Brand Guidelines v2 · 8 changes", time: "6h ago" },
  { id: 7, icon: "!", color: "#c24b38", text: "Bolt Fitness invoice is 4 days overdue", detail: "Invoice #044 · $4,000", time: "Yesterday" },
];

const PIPELINE_STAGES = [
  { label: "Lead", count: 3, value: 10900, color: "#5b7fa4" },
  { label: "Proposed", count: 2, value: 11200, color: "#b07d4f" },
  { label: "Active", count: 3, value: 8200, color: "#5a9a3c" },
  { label: "Awaiting", count: 2, value: 6400, color: "#8a7e63" },
];

const QUICK_ACTIONS = [
  { id: "proposal", label: "New proposal", icon: "◆", shortcut: "⌘⇧P" },
  { id: "invoice", label: "New invoice", icon: "$", shortcut: "⌘⇧I" },
  { id: "workspace", label: "New workspace", icon: "→", shortcut: "⌘⇧W" },
  { id: "note", label: "Quick note", icon: "✎", shortcut: "⌘N" },
];
```

### AnimNum Helper

```jsx
function AnimNum({ value, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const frame = () => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}
```

### Component

```jsx
export default function Dashboard() {
  const [hoveredWorkspace, setHoveredWorkspace] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(i);
  }, []);

  const totalEarned = WORKSPACES.reduce((s, w) => s + w.totalEarned, 0);
  const totalActive = WORKSPACES.reduce((s, w) => s + w.activeValue, 0);
  const totalProjects = WORKSPACES.reduce((s, w) => s + w.projects, 0);
  const overdueCount = DEADLINES.filter(d => d.overdue).length;
  const pipelineTotal = PIPELINE_STAGES.reduce((s, p) => s + p.value, 0);
  const maxMonth = Math.max(...REVENUE_MONTHS.map(m => m.value));
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Full render: header with greeting + quick actions,
  // 5-cell stats row, two-column grid with workspaces + deadlines (left)
  // and activity + pipeline + earnings (right), footer
}
```

### Prototype Styles

```css
.dash {
  font-family: 'Outfit', system-ui, sans-serif; font-size: 14px;
  color: var(--ink-700); background: var(--parchment); min-height: 100vh;
}

/* Header — greeting + actions */
.dash-head { padding: 28px 40px 20px; display: flex; align-items: flex-end; justify-content: space-between; }
.dash-greeting { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 500; color: var(--ink-800); }
.dash-greeting em { font-style: italic; color: var(--ember); }

/* Stats row — 5 cells with animated values */
.dash-stats { display: flex; gap: 0; margin: 0 40px; border: 1px solid var(--warm-200); border-radius: 10px; overflow: hidden; background: #fff; }
.dash-stat { flex: 1; padding: 18px 22px; border-right: 1px solid var(--warm-100); }
.dash-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 600; line-height: 1; }
.dash-stat-label { font-family: var(--mono); font-size: 9px; text-transform: uppercase; letter-spacing: .06em; }

/* Two-column grid */
.dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 20px; padding: 20px 40px 60px; }

/* Section cards — white, bordered, rounded */
.dash-section { background: #fff; border: 1px solid var(--warm-200); border-radius: 10px; overflow: hidden; }

/* Workspace cards — hover highlight, avatar with unread badge */
.dash-ws { display: flex; align-items: center; gap: 14px; padding: 12px 14px; border-radius: 8px; border: 1px solid transparent; }
.dash-ws:hover { background: var(--warm-50); border-color: var(--warm-200); }
.dash-ws.hovered { background: var(--ember-bg); border-color: rgba(176,125,79,.1); }

/* Deadline rows — overdue get red left border */
.dash-dl { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 7px; }
.dash-dl.overdue { border-left: 3px solid #c24b38; }

/* Activity feed — icon badges, text, timestamps */
.dash-act { display: flex; align-items: flex-start; gap: 10px; padding: 10px; border-bottom: 1px solid var(--warm-100); }
.dash-act-icon { width: 26px; height: 26px; border-radius: 6px; }

/* Pipeline — proportional bar + stage breakdown */
.dash-pipe-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; gap: 2px; }

/* Earnings — bar chart with current month highlighted */
.dash-earn-chart { display: flex; gap: 6px; height: 64px; align-items: flex-end; }
.dash-earn-bar { width: 100%; border-radius: 3px; }
```
