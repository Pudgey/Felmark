import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════
   FELMARK — THE WIRE: SIGNAL CREATION FLOW
   The complete journey from "I want intelligence"
   to "Here are your insights."
   ═══════════════════════════════════════════ */

const FLOW_STEPS = [
  { id: "type", label: "Signal type" },
  { id: "niche", label: "Your niche" },
  { id: "sources", label: "Sources" },
  { id: "review", label: "Review" },
  { id: "analyze", label: "Analyzing" },
  { id: "results", label: "Results" },
];

const SIGNAL_TYPES = [
  { id: "opportunity", icon: "◆", label: "Opportunity Scanner", desc: "Find new clients, gigs, and market openings in your niche", color: "#5a9a3c", popular: true },
  { id: "market", icon: "↗", label: "Market Pulse", desc: "Track demand trends, rate shifts, and industry momentum", color: "#5b7fa4" },
  { id: "competitor", icon: "◎", label: "Competitor Watch", desc: "Monitor what other freelancers in your space are doing", color: "#7c6b9e" },
  { id: "client", icon: "★", label: "Client Signals", desc: "Detect when existing clients might need more work", color: "#b07d4f" },
  { id: "rate", icon: "$", label: "Rate Intelligence", desc: "Benchmark your rates against real market data", color: "#c89360" },
  { id: "tools", icon: "⚙", label: "Tool & Trend Radar", desc: "Track emerging tools, frameworks, and skills in demand", color: "#8a7e63" },
];

const NICHES = [
  "Brand Identity", "Web Design", "UI/UX Design", "Logo Design",
  "Graphic Design", "Motion Design", "Packaging", "Illustration",
  "Product Design", "Design Systems", "Art Direction", "Print Design",
];

const SOURCES = [
  { id: "linkedin", label: "LinkedIn Jobs", desc: "Job postings and hiring signals", icon: "in", on: true },
  { id: "upwork", label: "Upwork", desc: "Freelance project postings", icon: "Up", on: true },
  { id: "dribbble", label: "Dribbble", desc: "Creative hiring boards", icon: "Dr", on: false },
  { id: "twitter", label: "X / Twitter", desc: "Industry conversations and needs", icon: "X", on: true },
  { id: "google", label: "Google Trends", desc: "Search demand data", icon: "G", on: true },
  { id: "reddit", label: "Reddit", desc: "Community discussions and requests", icon: "R", on: false },
  { id: "glassdoor", label: "Glassdoor", desc: "Salary and company data", icon: "Gd", on: false },
  { id: "indeed", label: "Indeed", desc: "Job market volume", icon: "Id", on: true },
];

const AI_STEPS = [
  { label: "Scanning market data sources", icon: "◎", ms: 1200 },
  { label: "Analyzing niche demand signals", icon: "↗", ms: 1500 },
  { label: "Cross-referencing client patterns", icon: "⇄", ms: 1000 },
  { label: "Scoring relevance to your profile", icon: "★", ms: 1300 },
  { label: "Generating actionable insights", icon: "◆", ms: 900 },
];

const RESULTS = [
  { title: "Brand identity demand up 34% in SaaS", relevance: 96, type: "Opportunity", typeColor: "#5a9a3c", rate: "$125/hr", source: "LinkedIn + Upwork", desc: "SaaS startups are increasingly investing in brand before product launch. 47 new postings this week matching your niche." },
  { title: "3 competitors dropped brand services", relevance: 89, type: "Market gap", typeColor: "#5b7fa4", rate: "$110/hr", source: "Competitor tracking", desc: "Three mid-tier competitors in your area pivoted to UI/UX only, leaving brand identity underserved." },
  { title: "Meridian Studio may need Phase 2", relevance: 84, type: "Client signal", typeColor: "#b07d4f", rate: "$112/hr", source: "Client activity", desc: "Meridian's recent job posting for a marketing manager suggests upcoming brand expansion work." },
];

function Elapsed({ running }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setS(p => p + 1), 1000);
    return () => clearInterval(i);
  }, [running]);
  return <span>{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</span>;
}

export default function WireSignalFlow() {
  const [step, setStep] = useState(0);
  const [signalType, setSignalType] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState(new Set(["Brand Identity", "Logo Design"]));
  const [customNiche, setCustomNiche] = useState("");
  const [sources, setSources] = useState(SOURCES.map(s => ({ ...s })));
  const [frequency, setFrequency] = useState("daily");
  const [threshold, setThreshold] = useState(70);

  // AI analysis state
  const [aiStep, setAiStep] = useState(-1);
  const [aiDone, setAiDone] = useState(new Set());
  const [allDone, setAllDone] = useState(false);
  const [currentSource, setCurrentSource] = useState("—");
  const [showResults, setShowResults] = useState(false);
  const [revealedResults, setRevealedResults] = useState(0);

  const canProceed = () => {
    if (step === 0) return signalType !== null;
    if (step === 1) return selectedNiches.size > 0;
    if (step === 2) return sources.some(s => s.on);
    return true;
  };

  const goNext = () => {
    if (step < 3) setStep(step + 1);
    else if (step === 3) { setStep(4); startAnalysis(); }
  };

  const goBack = () => { if (step > 0 && step < 4) setStep(step - 1); };

  const toggleNiche = (n) => {
    setSelectedNiches(prev => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });
  };

  const toggleSource = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, on: !s.on } : s));
  };

  const startAnalysis = () => {
    let t = 300;
    AI_STEPS.forEach((s, i) => {
      setTimeout(() => { setAiStep(i); setCurrentSource(["market.api", "demand.idx", "clients.ml", "relevance.ai", "insights.gen"][i]); }, t);
      t += s.ms;
      setTimeout(() => setAiDone(prev => new Set([...prev, i])), t);
      t += 200;
    });
    setTimeout(() => setAllDone(true), t + 100);
    setTimeout(() => { setStep(5); setShowResults(true); }, t + 500);
  };

  // Stagger result reveals
  useEffect(() => {
    if (!showResults) return;
    const i = setInterval(() => setRevealedResults(p => Math.min(p + 1, RESULTS.length)), 250);
    return () => clearInterval(i);
  }, [showResults]);

  const selectedType = SIGNAL_TYPES.find(t => t.id === signalType);
  const activeSources = sources.filter(s => s.on);
  const aiCompleted = aiDone.size;
  const aiPct = allDone ? 100 : (aiCompleted / AI_STEPS.length) * 100;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
*{box-sizing:border-box;margin:0;padding:0}
:root{--parchment:#faf9f7;--warm-50:#f7f6f3;--warm-100:#f0eee9;--warm-200:#e5e2db;--warm-300:#d5d1c8;--warm-400:#b8b3a8;--ink-900:#2c2a25;--ink-800:#3d3a33;--ink-700:#4f4c44;--ink-600:#65625a;--ink-500:#7d7a72;--ink-400:#9b988f;--ink-300:#b5b2a9;--ember:#b07d4f;--ember-light:#c89360;--ember-bg:rgba(176,125,79,0.08);--mono:'JetBrains Mono',monospace}

.sf{font-family:'Outfit',sans-serif;background:var(--parchment);min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:32px 20px}
.sf-wrap{width:100%;max-width:600px}

/* ── Header ── */
.sf-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.sf-hd-l{display:flex;align-items:center;gap:8px}
.sf-hd-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--ink-900)}
.sf-bdg{font-family:var(--mono);font-size:9px;padding:2px 8px;border-radius:4px;border:1px solid;display:inline-flex;align-items:center;gap:4px}
.sf-bdg-live{color:#5a9a3c;background:rgba(90,154,60,0.03);border-color:rgba(90,154,60,0.08)}
.sf-bdg-pro{color:var(--ember);background:var(--ember-bg);border-color:rgba(176,125,79,0.08);font-weight:500}
.sf-bdg-dot{width:4px;height:4px;border-radius:50%;background:currentColor;animation:bd 1.5s ease infinite}
@keyframes bd{0%,60%,100%{opacity:.25}15%{opacity:1}}
.sf-hd-close{width:28px;height:28px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;color:var(--ink-400);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .1s}
.sf-hd-close:hover{background:var(--warm-100);color:var(--ink-600)}

/* ── Progress ── */
.sf-prog{display:flex;align-items:center;gap:0;margin-bottom:20px;padding:0 4px}
.sf-prog-step{display:flex;align-items:center;gap:0;flex:1}
.sf-prog-step:last-child{flex:0}
.sf-prog-dot{width:24px;height:24px;border-radius:50%;border:2px solid var(--warm-200);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:9px;font-weight:500;color:var(--ink-300);background:#fff;flex-shrink:0;transition:all .25s;position:relative;z-index:1}
.sf-prog-dot.active{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
.sf-prog-dot.done{border-color:#5a9a3c;color:#fff;background:#5a9a3c}
.sf-prog-dot.current{border-color:var(--ember);color:#fff;background:var(--ember);box-shadow:0 0 0 4px rgba(176,125,79,0.08)}
.sf-prog-line{flex:1;height:2px;background:var(--warm-200);transition:background .3s}
.sf-prog-line.done{background:#5a9a3c}
.sf-prog-line.active{background:var(--ember)}
.sf-prog-labels{display:flex;justify-content:space-between;margin-top:-2px;margin-bottom:16px;padding:0 0}
.sf-prog-label{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-align:center;width:60px;transition:color .2s}
.sf-prog-label.active{color:var(--ember)}
.sf-prog-label.done{color:#5a9a3c}

/* ── Card ── */
.sf-card{background:#fff;border:1px solid var(--warm-200);border-radius:12px;overflow:hidden;animation:cardIn .25s ease}
@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.sf-card-head{padding:16px 20px;border-bottom:1px solid var(--warm-100)}
.sf-card-title{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:600;color:var(--ink-900);margin-bottom:2px}
.sf-card-sub{font-size:13px;color:var(--ink-400)}
.sf-card-body{padding:16px 20px}

/* ── Footer nav ── */
.sf-nav{display:flex;gap:8px;padding:14px 20px;border-top:1px solid var(--warm-100)}
.sf-btn{padding:10px 20px;border-radius:7px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .12s;border:none}
.sf-btn-back{background:#fff;color:var(--ink-500);border:1px solid var(--warm-200)}
.sf-btn-back:hover{background:var(--warm-50);border-color:var(--warm-300)}
.sf-btn-next{background:var(--ink-900);color:#fff;margin-left:auto}
.sf-btn-next:hover:not(:disabled){background:var(--ink-800);transform:translateY(-1px);box-shadow:0 3px 12px rgba(0,0,0,0.06)}
.sf-btn-next:disabled{opacity:.3;cursor:not-allowed}
.sf-btn-ember{background:var(--ember);color:#fff;margin-left:auto}
.sf-btn-ember:hover{background:var(--ember-light);transform:translateY(-1px);box-shadow:0 3px 12px rgba(176,125,79,0.15)}

/* ═══ STEP 1: Signal Type ═══ */
.sf-types{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.sf-type{padding:14px;border:1px solid var(--warm-200);border-radius:10px;cursor:pointer;transition:all .12s;position:relative}
.sf-type:hover{border-color:var(--warm-300);background:var(--warm-50)}
.sf-type.on{border-color:var(--ember);background:var(--ember-bg);box-shadow:0 0 0 1px var(--ember)}
.sf-type-pop{position:absolute;top:8px;right:8px;font-family:var(--mono);font-size:7px;color:#5a9a3c;background:rgba(90,154,60,0.06);padding:1px 5px;border-radius:2px;border:1px solid rgba(90,154,60,0.08)}
.sf-type-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:8px;border:1px solid;transition:all .15s}
.sf-type-name{font-size:14px;font-weight:500;color:var(--ink-800);margin-bottom:2px}
.sf-type-desc{font-size:12px;color:var(--ink-400);line-height:1.4}

/* ═══ STEP 2: Niche ═══ */
.sf-niches{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px}
.sf-niche{padding:6px 14px;border-radius:6px;border:1px solid var(--warm-200);font-size:13px;color:var(--ink-500);cursor:pointer;transition:all .1s;background:#fff}
.sf-niche:hover{border-color:var(--warm-300);background:var(--warm-50)}
.sf-niche.on{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
.sf-custom{display:flex;gap:8px;margin-top:4px}
.sf-custom-input{flex:1;padding:8px 12px;border:1px solid var(--warm-200);border-radius:6px;font-size:13px;font-family:inherit;color:var(--ink-700);outline:none;transition:border-color .1s}
.sf-custom-input:focus{border-color:var(--ember)}
.sf-custom-input::placeholder{color:var(--warm-400)}
.sf-custom-btn{padding:8px 14px;border-radius:6px;border:1px solid var(--warm-200);background:#fff;font-size:12px;font-family:inherit;color:var(--ink-500);cursor:pointer;transition:all .1s}
.sf-custom-btn:hover{background:var(--warm-50)}

/* ═══ STEP 3: Sources ═══ */
.sf-sources{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.sf-src{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;border:1px solid var(--warm-200);cursor:pointer;transition:all .1s}
.sf-src:hover{background:var(--warm-50)}
.sf-src.on{border-color:rgba(90,154,60,0.12);background:rgba(90,154,60,0.015)}
.sf-src-icon{width:28px;height:28px;border-radius:6px;background:var(--warm-100);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:10px;font-weight:600;color:var(--ink-500);flex-shrink:0;transition:all .15s}
.sf-src.on .sf-src-icon{background:rgba(90,154,60,0.06);color:#5a9a3c}
.sf-src-info{flex:1;min-width:0}
.sf-src-name{font-size:13px;font-weight:500;color:var(--ink-700)}
.sf-src-desc{font-size:11px;color:var(--ink-300)}
.sf-src-toggle{width:32px;height:18px;border-radius:9px;background:var(--warm-200);position:relative;flex-shrink:0;transition:background .15s}
.sf-src.on .sf-src-toggle{background:#5a9a3c}
.sf-src-toggle-dot{width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .15s;box-shadow:0 1px 2px rgba(0,0,0,0.08)}
.sf-src.on .sf-src-toggle-dot{transform:translateX(14px)}

/* Preferences */
.sf-pref{margin-top:12px;padding-top:12px;border-top:1px solid var(--warm-100)}
.sf-pref-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.sf-pref-row{display:flex;gap:6px;margin-bottom:10px}
.sf-pref-opt{flex:1;padding:8px;border-radius:6px;border:1px solid var(--warm-200);text-align:center;font-size:12px;color:var(--ink-500);cursor:pointer;transition:all .1s;background:#fff}
.sf-pref-opt:hover{border-color:var(--warm-300)}
.sf-pref-opt.on{border-color:var(--ember);color:var(--ember);background:var(--ember-bg)}
.sf-pref-opt-label{font-weight:500;display:block}
.sf-pref-opt-sub{font-family:var(--mono);font-size:9px;color:var(--ink-300);margin-top:1px}

.sf-threshold{display:flex;align-items:center;gap:10px}
.sf-threshold-slider{flex:1;accent-color:var(--ember);height:3px}
.sf-threshold-val{font-family:var(--mono);font-size:12px;color:var(--ember);font-weight:500;min-width:32px}

/* ═══ STEP 4: Review ═══ */
.sf-review-section{margin-bottom:14px}
.sf-review-section:last-child{margin-bottom:0}
.sf-rev-label{font-family:var(--mono);font-size:9px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;display:flex;align-items:center;gap:6px}
.sf-rev-label-edit{font-size:9px;color:var(--ember);cursor:pointer;font-family:var(--mono);background:none;border:none;text-decoration:none}
.sf-rev-label-edit:hover{text-decoration:underline}
.sf-rev-card{padding:12px 14px;background:var(--warm-50);border:1px solid var(--warm-100);border-radius:8px}
.sf-rev-type{display:flex;align-items:center;gap:10px}
.sf-rev-type-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;border:1px solid;flex-shrink:0}
.sf-rev-type-info{flex:1}
.sf-rev-type-name{font-size:14px;font-weight:500;color:var(--ink-800)}
.sf-rev-type-desc{font-size:11px;color:var(--ink-400)}
.sf-rev-chips{display:flex;flex-wrap:wrap;gap:4px}
.sf-rev-chip{font-family:var(--mono);font-size:10px;padding:3px 8px;border-radius:4px;background:#fff;border:1px solid var(--warm-200);color:var(--ink-500)}
.sf-rev-row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
.sf-rev-row-label{color:var(--ink-400)}
.sf-rev-row-val{font-weight:500;color:var(--ink-700)}

/* ═══ STEP 5: AI Analysis ═══ */
.sf-ai-orb{display:flex;flex-direction:column;align-items:center;padding:28px 20px 20px;border-bottom:1px solid var(--warm-100)}
.sf-orb{width:72px;height:72px;position:relative;margin-bottom:14px}
.sf-rip{position:absolute;inset:0;border-radius:50%;border:1px solid var(--ember);opacity:0;pointer-events:none}
.sf-orb.on .sf-rip{animation:rp 3s cubic-bezier(0.2,0,0.3,1) infinite}
.sf-rip:nth-child(2){animation-delay:1s !important}
.sf-rip:nth-child(3){animation-delay:2s !important}
@keyframes rp{0%{transform:scale(1);opacity:.15}40%{opacity:.05}100%{transform:scale(2.4);opacity:0}}
.sf-orb-ring{position:absolute;border-radius:50%;border:1.5px solid transparent;opacity:0;pointer-events:none}
.sf-orb-ring-1{inset:-5px;border-top-color:var(--ember);border-right-color:rgba(176,125,79,0.2)}
.sf-orb-ring-2{inset:-11px;border-bottom-color:rgba(176,125,79,0.12)}
.sf-orb.on .sf-orb-ring-1{opacity:1;animation:or1 1.4s linear infinite}
.sf-orb.on .sf-orb-ring-2{opacity:1;animation:or2 2.8s linear infinite reverse}
@keyframes or1{to{transform:rotate(360deg)}}
@keyframes or2{to{transform:rotate(360deg)}}
.sf-orb-c{position:absolute;inset:10px;border-radius:50%;background:var(--ember-bg);border:1px solid rgba(176,125,79,0.1);display:flex;align-items:center;justify-content:center;z-index:1}
.sf-orb.fin .sf-rip,.sf-orb.fin .sf-orb-ring{animation:none !important;opacity:0 !important;transition:opacity .4s}
.sf-orb.fin .sf-orb-c{border-color:rgba(90,154,60,0.12);background:rgba(90,154,60,0.03)}
.sf-orb-ic{font-size:16px;color:var(--ember);transition:color .3s}
.sf-orb.fin .sf-orb-ic{color:#5a9a3c}

.sf-ai-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;color:var(--ink-900);text-align:center;margin-bottom:2px}
.sf-ai-sub{font-size:12px;color:var(--ink-400);text-align:center;margin-bottom:14px}
.sf-ai-prog{width:100%;max-width:220px}
.sf-ai-prog-bar{height:3px;background:var(--warm-200);border-radius:2px;overflow:hidden;margin-bottom:5px}
.sf-ai-prog-fill{height:100%;border-radius:2px;transition:width .5s cubic-bezier(0.16,1,0.3,1),background .3s}
.sf-ai-prog-row{display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

/* Waveform */
.sf-wv{padding:10px 20px;border-bottom:1px solid var(--warm-100);display:flex;align-items:center;gap:10px}
.sf-wv-lbl{font-family:var(--mono);font-size:8px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;flex-shrink:0;width:40px}
.sf-wv-bars{display:flex;gap:1.5px;align-items:center;flex:1;height:16px}
.sf-wv-b{width:2px;border-radius:1px;background:var(--ember);opacity:.06}
.sf-wv.on .sf-wv-b{animation:wb .7s ease-in-out infinite alternate}
@keyframes wb{0%{opacity:.05}100%{opacity:.3}}
.sf-wv.fin .sf-wv-b{animation:none;opacity:.03;height:2px !important;transition:all .4s}
.sf-wv-src{font-family:var(--mono);font-size:9px;color:var(--ink-300);flex-shrink:0;min-width:70px;text-align:right}
.sf-wv.on .sf-wv-src{color:var(--ember)}
.sf-wv.fin .sf-wv-src{color:#5a9a3c}

/* AI Steps */
.sf-ai-steps{padding:2px 10px 6px}
.sf-ai-st{display:flex;align-items:center;gap:10px;padding:8px 8px;transition:opacity .2s}
.sf-ai-st+.sf-ai-st{border-top:1px solid var(--warm-100)}
.sf-ai-st.wait{opacity:.25}
.sf-ai-st-ic{width:24px;height:24px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;border:1px solid;transition:all .2s}
.sf-ai-st.wait .sf-ai-st-ic{color:var(--ink-300);background:var(--warm-50);border-color:var(--warm-200)}
.sf-ai-st.on .sf-ai-st-ic{color:var(--ember);background:var(--ember-bg);border-color:rgba(176,125,79,0.1)}
.sf-ai-st.ok .sf-ai-st-ic{color:#5a9a3c;background:rgba(90,154,60,0.04);border-color:rgba(90,154,60,0.08)}
.sf-ai-st-text{flex:1;font-size:12px;color:var(--ink-300);transition:all .2s}
.sf-ai-st.on .sf-ai-st-text{color:var(--ink-700);font-weight:500}
.sf-ai-st.ok .sf-ai-st-text{color:var(--ink-400)}
.sf-ai-st-r{flex-shrink:0}
.sf-spin{width:12px;height:12px;border:1.5px solid var(--warm-200);border-top-color:var(--ember);border-radius:50%;animation:sp .55s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.sf-ai-st-done{font-family:var(--mono);font-size:9px;color:#5a9a3c;opacity:0;transition:opacity .2s}
.sf-ai-st.ok .sf-ai-st-done{opacity:1}

/* ═══ STEP 6: Results ═══ */
.sf-res{padding:20px;animation:resIn .3s ease}
@keyframes resIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.sf-res-top{display:flex;align-items:center;gap:12px;margin-bottom:16px}
.sf-res-check{width:38px;height:38px;border-radius:50%;background:rgba(90,154,60,0.04);border:1px solid rgba(90,154,60,0.1);color:#5a9a3c;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sf-res-title{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:600;color:var(--ink-900)}
.sf-res-sub{font-size:12px;color:var(--ink-400)}

.sf-res-stats{display:flex;gap:6px;margin-bottom:14px}
.sf-res-stat{flex:1;padding:8px;background:var(--warm-50);border:1px solid var(--warm-100);border-radius:7px;text-align:center}
.sf-res-stat-v{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:600;line-height:1}
.sf-res-stat-l{font-family:var(--mono);font-size:7px;color:var(--ink-300);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}

/* Signal cards */
.sf-sig{border:1px solid var(--warm-200);border-radius:8px;padding:12px 14px;margin-bottom:6px;cursor:pointer;transition:all .2s;opacity:0;transform:translateY(6px)}
.sf-sig.vis{opacity:1;transform:translateY(0)}
.sf-sig:hover{border-color:var(--warm-300);background:var(--warm-50)}
.sf-sig-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:3px}
.sf-sig-type{font-family:var(--mono);font-size:8px;font-weight:500;padding:1px 6px;border-radius:3px;border:1px solid}
.sf-sig-rel{font-family:var(--mono);font-size:10px;font-weight:500}
.sf-sig-title{font-size:14px;font-weight:500;color:var(--ink-800);line-height:1.3;margin-bottom:3px}
.sf-sig-desc{font-size:12px;color:var(--ink-400);line-height:1.4;margin-bottom:4px}
.sf-sig-meta{display:flex;gap:8px;font-family:var(--mono);font-size:9px;color:var(--ink-300)}

.sf-res-cta{display:flex;gap:8px;margin-top:14px}
.sf-res-btn{flex:1;padding:10px;border-radius:7px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;transition:all .1s;border:none;text-align:center}
.sf-res-btn-p{background:var(--ink-900);color:#fff}
.sf-res-btn-p:hover{background:var(--ink-800)}
.sf-res-btn-s{background:#fff;color:var(--ink-500);border:1px solid var(--warm-200)}
.sf-res-btn-s:hover{background:var(--warm-50)}

/* ── Footer ── */
.sf-ft{padding:7px 14px;border-top:1px solid var(--warm-100);display:flex;justify-content:space-between;font-family:var(--mono);font-size:9px;color:var(--ink-300)}
.sf-ft-l{display:flex;align-items:center;gap:5px}
.sf-ft-dot{width:4px;height:4px;border-radius:50%;animation:bd 1.5s ease infinite}
      `}</style>

      <div className="sf"><div className="sf-wrap">

        {/* ── Header ── */}
        <div className="sf-hd">
          <div className="sf-hd-l">
            <span className="sf-hd-title">The Wire</span>
            <span className="sf-bdg sf-bdg-live"><span className="sf-bdg-dot" />Live</span>
            <span className="sf-bdg sf-bdg-pro">PRO</span>
          </div>
          <button className="sf-hd-close">✕</button>
        </div>

        {/* ── Progress Stepper ── */}
        <div className="sf-prog">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.id} className="sf-prog-step">
              <div className={`sf-prog-dot${i < step ? " done" : i === step ? " current" : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <div className={`sf-prog-line${i < step ? " done" : i === step ? " active" : ""}`} />
              )}
            </div>
          ))}
        </div>
        <div className="sf-prog-labels">
          {FLOW_STEPS.map((s, i) => (
            <span key={s.id} className={`sf-prog-label${i < step ? " done" : i === step ? " active" : ""}`}>{s.label}</span>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="sf-card" key={step}>

          {/* ═══ STEP 1: Choose Type ═══ */}
          {step === 0 && (
            <>
              <div className="sf-card-head">
                <div className="sf-card-title">What do you want to track?</div>
                <div className="sf-card-sub">Choose the type of intelligence you need</div>
              </div>
              <div className="sf-card-body">
                <div className="sf-types">
                  {SIGNAL_TYPES.map(t => (
                    <div key={t.id} className={`sf-type${signalType === t.id ? " on" : ""}`} onClick={() => setSignalType(t.id)}>
                      {t.popular && <span className="sf-type-pop">Popular</span>}
                      <div className="sf-type-icon" style={{ color: t.color, background: t.color + "06", borderColor: t.color + "15" }}>{t.icon}</div>
                      <div className="sf-type-name">{t.label}</div>
                      <div className="sf-type-desc">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sf-nav">
                <button className="sf-btn sf-btn-next" disabled={!canProceed()} onClick={goNext}>Continue →</button>
              </div>
            </>
          )}

          {/* ═══ STEP 2: Define Niche ═══ */}
          {step === 1 && (
            <>
              <div className="sf-card-head">
                <div className="sf-card-title">Define your niche</div>
                <div className="sf-card-sub">Select the areas you work in — we'll tailor signals to match</div>
              </div>
              <div className="sf-card-body">
                <div className="sf-niches">
                  {NICHES.map(n => (
                    <div key={n} className={`sf-niche${selectedNiches.has(n) ? " on" : ""}`} onClick={() => toggleNiche(n)}>{n}</div>
                  ))}
                </div>
                <div className="sf-custom">
                  <input className="sf-custom-input" placeholder="Add a custom niche..." value={customNiche} onChange={e => setCustomNiche(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && customNiche.trim()) { toggleNiche(customNiche.trim()); setCustomNiche(""); } }} />
                  <button className="sf-custom-btn" onClick={() => { if (customNiche.trim()) { toggleNiche(customNiche.trim()); setCustomNiche(""); } }}>Add</button>
                </div>
              </div>
              <div className="sf-nav">
                <button className="sf-btn sf-btn-back" onClick={goBack}>← Back</button>
                <button className="sf-btn sf-btn-next" disabled={!canProceed()} onClick={goNext}>Continue →</button>
              </div>
            </>
          )}

          {/* ═══ STEP 3: Sources & Preferences ═══ */}
          {step === 2 && (
            <>
              <div className="sf-card-head">
                <div className="sf-card-title">Configure sources</div>
                <div className="sf-card-sub">Choose where to scan and how often to alert you</div>
              </div>
              <div className="sf-card-body">
                <div className="sf-sources">
                  {sources.map(s => (
                    <div key={s.id} className={`sf-src${s.on ? " on" : ""}`} onClick={() => toggleSource(s.id)}>
                      <div className="sf-src-icon">{s.icon}</div>
                      <div className="sf-src-info">
                        <div className="sf-src-name">{s.label}</div>
                        <div className="sf-src-desc">{s.desc}</div>
                      </div>
                      <div className="sf-src-toggle"><div className="sf-src-toggle-dot" /></div>
                    </div>
                  ))}
                </div>

                <div className="sf-pref">
                  <div className="sf-pref-label">Scan frequency</div>
                  <div className="sf-pref-row">
                    {[
                      { id: "realtime", label: "Real-time", sub: "Instant alerts" },
                      { id: "daily", label: "Daily", sub: "Morning digest" },
                      { id: "weekly", label: "Weekly", sub: "Friday summary" },
                    ].map(f => (
                      <div key={f.id} className={`sf-pref-opt${frequency === f.id ? " on" : ""}`} onClick={() => setFrequency(f.id)}>
                        <span className="sf-pref-opt-label">{f.label}</span>
                        <span className="sf-pref-opt-sub">{f.sub}</span>
                      </div>
                    ))}
                  </div>

                  <div className="sf-pref-label">Minimum relevance threshold</div>
                  <div className="sf-threshold">
                    <input type="range" className="sf-threshold-slider" min="30" max="95" value={threshold} onChange={e => setThreshold(Number(e.target.value))} />
                    <span className="sf-threshold-val">{threshold}%</span>
                  </div>
                </div>
              </div>
              <div className="sf-nav">
                <button className="sf-btn sf-btn-back" onClick={goBack}>← Back</button>
                <button className="sf-btn sf-btn-next" disabled={!canProceed()} onClick={goNext}>Continue →</button>
              </div>
            </>
          )}

          {/* ═══ STEP 4: Review ═══ */}
          {step === 3 && (
            <>
              <div className="sf-card-head">
                <div className="sf-card-title">Review your signal</div>
                <div className="sf-card-sub">Confirm everything looks right before we start scanning</div>
              </div>
              <div className="sf-card-body">
                <div className="sf-review-section">
                  <div className="sf-rev-label">Signal type <button className="sf-rev-label-edit" onClick={() => setStep(0)}>Edit</button></div>
                  {selectedType && (
                    <div className="sf-rev-card">
                      <div className="sf-rev-type">
                        <div className="sf-rev-type-icon" style={{ color: selectedType.color, background: selectedType.color + "06", borderColor: selectedType.color + "15" }}>{selectedType.icon}</div>
                        <div className="sf-rev-type-info">
                          <div className="sf-rev-type-name">{selectedType.label}</div>
                          <div className="sf-rev-type-desc">{selectedType.desc}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sf-review-section">
                  <div className="sf-rev-label">Niches <button className="sf-rev-label-edit" onClick={() => setStep(1)}>Edit</button></div>
                  <div className="sf-rev-chips">
                    {[...selectedNiches].map(n => <span key={n} className="sf-rev-chip">{n}</span>)}
                  </div>
                </div>

                <div className="sf-review-section">
                  <div className="sf-rev-label">Configuration <button className="sf-rev-label-edit" onClick={() => setStep(2)}>Edit</button></div>
                  <div className="sf-rev-card">
                    <div className="sf-rev-row"><span className="sf-rev-row-label">Sources</span><span className="sf-rev-row-val">{activeSources.length} active</span></div>
                    <div className="sf-rev-row"><span className="sf-rev-row-label">Frequency</span><span className="sf-rev-row-val">{frequency === "realtime" ? "Real-time" : frequency === "daily" ? "Daily digest" : "Weekly summary"}</span></div>
                    <div className="sf-rev-row"><span className="sf-rev-row-label">Min relevance</span><span className="sf-rev-row-val">{threshold}%</span></div>
                  </div>
                </div>
              </div>
              <div className="sf-nav">
                <button className="sf-btn sf-btn-back" onClick={goBack}>← Back</button>
                <button className="sf-btn sf-btn-ember" onClick={goNext}>Launch Signal ◆</button>
              </div>
            </>
          )}

          {/* ═══ STEP 5: AI Analysis ═══ */}
          {step === 4 && (
            <>
              <div className="sf-ai-orb">
                <div className={`sf-orb${allDone ? " fin" : aiStep >= 0 ? " on" : ""}`}>
                  <div className="sf-rip" /><div className="sf-rip" /><div className="sf-rip" />
                  <div className="sf-orb-ring sf-orb-ring-1" />
                  <div className="sf-orb-ring sf-orb-ring-2" />
                  <div className="sf-orb-c"><span className="sf-orb-ic">{allDone ? "✓" : "◆"}</span></div>
                </div>
                <div className="sf-ai-title">{allDone ? "Analysis complete" : "Analyzing signal"}</div>
                <div className="sf-ai-sub">{allDone ? "Preparing results" : `Scanning ${activeSources.length} sources for ${[...selectedNiches][0] || "your niche"}`}</div>
                <div className="sf-ai-prog">
                  <div className="sf-ai-prog-bar">
                    <div className="sf-ai-prog-fill" style={{ width: `${aiPct}%`, background: allDone ? "#5a9a3c" : "var(--ember)" }} />
                  </div>
                  <div className="sf-ai-prog-row">
                    <span>{aiCompleted} of {AI_STEPS.length}</span>
                    <Elapsed running={aiStep >= 0 && !allDone} />
                  </div>
                </div>
              </div>

              <div className={`sf-wv${allDone ? " fin" : aiStep >= 0 ? " on" : ""}`}>
                <span className="sf-wv-lbl">Source</span>
                <div className="sf-wv-bars">
                  {Array.from({ length: 44 }).map((_, i) => (
                    <div key={i} className="sf-wv-b" style={{
                      height: `${3 + Math.abs(Math.sin(i * 0.45)) * 10 + Math.sin(i * 1.3) * 2}px`,
                      animationDelay: `${i * 0.04}s`,
                      animationDuration: `${0.5 + Math.abs(Math.sin(i * 0.8)) * 0.5}s`,
                    }} />
                  ))}
                </div>
                <span className="sf-wv-src">{currentSource}</span>
              </div>

              <div className="sf-ai-steps">
                {AI_STEPS.map((s, i) => {
                  const isDone = aiDone.has(i);
                  const isOn = aiStep === i && !isDone;
                  return (
                    <div key={i} className={`sf-ai-st${isDone ? " ok" : isOn ? " on" : " wait"}`}>
                      <div className="sf-ai-st-ic">{isDone ? "✓" : s.icon}</div>
                      <div className="sf-ai-st-text">{s.label}</div>
                      <div className="sf-ai-st-r">
                        {isOn && <div className="sf-spin" />}
                        <span className="sf-ai-st-done">Done</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="sf-ft">
                <div className="sf-ft-l"><span className="sf-ft-dot" style={{ background: allDone ? "#5a9a3c" : "var(--ember)" }} /><span>{allDone ? "Complete" : "Processing"}</span></div>
                <span>{selectedType?.label || "Signal"}</span>
              </div>
            </>
          )}

          {/* ═══ STEP 6: Results ═══ */}
          {step === 5 && (
            <>
              <div className="sf-res">
                <div className="sf-res-top">
                  <div className="sf-res-check">✓</div>
                  <div>
                    <div className="sf-res-title">{RESULTS.length} signals found</div>
                    <div className="sf-res-sub">For {[...selectedNiches].join(", ")}</div>
                  </div>
                </div>

                <div className="sf-res-stats">
                  {[
                    { v: String(RESULTS.length), l: "Signals", c: "var(--ink-900)" },
                    { v: "92%", l: "Avg relevance", c: "#5a9a3c" },
                    { v: "+34%", l: "Demand trend", c: "var(--ember)" },
                    { v: "$112", l: "Avg rate", c: "#5b7fa4" },
                  ].map((s, i) => (
                    <div key={i} className="sf-res-stat">
                      <div className="sf-res-stat-v" style={{ color: s.c }}>{s.v}</div>
                      <div className="sf-res-stat-l">{s.l}</div>
                    </div>
                  ))}
                </div>

                {RESULTS.map((r, i) => (
                  <div key={i} className={`sf-sig${i < revealedResults ? " vis" : ""}`} style={{ transitionDelay: `${i * 100}ms`, transitionDuration: ".3s" }}>
                    <div className="sf-sig-top">
                      <span className="sf-sig-type" style={{ color: r.typeColor, background: r.typeColor + "06", borderColor: r.typeColor + "15" }}>{r.type}</span>
                      <span className="sf-sig-rel" style={{ color: r.relevance >= 90 ? "#5a9a3c" : "var(--ember)" }}>{r.relevance}% match</span>
                    </div>
                    <div className="sf-sig-title">{r.title}</div>
                    <div className="sf-sig-desc">{r.desc}</div>
                    <div className="sf-sig-meta">
                      <span>{r.rate}</span>
                      <span style={{ color: "var(--warm-300)" }}>·</span>
                      <span>{r.source}</span>
                    </div>
                  </div>
                ))}

                <div className="sf-res-cta">
                  <button className="sf-res-btn sf-res-btn-p">Open in The Wire →</button>
                  <button className="sf-res-btn sf-res-btn-s">Create Another</button>
                </div>
              </div>

              <div className="sf-ft">
                <div className="sf-ft-l"><span className="sf-ft-dot" style={{ background: "#5a9a3c" }} /><span>Signal active · Scanning {frequency}</span></div>
                <span>{activeSources.length} sources</span>
              </div>
            </>
          )}
        </div>
      </div></div>
    </>
  );
}
