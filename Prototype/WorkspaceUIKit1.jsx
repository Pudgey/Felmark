import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK WORKSPACE — UI KIT #1
   5 components. Each standalone. Drop anywhere.
   Prototype reference — not production code.
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
      <div className="ft-bar-time">
        <span className="ft-bar-time-val">{fmt}</span>
        {running && <span className="ft-bar-time-label">Recording</span>}
        {!running && seconds > 0 && <span className="ft-bar-time-label">Paused</span>}
      </div>
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
      <div className="qi-head">
        <div className="qi-head-left">
          <span className="qi-head-title">Quick Invoice</span>
          <span className="qi-head-num">INV-049</span>
        </div>
        <button className="qi-close">✕</button>
      </div>
      <div className="qi-client">
        <div className="qi-client-av" style={{ background: "#7c8594" }}>M</div>
        <div className="qi-client-info">
          <div className="qi-client-name">Meridian Studio</div>
          <div className="qi-client-email">sarah@meridian.co</div>
        </div>
        <span className="qi-client-change">Change</span>
      </div>
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
      <div className="qi-totals">
        <div className="qi-total-row"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
        <div className="qi-total-row"><span>Felmark fee (2.9%)</span><span className="qi-total-fee">-${Math.round(total * 0.029).toLocaleString()}</span></div>
        <div className="qi-total-row main"><span>Total</span><span>${total.toLocaleString()}</span></div>
      </div>
      <div className="qi-settings">
        <div className="qi-setting"><span className="qi-setting-label">Due date</span><span className="qi-setting-val">Net 15 · Apr 15, 2026</span></div>
        <div className="qi-setting"><span className="qi-setting-label">Payment</span><span className="qi-setting-val">Card / ACH via Stripe</span></div>
      </div>
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
      <div className="cp-tabs">
        {["overview", "activity", "deadlines"].map(t => (
          <button key={t} className={`cp-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {tab === "overview" && (
        <div className="cp-body">
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
      <div className="md-head">
        <div className="md-head-av" style={{ background: "#7c8594" }}>M</div>
        <div className="md-head-info">
          <div className="md-head-name">Meridian Studio</div>
          <div className="md-head-status"><span className="md-head-dot" /> Sarah is online</div>
        </div>
        <button className="md-head-expand" title="Open full view">↗</button>
        <button className="md-head-close">✕</button>
      </div>
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
                    <div key={idx} className={`ab-item${isSel ? " sel" : ""}`} onMouseEnter={() => setSelected(idx)}>
                      <div className="ab-item-icon" style={{ color: cmd.color, background: cmd.color + "08", borderColor: cmd.color + "15" }}>{cmd.icon}</div>
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
          {filtered.length === 0 && <div className="ab-empty">No results for "{query}"</div>}
        </div>
        <div className="ab-foot">
          <span className="ab-foot-hint"><span className="ab-foot-key">↑↓</span> navigate</span>
          <span className="ab-foot-hint"><span className="ab-foot-key">↵</span> select</span>
          <span className="ab-foot-hint"><span className="ab-foot-key">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}

export default function UIKit1() {
  return (
    <div>
      <h2>UI Kit 1 — Prototype Reference</h2>
      <p>See individual components: FloatingTimer, QuickInvoice, ClientPulse, MessageDrawer, ActionBar</p>
    </div>
  );
}
