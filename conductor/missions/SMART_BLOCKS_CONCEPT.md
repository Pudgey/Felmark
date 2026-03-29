# Smart Blocks — Living Data Inside Documents

**Created**: 2026-03-29
**Type**: Concept / Pre-Mission
**Milestone**: M1 (basic 3) → M2 (data-connected) → M3 (client portal read-only)

---

## Concept

Smart blocks are live, inline data widgets that breathe inside documents. Revenue counters, countdown timers, status badges, progress rings, client messages, approval trackers — all embedded directly in the freelancer's working document. Type `{` to insert (or via `/` slash menu under "Smart Blocks" section).

Freelancers currently context-switch between their docs, time tracker, invoicing tool, and client messages. Smart blocks eliminate that by surfacing live data where they're already working.

---

## Block Types

| Block | What It Shows | Data Source | Phase |
|-------|--------------|-------------|-------|
| **Status** | Project status badge (Active, Review, Paused, etc.) | Project model | M1 |
| **Deadline** | Live countdown (days, hours, minutes) | Project `due` field | M1 |
| **Progress** | Animated completion ring | Manual or task completion % | M1 |
| **Revenue** | Invoiced / total with progress bar | Project `amount` field | M2 |
| **Timer** | Tracked hours + cost at rate | Time tracking system | M2 |
| **Client Message** | Latest client reply, inline | Messaging system | M2 |
| **Approval** | Sign-off tracker (approved/pending dots) | Collaboration system | M3 |
| **Link Preview** | Rich embed with favicon + title | URL metadata | M2 |
| **Live Date** | Current date/time, ticking | System clock | M1 |

---

## How It Works

**Insert**: Type `{` in any block to open the smart block picker, or use `/` slash menu → "Smart Blocks" section. Type to fuzzy-filter. Enter to insert.

**Display**: Smart blocks render inline within text — they sit alongside regular text in a paragraph, callout, or list item. They're styled as subtle pill-shaped elements with monospace values.

**Configure**: Click a smart block to open an edit popover (change deadline date, adjust budget, pick different status, etc.).

**Export**: When exporting to Markdown/plain text, smart blocks degrade to static text:
- `{revenue}` → `$2,400 / $4,800 (50% invoiced)`
- `{deadline}` → `5 days remaining (Apr 3)`
- `{status}` → `[Active]`

---

## Integration Points

### Data Model Addition

```typescript
// Addition to types.ts BlockType union:
// | "smart"

// Smart block stored in Block:
interface Block {
  id: string;
  type: BlockType; // includes "smart"
  content: string;
  checked: boolean;
  smartType?: string;    // "revenue" | "deadline" | "status" | etc.
  smartProps?: Record<string, unknown>; // block-specific config
}
```

### Slash Menu Section

Smart blocks appear as a section in the existing `/` slash menu — no separate `{` trigger needed (reduces learning curve, unified entry point).

```
/                          ← triggers menu
┌─────────────────────────┐
│ smart blocks             │  ← new section
│  $ Revenue               │
│  ⏱ Deadline              │
│  ● Status                │
│  ◎ Progress              │
│  ⏲ Timer                 │
│                          │
│ basic                    │  ← existing
│  T  Text                 │
│  H1 Heading 1            │
│  ...                     │
└─────────────────────────┘
```

---

## Implementation Phases

### Phase 1 (M1) — Static Smart Blocks
- Status, Deadline, Progress, Live Date
- These need zero external data — props are set on insertion
- Section in slash menu
- Click-to-edit popover for reconfiguring
- Static text export fallback

### Phase 2 (M2) — Data-Connected Blocks
- Revenue, Timer, Client Message, Link Preview
- Pull from Supabase project/workspace data
- Auto-populate from active workspace context
- Timer persists to database (not component state)

### Phase 3 (M3) — Collaborative
- Approval block with multi-user sign-off
- Read-only rendering for client portal
- Smart blocks in shared documents

---

## Review Findings (Pre-Integration)

### Must Fix
- Animated counters (Revenue, Progress) re-run from 0 on every mount — should only animate on first appearance or value change
- `requestAnimationFrame` cleanup uses `let frame` — use a ref to avoid stale reference
- Timer display shows `{h}h {s}s` with no minutes — should be `{h}h {m}m {s}s` or `{h}:{mm}:{ss}`
- Block picker has keyboard selection state but no `onKeyDown` handler — arrow keys don't work
- Inline styles need CSS modules conversion before integration
- Duplicate `:root` vars and `<link>` font imports — inherit from layout.tsx

### Should Fix
- Timer state is local component state — resets on navigation. Needs persistent store.
- Block picker position is hardcoded `bottom: calc(100% + 8px)` — will clip at viewport top. Needs position awareness like existing SlashMenu.
- No click-to-edit for reconfiguring block props after insertion.

### Design Decision
- Recommend unified `/` slash menu entry (not separate `{` trigger) to reduce learning curve
- Smart blocks should be a section within the existing slash menu

---

## What Makes This Different

1. **Inline, not sidebar** — data lives in the document, not in a panel you have to open
2. **Context-aware** — blocks auto-populate from the active workspace (client name, budget, deadline)
3. **Freelancer-shaped** — revenue tracking, client messages, approval workflows — not generic "embed" widgets
4. **Degrades gracefully** — exports to clean static text, renders read-only in client portal

---

## Prototype Code

The following is the complete standalone prototype. It uses inline styles and hardcoded data — both need conversion before integration (CSS modules + data layer).

### Smart Block Components

```jsx
import { useState, useEffect, useRef } from "react";

function RevenueBlock({ value = 2400, total = 4800, label = "invoiced" }) {
  const [current, setCurrent] = useState(0);
  const pct = Math.round((value / total) * 100);

  useEffect(() => {
    let frame;
    const start = Date.now();
    const duration = 1200;
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className="sb sb-revenue">
      <span className="sb-icon" style={{ color: "#5a9a3c" }}>$</span>
      <span className="sb-revenue-val">${current.toLocaleString()}</span>
      <span className="sb-revenue-sep">/</span>
      <span className="sb-revenue-total">${total.toLocaleString()}</span>
      <span className="sb-revenue-bar">
        <span className="sb-revenue-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="sb-revenue-pct">{pct}%</span>
      <span className="sb-label">{label}</span>
    </span>
  );
}

function DeadlineBlock({ days = 5, date = "Apr 3" }) {
  const [countdown, setCountdown] = useState(days);
  const [hours, setHours] = useState(12);
  const [mins, setMins] = useState(30);

  useEffect(() => {
    const i = setInterval(() => {
      setMins(m => {
        if (m <= 0) { setHours(h => Math.max(0, h - 1)); return 59; }
        return m - 1;
      });
    }, 60000);
    return () => clearInterval(i);
  }, []);

  const urgent = countdown <= 3;
  const overdue = countdown < 0;
  const color = overdue ? "#c24b38" : urgent ? "#c89360" : "#b07d4f";

  return (
    <span className="sb sb-deadline" style={{ borderColor: color + "20", background: color + "06" }}>
      <span className="sb-icon" style={{ color }}>⏱</span>
      {overdue ? (
        <span className="sb-deadline-val" style={{ color }}>{Math.abs(countdown)}d overdue</span>
      ) : (
        <span className="sb-deadline-val" style={{ color }}>{countdown}d {hours}h {mins}m</span>
      )}
      <span className="sb-deadline-date">{date}</span>
      {urgent && !overdue && <span className="sb-deadline-pulse" style={{ background: color }} />}
    </span>
  );
}

function ClientMessageBlock({ client = "Sarah Chen", message = "I'll review the proposal by end of day", time = "2h ago", avatar = "S", color = "#8a7e63" }) {
  return (
    <span className="sb sb-message">
      <span className="sb-msg-avatar" style={{ background: color }}>{avatar}</span>
      <span className="sb-msg-body">
        <span className="sb-msg-author">{client}</span>
        <span className="sb-msg-text">"{message}"</span>
      </span>
      <span className="sb-msg-time">{time}</span>
    </span>
  );
}

function StatusBlock({ status = "active", label = "Brand Guidelines v2" }) {
  const statusConfig = {
    active: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", icon: "●", text: "Active" },
    review: { color: "#b07d4f", bg: "rgba(176,125,79,0.06)", icon: "◎", text: "In Review" },
    overdue: { color: "#c24b38", bg: "rgba(194,75,56,0.06)", icon: "!", text: "Overdue" },
    completed: { color: "#7c8594", bg: "rgba(124,133,148,0.06)", icon: "✓", text: "Completed" },
    paused: { color: "#9b988f", bg: "rgba(155,152,143,0.06)", icon: "❚❚", text: "Paused" },
    sent: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", icon: "↗", text: "Sent" },
  };
  const cfg = statusConfig[status] || statusConfig.active;

  return (
    <span className="sb sb-status" style={{ borderColor: cfg.color + "15", background: cfg.bg }}>
      <span className="sb-status-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
      <span className="sb-status-text" style={{ color: cfg.color }}>{cfg.text}</span>
    </span>
  );
}

function ProgressBlock({ value = 65, label = "completion" }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame;
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 1000, 1);
      setCurrent(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const color = value >= 80 ? "#5a9a3c" : value >= 50 ? "#b07d4f" : value >= 25 ? "#c89360" : "#c24b38";

  return (
    <span className="sb sb-progress">
      <span className="sb-progress-ring">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" />
          <circle cx="10" cy="10" r="8" fill="none" stroke={color} strokeWidth="2.5"
            strokeDasharray={`${2 * Math.PI * 8}`}
            strokeDashoffset={`${2 * Math.PI * 8 * (1 - current / 100)}`}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 0.3s ease" }} />
        </svg>
      </span>
      <span className="sb-progress-val" style={{ color }}>{current}%</span>
      <span className="sb-label">{label}</span>
    </span>
  );
}

function TimerBlock({ hours = 32, rate = 95 }) {
  const [elapsed, setElapsed] = useState(hours);
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => {
      setSecs(s => {
        if (s >= 59) { setElapsed(h => h + 1); return 0; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(i);
  }, [running]);

  return (
    <span className="sb sb-timer">
      <span className="sb-icon" style={{ color: running ? "#5a9a3c" : "var(--ink-400)" }}>⏲</span>
      <span className="sb-timer-val">{elapsed}h {String(secs).padStart(2, "0")}s</span>
      <span className="sb-timer-rate">${(elapsed * rate).toLocaleString()} at ${rate}/hr</span>
      <button className={`sb-timer-toggle ${running ? "on" : ""}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRunning(!running); }}>
        {running ? "❚❚" : "▶"}
      </button>
    </span>
  );
}

function ApprovalBlock({ approvals = [{ name: "You", status: "approved" }, { name: "Sarah", status: "approved" }, { name: "Jamie", status: "pending" }] }) {
  const done = approvals.filter(a => a.status === "approved").length;
  const total = approvals.length;

  return (
    <span className="sb sb-approval">
      <span className="sb-icon" style={{ color: done === total ? "#5a9a3c" : "#b07d4f" }}>⬡</span>
      <span className="sb-approval-avatars">
        {approvals.map((a, i) => (
          <span key={i} className={`sb-approval-dot ${a.status}`} title={`${a.name}: ${a.status}`}>
            {a.status === "approved" ? "✓" : "·"}
          </span>
        ))}
      </span>
      <span className="sb-approval-text">{done}/{total} approved</span>
    </span>
  );
}

function LinkPreviewBlock({ url = "figma.com/file/abc", title = "Typography Scale", source = "Figma" }) {
  return (
    <span className="sb sb-link">
      <span className="sb-link-favicon">F</span>
      <span className="sb-link-title">{title}</span>
      <span className="sb-link-source">{source}</span>
      <span className="sb-link-arrow">↗</span>
    </span>
  );
}

function DateBlock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <span className="sb sb-date">
      <span className="sb-icon" style={{ color: "var(--ink-400)" }}>◇</span>
      <span className="sb-date-val">{days[now.getDay()]}, {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</span>
      <span className="sb-date-time">{String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")}:{String(now.getSeconds()).padStart(2,"0")}</span>
    </span>
  );
}
```

### Block Picker

```jsx
function BlockPicker({ onInsert, onClose, filter = "" }) {
  const blocks = [
    { id: "revenue", label: "Revenue", desc: "Live invoiced amount", icon: "$", color: "#5a9a3c" },
    { id: "deadline", label: "Deadline", desc: "Countdown timer", icon: "⏱", color: "#b07d4f" },
    { id: "message", label: "Last message", desc: "Client's latest reply", icon: "→", color: "#5b7fa4" },
    { id: "status", label: "Status", desc: "Project status badge", icon: "●", color: "#5a9a3c" },
    { id: "progress", label: "Progress", desc: "Completion ring", icon: "◎", color: "#b07d4f" },
    { id: "timer", label: "Timer", desc: "Tracked hours & cost", icon: "⏲", color: "#8a7e63" },
    { id: "approval", label: "Approvals", desc: "Sign-off tracker", icon: "⬡", color: "#7c8594" },
    { id: "link", label: "Link preview", desc: "Rich embed", icon: "↗", color: "#5b7fa4" },
    { id: "date", label: "Live date", desc: "Current date & time", icon: "◇", color: "#9b988f" },
  ];

  const filtered = filter
    ? blocks.filter(b => b.label.toLowerCase().includes(filter.toLowerCase()) || b.desc.toLowerCase().includes(filter.toLowerCase()))
    : blocks;

  const [idx, setIdx] = useState(0);

  return (
    <div className="bp-picker">
      <div className="bp-header">
        <span className="bp-title">Insert smart block</span>
        <span className="bp-hint">↑↓ navigate · ⏎ insert · esc close</span>
      </div>
      <div className="bp-list">
        {filtered.map((b, i) => (
          <div key={b.id} className={`bp-item${i === idx ? " on" : ""}`}
            onClick={() => onInsert(b.id)}
            onMouseEnter={() => setIdx(i)}>
            <div className="bp-icon" style={{ color: b.color, background: b.color + "0a", borderColor: b.color + "15" }}>{b.icon}</div>
            <div className="bp-info">
              <span className="bp-label">{b.label}</span>
              <span className="bp-desc">{b.desc}</span>
            </div>
            <span className="bp-syntax">{`{${b.id}}`}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "12px 14px", fontSize: 12, color: "var(--ink-300)" }}>No blocks match "{filter}"</div>
        )}
      </div>
    </div>
  );
}
```

### Showcase / Document Demo

```jsx
export default function SmartBlocksShowcase() {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFilter, setPickerFilter] = useState("");

  return (
    <div className="sbs">
      <div className="sbs-top">
        <div className="sbs-top-left">
          <div className="sbs-breadcrumb">
            <span>Meridian Studio</span>
            <span className="sbs-bc-sep">/</span>
            <span className="sbs-bc-active">Brand Guidelines v2</span>
          </div>
        </div>
        <div className="sbs-top-right">
          <button className="sbs-top-btn on">Smart Blocks</button>
          <button className="sbs-top-btn">Preview</button>
        </div>
      </div>

      <div className="sbs-editor">
        <h1 className="doc-title">Brand Guidelines v2</h1>

        <div className="doc-meta">
          <span>Meridian Studio</span>
          <span>·</span>
          <StatusBlock status="active" />
          <span>·</span>
          <ProgressBlock value={65} />
          <span>·</span>
          <DeadlineBlock days={5} date="Apr 3" />
        </div>

        <div className="doc-callout">
          <span className="doc-callout-icon">◆</span>
          <div>
            Project value: <RevenueBlock value={2400} total={4800} label="invoiced" />{" "}
            · Timer: <TimerBlock hours={32} rate={95} />
            <br />
            <span style={{ fontSize: 13, color: "var(--ink-400)" }}>
              Effective rate updates live as hours are tracked
            </span>
          </div>
        </div>

        <h2 className="doc-h2">Scope of Work</h2>

        <div className="doc-list">
          <div className="doc-li">
            <span className="doc-li-num">01</span>
            <span>Primary & secondary logo usage rules — <StatusBlock status="review" /></span>
          </div>
          <div className="doc-li">
            <span className="doc-li-num">02</span>
            <span>Color palette with hex, RGB, and CMYK values — <StatusBlock status="active" /></span>
          </div>
          <div className="doc-li">
            <span className="doc-li-num">03</span>
            <span>Typography scale & font pairings — <ProgressBlock value={80} label="typography" /></span>
          </div>
          <div className="doc-li">
            <span className="doc-li-num">04</span>
            <span>Imagery & photography direction guide — <StatusBlock status="paused" /></span>
          </div>
          <div className="doc-li">
            <span className="doc-li-num">05</span>
            <span>Social media templates — <ProgressBlock value={25} label="templates" /></span>
          </div>
        </div>

        <div className="doc-divider" />

        <h2 className="doc-h2">Latest from Client</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <ClientMessageBlock
            client="Sarah Chen"
            message="I'll review the proposal by end of day — looks great so far"
            time="2h ago" avatar="S" color="#8a7e63"
          />
          <ClientMessageBlock
            client="Sarah Chen"
            message="Can we make the logo section more specific? Exact minimum sizes would help"
            time="Yesterday" avatar="S" color="#8a7e63"
          />
        </div>

        <div className="doc-note">
          Sarah's feedback suggests adding a "don'ts" section with misuse examples.
          See reference: <LinkPreviewBlock url="figma.com/file/abc" title="Typography Scale v3" source="Figma" />
          and <LinkPreviewBlock url="drive.google.com/file/def" title="Mood Board — Final" source="Google Drive" />
        </div>

        <div className="doc-divider" />

        <h2 className="doc-h2">Approval Status</h2>

        <div className="doc-p">
          Current sign-offs: <ApprovalBlock approvals={[
            { name: "You", status: "approved" },
            { name: "Sarah Chen", status: "approved" },
            { name: "Jamie Park", status: "pending" },
          ]} />
        </div>

        <div className="doc-p" style={{ fontSize: 14, color: "var(--ink-400)" }}>
          Waiting on Jamie's review of the typography section before sending to client.
          Document created <DateBlock />
        </div>

        <div className="doc-divider" />

        <div className="doc-insert-line" onClick={() => setShowPicker(!showPicker)}>
          <span>+</span>
          <span className="doc-insert-hint">Type {"{"} to insert a smart block</span>
          {showPicker && (
            <BlockPicker
              filter={pickerFilter}
              onInsert={(id) => { setShowPicker(false); }}
              onClose={() => setShowPicker(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

### Prototype Styles (Inline — Convert to CSS Modules Before Integration)

```css
/* ═══ SMART BLOCK BASE ═══ */
.sb {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 10px; border-radius: 5px;
  border: 1px solid var(--warm-200);
  background: #fff;
  font-family: var(--mono); font-size: 12px;
  vertical-align: middle;
  cursor: default; transition: all 0.12s;
  position: relative;
  white-space: nowrap;
}
.sb:hover { border-color: var(--warm-300); box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
.sb-icon { font-size: 12px; flex-shrink: 0; }
.sb-label { font-size: 9px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em; }

/* Revenue */
.sb-revenue-val { font-weight: 600; color: #5a9a3c; font-size: 13px; }
.sb-revenue-sep { color: var(--ink-300); }
.sb-revenue-total { color: var(--ink-400); }
.sb-revenue-bar { width: 40px; height: 3px; background: var(--warm-200); border-radius: 2px; overflow: hidden; }
.sb-revenue-fill { height: 100%; background: #5a9a3c; border-radius: 2px; transition: width 1s ease; }
.sb-revenue-pct { color: var(--ink-400); font-size: 10px; }

/* Deadline */
.sb-deadline-val { font-weight: 600; font-size: 12px; }
.sb-deadline-date { color: var(--ink-300); font-size: 10px; }
.sb-deadline-pulse {
  width: 5px; height: 5px; border-radius: 50%;
  animation: sbPulse 2s ease infinite;
}
@keyframes sbPulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

/* Message */
.sb-message { gap: 8px; max-width: 100%; border-color: rgba(91,127,164,0.12); background: rgba(91,127,164,0.02); }
.sb-msg-avatar {
  width: 20px; height: 20px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 600; color: #fff; flex-shrink: 0;
}
.sb-msg-body { display: flex; flex-direction: column; min-width: 0; }
.sb-msg-author { font-size: 10px; font-weight: 500; color: var(--ink-600); }
.sb-msg-text { font-size: 11px; color: var(--ink-400); font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; font-family: 'Outfit', sans-serif; }
.sb-msg-time { font-size: 9px; color: var(--ink-300); flex-shrink: 0; }

/* Status */
.sb-status { gap: 4px; padding: 2px 8px; }
.sb-status-icon { font-size: 10px; }
.sb-status-text { font-size: 11px; font-weight: 500; }

/* Progress */
.sb-progress { gap: 5px; }
.sb-progress-ring { display: flex; flex-shrink: 0; }
.sb-progress-val { font-weight: 600; font-size: 12px; }

/* Timer */
.sb-timer { gap: 6px; }
.sb-timer-val { font-weight: 500; color: var(--ink-700); }
.sb-timer-rate { font-size: 10px; color: var(--ink-400); }
.sb-timer-toggle {
  width: 20px; height: 20px; border-radius: 4px;
  border: 1px solid var(--warm-200); background: #fff;
  cursor: pointer; font-size: 8px; color: var(--ink-400);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.08s; flex-shrink: 0;
}
.sb-timer-toggle:hover { background: var(--warm-100); }
.sb-timer-toggle.on { background: #5a9a3c; color: #fff; border-color: #5a9a3c; }

/* Approval */
.sb-approval { gap: 5px; }
.sb-approval-avatars { display: flex; gap: 2px; }
.sb-approval-dot {
  width: 18px; height: 18px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600;
}
.sb-approval-dot.approved { background: rgba(90,154,60,0.1); color: #5a9a3c; }
.sb-approval-dot.pending { background: var(--warm-100); color: var(--ink-300); }
.sb-approval-text { font-size: 10px; color: var(--ink-400); }

/* Link */
.sb-link { gap: 6px; cursor: pointer; }
.sb-link:hover { border-color: rgba(91,127,164,0.2); background: rgba(91,127,164,0.02); }
.sb-link-favicon {
  width: 18px; height: 18px; border-radius: 4px;
  background: var(--warm-100); border: 1px solid var(--warm-200);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: var(--ink-500); flex-shrink: 0;
}
.sb-link-title { font-size: 12px; color: var(--ink-700); font-weight: 500; font-family: 'Outfit', sans-serif; }
.sb-link-source { font-size: 10px; color: var(--ink-300); }
.sb-link-arrow { font-size: 10px; color: var(--ink-300); }

/* Date */
.sb-date { gap: 5px; }
.sb-date-val { font-size: 11px; color: var(--ink-600); }
.sb-date-time { font-size: 10px; color: var(--ink-300); font-variant-numeric: tabular-nums; }

/* ═══ BLOCK PICKER ═══ */
.bp-picker {
  width: 300px; background: #fff; border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04);
  overflow: hidden; position: absolute; z-index: 50;
  left: 0; bottom: calc(100% + 8px);
  animation: bpIn 0.12s ease;
}
@keyframes bpIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.bp-header {
  padding: 10px 14px; border-bottom: 1px solid var(--warm-100);
  display: flex; justify-content: space-between; align-items: center;
}
.bp-title { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.08em; }
.bp-hint { font-family: var(--mono); font-size: 9px; color: var(--ink-300); }
.bp-list { max-height: 300px; overflow-y: auto; padding: 4px; }
.bp-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 6px; cursor: pointer;
  transition: background 0.06s;
}
.bp-item:hover, .bp-item.on { background: var(--ember-bg); }
.bp-icon {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; flex-shrink: 0;
  border: 1px solid;
}
.bp-info { flex: 1; }
.bp-label { font-size: 13px; font-weight: 500; color: var(--ink-800); display: block; }
.bp-desc { font-size: 11px; color: var(--ink-400); }
.bp-syntax { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-100); padding: 1px 6px; border-radius: 3px; flex-shrink: 0; }

/* ═══ DOCUMENT STYLES ═══ */
.sbs {
  font-family: 'Outfit', sans-serif; font-size: 15px;
  color: var(--ink-700); background: var(--parchment);
  min-height: 100vh; display: flex; flex-direction: column;
}
.sbs-top {
  padding: 12px 20px; border-bottom: 1px solid var(--warm-200);
  display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
}
.sbs-top-left { display: flex; align-items: center; gap: 10px; }
.sbs-breadcrumb { font-family: var(--mono); font-size: 12px; color: var(--ink-400); display: flex; align-items: center; gap: 4px; }
.sbs-bc-sep { color: var(--warm-300); }
.sbs-bc-active { color: var(--ink-700); font-weight: 500; }
.sbs-top-right { display: flex; gap: 4px; }
.sbs-top-btn {
  padding: 5px 12px; border-radius: 5px; font-size: 11px;
  border: 1px solid var(--warm-200); background: #fff;
  font-family: var(--mono); color: var(--ink-400); cursor: pointer; transition: all 0.08s;
}
.sbs-top-btn:hover { background: var(--warm-50); }
.sbs-top-btn.on { background: var(--ink-900); color: var(--parchment); border-color: var(--ink-900); }
.sbs-editor { flex: 1; max-width: 720px; margin: 0 auto; padding: 48px 40px 120px; width: 100%; }
.doc-title {
  font-family: 'Cormorant Garamond', serif; font-size: 36px;
  font-weight: 600; color: var(--ink-900); margin-bottom: 8px;
  letter-spacing: -0.02em; line-height: 1.2;
}
.doc-meta {
  font-family: var(--mono); font-size: 11px; color: var(--ink-300);
  display: flex; align-items: center; gap: 12px; margin-bottom: 28px;
  padding-bottom: 20px; border-bottom: 1px solid var(--warm-200);
}
.doc-callout {
  background: rgba(176,125,79,0.03); border: 1px solid rgba(176,125,79,0.08);
  border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;
  display: flex; align-items: flex-start; gap: 12px;
  line-height: 1.7; font-size: 14px; color: var(--ink-600);
}
.doc-callout-icon { color: var(--ember); font-size: 16px; flex-shrink: 0; margin-top: 2px; }
.doc-h2 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--ink-900); margin: 32px 0 12px; }
.doc-p { font-size: 15px; color: var(--ink-600); line-height: 1.8; margin-bottom: 12px; }
.doc-list { margin-bottom: 16px; }
.doc-li { display: flex; align-items: flex-start; gap: 10px; padding: 4px 0; font-size: 15px; color: var(--ink-600); line-height: 1.7; }
.doc-li-num { font-family: var(--mono); font-size: 12px; color: var(--ink-300); min-width: 22px; flex-shrink: 0; padding-top: 3px; }
.doc-divider { height: 1px; background: var(--warm-200); margin: 24px 0; }
.doc-note { font-size: 13px; color: var(--ink-400); font-style: italic; padding: 10px 16px; border-left: 2px solid var(--warm-300); margin: 16px 0; line-height: 1.6; }
.doc-insert-line {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 0; margin: 8px 0; cursor: pointer;
  color: var(--warm-400); font-size: 14px; transition: color 0.08s; position: relative;
}
.doc-insert-line:hover { color: var(--ember); }
.doc-insert-hint { font-family: var(--mono); font-size: 11px; }
```
