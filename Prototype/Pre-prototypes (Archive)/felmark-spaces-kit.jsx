import { useState } from "react";

/* ═══════════════════════════════════════════
   FELMARK — SPACES UI KIT v2
   3 blocks per Space. Maximum focus.
   Constraint breeds clarity.
   ═══════════════════════════════════════════ */

// ── Block Renderers (richer at larger size) ──

function RevenueSummary() {
  const months = [
    { m: "Oct", v: 4200 }, { m: "Nov", v: 6800 }, { m: "Dec", v: 5100 },
    { m: "Jan", v: 8400 }, { m: "Feb", v: 11200 }, { m: "Mar", v: 14800 },
  ];
  const max = Math.max(...months.map(m => m.v));
  return (
    <div className="bk-pad">
      <div className="bk-lb">Revenue</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 6 }}>
        <span className="bk-big" style={{ color: "var(--sg)" }}>$14,800</span>
        <span className="bk-trend-up">+40%</span>
      </div>
      <div className="bk-sub-text">earned this month · best since October</div>
      <div className="bk-chart-area">
        <svg width="100%" height="56" viewBox="0 0 240 56" preserveAspectRatio="none">
          <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--sg)" stopOpacity=".08"/><stop offset="100%" stopColor="var(--sg)" stopOpacity="0"/></linearGradient></defs>
          <path d={`M0,${56 - (months[0].v / max) * 46} ${months.map((m, i) => `L${(i / (months.length - 1)) * 240},${56 - (m.v / max) * 46}`).join(" ")} L240,56 L0,56 Z`} fill="url(#rg)" />
          <polyline points={months.map((m, i) => `${(i / (months.length - 1)) * 240},${56 - (m.v / max) * 46}`).join(" ")} fill="none" stroke="var(--sg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".5" />
          {months.map((m, i) => <circle key={i} cx={(i / (months.length - 1)) * 240} cy={56 - (m.v / max) * 46} r="3" fill="var(--card)" stroke="var(--sg)" strokeWidth="1.5" opacity=".6" />)}
        </svg>
        <div className="bk-chart-labels">{months.map((m, i) => <span key={i}>{m.m}</span>)}</div>
      </div>
      <div className="bk-row-divider" />
      <div className="bk-kv"><span>Outstanding</span><span style={{ color: "var(--rs)", fontWeight: 500 }}>$9,600</span></div>
      <div className="bk-kv"><span>Pipeline</span><span style={{ fontWeight: 500 }}>$22,000</span></div>
    </div>
  );
}

function TaskBoard() {
  const cols = [
    { label: "To Do", color: "#7d7db0", items: [{ t: "Brand guidelines doc", d: "Apr 5" }, { t: "Social template kit", d: "Apr 10" }] },
    { label: "Active", color: "#a87444", items: [{ t: "Color palette & type", d: "Apr 2" }] },
    { label: "Review", color: "#7d7db0", items: [{ t: "Client revisions", d: "Apr 1", urgent: true }] },
    { label: "Done", color: "#5e8f5e", items: [{ t: "Discovery audit", done: true }, { t: "Logo concepts", done: true }] },
  ];
  return (
    <div className="bk-pad bk-board">
      <div className="bk-lb" style={{ marginBottom: 10 }}>Active Tasks</div>
      <div className="bk-board-cols">
        {cols.map((col, i) => (
          <div key={i} className="bk-board-col">
            <div className="bk-board-hd"><div style={{ width: 5, height: 5, borderRadius: 2, background: col.color }} /><span style={{ color: col.color }}>{col.label}</span><span className="bk-board-count">{col.items.length}</span></div>
            {col.items.map((item, j) => (
              <div key={j} className={`bk-board-card${item.done ? " done" : ""}${item.urgent ? " urgent" : ""}`}>
                <span className="bk-board-card-text">{item.t}</span>
                {item.d && <span className="bk-board-card-due" style={{ color: item.urgent ? "var(--rs)" : "var(--i3)" }}>{item.d}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientHealth() {
  const clients = [
    { av: "M", name: "Meridian Studio", color: "#6a7b8a", h: 92, earned: "$12.4k", status: "active" },
    { av: "N", name: "Nora Kim", color: "#9a8472", h: 88, earned: "$8.2k", status: "active" },
    { av: "B", name: "Bolt Fitness", color: "#8a7e5a", h: 45, earned: "$6.0k", status: "overdue" },
    { av: "L", name: "Luna Boutique", color: "#7a6a90", h: 0, earned: "—", status: "lead" },
  ];
  const hc = (v) => v >= 75 ? "var(--sg)" : v >= 50 ? "var(--em)" : v > 0 ? "var(--rs)" : "var(--i3)";
  const sc = (s) => s === "active" ? "var(--sg)" : s === "overdue" ? "var(--rs)" : "var(--lv)";
  return (
    <div className="bk-pad">
      <div className="bk-lb">Client Health</div>
      <div className="bk-health-list">
        {clients.map((c, i) => (
          <div key={i} className="bk-health-row">
            <div className="bk-health-av" style={{ background: c.color }}>{c.av}</div>
            <div className="bk-health-info">
              <div className="bk-health-name">{c.name}</div>
              <div className="bk-health-meta">
                <span className="bk-health-status" style={{ color: sc(c.status), background: sc(c.status).replace(")", ",.05)").replace("var(", "rgba(").replace("--sg", "94,143,94").replace("--rs", "180,110,94").replace("--lv", "125,125,176"), borderColor: sc(c.status).replace(")", ",.1)").replace("var(", "rgba(").replace("--sg", "94,143,94").replace("--rs", "180,110,94").replace("--lv", "125,125,176") }}>{c.status}</span>
                <span>{c.earned}</span>
              </div>
            </div>
            <div className="bk-health-ring-wrap">
              {c.h > 0 ? (
                <svg width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--bdl)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke={hc(c.h)} strokeWidth="3" strokeDasharray={2 * Math.PI * 14} strokeDashoffset={2 * Math.PI * 14 - (c.h / 100) * 2 * Math.PI * 14} strokeLinecap="round" transform="rotate(-90 18 18)" />
                  <text x="18" y="19" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 9, fontWeight: 600, fill: hc(c.h), fontFamily: "var(--mono)" }}>{c.h}</text>
                </svg>
              ) : (
                <div className="bk-health-ring-empty">new</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhisperBlock() {
  return (
    <div className="bk-whisper">
      <span className="bk-whisper-badge">✦ AI</span>
      <span className="bk-whisper-dot" />
      <span className="bk-whisper-text">Sarah hasn't responded to color palette review in 2 days — a gentle follow-up usually helps</span>
      <button className="bk-whisper-btn">Send Nudge</button>
    </div>
  );
}

function UrgentList() {
  const items = [
    { text: "App Onboarding UX", right: "4 days late", color: "var(--rs)", rightColor: "var(--rs)" },
    { text: "Client review & revisions", right: "Due today", color: "var(--em)", rightColor: "var(--rs)" },
    { text: "Color palette & typography", right: "Due tomorrow", color: "var(--em)", rightColor: "var(--em)" },
    { text: "Brand guidelines document", right: "5 days left", color: "var(--lv)" },
  ];
  return (
    <div className="bk-pad">
      <div className="bk-lb">Urgent Tasks</div>
      <div className="bk-urgent-list">
        {items.map((item, i) => (
          <div key={i} className="bk-urgent-row">
            <div className="bk-urgent-pri" style={{ background: item.color }} />
            <div className="bk-urgent-cb" />
            <span className="bk-urgent-text">{item.text}</span>
            <span className="bk-urgent-right" style={{ color: item.rightColor || "var(--i3)" }}>{item.right}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverdueInvoices() {
  const items = [
    { client: "Bolt Fitness", num: "INV-047", amt: "$4,000", days: "4d overdue", sc: "var(--rs)" },
    { client: "Meridian", num: "INV-048", amt: "$2,400", days: "Sent 3h ago", sc: "var(--em)" },
  ];
  return (
    <div className="bk-pad">
      <div className="bk-lb">Invoices Needing Attention</div>
      <div className="bk-inv-list">
        {items.map((inv, i) => (
          <div key={i} className="bk-inv-card">
            <div className="bk-inv-bar" style={{ background: inv.sc }} />
            <div className="bk-inv-body">
              <div className="bk-inv-top"><span className="bk-inv-client">{inv.client}</span><span className="bk-inv-amt" style={{ color: inv.sc === "var(--rs)" ? "var(--rs)" : "var(--i7)" }}>{inv.amt}</span></div>
              <div className="bk-inv-bottom"><span className="bk-inv-num">{inv.num}</span><span className="bk-inv-days" style={{ color: inv.sc }}>{inv.days}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueByClient() {
  const data = [
    { name: "Meridian Studio", val: 12400, color: "#6a7b8a" },
    { name: "Nora Kim", val: 8200, color: "#9a8472" },
    { name: "Bolt Fitness", val: 6000, color: "#8a7e5a" },
  ];
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="bk-pad">
      <div className="bk-lb">Revenue by Client</div>
      <div className="bk-by-client">
        {data.map((d, i) => (
          <div key={i} className="bk-by-client-row">
            <div className="bk-by-client-av" style={{ background: d.color }}>{d.name[0]}</div>
            <div className="bk-by-client-info">
              <div className="bk-by-client-name">{d.name}</div>
              <div className="bk-by-client-bar"><div style={{ width: `${(d.val / max) * 100}%`, height: "100%", background: "var(--lv)", opacity: .3, borderRadius: 2 }} /></div>
            </div>
            <span className="bk-by-client-val">${(d.val / 1000).toFixed(1)}k</span>
          </div>
        ))}
      </div>
      <div className="bk-row-divider" />
      <div className="bk-kv"><span>Total earned</span><span style={{ fontWeight: 600, color: "var(--sg)" }}>$26.6k</span></div>
    </div>
  );
}

function WeeklyCalendar() {
  const days = [
    { d: "Mon", n: "31", items: ["Reply to feedback", "Call with Nora", "Palette due"], today: true },
    { d: "Tue", n: "1", items: ["Review deadline"] },
    { d: "Wed", n: "2", items: ["Meridian sync"] },
    { d: "Thu", n: "3", items: ["Proposal expires"] },
    { d: "Fri", n: "4", items: [] },
    { d: "Sat", n: "5", items: ["Guidelines due"] },
    { d: "Sun", n: "6", items: [] },
  ];
  return (
    <div className="bk-pad">
      <div className="bk-lb">This Week · Mar 31 – Apr 6</div>
      <div className="bk-week">
        {days.map((day, i) => (
          <div key={i} className={`bk-week-day${day.today ? " today" : ""}${day.items.length === 0 ? " empty" : ""}`}>
            <div className="bk-week-head">
              <span className="bk-week-name">{day.d}</span>
              <span className="bk-week-num">{day.n}</span>
            </div>
            {day.items.length > 0 ? day.items.map((item, j) => (
              <div key={j} className="bk-week-item">{item}</div>
            )) : (
              <div className="bk-week-empty">—</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TimerFocus() {
  return (
    <div className="bk-pad bk-timer-block">
      <div className="bk-lb">Currently Working On</div>
      <div className="bk-timer-task">Brand Guidelines v2 · Typography</div>
      <div className="bk-timer-time">0:00:00</div>
      <div className="bk-timer-btns">
        <button className="bk-timer-start">▶ Start Session</button>
        <button className="bk-timer-log">✓ Log Time</button>
      </div>
      <div className="bk-row-divider" />
      <div className="bk-timer-queue-lb">Up next</div>
      <div className="bk-timer-queue">
        <span className="bk-timer-q-item">Secondary & accent colors</span>
        <span className="bk-timer-q-item">Body & mono font selection</span>
      </div>
    </div>
  );
}

function PipelineView() {
  const stages = [
    { name: "Lead", color: "#7d7db0", deals: [{ name: "Luna · Brand", val: "$6.5k" }, { name: "Skyline · Web", val: "$3.2k" }] },
    { name: "Proposal", color: "#a87444", deals: [{ name: "Meridian · Guidelines", val: "$4.8k" }] },
    { name: "Active", color: "#5e8f5e", deals: [{ name: "Nora · Landing Page", val: "$3.2k" }, { name: "Bolt · App UX", val: "$4.0k" }, { name: "Bolt · Blog", val: "$3.0k" }] },
  ];
  const total = stages.reduce((s, st) => s + st.deals.reduce((ss, d) => ss + parseFloat(d.val.replace(/[^0-9.]/g, "")) * 1000, 0), 0);
  return (
    <div className="bk-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="bk-lb">Pipeline</div>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 600, color: "var(--i7)" }}>${(total / 1000).toFixed(1)}k</span>
      </div>
      <div className="bk-pipe">
        {stages.map((st, i) => (
          <div key={i} className="bk-pipe-col">
            <div className="bk-pipe-hd" style={{ color: st.color }}><div style={{ width: 5, height: 5, borderRadius: 2, background: st.color }} />{st.name}<span style={{ color: "var(--i3)" }}>{st.deals.length}</span></div>
            {st.deals.map((deal, j) => (
              <div key={j} className="bk-pipe-card">
                <span className="bk-pipe-card-name">{deal.name}</span>
                <span className="bk-pipe-card-val" style={{ color: st.color }}>{deal.val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function FocusChecklist() {
  const items = [
    { t: "Primary palette (5 colors)", done: true },
    { t: "Heading font pairing", done: true },
    { t: "Secondary & accent colors", done: false },
    { t: "Body & mono font selection", done: false },
  ];
  return (
    <div className="bk-pad">
      <div className="bk-lb">Focus Queue · Color Palette & Typography</div>
      <div className="bk-focus-list">
        {items.map((item, i) => (
          <div key={i} className={`bk-focus-item${item.done ? " done" : ""}`}>
            <div className={`bk-focus-cb${item.done ? " checked" : ""}`}>{item.done ? "✓" : ""}</div>
            <span className="bk-focus-text">{item.t}</span>
          </div>
        ))}
      </div>
      <div className="bk-focus-progress">
        <div className="bk-focus-bar"><div className="bk-focus-fill" style={{ width: "50%" }} /></div>
        <span className="bk-focus-pct">2 of 4</span>
      </div>
    </div>
  );
}

// ═══ Space Definitions (3 blocks each) ═══
const SPACES = [
  { id: "dashboard", name: "Dashboard", icon: "◆", desc: "Daily command center",
    blocks: [
      { w: 2, render: RevenueSummary, accent: "var(--sg)" },
      { w: 1, render: TaskBoard, accent: "var(--lv)" },
      { w: 1, render: ClientHealth, accent: "var(--lv)" },
    ] },
  { id: "triage", name: "Morning Triage", icon: "!", desc: "What needs attention now",
    blocks: [
      { w: 2, render: WhisperBlock, accent: "var(--em)", whisper: true },
      { w: 1, render: UrgentList, accent: "var(--rs)" },
      { w: 1, render: OverdueInvoices, accent: "var(--rs)" },
    ] },
  { id: "revenue", name: "Revenue", icon: "$", desc: "The money picture",
    blocks: [
      { w: 2, render: RevenueSummary, accent: "var(--sg)" },
      { w: 2, render: RevenueByClient, accent: "var(--lv)" },
    ] },
  { id: "weekly", name: "Weekly Planner", icon: "◎", desc: "Time-driven planning",
    blocks: [
      { w: 2, render: WeeklyCalendar, accent: "var(--lv)" },
      { w: 2, render: TimerFocus, accent: "var(--em)" },
    ] },
  { id: "pipeline-space", name: "Pipeline", icon: "→", desc: "Deals in motion",
    blocks: [
      { w: 2, render: PipelineView, accent: "var(--lv)" },
      { w: 2, render: ClientHealth, accent: "var(--lv)" },
    ] },
  { id: "focus", name: "Deep Work", icon: "●", desc: "Just the task and the clock",
    blocks: [
      { w: 2, render: TimerFocus, accent: "var(--em)" },
      { w: 2, render: FocusChecklist, accent: "var(--sg)" },
    ] },
];

export default function SpacesKit() {
  const [pair, setPair] = useState(0);
  const pairs = [[0, 1], [2, 3], [4, 5]];
  const labels = ["Command + Triage", "Revenue + Planner", "Pipeline + Focus"];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#edeae5;--card:#fff;--tint:#f8f7f4;--bd:#ddd9d2;--bdl:#ebe8e2;--i9:#252320;--i8:#363330;--i7:#4a4743;--i6:#5e5b56;--i5:#7a7772;--i4:#9b988f;--i3:#b5b2a9;--i2:#d0cdc6;--em:#a87444;--embg:rgba(168,116,68,.04);--sg:#5e8f5e;--sgbg:rgba(94,143,94,.04);--lv:#7d7db0;--lvbg:rgba(125,125,176,.03);--rs:#b46e5e;--mono:'JetBrains Mono',monospace}

.sk{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;padding:48px 32px 80px}
.sk-in{max-width:1100px;margin:0 auto}
.sk-hd{text-align:center;margin-bottom:40px}
.sk-eye{font-family:var(--mono);font-size:10px;color:var(--em);text-transform:uppercase;letter-spacing:.14em;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:12px}
.sk-eye::before,.sk-eye::after{content:'';width:32px;height:1px;background:var(--i2)}
.sk-t{font-family:'Fraunces',serif;font-size:40px;font-weight:600;color:var(--i9);line-height:1.1;margin-bottom:8px}
.sk-t em{font-style:italic;color:var(--em)}
.sk-sub{font-size:16px;color:var(--i4);max-width:440px;margin:0 auto;line-height:1.6}

.sk-tabs{display:flex;justify-content:center;gap:4px;margin-bottom:32px}
.sk-tab{padding:9px 22px;border-radius:10px;border:1px solid var(--bd);background:var(--card);font-size:13px;font-family:inherit;color:var(--i5);cursor:pointer;transition:all .12s;font-weight:500}
.sk-tab:hover{background:var(--tint);border-color:var(--i2);transform:translateY(-1px)}
.sk-tab.on{background:var(--i9);color:var(--card);border-color:var(--i9)}

.sk-pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}

/* Space card */
.sp{background:var(--card);border:1px solid var(--bd);border-radius:20px;overflow:hidden;transition:all .18s cubic-bezier(.16,1,.3,1)}
.sp:hover{transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,.04)}
.sp-hd{padding:18px 24px 14px;border-bottom:1px solid var(--bdl);display:flex;align-items:center;gap:12px}
.sp-hd-icon{width:34px;height:34px;border-radius:10px;background:var(--tint);border:1px solid var(--bdl);display:flex;align-items:center;justify-content:center;font-size:15px;color:var(--em)}
.sp-hd-name{font-family:'Fraunces',serif;font-size:19px;font-weight:600;color:var(--i9)}
.sp-hd-desc{font-size:12px;color:var(--i4);margin-top:1px}
.sp-hd-count{font-family:var(--mono);font-size:9px;color:var(--i3);background:var(--tint);padding:3px 9px;border-radius:6px;border:1px solid var(--bdl);margin-left:auto}

/* Canvas */
.sp-cv{padding:14px;background:var(--tint);position:relative}
.sp-cv::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,var(--i2) .5px,transparent .5px);background-size:18px 18px;opacity:.25;pointer-events:none}
.sp-grid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:8px;z-index:1}

/* Block */
.bk{background:var(--card);border:1px solid var(--bd);border-radius:14px;overflow:hidden;position:relative;transition:all .12s}
.bk:hover{border-color:var(--i2);box-shadow:0 4px 16px rgba(0,0,0,.02)}
.bk-line{position:absolute;bottom:0;left:0;height:2px;width:0;transition:width .3s cubic-bezier(.16,1,.3,1);border-radius:0 0 14px 14px;z-index:2}
.bk:hover .bk-line{width:100%}

/* Shared block styles */
.bk-pad{padding:16px 18px}
.bk-lb{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.07em}
.bk-big{font-family:'Fraunces',serif;font-size:28px;font-weight:700;line-height:1}
.bk-trend-up{font-family:var(--mono);font-size:10px;color:var(--sg);background:var(--sgbg);padding:2px 7px;border-radius:4px;border:1px solid rgba(94,143,94,.06)}
.bk-sub-text{font-size:11px;color:var(--i4);margin-top:4px}
.bk-row-divider{height:1px;background:var(--bdl);margin:10px 0}
.bk-kv{display:flex;justify-content:space-between;padding:3px 0;font-size:12px;color:var(--i5);font-family:var(--mono);font-size:11px}

/* Chart */
.bk-chart-area{margin-top:12px}
.bk-chart-labels{display:flex;justify-content:space-between;font-family:var(--mono);font-size:8px;color:var(--i3);margin-top:3px}

/* Board */
.bk-board-cols{display:flex;gap:5px}
.bk-board-col{flex:1;min-width:0}
.bk-board-hd{display:flex;align-items:center;gap:3px;font-family:var(--mono);font-size:7px;font-weight:500;text-transform:uppercase;padding:2px 3px;margin-bottom:4px}
.bk-board-count{color:var(--i3);font-weight:400}
.bk-board-card{background:var(--tint);border:1px solid var(--bdl);border-radius:6px;padding:6px 7px;margin-bottom:3px;transition:transform .06s}
.bk-board-card:hover{transform:translateX(2px)}
.bk-board-card.done{opacity:.4}
.bk-board-card.urgent{border-color:rgba(180,110,94,.12)}
.bk-board-card-text{font-size:10px;color:var(--i6);display:block}
.bk-board-card-due{font-family:var(--mono);font-size:8px;display:block;margin-top:2px}

/* Health */
.bk-health-list{margin-top:10px}
.bk-health-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bdl)}
.bk-health-row:last-child{border-bottom:none}
.bk-health-av{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:var(--card);flex-shrink:0}
.bk-health-info{flex:1;min-width:0}
.bk-health-name{font-size:13px;font-weight:500;color:var(--i7)}
.bk-health-meta{display:flex;align-items:center;gap:6px;margin-top:3px;font-family:var(--mono);font-size:9px;color:var(--i3)}
.bk-health-status{font-size:8px;padding:1px 6px;border-radius:3px;border:1px solid;font-weight:500}
.bk-health-ring-wrap{flex-shrink:0}
.bk-health-ring-empty{width:36px;height:36px;border-radius:50%;border:2px dashed var(--bd);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:8px;color:var(--i3)}

/* Whisper */
.bk-whisper{display:flex;align-items:center;gap:10px;padding:14px 18px;height:100%}
.bk-whisper-badge{font-family:var(--mono);font-size:9px;font-weight:500;color:var(--em);background:var(--embg);padding:4px 10px;border-radius:6px;border:1px solid rgba(168,116,68,.04);flex-shrink:0}
.bk-whisper-dot{width:5px;height:5px;border-radius:50%;background:var(--em);flex-shrink:0}
.bk-whisper-text{font-size:13px;color:var(--i5);flex:1;line-height:1.5}
.bk-whisper-btn{padding:6px 16px;border-radius:7px;border:1px solid var(--bd);background:var(--card);font-size:11px;font-weight:500;font-family:inherit;color:var(--i6);cursor:pointer;flex-shrink:0}

/* Urgent */
.bk-urgent-list{margin-top:10px}
.bk-urgent-row{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--bdl)}
.bk-urgent-row:last-child{border-bottom:none}
.bk-urgent-pri{width:3px;height:20px;border-radius:2px;flex-shrink:0}
.bk-urgent-cb{width:14px;height:14px;border-radius:4px;border:1.5px solid var(--bd);flex-shrink:0}
.bk-urgent-text{flex:1;font-size:13px;color:var(--i7)}
.bk-urgent-right{font-family:var(--mono);font-size:10px;flex-shrink:0}

/* Invoices */
.bk-inv-list{margin-top:10px}
.bk-inv-card{border:1px solid var(--bdl);border-radius:10px;overflow:hidden;margin-bottom:6px;display:flex}
.bk-inv-bar{width:3px;flex-shrink:0}
.bk-inv-body{flex:1;padding:10px 12px}
.bk-inv-top{display:flex;justify-content:space-between;align-items:baseline}
.bk-inv-client{font-size:13px;font-weight:500;color:var(--i7)}
.bk-inv-amt{font-family:var(--mono);font-size:14px;font-weight:600}
.bk-inv-bottom{display:flex;justify-content:space-between;margin-top:3px}
.bk-inv-num{font-family:var(--mono);font-size:10px;color:var(--i3)}
.bk-inv-days{font-family:var(--mono);font-size:10px;font-weight:500}

/* By client */
.bk-by-client{margin-top:10px}
.bk-by-client-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--bdl)}
.bk-by-client-row:last-child{border-bottom:none}
.bk-by-client-av{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--card);flex-shrink:0}
.bk-by-client-info{flex:1;min-width:0}
.bk-by-client-name{font-size:13px;color:var(--i6);margin-bottom:3px}
.bk-by-client-bar{height:4px;background:var(--bdl);border-radius:2px;overflow:hidden}
.bk-by-client-val{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--i7);flex-shrink:0;width:40px;text-align:right}

/* Weekly calendar */
.bk-week{display:flex;gap:3px;margin-top:10px}
.bk-week-day{flex:1;background:var(--tint);border:1px solid var(--bdl);border-radius:8px;padding:6px 4px;min-height:80px}
.bk-week-day.today{background:var(--embg);border-color:rgba(168,116,68,.08)}
.bk-week-day.empty{opacity:.5}
.bk-week-head{text-align:center;margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid var(--bdl)}
.bk-week-name{font-family:var(--mono);font-size:8px;color:var(--i4);display:block}
.bk-week-num{font-size:14px;font-weight:500;color:var(--i7);display:block}
.bk-week-item{font-size:9px;color:var(--i5);padding:2px 4px;margin-bottom:2px;background:var(--card);border-radius:3px;border:1px solid var(--bdl);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bk-week-empty{font-size:9px;color:var(--i3);text-align:center;padding:8px 0}

/* Timer */
.bk-timer-block{display:flex;flex-direction:column;justify-content:center}
.bk-timer-task{font-size:14px;color:var(--i7);margin-top:8px;font-weight:500}
.bk-timer-time{font-family:var(--mono);font-size:32px;font-weight:600;color:var(--i9);letter-spacing:.02em;margin:6px 0 10px}
.bk-timer-btns{display:flex;gap:5px}
.bk-timer-start{padding:7px 18px;border-radius:8px;border:none;background:var(--i9);color:var(--card);font-size:12px;font-family:inherit;font-weight:500;cursor:pointer}
.bk-timer-log{padding:7px 18px;border-radius:8px;border:1px solid rgba(94,143,94,.12);background:var(--sgbg);color:var(--sg);font-size:12px;font-family:inherit;font-weight:500;cursor:pointer}
.bk-timer-queue-lb{font-family:var(--mono);font-size:8px;color:var(--i3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
.bk-timer-queue{display:flex;flex-direction:column;gap:3px}
.bk-timer-q-item{font-size:12px;color:var(--i4);padding:4px 0;border-bottom:1px solid var(--bdl)}

/* Pipeline */
.bk-pipe{display:flex;gap:5px;margin-top:10px}
.bk-pipe-col{flex:1;min-width:0}
.bk-pipe-hd{display:flex;align-items:center;gap:3px;font-family:var(--mono);font-size:8px;font-weight:500;text-transform:uppercase;padding:2px 4px;margin-bottom:4px}
.bk-pipe-card{background:var(--tint);border:1px solid var(--bdl);border-radius:6px;padding:7px 8px;margin-bottom:3px}
.bk-pipe-card-name{font-size:11px;color:var(--i6);display:block}
.bk-pipe-card-val{font-family:var(--mono);font-size:10px;font-weight:500;display:block;margin-top:2px}

/* Focus checklist */
.bk-focus-list{margin-top:10px}
.bk-focus-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--bdl)}
.bk-focus-item:last-child{border-bottom:none}
.bk-focus-item.done{opacity:.4}
.bk-focus-cb{width:18px;height:18px;border-radius:5px;border:2px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;flex-shrink:0}
.bk-focus-cb.checked{background:var(--sg);border-color:var(--sg);color:#fff}
.bk-focus-text{font-size:14px;color:var(--i7)}
.bk-focus-item.done .bk-focus-text{text-decoration:line-through;color:var(--i3)}
.bk-focus-progress{display:flex;align-items:center;gap:8px;margin-top:12px}
.bk-focus-bar{flex:1;height:4px;background:var(--bdl);border-radius:2px;overflow:hidden}
.bk-focus-fill{height:100%;background:var(--sg);border-radius:2px}
.bk-focus-pct{font-family:var(--mono);font-size:10px;color:var(--i3);flex-shrink:0}
      `}</style>

      <div className="sk">
        <div className="sk-in">
          <div className="sk-hd">
            <div className="sk-eye">Space Blocks</div>
            <div className="sk-t">Same data. <em>Different lens.</em></div>
            <div className="sk-sub">Every Space uses 2–3 blocks. That's all you need. Compose your own or start with these.</div>
          </div>
          <div className="sk-tabs">{labels.map((l, i) => <button key={i} className={`sk-tab${pair === i ? " on" : ""}`} onClick={() => setPair(i)}>{l}</button>)}</div>

          <div className="sk-pair">
            {pairs[pair].map(idx => {
              const space = SPACES[idx];
              return (
                <div key={space.id} className="sp">
                  <div className="sp-hd">
                    <div className="sp-hd-icon">{space.icon}</div>
                    <div><div className="sp-hd-name">{space.name}</div><div className="sp-hd-desc">{space.desc}</div></div>
                    <span className="sp-hd-count">{space.blocks.length} blocks</span>
                  </div>
                  <div className="sp-cv">
                    <div className="sp-grid">
                      {space.blocks.map((blk, i) => {
                        const Comp = blk.render;
                        return (
                          <div key={i} className="bk" style={{ gridColumn: `span ${blk.w}` }}>
                            {blk.whisper ? <Comp /> : <Comp />}
                            <div className="bk-line" style={{ background: blk.accent }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
