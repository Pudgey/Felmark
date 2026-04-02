import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#faf9f7",
  bgBlock: "#ffffff",
  bgHover: "#f5f4f0",
  bgInput: "#ffffff",
  border: "#e5e2db",
  borderLight: "#d5d1c8",
  text: "#2c2a25",
  textMuted: "#7d7a72",
  textDim: "#b5b2a9",
  keyword: "#7c3aed",
  string: "#16a34a",
  number: "#c2410c",
  func: "#2563eb",
  type: "#0891b2",
  operator: "#0284c7",
  error: "#dc2626",
  warning: "#d97706",
  success: "#16a34a",
  info: "#2563eb",
  ember: "#b07d4f",
  emberDim: "#9b7345",
  accent: "#2563eb",
  selection: "rgba(176,125,79,0.06)",
};

const SLASH_COMMANDS = [
  { cmd: "/invoice", desc: "Create a new invoice", cat: "money", icon: "$" },
  { cmd: "/proposal", desc: "Generate proposal from template", cat: "docs", icon: "◆" },
  { cmd: "/status", desc: "Show all project statuses", cat: "projects", icon: "●" },
  { cmd: "/rate", desc: "Calculate effective hourly rate", cat: "money", icon: "↗" },
  { cmd: "/client", desc: "Quick client lookup", cat: "clients", icon: "◎" },
  { cmd: "/time", desc: "Log time to current project", cat: "time", icon: "▶" },
  { cmd: "/scope", desc: "Insert scope boundary block", cat: "docs", icon: "◇" },
  { cmd: "/pipeline", desc: "View deal pipeline summary", cat: "projects", icon: "☰" },
  { cmd: "/wire", desc: "Check latest Wire signals", cat: "intel", icon: "★" },
  { cmd: "/export", desc: "Export current document", cat: "docs", icon: "↗" },
];

function Hl({ children, c }) {
  return <span style={{ color: c }}>{children}</span>;
}

function getBlocks() {
  return [
    {
      id: 1, type: "welcome",
      output: (
        <div className="ft-welcome">
          <div className="ft-welcome-logo">
            <span className="ft-welcome-mark">◆</span>
            <span className="ft-welcome-name">Felmark Terminal</span>
            <span className="ft-welcome-ver">v1.0</span>
          </div>
          <div className="ft-welcome-sub">
            <Hl c={C.textMuted}>Type </Hl><Hl c={C.string}>/</Hl><Hl c={C.textMuted}> for commands · </Hl>
            <Hl c={C.keyword}>Tab</Hl><Hl c={C.textMuted}> to autocomplete · </Hl>
            <Hl c={C.func}>↑↓</Hl><Hl c={C.textMuted}> for history</Hl>
          </div>
        </div>
      ),
    },
    {
      id: 2, type: "command", cmd: "/status",
      output: (
        <div className="ft-out">
          <div className="ft-table">
            <div className="ft-table-head">
              <span className="ft-th" style={{ width: 140 }}>Project</span>
              <span className="ft-th" style={{ width: 100 }}>Client</span>
              <span className="ft-th" style={{ width: 70 }}>Status</span>
              <span className="ft-th" style={{ width: 70, textAlign: "right" }}>Value</span>
            </div>
            {[
              { name: "Brand Guidelines v2", client: "Meridian", status: "active", sC: C.success, value: "$4,200" },
              { name: "Course Landing Page", client: "Nora Kim", status: "active", sC: C.success, value: "$3,200" },
              { name: "App Onboarding", client: "Bolt", status: "overdue", sC: C.error, value: "$4,000" },
              { name: "Brand Identity", client: "Luna", status: "lead", sC: C.info, value: "$6,500" },
            ].map((r, i) => (
              <div key={i} className="ft-table-row">
                <span className="ft-td" style={{ width: 140 }}><Hl c={C.text}>{r.name}</Hl></span>
                <span className="ft-td" style={{ width: 100 }}><Hl c={C.textMuted}>{r.client}</Hl></span>
                <span className="ft-td" style={{ width: 70 }}><span className="ft-status-dot" style={{ background: r.sC }} /><Hl c={r.sC}>{r.status}</Hl></span>
                <span className="ft-td" style={{ width: 70, textAlign: "right" }}><Hl c={C.number}>{r.value}</Hl></span>
              </div>
            ))}
          </div>
          <div className="ft-summary">
            <Hl c={C.textMuted}>4 projects · </Hl><Hl c={C.success}>2 active</Hl>
            <Hl c={C.textMuted}> · </Hl><Hl c={C.error}>1 overdue</Hl>
            <Hl c={C.textMuted}> · </Hl><Hl c={C.info}>1 lead</Hl>
            <Hl c={C.textMuted}> · Total: </Hl><Hl c={C.number}>$17,900</Hl>
          </div>
        </div>
      ),
    },
    {
      id: 3, type: "command", cmd: "/rate",
      output: (
        <div className="ft-out">
          <div className="ft-rate-card">
            <div className="ft-rate-row"><Hl c={C.textMuted}>Revenue (Mar)</Hl><Hl c={C.number}>$14,800</Hl></div>
            <div className="ft-rate-row"><Hl c={C.textMuted}>Hours tracked</Hl><Hl c={C.text}>132h</Hl></div>
            <div className="ft-rate-divider" />
            <div className="ft-rate-row main"><Hl c={C.text}>Effective rate</Hl><Hl c={C.success}>$112.12/hr</Hl></div>
            <div className="ft-rate-bar"><div className="ft-rate-bar-fill" style={{ width: "74%" }} /><div className="ft-rate-bar-target" /></div>
            <div className="ft-rate-bar-labels"><Hl c={C.textDim}>$0</Hl><Hl c={C.warning}>Target: $150</Hl></div>
          </div>
          <div className="ft-ai-hint">
            <span className="ft-ai-badge">AI</span>
            <Hl c={C.textMuted}>You're 25% below target. Bolt Fitness is dragging your rate — 42h on a $4k project = $95/hr effective.</Hl>
          </div>
        </div>
      ),
    },
    {
      id: 4, type: "command", cmd: "/wire",
      output: (
        <div className="ft-out">
          <div className="ft-wire-header">
            <Hl c={C.keyword}>◆ The Wire</Hl>
            <span className="ft-wire-live"><span className="ft-wire-dot" />live</span>
          </div>
          {[
            { rel: 96, title: "Brand identity demand up 34% in SaaS", type: "opportunity", tC: C.success },
            { rel: 89, title: "3 competitors dropped brand services", type: "market gap", tC: C.info },
            { rel: 84, title: "Meridian may need Phase 2 work", type: "client signal", tC: C.ember },
          ].map((s, i) => (
            <div key={i} className="ft-wire-signal">
              <div className="ft-wire-rel" style={{ color: s.rel >= 90 ? C.success : C.warning }}>{s.rel}%</div>
              <div className="ft-wire-info">
                <div className="ft-wire-title"><Hl c={C.text}>{s.title}</Hl></div>
                <span className="ft-wire-type" style={{ color: s.tC, borderColor: s.tC + "25" }}>{s.type}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];
}

export default function FelmarkTerminal() {
  const [blocks, setBlocks] = useState(getBlocks);
  const [input, setInput] = useState("");
  const [showSlash, setShowSlash] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [selSlash, setSelSlash] = useState(0);
  const [aiSug, setAiSug] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [blocks]);

  useEffect(() => {
    if (input.startsWith("/")) { setShowSlash(true); setSlashFilter(input.slice(1).toLowerCase()); setSelSlash(0); }
    else { setShowSlash(false); }
    if (input.length > 3 && !input.startsWith("/")) {
      const m = { inv: "Try /invoice create --client \"Meridian\" --amount 4800", cre: "Try /proposal new --template brand-identity", how: "Try /rate or /status for quick insights", tim: "Try /time log --project \"Brand Guidelines\" --hours 2.5" };
      const k = Object.keys(m).find(k => input.toLowerCase().startsWith(k));
      setAiSug(k ? m[k] : null);
    } else setAiSug(null);
  }, [input]);

  const filtered = SLASH_COMMANDS.filter(c => c.cmd.slice(1).includes(slashFilter) || c.desc.toLowerCase().includes(slashFilter));

  const run = (cmd) => {
    const b = { id: Date.now(), type: "command", cmd, output: null };

    if (cmd === "/pipeline") {
      b.output = (
        <div className="ft-out">
          <div className="ft-pipeline">
            {[
              { stage: "Lead", count: 2, value: "$9,700", color: C.info, pct: 25 },
              { stage: "Proposal", count: 1, value: "$6,500", color: C.keyword, pct: 15 },
              { stage: "Negotiation", count: 0, value: "$0", color: C.warning, pct: 0 },
              { stage: "Active", count: 2, value: "$7,400", color: C.success, pct: 40 },
              { stage: "Complete", count: 3, value: "$12,600", color: C.textMuted, pct: 20 },
            ].map((s, i) => (
              <div key={i} className="ft-pipeline-row">
                <span className="ft-pipeline-stage"><Hl c={s.color}>{s.stage}</Hl></span>
                <div className="ft-pipeline-bar"><div className="ft-pipeline-fill" style={{ width: `${s.pct}%`, background: s.color }} /></div>
                <span className="ft-pipeline-count"><Hl c={C.textMuted}>{s.count}</Hl></span>
                <span className="ft-pipeline-val"><Hl c={s.pct > 0 ? C.number : C.textDim}>{s.value}</Hl></span>
              </div>
            ))}
          </div>
          <div className="ft-summary"><Hl c={C.textMuted}>Total: </Hl><Hl c={C.number}>$36,200</Hl><Hl c={C.textMuted}> · Weighted: </Hl><Hl c={C.success}>$18,400</Hl></div>
        </div>
      );
    } else if (cmd.startsWith("/client")) {
      b.output = (
        <div className="ft-out">
          <div className="ft-client-header">
            <div className="ft-client-av">M</div>
            <div><div><Hl c={C.text}>Meridian Studio</Hl></div><div><Hl c={C.textMuted}>Sarah Chen · sarah@meridian.co</Hl></div></div>
          </div>
          <div className="ft-client-stats">
            {[{ l: "Lifetime", v: "$18,400", c: C.number }, { l: "Projects", v: "6", c: C.text }, { l: "Avg rate", v: "$118/hr", c: C.success }, { l: "Last active", v: "2h ago", c: C.text }].map((s, i) => (
              <div key={i} className="ft-client-stat"><Hl c={C.textMuted}>{s.l}</Hl><Hl c={s.c}>{s.v}</Hl></div>
            ))}
          </div>
        </div>
      );
    } else if (cmd.startsWith("/time")) {
      b.output = (
        <div className="ft-out">
          <div style={{ marginBottom: 4 }}><Hl c={C.success}>✓ </Hl><Hl c={C.text}>Logged </Hl><Hl c={C.number}>2.5h</Hl><Hl c={C.text}> to </Hl><Hl c={C.func}>Brand Guidelines v2</Hl></div>
          <div style={{ fontSize: 11 }}><Hl c={C.textMuted}>Today: </Hl><Hl c={C.text}>6.5h</Hl><Hl c={C.textMuted}> · Week: </Hl><Hl c={C.text}>32h</Hl><Hl c={C.textMuted}> · Budget: </Hl><Hl c={C.number}>84h / 100h</Hl></div>
          <div className="ft-rate-bar" style={{ marginTop: 8 }}><div className="ft-rate-bar-fill" style={{ width: "84%", background: C.warning }} /></div>
          <div className="ft-ai-hint" style={{ marginTop: 8 }}><span className="ft-ai-badge">AI</span><Hl c={C.textMuted}>84% of budget consumed with ~70% deliverables complete. Consider a scope conversation.</Hl></div>
        </div>
      );
    } else if (cmd === "clear") { setBlocks([]); return; }
    else {
      b.output = (<div className="ft-out"><Hl c={C.error}>Unknown: </Hl><Hl c={C.text}>{cmd}</Hl><div style={{ marginTop: 4 }}><Hl c={C.textMuted}>Type </Hl><Hl c={C.string}>/</Hl><Hl c={C.textMuted}> for commands</Hl></div></div>);
    }
    setBlocks(p => [...p, b]);
  };

  const submit = () => {
    if (!input.trim()) return;
    if (showSlash && filtered.length > 0) run(filtered[selSlash].cmd);
    else run(input.trim());
    setInput(""); setShowSlash(false);
  };

  const handleKey = (e) => {
    if (showSlash) {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelSlash(p => Math.min(p + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelSlash(p => Math.max(p - 1, 0)); }
      if (e.key === "Tab") { e.preventDefault(); if (filtered[selSlash]) { setInput(filtered[selSlash].cmd + " "); setShowSlash(false); } }
    }
    if (e.key === "Enter") { e.preventDefault(); submit(); }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Outfit:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}

.ft{font-family:'JetBrains Mono',monospace;font-size:12px;background:${C.bg};color:${C.text};width:380px;height:100vh;display:flex;flex-direction:column;border-left:1px solid ${C.border}}

.ft-head{padding:9px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${C.border};background:${C.bgBlock};flex-shrink:0}
.ft-head-left{display:flex;align-items:center;gap:6px}
.ft-head-tabs{display:flex;gap:1px;background:${C.bg};border-radius:5px;padding:2px}
.ft-head-tab{padding:4px 10px;border-radius:4px;font-size:11px;border:none;cursor:pointer;transition:all .08s;background:transparent;color:${C.textMuted};font-family:inherit}
.ft-head-tab.on{background:${C.bgBlock};color:${C.text};box-shadow:0 1px 2px rgba(0,0,0,0.04)}
.ft-head-tab:hover{color:${C.text}}
.ft-head-right{display:flex;gap:3px}
.ft-head-btn{width:22px;height:22px;border-radius:4px;border:1px solid ${C.border};background:${C.bgBlock};color:${C.textMuted};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .08s;font-family:inherit}
.ft-head-btn:hover{background:${C.bgHover};color:${C.text}}

.ft-blocks{flex:1;overflow-y:auto;padding:6px 0}
.ft-blocks::-webkit-scrollbar{width:4px}
.ft-blocks::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
.ft-blocks::-webkit-scrollbar-track{background:transparent}

/* Block */
.ft-block{margin:0 6px 5px;border-radius:8px;overflow:hidden;border:1px solid ${C.border};background:${C.bgBlock};transition:border-color .1s}
.ft-block:hover{border-color:${C.borderLight}}

.ft-block-cmd{padding:7px 10px;display:flex;align-items:center;gap:6px;border-bottom:1px solid ${C.border};background:${C.bg}}
.ft-block-prompt{color:${C.ember};font-weight:500;flex-shrink:0}
.ft-block-text{color:${C.text};flex:1;font-weight:500}
.ft-block-copy{width:20px;height:20px;border-radius:4px;border:none;background:transparent;color:${C.textDim};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;opacity:0;transition:all .1s;font-family:inherit;flex-shrink:0}
.ft-block:hover .ft-block-copy{opacity:1}
.ft-block-copy:hover{background:${C.bgHover};color:${C.text}}
.ft-block-output{padding:10px 12px}

/* Welcome */
.ft-welcome{padding:2px 0}
.ft-welcome-logo{display:flex;align-items:center;gap:6px;margin-bottom:3px}
.ft-welcome-mark{color:${C.ember};font-size:14px}
.ft-welcome-name{color:${C.text};font-weight:500;font-size:13px}
.ft-welcome-ver{color:${C.textDim};font-size:10px}
.ft-welcome-sub{font-size:11px;line-height:1.5}

.ft-out{font-size:12px;line-height:1.6}
.ft-summary{margin-top:8px;padding-top:8px;border-top:1px solid ${C.border};font-size:11px}

/* Table */
.ft-table{font-size:11px}
.ft-table-head{display:flex;gap:4px;padding:3px 0;border-bottom:1px solid ${C.border};margin-bottom:2px}
.ft-th{color:${C.textDim};font-size:9px;text-transform:uppercase;letter-spacing:.04em}
.ft-table-row{display:flex;gap:4px;padding:3px 0;border-radius:3px;transition:background .06s}
.ft-table-row:hover{background:${C.selection}}
.ft-td{display:flex;align-items:center;gap:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ft-status-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}

/* Rate */
.ft-rate-card{padding:2px 0}
.ft-rate-row{display:flex;justify-content:space-between;padding:3px 0;font-size:12px}
.ft-rate-row.main{padding:5px 0;font-weight:500}
.ft-rate-divider{height:1px;background:${C.border};margin:3px 0}
.ft-rate-bar{height:4px;background:${C.border};border-radius:2px;overflow:visible;margin-top:6px;position:relative}
.ft-rate-bar-fill{height:100%;border-radius:2px;background:${C.success};transition:width .3s}
.ft-rate-bar-target{position:absolute;right:0;top:-3px;width:1px;height:10px;background:${C.warning}}
.ft-rate-bar-labels{display:flex;justify-content:space-between;margin-top:3px;font-size:10px}

/* AI hint */
.ft-ai-hint{display:flex;align-items:flex-start;gap:6px;padding:8px 10px;background:rgba(37,99,235,0.03);border:1px solid rgba(37,99,235,0.06);border-radius:6px;margin-top:8px;font-size:11px;line-height:1.5}
.ft-ai-badge{font-size:9px;font-weight:600;color:${C.accent};background:rgba(37,99,235,0.06);padding:1px 5px;border-radius:3px;flex-shrink:0;margin-top:1px}

/* Wire */
.ft-wire-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}
.ft-wire-live{display:flex;align-items:center;gap:4px;font-size:10px;color:${C.success}}
.ft-wire-dot{width:4px;height:4px;border-radius:50%;background:${C.success};animation:wd 1.5s ease infinite}
@keyframes wd{0%,60%,100%{opacity:.3}15%{opacity:1}}
.ft-wire-signal{display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid ${C.border}}
.ft-wire-signal:last-child{border-bottom:none}
.ft-wire-rel{font-size:11px;font-weight:500;flex-shrink:0;width:32px}
.ft-wire-info{flex:1;min-width:0}
.ft-wire-title{font-size:12px;margin-bottom:2px}
.ft-wire-type{font-size:9px;padding:1px 5px;border:1px solid;border-radius:3px}

/* Pipeline */
.ft-pipeline{margin-bottom:4px}
.ft-pipeline-row{display:flex;align-items:center;gap:6px;padding:3px 0;font-size:11px}
.ft-pipeline-stage{width:80px;flex-shrink:0}
.ft-pipeline-bar{flex:1;height:4px;background:${C.border};border-radius:2px;overflow:hidden}
.ft-pipeline-fill{height:100%;border-radius:2px}
.ft-pipeline-count{width:20px;text-align:center;flex-shrink:0}
.ft-pipeline-val{width:55px;text-align:right;flex-shrink:0}

/* Client */
.ft-client-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.ft-client-av{width:32px;height:32px;border-radius:7px;background:${C.border};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:${C.textMuted}}
.ft-client-stats{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.ft-client-stat{padding:6px 8px;background:${C.bg};border-radius:5px;border:1px solid ${C.border};font-size:11px;display:flex;flex-direction:column;gap:1px}

/* Input area */
.ft-input-area{border-top:1px solid ${C.border};background:${C.bgBlock};padding:8px 8px;flex-shrink:0;position:relative}

.ft-ai-ghost{padding:4px 8px 5px;font-size:11px;color:${C.textMuted};display:flex;align-items:center;gap:5px;cursor:pointer;border-radius:4px;margin-bottom:4px;transition:background .08s}
.ft-ai-ghost:hover{background:${C.bgHover}}
.ft-ai-ghost-badge{font-size:8px;font-weight:600;color:${C.accent};background:rgba(37,99,235,0.06);padding:1px 4px;border-radius:2px}
.ft-ai-ghost-key{font-size:9px;color:${C.textDim};background:${C.bg};border:1px solid ${C.border};padding:0 4px;border-radius:2px;margin-left:auto;flex-shrink:0}

.ft-input-row{display:flex;align-items:center;gap:6px;background:${C.bg};border:1px solid ${C.border};border-radius:7px;padding:6px 10px;transition:border-color .12s}
.ft-input-row:focus-within{border-color:${C.ember}}
.ft-input-prompt{color:${C.ember};font-weight:500;flex-shrink:0}
.ft-input{flex:1;background:transparent;border:none;outline:none;color:${C.text};font-family:'JetBrains Mono',monospace;font-size:12px;caret-color:${C.ember}}
.ft-input::placeholder{color:${C.textDim}}
.ft-input-send{width:22px;height:22px;border-radius:5px;border:1px solid ${C.border};background:${C.bgBlock};color:${C.textMuted};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;transition:all .08s;font-family:inherit;flex-shrink:0}
.ft-input-send:hover{background:${C.ember};border-color:${C.ember};color:#fff}

/* Slash dropdown */
.ft-slash{position:absolute;bottom:100%;left:6px;right:6px;background:${C.bgBlock};border:1px solid ${C.border};border-radius:8px;box-shadow:0 -6px 24px rgba(0,0,0,0.06);max-height:240px;overflow-y:auto;padding:4px;margin-bottom:4px}
.ft-slash::-webkit-scrollbar{width:4px}
.ft-slash::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
.ft-slash-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:5px;cursor:pointer;transition:background .06s}
.ft-slash-item:hover,.ft-slash-item.sel{background:${C.bgHover}}
.ft-slash-item.sel{background:rgba(176,125,79,0.04);outline:1px solid rgba(176,125,79,0.08)}
.ft-slash-item-icon{width:24px;height:24px;border-radius:5px;background:${C.bg};border:1px solid ${C.border};display:flex;align-items:center;justify-content:center;font-size:10px;color:${C.textMuted};flex-shrink:0;transition:all .08s}
.ft-slash-item.sel .ft-slash-item-icon{border-color:rgba(176,125,79,0.12);color:${C.ember}}
.ft-slash-item-info{flex:1;min-width:0}
.ft-slash-item-cmd{font-size:12px;color:${C.text};font-weight:500}
.ft-slash-item-desc{font-size:10px;color:${C.textMuted}}
.ft-slash-item-cat{font-size:9px;color:${C.textDim};background:${C.bg};padding:1px 5px;border-radius:3px;flex-shrink:0;border:1px solid ${C.border}}
.ft-slash-foot{padding:5px 8px;border-top:1px solid ${C.border};margin-top:2px;display:flex;gap:10px;font-size:9px;color:${C.textDim}}
.ft-slash-key{background:${C.bg};border:1px solid ${C.border};padding:0 3px;border-radius:2px}

.ft-foot{padding:5px 12px;border-top:1px solid ${C.border};display:flex;justify-content:space-between;font-size:9px;color:${C.textDim};background:${C.bgBlock};flex-shrink:0}
.ft-foot-left{display:flex;align-items:center;gap:4px}
.ft-foot-dot{width:4px;height:4px;border-radius:50%;background:${C.success}}
      `}</style>

      <div className="ft">
        <div className="ft-head">
          <div className="ft-head-left">
            <div className="ft-head-tabs">
              <button className="ft-head-tab on">Terminal</button>
              <button className="ft-head-tab">Output</button>
              <button className="ft-head-tab">AI</button>
            </div>
          </div>
          <div className="ft-head-right">
            <button className="ft-head-btn">⊞</button>
            <button className="ft-head-btn">□</button>
            <button className="ft-head-btn">✕</button>
          </div>
        </div>

        <div className="ft-blocks" ref={scrollRef}>
          {blocks.map(b => (
            <div key={b.id} className="ft-block">
              {b.type === "command" && (
                <div className="ft-block-cmd">
                  <span className="ft-block-prompt">❯</span>
                  <span className="ft-block-text">{b.cmd}</span>
                  <button className="ft-block-copy">⊏</button>
                </div>
              )}
              <div className="ft-block-output">{b.output}</div>
            </div>
          ))}
        </div>

        <div className="ft-input-area">
          {showSlash && filtered.length > 0 && (
            <div className="ft-slash">
              {filtered.map((c, i) => (
                <div key={c.cmd} className={`ft-slash-item${i === selSlash ? " sel" : ""}`}
                  onClick={() => { run(c.cmd); setInput(""); setShowSlash(false); inputRef.current?.focus(); }}
                  onMouseEnter={() => setSelSlash(i)}>
                  <div className="ft-slash-item-icon">{c.icon}</div>
                  <div className="ft-slash-item-info">
                    <div className="ft-slash-item-cmd">{c.cmd}</div>
                    <div className="ft-slash-item-desc">{c.desc}</div>
                  </div>
                  <span className="ft-slash-item-cat">{c.cat}</span>
                </div>
              ))}
              <div className="ft-slash-foot">
                <span><span className="ft-slash-key">↑↓</span> navigate</span>
                <span><span className="ft-slash-key">Tab</span> complete</span>
                <span><span className="ft-slash-key">⏎</span> run</span>
              </div>
            </div>
          )}

          {aiSug && !showSlash && (
            <div className="ft-ai-ghost" onClick={() => setInput(aiSug.replace("Try ", ""))}>
              <span className="ft-ai-ghost-badge">AI</span>
              <span>{aiSug}</span>
              <span className="ft-ai-ghost-key">Tab</span>
            </div>
          )}

          <div className="ft-input-row">
            <span className="ft-input-prompt">❯</span>
            <input ref={inputRef} className="ft-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type / for commands..." autoFocus />
            <button className="ft-input-send" onClick={submit}>↵</button>
          </div>
        </div>

        <div className="ft-foot">
          <div className="ft-foot-left"><span className="ft-foot-dot" /><span>Brand Guidelines v2 · Meridian</span></div>
          <span>{SLASH_COMMANDS.length} commands</span>
        </div>
      </div>
    </>
  );
}
