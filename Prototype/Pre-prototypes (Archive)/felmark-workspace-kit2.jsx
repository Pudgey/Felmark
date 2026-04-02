import { useState, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — UI KIT #2
   Components 6–10. Drop anywhere.
   ═══════════════════════════════════════════ */


// ═══════════════════════════════════════════
// 6. FILE DROP ZONE
// ═══════════════════════════════════════════
function FileDropZone() {
  const [files, setFiles] = useState([
    { name: "Brand_Guidelines_v2_Draft.pdf", size: "4.2 MB", date: "Mar 29", type: "pdf", by: "You" },
    { name: "Logo_Concepts_B.fig", size: "12 MB", date: "Mar 25", type: "fig", by: "You" },
    { name: "Color_Palette_Final.png", size: "340 KB", date: "Mar 22", type: "img", by: "You" },
    { name: "Feedback_Notes.docx", size: "89 KB", date: "Mar 28", type: "doc", by: "Sarah" },
  ]);
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // list | grid
  const [preview, setPreview] = useState(null);

  const typeColors = { pdf: "#c24b38", fig: "#7c6b9e", img: "#5a9a3c", doc: "#5b7fa4", zip: "#8a7e63", xls: "#16a34a" };
  const typeIcons = { pdf: "PDF", fig: "FIG", img: "IMG", doc: "DOC", zip: "ZIP", xls: "XLS" };

  const addFile = () => {
    setFiles(prev => [{ name: `Screenshot_${Date.now()}.png`, size: "1.2 MB", date: "Just now", type: "img", by: "You", isNew: true }, ...prev]);
    setDragOver(false);
  };

  return (
    <div className="fd-zone">
      {/* Header */}
      <div className="fd-head">
        <div className="fd-head-left">
          <span className="fd-head-title">Files</span>
          <span className="fd-head-count">{files.length}</span>
        </div>
        <div className="fd-head-right">
          <button className={`fd-view-btn${viewMode === "list" ? " on" : ""}`} onClick={() => setViewMode("list")}>☰</button>
          <button className={`fd-view-btn${viewMode === "grid" ? " on" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
          <button className="fd-upload-btn">↑ Upload</button>
        </div>
      </div>

      {/* Drop area */}
      <div className={`fd-drop${dragOver ? " over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); addFile(); }}>

        {dragOver ? (
          <div className="fd-drop-active">
            <div className="fd-drop-icon">↓</div>
            <div className="fd-drop-text">Drop files here</div>
          </div>
        ) : (
          <>
            {/* List view */}
            {viewMode === "list" && (
              <div className="fd-list">
                {files.map((f, i) => (
                  <div key={i} className={`fd-file${f.isNew ? " new" : ""}`}
                    onClick={() => setPreview(preview === i ? null : i)}>
                    <div className="fd-file-icon" style={{ background: (typeColors[f.type] || "#9b988f") + "08", color: typeColors[f.type] || "#9b988f", borderColor: (typeColors[f.type] || "#9b988f") + "15" }}>
                      {typeIcons[f.type] || "—"}
                    </div>
                    <div className="fd-file-info">
                      <div className="fd-file-name">{f.name}</div>
                      <div className="fd-file-meta">{f.size} · {f.date} · {f.by}</div>
                    </div>
                    {f.isNew && <span className="fd-file-new">New</span>}
                    <div className="fd-file-actions">
                      <button className="fd-file-btn" title="Share">↗</button>
                      <button className="fd-file-btn" title="Download">↓</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Grid view */}
            {viewMode === "grid" && (
              <div className="fd-grid">
                {files.map((f, i) => (
                  <div key={i} className={`fd-grid-item${f.isNew ? " new" : ""}`}>
                    <div className="fd-grid-thumb" style={{ background: (typeColors[f.type] || "#9b988f") + "06" }}>
                      <span style={{ color: typeColors[f.type] || "#9b988f", fontSize: 16, fontWeight: 600, fontFamily: "var(--mono)" }}>{typeIcons[f.type]}</span>
                    </div>
                    <div className="fd-grid-name">{f.name}</div>
                    <div className="fd-grid-meta">{f.size}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Drop hint */}
            <div className="fd-drop-hint">
              <span>Drop files here or</span>
              <button className="fd-drop-browse" onClick={addFile}>browse</button>
            </div>
          </>
        )}
      </div>

      {/* Shared with client indicator */}
      <div className="fd-shared">
        <div className="fd-shared-dot" />
        <span>Files are shared with Meridian Studio via portal</span>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 7. MILESTONE PROGRESS BAR
// ═══════════════════════════════════════════
function MilestoneBar() {
  const [hovered, setHovered] = useState(null);

  const milestones = [
    { id: "m1", label: "Discovery", status: "done", tasks: "3/3", date: "Mar 20" },
    { id: "m2", label: "Concepts", status: "done", tasks: "4/4", date: "Mar 25" },
    { id: "m3", label: "System", status: "active", tasks: "2/4", date: "Apr 2" },
    { id: "m4", label: "Guidelines", status: "pending", tasks: "0/6", date: "Apr 5" },
    { id: "m5", label: "Templates", status: "pending", tasks: "0/4", date: "Apr 10" },
    { id: "m6", label: "Delivery", status: "pending", tasks: "—", date: "Apr 12" },
  ];

  const doneCount = milestones.filter(m => m.status === "done").length;
  const pct = (doneCount / milestones.length) * 100;

  const statusColor = (s) => s === "done" ? "#5a9a3c" : s === "active" ? "var(--ember)" : "var(--warm-300)";

  return (
    <div className="ms-bar">
      {/* Header */}
      <div className="ms-head">
        <span className="ms-head-title">Milestones</span>
        <span className="ms-head-progress">{doneCount}/{milestones.length} complete</span>
      </div>

      {/* Visual bar */}
      <div className="ms-track">
        <div className="ms-track-fill" style={{ width: `${pct + (100 / milestones.length) * 0.5}%` }} />
        <div className="ms-nodes">
          {milestones.map((m, i) => (
            <div key={m.id} className={`ms-node ${m.status}`}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}>
              <div className="ms-node-dot" style={{ background: statusColor(m.status), borderColor: m.status === "pending" ? "var(--warm-300)" : statusColor(m.status) }}>
                {m.status === "done" ? "✓" : m.status === "active" ? "●" : ""}
              </div>
              <div className="ms-node-label">{m.label}</div>

              {/* Tooltip */}
              {hovered === m.id && (
                <div className="ms-tooltip">
                  <div className="ms-tooltip-title">{m.label}</div>
                  <div className="ms-tooltip-row"><span>Tasks</span><span>{m.tasks}</span></div>
                  <div className="ms-tooltip-row"><span>Due</span><span>{m.date}</span></div>
                  <div className="ms-tooltip-status" style={{ color: statusColor(m.status) }}>
                    {m.status === "done" ? "✓ Complete" : m.status === "active" ? "● In progress" : "○ Upcoming"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="ms-dates">
        <span>{milestones[0].date}</span>
        <span>{milestones[milestones.length - 1].date}</span>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 8. SMART AUTOMATIONS STRIP
// ═══════════════════════════════════════════
function AutomationsStrip() {
  const [dismissed, setDismissed] = useState(new Set());

  const automations = [
    { id: "a1", status: "completed", icon: "✓", color: "#5a9a3c", title: "Milestone update sent", detail: "Sarah received \"Concepts phase complete\" email", time: "3h ago", trigger: "When all Concepts tasks → done" },
    { id: "a2", status: "ready", icon: "$", color: "var(--ember)", title: "Invoice auto-drafted", detail: "INV-049 · $2,400 · Milestone: System phase (50%)", time: "Ready", trigger: "When project reaches 50%" },
    { id: "a3", status: "scheduled", icon: "◇", color: "#5b7fa4", title: "Review reminder queued", detail: "Sarah will be reminded to review Color Palette in 2 days", time: "Apr 4", trigger: "3 days after deliverable submitted" },
    { id: "a4", status: "completed", icon: "✉", color: "#5a9a3c", title: "Welcome email sent", detail: "Onboarding packet delivered to sarah@meridian.co", time: "2w ago", trigger: "When contract signed" },
  ];

  const visible = automations.filter(a => !dismissed.has(a.id));

  return (
    <div className="au-strip">
      <div className="au-head">
        <div className="au-head-left">
          <span className="au-head-icon">⚡</span>
          <span className="au-head-title">Automations</span>
          <span className="au-head-count">{visible.length}</span>
        </div>
        <button className="au-head-btn">+ Add Rule</button>
      </div>

      <div className="au-list">
        {visible.map(a => (
          <div key={a.id} className={`au-item ${a.status}`}>
            <div className="au-item-icon" style={{ color: a.color, background: a.color + "08", borderColor: a.color + "12" }}>
              {a.icon}
            </div>
            <div className="au-item-body">
              <div className="au-item-title">{a.title}</div>
              <div className="au-item-detail">{a.detail}</div>
              <div className="au-item-trigger">
                <span className="au-item-trigger-label">Trigger:</span> {a.trigger}
              </div>
            </div>
            <div className="au-item-right">
              <div className={`au-item-status ${a.status}`}>
                {a.status === "completed" ? "✓ Done" : a.status === "ready" ? "● Ready" : "◎ Scheduled"}
              </div>
              <div className="au-item-time">{a.time}</div>
            </div>
            <button className="au-item-dismiss" onClick={() => setDismissed(prev => new Set([...prev, a.id]))}>✕</button>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="au-empty">
          <span>All caught up — no pending automations</span>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════
// 9. AI WHISPER BAR
// ═══════════════════════════════════════════
function AIWhisper() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(new Set());
  const [actioned, setActioned] = useState(new Set());

  const whispers = [
    { id: "w1", text: "Sarah hasn't responded to the color palette review in 2 days", action: "Send Nudge", actionColor: "var(--ember)", urgency: "medium" },
    { id: "w2", text: "You've logged 14h on Logo Concepts (budget: 12h) — consider adjusting the estimate", action: "Adjust", actionColor: "#5b7fa4", urgency: "low" },
    { id: "w3", text: "Bolt Fitness invoice is 4 days overdue — collection difficulty rises 3× after 7 days", action: "Send Reminder", actionColor: "#c24b38", urgency: "high" },
    { id: "w4", text: "Luna Boutique inquired 2 hours ago — leads go cold after 24h", action: "Draft Proposal", actionColor: "#5a9a3c", urgency: "medium" },
    { id: "w5", text: "Your effective rate dropped to $108/hr this week — Bolt Fitness project is the main drag", action: "View Analysis", actionColor: "#5b7fa4", urgency: "low" },
  ];

  const visible = whispers.filter(w => !dismissed.has(w.id) && !actioned.has(w.id));
  if (visible.length === 0) return null;

  const w = visible[0];
  const urgencyDot = w.urgency === "high" ? "#c24b38" : w.urgency === "medium" ? "var(--ember)" : "#5b7fa4";

  return (
    <div className={`aw-bar ${w.urgency}`}>
      <div className="aw-left">
        <span className="aw-badge">✦</span>
        <span className="aw-dot" style={{ background: urgencyDot }} />
        <span className="aw-text">{w.text}</span>
      </div>
      <div className="aw-right">
        <button className="aw-action" style={{ color: w.actionColor, borderColor: w.actionColor + "20", background: w.actionColor + "06" }}
          onClick={() => setActioned(prev => new Set([...prev, w.id]))}>
          {w.action}
        </button>
        <button className="aw-dismiss" onClick={() => setDismissed(prev => new Set([...prev, w.id]))}>✕</button>
        {visible.length > 1 && (
          <span className="aw-more">{visible.length - 1} more</span>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 10. CALENDAR SIDEBAR
// ═══════════════════════════════════════════
function CalendarSidebar() {
  const [selectedDay, setSelectedDay] = useState(1); // index in week

  const week = [
    { day: "Mon", date: "Mar 31", today: true, items: [
      { time: "9:00", text: "Reply to Meridian feedback", type: "task", color: "#d97706" },
      { time: "11:00", text: "Call with Nora Kim", type: "meeting", color: "#5b7fa4", duration: "30m" },
      { time: "2:00", text: "Color palette due", type: "deadline", color: "var(--ember)" },
    ]},
    { day: "Tue", date: "Apr 1", items: [
      { time: "—", text: "Client review & revisions", type: "deadline", color: "#c24b38", urgent: true },
      { time: "3:00", text: "Blog draft — Bolt Fitness", type: "task", color: "#d97706" },
    ]},
    { day: "Wed", date: "Apr 2", items: [
      { time: "10:00", text: "Meridian sync call", type: "meeting", color: "#5b7fa4", duration: "45m" },
    ]},
    { day: "Thu", date: "Apr 3", items: [
      { time: "—", text: "Meridian proposal expires", type: "deadline", color: "#c24b38", urgent: true },
    ]},
    { day: "Fri", date: "Apr 4", items: [] },
    { day: "Sat", date: "Apr 5", items: [
      { time: "—", text: "Brand guidelines doc due", type: "deadline", color: "var(--ember)" },
    ]},
    { day: "Sun", date: "Apr 6", items: [] },
  ];

  const sel = week[selectedDay];

  const typeIcon = (t) => t === "meeting" ? "◎" : t === "deadline" ? "!" : "◇";

  return (
    <div className="cs-panel">
      {/* Header */}
      <div className="cs-head">
        <span className="cs-head-title">This Week</span>
        <span className="cs-head-range">Mar 31 – Apr 6</span>
      </div>

      {/* Day selector */}
      <div className="cs-days">
        {week.map((d, i) => (
          <div key={i} className={`cs-day${selectedDay === i ? " on" : ""}${d.today ? " today" : ""}`}
            onClick={() => setSelectedDay(i)}>
            <div className="cs-day-name">{d.day}</div>
            <div className="cs-day-date">{d.date.split(" ")[1]}</div>
            {d.items.length > 0 && (
              <div className="cs-day-dots">
                {d.items.slice(0, 3).map((item, j) => (
                  <div key={j} className="cs-day-dot" style={{ background: item.color }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Day detail */}
      <div className="cs-detail">
        <div className="cs-detail-head">
          <span className="cs-detail-day">{sel.day}, {sel.date}</span>
          <span className="cs-detail-count">{sel.items.length} item{sel.items.length !== 1 ? "s" : ""}</span>
        </div>

        {sel.items.length > 0 ? (
          <div className="cs-items">
            {sel.items.map((item, i) => (
              <div key={i} className={`cs-item${item.urgent ? " urgent" : ""}`}>
                <div className="cs-item-time">{item.time}</div>
                <div className="cs-item-bar" style={{ background: item.color }} />
                <div className="cs-item-body">
                  <div className="cs-item-text">{item.text}</div>
                  <div className="cs-item-meta">
                    <span className="cs-item-type">{typeIcon(item.type)} {item.type}</span>
                    {item.duration && <span className="cs-item-dur">{item.duration}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cs-empty">
            <div className="cs-empty-text">Nothing scheduled</div>
            <button className="cs-empty-btn">+ Add event</button>
          </div>
        )}
      </div>

      {/* Quick add */}
      <div className="cs-add">
        <button className="cs-add-btn">+ Add to {sel.day}</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// SHOWCASE
// ═══════════════════════════════════════════
export default function UIKit2() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.kit{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:32px 24px 80px}
.kit-in{max-width:880px;margin:0 auto}
.kit-section{margin-bottom:40px}
.kit-label{font-family:var(--mono);font-size:10px;color:var(--ember);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.kit-label::after{content:'';flex:1;height:1px;background:var(--warm-200)}
.kit-desc{font-size:13px;color:var(--ink-400);margin-bottom:12px;line-height:1.5}
.kit-preview{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden}
.kit-preview-dark{background:#e8e5de}

/* ═══ 6. FILE DROP ═══ */
.fd-zone{border-radius:10px;overflow:hidden}
.fd-head{padding:10px 14px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.fd-head-left{display:flex;align-items:center;gap:6px}
.fd-head-title{font-size:13px;font-weight:500;color:var(--ink-800)}
.fd-head-count{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 6px;border-radius:8px}
.fd-head-right{display:flex;gap:3px}
.fd-view-btn{width:24px;height:24px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.fd-view-btn:hover{background:var(--warm-50)}
.fd-view-btn.on{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.fd-upload-btn{padding:4px 10px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-500);cursor:pointer}
.fd-upload-btn:hover{background:var(--warm-50)}

.fd-drop{padding:6px;min-height:120px;transition:all .15s}
.fd-drop.over{background:var(--ember-bg);border:2px dashed var(--ember);border-radius:8px;margin:6px}
.fd-drop-active{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;gap:6px}
.fd-drop-icon{font-size:24px;color:var(--ember)}
.fd-drop-text{font-size:13px;color:var(--ember);font-weight:500}

.fd-list{display:flex;flex-direction:column;gap:1px}
.fd-file{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:6px;cursor:pointer;transition:all .06s}
.fd-file:hover{background:var(--warm-50)}
.fd-file.new{animation:fdNew .3s ease}
@keyframes fdNew{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.fd-file-icon{width:28px;height:28px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;font-weight:600;flex-shrink:0;border:1px solid}
.fd-file-info{flex:1;min-width:0}
.fd-file-name{font-size:12px;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fd-file-meta{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.fd-file-new{font-family:var(--mono);font-size:8px;color:var(--ember);background:var(--ember-bg);padding:1px 5px;border-radius:3px;border:1px solid rgba(176,125,79,0.06);flex-shrink:0}
.fd-file-actions{display:flex;gap:2px;opacity:0;transition:opacity .08s}
.fd-file:hover .fd-file-actions{opacity:1}
.fd-file-btn{width:22px;height:22px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.fd-file-btn:hover{background:var(--warm-100);color:var(--ink-600)}

.fd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:4px}
.fd-grid-item{border:1px solid var(--warm-200);border-radius:6px;overflow:hidden;cursor:pointer;transition:all .08s}
.fd-grid-item:hover{border-color:var(--warm-300);box-shadow:0 2px 6px rgba(0,0,0,0.02)}
.fd-grid-thumb{height:56px;display:flex;align-items:center;justify-content:center}
.fd-grid-name{font-size:10px;color:var(--ink-600);padding:4px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fd-grid-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300);padding:0 6px 4px}

.fd-drop-hint{padding:8px;text-align:center;font-size:11px;color:var(--ink-300);border-top:1px dashed var(--warm-200);margin-top:4px}
.fd-drop-browse{background:none;border:none;color:var(--ember);cursor:pointer;font-family:inherit;font-size:11px;text-decoration:underline}

.fd-shared{padding:6px 14px;border-top:1px solid var(--warm-100);display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.fd-shared-dot{width:4px;height:4px;border-radius:50%;background:#5a9a3c}

/* ═══ 7. MILESTONE BAR ═══ */
.ms-bar{padding:0}
.ms-head{display:flex;justify-content:space-between;padding:10px 14px;border-bottom:1px solid var(--warm-100)}
.ms-head-title{font-size:13px;font-weight:500;color:var(--ink-800)}
.ms-head-progress{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

.ms-track{padding:20px 14px 8px;position:relative}
.ms-track-fill{position:absolute;top:29px;left:14px;height:3px;background:var(--ember);border-radius:2px;transition:width .4s ease;z-index:0}
.ms-nodes{display:flex;justify-content:space-between;position:relative;z-index:1}
.ms-node{display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;cursor:default;flex:1}
.ms-node-dot{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;border:2px solid;transition:all .15s;background:#fff}
.ms-node.done .ms-node-dot{background:#5a9a3c;border-color:#5a9a3c}
.ms-node.active .ms-node-dot{background:var(--ember);border-color:var(--ember);box-shadow:0 0 0 4px var(--ember-bg)}
.ms-node.pending .ms-node-dot{background:#fff;border-color:var(--warm-300);color:transparent}
.ms-node-label{font-family:var(--mono);font-size:9px;color:var(--ink-400);text-align:center}
.ms-node.active .ms-node-label{color:var(--ember);font-weight:500}
.ms-node.done .ms-node-label{color:var(--ink-300)}

.ms-tooltip{position:absolute;top:-70px;left:50%;transform:translateX(-50%);background:var(--ink-900);color:#fff;padding:8px 10px;border-radius:6px;font-size:10px;min-width:120px;z-index:10;animation:ttIn .1s ease}
@keyframes ttIn{from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
.ms-tooltip-title{font-weight:500;margin-bottom:4px;font-size:11px}
.ms-tooltip-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:rgba(255,255,255,0.5);padding:1px 0}
.ms-tooltip-row span:last-child{color:#fff}
.ms-tooltip-status{margin-top:4px;font-family:var(--mono);font-size:9px;font-weight:500}

.ms-dates{display:flex;justify-content:space-between;padding:0 14px 10px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ═══ 8. AUTOMATIONS ═══ */
.au-strip{}
.au-head{padding:10px 14px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.au-head-left{display:flex;align-items:center;gap:5px}
.au-head-icon{font-size:12px}
.au-head-title{font-size:13px;font-weight:500;color:var(--ink-800)}
.au-head-count{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 6px;border-radius:8px}
.au-head-btn{padding:4px 10px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-500);cursor:pointer}
.au-head-btn:hover{background:var(--warm-50)}

.au-list{padding:4px}
.au-item{display:flex;align-items:flex-start;gap:8px;padding:8px 8px;border-radius:6px;transition:background .06s;position:relative;margin-bottom:2px}
.au-item:hover{background:var(--warm-50)}
.au-item-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;border:1px solid;margin-top:1px}
.au-item-body{flex:1;min-width:0}
.au-item-title{font-size:12px;font-weight:500;color:var(--ink-700)}
.au-item-detail{font-size:11px;color:var(--ink-400);line-height:1.4;margin-top:1px}
.au-item-trigger{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:3px;display:flex;align-items:center;gap:3px}
.au-item-trigger-label{color:var(--ink-400);font-weight:500}
.au-item-right{flex-shrink:0;text-align:right}
.au-item-status{font-family:var(--mono);font-size:9px;font-weight:500}
.au-item-status.completed{color:#5a9a3c}
.au-item-status.ready{color:var(--ember)}
.au-item-status.scheduled{color:#5b7fa4}
.au-item-time{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:1px}
.au-item-dismiss{position:absolute;top:6px;right:6px;width:18px;height:18px;border-radius:3px;border:none;background:transparent;color:var(--ink-300);cursor:pointer;font-size:9px;opacity:0;display:flex;align-items:center;justify-content:center;transition:opacity .06s}
.au-item:hover .au-item-dismiss{opacity:1}
.au-item-dismiss:hover{background:var(--warm-200);color:var(--ink-600)}
.au-empty{padding:16px;text-align:center;font-size:12px;color:var(--ink-300)}

/* ═══ 9. AI WHISPER ═══ */
.aw-bar{display:flex;align-items:center;justify-content:space-between;padding:7px 12px;border-radius:8px;border:1px solid var(--warm-200);background:#fff;gap:10px;transition:all .15s}
.aw-bar.high{border-color:rgba(194,75,56,0.1);background:rgba(194,75,56,0.01)}
.aw-bar.medium{border-color:rgba(176,125,79,0.08);background:var(--ember-bg)}
.aw-bar.low{border-color:rgba(91,127,164,0.08);background:rgba(91,127,164,0.01)}
.aw-left{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
.aw-badge{font-family:var(--mono);font-size:9px;font-weight:600;color:var(--ember);flex-shrink:0}
.aw-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.aw-text{font-size:12px;color:var(--ink-600);line-height:1.4}
.aw-right{display:flex;align-items:center;gap:4px;flex-shrink:0}
.aw-action{padding:4px 10px;border-radius:4px;border:1px solid;font-size:10px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .08s;background:#fff}
.aw-action:hover{transform:translateY(-1px)}
.aw-dismiss{width:20px;height:20px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px}
.aw-dismiss:hover{background:var(--warm-100)}
.aw-more{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ═══ 10. CALENDAR ═══ */
.cs-panel{width:280px;border-radius:10px;overflow:hidden}
.cs-head{padding:10px 14px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.cs-head-title{font-size:13px;font-weight:500;color:var(--ink-800)}
.cs-head-range{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

.cs-days{display:flex;gap:1px;padding:6px 6px 0;border-bottom:1px solid var(--warm-100)}
.cs-day{flex:1;padding:6px 2px 8px;text-align:center;cursor:pointer;border-radius:5px 5px 0 0;transition:all .06s;position:relative}
.cs-day:hover{background:var(--warm-50)}
.cs-day.on{background:var(--ember-bg)}
.cs-day.today::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:16px;height:2px;background:var(--ember);border-radius:1px}
.cs-day-name{font-family:var(--mono);font-size:9px;color:var(--ink-400);font-weight:500}
.cs-day.on .cs-day-name{color:var(--ember)}
.cs-day-date{font-size:13px;font-weight:500;color:var(--ink-700);line-height:1.3}
.cs-day.on .cs-day-date{color:var(--ink-900)}
.cs-day-dots{display:flex;gap:2px;justify-content:center;margin-top:3px}
.cs-day-dot{width:4px;height:4px;border-radius:50%}

.cs-detail{padding:8px 10px;min-height:120px}
.cs-detail-head{display:flex;justify-content:space-between;padding:4px 4px 6px;margin-bottom:4px}
.cs-detail-day{font-size:13px;font-weight:500;color:var(--ink-800)}
.cs-detail-count{font-family:var(--mono);font-size:9px;color:var(--ink-300)}

.cs-items{display:flex;flex-direction:column;gap:3px}
.cs-item{display:flex;align-items:flex-start;gap:8px;padding:6px;border-radius:5px;transition:background .06s;cursor:default}
.cs-item:hover{background:var(--warm-50)}
.cs-item.urgent{background:rgba(194,75,56,0.02)}
.cs-item-time{font-family:var(--mono);font-size:10px;color:var(--ink-300);width:32px;flex-shrink:0;margin-top:1px}
.cs-item-bar{width:3px;align-self:stretch;border-radius:2px;flex-shrink:0;min-height:28px}
.cs-item-body{flex:1;min-width:0}
.cs-item-text{font-size:12px;color:var(--ink-700);line-height:1.3}
.cs-item-meta{display:flex;gap:6px;margin-top:2px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.cs-item-type{display:flex;align-items:center;gap:2px}
.cs-item-dur{color:var(--ink-400)}

.cs-empty{padding:20px;text-align:center}
.cs-empty-text{font-size:12px;color:var(--ink-300);margin-bottom:6px}
.cs-empty-btn{padding:4px 10px;border-radius:4px;border:1px dashed var(--warm-300);background:transparent;font-size:10px;font-family:inherit;color:var(--ink-400);cursor:pointer}
.cs-empty-btn:hover{border-color:var(--ember);color:var(--ember)}

.cs-add{padding:6px 10px;border-top:1px solid var(--warm-100)}
.cs-add-btn{width:100%;padding:6px;border-radius:5px;border:1px dashed var(--warm-300);background:transparent;font-size:11px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .06s}
.cs-add-btn:hover{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
      `}</style>

      <div className="kit"><div className="kit-in">
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ember)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>UI Kit #2</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 600, color: "var(--ink-900)", marginBottom: 4 }}>Workspace Components</div>
        <div style={{ fontSize: 14, color: "var(--ink-400)", marginBottom: 32 }}>5 more components that make the Workspace self-sufficient. Kit #2 of 3.</div>

        {/* 6. Files */}
        <div className="kit-section">
          <div className="kit-label">6 · File Drop Zone</div>
          <div className="kit-desc">Drag files onto the zone. Toggle list/grid view. Each file shows type badge, name, size, upload date, and who uploaded. Hover for share/download actions. Shared with client portal automatically.</div>
          <div className="kit-preview"><FileDropZone /></div>
        </div>

        {/* 7. Milestones */}
        <div className="kit-section">
          <div className="kit-label">7 · Milestone Progress Bar</div>
          <div className="kit-desc">Horizontal milestone track. Green = done. Ember = active (with glow ring). Grey = pending. Hover any node for a tooltip with tasks and due date. Sits above the task list to answer "where are we?"</div>
          <div className="kit-preview"><MilestoneBar /></div>
        </div>

        {/* 8. Automations */}
        <div className="kit-section">
          <div className="kit-label">8 · Smart Automations Strip</div>
          <div className="kit-desc">Shows triggered and pending automations. "Milestone update sent ✓" / "Invoice auto-drafted ● Ready". Each shows the trigger rule. Dismiss with ✕. Click + Add Rule to create new automations.</div>
          <div className="kit-preview"><AutomationsStrip /></div>
        </div>

        {/* 9. AI Whisper */}
        <div className="kit-section">
          <div className="kit-label">9 · AI Whisper Bar</div>
          <div className="kit-desc">One sentence. One button. One insight at a time. Click the action to handle it. Click ✕ to dismiss and the next whisper appears. Color-coded by urgency: red (high), ember (medium), blue (low). Shows "X more" when queued.</div>
          <div className="kit-preview" style={{ padding: 16 }}><AIWhisper /></div>
        </div>

        {/* 10. Calendar */}
        <div className="kit-section">
          <div className="kit-label">10 · Calendar Sidebar</div>
          <div className="kit-desc">Week strip at the top — click any day to see its schedule. Colored dots show how busy each day is. Detail view shows time, colored sidebar, event name, type icon, and duration. Today gets an ember underline. Empty days show "+ Add event".</div>
          <div className="kit-preview kit-preview-dark" style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <CalendarSidebar />
          </div>
        </div>

      </div></div>
    </>
  );
}
