"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./AIThink.module.css";

/* ═══════════════════════════════════════
   AI Think Animations
   Reusable loading sequence components
   for terminal intelligence UI
   ═══════════════════════════════════════ */

// ── ThinkingDots ──
// Three bouncing dots with optional label

interface ThinkingDotsProps {
  label?: string;
  color?: string;
}

export function ThinkingDots({ label = "Thinking", color }: ThinkingDotsProps) {
  return (
    <div className={styles.dotsRow}>
      <span className={styles.dotsLabel}>{label}</span>
      <span className={styles.dots}>
        {[0, 1, 2].map(i => (
          <span key={i} className={styles.dot} style={color ? { background: color } : undefined} />
        ))}
      </span>
    </div>
  );
}

// ── ScanLine ──
// Gradient sweep line

interface ScanLineProps {
  duration?: number;
}

export function ScanLine({ duration = 1.6 }: ScanLineProps) {
  return (
    <div
      className={styles.scanLine}
      style={{ "--scan-duration": `${duration}s` } as React.CSSProperties}
    />
  );
}

// ── StreamText ──
// Character-by-character text reveal

interface StreamTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onDone?: () => void;
}

export function StreamText({ text, speed = 18, delay = 0, onDone }: StreamTextProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(delay === 0);
  const done = charIndex >= text.length;

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setCharIndex(prev => prev + 1), speed);
    return () => clearTimeout(t);
  }, [started, charIndex, speed, done]);

  useEffect(() => {
    if (done && onDone) onDone();
  }, [done, onDone]);

  if (!started) return null;

  return (
    <span className={styles.stream}>
      {text.slice(0, charIndex)}
      {!done && <span className={styles.streamCursor} />}
    </span>
  );
}

// ── SkeletonBlock ──
// Pulsing placeholder lines

interface SkeletonBlockProps {
  lines?: number;
}

export function SkeletonBlock({ lines = 4 }: SkeletonBlockProps) {
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={styles.skeletonLine} />
      ))}
    </div>
  );
}

// ── ThinkPhases ──
// Staged step-by-step progress

interface ThinkPhasesProps {
  phases: { label: string; ms: number }[];
  onComplete?: () => void;
}

export function ThinkPhases({ phases, onComplete }: ThinkPhasesProps) {
  const [current, setCurrent] = useState(0);
  const completed = useRef(false);

  useEffect(() => {
    if (current >= phases.length) {
      if (!completed.current) {
        completed.current = true;
        onComplete?.();
      }
      return;
    }
    const t = setTimeout(() => setCurrent(prev => prev + 1), phases[current].ms);
    return () => clearTimeout(t);
  }, [current, phases, onComplete]);

  return (
    <div className={styles.phases}>
      {phases.map((p, i) => {
        const status = i < current ? "done" : i === current ? "active" : "pending";
        return (
          <div key={i} className={styles.phase} data-status={status}>
            <span className={styles.phaseIndicator}>
              {status === "done" ? "✓" : status === "active" ? (
                <span className={styles.phaseSpinner} />
              ) : "·"}
            </span>
            <span>{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── WaveformPulse ──
// Audio-style animated bars

interface WaveformPulseProps {
  bars?: number;
  color?: string;
  active?: boolean;
}

export function WaveformPulse({ bars = 6, color, active = true }: WaveformPulseProps) {
  return (
    <div className={styles.waveform}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={active ? styles.waveBar : styles.waveBarInactive}
          style={color ? { background: color } : undefined}
        />
      ))}
    </div>
  );
}

// ── AIResponseBlock ──
// Full phased animation sequence:
//   Phase 1 (800ms): ThinkingDots — "Analyzing your data"
//   Phase 2: ThinkPhases (3 steps) + WaveformPulse
//   Phase 3: StreamText with blinking cursor + ScanLine
//   Phase 4: Final text + data card + action buttons

interface AIResponseBlockProps {
  text: string;
  dataCard?: { rows: { label: string; value: string; color?: string }[] };
  actions?: { label: string; primary?: boolean; onClick?: () => void }[];
  onPhaseChange?: (phase: string) => void;
}

export function AIResponseBlock({ text, dataCard, actions, onPhaseChange }: AIResponseBlockProps) {
  const [phase, setPhase] = useState<"dots" | "phases" | "stream" | "done">("dots");
  const notified = useRef<string>("");

  // Notify on phase change
  useEffect(() => {
    if (notified.current !== phase) {
      notified.current = phase;
      onPhaseChange?.(phase);
    }
  }, [phase, onPhaseChange]);

  // Phase 1 -> Phase 2 after 800ms
  useEffect(() => {
    if (phase !== "dots") return;
    const t = setTimeout(() => setPhase("phases"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  const handlePhasesComplete = useCallback(() => {
    setPhase("stream");
  }, []);

  const handleStreamDone = useCallback(() => {
    setPhase("done");
  }, []);

  return (
    <div className={styles.response}>
      {/* Phase 1: Thinking dots */}
      {phase === "dots" && (
        <>
          <ThinkingDots label="Analyzing your data" />
          <SkeletonBlock lines={3} />
        </>
      )}

      {/* Phase 2: Step progress + waveform */}
      {phase === "phases" && (
        <>
          <ThinkPhases
            phases={[
              { label: "parsing context", ms: 500 },
              { label: "generating response", ms: 700 },
              { label: "structuring output", ms: 400 },
            ]}
            onComplete={handlePhasesComplete}
          />
          <WaveformPulse bars={8} />
        </>
      )}

      {/* Phase 3: Streaming text */}
      {phase === "stream" && (
        <>
          <ScanLine duration={1.2} />
          <StreamText text={text} speed={16} onDone={handleStreamDone} />
        </>
      )}

      {/* Phase 4: Final result */}
      {phase === "done" && (
        <>
          <div className={styles.responseBadge}>
            <span>◈</span>
            <span>AI response</span>
          </div>
          <div className={styles.responseText}>{text}</div>

          {dataCard && (
            <div className={styles.dataCard}>
              {dataCard.rows.map((row, i) => (
                <div key={i} className={styles.dataRow}>
                  <span className={styles.dataRowLabel}>{row.label}</span>
                  <span className={styles.dataRowValue} style={row.color ? { color: row.color } : undefined}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {actions && actions.length > 0 && (
            <div className={styles.actions}>
              {actions.map((a, i) => (
                <button
                  key={i}
                  className={a.primary ? styles.actionBtnPrimary : styles.actionBtn}
                  onClick={a.onClick}
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
