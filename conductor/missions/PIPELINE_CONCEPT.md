# Pipeline — Freelancer Deal Board

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M2 (Pro tier feature) — but Rail icon wired now

---

## Concept

A Kanban-style deal pipeline that tracks every client opportunity from first contact through payment. Five stages: Lead → Proposed → Active → Awaiting Payment → Completed. Drag deals between stages, see weighted revenue at a glance, and never lose track of where money is in the funnel.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Pipeline            [Board] [List] [Funnel]    [+ New Deal]  │
├──────────────────────────────────────────────────────────────┤
│ $28.3k pipeline │ $18.1k weighted │ $6.0k won │ 10 open │ 23% │
├══════════════════════════════════════════════════════════════┤
│ Lead        │ Proposed    │ Active      │ Payment     │ Done │
│ ◇ 3 $10.9k │ ◆ 2 $11.2k │ ● 3 $8.2k  │ $ 2 $6.4k  │ ✓ 3  │
│ ┌─────────┐│ ┌─────────┐│ ┌─────────┐│ ┌─────────┐│      │
│ │ E-comm  ││ │ Course  ││ │ Brand   ││ │ Inv#047 ││      │
│ │ Luna    ││ │ Nora    ││ │ Meridian││ │ Meridian││      │
│ │ $6,500  ││ │ $3,200  ││ │ $2,400  ││ │ $2,400  ││      │
│ │ 40%     ││ │ 85% 3👁 ││ │ ████░░  ││ │ 2 views ││      │
│ └─────────┘│ └─────────┘│ └─────────┘│ └─────────┘│      │
│ ┌─────────┐│            │            │            │      │
│ │ App UI  ││            │            │            │      │
│ └─────────┘│            │            │            │      │
│ [+ Add]    │ [+ Add]    │ [+ Add]    │ [+ Add]    │      │
└────────────┴────────────┴────────────┴────────────┴──────┘
```

---

## Features

### Deal Cards
- Client avatar + name + deal title
- Dollar value (prominent, mono font)
- Probability % badge
- Days in stage counter
- Progress bar (active stage)
- Due date countdown (with overdue state)
- Proposal/invoice view count badges
- Drag-and-drop between stages

### Stats Strip
- Total pipeline value
- Weighted pipeline (value × probability)
- Won this period
- Open deal count
- Conversion rate %

### Funnel Visualization
- Color-coded segments proportional to stage values
- Visual at-a-glance health of the pipeline

### Detail Panel
- Slide-in from right on deal click
- Stage selector (move deal between stages)
- All metadata: value, probability, weighted value, contact, source, days in stage, progress, deadline
- Notes textarea
- Actions: Open Project, Edit, Archive

### Inline Deal Creation
- "+ Add deal" at bottom of each column
- Quick form: name, client, value
- Enter to save, Escape to cancel

---

## Data Model

### Stages

```typescript
const STAGES = [
  { id: "lead", label: "Lead", icon: "◇", color: "#5b7fa4" },
  { id: "proposed", label: "Proposed", icon: "◆", color: "#b07d4f" },
  { id: "active", label: "Active", icon: "●", color: "#5a9a3c" },
  { id: "payment", label: "Awaiting Payment", icon: "$", color: "#8a7e63" },
  { id: "completed", label: "Completed", icon: "✓", color: "#7c8594" },
];
```

### Deal

```typescript
interface Deal {
  id: string;
  stage: string;
  name: string;
  client: string;
  contact?: string;
  value: number;
  probability: number;
  daysInStage: number;
  source?: string;
  notes?: string;
  avatar: string;
  avatarBg: string;
  // Active stage
  progress?: number;
  dueIn?: number;
  overdue?: boolean;
  // Payment stage
  invoiceDate?: string;
  invoiceViews?: number;
  // Proposed stage
  proposalViews?: number;
  // Completed stage
  paidDate?: string;
}
```

---

## Integration Path

### Where It Renders
Pipeline icon in the Rail → sidebar shows pipeline summary/filters → editor area shows the full board (same pattern as Calendar).

### Connection to Workspaces
- Active deals link to workspace projects
- "Open Project" in deal detail → navigates to the project tab
- When a project completes → deal auto-moves to Completed stage (future)

### Connection to Invoicing (M3)
- "Awaiting Payment" deals link to Stripe Connect invoices
- Invoice view tracking from Stripe webhooks
- Auto-move to Completed when payment received

---

## Implementation Phases

### Phase 1 (M1) — Rail Icon Only
- Pipeline icon in rail (DONE)
- Click shows placeholder or redirects to workspaces

### Phase 2 (M2) — Static Board
- PipelineBoard component + CSS module
- Seed data, drag-and-drop, detail panel
- Renders in editor area when railActive === "pipeline"
- Local state only

### Phase 3 (M2+) — Connected
- Deals linked to workspace projects
- Supabase persistence
- Stage transitions trigger actions (move project status, etc.)

### Phase 4 (M3) — Invoicing
- Stripe Connect integration
- Invoice generation from deal
- Payment tracking + auto-complete

---

## Review Notes (Pre-Integration)

### Must Fix
- Inline styles → CSS modules
- Remove duplicate `:root` vars and `<link>` font imports
- TypeScript types for all deal properties
- `setDeals` in `moveDeal` doesn't guard against missing deal

### Should Fix
- Detail panel has no focus trap
- No Escape key handler for detail panel overlay
- No keyboard navigation between deal cards
- Funnel bar segments have no labels/tooltips

### Design Decisions
- Board view is default (most visual), List and Funnel are future views
- 5 stages is enough — more creates decision paralysis
- Probability is manual (freelancers know their gut feel) — not auto-calculated
- "Days in stage" creates urgency without being annoying

---

## Prototype Code

### Data

```jsx
const STAGES = [
  { id: "lead", label: "Lead", icon: "◇", color: "#5b7fa4", desc: "New opportunity" },
  { id: "proposed", label: "Proposed", icon: "◆", color: "#b07d4f", desc: "Sent proposal" },
  { id: "active", label: "Active", icon: "●", color: "#5a9a3c", desc: "Work in progress" },
  { id: "payment", label: "Awaiting Payment", icon: "$", color: "#8a7e63", desc: "Invoice sent" },
  { id: "completed", label: "Completed", icon: "✓", color: "#7c8594", desc: "Paid & delivered" },
];

const INITIAL_DEALS = [
  // Leads
  { id: "d1", stage: "lead", name: "E-commerce Rebrand", client: "Luna Boutique", contact: "maria@lunaboutique.co", value: 6500, probability: 40, daysInStage: 3, source: "Referral", notes: "Maria reached out via Instagram. Wants full rebrand by summer.", avatar: "L", avatarBg: "#7c6b9e" },
  { id: "d2", stage: "lead", name: "App UI Audit", client: "HealthTrack", contact: "dev@healthtrack.io", value: 3200, probability: 25, daysInStage: 7, source: "Cold outreach", notes: "Responded to my case study post on LinkedIn.", avatar: "H", avatarBg: "#5b7fa4" },
  { id: "d3", stage: "lead", name: "Newsletter Design", client: "The Daily Brief", contact: "editor@dailybrief.com", value: 1200, probability: 60, daysInStage: 1, source: "Inbound", notes: "Quick project. They want a Substack template.", avatar: "D", avatarBg: "#3d6b52" },

  // Proposed
  { id: "d4", stage: "proposed", name: "Course Landing Page", client: "Nora Kim", contact: "nora@coachkim.com", value: 3200, probability: 85, daysInStage: 2, source: "Existing client", notes: "Proposal sent. She's viewed it 3 times. Likely to sign.", avatar: "N", avatarBg: "#a08472", proposalViews: 3 },
  { id: "d5", stage: "proposed", name: "Brand Strategy Sprint", client: "Finch & Co", contact: "james@finchandco.com", value: 8000, probability: 50, daysInStage: 5, source: "Referral", notes: "Waiting on budget approval from their board.", avatar: "F", avatarBg: "#8b5c3a" },

  // Active
  { id: "d6", stage: "active", name: "Brand Guidelines v2", client: "Meridian Studio", contact: "sarah@meridianstudio.co", value: 2400, probability: 95, daysInStage: 12, progress: 65, dueIn: 5, avatar: "M", avatarBg: "#7c8594" },
  { id: "d7", stage: "active", name: "Website Copy", client: "Meridian Studio", contact: "sarah@meridianstudio.co", value: 1800, probability: 90, daysInStage: 8, progress: 40, dueIn: 10, avatar: "M", avatarBg: "#7c8594" },
  { id: "d8", stage: "active", name: "App Onboarding UX", client: "Bolt Fitness", contact: "team@boltfit.co", value: 4000, probability: 85, daysInStage: 18, progress: 70, dueIn: -4, avatar: "B", avatarBg: "#8a7e63", overdue: true },

  // Awaiting Payment
  { id: "d9", stage: "payment", name: "Invoice #047 — Brand deposit", client: "Meridian Studio", value: 2400, probability: 98, daysInStage: 1, invoiceDate: "Mar 29", avatar: "M", avatarBg: "#7c8594", invoiceViews: 2 },
  { id: "d10", stage: "payment", name: "Invoice #044 — Onboarding", client: "Bolt Fitness", value: 4000, probability: 80, daysInStage: 4, invoiceDate: "Mar 25", avatar: "B", avatarBg: "#8a7e63", overdue: true },

  // Completed
  { id: "d11", stage: "completed", name: "Social Media Kit", client: "Meridian Studio", value: 950, paidDate: "Mar 20", avatar: "M", avatarBg: "#7c8594" },
  { id: "d12", stage: "completed", name: "Retainer (March)", client: "Nora Kim", value: 1800, paidDate: "Mar 15", avatar: "N", avatarBg: "#a08472" },
  { id: "d13", stage: "completed", name: "Logo Refresh", client: "Meridian Studio", value: 3200, paidDate: "Dec 15", avatar: "M", avatarBg: "#7c8594" },
];
```

### Component

```jsx
import { useState, useRef } from "react";

export default function Pipeline() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [dragDeal, setDragDeal] = useState(null);
  const [dropStage, setDropStage] = useState(null);
  const [hoveredDeal, setHoveredDeal] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showAdd, setShowAdd] = useState(null);
  const [newDeal, setNewDeal] = useState({ name: "", client: "", value: "" });

  const moveDeal = (dealId, newStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, daysInStage: 0 } : d));
  };

  const addDeal = (stage) => {
    if (!newDeal.name.trim()) return;
    setDeals(prev => [...prev, {
      id: `d${Date.now()}`, stage, name: newDeal.name, client: newDeal.client || "Unknown",
      value: parseInt(newDeal.value) || 0, probability: stage === "lead" ? 30 : 70,
      daysInStage: 0, avatar: (newDeal.client || "?")[0].toUpperCase(),
      avatarBg: ["#7c6b9e", "#5b7fa4", "#a08472", "#3d6b52", "#8b5c3a"][Math.floor(Math.random() * 5)],
    }]);
    setNewDeal({ name: "", client: "", value: "" });
    setShowAdd(null);
  };

  const stageValue = (stageId) => deals.filter(d => d.stage === stageId).reduce((s, d) => s + d.value, 0);
  const totalPipeline = deals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value, 0);
  const weightedPipeline = deals.filter(d => d.stage !== "completed").reduce((s, d) => s + d.value * (d.probability || 50) / 100, 0);
  const completedTotal = deals.filter(d => d.stage === "completed").reduce((s, d) => s + d.value, 0);
  const conversionRate = deals.length > 0 ? Math.round((deals.filter(d => d.stage === "completed").length / deals.length) * 100) : 0;

  const selected = deals.find(d => d.id === selectedDeal);

  // Full render — header, stats strip, funnel bar, board with columns,
  // deal cards with drag-and-drop, inline add forms, detail slide-in panel
  // See PIPELINE_CONCEPT.md for full prototype code
}
```

### Prototype Styles

```css
/* Full inline CSS preserved in prototype file */
/* Key patterns: */

/* Board layout — equal flex columns */
.pipe-board { flex: 1; display: flex; gap: 0; overflow-x: auto; }
.pipe-col { flex: 1; min-width: 240px; display: flex; flex-direction: column; border-right: 1px solid var(--warm-100); }
.pipe-col.drop-target { background: rgba(176,125,79,0.02); }

/* Deal cards — white cards with accent bar, grab cursor */
.deal { background: var(--parchment); border: 1px solid var(--warm-200); border-radius: 8px; padding: 12px 14px; cursor: grab; }
.deal:hover { border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); transform: translateY(-1px); }
.deal.dragging { opacity: 0.4; transform: scale(0.95); }
.deal.overdue-card { border-left: 3px solid #c24b38; }

/* Detail panel — slide-in from right */
.deal-detail { position: fixed; top: 0; right: 0; bottom: 0; width: 360px; animation: slideIn 0.2s ease; }

/* Funnel visualization — proportional color segments */
.pipe-funnel { display: flex; height: 4px; }
.pipe-funnel-seg { transition: width 0.3s ease; min-width: 2px; }

/* Stats strip — mono values, uppercase labels */
.pipe-stat-val { font-family: var(--mono); font-size: 18px; font-weight: 600; }
.pipe-stat-label { font-family: var(--mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.06em; }
```
