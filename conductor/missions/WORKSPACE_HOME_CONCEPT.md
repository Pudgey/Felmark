# Workspace Home — Client Dashboard View

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1 (static) → M2 (data-connected) → M3 (client portal mirror)

---

## Concept

When a freelancer clicks a workspace (client) in the sidebar without selecting a specific project, they land on the Workspace Home — a single-screen dashboard showing everything about that client relationship: active projects, revenue, activity feed, upcoming deadlines, client details, and quick actions.

This replaces the current behavior where clicking a workspace just expands the project list. The Workspace Home gives context before diving into a document.

---

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [Avatar] Client Name                                         │
│          email · industry · since · rate     [Quick Actions]  │
├──────────────────────────────────────────────────────────────┤
│ $12.4k    │ $4.2k      │ 53%          │ 5d        │ 1       │
│ earned    │ in progress │ avg complete │ next due  │ messages│
├──────────────────────────────┬───────────────────────────────┤
│ ACTIVE PROJECTS              │ ACTIVITY                      │
│ ┌─ Brand Guidelines v2 ──┐  │ · Payment received — $2,400   │
│ │ Active · 2m ago · 5d   │  │ · Sarah opened Invoice #047   │
│ │ $2,400          ████░░ │  │ · Jamie: "Got it, I'll..."    │
│ └────────────────────────┘  │ · You edited Brand Guidelines │
│ ┌─ Website Copy ─────────┐  │                               │
│ │ Review · Yesterday · 10d│  │ UPCOMING                      │
│ │ $1,800          ██░░░░ │  │ · Brand Guidelines due — 5d   │
│ └────────────────────────┘  │ · Website Copy due — 10d      │
│                              │ · Invoice payment — 15d       │
│ COMPLETED                    │                               │
│ ✓ Social Media Kit   $950   │ CLIENT DETAILS                │
│ ✓ Logo Refresh     $3,200   │ Contact: sarah@meridian...    │
│                              │ Industry: Design & Branding   │
│ WORKSPACE NOTES              │ Since: Oct 2025               │
│ [textarea]                   │ Rate: $95/hr                  │
└──────────────────────────────┴───────────────────────────────┘
```

---

## Components

### Identity Bar
- Large client avatar with gradient overlay
- Client name (Cormorant Garamond serif heading)
- Meta row: contact, industry, client-since date, hourly rate
- Quick action buttons: New proposal (primary), New invoice, Quick note, Message client — each with keyboard shortcut badge

### Stats Row
- 5 stat cells spanning full width, separated by subtle borders
- Total earned (animated counter on mount, mini bar chart of monthly revenue)
- In progress (sum of active project values)
- Avg completion (average progress % across active projects)
- Next deadline (days until soonest due date, color-coded by urgency)
- Messages today (count + last message time)

### Main Area (Left Column)
- **Active projects**: Card-based list with accent bar (color = status), icon (type-based), name, status badge, last edited, days-until-due, value, and progress bar
- **Completed projects**: Minimal list with checkmark, name, value, date
- **Workspace notes**: Textarea for freeform client notes (meeting preferences, brand voice, quirks)

### Sidebar (Right Column)
- **Activity feed**: Chronological list with typed icons (payment, view, message, edit, invoice, approval), text, detail line, and timestamp
- **Upcoming deadlines**: Cards with color accent bar, label, date, and days-left countdown
- **Client details**: Key-value card (contact, industry, since, rate, lifetime revenue, project count)

---

## Integration Path

### Where It Renders
When the user clicks a workspace header in the sidebar (not a specific project), instead of just expanding the project list, the editor area shows the Workspace Home. This is a new "view mode" alongside the document editor.

### State Flow
```
User clicks workspace header
  → sidebarOpen stays true
  → activeProject set to null (or a special workspace ID)
  → Editor renders WorkspaceHome instead of block editor
  → Clicking a project card → selectProject() → switches to doc editor
```

### Data Sources (by Phase)

| Data | M1 Source | M2 Source |
|------|-----------|-----------|
| Client info | Workspace model (already exists) | Supabase workspace table |
| Projects | Workspace.projects (already exists) | Supabase projects table |
| Activity | Hardcoded seed data | Supabase activity log |
| Revenue | Sum of project amounts | Stripe Connect / invoice records |
| Notes | Local state | Supabase workspace.notes field |

---

## Implementation Phases

### Phase 1 (M1) — Static Workspace Home
- New `WorkspaceHome.tsx` component with CSS module
- Renders from existing workspace/project data
- Activity feed with seed data
- Quick action buttons (wired to existing handlers: new tab, command palette)
- Workspace notes (local state, not persisted)

### Phase 2 (M2) — Data-Connected
- Activity feed from real events (edits, messages, invoices)
- Revenue from Stripe Connect / invoice records
- Notes persisted to Supabase
- Stats computed from real data

### Phase 3 (M3) — Client Portal Mirror
- Read-only version for client portal
- Client sees: project status, upcoming deadlines, invoices, shared docs
- No internal notes, no revenue data visible to client

---

## Review Notes

### Must Fix Before Integration
- Inline styles → CSS modules
- Remove duplicate `:root` vars and `<link>` font imports
- Revenue animation uses `requestAnimationFrame` without ref-based cleanup
- `activeTab` state declared but only "overview" is used — remove or implement tabs
- Notes textarea uses `defaultValue` — needs controlled state for persistence

### Design Decisions
- Stats row spans full width (feels like a dashboard, not a sidebar)
- Activity feed is right-column, not timeline — keeps focus on projects
- Quick actions mirror command palette shortcuts — muscle memory consistency
- Mini bar chart in revenue stat adds visual interest without a full chart component

---

## Prototype Code

The following is the complete standalone prototype with inline styles and hardcoded data.

### Data

```jsx
const WORKSPACE = {
  client: "Meridian Studio",
  avatar: "M",
  color: "#7c8594",
  contact: "sarah@meridianstudio.co",
  industry: "Design & Branding",
  since: "Oct 2025",
  rate: "$95/hr",
  totalEarned: 12400,
  totalProjects: 6,
};

const PROJECTS = [
  { id: "p1", name: "Brand Guidelines v2", status: "active", progress: 65, due: "Apr 3", daysLeft: 5, value: 2400, lastEdited: "2m ago", type: "proposal" },
  { id: "p2", name: "Website Copy", status: "review", progress: 40, due: "Apr 8", daysLeft: 10, value: 1800, lastEdited: "Yesterday", type: "doc" },
  { id: "p3", name: "Social Media Kit", status: "completed", progress: 100, due: "Mar 20", daysLeft: null, value: 950, lastEdited: "Mar 20", type: "deliverable" },
  { id: "p4", name: "Logo Refresh", status: "completed", progress: 100, due: "Dec 15", daysLeft: null, value: 3200, lastEdited: "Dec 15", type: "deliverable" },
];

const ACTIVITY = [
  { id: 1, type: "payment", text: "Payment received — $2,400", detail: "Invoice #047 · Brand Guidelines deposit", time: "11:30am", icon: "$", color: "#5a9a3c" },
  { id: 2, type: "view", text: "Sarah opened Invoice #047", detail: "2nd view · 1m 45s", time: "11:15am", icon: "◎", color: "#7c8594" },
  { id: 3, type: "message", text: "Jamie: \"Got it, I'll set up the scale with Outfit variable\"", detail: "Brand Guidelines v2", time: "9:35am", icon: "→", color: "#5b7fa4" },
  { id: 4, type: "edit", text: "You edited Brand Guidelines v2", detail: "Typography section · 12 changes", time: "9:20am", icon: "✎", color: "#b07d4f" },
  { id: 5, type: "invoice", text: "Invoice #047 sent", detail: "$2,400 · Net 15 · Due Apr 13", time: "9:45am", icon: "◇", color: "#8a7e63" },
  { id: 6, type: "approval", text: "Sarah approved mood board direction", detail: "Brand Guidelines v2 · Milestone", time: "Yesterday", icon: "✓", color: "#5a9a3c" },
];

const UPCOMING = [
  { label: "Brand Guidelines v2 due", date: "Apr 3", daysLeft: 5, color: "#b07d4f" },
  { label: "Website Copy due", date: "Apr 8", daysLeft: 10, color: "#7c8594" },
  { label: "Invoice #047 payment due", date: "Apr 13", daysLeft: 15, color: "#8a7e63" },
];

const QUICK_ACTIONS = [
  { id: "proposal", label: "New proposal", icon: "◆", shortcut: "⌘⇧P" },
  { id: "invoice", label: "New invoice", icon: "$", shortcut: "⌘⇧I" },
  { id: "note", label: "Quick note", icon: "✎", shortcut: "⌘N" },
  { id: "message", label: "Message client", icon: "→", shortcut: "⌘M" },
];

const MONTHS = [
  { m: "Oct", v: 3200 }, { m: "Nov", v: 2800 }, { m: "Dec", v: 4100 },
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 2400 },
];

const STATUS_CFG = {
  active: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", label: "Active" },
  review: { color: "#b07d4f", bg: "rgba(176,125,79,0.06)", label: "In Review" },
  completed: { color: "#7c8594", bg: "rgba(124,133,148,0.06)", label: "Done" },
  overdue: { color: "#c24b38", bg: "rgba(194,75,56,0.06)", label: "Overdue" },
};
```

### Component

```jsx
import { useState, useEffect } from "react";

export default function WorkspaceHome() {
  const [activeTab, setActiveTab] = useState("overview");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  const activeProjects = PROJECTS.filter(p => p.status !== "completed");
  const completedProjects = PROJECTS.filter(p => p.status === "completed");
  const totalValue = PROJECTS.reduce((s, p) => s + p.value, 0);
  const activeValue = activeProjects.reduce((s, p) => s + p.value, 0);
  const maxMonth = Math.max(...MONTHS.map(m => m.v));

  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const frame = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedRevenue(Math.round(eased * WORKSPACE.totalEarned));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  return (
    <div className="wh">
      {/* Identity bar */}
      <div className="wh-identity">
        <div className="wh-avatar" style={{ background: WORKSPACE.color }}>{WORKSPACE.avatar}</div>
        <div className="wh-info">
          <h1 className="wh-client-name">{WORKSPACE.client}</h1>
          <div className="wh-client-meta">
            <span>{WORKSPACE.contact}</span>
            <span className="wh-meta-dot" />
            <span>{WORKSPACE.industry}</span>
            <span className="wh-meta-dot" />
            <span>Since {WORKSPACE.since}</span>
            <span className="wh-meta-dot" />
            <span>{WORKSPACE.rate}</span>
          </div>
        </div>
        <div className="wh-quick-actions">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={a.id} className={`wh-qa${i === 0 ? " primary" : ""}`}>
              <span className="wh-qa-icon">{a.icon}</span>
              {a.label}
              <span className="wh-qa-shortcut">{a.shortcut}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="wh-stats">
        <div className="wh-stat">
          <div className="wh-stat-val green">${(animatedRevenue / 1000).toFixed(1)}k</div>
          <div className="wh-stat-label">total earned</div>
          <div className="wh-stat-sub">{WORKSPACE.totalProjects} projects lifetime</div>
          <div className="wh-stat-bars">
            {MONTHS.map((m, i) => (
              <div key={i} className="wh-stat-bar" style={{
                height: `${Math.max(4, (m.v / maxMonth) * 100)}%`,
                background: i === MONTHS.length - 1 ? "var(--ember)" : m.v > 0 ? "#5a9a3c" : "var(--warm-200)",
                opacity: i === MONTHS.length - 1 ? 1 : 0.4,
              }} />
            ))}
          </div>
        </div>
        <div className="wh-stat">
          <div className="wh-stat-val ember">${(activeValue / 1000).toFixed(1)}k</div>
          <div className="wh-stat-label">in progress</div>
          <div className="wh-stat-sub">{activeProjects.length} active projects</div>
        </div>
        <div className="wh-stat">
          <div className="wh-stat-val">{Math.round(activeProjects.reduce((s, p) => s + p.progress, 0) / activeProjects.length)}%</div>
          <div className="wh-stat-label">avg completion</div>
          <div className="wh-stat-sub">across active work</div>
        </div>
        <div className="wh-stat">
          <div className="wh-stat-val" style={{ color: activeProjects.some(p => p.daysLeft && p.daysLeft <= 5) ? "#c89360" : "var(--ink-800)" }}>
            {Math.min(...activeProjects.filter(p => p.daysLeft).map(p => p.daysLeft))}d
          </div>
          <div className="wh-stat-label">next deadline</div>
          <div className="wh-stat-sub">Brand Guidelines v2</div>
        </div>
        <div className="wh-stat">
          <div className="wh-stat-val" style={{ color: "#5b7fa4" }}>{ACTIVITY.filter(a => a.type === "message").length}</div>
          <div className="wh-stat-label">messages today</div>
          <div className="wh-stat-sub">last: 9:35am</div>
        </div>
      </div>

      {/* Content grid */}
      <div className="wh-grid" style={{ gridTemplateRows: "1fr" }}>
        {/* Main area */}
        <div className="wh-main">
          <div className="wh-section-label">
            active projects
            <span className="wh-section-count">{activeProjects.length}</span>
          </div>

          <div className="wh-projects">
            {activeProjects.map(pj => {
              const st = STATUS_CFG[pj.status];
              const dueColor = pj.daysLeft <= 3 ? "#c24b38" : pj.daysLeft <= 7 ? "#c89360" : "var(--ink-400)";
              const dueText = pj.daysLeft <= 0 ? `${Math.abs(pj.daysLeft)}d overdue` : pj.daysLeft === 1 ? "Tomorrow" : `${pj.daysLeft}d left`;

              return (
                <div key={pj.id} className={`wh-pj${hoveredProject === pj.id ? " hovered" : ""}`}
                  onMouseEnter={() => setHoveredProject(pj.id)}
                  onMouseLeave={() => setHoveredProject(null)}>
                  <div className="wh-pj-accent" style={{ background: st.color }} />
                  <div className="wh-pj-icon" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}15` }}>
                    {pj.type === "proposal" ? "◆" : pj.type === "doc" ? "☰" : "◇"}
                  </div>
                  <div className="wh-pj-info">
                    <div className="wh-pj-name">{pj.name}</div>
                    <div className="wh-pj-row">
                      <span className="wh-pj-status" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      <span className="wh-pj-edited">{pj.lastEdited}</span>
                      <span className="wh-pj-due" style={{ color: dueColor }}>{dueText}</span>
                    </div>
                  </div>
                  <div className="wh-pj-right">
                    <span className="wh-pj-value">${pj.value.toLocaleString()}</span>
                    <div className="wh-pj-progress">
                      <div className="wh-pj-progress-fill" style={{ width: `${pj.progress}%`, background: st.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wh-section-label">
            completed
            <span className="wh-section-count">{completedProjects.length}</span>
          </div>

          <div className="wh-completed">
            {completedProjects.map(pj => (
              <div key={pj.id} className="wh-comp-item">
                <span className="wh-comp-check">✓</span>
                <span className="wh-comp-name">{pj.name}</span>
                <span className="wh-comp-val">${pj.value.toLocaleString()}</span>
                <span className="wh-comp-date">{pj.lastEdited}</span>
              </div>
            ))}
          </div>

          <div className="wh-section-label">workspace notes</div>
          <textarea className="wh-notes-input" placeholder="Quick notes about this client..."
            defaultValue="Sarah prefers async updates via email over calls. Brand voice is 'warm but authoritative.' Budget is flexible for quality work — don't underbid." />
        </div>

        {/* Sidebar */}
        <div className="wh-side">
          <div>
            <div className="wh-section-label">activity</div>
            <div className="wh-activity">
              {ACTIVITY.map(act => (
                <div key={act.id} className="wh-act">
                  <div className="wh-act-icon" style={{ background: act.color + "0a", color: act.color, border: `1px solid ${act.color}12` }}>{act.icon}</div>
                  <div className="wh-act-body">
                    <div className="wh-act-text">{act.text}</div>
                    <div className="wh-act-detail">{act.detail}</div>
                  </div>
                  <span className="wh-act-time">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="wh-section-label">upcoming</div>
            <div className="wh-upcoming">
              {UPCOMING.map((up, i) => (
                <div key={i} className="wh-up-item">
                  <div className="wh-up-bar" style={{ background: up.color }} />
                  <div className="wh-up-info">
                    <div className="wh-up-label">{up.label}</div>
                    <div className="wh-up-date">{up.date}</div>
                  </div>
                  <span className="wh-up-days" style={{ color: up.daysLeft <= 7 ? up.color : "var(--ink-400)" }}>{up.daysLeft}d</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="wh-section-label">client details</div>
            <div className="wh-client-card">
              <div className="wh-cc-row"><span className="wh-cc-label">Contact</span><span className="wh-cc-val">{WORKSPACE.contact}</span></div>
              <div className="wh-cc-row"><span className="wh-cc-label">Industry</span><span className="wh-cc-val">{WORKSPACE.industry}</span></div>
              <div className="wh-cc-row"><span className="wh-cc-label">Client since</span><span className="wh-cc-val">{WORKSPACE.since}</span></div>
              <div className="wh-cc-row"><span className="wh-cc-label">Rate</span><span className="wh-cc-val">{WORKSPACE.rate}</span></div>
              <div className="wh-cc-row"><span className="wh-cc-label">Lifetime revenue</span><span className="wh-cc-val" style={{ color: "#5a9a3c" }}>${WORKSPACE.totalEarned.toLocaleString()}</span></div>
              <div className="wh-cc-row"><span className="wh-cc-label">Projects</span><span className="wh-cc-val">{WORKSPACE.totalProjects}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Prototype Styles

```css
.wh {
  font-family: 'Outfit', sans-serif; font-size: 14px;
  color: var(--ink-700); background: var(--parchment);
  min-height: 100vh; display: flex; flex-direction: column;
}

/* Identity bar */
.wh-identity {
  padding: 28px 48px 20px; border-bottom: 1px solid var(--warm-200);
  display: flex; align-items: flex-start; gap: 20px; flex-shrink: 0;
}
.wh-avatar {
  width: 56px; height: 56px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 600; color: #fff; flex-shrink: 0;
  position: relative; overflow: hidden;
}
.wh-avatar::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  border-radius: 14px;
}
.wh-info { flex: 1; }
.wh-client-name {
  font-family: 'Cormorant Garamond', serif; font-size: 28px;
  font-weight: 600; color: var(--ink-900); line-height: 1.15;
  letter-spacing: -0.01em;
}
.wh-client-meta {
  display: flex; align-items: center; gap: 8px; margin-top: 4px;
  font-family: var(--mono); font-size: 11px; color: var(--ink-400); flex-wrap: wrap;
}
.wh-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--warm-300); }

.wh-quick-actions { display: flex; gap: 5px; flex-shrink: 0; padding-top: 4px; }
.wh-qa {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 6px; font-size: 12.5px;
  border: 1px solid var(--warm-200); background: #fff;
  cursor: pointer; font-family: inherit; color: var(--ink-600); transition: all 0.08s;
}
.wh-qa:hover { background: var(--warm-50); border-color: var(--warm-300); }
.wh-qa-icon { font-family: var(--mono); font-size: 13px; }
.wh-qa-shortcut { font-family: var(--mono); font-size: 9px; color: var(--ink-300); background: var(--warm-100); padding: 1px 4px; border-radius: 2px; }
.wh-qa.primary { background: var(--ember); border-color: var(--ember); color: #fff; }
.wh-qa.primary:hover { background: var(--ember-light); }
.wh-qa.primary .wh-qa-shortcut { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); }

/* Stats row */
.wh-stats {
  grid-column: 1 / -1; display: flex; gap: 0;
  border-bottom: 1px solid var(--warm-200);
}
.wh-stat {
  flex: 1; padding: 18px 24px;
  border-right: 1px solid var(--warm-100);
  cursor: default; transition: background 0.06s;
}
.wh-stat:last-child { border-right: none; }
.wh-stat:hover { background: var(--warm-50); }
.wh-stat-val {
  font-family: 'Cormorant Garamond', serif; font-size: 28px;
  font-weight: 600; color: var(--ink-900); line-height: 1;
}
.wh-stat-val.green { color: #5a9a3c; }
.wh-stat-val.ember { color: var(--ember); }
.wh-stat-label {
  font-family: var(--mono); font-size: 9px; color: var(--ink-400);
  text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;
}
.wh-stat-sub { font-family: var(--mono); font-size: 10px; color: var(--ink-300); margin-top: 2px; }
.wh-stat-bars { display: flex; gap: 2px; height: 24px; align-items: flex-end; margin-top: 8px; }
.wh-stat-bar { flex: 1; border-radius: 1.5px; transition: height 0.3s ease; min-height: 2px; }

/* Content grid */
.wh-grid {
  flex: 1; display: grid;
  grid-template-columns: 1fr 320px;
  gap: 0; overflow: hidden;
}

/* Main area */
.wh-main {
  padding: 24px 24px 24px 48px; overflow-y: auto;
  border-right: 1px solid var(--warm-100);
}
.wh-section-label {
  font-family: var(--mono); font-size: 9px; font-weight: 500;
  color: var(--ink-400); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 10px; display: flex; align-items: center; gap: 8px;
}
.wh-section-label::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }
.wh-section-count {
  font-size: 10px; color: var(--ink-300); background: var(--warm-100);
  padding: 0 6px; border-radius: 8px;
}

/* Project cards */
.wh-projects { display: flex; flex-direction: column; gap: 6px; margin-bottom: 28px; }
.wh-pj {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border: 1px solid var(--warm-200);
  border-radius: 10px; cursor: pointer; transition: all 0.12s;
  background: #fff; position: relative; overflow: hidden;
}
.wh-pj:hover { border-color: var(--warm-300); box-shadow: 0 2px 10px rgba(0,0,0,0.03); transform: translateY(-1px); }
.wh-pj.hovered { border-color: var(--ember); box-shadow: 0 2px 12px rgba(176,125,79,0.06); }
.wh-pj-accent { position: absolute; top: 0; left: 0; bottom: 0; width: 3px; border-radius: 3px 0 0 3px; }
.wh-pj-icon {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.wh-pj-info { flex: 1; min-width: 0; }
.wh-pj-name { font-size: 15px; font-weight: 500; color: var(--ink-800); }
.wh-pj-row { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.wh-pj-status {
  font-family: var(--mono); font-size: 9px; font-weight: 500;
  padding: 1px 7px; border-radius: 3px;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.wh-pj-edited { font-size: 12px; color: var(--ink-300); }
.wh-pj-due { font-family: var(--mono); font-size: 11px; }
.wh-pj-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
.wh-pj-value { font-family: var(--mono); font-size: 14px; font-weight: 500; color: var(--ink-800); }
.wh-pj-progress { width: 60px; height: 4px; background: var(--warm-200); border-radius: 2px; overflow: hidden; }
.wh-pj-progress-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

/* Completed */
.wh-completed { margin-bottom: 28px; }
.wh-comp-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 0; border-bottom: 1px solid var(--warm-100);
}
.wh-comp-item:last-child { border-bottom: none; }
.wh-comp-check { color: #5a9a3c; font-size: 13px; flex-shrink: 0; }
.wh-comp-name { font-size: 13px; color: var(--ink-500); flex: 1; }
.wh-comp-val { font-family: var(--mono); font-size: 12px; color: var(--ink-400); }
.wh-comp-date { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }

/* Sidebar */
.wh-side {
  padding: 24px 24px 24px 20px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 24px;
}

/* Activity */
.wh-activity { display: flex; flex-direction: column; }
.wh-act {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px 8px; border-bottom: 1px solid var(--warm-100);
  transition: background 0.06s; border-radius: 4px;
}
.wh-act:last-child { border-bottom: none; }
.wh-act:hover { background: var(--warm-50); }
.wh-act-icon {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; flex-shrink: 0; margin-top: 1px;
}
.wh-act-body { flex: 1; min-width: 0; }
.wh-act-text { font-size: 12.5px; color: var(--ink-700); line-height: 1.4; }
.wh-act-detail { font-size: 11px; color: var(--ink-400); margin-top: 1px; }
.wh-act-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); flex-shrink: 0; margin-top: 2px; }

/* Upcoming */
.wh-upcoming { display: flex; flex-direction: column; gap: 6px; }
.wh-up-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px;
  border: 1px solid var(--warm-100); transition: border-color 0.08s;
}
.wh-up-item:hover { border-color: var(--warm-200); }
.wh-up-bar { width: 3px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
.wh-up-info { flex: 1; }
.wh-up-label { font-size: 12.5px; color: var(--ink-700); }
.wh-up-date { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
.wh-up-days { font-family: var(--mono); font-size: 11px; font-weight: 500; flex-shrink: 0; }

/* Client card */
.wh-client-card {
  border: 1px solid var(--warm-200); border-radius: 10px;
  padding: 14px 16px; background: var(--warm-50);
}
.wh-cc-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
.wh-cc-label { font-size: 12px; color: var(--ink-400); }
.wh-cc-val { font-family: var(--mono); font-size: 12px; color: var(--ink-700); font-weight: 500; }

/* Notes */
.wh-notes-input {
  width: 100%; padding: 10px 12px; border: 1px solid var(--warm-200);
  border-radius: 8px; font-family: inherit; font-size: 13px;
  color: var(--ink-700); outline: none; resize: none;
  background: #fff; min-height: 64px; line-height: 1.5;
}
.wh-notes-input:focus { border-color: var(--ember); box-shadow: 0 0 0 2px rgba(176,125,79,0.06); }
.wh-notes-input::placeholder { color: var(--warm-400); }
```
