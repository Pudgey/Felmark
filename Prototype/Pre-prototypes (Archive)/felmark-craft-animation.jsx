import { useState, useEffect, useRef } from "react";

/* ─── The crafting sequence ─── */
const PHASES = [
  { type: "header", text: "◆ Crafting your project..." },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark init --project \"Brand Guidelines v2\"" },
  { type: "output", text: "  Initializing project workspace...", delay: 400 },
  { type: "success", text: "  ✓ Workspace created", delay: 300 },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark scaffold --template proposal" },
  { type: "output", text: "  Generating project structure...", delay: 350 },
  { type: "tree", lines: [
    "  ├── Introduction",
    "  ├── Scope of Work",
    "  ├── Timeline",
    "  ├── Pricing",
    "  ├── Terms & Conditions",
    "  └── Signature",
  ], lineDelay: 120 },
  { type: "success", text: "  ✓ 6 sections scaffolded", delay: 200 },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark link --workspace \"Meridian Studio\"" },
  { type: "output", text: "  Connecting to client workspace...", delay: 400 },
  { type: "output", text: "  Syncing client details...", delay: 300 },
  { type: "output", text: "  Loading previous project context...", delay: 350 },
  { type: "success", text: "  ✓ Linked to Meridian Studio", delay: 200 },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark configure --defaults" },
  { type: "kv", pairs: [
    ["  Client", "Sarah Chen"],
    ["  Rate", "$95/hr"],
    ["  Currency", "USD"],
    ["  Payment", "50/50 split"],
    ["  Revisions", "2 included"],
  ], lineDelay: 100 },
  { type: "success", text: "  ✓ Defaults applied from workspace", delay: 200 },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark ai --generate-brief" },
  { type: "output", text: "  Reading workspace notes...", delay: 300 },
  { type: "output", text: "  Analyzing 4 previous projects...", delay: 400 },
  { type: "output", text: "  Drafting introduction...", delay: 500 },
  { type: "ai-text", text: "  \"Hi Sarah — based on our conversation about refreshing\n   the brand identity, here's my proposed approach for\n   the Brand Guidelines v2 project.\"", charDelay: 18 },
  { type: "success", text: "  ✓ AI brief generated from context", delay: 200 },
  { type: "blank" },
  { type: "cmd", text: "❯ felmark ready" },
  { type: "blank" },
  { type: "complete", text: "  ◆ Project ready. Opening editor..." },
];

/* ─── Typing simulation for a single line ─── */
function useTypewriter(text, speed = 20, startTyping = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!startTyping) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, startTyping]);

  return { displayed, done };
}

/* ─── Single animated line ─── */
function AnimatedLine({ item, onDone, active }) {
  const [show, setShow] = useState(false);
  const [treeLines, setTreeLines] = useState([]);
  const [kvPairs, setKvPairs] = useState([]);
  const { displayed: typedCmd, done: cmdDone } = useTypewriter(
    item.type === "cmd" ? item.text : "",
    22,
    active && item.type === "cmd"
  );
  const { displayed: typedAi, done: aiDone } = useTypewriter(
    item.type === "ai-text" ? item.text : "",
    item.charDelay || 18,
    active && item.type === "ai-text"
  );

  useEffect(() => {
    if (!active) return;

    if (item.type === "blank") {
      setTimeout(() => { setShow(true); onDone(); }, 80);
      return;
    }
    if (item.type === "header" || item.type === "output" || item.type === "success" || item.type === "complete") {
      const d = item.delay || 150;
      setTimeout(() => { setShow(true); setTimeout(onDone, d); }, 50);
      return;
    }
    if (item.type === "tree") {
      let i = 0;
      const iv = setInterval(() => {
        setTreeLines(prev => [...prev, item.lines[i]]);
        i++;
        if (i >= item.lines.length) { clearInterval(iv); setTimeout(onDone, 150); }
      }, item.lineDelay || 120);
      setShow(true);
      return () => clearInterval(iv);
    }
    if (item.type === "kv") {
      let i = 0;
      const iv = setInterval(() => {
        setKvPairs(prev => [...prev, item.pairs[i]]);
        i++;
        if (i >= item.pairs.length) { clearInterval(iv); setTimeout(onDone, 150); }
      }, item.lineDelay || 100);
      setShow(true);
      return () => clearInterval(iv);
    }
    if (item.type === "cmd") { setShow(true); }
    if (item.type === "ai-text") { setShow(true); }
  }, [active]);

  useEffect(() => { if (cmdDone && item.type === "cmd") onDone(); }, [cmdDone]);
  useEffect(() => { if (aiDone && item.type === "ai-text") onDone(); }, [aiDone]);

  if (!show && item.type !== "cmd" && item.type !== "ai-text") return null;
  if (!active && !show) return null;

  const cls = `line ${item.type}`;

  if (item.type === "blank") return <div className="line-blank" />;

  if (item.type === "header") return (
    <div className={`${cls} fade-in`}>{item.text}</div>
  );

  if (item.type === "cmd") return (
    <div className={cls}>
      {typedCmd}<span className="cursor" style={{ opacity: cmdDone ? 0 : 1 }}>▊</span>
    </div>
  );

  if (item.type === "output") return (
    <div className={`${cls} fade-in`}>{item.text}</div>
  );

  if (item.type === "success") return (
    <div className={`${cls} fade-in`}>{item.text}</div>
  );

  if (item.type === "tree") return (
    <div className={cls}>
      {treeLines.map((l, i) => <div key={i} className="tree-line fade-in">{l}</div>)}
    </div>
  );

  if (item.type === "kv") return (
    <div className={cls}>
      {kvPairs.map(([k, v], i) => (
        <div key={i} className="kv-line fade-in">
          <span className="kv-key">{k}</span>
          <span className="kv-sep">→</span>
          <span className="kv-val">{v}</span>
        </div>
      ))}
    </div>
  );

  if (item.type === "ai-text") return (
    <div className={cls}>
      {typedAi}<span className="cursor ai-cursor" style={{ opacity: aiDone ? 0 : 1 }}>▊</span>
    </div>
  );

  if (item.type === "complete") return (
    <div className={`${cls} fade-in`}>{item.text}</div>
  );

  return null;
}

/* ═══ Main Component ═══ */
export default function ProjectCraftAnimation() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const scrollRef = useRef(null);
  const linesRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (linesRef.current) {
      linesRef.current.scrollTop = linesRef.current.scrollHeight;
    }
  }, [currentIdx]);

  const advance = () => {
    if (currentIdx < PHASES.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      setFinished(true);
      setTimeout(() => setShowEditor(true), 600);
    }
  };

  // Progress
  const progress = Math.round((currentIdx / (PHASES.length - 1)) * 100);

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
          --green: #5a9a3c; --red: #c24b38;
        }

        .craft-screen {
          font-family: 'Outfit', sans-serif;
          background: var(--ink-900);
          height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle radial glow */
        .craft-screen::before {
          content: '';
          position: absolute;
          top: 30%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(176,125,79,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Noise */
        .craft-screen::after {
          content: '';
          position: absolute; inset: 0;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        /* ── Start screen ── */
        .start-screen {
          text-align: center;
          animation: fadeInUp 0.5s ease;
        }
        .start-logo {
          margin-bottom: 32px;
        }
        .start-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 600; color: var(--warm-200);
          margin-bottom: 8px;
        }
        .start-sub {
          font-size: 14px; color: var(--ink-500);
          margin-bottom: 32px;
        }
        .start-input-row {
          display: flex; gap: 8px; max-width: 400px;
          margin: 0 auto 16px;
        }
        .start-input {
          flex: 1; padding: 12px 16px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px; background: rgba(255,255,255,0.03);
          font-family: inherit; font-size: 15px; color: var(--warm-200);
          outline: none; transition: border-color 0.15s;
        }
        .start-input:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.1); }
        .start-input::placeholder { color: var(--ink-500); }
        .start-btn {
          padding: 12px 28px; border-radius: 6px; border: none;
          background: var(--ember); color: #fff; font-size: 15px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          transition: background 0.15s; white-space: nowrap;
        }
        .start-btn:hover { background: var(--ember-light); }
        .start-hint {
          font-family: var(--mono); font-size: 11px; color: var(--ink-600);
        }
        .start-hint kbd {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 3px; padding: 1px 5px; margin: 0 2px;
        }

        /* ── Terminal window ── */
        .terminal {
          width: 100%; max-width: 640px;
          background: rgba(15,15,14,0.9);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03);
          overflow: hidden;
          animation: terminalIn 0.4s ease;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 1;
        }

        @keyframes terminalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .terminal-head {
          display: flex; align-items: center; padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          gap: 8px;
        }
        .terminal-dots { display: flex; gap: 6px; }
        .terminal-dot { width: 10px; height: 10px; border-radius: 50%; }
        .terminal-dot.r { background: #ff5f57; }
        .terminal-dot.y { background: #febc2e; }
        .terminal-dot.g { background: #28c840; }
        .terminal-title {
          flex: 1; text-align: center;
          font-family: var(--mono); font-size: 11px; color: var(--ink-500);
        }
        .terminal-progress-wrap { width: 80px; height: 3px; background: rgba(255,255,255,0.04); border-radius: 2px; overflow: hidden; }
        .terminal-progress { height: 100%; background: var(--ember); border-radius: 2px; transition: width 0.3s ease; }

        .terminal-body {
          padding: 20px; min-height: 360px; max-height: 420px;
          overflow-y: auto; font-family: var(--mono); font-size: 13px;
          line-height: 1.7; color: var(--ink-400);
        }
        .terminal-body::-webkit-scrollbar { width: 3px; }
        .terminal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

        .terminal-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 16px; border-top: 1px solid rgba(255,255,255,0.04);
          font-family: var(--mono); font-size: 10px; color: var(--ink-600);
        }
        .terminal-pct { color: var(--ember); font-weight: 500; }

        /* ── Line styles ── */
        .line { margin-bottom: 1px; }
        .line-blank { height: 8px; }

        .line.header {
          color: var(--ember-light); font-weight: 500;
          font-size: 14px; margin-bottom: 4px;
        }

        .line.cmd { color: var(--warm-200); font-weight: 400; }

        .line.output { color: var(--ink-500); }

        .line.success { color: var(--green); }

        .line.complete {
          color: var(--ember-light); font-weight: 500;
          font-size: 14px; margin-top: 4px;
        }

        .line.tree { color: var(--ink-500); }
        .tree-line { padding-left: 0; }

        .kv-line { display: flex; gap: 8px; }
        .kv-key { color: var(--ink-500); min-width: 100px; }
        .kv-sep { color: var(--ink-600); }
        .kv-val { color: var(--warm-200); }

        .line.ai-text {
          color: var(--ember-light); font-style: italic;
          white-space: pre-wrap; line-height: 1.6;
        }

        .cursor {
          display: inline-block; color: var(--ember);
          animation: blink 0.8s step-end infinite;
          margin-left: 1px; font-size: 12px;
        }
        .ai-cursor { color: var(--ember-light); }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .fade-in {
          animation: fadeInLine 0.2s ease;
        }
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Editor reveal ── */
        .editor-reveal {
          position: absolute; inset: 0;
          background: var(--parchment);
          display: flex; align-items: center; justify-content: center;
          animation: editorReveal 0.8s ease forwards;
          z-index: 10;
        }
        @keyframes editorReveal {
          0% { clip-path: circle(0% at 50% 50%); opacity: 0; }
          50% { opacity: 1; }
          100% { clip-path: circle(150% at 50% 50%); opacity: 1; }
        }
        .editor-ready {
          text-align: center;
          animation: fadeInUp 0.5s ease 0.3s both;
        }
        .editor-ready-icon { margin-bottom: 16px; }
        .editor-ready-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px; font-weight: 600; color: var(--ink-900);
          margin-bottom: 8px;
        }
        .editor-ready-sub {
          font-size: 14px; color: var(--ink-500);
          margin-bottom: 24px;
        }
        .editor-ready-btn {
          padding: 10px 32px; border-radius: 6px; border: none;
          background: var(--ember); color: #fff; font-size: 15px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          transition: background 0.15s;
        }
        .editor-ready-btn:hover { background: var(--ember-light); }
        .editor-ready-meta {
          font-family: var(--mono); font-size: 11px; color: var(--ink-400);
          margin-top: 12px;
        }
      `}</style>

      <div className="craft-screen">
        {!started && (
          <div className="start-screen">
            <div className="start-logo">
              <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember)" strokeWidth="1.2" />
                <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember)" opacity="0.12" />
                <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember)" strokeWidth="0.8" />
              </svg>
            </div>
            <h1 className="start-title">Create a new project</h1>
            <p className="start-sub">Give it a name and we'll craft the rest</p>
            <div className="start-input-row">
              <input className="start-input" placeholder="Brand Guidelines v2..." autoFocus
                onKeyDown={e => { if (e.key === "Enter") setStarted(true); }} />
              <button className="start-btn" onClick={() => setStarted(true)}>Create</button>
            </div>
            <p className="start-hint">Press <kbd>⏎</kbd> to begin</p>
          </div>
        )}

        {started && !showEditor && (
          <div className="terminal">
            <div className="terminal-head">
              <div className="terminal-dots">
                <div className="terminal-dot r" />
                <div className="terminal-dot y" />
                <div className="terminal-dot g" />
              </div>
              <span className="terminal-title">felmark — crafting project</span>
              <div className="terminal-progress-wrap">
                <div className="terminal-progress" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="terminal-body" ref={linesRef}>
              {PHASES.map((item, i) => (
                <AnimatedLine
                  key={i}
                  item={item}
                  active={i === currentIdx}
                  onDone={advance}
                />
              ))}
            </div>

            <div className="terminal-footer">
              <span>felmark v0.1.0</span>
              <span className="terminal-pct">{progress}%</span>
            </div>
          </div>
        )}

        {showEditor && (
          <div className="editor-reveal">
            <div className="editor-ready">
              <div className="editor-ready-icon">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="26" stroke="var(--ember)" strokeWidth="1.5" />
                  <path d="M20 28l5 5 11-11" stroke="var(--ember)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="editor-ready-title">Brand Guidelines v2</h2>
              <p className="editor-ready-sub">Your project is ready. 6 sections scaffolded, AI brief generated.</p>
              <button className="editor-ready-btn">Open in Editor</button>
              <p className="editor-ready-meta">Meridian Studio · Created just now · $0.00 billed</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
