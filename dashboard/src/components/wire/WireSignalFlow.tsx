"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./WireSignalFlow.module.css";

/* ---------- Types ---------- */

interface Signal {
  id: number;
  type: string;
  source: string;
  time: string;
  live?: boolean;
  headline: string;
  body: string;
  tags: string[];
  relevance: number;
  metric?: { label: string; sub: string };
  spark?: number[];
  isClientSignal?: boolean;
  group: string;
  relatedAction?: string;
}

interface FlowConfig {
  signalType: string;
  niches: string[];
  sources: string[];
  frequency: string;
  threshold: number;
}

interface WireSignalFlowProps {
  onComplete: (config: FlowConfig, signals: Signal[]) => void;
}

/* ---------- Constants ---------- */

const SIGNAL_TYPES: Record<string, { icon: string; color: string; bg: string }> = {
  trend:       { icon: "↗", color: "#5a9a3c", bg: "rgba(90,154,60,0.04)" },
  opportunity: { icon: "◆", color: "#b07d4f", bg: "rgba(176,125,79,0.04)" },
  insight:     { icon: "◎", color: "#5b7fa4", bg: "rgba(91,127,164,0.04)" },
  alert:       { icon: "!", color: "#c24b38", bg: "rgba(194,75,56,0.04)" },
  client:      { icon: "⬡", color: "#8a7e63", bg: "rgba(138,126,99,0.04)" },
  market:      { icon: "$", color: "#7c6b9e", bg: "rgba(124,107,158,0.04)" },
  tool:        { icon: "⚙", color: "#7c8594", bg: "rgba(124,133,148,0.04)" },
  community:   { icon: "●", color: "#a08472", bg: "rgba(160,132,114,0.04)" },
};

const TYPE_OPTIONS = [
  { key: "opportunity", name: "Opportunity Scanner", desc: "Find new projects, leads, and gigs across platforms", popular: true },
  { key: "market",      name: "Market Pulse",        desc: "Track industry trends, demand shifts, and pricing movements" },
  { key: "client",      name: "Competitor Watch",     desc: "Monitor competitor activity, positioning, and pricing" },
  { key: "insight",     name: "Client Signals",       desc: "Surface upsell cues, hiring signals, and funding events from your clients" },
  { key: "trend",       name: "Rate Intelligence",    desc: "Benchmark your rates against real market data for your niche" },
  { key: "tool",        name: "Tool Radar",           desc: "Discover new tools, fonts, resources, and platform changes" },
];

const NICHE_OPTIONS = [
  "Brand Identity", "Web Design", "UI/UX", "Logo Design",
  "Illustration", "Motion Design", "Copywriting", "Marketing",
  "App Design", "Packaging", "Social Media", "Photography",
  "Video Production", "SEO", "Email Marketing", "Print Design",
];

const SOURCE_OPTIONS = [
  { key: "LinkedIn",      abbr: "Li", color: "#5b7fa4" },
  { key: "Upwork",        abbr: "Up", color: "#5a9a3c" },
  { key: "Dribbble",      abbr: "Dr", color: "#ea4c89" },
  { key: "Twitter / X",   abbr: "X",  color: "#4f4c44" },
  { key: "Google Trends",  abbr: "GT", color: "#4285f4" },
  { key: "Reddit",        abbr: "Re", color: "#ff4500" },
  { key: "Indeed",        abbr: "In", color: "#2164f3" },
];

const ANALYSIS_STEPS = [
  "Scanning sources...",
  "Analyzing market data...",
  "Cross-referencing niches...",
  "Scoring relevance...",
  "Generating signals...",
];

/* ---------- Component ---------- */

export default function WireSignalFlow({ onComplete }: WireSignalFlowProps) {
  const [step, setStep] = useState(0);

  // Config state
  const [signalType, setSignalType] = useState("");
  const [niches, setNiches] = useState<string[]>([]);
  const [customNiche, setCustomNiche] = useState("");
  const [sources, setSources] = useState<string[]>(["LinkedIn", "Upwork", "Dribbble"]);
  const [frequency, setFrequency] = useState("daily");
  const [threshold, setThreshold] = useState(70);

  // Analysis state
  const [analysisStep, setAnalysisStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = 6;

  /* --- Analysis (Step 5) --- */
  const runAnalysis = useCallback(async () => {
    setError("");
    setAnalysisStep(0);
    setElapsed(0);

    // Start elapsed timer
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    // Cycle through analysis steps visually
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < ANALYSIS_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2200);

    try {
      const context = [
        `Signal type focus: ${TYPE_OPTIONS.find(t => t.key === signalType)?.name || signalType}`,
        `Niches: ${niches.join(", ")}`,
        `Sources: ${sources.join(", ")}`,
        `Frequency: ${frequency}`,
        `Relevance threshold: ${threshold}%`,
      ].join("\n");

      const res = await fetch("/api/wire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errData.error || `API returned ${res.status}`);
      }

      const data = await res.json();
      const raw: Signal[] = (data.signals || []).map((s: Record<string, unknown>) => ({
        id: s.id as number,
        type: s.type as string,
        source: s.source as string,
        time: s.time as string,
        live: s.live as boolean,
        headline: (s.title || s.headline) as string,
        body: s.body as string,
        tags: s.tags as string[],
        relevance: s.relevance as number,
        metric: s.metric as { label: string; sub: string } | undefined,
        spark: s.spark as number[] | undefined,
        isClientSignal: s.isClientSignal as boolean,
        group: s.group as string,
        relatedAction: s.relatedAction as string | undefined,
      }));

      // Finish analysis step animation
      setAnalysisStep(ANALYSIS_STEPS.length - 1);
      clearInterval(stepInterval);

      // Small delay so user sees "Generating signals..." complete
      await new Promise(r => setTimeout(r, 600));

      if (timerRef.current) clearInterval(timerRef.current);
      setSignals(raw);
      setStep(5); // move to results
    } catch (err) {
      clearInterval(stepInterval);
      if (timerRef.current) clearInterval(timerRef.current);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [signalType, niches, sources, frequency, threshold]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  /* --- Navigation --- */
  const canAdvance = (): boolean => {
    switch (step) {
      case 0: return signalType !== "";
      case 1: return niches.length > 0;
      case 2: return sources.length > 0;
      case 3: return true; // review
      case 4: return false; // analysis in progress
      case 5: return false; // results — uses CTAs
      default: return false;
    }
  };

  const goNext = () => {
    if (step === 3) {
      // Move to analysis step and trigger
      setStep(4);
      runAnalysis();
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const goBack = () => {
    if (step === 4 || step === 5) {
      // Going back from analysis/results resets to review
      if (timerRef.current) clearInterval(timerRef.current);
      setStep(3);
      return;
    }
    if (step > 0) setStep(step - 1);
  };

  const toggleNiche = (n: string) => {
    setNiches(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);
  };

  const addCustomNiche = () => {
    const trimmed = customNiche.trim();
    if (trimmed && !niches.includes(trimmed)) {
      setNiches(prev => [...prev, trimmed]);
      setCustomNiche("");
    }
  };

  const toggleSource = (s: string) => {
    setSources(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleComplete = () => {
    onComplete(
      { signalType, niches, sources, frequency, threshold },
      signals,
    );
  };

  const handleCreateAnother = () => {
    setStep(0);
    setSignalType("");
    setNiches([]);
    setSources(["LinkedIn", "Upwork", "Dribbble"]);
    setFrequency("daily");
    setThreshold(70);
    setSignals([]);
    setError("");
    setElapsed(0);
  };

  /* --- Stepper --- */
  const renderStepper = () => (
    <div className={styles.stepper}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          {i > 0 && (
            <div className={`${styles.stepLine} ${i <= step ? styles.stepLineDone : ""}`} />
          )}
          <div
            className={`${styles.stepDot} ${i < step ? styles.stepDotDone : ""} ${i === step ? styles.stepDotCurrent : ""}`}
          />
        </div>
      ))}
    </div>
  );

  /* --- Step renderers --- */

  const renderStep0 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepTitle}>What kind of intelligence?</div>
      <div className={styles.stepSub}>Choose the signal type that matters most to your business right now</div>
      <div className={styles.typeGrid}>
        {TYPE_OPTIONS.map(t => (
          <button
            key={t.key}
            className={`${styles.typeCard} ${signalType === t.key ? styles.typeCardActive : ""}`}
            onClick={() => setSignalType(t.key)}
          >
            {t.popular && <span className={styles.popularBadge}>Popular</span>}
            <span className={styles.typeIcon}>{SIGNAL_TYPES[t.key]?.icon || "?"}</span>
            <div className={styles.typeName}>{t.name}</div>
            <div className={styles.typeDesc}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepTitle}>Select your niches</div>
      <div className={styles.stepSub}>Pick the areas you specialize in — we will tailor signals accordingly</div>
      <div className={styles.nichePills}>
        {NICHE_OPTIONS.map(n => (
          <button
            key={n}
            className={`${styles.nichePill} ${niches.includes(n) ? styles.nichePillActive : ""}`}
            onClick={() => toggleNiche(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className={styles.customNicheWrap}>
        <input
          className={styles.customNicheInput}
          placeholder="Add a custom niche..."
          value={customNiche}
          onChange={e => setCustomNiche(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCustomNiche()}
        />
        <button className={styles.customNicheBtn} onClick={addCustomNiche}>Add</button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepTitle}>Configure sources</div>
      <div className={styles.stepSub}>Toggle on the platforms you want us to monitor</div>
      <div className={styles.sourceList}>
        {SOURCE_OPTIONS.map(s => (
          <div key={s.key} className={styles.sourceRow}>
            <div className={styles.sourceIcon} style={{ background: s.color }}>{s.abbr}</div>
            <span className={styles.sourceName}>{s.key}</span>
            <button
              className={`${styles.toggle} ${sources.includes(s.key) ? styles.toggleOn : ""}`}
              onClick={() => toggleSource(s.key)}
              aria-label={`Toggle ${s.key}`}
            >
              <div className={styles.toggleKnob} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.configSection}>
        <span className={styles.configLabel}>Scan frequency</span>
        <div className={styles.freqBtns}>
          {["real-time", "daily", "weekly"].map(f => (
            <button
              key={f}
              className={`${styles.freqBtn} ${frequency === f ? styles.freqBtnActive : ""}`}
              onClick={() => setFrequency(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <span className={styles.configLabel}>Relevance threshold</span>
        <div className={styles.sliderWrap}>
          <input
            type="range"
            min={50}
            max={95}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderVal}>{threshold}%</span>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const typeName = TYPE_OPTIONS.find(t => t.key === signalType)?.name || signalType;
    return (
      <div className={styles.stepContent}>
        <div className={styles.stepTitle}>Review your signal config</div>
        <div className={styles.stepSub}>Everything look right? Hit Generate to scan the market.</div>
        <div className={styles.reviewCard}>
          <div className={styles.reviewSection}>
            <div>
              <div className={styles.reviewLabel}>Signal Type</div>
              <div className={styles.reviewValue}>{typeName}</div>
            </div>
            <button className={styles.reviewEdit} onClick={() => setStep(0)}>Edit</button>
          </div>
          <div className={styles.reviewSection}>
            <div>
              <div className={styles.reviewLabel}>Niches</div>
              <div className={styles.reviewTags}>
                {niches.map(n => <span key={n} className={styles.reviewTag}>{n}</span>)}
              </div>
            </div>
            <button className={styles.reviewEdit} onClick={() => setStep(1)}>Edit</button>
          </div>
          <div className={styles.reviewSection}>
            <div>
              <div className={styles.reviewLabel}>Sources</div>
              <div className={styles.reviewTags}>
                {sources.map(s => <span key={s} className={styles.reviewTag}>{s}</span>)}
              </div>
            </div>
            <button className={styles.reviewEdit} onClick={() => setStep(2)}>Edit</button>
          </div>
          <div className={styles.reviewSection}>
            <div>
              <div className={styles.reviewLabel}>Frequency &amp; Threshold</div>
              <div className={styles.reviewValue}>
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)} &middot; {threshold}% relevance
              </div>
            </div>
            <button className={styles.reviewEdit} onClick={() => setStep(2)}>Edit</button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className={styles.stepContent}>
      <div className={styles.stepTitle}>Generating your briefing</div>
      <div className={styles.stepSub}>AI is scanning {sources.length} sources across {niches.length} niches</div>
      <div className={styles.analysisWrap}>
        {/* Orb */}
        <div className={styles.orbContainer}>
          <div className={styles.ring1} />
          <div className={styles.ring2} />
          <div className={styles.ripple1} />
          <div className={styles.ripple2} />
          <div className={styles.ripple3} />
          <div className={styles.orb} />
        </div>

        {/* Waveform */}
        <div className={styles.waveform}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={styles.waveBar} />
          ))}
        </div>

        {/* Steps */}
        <div className={styles.analysisSteps}>
          {ANALYSIS_STEPS.map((label, i) => (
            <div
              key={i}
              className={`${styles.analysisStep} ${i === analysisStep ? styles.analysisStepActive : ""} ${i < analysisStep ? styles.analysisStepDone : ""}`}
            >
              <div className={styles.analysisStepIcon}>
                {i < analysisStep ? "✓" : i === analysisStep ? "◌" : "○"}
              </div>
              {label}
            </div>
          ))}
        </div>

        <div className={styles.timer}>{elapsed}s elapsed</div>

        {error && (
          <div className={styles.errorWrap}>
            <div className={styles.errorText}>{error}</div>
            <button className={styles.retryBtn} onClick={runAnalysis}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5 = () => {
    const liveCount = signals.filter(s => s.group === "live").length;
    const clientCount = signals.filter(s => s.isClientSignal).length;
    const avgRel = signals.length > 0 ? Math.round(signals.reduce((sum, s) => sum + s.relevance, 0) / signals.length) : 0;
    const preview = signals.slice(0, 5);

    return (
      <div className={styles.stepContent}>
        <div className={styles.stepTitle}>Your briefing is ready</div>
        <div className={styles.stepSub}>{signals.length} signals generated in {elapsed}s</div>

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{signals.length}</div>
            <div className={styles.statLabel}>Signals</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{liveCount}</div>
            <div className={styles.statLabel}>Live</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{clientCount}</div>
            <div className={styles.statLabel}>Client</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statVal}>{avgRel}%</div>
            <div className={styles.statLabel}>Avg Relevance</div>
          </div>
        </div>

        <div className={styles.resultCards}>
          {preview.map(s => {
            const tc = SIGNAL_TYPES[s.type] || { icon: "?", color: "#999", bg: "rgba(0,0,0,0.02)" };
            return (
              <div key={s.id} className={styles.resultCard}>
                <div className={styles.resultType} style={{ background: tc.bg, color: tc.color, border: `1px solid ${tc.color}12` }}>
                  {tc.icon}
                </div>
                <div className={styles.resultBody}>
                  <div className={styles.resultHeadline}>{s.headline}</div>
                  <div className={styles.resultMeta}>{s.source} &middot; {s.time} ago</div>
                </div>
                <div className={styles.resultRel}>{s.relevance}%</div>
              </div>
            );
          })}
        </div>

        <div className={styles.resultCtas}>
          <button className={styles.ctaPrimary} onClick={handleComplete}>
            Open in The Wire
          </button>
          <button className={styles.ctaSecondary} onClick={handleCreateAnother}>
            Create Another
          </button>
        </div>
      </div>
    );
  };

  /* --- Render --- */
  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className={styles.flow}>
      {renderStepper()}
      <div className={styles.body}>
        {stepRenderers[step]()}
      </div>
      {step < 4 && (
        <div className={styles.nav}>
          <button className={styles.navBack} onClick={goBack} disabled={step === 0}>
            &larr; Back
          </button>
          <button className={styles.navNext} onClick={goNext} disabled={!canAdvance()}>
            {step === 3 ? "Generate" : "Continue"} &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
