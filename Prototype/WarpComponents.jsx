import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════
   FELMARK × WARP UI COMPONENT LIBRARY
   Standalone components — drop anywhere
   ═══════════════════════════════════════ */

/* ─── 1. COMMAND BLOCK ───
   Warp's signature: every action is a discrete block
   with its own toolbar, status, and copy action */

function CommandBlock({ command, output, status = "success", timestamp = "now", copyable = true }) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const statusColors = {
    success: { dot: "#5a9a3c", bg: "rgba(90,154,60,0.04)", border: "rgba(90,154,60,0.12)", accent: "#5a9a3c" },
    error: { dot: "#c24b38", bg: "rgba(194,75,56,0.04)", border: "rgba(194,75,56,0.12)", accent: "#c24b38" },
    running: { dot: "#b07d4f", bg: "rgba(176,125,79,0.04)", border: "rgba(176,125,79,0.12)", accent: "#b07d4f" },
    warning: { dot: "#c89360", bg: "rgba(200,147,96,0.04)", border: "rgba(200,147,96,0.12)", accent: "#c89360" },
  };

  const s = statusColors[status];

  return (
    <div className="cmd-block" style={{ background: s.bg, borderColor: s.border }}>
      <div className="cmd-block-accent" style={{ background: s.accent }} />
      <div className="cmd-block-inner">
        <div className="cmd-block-head">
          <span className="cmd-block-prompt" style={{ color: s.accent }}>❯</span>
          <span className="cmd-block-cmd">{command}</span>
          <div className="cmd-block-actions">
            <span className="cmd-block-time">{timestamp}</span>
            <span className="cmd-block-dot" style={{ background: s.dot }} />
            {copyable && (
              <button className="cmd-block-copy" onClick={() => copy(output || command)}>
                {copied ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#5a9a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1"/><path d="M8 4V2.5a1 1 0 00-1-1H2.5a1 1 0 00-1 1V7a1 1 0 001 1H4" stroke="currentColor" strokeWidth="1.1"/></svg>
                )}
              </button>
            )}
            {output && (
              <button className="cmd-block-toggle" onClick={() => setCollapsed(!collapsed)}>
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.12s" }}>
                  <path d="M2.5 3.5l2.5 3 2.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            )}
          </div>
        </div>
        {output && !collapsed && (
          <div className="cmd-block-output">{output}</div>
        )}
      </div>
    </div>
  );
}

/* ─── 2. AI COMMAND INPUT ───
   Warp's AI-powered command search with suggestions */

function AICommandInput() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions] = useState([
    { id: 1, cmd: "Create new proposal", desc: "Generate from project scope", type: "action", shortcut: "⌘⇧P" },
    { id: 2, cmd: "Send invoice #047", desc: "Meridian Studio — $2,400", type: "action", shortcut: "⌘⇧I" },
    { id: 3, cmd: "Export as PDF", desc: "Current document", type: "action", shortcut: "⌘⇧E" },
    { id: 4, cmd: "Switch to Bolt Fitness", desc: "3 active projects", type: "navigate", shortcut: "⌘J" },
  ]);

  const filtered = value
    ? suggestions.filter(s => s.cmd.toLowerCase().includes(value.toLowerCase()))
    : suggestions;

  return (
    <div className="ai-input-wrap">
      <div className={`ai-input-box${focused ? " focused" : ""}`}>
        <div className="ai-input-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        </div>
        <input className="ai-input" placeholder="Ask AI or type a command..."
          value={value} onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} />
        <div className="ai-input-hints">
          <kbd className="warp-kbd">⌘K</kbd>
        </div>
      </div>
      {focused && filtered.length > 0 && (
        <div className="ai-suggestions">
          {filtered.map((s, i) => (
            <div key={s.id} className={`ai-sug-item${i === 0 ? " active" : ""}`}>
              <div className="ai-sug-icon">{s.type === "action" ? "▸" : "↳"}</div>
              <div className="ai-sug-info">
                <span className="ai-sug-cmd">{s.cmd}</span>
                <span className="ai-sug-desc">{s.desc}</span>
              </div>
              <span className="ai-sug-shortcut">{s.shortcut}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── 3. WORKFLOW CARD ───
   Saved reusable workflows — Warp's workflow feature */

function WorkflowCard({ title, steps, lastRun, runs, active = false, onRun }) {
  return (
    <div className={`wf-card${active ? " active" : ""}`}>
      <div className="wf-card-head">
        <div className="wf-card-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l3-2h4l3 2v4l-3 2H5l-3-2V4z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/></svg>
        </div>
        <div className="wf-card-info">
          <span className="wf-card-title">{title}</span>
          <span className="wf-card-meta">{runs} runs · last {lastRun}</span>
        </div>
        <button className="wf-card-run" onClick={onRun}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 1.5l6 3.5-6 3.5z" fill="currentColor"/></svg>
          Run
        </button>
      </div>
      <div className="wf-card-steps">
        {steps.map((step, i) => (
          <div key={i} className="wf-step">
            <span className="wf-step-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="wf-step-text">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 4. SPLIT TAB BAR ───
   Warp's split pane tabs with drag and add */

function SplitTabBar() {
  const [tabs, setTabs] = useState([
    { id: 1, label: "Brand Guidelines", active: true, status: "active" },
    { id: 2, label: "Nora — Landing Page", active: false, status: "idle" },
    { id: 3, label: "Bolt — Onboarding", active: false, status: "error" },
  ]);

  const activate = (id) => setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
  const close = (id) => setTabs(prev => {
    const n = prev.filter(t => t.id !== id);
    if (n.length && !n.some(t => t.active)) n[0].active = true;
    return n;
  });

  const statusDot = { active: "#5a9a3c", idle: "#9b988f", error: "#c24b38" };

  return (
    <div className="split-tabs">
      {tabs.map(t => (
        <div key={t.id} className={`split-tab${t.active ? " on" : ""}`} onClick={() => activate(t.id)}>
          <span className="split-tab-dot" style={{ background: statusDot[t.status] }} />
          <span className="split-tab-label">{t.label}</span>
          <button className="split-tab-close" onClick={e => { e.stopPropagation(); close(t.id); }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
      <button className="split-tab-add">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
      </button>
      <div className="split-tab-actions">
        <button className="split-action" title="Split horizontal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M7 2v10" stroke="currentColor" strokeWidth="1.1"/></svg>
        </button>
        <button className="split-action" title="Split vertical">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M1.5 7h11" stroke="currentColor" strokeWidth="1.1"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ─── 5. NOTIFICATION TOASTS ───
   Warp-style toast notifications */

function ToastStack() {
  const [toasts, setToasts] = useState([
    { id: 1, type: "success", title: "Invoice sent", desc: "Meridian Studio — #047", time: "2s ago", visible: true },
    { id: 2, type: "info", title: "Jamie approved revision", desc: "Typography section — a3f7c1", time: "5m ago", visible: true },
    { id: 3, type: "warning", title: "Bolt Fitness overdue", desc: "App Onboarding UX — 4 days", time: "1h ago", visible: true },
  ]);

  const dismiss = (id) => setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));

  const typeStyles = {
    success: { icon: "✓", accent: "#5a9a3c", bg: "rgba(90,154,60,0.04)", border: "rgba(90,154,60,0.12)" },
    error: { icon: "✕", accent: "#c24b38", bg: "rgba(194,75,56,0.04)", border: "rgba(194,75,56,0.12)" },
    warning: { icon: "!", accent: "#c89360", bg: "rgba(200,147,96,0.04)", border: "rgba(200,147,96,0.12)" },
    info: { icon: "i", accent: "#7c8594", bg: "rgba(124,133,148,0.04)", border: "rgba(124,133,148,0.12)" },
  };

  return (
    <div className="toast-stack">
      {toasts.filter(t => t.visible).map((toast, i) => {
        const s = typeStyles[toast.type];
        return (
          <div key={toast.id} className="toast" style={{ background: s.bg, borderColor: s.border, animationDelay: `${i * 0.08}s` }}>
            <div className="toast-accent" style={{ background: s.accent }} />
            <div className="toast-icon" style={{ color: s.accent }}>{s.icon}</div>
            <div className="toast-body">
              <span className="toast-title">{toast.title}</span>
              <span className="toast-desc">{toast.desc}</span>
            </div>
            <span className="toast-time">{toast.time}</span>
            <button className="toast-dismiss" onClick={() => dismiss(toast.id)}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ─── 6. ACTION BAR ───
   Warp's contextual action bar with grouped actions */

function ActionBar() {
  return (
    <div className="action-bar">
      <div className="action-group">
        <span className="action-group-label">File</span>
        <button className="action-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> New</button>
        <button className="action-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1"/></svg> Save</button>
        <button className="action-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 8.5V10h1.5L10 4.5 8.5 3 3 8.5z" stroke="currentColor" strokeWidth="1"/><path d="M7.5 4l1 1" stroke="currentColor" strokeWidth="1"/></svg> Edit</button>
      </div>
      <div className="action-sep" />
      <div className="action-group">
        <span className="action-group-label">Share</span>
        <button className="action-btn"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 7l4-4M8 3v3.5M8 3H4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7v2.5a1 1 0 01-1 1H3a1 1 0 01-1-1V5.5a1 1 0 011-1H5.5" stroke="currentColor" strokeWidth="1"/></svg> Link</button>
        <button className="action-btn primary"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6l4.5 4.5L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Send</button>
      </div>
      <div className="action-sep" />
      <div className="action-group">
        <button className="action-btn icon-only" title="More"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor"/><circle cx="7" cy="7" r="1" fill="currentColor"/><circle cx="11" cy="7" r="1" fill="currentColor"/></svg></button>
      </div>
    </div>
  );
}

/* ─── 7. PROGRESS TRACKER ───
   Warp-style inline progress with steps */

function ProgressTracker() {
  const steps = [
    { label: "Draft", status: "done" },
    { label: "Review", status: "done" },
    { label: "Approved", status: "current" },
    { label: "Sent", status: "upcoming" },
    { label: "Signed", status: "upcoming" },
  ];

  return (
    <div className="progress-tracker">
      {steps.map((step, i) => (
        <div key={i} className={`pt-step ${step.status}`}>
          <div className="pt-dot">
            {step.status === "done" ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : step.status === "current" ? (
              <div className="pt-dot-inner" />
            ) : null}
          </div>
          {i < steps.length - 1 && <div className="pt-line" />}
          <span className="pt-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── 8. STAT BLOCKS ───
   Warp-style metric blocks with sparkline energy */

function StatBlocks() {
  const stats = [
    { label: "Revenue", value: "$14,750", change: "+12%", up: true, sub: "this month" },
    { label: "Active", value: "4", change: "+1", up: true, sub: "projects" },
    { label: "Overdue", value: "1", change: "−2", up: false, sub: "from last week" },
    { label: "Hours", value: "86h", change: "+4h", up: true, sub: "logged" },
  ];

  return (
    <div className="stat-blocks">
      {stats.map((s, i) => (
        <div key={i} className="sblock">
          <div className="sblock-head">
            <span className="sblock-label">{s.label}</span>
            <span className={`sblock-change ${s.up ? "up" : "down"}`}>{s.change}</span>
          </div>
          <div className="sblock-value">{s.value}</div>
          <div className="sblock-sub">{s.sub}</div>
          <div className="sblock-bar">
            <div className="sblock-bar-fill" style={{ width: `${40 + i * 15}%`, background: s.label === "Overdue" ? "#c24b38" : "var(--ember)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════
   SHOWCASE — all components
   ═══════════════════════ */

export default function WarpComponents() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      {/* Full CSS + showcase JSX — see prototype file */}
    </>
  );
}
