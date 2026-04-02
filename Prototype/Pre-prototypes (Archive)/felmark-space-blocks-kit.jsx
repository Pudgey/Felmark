import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — SPACE BLOCKS UI KIT
   6 blocks. Same soft aesthetic.
   Each one drops into the dashboard grid.
   ═══════════════════════════════════════════ */

// ── 1. Pipeline Funnel ──
function PipelineBlock() {
  const stages = [
    { label: "Lead", count: 2, value: "$9,700", color: "#8b8bba", deals: [
      { name: "Luna Boutique", sub: "Brand Identity", value: "$6,500", days: 2 },
      { name: "Skyline Co", sub: "Website Redesign", value: "$3,200", days: 5 },
    ]},
    { label: "Proposal", count: 1, value: "$4,800", color: "#b07d4f", deals: [
      { name: "Meridian Studio", sub: "Brand Guidelines", value: "$4,800", days: 4, viewed: 3 },
    ]},
    { label: "Active", count: 3, value: "$10,200", color: "#6b9a6b", deals: [
      { name: "Nora Kim", sub: "Landing Page", value: "$3,200", pct: 25 },
      { name: "Bolt Fitness", sub: "App Onboarding", value: "$4,000", pct: 70, overdue: true },
      { name: "Bolt Fitness", sub: "Blog Posts", value: "$3,000", pct: 40 },
    ]},
    { label: "Complete", count: 2, value: "$4,000", color: "#b5b2a9", deals: [
      { name: "Nora Kim", sub: "Logo Redesign", value: "$2,200" },
      { name: "Meridian", sub: "Social Templates", value: "$1,800" },
    ]},
  ];
  const totalValue = stages.reduce((s, st) => s + parseInt(st.value.replace(/[^0-9]/g, "")), 0);

  return (
    <div className="sb-block sb-pipeline">
      <div className="sb-head">
        <div className="sb-head-left">
          <span className="sb-head-title">Pipeline</span>
          <span className="sb-head-count">{stages.reduce((s, st) => s + st.count, 0)} deals</span>
        </div>
        <span className="sb-head-value">${totalValue.toLocaleString()}</span>
      </div>
      {/* Funnel bar */}
      <div className="sb-pipe-funnel">
        {stages.map((st, i) => (
          <div key={i} className="sb-pipe-seg" style={{ flex: st.count, background: st.color + "10", borderBottom: `2px solid ${st.color}30` }}>
            <span className="sb-pipe-seg-label" style={{ color: st.color }}>{st.label}</span>
            <span className="sb-pipe-seg-val">{st.value}</span>
          </div>
        ))}
      </div>
      {/* Deal cards */}
      <div className="sb-pipe-deals">
        {stages.map((st) => st.deals.map((deal, j) => (
          <div key={`${st.label}-${j}`} className="sb-pipe-deal">
            <div className="sb-pipe-deal-bar" style={{ background: st.color }} />
            <div className="sb-pipe-deal-body">
              <div className="sb-pipe-deal-name">{deal.name}</div>
              <div className="sb-pipe-deal-sub">{deal.sub}</div>
            </div>
            <div className="sb-pipe-deal-right">
              <span className="sb-pipe-deal-value">{deal.value}</span>
              {deal.pct !== undefined && (
                <div className="sb-pipe-deal-progress">
                  <div className="sb-pipe-deal-progress-fill" style={{ width: `${deal.pct}%`, background: deal.overdue ? "#c07a6a" : st.color }} />
                </div>
              )}
              {deal.viewed && <span className="sb-pipe-deal-meta">Viewed {deal.viewed}×</span>}
              {deal.days !== undefined && !deal.viewed && <span className="sb-pipe-deal-meta">{deal.days}d</span>}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

// ── 2. Calendar Strip ──
function CalendarBlock() {
  const [selected, setSelected] = useState(0);
  const week = [
    { day: "Mon", date: "31", month: "Mar", today: true, items: [
      { time: "9:00", text: "Reply to Meridian feedback", color: "#b07d4f", type: "task" },
      { time: "11:00", text: "Call with Nora Kim", color: "#8b8bba", type: "call", dur: "30m" },
      { time: "2:00", text: "Color palette due", color: "#c07a6a", type: "deadline" },
    ]},
    { day: "Tue", date: "1", month: "Apr", items: [
      { time: "—", text: "Client review deadline", color: "#c07a6a", type: "deadline" },
      { time: "3:00", text: "Blog draft — Bolt", color: "#b07d4f", type: "task" },
    ]},
    { day: "Wed", date: "2", month: "Apr", items: [
      { time: "10:00", text: "Meridian sync call", color: "#8b8bba", type: "call", dur: "45m" },
    ]},
    { day: "Thu", date: "3", month: "Apr", items: [
      { time: "—", text: "Proposal expires", color: "#c07a6a", type: "deadline" },
    ]},
    { day: "Fri", date: "4", month: "Apr", items: [] },
    { day: "Sat", date: "5", month: "Apr", items: [
      { time: "—", text: "Guidelines doc due", color: "#b07d4f", type: "deadline" },
    ]},
    { day: "Sun", date: "6", month: "Apr", items: [] },
  ];

  const sel = week[selected];
  const typeIcon = (t) => t === "call" ? "◎" : t === "deadline" ? "△" : "◇";

  return (
    <div className="sb-block sb-calendar">
      <div className="sb-head">
        <span className="sb-head-title">This Week</span>
        <span className="sb-head-count">Mar 31 – Apr 6</span>
      </div>
      <div className="sb-cal-days">
        {week.map((d, i) => (
          <div key={i} className={`sb-cal-day${selected === i ? " on" : ""}${d.today ? " today" : ""}`}
            onClick={() => setSelected(i)}>
            <div className="sb-cal-day-name">{d.day}</div>
            <div className="sb-cal-day-num">{d.date}</div>
            {d.items.length > 0 && (
              <div className="sb-cal-day-dots">
                {d.items.slice(0, 3).map((item, j) => (
                  <div key={j} style={{ width: 4, height: 4, borderRadius: "50%", background: item.color }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sb-cal-detail">
        <div className="sb-cal-detail-day">{sel.day}, {sel.month} {sel.date}</div>
        {sel.items.length > 0 ? sel.items.map((item, i) => (
          <div key={i} className="sb-cal-item">
            <div className="sb-cal-item-bar" style={{ background: item.color }} />
            <div className="sb-cal-item-time">{item.time}</div>
            <div className="sb-cal-item-body">
              <div className="sb-cal-item-text">{item.text}</div>
              <div className="sb-cal-item-meta">
                <span style={{ color: item.color }}>{typeIcon(item.type)} {item.type}</span>
                {item.dur && <span>{item.dur}</span>}
              </div>
            </div>
          </div>
        )) : (
          <div className="sb-cal-empty">
            <span>Nothing scheduled</span>
            <button className="sb-cal-add-btn">+ Add event</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 3. Automation Rules ──
function AutomationBlock() {
  const rules = [
    { trigger: "When all Concept tasks → Done", action: "Send milestone email to Sarah", status: "fired", statusLabel: "Fired 3h ago", tColor: "#6b9a6b", icon: "✉" },
    { trigger: "When project hits 50%", action: "Auto-draft invoice · $2,400", status: "ready", statusLabel: "Ready to send", tColor: "#b07d4f", icon: "$" },
    { trigger: "When deliverable submitted + 3 days", action: "Send review reminder to client", status: "scheduled", statusLabel: "Fires Apr 4", tColor: "#8b8bba", icon: "◎" },
    { trigger: "When invoice overdue + 7 days", action: "Escalate: send formal reminder", status: "watching", statusLabel: "Watching INV-047", tColor: "#c07a6a", icon: "!" },
  ];

  return (
    <div className="sb-block sb-automations">
      <div className="sb-head">
        <div className="sb-head-left">
          <span className="sb-head-title">Automations</span>
          <span className="sb-head-count">{rules.length} rules</span>
        </div>
        <button className="sb-head-btn">+ Add Rule</button>
      </div>
      <div className="sb-auto-list">
        {rules.map((r, i) => (
          <div key={i} className="sb-auto-rule">
            <div className="sb-auto-icon" style={{ color: r.tColor, background: r.tColor + "06", borderColor: r.tColor + "12" }}>{r.icon}</div>
            <div className="sb-auto-body">
              <div className="sb-auto-trigger">{r.trigger}</div>
              <div className="sb-auto-action">→ {r.action}</div>
            </div>
            <div className="sb-auto-status" style={{ color: r.tColor }}>{r.statusLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 4. Quick Chat ──
function ChatBlock() {
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "Sarah", text: "Can we adjust the color palette? The teal feels too cold for our brand.", time: "2m ago", unread: true },
    { from: "Sarah", text: "Love the logo direction! Concept B it is.", time: "1d ago" },
    { from: "You", text: "Updated scope with the additional social templates. Let me know if the pricing works.", time: "2d ago" },
    { from: "Sarah", text: "Sounds great. Timeline looking ok?", time: "3d ago" },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs([{ from: "You", text: msg, time: "now" }, ...msgs]);
    setMsg("");
  };

  return (
    <div className="sb-block sb-chat">
      <div className="sb-head">
        <div className="sb-head-left" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="sb-chat-av" style={{ background: "#7c8594" }}>M</div>
          <div>
            <span className="sb-head-title">Meridian Studio</span>
            <div className="sb-chat-status"><div className="sb-chat-status-dot" /> Sarah is online</div>
          </div>
        </div>
        <button className="sb-head-btn">↗ Expand</button>
      </div>
      <div className="sb-chat-messages">
        {msgs.map((m, i) => (
          <div key={i} className={`sb-chat-msg ${m.from === "You" ? "sent" : "received"}`}>
            {m.from !== "You" && <div className="sb-chat-msg-av" style={{ background: "#7c8594" }}>S</div>}
            <div className="sb-chat-msg-bubble">
              <div className="sb-chat-msg-text">{m.text}</div>
              <div className="sb-chat-msg-meta">{m.from} · {m.time}{m.unread ? " · New" : ""}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="sb-chat-input">
        <input value={msg} onChange={e => setMsg(e.target.value)}
          placeholder="Message Sarah..."
          onKeyDown={e => e.key === "Enter" && send()} />
        <button className={`sb-chat-send${msg.trim() ? " active" : ""}`} onClick={send}>↑</button>
      </div>
    </div>
  );
}

// ── 5. File Gallery ──
function FileBlock() {
  const [viewMode, setViewMode] = useState("grid");
  const files = [
    { name: "Brand_Guidelines_v2.pdf", size: "4.2 MB", date: "Mar 29", type: "PDF", color: "#c07a6a" },
    { name: "Logo_Concepts_B.fig", size: "12 MB", date: "Mar 25", type: "FIG", color: "#8b8bba" },
    { name: "Color_Palette.png", size: "340 KB", date: "Mar 22", type: "PNG", color: "#6b9a6b" },
    { name: "Feedback_Notes.docx", size: "89 KB", date: "Mar 28", type: "DOC", color: "#8b8bba" },
    { name: "Social_Kit.zip", size: "28 MB", date: "Mar 15", type: "ZIP", color: "#b5b2a9" },
    { name: "Invoice_046.pdf", size: "120 KB", date: "Mar 20", type: "PDF", color: "#c07a6a" },
  ];

  return (
    <div className="sb-block sb-files">
      <div className="sb-head">
        <div className="sb-head-left">
          <span className="sb-head-title">Files</span>
          <span className="sb-head-count">{files.length}</span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {["grid", "list"].map(v => (
            <button key={v} className={`sb-files-view${viewMode === v ? " on" : ""}`} onClick={() => setViewMode(v)}>
              {v === "grid" ? "⊞" : "☰"}
            </button>
          ))}
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="sb-files-grid">
          {files.map((f, i) => (
            <div key={i} className="sb-files-card">
              <div className="sb-files-card-thumb" style={{ background: f.color + "06" }}>
                <span style={{ color: f.color, fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>{f.type}</span>
              </div>
              <div className="sb-files-card-info">
                <div className="sb-files-card-name">{f.name}</div>
                <div className="sb-files-card-meta">{f.size} · {f.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sb-files-list">
          {files.map((f, i) => (
            <div key={i} className="sb-files-row">
              <div className="sb-files-row-icon" style={{ color: f.color, background: f.color + "06", borderColor: f.color + "10" }}>{f.type}</div>
              <div className="sb-files-row-info">
                <div className="sb-files-row-name">{f.name}</div>
                <div className="sb-files-row-meta">{f.size} · {f.date}</div>
              </div>
              <span className="sb-files-row-dl">↓</span>
            </div>
          ))}
        </div>
      )}
      <div className="sb-files-drop">Drop files here or click to upload</div>
    </div>
  );
}

// ── 6. Revenue Chart ──
function RevenueChartBlock() {
  const months = [
    { label: "Oct", value: 4200 }, { label: "Nov", value: 6800 }, { label: "Dec", value: 5100 },
    { label: "Jan", value: 8400 }, { label: "Feb", value: 11200 }, { label: "Mar", value: 14800 },
  ];
  const max = Math.max(...months.map(m => m.value));
  const clients = [
    { name: "Meridian Studio", value: 12400, color: "#7c8594" },
    { name: "Nora Kim", value: 8200, color: "#a08472" },
    { name: "Bolt Fitness", value: 6000, color: "#8a7e63" },
  ];
  const cMax = Math.max(...clients.map(c => c.value));

  return (
    <div className="sb-block sb-revenue">
      <div className="sb-head">
        <div className="sb-head-left">
          <span className="sb-head-title">Revenue</span>
          <span className="sb-head-count">Last 6 months</span>
        </div>
        <span className="sb-head-value" style={{ color: "var(--sage)" }}>$50,500</span>
      </div>
      {/* Sparkline area */}
      <div className="sb-rev-chart">
        <svg width="100%" height="100" viewBox="0 0 300 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b8bba" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8b8bba" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,${100 - (months[0].value / max) * 80} ${months.map((m, i) => `L${(i / (months.length - 1)) * 300},${100 - (m.value / max) * 80}`).join(" ")} L300,100 L0,100 Z`} fill="url(#revGrad)" />
          <polyline points={months.map((m, i) => `${(i / (months.length - 1)) * 300},${100 - (m.value / max) * 80}`).join(" ")} fill="none" stroke="#8b8bba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {months.map((m, i) => (
            <circle key={i} cx={(i / (months.length - 1)) * 300} cy={100 - (m.value / max) * 80} r="3" fill="#fff" stroke="#8b8bba" strokeWidth="1.5" />
          ))}
        </svg>
        <div className="sb-rev-labels">
          {months.map((m, i) => (
            <span key={i} className="sb-rev-label">{m.label}</span>
          ))}
        </div>
      </div>
      {/* By client */}
      <div className="sb-rev-clients">
        <div className="sb-rev-clients-title">By client</div>
        {clients.map((c, i) => (
          <div key={i} className="sb-rev-client-row">
            <div className="sb-rev-client-av" style={{ background: c.color }}>{c.name[0]}</div>
            <span className="sb-rev-client-name">{c.name}</span>
            <div className="sb-rev-client-bar">
              <div style={{ width: `${(c.value / cMax) * 100}%`, height: "100%", background: "#8b8bba", opacity: 0.3, borderRadius: 2 }} />
            </div>
            <span className="sb-rev-client-val">${(c.value / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Showcase ──
export default function SpaceBlocksKit() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#f2f0ec;--card:#fff;--card-tint:#f9f8fc;--border:#e8e5df;--border-light:#f0ede8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ink-200:#d0cdc6;--ember:#b07d4f;--ember-bg:rgba(176,125,79,0.04);--sage:#6b9a6b;--lavender:#8b8bba;--lavender-bg:rgba(139,139,186,0.04);--rose:#c07a6a;--mono:'JetBrains Mono',monospace}

.kit{font-family:'Outfit',sans-serif;background:var(--bg);min-height:100vh;padding:40px 24px 80px}
.kit-inner{max-width:960px;margin:0 auto}
.kit-hd{margin-bottom:36px}
.kit-eyebrow{font-family:var(--mono);font-size:10px;color:var(--ember);text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px}
.kit-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.kit-sub{font-size:15px;color:var(--ink-400);line-height:1.6}

.kit-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.kit-section{margin-bottom:6px}
.kit-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;padding-left:4px}

/* ═══ Shared block styles ═══ */
.sb-block{background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:transform .2s cubic-bezier(.16,1,.3,1),box-shadow .25s ease}
.sb-block:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.03)}

.sb-head{padding:16px 20px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border-light)}
.sb-head-left{display:flex;align-items:center;gap:8px}
.sb-head-title{font-size:14px;font-weight:500;color:var(--ink-800)}
.sb-head-count{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--border-light);padding:2px 8px;border-radius:8px}
.sb-head-value{font-family:var(--mono);font-size:13px;font-weight:600;color:var(--ink-700)}
.sb-head-btn{padding:4px 12px;border-radius:6px;border:1px solid var(--border);background:var(--card);font-size:10px;font-family:inherit;color:var(--ink-400);cursor:pointer;transition:all .08s}
.sb-head-btn:hover{background:var(--border-light);color:var(--ink-600)}

/* ═══ 1. Pipeline ═══ */
.sb-pipe-funnel{display:flex;gap:1px;padding:0 16px;margin:12px 0 8px}
.sb-pipe-seg{padding:8px 10px;border-radius:6px;text-align:center;transition:all .1s}
.sb-pipe-seg:hover{transform:translateY(-1px)}
.sb-pipe-seg-label{font-family:var(--mono);font-size:9px;font-weight:500;display:block}
.sb-pipe-seg-val{font-family:var(--mono);font-size:8px;opacity:.5;display:block;margin-top:1px}
.sb-pipe-deals{padding:4px 12px 12px}
.sb-pipe-deal{display:flex;align-items:center;gap:8px;padding:8px 8px;border-radius:8px;margin-bottom:2px;transition:background .06s;cursor:default}
.sb-pipe-deal:hover{background:var(--lavender-bg)}
.sb-pipe-deal-bar{width:3px;height:28px;border-radius:2px;flex-shrink:0}
.sb-pipe-deal-body{flex:1;min-width:0}
.sb-pipe-deal-name{font-size:12px;font-weight:500;color:var(--ink-700)}
.sb-pipe-deal-sub{font-size:10px;color:var(--ink-300)}
.sb-pipe-deal-right{flex-shrink:0;text-align:right}
.sb-pipe-deal-value{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--ink-700);display:block}
.sb-pipe-deal-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.sb-pipe-deal-progress{width:48px;height:3px;background:var(--border-light);border-radius:2px;overflow:hidden;margin-top:3px;margin-left:auto}
.sb-pipe-deal-progress-fill{height:100%;border-radius:2px}

/* ═══ 2. Calendar ═══ */
.sb-cal-days{display:flex;gap:2px;padding:10px 12px 0}
.sb-cal-day{flex:1;padding:6px 2px 8px;text-align:center;cursor:pointer;border-radius:8px;transition:all .06s;position:relative}
.sb-cal-day:hover{background:var(--lavender-bg)}
.sb-cal-day.on{background:var(--lavender-bg);border:1px solid rgba(139,139,186,.06)}
.sb-cal-day:not(.on){border:1px solid transparent}
.sb-cal-day.today::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:14px;height:2px;background:var(--ember);border-radius:1px}
.sb-cal-day-name{font-family:var(--mono);font-size:9px;color:var(--ink-400)}
.sb-cal-day.on .sb-cal-day-name{color:var(--lavender)}
.sb-cal-day-num{font-size:15px;font-weight:500;color:var(--ink-700);line-height:1.3}
.sb-cal-day.on .sb-cal-day-num{color:var(--ink-900);font-weight:600}
.sb-cal-day-dots{display:flex;gap:2px;justify-content:center;margin-top:3px}
.sb-cal-detail{padding:10px 16px 14px}
.sb-cal-detail-day{font-family:var(--mono);font-size:10px;font-weight:500;color:var(--ink-500);margin-bottom:8px}
.sb-cal-item{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--border-light)}
.sb-cal-item:last-child{border-bottom:none}
.sb-cal-item-bar{width:3px;min-height:28px;border-radius:2px;flex-shrink:0;margin-top:2px}
.sb-cal-item-time{font-family:var(--mono);font-size:10px;color:var(--ink-300);width:32px;flex-shrink:0;margin-top:1px}
.sb-cal-item-body{flex:1}
.sb-cal-item-text{font-size:13px;color:var(--ink-700);line-height:1.3}
.sb-cal-item-meta{display:flex;gap:8px;margin-top:2px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.sb-cal-empty{padding:20px;text-align:center;color:var(--ink-300);font-size:12px}
.sb-cal-add-btn{margin-top:6px;padding:4px 12px;border-radius:5px;border:1px dashed var(--border);background:none;font-size:10px;font-family:inherit;color:var(--ink-300);cursor:pointer}
.sb-cal-add-btn:hover{border-color:var(--ember);color:var(--ember)}

/* ═══ 3. Automations ═══ */
.sb-auto-list{padding:8px 12px 12px}
.sb-auto-rule{display:flex;align-items:flex-start;gap:10px;padding:10px 8px;border-radius:8px;margin-bottom:2px;transition:background .06s}
.sb-auto-rule:hover{background:var(--lavender-bg)}
.sb-auto-icon{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;border:1px solid;margin-top:1px}
.sb-auto-body{flex:1;min-width:0}
.sb-auto-trigger{font-size:12px;color:var(--ink-700);line-height:1.4}
.sb-auto-action{font-size:11px;color:var(--ink-400);margin-top:2px}
.sb-auto-status{font-family:var(--mono);font-size:9px;flex-shrink:0;margin-top:2px}

/* ═══ 4. Chat ═══ */
.sb-chat{display:flex;flex-direction:column;height:400px}
.sb-chat-av{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--card);flex-shrink:0}
.sb-chat-status{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:9px;color:var(--sage);margin-top:1px}
.sb-chat-status-dot{width:5px;height:5px;border-radius:50%;background:var(--sage);animation:chatPulse 2s ease infinite}
@keyframes chatPulse{0%,60%,100%{opacity:.3}20%{opacity:1}}
.sb-chat-messages{flex:1;overflow-y:auto;padding:10px 16px;display:flex;flex-direction:column-reverse;gap:6px}
.sb-chat-messages::-webkit-scrollbar{width:3px}
.sb-chat-messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.sb-chat-msg{display:flex;align-items:flex-end;gap:6px}
.sb-chat-msg.sent{justify-content:flex-end}
.sb-chat-msg-av{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:var(--card);flex-shrink:0}
.sb-chat-msg-bubble{max-width:78%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5}
.sb-chat-msg.received .sb-chat-msg-bubble{background:var(--card-tint);border:1px solid var(--border-light);color:var(--ink-700);border-bottom-left-radius:3px}
.sb-chat-msg.sent .sb-chat-msg-bubble{background:var(--ink-900);color:#fff;border-bottom-right-radius:3px}
.sb-chat-msg-meta{font-family:var(--mono);font-size:8px;margin-top:4px}
.sb-chat-msg.received .sb-chat-msg-meta{color:var(--ink-300)}
.sb-chat-msg.sent .sb-chat-msg-meta{color:rgba(255,255,255,.25)}
.sb-chat-input{padding:10px 14px;border-top:1px solid var(--border-light);display:flex;gap:6px}
.sb-chat-input input{flex:1;padding:8px 14px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:inherit;color:var(--ink-700);outline:none;transition:border-color .1s}
.sb-chat-input input:focus{border-color:var(--lavender)}
.sb-chat-input input::placeholder{color:var(--ink-300)}
.sb-chat-send{width:32px;height:32px;border-radius:8px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;transition:all .08s}
.sb-chat-send.active{background:var(--ink-900);border-color:var(--ink-900);color:#fff}

/* ═══ 5. Files ═══ */
.sb-files-view{width:22px;height:22px;border-radius:5px;border:1px solid var(--border);background:var(--card);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.sb-files-view:hover{background:var(--border-light)}
.sb-files-view.on{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.sb-files-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px 14px}
.sb-files-card{border:1px solid var(--border);border-radius:10px;overflow:hidden;cursor:pointer;transition:all .1s}
.sb-files-card:hover{border-color:var(--lavender);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.02)}
.sb-files-card-thumb{height:52px;display:flex;align-items:center;justify-content:center}
.sb-files-card-info{padding:6px 8px}
.sb-files-card-name{font-size:10px;color:var(--ink-600);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:1px}
.sb-files-card-meta{font-family:var(--mono);font-size:8px;color:var(--ink-300)}
.sb-files-list{padding:6px 14px}
.sb-files-row{display:flex;align-items:center;gap:8px;padding:7px 6px;border-radius:6px;cursor:pointer;transition:background .06s}
.sb-files-row:hover{background:var(--lavender-bg)}
.sb-files-row-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;font-weight:600;flex-shrink:0;border:1px solid}
.sb-files-row-info{flex:1;min-width:0}
.sb-files-row-name{font-size:12px;color:var(--ink-700);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-files-row-meta{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.sb-files-row-dl{font-size:12px;color:var(--lavender);cursor:pointer;opacity:0;transition:opacity .08s;flex-shrink:0}
.sb-files-row:hover .sb-files-row-dl{opacity:1}
.sb-files-drop{margin:6px 14px 14px;padding:12px;border:1.5px dashed var(--border);border-radius:8px;text-align:center;font-size:11px;color:var(--ink-300);cursor:pointer;transition:all .1s}
.sb-files-drop:hover{border-color:var(--lavender);color:var(--lavender);background:var(--lavender-bg)}

/* ═══ 6. Revenue Chart ═══ */
.sb-rev-chart{padding:12px 20px 0;position:relative}
.sb-rev-labels{display:flex;justify-content:space-between;padding:4px 0 0;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.sb-rev-label{}
.sb-rev-clients{padding:12px 20px 16px}
.sb-rev-clients-title{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.sb-rev-client-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border-light)}
.sb-rev-client-row:last-child{border-bottom:none}
.sb-rev-client-av{width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:var(--card);flex-shrink:0}
.sb-rev-client-name{font-size:12px;color:var(--ink-600);width:100px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sb-rev-client-bar{flex:1;height:4px;background:var(--border-light);border-radius:2px;overflow:hidden}
.sb-rev-client-val{font-family:var(--mono);font-size:11px;font-weight:500;color:var(--ink-700);flex-shrink:0;width:40px;text-align:right}
      `}</style>

      <div className="kit">
        <div className="kit-inner">
          <div className="kit-hd">
            <div className="kit-eyebrow">Space Blocks · UI Kit</div>
            <div className="kit-title">6 New Blocks</div>
            <div className="kit-sub">Each one drops into the dashboard grid. Same soft aesthetic. All interactive.</div>
          </div>

          <div className="kit-grid">
            {/* Pipeline */}
            <div className="kit-section">
              <div className="kit-label">1 · Pipeline Funnel</div>
              <PipelineBlock />
            </div>

            {/* Calendar */}
            <div className="kit-section">
              <div className="kit-label">2 · Calendar Strip</div>
              <CalendarBlock />
            </div>

            {/* Automations */}
            <div className="kit-section">
              <div className="kit-label">3 · Automation Rules</div>
              <AutomationBlock />
            </div>

            {/* Chat */}
            <div className="kit-section">
              <div className="kit-label">4 · Quick Chat</div>
              <ChatBlock />
            </div>

            {/* Files */}
            <div className="kit-section">
              <div className="kit-label">5 · File Gallery</div>
              <FileBlock />
            </div>

            {/* Revenue */}
            <div className="kit-section">
              <div className="kit-label">6 · Revenue Chart</div>
              <RevenueChartBlock />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
