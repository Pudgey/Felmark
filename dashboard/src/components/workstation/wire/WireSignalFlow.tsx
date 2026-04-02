"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./WireSignalFlow.module.css";

/* ── Types ── */
export interface WireConfig {
  signalType: string;
  niches: string[];
  sources: string[];
  frequency: string;
  threshold: number;
}

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

interface WireSignalFlowProps {
  onComplete: (config: WireConfig, signals: Signal[]) => void;
  onClose?: () => void;
}

/* ── Constants ── */
const SIGNAL_TYPE_OPTIONS = [
  { id: "opportunity", icon: "◆", name: "Opportunity Scanner", desc: "Find new leads, projects & revenue opportunities", color: "#b07d4f", bg: "rgba(176,125,79,0.06)", popular: true },
  { id: "market", icon: "$", name: "Market Pulse", desc: "Track pricing, demand & industry shifts", color: "#7c6b9e", bg: "rgba(124,107,158,0.06)" },
  { id: "trend", icon: "↗", name: "Competitor Watch", desc: "Monitor competitor positioning & activity", color: "#5a9a3c", bg: "rgba(90,154,60,0.06)" },
  { id: "client", icon: "⬡", name: "Client Signals", desc: "Track client activity, hiring & funding events", color: "#8a7e63", bg: "rgba(138,126,99,0.06)" },
  { id: "insight", icon: "◎", name: "Rate Intelligence", desc: "Benchmark rates, utilization & revenue data", color: "#5b7fa4", bg: "rgba(91,127,164,0.06)" },
  { id: "tool", icon: "⚙", name: "Tool & Trend Radar", desc: "New tools, design trends & community buzz", color: "#7c8594", bg: "rgba(124,133,148,0.06)" },
];

const NICHE_OPTIONS = [
  "Brand Identity", "Web Design", "UI/UX Design", "Copywriting",
  "Marketing", "Illustration", "Motion Design", "Photography",
  "Development", "Strategy",
];

const SOURCE_OPTIONS = [
  { name: "LinkedIn", abbr: "Li", color: "#5b7fa4" },
  { name: "Upwork", abbr: "Up", color: "#5a9a3c" },
  { name: "Dribbble", abbr: "Dr", color: "#ea4c89" },
  { name: "Behance", abbr: "Be", color: "#1769ff" },
  { name: "Twitter / X", abbr: "X", color: "#4f4c44" },
  { name: "Google Trends", abbr: "GT", color: "#4285f4" },
  { name: "Hacker News", abbr: "HN", color: "#ff6600" },
  { name: "ProductHunt", abbr: "PH", color: "#da552f" },
  { name: "Reddit", abbr: "Re", color: "#ff4500" },
  { name: "Awwwards", abbr: "Aw", color: "#2c2a25" },
];

const SIGNAL_TYPES: Record<string, { icon: string; color: string; bg: string }> = {
  trend: { icon: "↗", color: "#5a9a3c", bg: "rgba(90,154,60,0.04)" },
  opportunity: { icon: "◆", color: "#b07d4f", bg: "rgba(176,125,79,0.04)" },
  insight: { icon: "◎", color: "#5b7fa4", bg: "rgba(91,127,164,0.04)" },
  alert: { icon: "!", color: "#c24b38", bg: "rgba(194,75,56,0.04)" },
  client: { icon: "⬡", color: "#8a7e63", bg: "rgba(138,126,99,0.04)" },
  market: { icon: "$", color: "#7c6b9e", bg: "rgba(124,107,158,0.04)" },
  tool: { icon: "⚙", color: "#7c8594", bg: "rgba(124,133,148,0.04)" },
  community: { icon: "●", color: "#a08472", bg: "rgba(160,132,114,0.04)" },
};

const ANALYSIS_STEPS = [
  "Scanning sources",
  "Analyzing demand signals",
  "Cross-referencing market data",
  "Scoring relevance",
  "Generating intelligence briefing",
];

const TOTAL_STEPS = 6;

/* ── Component ── */
export default function WireSignalFlow({ onComplete, onClose }: WireSignalFlowProps) {
  const [step, setStep] = useState(0);

  // Step 1: Signal type
  const [signalType, setSignalType] = useState("");

  // Step 2: Niches
  const [niches, setNiches] = useState<string[]>(["Brand Identity"]);
  const [customNiche, setCustomNiche] = useState("");

  // Step 3: Sources
  const [enabledSources, setEnabledSources] = useState<Set<string>>(
    new Set(["LinkedIn", "Upwork", "Dribbble", "Google Trends", "Hacker News"])
  );
  const [frequency, setFrequency] = useState("daily");
  const [threshold, setThreshold] = useState(75);

  // Step 5: Analysis
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Step 6: Results
  const [results, setResults] = useState<Signal[]>([]);

  /* ── Navigation ── */
  const canNext = () => {
    if (step === 0) return signalType !== "";
    if (step === 1) return niches.length > 0;
    if (step === 2) return enabledSources.size > 0;
    return true;
  };

  /* ── API call (step 5) ── */
  const runAnalysis = useCallback(async () => {
    setAnalysisStep(0);
    setAnalysisError(null);

    const context = [
      `Signal focus: ${SIGNAL_TYPE_OPTIONS.find(s => s.id === signalType)?.name || signalType}`,
      `Niches: ${niches.join(", ")}`,
      `Monitored sources: ${Array.from(enabledSources).join(", ")}`,
      `Scan frequency: ${frequency}`,
      `Relevance threshold: ${threshold}%`,
      `The freelancer wants intelligence focused on ${niches.join(" and ")} in the freelance market.`,
    ].join("\n");

    // Step-by-step progress animation
    const stepTimers: NodeJS.Timeout[] = [];
    for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
      stepTimers.push(
        setTimeout(() => setAnalysisStep(i), i * 2200)
      );
    }

    try {
      const res = await fetch("/api/wire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });

      stepTimers.forEach(clearTimeout);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || `API error ${res.status}`);
      }

      const data = await res.json();
      const signals: Signal[] = (data.signals || []).map((s: Record<string, unknown>) => ({
        ...s,
        headline: (s.title as string) || (s.headline as string) || "",
        relatedAction: (s.relatedAction as string) || undefined,
      }));

      // Complete all analysis steps visually before showing results
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        setAnalysisStep(i);
        await new Promise(r => setTimeout(r, 300));
      }
      // brief pause after last step completes
      await new Promise(r => setTimeout(r, 600));

      setResults(signals);
      setStep(5);
    } catch (err) {
      stepTimers.forEach(clearTimeout);
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      // Show all steps as complete (failed state) so user can retry
      setAnalysisStep(ANALYSIS_STEPS.length - 1);
    }
  }, [signalType, niches, enabledSources, frequency, threshold]);

  // Start analysis when entering step 4 (0-indexed)
  useEffect(() => {
    if (step === 4) {
      runAnalysis();
    }
  }, [step, runAnalysis]);

  useEffect(() => {
    if (!onClose) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  /* ── Niche helpers ── */
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

  /* ── Source toggle ── */
  const toggleSource = (name: string) => {
    setEnabledSources(prev => {
      const next = new Set(prev);
      if (next.has(name)) { next.delete(name); } else { next.add(name); }
      return next;
    });
  };

  /* ── Progress stepper ── */
  const renderStepper = () => (
    <div className={styles.stepper}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div className={`${styles.stepDot} ${i < step ? "done" : ""} ${i === step ? "current" : ""}`}
            style={{
              background: i < step ? "#5a9a3c" : i === step ? "var(--ember)" : undefined,
              borderColor: i < step ? "#5a9a3c" : i === step ? "var(--ember)" : undefined,
              boxShadow: i === step ? "0 0 0 4px rgba(176,125,79,0.15)" : undefined,
            }}
          />
          {i < TOTAL_STEPS - 1 && (
            <div className={`${styles.stepLine} ${i < step ? "done" : ""}`}
              style={{ background: i < step ? "#5a9a3c" : undefined }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderCloseButton = () =>
    onClose ? (
      <button className={styles.closeBtn} type="button" onClick={onClose} aria-label="Close signal flow">
        ×
      </button>
    ) : null;

  /* ── Step 1: Signal Type ── */
  const renderSignalType = () => (
    <div className={styles.card}>
      {renderCloseButton()}
      <div className={styles.cardTitle}>What do you want to track?</div>
      <div className={styles.cardSub}>Choose your primary intelligence focus</div>
      <div className={styles.typeGrid}>
        {SIGNAL_TYPE_OPTIONS.map(opt => (
          <div
            key={opt.id}
            className={`${styles.typeCard} ${signalType === opt.id ? styles.selected : ""}`}
            onClick={() => setSignalType(opt.id)}
          >
            {opt.popular && <span className={styles.popularBadge}>Popular</span>}
            <div className={styles.typeIcon} style={{ background: opt.bg, color: opt.color }}>{opt.icon}</div>
            <div className={styles.typeName}>{opt.name}</div>
            <div className={styles.typeDesc}>{opt.desc}</div>
          </div>
        ))}
      </div>
      <div className={styles.btnRow}>
        <button className={styles.btnPrimary} disabled={!canNext()} onClick={() => setStep(1)}>
          Continue &rarr;
        </button>
      </div>
    </div>
  );

  /* ── Step 2: Niches ── */
  const renderNiches = () => (
    <div className={styles.card}>
      {renderCloseButton()}
      <div className={styles.cardTitle}>Your niche</div>
      <div className={styles.cardSub}>Select the areas you work in (pick all that apply)</div>
      <div className={styles.nichePills}>
        {NICHE_OPTIONS.map(n => (
          <button
            key={n}
            className={`${styles.nichePill} ${niches.includes(n) ? styles.active : ""}`}
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
        <button className={styles.addNicheBtn} onClick={addCustomNiche}>Add</button>
      </div>
      <div className={styles.btnRow}>
        <button className={styles.btnSecondary} onClick={() => setStep(0)}>&larr; Back</button>
        <button className={styles.btnPrimary} disabled={!canNext()} onClick={() => setStep(2)}>
          Continue &rarr;
        </button>
      </div>
    </div>
  );

  /* ── Step 3: Sources ── */
  const renderSources = () => (
    <div className={`${styles.card} ${styles.cardWide}`}>
      {renderCloseButton()}
      <div className={styles.cardTitle}>Configure sources</div>
      <div className={styles.cardSub}>Toggle the data sources to monitor</div>
      <div className={styles.sourceList}>
        {SOURCE_OPTIONS.map(src => (
          <div key={src.name} className={styles.sourceRow}>
            <div className={styles.sourceBadge} style={{ background: src.color }}>{src.abbr}</div>
            <span className={styles.sourceName}>{src.name}</span>
            <button
              className={`${styles.toggle} ${enabledSources.has(src.name) ? styles.on : ""}`}
              onClick={() => toggleSource(src.name)}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.sectionDivider} />

      <div className={styles.prefSection}>
        <div className={styles.prefLabel}>Scan frequency</div>
        <div className={styles.freqOptions}>
          {["real-time", "daily", "weekly"].map(f => (
            <button
              key={f}
              className={`${styles.freqOption} ${frequency === f ? styles.active : ""}`}
              onClick={() => setFrequency(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.prefSection}>
        <div className={styles.prefLabel}>Relevance threshold</div>
        <div className={styles.thresholdWrap}>
          <input
            type="range"
            className={styles.thresholdSlider}
            min={50}
            max={95}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
          />
          <span className={styles.thresholdVal}>{threshold}%</span>
        </div>
      </div>

      <div className={styles.btnRow}>
        <button className={styles.btnSecondary} onClick={() => setStep(1)}>&larr; Back</button>
        <button className={styles.btnPrimary} disabled={!canNext()} onClick={() => setStep(3)}>
          Continue &rarr;
        </button>
      </div>
    </div>
  );

  /* ── Step 4: Review ── */
  const selectedType = SIGNAL_TYPE_OPTIONS.find(s => s.id === signalType);
  const renderReview = () => (
    <div className={styles.card}>
      {renderCloseButton()}
      <div className={styles.cardTitle}>Review your signal configuration</div>
      <div className={styles.cardSub}>Confirm everything looks good before we analyze</div>
      <div className={styles.reviewSections}>
        <div className={styles.reviewSection}>
          <div>
            <div className={styles.reviewSectionLabel}>Signal Type</div>
            <div className={styles.reviewSectionValue}>{selectedType?.icon} {selectedType?.name}</div>
          </div>
          <button className={styles.editLink} onClick={() => setStep(0)}>Edit</button>
        </div>
        <div className={styles.reviewSection}>
          <div>
            <div className={styles.reviewSectionLabel}>Niches</div>
            <div className={styles.reviewSectionValue}>{niches.join(", ")}</div>
          </div>
          <button className={styles.editLink} onClick={() => setStep(1)}>Edit</button>
        </div>
        <div className={styles.reviewSection}>
          <div>
            <div className={styles.reviewSectionLabel}>Sources</div>
            <div className={styles.reviewSectionValue}>{enabledSources.size} sources enabled</div>
            <div className={styles.reviewSectionSub}>{Array.from(enabledSources).join(", ")}</div>
          </div>
          <button className={styles.editLink} onClick={() => setStep(2)}>Edit</button>
        </div>
        <div className={styles.reviewSection}>
          <div>
            <div className={styles.reviewSectionLabel}>Preferences</div>
            <div className={styles.reviewSectionValue}>{frequency.charAt(0).toUpperCase() + frequency.slice(1)} scan &middot; {threshold}% threshold</div>
          </div>
          <button className={styles.editLink} onClick={() => setStep(2)}>Edit</button>
        </div>
      </div>
      <div className={styles.btnRow}>
        <button className={styles.btnSecondary} onClick={() => setStep(2)}>&larr; Back</button>
        <button className={styles.btnPrimary} onClick={() => setStep(4)}>
          Analyze &rarr;
        </button>
      </div>
    </div>
  );

  /* ── Step 5: Analyzing ── */
  const renderAnalysis = () => (
    <div className={styles.card}>
      {renderCloseButton()}
      <div className={styles.cardTitle}>Analyzing your market</div>
      <div className={styles.cardSub}>Generating personalized intelligence</div>
      <div className={styles.analysisWrap}>
        {/* Orb */}
        <div className={styles.orbContainer}>
          <div className={styles.orbRipple} />
          <div className={styles.orbRipple} />
          <div className={styles.orbRipple} />
          <div className={`${styles.orbRing} ${styles.orbRing1}`} />
          <div className={`${styles.orbRing} ${styles.orbRing2}`} />
          <div className={styles.orbCenter}>◎</div>
        </div>

        {/* Waveform */}
        <div className={styles.waveform}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={styles.waveBar}
              style={{ animationDelay: `${i * 0.08}s` }}
            />
          ))}
        </div>

        {/* Steps */}
        <div className={styles.analysisSteps}>
          {ANALYSIS_STEPS.map((label, i) => {
            const isComplete = analysisStep > i;
            const isActive = analysisStep === i;
            return (
              <div
                key={label}
                className={`${styles.analysisStep} ${isActive ? styles.active : ""} ${isComplete ? styles.complete : ""}`}
              >
                <div className={`${styles.stepIcon} ${isActive ? styles.active : ""} ${isComplete ? styles.complete : ""}`}>
                  {isComplete ? "\u2713" : isActive ? "\u25CB" : "\u25CB"}
                </div>
                {label}
              </div>
            );
          })}
        </div>

        {analysisError && (
          <>
            <div className={styles.errorMsg}>{analysisError}</div>
            <div className={styles.btnRow} style={{ marginTop: 16 }}>
              <button className={styles.btnSecondary} onClick={() => setStep(3)}>&larr; Back</button>
              <button className={styles.btnPrimary} onClick={() => { setStep(3); setTimeout(() => setStep(4), 50); }}>
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ── Step 6: Results ── */
  const renderResults = () => {
    const liveCount = results.filter(r => r.live).length;
    const clientCount = results.filter(r => r.isClientSignal).length;
    const avgRel = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.relevance, 0) / results.length)
      : 0;

    const config: WireConfig = {
      signalType,
      niches,
      sources: Array.from(enabledSources),
      frequency,
      threshold,
    };

    return (
      <div className={`${styles.card} ${styles.cardWide}`}>
        {renderCloseButton()}
        <div className={styles.cardTitle}>Your intelligence briefing is ready</div>
        <div className={styles.cardSub}>
          {results.length} signals found across {enabledSources.size} sources
        </div>
        <div className={styles.resultsWrap}>
          <div className={styles.resultsSummary}>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatVal}>{results.length}</div>
              <div className={styles.resultsStatLabel}>Signals</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatVal} style={{ color: "#5a9a3c" }}>{liveCount}</div>
              <div className={styles.resultsStatLabel}>Live</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatVal} style={{ color: "#8a7e63" }}>{clientCount}</div>
              <div className={styles.resultsStatLabel}>Client</div>
            </div>
            <div className={styles.resultsStat}>
              <div className={styles.resultsStatVal}>{avgRel}%</div>
              <div className={styles.resultsStatLabel}>Avg relevance</div>
            </div>
          </div>
          <div className={styles.resultCards}>
            {results.slice(0, 6).map((signal, i) => {
              const tc = SIGNAL_TYPES[signal.type] || { icon: "?", color: "var(--ink-400)", bg: "var(--warm-50)" };
              return (
                <div
                  key={signal.id}
                  className={styles.resultCard}
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <div
                    className={styles.resultCardIcon}
                    style={{ background: tc.bg, color: tc.color }}
                  >
                    {tc.icon}
                  </div>
                  <div className={styles.resultCardBody}>
                    <div className={styles.resultCardHeadline}>{signal.headline}</div>
                    <div className={styles.resultCardMeta}>
                      {signal.tags.slice(0, 2).map((t, j) => (
                        <span key={j} className={styles.resultCardTag}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {signal.metric && (
                    <span className={styles.resultCardMetric} style={{ color: tc.color }}>
                      {signal.metric.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles.btnRow}>
            <button className={styles.btnPrimary} onClick={() => onComplete(config, results)}>
              Open in The Wire &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Render ── */
  const stepRenderers = [
    renderSignalType,
    renderNiches,
    renderSources,
    renderReview,
    renderAnalysis,
    renderResults,
  ];

  return (
    <div className={styles.wrap}>
      {renderStepper()}
      {stepRenderers[step]()}
    </div>
  );
}
