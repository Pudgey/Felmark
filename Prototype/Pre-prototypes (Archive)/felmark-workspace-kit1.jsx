import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — UI KIT #1
   5 components. Each standalone. Drop anywhere.
   ═══════════════════════════════════════════ */


// ═══════════════════════════════════════════
// 1. FLOATING TIMER BAR
// ═══════════════════════════════════════════
function FloatingTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [task, setTask] = useState("Color palette & typography system");
  const [client, setClient] = useState("Meridian Studio");
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const fmt = `${hrs > 0 ? hrs + "h " : ""}${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;
  const fmtShort = `${hrs > 0 ? hrs + ":" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  if (minimized) {
    return (
      <div className="ft-mini" onClick={() => setMinimized(false)}>
        <div className="ft-mini-pulse" />
        <span className="ft-mini-time">{fmtShort}</span>
      </div>
    );
  }

  return (
    <div className={`ft-bar${running ? " active" : ""}`}>
      {/* Left: task info */}
      <div className="ft-bar-left">
        {running && <div className="ft-bar-pulse" />}
        <div className="ft-bar-info">
          <div className="ft-bar-task">{task}</div>
          <div className="ft-bar-client">
            <span className="ft-bar-client-dot" style={{ background: "#7c8594" }} />
            {client}
          </div>
        </div>
      </div>

      {/* Center: time display */}
      <div className="ft-bar-time">
        <span className="ft-bar-time-val">{fmt}</span>
        {running && <span className="ft-bar-time-label">Recording</span>}
        {!running && seconds > 0 && <span className="ft-bar-time-label">Paused</span>}
      </div>

      {/* Right: controls */}
      <div className="ft-bar-controls">
        {!running && seconds === 0 && (
          <button className="ft-btn start" onClick={() => setRunning(true)}>▶ Start</button>
        )}
        {running && (
          <>
            <button className="ft-btn pause" onClick={() => setRunning(false)}>❚❚</button>
            <button className="ft-btn stop" onClick={() => { setRunning(false); setSeconds(0); }}>■ Stop & Log</button>
          </>
        )}
        {!running && seconds > 0 && (
          <>
            <button className="ft-btn start" onClick={() => setRunning(true)}>▶ Resume</button>
            <button className="ft-btn stop" onClick={() => { setSeconds(0); }}>✕ Discard</button>
            <button className="ft-btn log" onClick={() => { setSeconds(0); }}>✓ Log {fmtShort}</button>
          </>
        )}
        <button className="ft-btn-icon" onClick={() => setMinimized(true)} title="Minimize">—</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 2. INLINE QUICK INVOICE
// ═══════════════════════════════════════════
function QuickInvoice() {
  const [items, setItems] = useState([
    { desc: "Brand Guidelines v2 — Design", amount: "2,400", hours: "24h" },
    { desc: "Logo concept exploration (overage)", amount: "250", hours: "2h" },
  ]);
  const [sent, setSent] = useState(false);

  const total = items.reduce((s, i) => s + parseInt(i.amount.replace(/,/g, "")), 0);

  if (sent) {
    return (
      <div className="qi-panel">
        <div className="qi-sent">
          <div className="qi-sent-icon">✓</div>
          <div className="qi-sent-title">Invoice sent</div>
          <div className="qi-sent-sub">INV-049 · ${total.toLocaleString()} → Sarah Chen</div>
          <button className="qi-sent-btn" onClick={() => setSent(false)}>Create another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qi-panel">
      {/* Header */}
      <div className="qi-head">
        <div className="qi-head-left">
          <span className="qi-head-title">Quick Invoice</span>
          <span className="qi-head-num">INV-049</span>
        </div>
        <button className="qi-close">✕</button>
      </div>

      {/* Client */}
      <div className="qi-client">
        <div className="qi-client-av" style={{ background: "#7c8594" }}>M</div>
        <div className="qi-client-info">
          <div className="qi-client-name">Meridian Studio</div>
          <div className="qi-client-email">sarah@meridian.co</div>
        </div>
        <span className="qi-client-change">Change</span>
      </div>

      {/* Line items */}
      <div className="qi-items">
        <div className="qi-items-head">
          <span className="qi-items-th" style={{ flex: 1 }}>Description</span>
          <span className="qi-items-th" style={{ width: 50 }}>Hours</span>
          <span className="qi-items-th" style={{ width: 80, textAlign: "right" }}>Amount</span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="qi-item">
            <input className="qi-item-desc" defaultValue={item.desc} />
            <span className="qi-item-hours">{item.hours}</span>
            <div className="qi-item-amount">
              <span className="qi-item-currency">$</span>
              <input className="qi-item-amount-input" defaultValue={item.amount} />
            </div>
          </div>
        ))}
        <button className="qi-add-item" onClick={() => setItems([...items, { desc: "", amount: "0", hours: "" }])}>+ Add line item</button>
      </div>

      {/* Totals */}
      <div className="qi-totals">
        <div className="qi-total-row"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
        <div className="qi-total-row"><span>Felmark fee (2.9%)</span><span className="qi-total-fee">-${Math.round(total * 0.029).toLocaleString()}</span></div>
        <div className="qi-total-row main"><span>Total</span><span>${total.toLocaleString()}</span></div>
      </div>

      {/* Settings */}
      <div className="qi-settings">
        <div className="qi-setting">
          <span className="qi-setting-label">Due date</span>
          <span className="qi-setting-val">Net 15 · Apr 15, 2026</span>
        </div>
        <div className="qi-setting">
          <span className="qi-setting-label">Payment</span>
          <span className="qi-setting-val">Card / ACH via Stripe</span>
        </div>
      </div>

      {/* Actions */}
      <div className="qi-actions">
        <button className="qi-btn secondary">Save Draft</button>
        <button className="qi-btn primary" onClick={() => setSent(true)}>Send Invoice →</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 3. CLIENT PULSE PANEL
// ═══════════════════════════════════════════
function ClientPulse() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="cp-panel">
      {/* Header */}
      <div className="cp-head">
        <div className="cp-head-av" style={{ background: "#7c8594" }}>M</div>
        <div className="cp-head-info">
          <div className="cp-head-name">Meridian Studio</div>
          <div className="cp-head-contact">Sarah Chen · sarah@meridian.co</div>
        </div>
        <div className="cp-head-health">
          <svg width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="11" fill="none" stroke="#e5e2db" strokeWidth="2.5" />
            <circle cx="14" cy="14" r="11" fill="none" stroke="#5a9a3c" strokeWidth="2.5" strokeDasharray={2 * Math.PI * 11} strokeDashoffset={2 * Math.PI * 11 * (1 - 0.92)} strokeLinecap="round" transform="rotate(-90 14 14)" />
            <text x="14" y="14" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 8, fontWeight: 600, fill: "#5a9a3c", fontFamily: "var(--mono)" }}>92</text>
          </svg>
        </div>
      </div>

      {/* Mini tabs */}
      <div className="cp-tabs">
        {["overview", "activity", "deadlines"].map(t => (
          <button key={t} className={`cp-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="cp-body">
          {/* Stats */}
          <div className="cp-stats">
            {[
              { label: "Earned", val: "$12.4k", color: "#5a9a3c" },
              { label: "Owed", val: "$2.4k", color: "var(--ember)" },
              { label: "Projects", val: "2", color: "var(--ink-800)" },
              { label: "Avg response", val: "4h", color: "var(--ink-800)" },
            ].map((s, i) => (
              <div key={i} className="cp-stat">
                <div className="cp-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="cp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Revenue bar */}
          <div className="cp-rev">
            <div className="cp-rev-label">Revenue · lifetime</div>
            <div className="cp-rev-bar">
              <div className="cp-rev-earned" style={{ width: "75%" }} />
              <div className="cp-rev-owed" style={{ width: "14%" }} />
            </div>
            <div className="cp-rev-legend">
              <span><span className="cp-rev-dot" style={{ background: "#5a9a3c" }} /> Earned $12.4k</span>
              <span><span className="cp-rev-dot" style={{ background: "var(--ember)" }} /> Owed $2.4k</span>
              <span><span className="cp-rev-dot" style={{ background: "var(--warm-200)" }} /> Remaining $1.8k</span>
            </div>
          </div>

          {/* Key dates */}
          <div className="cp-dates">
            <div className="cp-dates-label">Key dates</div>
            {[
              { label: "Client since", val: "Oct 2025", color: "var(--ink-600)" },
              { label: "Last payment", val: "Mar 28 · $1,800", color: "#5a9a3c" },
              { label: "Next deadline", val: "Apr 2 · Color palette", color: "var(--ember)" },
              { label: "Proposal expires", val: "Apr 3", color: "#c24b38" },
            ].map((d, i) => (
              <div key={i} className="cp-date-row">
                <span className="cp-date-label">{d.label}</span>
                <span className="cp-date-val" style={{ color: d.color }}>{d.val}</span>
              </div>
            ))}
          </div>

          {/* Notes preview */}
          <div className="cp-notes">
            <div className="cp-notes-label">Notes</div>
            <div className="cp-notes-text">Prefers clean, minimal aesthetic. Budget-conscious but values quality. Sarah is decision-maker, CEO (James) has final sign-off.</div>
          </div>
        </div>
      )}

      {tab === "activity" && (
        <div className="cp-body">
          {[
            { text: "Sarah viewed proposal", time: "2m", dot: "#5b7fa4" },
            { text: "Payment received · $1,800", time: "3h", dot: "#5a9a3c" },
            { text: "3 comments on scope", time: "2d", dot: "#d97706" },
            { text: "Contract signed", time: "2w", dot: "#5a9a3c" },
            { text: "Proposal sent · $4,800", time: "2w", dot: "var(--ember)" },
            { text: "Initial call · 45 min", time: "3w", dot: "#5b7fa4" },
          ].map((a, i) => (
            <div key={i} className="cp-act">
              <div className="cp-act-dot" style={{ background: a.dot }} />
              <span className="cp-act-text">{a.text}</span>
              <span className="cp-act-time">{a.time}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "deadlines" && (
        <div className="cp-body">
          {[
            { label: "Apr 1", text: "Client review & revisions", urgent: true },
            { label: "Apr 2", text: "Color palette due" },
            { label: "Apr 5", text: "Brand guidelines doc" },
            { label: "Apr 10", text: "Social templates kit" },
          ].map((d, i) => (
            <div key={i} className="cp-deadline">
              <span className="cp-deadline-date" style={{ color: d.urgent ? "#c24b38" : "var(--ink-500)" }}>{d.label}</span>
              <span className="cp-deadline-text">{d.text}</span>
              {d.urgent && <span className="cp-deadline-urgent">!</span>}
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="cp-actions">
        <button className="cp-act-btn">✉ Message</button>
        <button className="cp-act-btn">$ Invoice</button>
        <button className="cp-act-btn ember">+ Project</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 4. QUICK MESSAGE DRAWER
// ═══════════════════════════════════════════
function MessageDrawer() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    { from: "Sarah", text: "Can we adjust the color palette? The teal feels too cold for our brand.", time: "2m ago", unread: true },
    { from: "Sarah", text: "Love the logo direction! Let's move forward with concept B.", time: "1d ago" },
    { from: "You", text: "Here's the updated scope with the additional social templates.", time: "2d ago" },
    { from: "Sarah", text: "Sounds great. What's the timeline looking like?", time: "3d ago" },
    { from: "You", text: "We're on track — guidelines draft by end of week.", time: "4d ago" },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages([{ from: "You", text: msg, time: "now" }, ...messages]);
    setMsg("");
  };

  return (
    <div className="md-panel">
      {/* Header */}
      <div className="md-head">
        <div className="md-head-av" style={{ background: "#7c8594" }}>M</div>
        <div className="md-head-info">
          <div className="md-head-name">Meridian Studio</div>
          <div className="md-head-status"><span className="md-head-dot" /> Sarah is online</div>
        </div>
        <button className="md-head-expand" title="Open full view">↗</button>
        <button className="md-head-close">✕</button>
      </div>

      {/* Messages */}
      <div className="md-messages">
        {messages.map((m, i) => (
          <div key={i} className={`md-msg ${m.from === "You" ? "sent" : "received"}`}>
            {m.from !== "You" && <div className="md-msg-av" style={{ background: "#7c8594" }}>{m.from[0]}</div>}
            <div className="md-msg-bubble">
              <div className="md-msg-text">{m.text}</div>
              <div className="md-msg-meta">
                <span>{m.from === "You" ? "You" : m.from}</span>
                <span>·</span>
                <span>{m.time}</span>
                {m.unread && <span className="md-msg-unread">New</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="md-input">
        <input className="md-input-field" value={msg} onChange={e => setMsg(e.target.value)}
          placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && send()} />
        <button className="md-input-attach" title="Attach file">◻</button>
        <button className={`md-input-send${msg.trim() ? " active" : ""}`} onClick={send}>↑</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// 5. ACTION BAR (COMMAND PALETTE)
// ═══════════════════════════════════════════
function ActionBar() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { icon: "$", label: "Create invoice for Meridian", sub: "Quick Invoice", cat: "action", color: "#5a9a3c" },
    { icon: "▶", label: "Log 2 hours to Color Palette", sub: "Time Tracking", cat: "action", color: "#d97706" },
    { icon: "✓", label: "Mark Brand Guidelines as complete", sub: "Project", cat: "action", color: "#5a9a3c" },
    { icon: "✉", label: "Send message to Sarah Chen", sub: "Meridian Studio", cat: "action", color: "#5b7fa4" },
    { icon: "◆", label: "Create proposal for Luna Boutique", sub: "Quick Proposal", cat: "action", color: "var(--ember)" },
    { icon: "M", label: "Meridian Studio", sub: "2 projects · $2.4k owed", cat: "client", color: "#7c8594" },
    { icon: "N", label: "Nora Kim", sub: "2 projects · $3.2k owed", cat: "client", color: "#a08472" },
    { icon: "B", label: "Bolt Fitness", sub: "2 projects · $4k overdue", cat: "client", color: "#8a7e63" },
    { icon: "◎", label: "Brand Guidelines v2", sub: "Meridian · 67% complete", cat: "project", color: "#5a9a3c" },
    { icon: "◎", label: "App Onboarding Flow", sub: "Bolt Fitness · Overdue", cat: "project", color: "#c24b38" },
    { icon: "☰", label: "INV-047 · Bolt Fitness", sub: "$4,000 · Overdue", cat: "invoice", color: "#c24b38" },
    { icon: "☰", label: "INV-048 · Meridian", sub: "$2,400 · Sent", cat: "invoice", color: "#d97706" },
  ];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.sub.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = {
    action: filtered.filter(c => c.cat === "action"),
    client: filtered.filter(c => c.cat === "client"),
    project: filtered.filter(c => c.cat === "project"),
    invoice: filtered.filter(c => c.cat === "invoice"),
  };

  useEffect(() => { inputRef.current?.focus(); }, []);

  let flatIdx = 0;

  return (
    <div className="ab-overlay">
      <div className="ab-panel">
        {/* Search input */}
        <div className="ab-input-row">
          <span className="ab-input-icon">⌕</span>
          <input ref={inputRef} className="ab-input" value={query} onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search or type a command..."
            onKeyDown={e => {
              if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
            }} />
          <span className="ab-input-esc">ESC</span>
        </div>

        {/* Results */}
        <div className="ab-results">
          {Object.entries(grouped).map(([cat, items]) => {
            if (items.length === 0) return null;
            const catLabels = { action: "Actions", client: "Clients", project: "Projects", invoice: "Invoices" };
            return (
              <div key={cat} className="ab-group">
                <div className="ab-group-label">{catLabels[cat]}</div>
                {items.map((cmd) => {
                  const idx = flatIdx++;
                  const isSel = selected === idx;
                  return (
                    <div key={idx} className={`ab-item${isSel ? " sel" : ""}`}
                      onMouseEnter={() => setSelected(idx)}>
                      <div className="ab-item-icon" style={{
                        color: cmd.color,
                        background: cmd.color + "08",
                        borderColor: cmd.color + "15",
                      }}>{cmd.icon}</div>
                      <div className="ab-item-info">
                        <div className="ab-item-label">{cmd.label}</div>
                        <div className="ab-item-sub">{cmd.sub}</div>
                      </div>
                      {isSel && <span className="ab-item-enter">↵</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="ab-empty">No results for "{query}"</div>
          )}
        </div>

        {/* Footer */}
        <div className="ab-foot">
          <span className="ab-foot-hint"><span className="ab-foot-key">↑↓</span> navigate</span>
          <span className="ab-foot-hint"><span className="ab-foot-key">↵</span> select</span>
          <span className="ab-foot-hint"><span className="ab-foot-key">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// SHOWCASE
// ═══════════════════════════════════════════
export default function UIKit1() {
  const [showActionBar, setShowActionBar] = useState(false);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.kit{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:32px 24px 80px}
.kit-in{max-width:880px;margin:0 auto}
.kit-title{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.kit-sub{font-size:14px;color:var(--ink-400);margin-bottom:32px}
.kit-label{font-family:var(--mono);font-size:10px;color:var(--ember);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.kit-label::after{content:'';flex:1;height:1px;background:var(--warm-200)}
.kit-desc{font-size:13px;color:var(--ink-400);margin-bottom:12px;line-height:1.5}
.kit-section{margin-bottom:40px}
.kit-preview{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden}
.kit-preview-dark{background:#e8e5de}

/* ═══ 1. FLOATING TIMER ═══ */
.ft-bar{display:flex;align-items:center;gap:12px;padding:8px 12px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;transition:all .15s}
.ft-bar.active{border-color:rgba(90,154,60,0.12);background:rgba(90,154,60,0.01)}
.ft-bar-left{display:flex;align-items:center;gap:8px;flex:1;min-width:0}
.ft-bar-pulse{width:8px;height:8px;border-radius:50%;background:#5a9a3c;flex-shrink:0;animation:tmPulse 1.5s ease infinite}
@keyframes tmPulse{0%,60%,100%{opacity:.3;transform:scale(1)}15%{opacity:1;transform:scale(1.2)}}
.ft-bar-info{min-width:0}
.ft-bar-task{font-size:13px;font-weight:500;color:var(--ink-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ft-bar-client{display:flex;align-items:center;gap:4px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.ft-bar-client-dot{width:6px;height:6px;border-radius:3px;flex-shrink:0}
.ft-bar-time{text-align:center;flex-shrink:0;min-width:120px}
.ft-bar-time-val{font-family:var(--mono);font-size:20px;font-weight:600;color:var(--ink-900);letter-spacing:.02em}
.ft-bar-time-label{font-family:var(--mono);font-size:8px;color:#5a9a3c;display:block;text-transform:uppercase;letter-spacing:.04em}
.ft-bar-controls{display:flex;align-items:center;gap:4px;flex-shrink:0}
.ft-btn{padding:5px 12px;border-radius:5px;border:none;font-size:11px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .08s}
.ft-btn.start{background:var(--ink-900);color:#fff}
.ft-btn.start:hover{background:var(--ink-800)}
.ft-btn.pause{background:var(--warm-100);color:var(--ink-500);padding:5px 8px}
.ft-btn.stop{background:#fff;color:var(--ink-400);border:1px solid var(--warm-200)}
.ft-btn.stop:hover{background:var(--warm-50)}
.ft-btn.log{background:#5a9a3c;color:#fff}
.ft-btn.log:hover{background:#4e8a34}
.ft-btn-icon{width:24px;height:24px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.ft-mini{position:fixed;bottom:16px;right:16px;padding:6px 12px;background:#5a9a3c;color:#fff;border-radius:20px;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 4px 16px rgba(0,0,0,0.1);font-family:var(--mono);font-size:12px;font-weight:500;z-index:50}
.ft-mini-pulse{width:6px;height:6px;border-radius:50%;background:#fff;animation:tmPulse 1.5s ease infinite}
.ft-mini-time{letter-spacing:.02em}

/* ═══ 2. QUICK INVOICE ═══ */
.qi-panel{width:340px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}
.qi-head{padding:12px 14px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;justify-content:space-between}
.qi-head-left{display:flex;align-items:center;gap:8px}
.qi-head-title{font-size:14px;font-weight:500;color:var(--ink-800)}
.qi-head-num{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
.qi-close{width:22px;height:22px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.qi-client{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--warm-100)}
.qi-client-av{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
.qi-client-info{flex:1}
.qi-client-name{font-size:13px;font-weight:500;color:var(--ink-800)}
.qi-client-email{font-family:var(--mono);font-size:10px;color:var(--ink-300)}
.qi-client-change{font-family:var(--mono);font-size:9px;color:var(--ember);cursor:pointer}
.qi-items{padding:10px 14px;border-bottom:1px solid var(--warm-100)}
.qi-items-head{display:flex;gap:6px;padding-bottom:4px;margin-bottom:4px;border-bottom:1px solid var(--warm-100)}
.qi-items-th{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em}
.qi-item{display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--warm-100)}
.qi-item:last-of-type{border-bottom:none}
.qi-item-desc{flex:1;border:none;outline:none;font-size:12px;font-family:inherit;color:var(--ink-600);background:transparent}
.qi-item-hours{font-family:var(--mono);font-size:10px;color:var(--ink-300);width:50px;text-align:center}
.qi-item-amount{display:flex;align-items:center;width:80px;justify-content:flex-end}
.qi-item-currency{font-family:var(--mono);font-size:11px;color:var(--ink-300)}
.qi-item-amount-input{width:50px;border:none;outline:none;font-family:var(--mono);font-size:12px;font-weight:500;color:var(--ink-800);text-align:right;background:transparent}
.qi-add-item{border:none;background:none;font-size:11px;font-family:inherit;color:var(--ink-300);cursor:pointer;padding:6px 0}
.qi-add-item:hover{color:var(--ember)}
.qi-totals{padding:10px 14px;border-bottom:1px solid var(--warm-100)}
.qi-total-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px;color:var(--ink-500)}
.qi-total-row.main{padding:6px 0;font-weight:500;color:var(--ink-900);font-size:14px;border-top:1px solid var(--warm-200);margin-top:4px}
.qi-total-fee{color:var(--ink-300)}
.qi-settings{padding:8px 14px;border-bottom:1px solid var(--warm-100)}
.qi-setting{display:flex;justify-content:space-between;padding:4px 0;font-size:11px}
.qi-setting-label{color:var(--ink-400)}
.qi-setting-val{font-family:var(--mono);font-size:10px;color:var(--ink-600)}
.qi-actions{padding:10px 14px;display:flex;gap:6px}
.qi-btn{flex:1;padding:8px;border-radius:6px;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;border:none;text-align:center;transition:all .08s}
.qi-btn.secondary{background:#fff;color:var(--ink-500);border:1px solid var(--warm-200)}
.qi-btn.secondary:hover{background:var(--warm-50)}
.qi-btn.primary{background:var(--ink-900);color:#fff}
.qi-btn.primary:hover{background:var(--ink-800)}
.qi-sent{padding:32px 20px;text-align:center}
.qi-sent-icon{width:40px;height:40px;border-radius:50%;background:rgba(90,154,60,0.06);border:1px solid rgba(90,154,60,0.1);color:#5a9a3c;font-size:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px}
.qi-sent-title{font-size:16px;font-weight:500;color:var(--ink-900);margin-bottom:2px}
.qi-sent-sub{font-size:12px;color:var(--ink-400);margin-bottom:12px}
.qi-sent-btn{padding:6px 14px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:11px;font-family:inherit;color:var(--ink-500);cursor:pointer}

/* ═══ 3. CLIENT PULSE ═══ */
.cp-panel{width:280px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden}
.cp-head{padding:12px 14px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;gap:8px}
.cp-head-av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff;flex-shrink:0}
.cp-head-info{flex:1}
.cp-head-name{font-size:14px;font-weight:500;color:var(--ink-900)}
.cp-head-contact{font-size:10px;color:var(--ink-300)}
.cp-head-health{flex-shrink:0}
.cp-tabs{display:flex;gap:1px;padding:4px 6px;border-bottom:1px solid var(--warm-100)}
.cp-tab{flex:1;padding:5px;border-radius:4px;border:none;font-size:10px;font-family:inherit;cursor:pointer;color:var(--ink-400);background:none;text-align:center}
.cp-tab:hover{color:var(--ink-600)}
.cp-tab.on{background:var(--warm-50);color:var(--ink-800);font-weight:500}
.cp-body{padding:10px 14px}
.cp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:10px}
.cp-stat{text-align:center;padding:6px 4px;background:var(--warm-50);border-radius:5px;border:1px solid var(--warm-100)}
.cp-stat-val{font-family:var(--mono);font-size:12px;font-weight:600;line-height:1}
.cp-stat-label{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;margin-top:2px}
.cp-rev{margin-bottom:10px}
.cp-rev-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:4px}
.cp-rev-bar{display:flex;height:6px;border-radius:3px;overflow:hidden;background:var(--warm-200);margin-bottom:4px}
.cp-rev-earned{background:#5a9a3c;border-radius:3px 0 0 3px}
.cp-rev-owed{background:var(--ember)}
.cp-rev-legend{display:flex;gap:8px;font-family:var(--mono);font-size:8px;color:var(--ink-400)}
.cp-rev-dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:2px;vertical-align:middle}
.cp-dates{margin-bottom:10px}
.cp-dates-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:4px}
.cp-date-row{display:flex;justify-content:space-between;padding:3px 0;font-size:11px;border-bottom:1px solid var(--warm-100)}
.cp-date-row:last-child{border-bottom:none}
.cp-date-label{color:var(--ink-400)}
.cp-date-val{font-family:var(--mono);font-size:10px;font-weight:500}
.cp-notes{margin-bottom:6px}
.cp-notes-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;margin-bottom:4px}
.cp-notes-text{font-size:11px;color:var(--ink-500);line-height:1.5}
.cp-act{display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid var(--warm-100);font-size:12px}
.cp-act:last-child{border-bottom:none}
.cp-act-dot{width:4px;height:4px;border-radius:50%;flex-shrink:0}
.cp-act-text{flex:1;color:var(--ink-500)}
.cp-act-time{font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.cp-deadline{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--warm-100);font-size:12px}
.cp-deadline:last-child{border-bottom:none}
.cp-deadline-date{font-family:var(--mono);font-size:10px;font-weight:500;width:40px;flex-shrink:0}
.cp-deadline-text{flex:1;color:var(--ink-600)}
.cp-deadline-urgent{font-family:var(--mono);font-size:9px;color:#c24b38;background:rgba(194,75,56,0.04);padding:1px 5px;border-radius:3px;border:1px solid rgba(194,75,56,0.08)}
.cp-actions{padding:8px 14px;border-top:1px solid var(--warm-100);display:flex;gap:4px}
.cp-act-btn{flex:1;padding:6px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;font-size:10px;font-family:inherit;color:var(--ink-400);cursor:pointer;text-align:center;transition:all .06s}
.cp-act-btn:hover{background:var(--warm-50)}
.cp-act-btn.ember{color:var(--ember);border-color:rgba(176,125,79,0.1);background:var(--ember-bg)}

/* ═══ 4. MESSAGE DRAWER ═══ */
.md-panel{width:320px;background:#fff;border:1px solid var(--warm-200);border-radius:10px;overflow:hidden;display:flex;flex-direction:column;height:420px}
.md-head{padding:10px 12px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;gap:8px}
.md-head-av{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0}
.md-head-info{flex:1}
.md-head-name{font-size:13px;font-weight:500;color:var(--ink-800)}
.md-head-status{display:flex;align-items:center;gap:4px;font-size:10px;color:#5a9a3c}
.md-head-dot{width:5px;height:5px;border-radius:50%;background:#5a9a3c;animation:tmPulse 2s ease infinite}
.md-head-expand,.md-head-close{width:22px;height:22px;border-radius:4px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
.md-head-expand:hover,.md-head-close:hover{background:var(--warm-50)}
.md-messages{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column-reverse;gap:8px}
.md-messages::-webkit-scrollbar{width:3px}
.md-messages::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:2px}
.md-msg{display:flex;align-items:flex-end;gap:6px}
.md-msg.sent{justify-content:flex-end}
.md-msg-av{width:22px;height:22px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:#fff;flex-shrink:0}
.md-msg-bubble{max-width:75%;padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.5}
.md-msg.received .md-msg-bubble{background:var(--warm-50);border:1px solid var(--warm-100);color:var(--ink-700);border-bottom-left-radius:3px}
.md-msg.sent .md-msg-bubble{background:var(--ink-900);color:#fff;border-bottom-right-radius:3px}
.md-msg-meta{display:flex;gap:4px;font-family:var(--mono);font-size:8px;margin-top:3px}
.md-msg.received .md-msg-meta{color:var(--ink-300)}
.md-msg.sent .md-msg-meta{color:rgba(255,255,255,0.35)}
.md-msg-unread{color:var(--ember);font-weight:500}
.md-input{padding:8px 10px;border-top:1px solid var(--warm-100);display:flex;align-items:center;gap:4px}
.md-input-field{flex:1;padding:7px 10px;border:1px solid var(--warm-200);border-radius:6px;font-size:12px;font-family:inherit;color:var(--ink-700);outline:none}
.md-input-field:focus{border-color:var(--ember)}
.md-input-field::placeholder{color:var(--warm-400)}
.md-input-attach{width:28px;height:28px;border-radius:5px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:11px}
.md-input-send{width:28px;height:28px;border-radius:5px;border:none;background:var(--warm-200);color:var(--ink-300);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;transition:all .08s}
.md-input-send.active{background:var(--ink-900);color:#fff}

/* ═══ 5. ACTION BAR ═══ */
.ab-overlay{background:rgba(44,42,37,0.15);border-radius:12px;padding:20px;display:flex;align-items:flex-start;justify-content:center}
.ab-panel{width:100%;max-width:520px;background:#fff;border:1px solid var(--warm-200);border-radius:12px;box-shadow:0 16px 48px rgba(0,0,0,0.08);overflow:hidden}
.ab-input-row{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--warm-100)}
.ab-input-icon{font-size:14px;color:var(--ink-300)}
.ab-input{flex:1;border:none;outline:none;font-size:15px;font-family:inherit;color:var(--ink-800);background:transparent}
.ab-input::placeholder{color:var(--warm-400)}
.ab-input-esc{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:2px 6px;border-radius:3px}
.ab-results{max-height:320px;overflow-y:auto;padding:4px}
.ab-results::-webkit-scrollbar{width:3px}
.ab-results::-webkit-scrollbar-thumb{background:var(--warm-200);border-radius:2px}
.ab-group{margin-bottom:4px}
.ab-group-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;padding:6px 10px 3px}
.ab-item{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;cursor:pointer;transition:all .05s}
.ab-item:hover,.ab-item.sel{background:var(--warm-50)}
.ab-item.sel{background:var(--ember-bg);outline:1px solid rgba(176,125,79,0.06)}
.ab-item-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;border:1px solid}
.ab-item-info{flex:1;min-width:0}
.ab-item-label{font-size:13px;color:var(--ink-800);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ab-item.sel .ab-item-label{font-weight:500}
.ab-item-sub{font-size:10px;color:var(--ink-400)}
.ab-item-enter{font-family:var(--mono);font-size:9px;color:var(--ink-300);background:var(--warm-100);padding:1px 5px;border-radius:3px;flex-shrink:0}
.ab-empty{padding:20px;text-align:center;font-size:13px;color:var(--ink-400)}
.ab-foot{padding:6px 16px;border-top:1px solid var(--warm-100);display:flex;gap:12px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.ab-foot-key{background:var(--warm-100);padding:1px 4px;border-radius:2px;margin-right:2px}
      `}</style>

      <div className="kit"><div className="kit-in">
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ember)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>UI Kit #1</div>
        <div className="kit-title">Workspace Components</div>
        <div className="kit-sub">5 standalone components that make the Workspace self-sufficient. Drop into the layout.</div>

        {/* 1. Timer */}
        <div className="kit-section">
          <div className="kit-label">1 · Floating Timer Bar</div>
          <div className="kit-desc">Docked to any task. Click Start, it counts. Click Stop & Log, it records. Click — to minimize into a floating pill. Always visible. Never lost.</div>
          <div className="kit-preview" style={{ padding: 16 }}>
            <FloatingTimer />
          </div>
        </div>

        {/* 2. Quick Invoice */}
        <div className="kit-section">
          <div className="kit-label">2 · Inline Quick Invoice</div>
          <div className="kit-desc">Slides over the task detail panel. Pre-filled from project data. Edit amounts, hit Send. Click "Send Invoice →" to see the success state.</div>
          <div className="kit-preview kit-preview-dark" style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <QuickInvoice />
          </div>
        </div>

        {/* 3. Client Pulse */}
        <div className="kit-section">
          <div className="kit-label">3 · Client Pulse Panel</div>
          <div className="kit-desc">Shows when no task is selected. The right panel becomes a relationship dashboard. Click between Overview, Activity, and Deadlines tabs.</div>
          <div className="kit-preview kit-preview-dark" style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <ClientPulse />
          </div>
        </div>

        {/* 4. Message Drawer */}
        <div className="kit-section">
          <div className="kit-label">4 · Quick Message Drawer</div>
          <div className="kit-desc">Inline chat with any client. Type a message and press Enter to send. Shows online status, timestamps, and unread indicators. No email switching.</div>
          <div className="kit-preview kit-preview-dark" style={{ padding: 20, display: "flex", justifyContent: "center" }}>
            <MessageDrawer />
          </div>
        </div>

        {/* 5. Action Bar */}
        <div className="kit-section">
          <div className="kit-label">5 · Action Bar · ⌘K</div>
          <div className="kit-desc">Command palette for the 90%. Type natural language: "create invoice," "log 2 hours," "send message to Sarah." Search clients, projects, invoices. Arrow keys navigate, Enter selects.</div>
          <div className="kit-preview" style={{ minHeight: 400 }}>
            <ActionBar />
          </div>
        </div>

      </div></div>
    </>
  );
}
