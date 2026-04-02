import { useState, useEffect, useRef, useCallback } from "react";

const STATUS_LINES = [
  { type: "greeting", text: "", delay: 0 },
  { type: "blank", delay: 0 },
  { type: "section", text: "STATUS", delay: 200 },
  { type: "stat", key: "projects", label: "active projects", value: "3", color: "#5a9a3c", delay: 400 },
  { type: "stat", key: "review", label: "in review", value: "1", color: "#b07d4f", delay: 550 },
  { type: "stat", key: "overdue", label: "overdue", value: "1", color: "#c24b38", delay: 700 },
  { type: "blank", delay: 800 },
  { type: "section", text: "REVENUE", delay: 900 },
  { type: "stat", key: "earned", label: "earned this month", value: "$14,800", color: "#5a9a3c", delay: 1050 },
  { type: "stat", key: "pending", label: "pending payment", value: "$7,200", color: "#b07d4f", delay: 1200 },
  { type: "stat", key: "pipeline", label: "total pipeline", value: "$22,000", color: "var(--ink-800)", delay: 1350 },
  { type: "blank", delay: 1500 },
  { type: "section", text: "ATTENTION", delay: 1600 },
  { type: "alert", icon: "!", text: "Bolt Fitness — App Onboarding UX is 4 days overdue", color: "#c24b38", delay: 1750 },
  { type: "alert", icon: "→", text: "Brand Guidelines v2 — due in 5 days (65% complete)", color: "#b07d4f", delay: 1950 },
  { type: "alert", icon: "$", text: "Invoice #047 — $2,400 sent, awaiting payment", color: "#5a9a3c", delay: 2150 },
  { type: "blank", delay: 2350 },
  { type: "section", text: "TODAY", delay: 2450 },
  { type: "event", time: "09:00", text: "Brand review call — Meridian Studio", delay: 2600 },
  { type: "event", time: "11:30", text: "Now — deep work block", delay: 2750 },
  { type: "event", time: "14:00", text: "Nora kickoff call — Course Landing Page", delay: 2900 },
  { type: "blank", delay: 3050 },
  { type: "prompt", text: "What would you like to work on?", delay: 3200 },
];

const SUGGESTIONS = [
  { cmd: "open brand-guidelines", desc: "Continue editing", icon: "◆" },
  { cmd: "create invoice --client bolt", desc: "Bill overdue project", icon: "$" },
  { cmd: "new proposal --client nora", desc: "Start Nora's proposal", icon: "+" },
  { cmd: "view calendar", desc: "See today's schedule", icon: "◎" },
  { cmd: "send reminder --client bolt", desc: "Nudge overdue payment", icon: "→" },
];

function TypingLine({ text, speed = 18, delay = 0, onDone }) {
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || !text) { if (started) onDone?.(); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) { clearInterval(interval); onDone?.(); }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  if (!started) return null;
  return <>{text.slice(0, chars)}</>;
}

function EmberParticles() {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => { canvas.width = canvas.offsetWidth * 2; canvas.height = canvas.offsetHeight * 2; ctx.scale(2, 2); };
    resize();

    const spawn = () => ({
      x: Math.random() * canvas.offsetWidth,
      y: canvas.offsetHeight + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.15),
      size: Math.random() * 1.5 + 0.5,
      life: 1,
      decay: Math.random() * 0.003 + 0.001,
    });

    for (let i = 0; i < 15; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.offsetHeight;
      p.life = Math.random();
      particles.current.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      if (Math.random() < 0.08) particles.current.push(spawn());

      particles.current = particles.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) return false;

        const alpha = p.life * 0.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 149, 108, ${alpha})`;
        ctx.fill();

        // glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 149, 108, ${alpha * 0.15})`;
        ctx.fill();

        return true;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="tw-particles" />;
}

export default function TerminalWelcome() {
  const [visibleLines, setVisibleLines] = useState(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [executedCmd, setExecutedCmd] = useState(null);
  const [cmdOutput, setCmdOutput] = useState(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";

  // Progressive reveal
  useEffect(() => {
    STATUS_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => new Set([...prev, i]));
        if (i === STATUS_LINES.length - 1) {
          setTimeout(() => {
            setAllRevealed(true);
            inputRef.current?.focus();
          }, 800);
        }
      }, line.delay);
    });
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleLines, allRevealed, executedCmd]);

  const filteredSuggestions = inputValue
    ? SUGGESTIONS.filter(s => s.cmd.toLowerCase().includes(inputValue.toLowerCase()) || s.desc.toLowerCase().includes(inputValue.toLowerCase()))
    : SUGGESTIONS;

  const executeCommand = (cmd) => {
    setExecutedCmd(cmd);
    setInputValue("");
    setShowSuggestions(false);
    setCmdOutput(null);

    // Simulate response
    setTimeout(() => {
      if (cmd.includes("brand")) setCmdOutput({ type: "navigate", text: "Opening Brand Guidelines v2...", icon: "◆" });
      else if (cmd.includes("invoice")) setCmdOutput({ type: "create", text: "Creating invoice for Bolt Fitness — $4,000\nOpening invoice editor...", icon: "$" });
      else if (cmd.includes("proposal")) setCmdOutput({ type: "create", text: "Scaffolding proposal for Nora Kim\nTemplate: Brand & Identity\nReady to edit.", icon: "+" });
      else if (cmd.includes("calendar")) setCmdOutput({ type: "navigate", text: "Opening calendar view...\n3 events today", icon: "◎" });
      else if (cmd.includes("reminder")) setCmdOutput({ type: "action", text: "Sending payment reminder to Bolt Fitness\nRe: Invoice #044 — $4,000 (4 days overdue)\nEmail sent to team@boltfit.co", icon: "→" });
      else setCmdOutput({ type: "unknown", text: `Unknown command: ${cmd}\nType a suggestion or use '/' for available commands`, icon: "?" });
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setSuggestionIdx(i => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setSuggestionIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && filteredSuggestions[suggestionIdx]) {
        executeCommand(filteredSuggestions[suggestionIdx].cmd);
      } else if (inputValue.trim()) {
        executeCommand(inputValue.trim());
      }
    } else if (e.key === "Tab" && showSuggestions && filteredSuggestions[suggestionIdx]) {
      e.preventDefault();
      setInputValue(filteredSuggestions[suggestionIdx].cmd);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

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
        }

        .tw {
          font-family: var(--mono); font-size: 13px;
          color: var(--ink-600); background: var(--parchment);
          height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }

        .tw-particles {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
        }

        .tw-scroll {
          flex: 1; overflow-y: auto; position: relative; z-index: 1;
          display: flex; flex-direction: column; justify-content: center;
          padding: 60px;
        }
        .tw-scroll::-webkit-scrollbar { width: 4px; }
        .tw-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.04); border-radius: 99px; }

        .tw-content {
          max-width: 560px; width: 100%; margin: 0 auto;
        }

        /* ── Lines ── */
        .tw-line {
          min-height: 22px; display: flex; align-items: baseline;
          animation: lineIn 0.2s ease both;
        }
        @keyframes lineIn { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

        .tw-greeting {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 500; color: var(--ink-800);
          line-height: 1.3; margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .tw-greeting em { font-style: italic; color: var(--ember); }

        .tw-section {
          font-size: 9px; font-weight: 500; color: var(--ink-300);
          letter-spacing: 0.14em; margin-top: 4px; margin-bottom: 4px;
          display: flex; align-items: center; gap: 8px;
        }
        .tw-section::after { content: ''; flex: 1; height: 1px; background: var(--warm-200); }

        .tw-stat {
          display: flex; align-items: center; gap: 0;
          padding: 1px 0; font-size: 12.5px;
        }
        .tw-stat-label { color: var(--ink-400); width: 180px; flex-shrink: 0; }
        .tw-stat-val { font-weight: 500; }

        .tw-alert {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 6px 10px; margin: 2px -10px;
          border-radius: 5px; font-size: 12.5px;
          transition: background 0.08s;
        }
        .tw-alert:hover { background: rgba(0,0,0,0.015); }
        .tw-alert-icon {
          width: 18px; height: 18px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; flex-shrink: 0;
        }
        .tw-alert-text { color: var(--ink-600); line-height: 1.4; }

        .tw-event {
          display: flex; align-items: center; gap: 10px;
          padding: 2px 0; font-size: 12.5px;
        }
        .tw-event-time {
          color: var(--ink-300); width: 48px; flex-shrink: 0;
          text-align: right;
        }
        .tw-event-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--warm-400); flex-shrink: 0;
        }
        .tw-event-text { color: var(--ink-600); }
        .tw-event.now .tw-event-time { color: var(--ember); font-weight: 500; }
        .tw-event.now .tw-event-dot { background: var(--ember); box-shadow: 0 0 0 3px rgba(176,125,79,0.12); }
        .tw-event.now .tw-event-text { color: var(--ink-800); font-weight: 500; }

        .tw-prompt-text {
          color: var(--ink-400); font-size: 12.5px;
          margin-top: 4px; font-style: italic;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Cursor ── */
        .tw-cursor { color: var(--ember); animation: blink 0.8s step-end infinite; font-weight: 300; }
        @keyframes blink { 50% { opacity: 0; } }

        /* ── Input area ── */
        .tw-input-area {
          margin-top: 16px; position: relative;
        }

        .tw-input-row {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 8px; transition: all 0.15s;
        }
        .tw-input-row.focused {
          border-color: var(--ember);
          box-shadow: 0 0 0 3px rgba(176,125,79,0.06);
        }

        .tw-prompt-char { color: var(--ember); font-weight: 600; font-size: 14px; flex-shrink: 0; }

        .tw-input {
          flex: 1; border: none; outline: none;
          font-family: var(--mono); font-size: 13px;
          color: var(--ink-800); background: transparent;
        }
        .tw-input::placeholder { color: var(--warm-400); }

        .tw-input-hints {
          display: flex; gap: 6px; flex-shrink: 0; align-items: center;
        }
        .tw-kbd {
          font-size: 9px; color: var(--ink-300);
          background: var(--warm-100); border: 1px solid var(--warm-200);
          border-radius: 3px; padding: 1px 5px;
        }

        /* ── Suggestions ── */
        .tw-suggestions {
          position: absolute; bottom: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 1px solid var(--warm-200);
          border-radius: 8px; padding: 4px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.06);
          z-index: 10;
        }

        .tw-sug {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 10px; border-radius: 5px;
          cursor: pointer; transition: background 0.06s;
        }
        .tw-sug:hover, .tw-sug.on { background: var(--ember-bg); }

        .tw-sug-icon {
          width: 24px; height: 24px; border-radius: 5px;
          background: var(--warm-100); border: 1px solid var(--warm-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; color: var(--ink-500); flex-shrink: 0;
        }
        .tw-sug.on .tw-sug-icon {
          background: var(--ember-bg); border-color: rgba(176,125,79,0.15);
          color: var(--ember);
        }

        .tw-sug-info { flex: 1; }
        .tw-sug-cmd { font-size: 12.5px; color: var(--ink-800); font-weight: 500; }
        .tw-sug-desc { font-size: 11px; color: var(--ink-400); font-family: 'Outfit', sans-serif; }

        .tw-sug-tab {
          font-size: 9px; color: var(--ink-300);
          background: var(--warm-100); border: 1px solid var(--warm-200);
          border-radius: 3px; padding: 1px 5px; flex-shrink: 0;
          opacity: 0; transition: opacity 0.08s;
        }
        .tw-sug.on .tw-sug-tab { opacity: 1; }

        /* ── Executed command ── */
        .tw-executed {
          margin-top: 12px; animation: lineIn 0.2s ease both;
        }
        .tw-exec-cmd {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .tw-exec-prompt { color: var(--ember); font-weight: 600; }
        .tw-exec-text { color: var(--ink-800); font-weight: 500; }

        .tw-exec-output {
          padding: 10px 12px; border-radius: 6px;
          background: rgba(0,0,0,0.015); border: 1px solid var(--warm-100);
          white-space: pre-wrap; line-height: 1.6;
          font-size: 12px; color: var(--ink-600);
          display: flex; gap: 8px; align-items: flex-start;
        }
        .tw-exec-icon {
          width: 20px; height: 20px; border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
          background: var(--ember-bg); color: var(--ember);
        }

        .tw-exec-spinner {
          display: flex; gap: 3px; align-items: center; padding: 8px 0;
        }
        .tw-exec-spinner span {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--ember); animation: dotPulse 1s ease infinite;
        }
        .tw-exec-spinner span:nth-child(2) { animation-delay: 0.15s; }
        .tw-exec-spinner span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes dotPulse { 0%, 60%, 100% { opacity: 0.2; } 30% { opacity: 1; } }

        /* ── Footer ── */
        .tw-footer {
          padding: 8px 60px; display: flex; align-items: center;
          justify-content: space-between; font-size: 10px;
          color: var(--ink-300); border-top: 1px solid var(--warm-100);
          position: relative; z-index: 1; background: var(--parchment);
        }
        .tw-footer-left { display: flex; align-items: center; gap: 12px; }
        .tw-footer-dot { width: 5px; height: 5px; border-radius: 50%; background: #5a9a3c; }
      `}</style>

      <div className="tw">
        <EmberParticles />

        <div className="tw-scroll" ref={scrollRef}>
          <div className="tw-content">
            {STATUS_LINES.map((line, i) => {
              if (!visibleLines.has(i)) return null;

              if (line.type === "greeting") {
                return (
                  <div key={i} className="tw-greeting">
                    <TypingLine text={`${greeting}. `} speed={30} delay={100} />
                    <em><TypingLine text="let's build." speed={40} delay={600} /></em>
                  </div>
                );
              }

              if (line.type === "blank") return <div key={i} style={{ height: 8 }} />;

              if (line.type === "section") {
                return <div key={i} className="tw-line tw-section">{line.text}</div>;
              }

              if (line.type === "stat") {
                return (
                  <div key={i} className="tw-line tw-stat">
                    <span className="tw-stat-label">{line.label}</span>
                    <span className="tw-stat-val" style={{ color: line.color }}>{line.value}</span>
                  </div>
                );
              }

              if (line.type === "alert") {
                return (
                  <div key={i} className="tw-line tw-alert">
                    <div className="tw-alert-icon" style={{ background: line.color + "10", color: line.color }}>{line.icon}</div>
                    <span className="tw-alert-text">{line.text}</span>
                  </div>
                );
              }

              if (line.type === "event") {
                const isNow = line.text.startsWith("Now");
                return (
                  <div key={i} className={`tw-line tw-event${isNow ? " now" : ""}`}>
                    <span className="tw-event-time">{line.time}</span>
                    <span className="tw-event-dot" />
                    <span className="tw-event-text">{line.text}</span>
                  </div>
                );
              }

              if (line.type === "prompt") {
                return (
                  <div key={i} className="tw-line tw-prompt-text">
                    <TypingLine text={line.text} speed={25} delay={200} />
                  </div>
                );
              }

              return null;
            })}

            {/* Executed command */}
            {executedCmd && (
              <div className="tw-executed">
                <div className="tw-exec-cmd">
                  <span className="tw-exec-prompt">❯</span>
                  <span className="tw-exec-text">{executedCmd}</span>
                </div>
                {!cmdOutput ? (
                  <div className="tw-exec-spinner"><span /><span /><span /></div>
                ) : (
                  <div className="tw-exec-output">
                    <div className="tw-exec-icon">{cmdOutput.icon}</div>
                    <span>{cmdOutput.text}</span>
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            {allRevealed && (
              <div className="tw-input-area">
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="tw-suggestions">
                    {filteredSuggestions.map((s, i) => (
                      <div key={i} className={`tw-sug${suggestionIdx === i ? " on" : ""}`}
                        onClick={() => executeCommand(s.cmd)}
                        onMouseEnter={() => setSuggestionIdx(i)}>
                        <div className="tw-sug-icon">{s.icon}</div>
                        <div className="tw-sug-info">
                          <div className="tw-sug-cmd">{s.cmd}</div>
                          <div className="tw-sug-desc">{s.desc}</div>
                        </div>
                        <span className="tw-sug-tab">tab</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className={`tw-input-row${inputFocused ? " focused" : ""}`}>
                  <span className="tw-prompt-char">❯</span>
                  <input
                    ref={inputRef}
                    className="tw-input"
                    value={inputValue}
                    onChange={e => { setInputValue(e.target.value); setShowSuggestions(true); setSuggestionIdx(0); }}
                    onFocus={() => { setInputFocused(true); setShowSuggestions(true); }}
                    onBlur={() => { setInputFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
                    onKeyDown={handleKeyDown}
                    placeholder="type a command..."
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <div className="tw-input-hints">
                    <span className="tw-kbd">↑↓</span>
                    <span className="tw-kbd">tab</span>
                    <span className="tw-kbd">⏎</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tw-footer">
          <div className="tw-footer-left">
            <span className="tw-footer-dot" />
            <span>felmark v0.1.0</span>
            <span>·</span>
            <span>3 workspaces · 8 projects</span>
          </div>
          <span>Mar 29, 2026 · 11:30am</span>
        </div>
      </div>
    </>
  );
}
