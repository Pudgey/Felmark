import { useState, useEffect, useRef } from "react";

const STEPS = [
  { label: "Scanning market data sources", icon: "◎", ms: 1400, source: "market.api" },
  { label: "Analyzing niche demand signals", icon: "↗", ms: 1800, source: "demand.idx" },
  { label: "Cross-referencing client patterns", icon: "⇄", ms: 1200, source: "clients.ml" },
  { label: "Scoring relevance to your profile", icon: "★", ms: 1600, source: "relevance.ai" },
  { label: "Generating actionable insights", icon: "◆", ms: 1000, source: "insights.gen" },
];

const SIGNALS = [
  { title: "Brand identity demand up 34% in SaaS", relevance: 96, type: "Opportunity", typeColor: "#5a9a3c", rate: "$125/hr", source: "LinkedIn Jobs + Upwork" },
  { title: "3 competitors dropped brand services", relevance: 89, type: "Market gap", typeColor: "#5b7fa4", rate: "$110/hr", source: "Competitor tracking" },
  { title: "Meridian Studio may need Phase 2 work", relevance: 84, type: "Client signal", typeColor: "#b07d4f", rate: "$112/hr", source: "Client activity" },
];

function Elapsed({ running }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setS(p => p + 1), 1000);
    return () => clearInterval(i);
  }, [running]);
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return <span>{mm}:{ss}</span>;
}

export default function WireLoader() {
  const [activeStep, setActiveStep] = useState(-1);
  const [doneSteps, setDoneSteps] = useState(new Set());
  const [done, setDone] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentSource, setCurrentSource] = useState("—");
  const [revealedSignals, setRevealedSignals] = useState(0);

  useEffect(() => {
    let t = 400;
    STEPS.forEach((step, i) => {
      setTimeout(() => { setActiveStep(i); setCurrentSource(step.source); }, t);
      t += step.ms;
      setTimeout(() => setDoneSteps(prev => new Set([...prev, i])), t);
      t += 250;
    });
    setTimeout(() => { setDone(true); setCurrentSource("complete"); }, t + 150);
    setTimeout(() => setShowResult(true), t + 500);
  }, []);

  // Stagger signal card reveals
  useEffect(() => {
    if (!showResult) return;
    const i = setInterval(() => setRevealedSignals(p => Math.min(p + 1, SIGNALS.length)), 200);
    return () => clearInterval(i);
  }, [showResult]);

  const completed = doneSteps.size;
  const pct = done ? 100 : (completed / STEPS.length) * 100;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.wl{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
.wl-wrap{width:100%;max-width:560px}

/* ── Header ── */
.wl-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding:0 2px}
.wl-hd-l{display:flex;align-items:center;gap:8px}
.wl-hd-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink-900)}
.wl-badge{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:4px;border:1px solid;display:inline-flex;align-items:center;gap:4px}
.wl-badge-live{color:#5a9a3c;background:rgba(90,154,60,0.03);border-color:rgba(90,154,60,0.08)}
.wl-badge-pro{color:var(--ember);background:var(--ember-bg);border-color:rgba(176,125,79,0.08);font-weight:500}
.wl-badge-dot{width:4px;height:4px;border-radius:50%;background:currentColor;animation:bdot 1.5s ease infinite}
@keyframes bdot{0%,60%,100%{opacity:.25}15%{opacity:1}}
.wl-hd-r{font-family:var(--mono);font-size:10px;color:var(--ink-300)}

/* ── Card ── */
.wl-card{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden}

/* ── Orb ── */
.wl-orb-area{padding:28px 24px 22px;display:flex;flex-direction:column;align-items:center;border-bottom:1px solid var(--warm-100)}

.wl-orb{width:76px;height:76px;position:relative;margin-bottom:14px}

/* Ripples */
.wl-rip{position:absolute;inset:0;border-radius:50%;border:1px solid var(--ember);opacity:0;pointer-events:none}
.wl-orb.on .wl-rip{animation:rip 3s cubic-bezier(0.2,0,0.3,1) infinite}
.wl-rip:nth-child(2){animation-delay:1s !important}
.wl-rip:nth-child(3){animation-delay:2s !important}
@keyframes rip{0%{transform:scale(1);opacity:.15}40%{opacity:.06}100%{transform:scale(2.4);opacity:0}}

/* Two orbital rings at different speeds */
.wl-orbit{position:absolute;inset:-6px;border-radius:50%;border:1.5px solid transparent;opacity:0;pointer-events:none}
.wl-orbit-1{border-top-color:var(--ember);border-right-color:rgba(176,125,79,0.2)}
.wl-orbit-2{inset:-12px;border-bottom-color:rgba(176,125,79,0.15)}
.wl-orb.on .wl-orbit-1{opacity:1;animation:orb1 1.4s linear infinite}
.wl-orb.on .wl-orbit-2{opacity:1;animation:orb2 2.8s linear infinite reverse}
@keyframes orb1{to{transform:rotate(360deg)}}
@keyframes orb2{to{transform:rotate(360deg)}}

/* Center */
.wl-orb-c{position:absolute;inset:10px;border-radius:50%;background:var(--warm-50);border:1px solid var(--warm-200);display:flex;align-items:center;justify-content:center;transition:all .4s cubic-bezier(0.16,1,0.3,1);z-index:1}
.wl-orb.on .wl-orb-c{border-color:rgba(176,125,79,0.12);background:var(--ember-bg);box-shadow:0 0 20px rgba(176,125,79,0.06)}
.wl-orb.fin .wl-orb-c{border-color:rgba(90,154,60,0.12);background:rgba(90,154,60,0.03);box-shadow:none}

.wl-orb-ic{font-size:18px;color:var(--ink-300);transition:all .3s}
.wl-orb.on .wl-orb-ic{color:var(--ember)}
.wl-orb.fin .wl-orb-ic{color:#5a9a3c}

/* Kill anims when done */
.wl-orb.fin .wl-rip,.wl-orb.fin .wl-orbit{animation:none !important;opacity:0 !important;transition:opacity .4s}

/* Title & sub */
.wl-orb-t{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);text-align:center;margin-bottom:2px;transition:all .3s}
.wl-orb-s{font-size:13px;color:var(--ink-400);text-align:center;margin-bottom:14px}

/* Progress */
.wl-prog{width:100%;max-width:240px}
.wl-prog-bar{height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden;margin-bottom:6px}
.wl-prog-fill{height:100%;border-radius:2px;transition:width .5s cubic-bezier(0.16,1,0.3,1),background .4s}
.wl-prog-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* ── Waveform ── */
.wl-wv{padding:10px 20px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;gap:10px}
.wl-wv-lbl{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;flex-shrink:0;width:42px}
.wl-wv-bars{display:flex;gap:1.5px;align-items:center;flex:1;height:18px}
.wl-wv-b{width:2px;border-radius:1px;background:var(--ember);opacity:.08;transition:opacity .4s}
.wl-wv.on .wl-wv-b{animation:wb .7s ease-in-out infinite alternate}
@keyframes wb{0%{opacity:.06}100%{opacity:.35}}
.wl-wv.fin .wl-wv-b{animation:none;opacity:.04;height:2px !important;transition:all .5s}
.wl-wv-src{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0;min-width:72px;text-align:right;transition:color .3s}
.wl-wv.on .wl-wv-src{color:var(--ember)}
.wl-wv.fin .wl-wv-src{color:#5a9a3c}

/* ── Steps ── */
.wl-steps{padding:2px 10px 6px}
.wl-st{display:flex;align-items:center;gap:10px;padding:9px 8px;border-radius:6px;transition:opacity .2s}
.wl-st+.wl-st{border-top:1px solid var(--warm-100)}
.wl-st.wait{opacity:.3}
.wl-st.on{opacity:1}
.wl-st.ok{opacity:1}

/* Step icon */
.wl-st-ic{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;border:1px solid;transition:all .25s}
.wl-st.wait .wl-st-ic{color:var(--ink-300);background:var(--warm-50);border-color:var(--warm-200)}
.wl-st.on .wl-st-ic{color:var(--ember);background:var(--ember-bg);border-color:rgba(176,125,79,0.1)}
.wl-st.ok .wl-st-ic{color:#5a9a3c;background:rgba(90,154,60,0.04);border-color:rgba(90,154,60,0.08)}

/* Step text */
.wl-st-body{flex:1;min-width:0}
.wl-st-label{font-size:13px;color:var(--ink-300);transition:all .2s}
.wl-st.on .wl-st-label{color:var(--ink-800);font-weight:500}
.wl-st.ok .wl-st-label{color:var(--ink-400)}

/* Step right */
.wl-st-r{flex-shrink:0;display:flex;align-items:center;gap:6px}
.wl-spin{width:13px;height:13px;border:1.5px solid var(--warm-200);border-top-color:var(--ember);border-radius:50%;animation:sp .55s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.wl-st-done{font-family:var(--mono);font-size:9px;color:#5a9a3c;opacity:0;transform:translateX(4px);transition:all .2s}
.wl-st.ok .wl-st-done{opacity:1;transform:translateX(0)}

/* ── Result ── */
.wl-res{padding:24px 20px;animation:resUp .4s cubic-bezier(0.16,1,0.3,1)}
@keyframes resUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.wl-res-top{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.wl-res-check{width:40px;height:40px;border-radius:50%;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.1);color:#5a9a3c;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wl-res-info{flex:1}
.wl-res-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);line-height:1.2}
.wl-res-sub{font-size:12px;color:var(--ink-400);margin-top:1px}

.wl-res-stats{display:flex;gap:6px;margin-bottom:16px}
.wl-res-stat{flex:1;padding:8px;background:var(--warm-50);border:1px solid var(--warm-100);border-radius:8px;text-align:center}
.wl-res-stat-v{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;line-height:1}
.wl-res-stat-l{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}

/* Signal preview cards */
.wl-sig{border:1px solid var(--warm-200);border-radius:8px;padding:12px 14px;margin-bottom:6px;cursor:pointer;transition:all .15s;opacity:0;transform:translateY(6px)}
.wl-sig.vis{opacity:1;transform:translateY(0)}
.wl-sig:hover{border-color:var(--warm-300);background:var(--warm-50)}
.wl-sig:last-child{margin-bottom:0}
.wl-sig-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.wl-sig-type{font-family:var(--mono);font-size:8px;font-weight:500;padding:1px 6px;border-radius:3px;border:1px solid}
.wl-sig-rel{font-family:var(--mono);font-size:10px;font-weight:500}
.wl-sig-title{font-size:14px;font-weight:500;color:var(--ink-800);line-height:1.3;margin-bottom:4px}
.wl-sig-meta{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.wl-sig-meta-sep{color:var(--warm-300)}

.wl-res-cta{display:flex;gap:8px;margin-top:14px}
.wl-res-btn{flex:1;padding:10px;border-radius:7px;border:none;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .12s;text-align:center}
.wl-res-btn-primary{background:var(--ink-900);color:#fff}
.wl-res-btn-primary:hover{background:var(--ink-800);transform:translateY(-1px);box-shadow:0 3px 12px rgba(0,0,0,0.08)}
.wl-res-btn-secondary{background:#fff;color:var(--ink-600);border:1px solid var(--warm-200)}
.wl-res-btn-secondary:hover{background:var(--warm-50);border-color:var(--warm-300)}

/* ── Footer ── */
.wl-ft{padding:7px 14px;border-top:1px solid var(--warm-100);display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.wl-ft-l{display:flex;align-items:center;gap:5px}
.wl-ft-dot{width:4px;height:4px;border-radius:50%;animation:bdot 1.5s ease infinite}
      `}</style>

      <div className="wl"><div className="wl-wrap">

        {/* Header */}
        <div className="wl-hd">
          <div className="wl-hd-l">
            <span className="wl-hd-title">The Wire</span>
            <span className="wl-badge wl-badge-live"><span className="wl-badge-dot" />Live</span>
            <span className="wl-badge wl-badge-pro">PRO</span>
          </div>
          <span className="wl-hd-r">Design & Branding</span>
        </div>

        <div className="wl-card">
          {!showResult ? (
            <>
              {/* ── Orb ── */}
              <div className="wl-orb-area">
                <div className={`wl-orb${done ? " fin" : activeStep >= 0 ? " on" : ""}`}>
                  <div className="wl-rip" />
                  <div className="wl-rip" />
                  <div className="wl-rip" />
                  <div className="wl-orbit wl-orbit-1" />
                  <div className="wl-orbit wl-orbit-2" />
                  <div className="wl-orb-c">
                    <span className="wl-orb-ic">{done ? "✓" : activeStep >= 0 ? "◆" : "○"}</span>
                  </div>
                </div>

                <div className="wl-orb-t">{done ? "Analysis complete" : "Analyzing signal"}</div>
                <div className="wl-orb-s">{done ? "Preparing your results" : "AI is scanning market data for your niche"}</div>

                <div className="wl-prog">
                  <div className="wl-prog-bar">
                    <div className="wl-prog-fill" style={{ width: `${pct}%`, background: done ? "#5a9a3c" : "var(--ember)" }} />
                  </div>
                  <div className="wl-prog-row">
                    <span>{completed} of {STEPS.length}</span>
                    <Elapsed running={activeStep >= 0 && !done} />
                  </div>
                </div>
              </div>

              {/* ── Waveform ── */}
              <div className={`wl-wv${done ? " fin" : activeStep >= 0 ? " on" : ""}`}>
                <span className="wl-wv-lbl">Source</span>
                <div className="wl-wv-bars">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="wl-wv-b" style={{
                      height: `${3 + Math.abs(Math.sin(i * 0.45)) * 12 + Math.sin(i * 1.3) * 3}px`,
                      animationDelay: `${i * 0.04}s`,
                      animationDuration: `${0.5 + Math.abs(Math.sin(i * 0.8)) * 0.6}s`,
                    }} />
                  ))}
                </div>
                <span className="wl-wv-src">{currentSource}</span>
              </div>

              {/* ── Steps ── */}
              <div className="wl-steps">
                {STEPS.map((step, i) => {
                  const isDone = doneSteps.has(i);
                  const isActive = activeStep === i && !isDone;
                  const cls = isDone ? "ok" : isActive ? "on" : "wait";
                  return (
                    <div key={i} className={`wl-st ${cls}`}>
                      <div className="wl-st-ic">{isDone ? "✓" : step.icon}</div>
                      <div className="wl-st-body">
                        <div className="wl-st-label">{step.label}</div>
                      </div>
                      <div className="wl-st-r">
                        {isActive && <div className="wl-spin" />}
                        <span className="wl-st-done">Done</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Result ── */
            <div className="wl-res">
              {/* Top row */}
              <div className="wl-res-top">
                <div className="wl-res-check">✓</div>
                <div className="wl-res-info">
                  <div className="wl-res-title">3 signals found</div>
                  <div className="wl-res-sub">High-relevance opportunities for Design & Branding</div>
                </div>
              </div>

              {/* Stats */}
              <div className="wl-res-stats">
                {[
                  { v: "3", l: "Signals", c: "var(--ink-900)" },
                  { v: "92%", l: "Relevance", c: "#5a9a3c" },
                  { v: "+34%", l: "Demand", c: "var(--ember)" },
                  { v: "$112", l: "Avg rate", c: "#5b7fa4" },
                ].map((s, i) => (
                  <div key={i} className="wl-res-stat">
                    <div className="wl-res-stat-v" style={{ color: s.c }}>{s.v}</div>
                    <div className="wl-res-stat-l">{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Signal preview cards */}
              {SIGNALS.map((sig, i) => (
                <div key={i} className={`wl-sig${i < revealedSignals ? " vis" : ""}`}
                  style={{ transitionDelay: `${i * 100}ms`, transitionDuration: ".3s" }}>
                  <div className="wl-sig-top">
                    <span className="wl-sig-type" style={{ color: sig.typeColor, background: sig.typeColor + "06", borderColor: sig.typeColor + "15" }}>{sig.type}</span>
                    <span className="wl-sig-rel" style={{ color: sig.relevance >= 90 ? "#5a9a3c" : "var(--ember)" }}>{sig.relevance}% match</span>
                  </div>
                  <div className="wl-sig-title">{sig.title}</div>
                  <div className="wl-sig-meta">
                    <span>{sig.rate}</span>
                    <span className="wl-sig-meta-sep">·</span>
                    <span>{sig.source}</span>
                  </div>
                </div>
              ))}

              {/* CTAs */}
              <div className="wl-res-cta">
                <button className="wl-res-btn wl-res-btn-primary">View Full Analysis →</button>
                <button className="wl-res-btn wl-res-btn-secondary">Dismiss</button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="wl-ft">
            <div className="wl-ft-l">
              <span className="wl-ft-dot" style={{ background: showResult ? "#5a9a3c" : "var(--ember)" }} />
              <span>{showResult ? "Complete" : "Processing"} · Design & Branding</span>
            </div>
            <span>{new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</span>
          </div>
        </div>
      </div></div>
    </>
  );
}
