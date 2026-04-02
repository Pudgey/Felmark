import { useState, useEffect, useRef } from "react";

const PHASES = [
  {
    type: "thinking",
    lines: [
      { text: "Analyzing workspace context...", delay: 0 },
      { text: "Client: Meridian Studio", delay: 400 },
      { text: "Template: Brand & Identity", delay: 700 },
    ],
    duration: 1200,
  },
  {
    type: "command",
    prompt: "felmark create-project",
    flags: '--client "Meridian Studio" --template brand --name "Brand Guidelines v2"',
    delay: 400,
  },
  {
    type: "progress",
    label: "Scaffolding project",
    steps: [
      { text: "Creating workspace structure", icon: "folder", delay: 0 },
      { text: "Setting up document tree", icon: "file", delay: 500 },
      { text: "Initializing block editor", icon: "edit", delay: 900 },
      { text: "Loading template: Brand & Identity", icon: "template", delay: 1300 },
    ],
    duration: 2000,
  },
  {
    type: "files",
    label: "Generated files",
    items: [
      { name: "proposal.fm", size: "2.4 KB", status: "created", delay: 0 },
      { name: "scope-of-work.fm", size: "1.8 KB", status: "created", delay: 200 },
      { name: "timeline.fm", size: "0.9 KB", status: "created", delay: 400 },
      { name: "pricing.fm", size: "1.1 KB", status: "created", delay: 600 },
      { name: "contract.fm", size: "3.2 KB", status: "created", delay: 800 },
      { name: ".felmark/config.yml", size: "0.4 KB", status: "created", delay: 1000 },
    ],
    duration: 1500,
  },
  {
    type: "config",
    label: "Configuration",
    lines: [
      { key: "project_id", value: "prj_a3f7c1d9", delay: 0 },
      { key: "workspace", value: "Meridian Studio", delay: 150 },
      { key: "status", value: "active", delay: 300 },
      { key: "created_at", value: "2026-03-29T11:42:00Z", delay: 450 },
      { key: "template", value: "brand-identity-v2", delay: 600 },
      { key: "payment_terms", value: "50% upfront, 50% on delivery", delay: 750 },
      { key: "revision_tracking", value: "enabled", delay: 900 },
    ],
    duration: 1200,
  },
  {
    type: "ai",
    label: "AI pre-filling from client context",
    lines: [
      { text: "Reading previous Meridian conversations...", delay: 0 },
      { text: "Found 3 relevant notes, 1 mood board, 2 reference links", delay: 600 },
      { text: "Pre-filling scope from discovery call transcript", delay: 1100 },
      { text: "Suggesting pricing based on similar past projects ($2,200–$2,600)", delay: 1700 },
      { text: "Timeline auto-set: 4 weeks (based on your avg delivery time)", delay: 2200 },
    ],
    duration: 2800,
  },
  {
    type: "success",
    title: "Brand Guidelines v2",
    subtitle: "Meridian Studio",
    stats: [
      { label: "Documents", value: "5" },
      { label: "Est. Value", value: "$2,400" },
      { label: "Due", value: "Apr 28" },
      { label: "Timeline", value: "4 weeks" },
    ],
  },
];

function TypingText({ text, speed = 20, delay = 0, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  if (!started) return null;
  return <>{displayed}<span className="cursor-blink">│</span></>;
}

function ProgressBar({ duration = 2000, delay = 0, onDone }) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const frame = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(frame);
      else onDone?.();
    };
    requestAnimationFrame(frame);
  }, [started, duration]);

  if (!started) return null;
  const width = Math.round(progress * 100);
  const filled = Math.round(progress * 28);
  const empty = 28 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  return (
    <span className="progress-mono">
      [{bar}] {width}%
    </span>
  );
}

export default function ProjectCreationAnimation() {
  const [phase, setPhase] = useState(-1); // -1 = form, 0+ = animation phases
  const [visibleLines, setVisibleLines] = useState(new Set());
  const [allDone, setAllDone] = useState(false);
  const [projectName, setProjectName] = useState("Brand Guidelines v2");
  const [clientName, setClientName] = useState("Meridian Studio");
  const [template, setTemplate] = useState("brand");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [phase, visibleLines]);

  const startAnimation = () => {
    setPhase(0);
    let currentPhase = 0;
    const advancePhase = () => {
      if (currentPhase >= PHASES.length - 1) {
        setAllDone(true);
        return;
      }
      const p = PHASES[currentPhase];
      const dur = p.duration || 1500;
      setTimeout(() => {
        currentPhase++;
        setPhase(currentPhase);
        advancePhase();
      }, dur + 600);
    };
    advancePhase();
  };

  const showLine = (key) => {
    setTimeout(() => setVisibleLines(prev => new Set([...prev, key])), 0);
  };

  const TEMPLATES = [
    { id: "brand", label: "Brand & Identity", icon: "◆" },
    { id: "web", label: "Web Design", icon: "◇" },
    { id: "content", label: "Content & Copy", icon: "☰" },
    { id: "blank", label: "Blank Project", icon: "○" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --parchment: #faf9f7; --warm-50: #f7f6f3; --warm-100: #f0eee9;
          --warm-200: #e5e2db; --warm-300: #d5d1c8; --warm-400: #b8b3a8;
          --ink-900: #2c2a25; --ink-800: #3d3a33; --ink-700: #4f4c44;
          --ink-600: #65625a; --ink-500: #7d7a72; --ink-400: #9b988f; --ink-300: #b5b2a9;
          --ember: #b07d4f; --ember-light: #c89360; --ember-bg: rgba(176,125,79,0.08);
          --mono: 'JetBrains Mono', monospace;
          --green: #5a9a3c; --red: #c24b38; --blue: #5b7fa4;
        }

        .creation {
          font-family: 'Outfit', sans-serif; font-size: 14px;
          color: var(--ink-700); background: var(--ink-900);
          height: 100vh; display: flex; align-items: center; justify-content: center;
        }

        /* ── Modal ── */
        .create-modal {
          width: 620px; max-height: 90vh; background: var(--parchment);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04);
          display: flex; flex-direction: column;
        }

        /* ── Form state ── */
        .form-head {
          padding: 24px 28px 16px;
          border-bottom: 1px solid var(--warm-200);
        }
        .form-badge {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--ember); letter-spacing: 0.1em; text-transform: uppercase;
          margin-bottom: 8px;
        }
        .form-title {
          font-family: 'Cormorant Garamond', serif; font-size: 24px;
          font-weight: 600; color: var(--ink-900); line-height: 1.2;
        }
        .form-sub { font-size: 13px; color: var(--ink-400); margin-top: 4px; }

        .form-body { padding: 20px 28px 24px; }
        .form-field { margin-bottom: 16px; }
        .form-label { font-size: 12px; font-weight: 500; color: var(--ink-600); margin-bottom: 5px; display: block; }
        .form-input {
          width: 100%; padding: 10px 14px; border: 1px solid var(--warm-200);
          border-radius: 6px; font-family: inherit; font-size: 15px;
          color: var(--ink-800); outline: none; background: #fff;
        }
        .form-input:focus { border-color: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.06); }
        .form-row { display: flex; gap: 12px; }
        .form-row > * { flex: 1; }

        .template-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .template-card {
          padding: 14px; border: 1px solid var(--warm-200); border-radius: 8px;
          cursor: pointer; transition: all 0.1s; display: flex; align-items: center; gap: 10px;
        }
        .template-card:hover { border-color: var(--warm-300); background: var(--warm-50); }
        .template-card.on { border-color: var(--ember); background: var(--ember-bg); }
        .template-icon {
          width: 32px; height: 32px; border-radius: 6px;
          background: var(--warm-100); border: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--ink-500); flex-shrink: 0;
        }
        .template-card.on .template-icon { background: var(--ember-bg); border-color: rgba(176,125,79,0.15); color: var(--ember); }
        .template-name { font-size: 13px; font-weight: 500; color: var(--ink-800); }

        .form-foot {
          padding: 14px 28px; border-top: 1px solid var(--warm-200);
          display: flex; justify-content: space-between; align-items: center;
        }
        .form-hint { font-family: var(--mono); font-size: 10px; color: var(--ink-300); display: flex; align-items: center; gap: 4px; }
        .form-kbd { font-family: var(--mono); font-size: 9px; color: var(--ink-400); background: var(--warm-100); border: 1px solid var(--warm-200); border-radius: 3px; padding: 1px 5px; }
        .form-create-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 9px 24px; border-radius: 6px; border: none;
          background: var(--ember); color: #fff; font-size: 14px;
          font-weight: 500; font-family: inherit; cursor: pointer;
          transition: background 0.1s;
        }
        .form-create-btn:hover { background: var(--ember-light); }
        .form-cancel {
          padding: 9px 18px; border-radius: 6px; border: 1px solid var(--warm-200);
          background: none; color: var(--ink-600); font-size: 13px;
          font-family: inherit; cursor: pointer;
        }
        .form-cancel:hover { background: var(--warm-100); }

        /* ═══ TERMINAL STATE ═══ */
        .term-wrap {
          background: var(--ink-900); flex: 1; overflow: hidden;
          display: flex; flex-direction: column; border-radius: 0 0 14px 14px;
        }
        .term-header {
          padding: 14px 20px; display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
        }
        .term-dots { display: flex; gap: 6px; }
        .term-dot { width: 10px; height: 10px; border-radius: 50%; }
        .term-title-bar {
          flex: 1; text-align: center; font-family: var(--mono);
          font-size: 11px; color: rgba(255,255,255,0.25);
        }

        .term-body {
          flex: 1; overflow-y: auto; padding: 16px 20px 24px;
          font-family: var(--mono); font-size: 12.5px; line-height: 1.7;
        }
        .term-body::-webkit-scrollbar { width: 4px; }
        .term-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

        /* Thinking */
        .t-thinking { margin-bottom: 16px; }
        .t-think-label {
          color: rgba(255,255,255,0.25); font-size: 10px;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
          display: flex; align-items: center; gap: 6px;
        }
        .t-think-spinner { animation: spin 1s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .t-think-line { color: rgba(255,255,255,0.4); animation: fadeSlideIn 0.3s ease both; }

        /* Command */
        .t-command { margin-bottom: 16px; display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; }
        .t-prompt { color: var(--ember); font-weight: 500; flex-shrink: 0; }
        .t-cmd-text { color: rgba(255,255,255,0.85); font-weight: 500; }
        .t-cmd-flags { color: rgba(255,255,255,0.35); }

        /* Progress steps */
        .t-progress { margin-bottom: 16px; }
        .t-prog-label { color: rgba(255,255,255,0.25); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .t-prog-step { display: flex; align-items: center; gap: 8px; padding: 3px 0; animation: fadeSlideIn 0.3s ease both; }
        .t-prog-check { color: var(--green); font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }
        .t-prog-text { color: rgba(255,255,255,0.55); }
        .t-prog-bar { margin-top: 6px; }
        .progress-mono { color: var(--ember); font-size: 11px; }

        /* Files */
        .t-files { margin-bottom: 16px; }
        .t-files-label { color: rgba(255,255,255,0.25); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .t-file { display: flex; align-items: center; gap: 8px; padding: 3px 0; animation: fadeSlideIn 0.25s ease both; }
        .t-file-status { font-size: 10px; padding: 1px 5px; border-radius: 2px; flex-shrink: 0; }
        .t-file-status.created { background: rgba(90,154,60,0.12); color: var(--green); }
        .t-file-name { color: rgba(255,255,255,0.7); flex: 1; }
        .t-file-size { color: rgba(255,255,255,0.2); font-size: 11px; }

        /* Config */
        .t-config { margin-bottom: 16px; }
        .t-config-label { color: rgba(255,255,255,0.25); font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        .t-config-line { padding: 2px 0; animation: fadeSlideIn 0.2s ease both; }
        .t-config-key { color: var(--blue); }
        .t-config-sep { color: rgba(255,255,255,0.15); }
        .t-config-val { color: rgba(255,255,255,0.55); }

        /* AI */
        .t-ai { margin-bottom: 16px; }
        .t-ai-label {
          color: var(--ember); font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 6px;
          display: flex; align-items: center; gap: 6px;
        }
        .t-ai-sparkle { font-size: 13px; }
        .t-ai-line { color: rgba(255,255,255,0.45); padding: 2px 0; animation: fadeSlideIn 0.3s ease both; }
        .t-ai-highlight { color: var(--ember-light); }

        /* Success */
        .t-success {
          margin-top: 8px; padding: 20px; border: 1px solid rgba(176,125,79,0.15);
          border-radius: 10px; background: rgba(176,125,79,0.03);
          animation: successReveal 0.5s ease both;
        }
        .t-success-check {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(90,154,60,0.1); border: 1px solid rgba(90,154,60,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--green); font-size: 18px; margin-bottom: 12px;
        }
        .t-success-title {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 2px;
        }
        .t-success-sub { font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 16px; }
        .t-success-stats { display: flex; gap: 12px; margin-bottom: 16px; }
        .t-success-stat {
          flex: 1; padding: 10px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04); border-radius: 6px; text-align: center;
        }
        .t-stat-val { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.8); font-family: var(--mono); }
        .t-stat-val.ember { color: var(--ember-light); }
        .t-stat-label { font-size: 9px; color: rgba(255,255,255,0.25); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

        .t-success-actions { display: flex; gap: 8px; }
        .t-open-btn {
          flex: 1; padding: 10px; border-radius: 6px; border: none;
          background: var(--ember); color: #fff; font-size: 13px;
          font-weight: 500; font-family: 'Outfit', sans-serif; cursor: pointer;
          transition: background 0.1s;
        }
        .t-open-btn:hover { background: var(--ember-light); }
        .t-secondary-btn {
          padding: 10px 18px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.08);
          background: none; color: rgba(255,255,255,0.5); font-size: 13px;
          font-family: 'Outfit', sans-serif; cursor: pointer;
          transition: all 0.1s;
        }
        .t-secondary-btn:hover { border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); }

        /* Cursor blink */
        .cursor-blink { animation: blink 0.8s step-end infinite; color: var(--ember); font-weight: 300; }
        @keyframes blink { 50% { opacity: 0; } }

        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes successReveal { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .t-divider { height: 1px; background: rgba(255,255,255,0.04); margin: 12px 0; }
      `}</style>

      <div className="creation">
        <div className="create-modal">
          {/* ── FORM STATE ── */}
          {phase === -1 && (
            <>
              <div className="form-head">
                <div className="form-badge">new project</div>
                <h2 className="form-title">Create a project</h2>
                <p className="form-sub">Set up a new workspace for your client with docs, proposals, and invoicing.</p>
              </div>
              <div className="form-body">
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Project Name</label>
                    <input className="form-input" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Brand Guidelines v2" />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Client</label>
                    <input className="form-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. Meridian Studio" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Template</label>
                  <div className="template-grid">
                    {TEMPLATES.map(t => (
                      <div key={t.id} className={`template-card${template === t.id ? " on" : ""}`} onClick={() => setTemplate(t.id)}>
                        <div className="template-icon">{t.icon}</div>
                        <span className="template-name">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-foot">
                <div className="form-hint"><span className="form-kbd">⏎</span> to create</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="form-cancel">Cancel</button>
                  <button className="form-create-btn" onClick={startAnimation}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l1.5 3.5L12 7l-3.5 1.5L7 12l-1.5-3.5L2 7l3.5-1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    Create Project
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── TERMINAL STATE ── */}
          {phase >= 0 && (
            <>
              <div className="term-header" style={{ background: "var(--ink-900)" }}>
                <div className="term-dots">
                  <div className="term-dot" style={{ background: "#ff5f57" }} />
                  <div className="term-dot" style={{ background: "#febc2e" }} />
                  <div className="term-dot" style={{ background: "#28c840" }} />
                </div>
                <div className="term-title-bar">felmark — creating project</div>
                <div style={{ width: 52 }} />
              </div>

              <div className="term-wrap">
                <div className="term-body" ref={scrollRef}>
                  {/* Phase 0: Thinking */}
                  {phase >= 0 && (
                    <div className="t-thinking">
                      <div className="t-think-label">
                        <span className="t-think-spinner">⠋</span> thinking
                      </div>
                      {PHASES[0].lines.map((line, i) => (
                        <div key={i} className="t-think-line" style={{ animationDelay: `${line.delay}ms` }}>
                          {line.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Phase 1: Command */}
                  {phase >= 1 && (
                    <>
                      <div className="t-divider" />
                      <div className="t-command">
                        <span className="t-prompt">❯</span>
                        <span className="t-cmd-text">{PHASES[1].prompt}</span>
                        <span className="t-cmd-flags">{PHASES[1].flags}</span>
                      </div>
                    </>
                  )}

                  {/* Phase 2: Progress */}
                  {phase >= 2 && (
                    <div className="t-progress">
                      <div className="t-prog-label">scaffolding</div>
                      {PHASES[2].steps.map((step, i) => (
                        <div key={i} className="t-prog-step" style={{ animationDelay: `${step.delay}ms` }}>
                          <span className="t-prog-check">✓</span>
                          <span className="t-prog-text">{step.text}</span>
                        </div>
                      ))}
                      <div className="t-prog-bar">
                        <ProgressBar duration={1800} delay={200} />
                      </div>
                    </div>
                  )}

                  {/* Phase 3: Files */}
                  {phase >= 3 && (
                    <>
                      <div className="t-divider" />
                      <div className="t-files">
                        <div className="t-files-label">generated files</div>
                        {PHASES[3].items.map((f, i) => (
                          <div key={i} className="t-file" style={{ animationDelay: `${f.delay}ms` }}>
                            <span className={`t-file-status ${f.status}`}>{f.status === "created" ? "+" : "M"}</span>
                            <span className="t-file-name">{f.name}</span>
                            <span className="t-file-size">{f.size}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Phase 4: Config */}
                  {phase >= 4 && (
                    <div className="t-config">
                      <div className="t-config-label">configuration</div>
                      {PHASES[4].lines.map((line, i) => (
                        <div key={i} className="t-config-line" style={{ animationDelay: `${line.delay}ms` }}>
                          <span className="t-config-key">{line.key}</span>
                          <span className="t-config-sep">: </span>
                          <span className="t-config-val">{line.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Phase 5: AI */}
                  {phase >= 5 && (
                    <>
                      <div className="t-divider" />
                      <div className="t-ai">
                        <div className="t-ai-label">
                          <span className="t-ai-sparkle">✦</span> ai context
                        </div>
                        {PHASES[5].lines.map((line, i) => (
                          <div key={i} className="t-ai-line" style={{ animationDelay: `${line.delay}ms` }}>
                            {line.text.includes("$") || line.text.includes("Found") ? (
                              <span className="t-ai-highlight">{line.text}</span>
                            ) : line.text}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Phase 6: Success */}
                  {phase >= 6 && allDone && (
                    <>
                      <div className="t-divider" />
                      <div className="t-success">
                        <div className="t-success-check">✓</div>
                        <div className="t-success-title">{PHASES[6].title}</div>
                        <div className="t-success-sub">{PHASES[6].subtitle} · Project ready</div>
                        <div className="t-success-stats">
                          {PHASES[6].stats.map((s, i) => (
                            <div key={i} className="t-success-stat">
                              <div className={`t-stat-val${s.label === "Est. Value" ? " ember" : ""}`}>{s.value}</div>
                              <div className="t-stat-label">{s.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="t-success-actions">
                          <button className="t-open-btn">Open Project</button>
                          <button className="t-secondary-btn">View in Terminal</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
