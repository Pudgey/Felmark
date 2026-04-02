import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK — AI THINK ANIMATIONS
   Never instant. Always earned.
   The pause is the product.
   ═══════════════════════════════════════════ */

// ═══ 1. THINKING DOTS — the minimal heartbeat ═══
function ThinkingDots({ label = "Thinking", color = "#b07d4f" }) {
  return (
    <div className="ai-dots-row">
      <div className="ai-dots">
        <div className="ai-dot" style={{ background: color, animationDelay: "0ms" }} />
        <div className="ai-dot" style={{ background: color, animationDelay: "160ms" }} />
        <div className="ai-dot" style={{ background: color, animationDelay: "320ms" }} />
      </div>
      <span className="ai-dots-label" style={{ color }}>{label}</span>
    </div>
  );
}

// ═══ 2. SCANNING LINE — sweeps across content ═══
function ScanLine({ width = "100%", duration = 2 }) {
  return (
    <div className="ai-scan" style={{ width }}>
      <div className="ai-scan-line" style={{ animationDuration: `${duration}s` }} />
    </div>
  );
}

// ═══ 3. STREAMING TEXT — characters appear one by one ═══
function StreamText({ text, speed = 20, delay = 400, onDone }) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (shown >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setShown(s => s + 1), speed + Math.random() * speed * 0.8);
    return () => clearTimeout(t);
  }, [shown, started, text, speed, onDone]);

  return (
    <span className="ai-stream">
      {text.slice(0, shown)}
      {shown < text.length && <span className="ai-stream-cursor" />}
    </span>
  );
}

// ═══ 4. SKELETON BLOCKS — content shape loading ═══
function SkeletonBlock({ lines = 3, style }) {
  return (
    <div className="ai-skel" style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="ai-skel-line" style={{
          width: `${65 + Math.sin(i * 2.1) * 25}%`,
          animationDelay: `${i * 100}ms`,
        }} />
      ))}
    </div>
  );
}

// ═══ 5. PROGRESS PHASES — staged thinking ═══
function ThinkPhases({ phases, onComplete }) {
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(new Set());

  useEffect(() => {
    let t = 300;
    phases.forEach((p, i) => {
      setTimeout(() => setActive(i), t);
      t += p.ms;
      setTimeout(() => setDone(prev => new Set([...prev, i])), t);
      t += 150;
    });
    setTimeout(() => onComplete?.(), t + 200);
  }, []);

  return (
    <div className="ai-phases">
      {phases.map((p, i) => {
        const isDone = done.has(i);
        const isOn = active === i && !isDone;
        const isWait = i > active;
        return (
          <div key={i} className={`ai-phase${isDone ? " done" : isOn ? " on" : " wait"}`}>
            <div className="ai-phase-indicator">
              {isDone ? (
                <span className="ai-phase-check">✓</span>
              ) : isOn ? (
                <div className="ai-phase-spinner" />
              ) : (
                <span className="ai-phase-num">{i + 1}</span>
              )}
            </div>
            <span className="ai-phase-label">{p.label}</span>
            {isOn && <div className="ai-phase-dots"><div className="ai-dot sm" style={{ animationDelay: "0ms" }} /><div className="ai-dot sm" style={{ animationDelay: "160ms" }} /><div className="ai-dot sm" style={{ animationDelay: "320ms" }} /></div>}
          </div>
        );
      })}
    </div>
  );
}

// ═══ 6. WAVEFORM PULSE — audio-style activity ═══
function WaveformPulse({ bars = 24, color = "#b07d4f", active = true }) {
  return (
    <div className="ai-wave">
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} className={`ai-wave-bar${active ? " on" : ""}`} style={{
          background: color,
          height: `${3 + Math.abs(Math.sin(i * 0.5)) * 14 + Math.sin(i * 1.2) * 4}px`,
          animationDelay: `${i * 40}ms`,
          animationDuration: `${500 + Math.abs(Math.sin(i * 0.7)) * 500}ms`,
        }} />
      ))}
    </div>
  );
}

// ═══ 7. FULL AI RESPONSE BLOCK — the complete sequence ═══
// Think → Stream answer → Show structured data
function AIResponseBlock() {
  const [phase, setPhase] = useState("think"); // think | phases | stream | done
  const [streamDone, setStreamDone] = useState(false);

  useEffect(() => {
    // Phase 1: thinking dots (800ms)
    setTimeout(() => setPhase("phases"), 800);
  }, []);

  const responseText = "Your effective rate this month is $112/hr — that's 25% below your $150 target. The main drag is the Bolt Fitness project: 42 hours tracked on a $4,000 engagement works out to $95/hr. Consider renegotiating scope or adjusting your time allocation.";

  return (
    <div className="ai-response">
      {/* Phase 1: Thinking */}
      {phase === "think" && (
        <div className="ai-response-think">
          <ThinkingDots label="Analyzing your data" />
        </div>
      )}

      {/* Phase 2: Processing steps */}
      {phase === "phases" && (
        <div className="ai-response-phases">
          <ThinkPhases
            phases={[
              { label: "Reading project data", ms: 600 },
              { label: "Calculating rates", ms: 800 },
              { label: "Generating insight", ms: 500 },
            ]}
            onComplete={() => setPhase("stream")}
          />
          <div style={{ marginTop: 10 }}>
            <WaveformPulse bars={32} />
          </div>
        </div>
      )}

      {/* Phase 3: Streaming answer */}
      {phase === "stream" && (
        <div className="ai-response-stream">
          <div className="ai-response-badge">
            <span className="ai-badge-icon">◆</span>
            <span className="ai-badge-text">AI Insight</span>
          </div>
          <div className="ai-response-text">
            <StreamText text={responseText} speed={18} delay={200} onDone={() => { setStreamDone(true); setTimeout(() => setPhase("done"), 300); }} />
          </div>
          {!streamDone && <ScanLine duration={3} />}
        </div>
      )}

      {/* Phase 4: Complete with structured data */}
      {phase === "done" && (
        <div className="ai-response-done">
          <div className="ai-response-badge">
            <span className="ai-badge-icon done">✓</span>
            <span className="ai-badge-text">AI Insight</span>
          </div>
          <div className="ai-response-text static">{responseText}</div>

          {/* Structured breakdown */}
          <div className="ai-data-card">
            <div className="ai-data-row">
              <span className="ai-data-label">Effective rate</span>
              <span className="ai-data-val" style={{ color: "#d97706" }}>$112/hr</span>
            </div>
            <div className="ai-data-row">
              <span className="ai-data-label">Target</span>
              <span className="ai-data-val">$150/hr</span>
            </div>
            <div className="ai-data-row">
              <span className="ai-data-label">Gap</span>
              <span className="ai-data-val" style={{ color: "#dc2626" }}>-25%</span>
            </div>
            <div className="ai-data-divider" />
            <div className="ai-data-row">
              <span className="ai-data-label">Lowest project</span>
              <span className="ai-data-val" style={{ color: "#dc2626" }}>Bolt Fitness — $95/hr</span>
            </div>
            <div className="ai-data-row">
              <span className="ai-data-label">Highest project</span>
              <span className="ai-data-val" style={{ color: "#16a34a" }}>Nora Kim — $128/hr</span>
            </div>
          </div>

          <div className="ai-actions">
            <button className="ai-action-btn primary">View full breakdown</button>
            <button className="ai-action-btn">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══ SHOWCASE ═══
export default function AIAnimations() {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--ink-900:#2c2a25;--ink-700:#4f4c44;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--mono:'JetBrains Mono',monospace}
.page{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;padding:40px 20px}
.inner{max-width:540px;margin:0 auto}
.title{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--ink-900);margin-bottom:4px}
.sub{font-size:13px;color:var(--ink-400);margin-bottom:28px}
.label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.08em;margin:24px 0 10px;display:flex;align-items:center;gap:8px}
.label::after{content:'';flex:1;height:1px;background:var(--warm-200)}
.demo{background:#fff;border:1px solid var(--warm-200);border-radius:10px;padding:16px 18px;margin-bottom:8px}
.demo-note{font-size:12px;color:var(--ink-400);margin-bottom:12px;line-height:1.5}
.trigger{padding:8px 18px;border-radius:6px;border:none;background:var(--ink-900);color:#fff;font-size:12px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;margin-top:12px}
.trigger:hover{background:#3d3a33}

/* ═══ THINKING DOTS ═══ */
.ai-dots-row{display:flex;align-items:center;gap:8px}
.ai-dots{display:flex;gap:4px;align-items:center}
.ai-dot{width:6px;height:6px;border-radius:50%;background:var(--ember);animation:dotBounce 1s ease-in-out infinite}
.ai-dot.sm{width:4px;height:4px}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0);opacity:.2}40%{transform:translateY(-6px);opacity:1}}
.ai-dots-label{font-family:var(--mono);font-size:11px;font-weight:500}

/* ═══ SCAN LINE ═══ */
.ai-scan{height:2px;background:var(--warm-200);border-radius:1px;overflow:hidden;margin-top:8px}
.ai-scan-line{height:100%;width:30%;background:linear-gradient(90deg,transparent,var(--ember),transparent);border-radius:1px;animation:scanSweep 2s ease-in-out infinite}
@keyframes scanSweep{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}

/* ═══ STREAMING TEXT ═══ */
.ai-stream{font-size:13px;color:var(--ink-700);line-height:1.7}
.ai-stream-cursor{display:inline-block;width:2px;height:14px;background:var(--ember);margin-left:1px;vertical-align:text-bottom;animation:cursorBlink .6s ease infinite}
@keyframes cursorBlink{0%,100%{opacity:1}50%{opacity:0}}

/* ═══ SKELETON ═══ */
.ai-skel{display:flex;flex-direction:column;gap:6px}
.ai-skel-line{height:8px;background:var(--warm-200);border-radius:4px;animation:skelPulse 1.4s ease-in-out infinite}
@keyframes skelPulse{0%,100%{opacity:.3}50%{opacity:.6}}

/* ═══ PHASES ═══ */
.ai-phases{display:flex;flex-direction:column;gap:2px}
.ai-phase{display:flex;align-items:center;gap:8px;padding:6px 0;transition:opacity .2s}
.ai-phase.wait{opacity:.25}
.ai-phase.on{opacity:1}
.ai-phase.done{opacity:.7}
.ai-phase-indicator{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;border:1.5px solid var(--warm-200)}
.ai-phase.on .ai-phase-indicator{border-color:var(--ember)}
.ai-phase.done .ai-phase-indicator{border-color:#16a34a;background:rgba(22,163,74,0.04)}
.ai-phase-check{color:#16a34a;font-size:10px}
.ai-phase-num{color:var(--ink-300);font-family:var(--mono);font-size:9px}
.ai-phase-spinner{width:10px;height:10px;border:1.5px solid var(--warm-200);border-top-color:var(--ember);border-radius:50%;animation:spin .5s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.ai-phase-label{font-size:12px;color:var(--ink-500);flex:1;transition:color .2s}
.ai-phase.on .ai-phase-label{color:var(--ink-700);font-weight:500}
.ai-phase.done .ai-phase-label{color:var(--ink-400)}
.ai-phase-dots{display:flex;gap:3px;align-items:center;flex-shrink:0}

/* ═══ WAVEFORM ═══ */
.ai-wave{display:flex;gap:1.5px;align-items:center;height:18px}
.ai-wave-bar{width:2px;border-radius:1px;opacity:.08;transition:opacity .3s}
.ai-wave-bar.on{animation:wavePulse .6s ease-in-out infinite alternate}
@keyframes wavePulse{0%{opacity:.06}100%{opacity:.3}}

/* ═══ FULL AI RESPONSE ═══ */
.ai-response{min-height:60px}
.ai-response-think{padding:8px 0}
.ai-response-phases{padding:4px 0}
.ai-response-stream{padding:4px 0}
.ai-response-done{padding:4px 0;animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}

.ai-response-badge{display:flex;align-items:center;gap:5px;margin-bottom:8px}
.ai-badge-icon{width:18px;height:18px;border-radius:4px;background:rgba(176,125,79,0.06);border:1px solid rgba(176,125,79,0.08);display:flex;align-items:center;justify-content:center;font-size:8px;color:var(--ember)}
.ai-badge-icon.done{background:rgba(22,163,74,0.04);border-color:rgba(22,163,74,0.08);color:#16a34a}
.ai-badge-text{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em}

.ai-response-text{font-size:13px;color:var(--ink-700);line-height:1.7;margin-bottom:8px}
.ai-response-text.static{margin-bottom:12px}

/* Data card */
.ai-data-card{background:var(--warm-50);border:1px solid var(--warm-200);border-radius:8px;padding:10px 12px;margin-bottom:10px}
.ai-data-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px}
.ai-data-label{color:var(--ink-400)}
.ai-data-val{font-family:var(--mono);font-weight:500;color:var(--ink-700)}
.ai-data-divider{height:1px;background:var(--warm-200);margin:4px 0}

.ai-actions{display:flex;gap:6px}
.ai-action-btn{padding:7px 14px;border-radius:6px;font-size:12px;font-family:inherit;cursor:pointer;transition:all .1s;border:1px solid var(--warm-200);background:#fff;color:var(--ink-500)}
.ai-action-btn:hover{background:var(--warm-50)}
.ai-action-btn.primary{background:var(--ink-900);color:#fff;border-color:var(--ink-900)}
.ai-action-btn.primary:hover{background:#3d3a33}
      `}</style>

      <div className="page"><div className="inner">
        <div className="title">AI Think Animations</div>
        <div className="sub">Never instant. The pause makes it feel real.</div>

        <div className="label">thinking dots</div>
        <div className="demo">
          <div className="demo-note">The simplest indicator. Three dots bouncing in sequence. Use for quick lookups under 2 seconds.</div>
          <ThinkingDots label="Thinking" />
          <div style={{ height: 12 }} />
          <ThinkingDots label="Analyzing your data" color="#2563eb" />
          <div style={{ height: 12 }} />
          <ThinkingDots label="Searching clients" color="#16a34a" />
        </div>

        <div className="label">scanning line</div>
        <div className="demo">
          <div className="demo-note">A gradient sweep that implies reading or scanning. Use under text or data that's being processed.</div>
          <SkeletonBlock lines={3} />
          <ScanLine duration={2} />
        </div>

        <div className="label">skeleton loading</div>
        <div className="demo">
          <div className="demo-note">Content-shaped placeholders that pulse. Shows the shape of what's coming before it arrives.</div>
          <SkeletonBlock lines={2} style={{ marginBottom: 10 }} />
          <SkeletonBlock lines={4} />
        </div>

        <div className="label">streaming text</div>
        <div className="demo">
          <div className="demo-note">Characters appear one by one with a blinking cursor. Feels like the AI is writing in real time, even when the response is cached.</div>
          <StreamText text="Your effective rate this month is $112/hr — that's 25% below your $150 target." speed={22} delay={300} />
        </div>

        <div className="label">waveform pulse</div>
        <div className="demo">
          <div className="demo-note">Audio-style bars that pulse while the AI is processing. Implies active computation.</div>
          <WaveformPulse bars={32} />
          <div style={{ height: 10 }} />
          <WaveformPulse bars={32} color="#2563eb" />
        </div>

        <div className="label">staged thinking</div>
        <div className="demo">
          <div className="demo-note">Multi-step progress: numbered circles → spinner → green check. Shows the AI working through a process. Auto-plays.</div>
          <ThinkPhases
            phases={[
              { label: "Reading project data", ms: 1000 },
              { label: "Calculating effective rate", ms: 1200 },
              { label: "Comparing to benchmarks", ms: 800 },
              { label: "Generating recommendation", ms: 600 },
            ]}
          />
        </div>

        <div className="label">full ai response — the complete sequence</div>
        <div className="demo">
          <div className="demo-note">The whole flow: thinking dots → staged processing with waveform → streaming text with scan line → structured data card with actions. This is how every AI response in the terminal should feel.</div>
          {!showFull ? (
            <button className="trigger" onClick={() => setShowFull(true)}>Run AI analysis →</button>
          ) : (
            <AIResponseBlock />
          )}
        </div>

      </div></div>
    </>
  );
}
