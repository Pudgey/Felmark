"use client";

import styles from "./debrief.module.css";

interface DebriefPulseProps {
  onRunCommand: (cmd: string) => void;
}

const DEMO_STATS = [
  { label: "Earned", value: "$14.8k", delta: "\u2191 40%", tone: "success" as const },
  { label: "Owed", value: "$9.6k", delta: "3 open", tone: "muted" as const },
  { label: "Rate", value: "$118", delta: "\u2193 $2/hr", tone: "error" as const },
  { label: "Tasks", value: "7", delta: "1 overdue", tone: "warning" as const },
];

const ALERT_TEXT = "Client review & revisions is overdue (Meridian \u00b7 Apr 1)";

const AI_INSIGHT =
  "Nudge Sarah on Invoice #044. Start with the Meridian review \u2014 it\u2019s blocking everything downstream.";

function formatTimeHeader(): string {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const month = now.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const date = now.getDate();
  return `${time} \u00b7 ${month} ${date}`;
}

function deltaClass(tone: string): string {
  switch (tone) {
    case "success":
      return styles.pulseStatDeltaSuccess;
    case "error":
      return styles.pulseStatDeltaError;
    case "warning":
      return styles.pulseStatDeltaWarning;
    default:
      return styles.pulseStatDeltaMuted;
  }
}

export default function DebriefPulse({ onRunCommand }: DebriefPulseProps) {
  return (
    <div className={styles.debrief}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className={styles.mark} style={{ fontSize: 16 }}>
          &#9670;
        </span>
        <span className={styles.dateHeader}>{formatTimeHeader()}</span>
      </div>

      <div className={styles.pulseGrid}>
        {DEMO_STATS.map((stat) => (
          <div key={stat.label} className={styles.pulseStat}>
            <span className={styles.pulseStatLabel}>{stat.label}</span>
            <span className={styles.pulseStatValue}>{stat.value}</span>
            <span className={`${styles.pulseStatDelta} ${deltaClass(stat.tone)}`}>{stat.delta}</span>
          </div>
        ))}
      </div>

      <div className={styles.pulseAlert}>
        <span className={styles.pulseAlertDot} />
        <span className={styles.pulseAlertText}>{ALERT_TEXT}</span>
      </div>

      <div className={styles.aiInsight}>
        <span className={styles.aiLabel}>&#10022; forge</span>
        {AI_INSIGHT}
      </div>

      <div className={styles.pulseHint}>
        <button className={styles.agendaCmd} onClick={() => onRunCommand("/status")} style={{ fontSize: 9 }}>
          type /status for full report
        </button>
      </div>
    </div>
  );
}
