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
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
        }

        .showcase {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--parchment);
          min-height: 100vh; padding: 40px;
          max-width: 860px; margin: 0 auto;
        }

        .showcase-title {
          font-family: 'Cormorant Garamond', serif; font-size: 28px;
          font-weight: 600; color: var(--ink-900); margin-bottom: 4px;
        }
        .showcase-sub { font-size: 14px; color: var(--ink-400); margin-bottom: 40px; }

        .comp-label {
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 10px; margin-top: 40px;
          display: flex; align-items: center; gap: 8px;
        }
        .comp-label::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        /* ═══ COMMAND BLOCK ═══ */
        .cmd-block {
          border: 1px solid; border-radius: 8px; overflow: hidden;
          margin-bottom: 8px; display: flex; transition: border-color 0.1s;
        }
        .cmd-block:hover { filter: brightness(0.99); }
        .cmd-block-accent { width: 3px; flex-shrink: 0; border-radius: 3px 0 0 3px; }
        .cmd-block-inner { flex: 1; padding: 10px 14px; }
        .cmd-block-head { display: flex; align-items: center; gap: 8px; }
        .cmd-block-prompt { font-family: var(--mono); font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .cmd-block-cmd { font-family: var(--mono); font-size: 13px; color: var(--ink-800); font-weight: 500; flex: 1; }
        .cmd-block-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .cmd-block-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); }
        .cmd-block-dot { width: 6px; height: 6px; border-radius: 50%; }
        .cmd-block-copy, .cmd-block-toggle {
          background: none; border: none; cursor: pointer; color: var(--ink-300);
          padding: 3px; border-radius: 3px; display: flex; align-items: center;
        }
        .cmd-block-copy:hover, .cmd-block-toggle:hover { background: rgba(0,0,0,0.04); color: var(--ink-600); }
        .cmd-block-output {
          font-family: var(--mono); font-size: 12px; color: var(--ink-600);
          line-height: 1.6; margin-top: 8px; padding-top: 8px;
          border-top: 1px solid var(--warm-100); white-space: pre-wrap;
        }

        /* ═══ AI INPUT ═══ */
        .ai-input-wrap { position: relative; margin-bottom: 8px; }
        .ai-input-box {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; border: 1px solid var(--warm-200);
          border-radius: 8px; background: #fff; transition: all 0.15s;
        }
        .ai-input-box.focused { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .ai-input-icon { color: var(--ember); flex-shrink: 0; display: flex; }
        .ai-input { flex: 1; border: none; outline: none; font-family: inherit; font-size: 14px; color: var(--ink-800); background: transparent; }
        .ai-input::placeholder { color: var(--warm-400); }
        .ai-input-hints { flex-shrink: 0; }
        .warp-kbd { font-family: var(--mono); font-size: 10px; color: var(--ink-400); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 2px 5px; }
        .ai-suggestions {
          position: absolute; top: calc(100% + 4px); left: 0; right: 0;
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
          padding: 4px; z-index: 10;
        }
        .ai-sug-item {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.06s;
        }
        .ai-sug-item:hover, .ai-sug-item.active { background: var(--ember-bg); }
        .ai-sug-icon { font-family: var(--mono); font-size: 12px; color: var(--ember); width: 16px; text-align: center; flex-shrink: 0; }
        .ai-sug-info { flex: 1; min-width: 0; }
        .ai-sug-cmd { font-size: 13px; color: var(--ink-800); font-weight: 500; display: block; }
        .ai-sug-desc { font-size: 11px; color: var(--ink-400); display: block; }
        .ai-sug-shortcut { font-family: var(--mono); font-size: 10px; color: var(--ink-300); background: var(--warm-100); padding: 1px 5px; border-radius: 3px; border: 1px solid var(--warm-200); flex-shrink: 0; }

        /* ═══ WORKFLOW CARD ═══ */
        .wf-card {
          border: 1px solid var(--warm-200); border-radius: 8px;
          overflow: hidden; margin-bottom: 8px; transition: border-color 0.1s;
        }
        .wf-card:hover { border-color: var(--warm-300); }
        .wf-card.active { border-color: rgba(176,125,79,0.2); background: var(--ember-bg); }
        .wf-card-head { display: flex; align-items: center; gap: 10px; padding: 12px 14px; }
        .wf-card-icon { color: var(--ember); display: flex; flex-shrink: 0; }
        .wf-card-info { flex: 1; }
        .wf-card-title { font-size: 14px; font-weight: 500; color: var(--ink-800); display: block; }
        .wf-card-meta { font-family: var(--mono); font-size: 10px; color: var(--ink-400); }
        .wf-card-run {
          display: flex; align-items: center; gap: 4px; padding: 5px 12px;
          border-radius: 4px; font-size: 12px; font-weight: 500;
          font-family: inherit; cursor: pointer; background: var(--ink-900);
          color: var(--parchment); border: none; transition: background 0.1s;
        }
        .wf-card-run:hover { background: var(--ink-800); }
        .wf-card-steps { padding: 0 14px 12px; display: flex; flex-direction: column; gap: 2px; }
        .wf-step { display: flex; align-items: center; gap: 8px; padding: 3px 0; }
        .wf-step-num { font-family: var(--mono); font-size: 10px; color: var(--ink-300); width: 18px; flex-shrink: 0; }
        .wf-step-text { font-size: 12.5px; color: var(--ink-600); }

        /* ═══ SPLIT TABS ═══ */
        .split-tabs {
          display: flex; align-items: stretch; height: 36px;
          background: var(--warm-50); border: 1px solid var(--warm-200);
          border-radius: 6px; overflow: hidden;
        }
        .split-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 0 12px; font-size: 12px; color: var(--ink-400);
          cursor: pointer; border-right: 1px solid var(--warm-200);
          transition: background 0.06s; white-space: nowrap;
        }
        .split-tab:hover { background: var(--warm-100); }
        .split-tab.on { background: var(--parchment); color: var(--ink-800); font-weight: 500; }
        .split-tab-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .split-tab-label { overflow: hidden; text-overflow: ellipsis; }
        .split-tab-close { background: none; border: none; cursor: pointer; color: var(--ink-300); display: flex; padding: 2px; border-radius: 3px; }
        .split-tab-close:hover { background: rgba(0,0,0,0.06); color: var(--ink-600); }
        .split-tab-add {
          background: none; border: none; cursor: pointer; color: var(--ink-300);
          padding: 0 10px; display: flex; align-items: center; border-right: 1px solid var(--warm-200);
        }
        .split-tab-add:hover { color: var(--ink-500); background: var(--warm-100); }
        .split-tab-actions { display: flex; align-items: center; gap: 2px; padding: 0 8px; margin-left: auto; }
        .split-action { background: none; border: none; cursor: pointer; color: var(--ink-300); padding: 4px; border-radius: 3px; display: flex; }
        .split-action:hover { color: var(--ink-500); background: var(--warm-100); }

        /* ═══ TOASTS ═══ */
        .toast-stack { display: flex; flex-direction: column; gap: 6px; }
        .toast {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border: 1px solid; border-radius: 8px;
          animation: toastIn 0.25s ease both;
        }
        .toast-accent { width: 3px; align-self: stretch; border-radius: 2px; flex-shrink: 0; }
        .toast-icon { font-family: var(--mono); font-size: 12px; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .toast-body { flex: 1; min-width: 0; }
        .toast-title { font-size: 13px; font-weight: 500; color: var(--ink-800); display: block; }
        .toast-desc { font-size: 11.5px; color: var(--ink-400); display: block; }
        .toast-time { font-family: var(--mono); font-size: 10px; color: var(--ink-300); flex-shrink: 0; }
        .toast-dismiss { background: none; border: none; cursor: pointer; color: var(--ink-300); padding: 4px; border-radius: 3px; display: flex; flex-shrink: 0; }
        .toast-dismiss:hover { background: rgba(0,0,0,0.04); color: var(--ink-600); }
        @keyframes toastIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }

        /* ═══ ACTION BAR ═══ */
        .action-bar {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 8px; background: var(--warm-50);
          border: 1px solid var(--warm-200); border-radius: 8px;
        }
        .action-group { display: flex; align-items: center; gap: 2px; }
        .action-group-label { font-family: var(--mono); font-size: 9px; color: var(--ink-300); text-transform: uppercase; letter-spacing: 0.06em; padding: 0 6px; }
        .action-btn {
          display: flex; align-items: center; gap: 4px; padding: 5px 10px;
          border-radius: 4px; font-size: 12px; font-family: inherit;
          cursor: pointer; border: 1px solid transparent;
          background: none; color: var(--ink-600); transition: all 0.08s;
        }
        .action-btn:hover { background: var(--warm-100); border-color: var(--warm-200); }
        .action-btn.primary { background: var(--ember); color: #fff; border-color: var(--ember); }
        .action-btn.primary:hover { background: var(--ember-light); }
        .action-btn.icon-only { padding: 5px 6px; }
        .action-sep { width: 1px; height: 20px; background: var(--warm-200); margin: 0 4px; }

        /* ═══ PROGRESS TRACKER ═══ */
        .progress-tracker { display: flex; align-items: flex-start; gap: 0; padding: 8px 0; }
        .pt-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
        .pt-dot {
          width: 22px; height: 22px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          z-index: 1; position: relative;
        }
        .pt-step.done .pt-dot { background: #5a9a3c; color: #fff; }
        .pt-step.current .pt-dot { background: var(--ember-bg); border: 2px solid var(--ember); }
        .pt-dot-inner { width: 8px; height: 8px; border-radius: 50%; background: var(--ember); }
        .pt-step.upcoming .pt-dot { background: var(--warm-200); border: 2px solid var(--warm-300); }
        .pt-line {
          position: absolute; top: 11px; left: calc(50% + 11px);
          width: calc(100% - 22px); height: 2px;
        }
        .pt-step.done .pt-line { background: #5a9a3c; }
        .pt-step.current .pt-line { background: var(--warm-300); }
        .pt-step.upcoming .pt-line { background: var(--warm-200); }
        .pt-label { font-family: var(--mono); font-size: 10px; margin-top: 6px; letter-spacing: 0.02em; }
        .pt-step.done .pt-label { color: #5a9a3c; }
        .pt-step.current .pt-label { color: var(--ember); font-weight: 500; }
        .pt-step.upcoming .pt-label { color: var(--ink-300); }

        /* ═══ STAT BLOCKS ═══ */
        .stat-blocks { display: flex; gap: 8px; }
        .sblock {
          flex: 1; padding: 14px 16px; border: 1px solid var(--warm-200);
          border-radius: 8px; background: var(--parchment); transition: border-color 0.1s;
        }
        .sblock:hover { border-color: var(--warm-300); }
        .sblock-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .sblock-label { font-family: var(--mono); font-size: 10px; color: var(--ink-400); text-transform: uppercase; letter-spacing: 0.06em; }
        .sblock-change { font-family: var(--mono); font-size: 11px; font-weight: 500; }
        .sblock-change.up { color: #5a9a3c; }
        .sblock-change.down { color: #c24b38; }
        .sblock-value { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: var(--ink-900); line-height: 1; }
        .sblock-sub { font-size: 11px; color: var(--ink-400); margin-top: 2px; }
        .sblock-bar { height: 3px; background: var(--warm-200); border-radius: 2px; margin-top: 10px; overflow: hidden; }
        .sblock-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
      `}</style>

      <div className="showcase">
        <h1 className="showcase-title">Warp UI Components</h1>
        <p className="showcase-sub">Felmark design tokens · drop-in React components</p>

        <div className="comp-label">Command Blocks</div>
        <CommandBlock command="felmark send-invoice --client meridian --amount 2400" output={"Invoice #047 created\nSent to sarah@meridianstudio.com\nPayment link: https://pay.tryfelmark.com/inv-047"} status="success" timestamp="11:42am" />
        <CommandBlock command="felmark export --format pdf --project brand-guidelines" status="running" timestamp="11:43am" />
        <CommandBlock command="felmark deploy --env production" output="Error: Missing Stripe API key in environment" status="error" timestamp="11:40am" />

        <div className="comp-label">AI Command Input</div>
        <AICommandInput />

        <div className="comp-label">Workflow Cards</div>
        <WorkflowCard title="New Client Onboarding" steps={["Create workspace", "Generate proposal template", "Send welcome email", "Schedule kickoff"]} lastRun="2d ago" runs={12} active />
        <WorkflowCard title="Monthly Invoice Run" steps={["Calculate hours", "Generate invoices for active projects", "Send via Stripe"]} lastRun="28d ago" runs={6} />

        <div className="comp-label">Split Tab Bar</div>
        <SplitTabBar />

        <div className="comp-label">Progress Tracker</div>
        <ProgressTracker />

        <div className="comp-label">Stat Blocks</div>
        <StatBlocks />

        <div className="comp-label">Notification Toasts</div>
        <ToastStack />

        <div className="comp-label">Action Bar</div>
        <ActionBar />
      </div>
    </>
  );
}
