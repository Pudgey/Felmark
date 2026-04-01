"use client";

import AnimatedNumber from "./AnimatedNumber";
import styles from "./GraphBlock.module.css";

export interface MetricData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  change?: number;
  sub?: string;
  sparkline?: number[];
}

export default function MetricCards({ metrics }: { metrics: MetricData[] }) {
  return (
    <div className={styles.gb}>
      <div className={styles.metrics}>
        {metrics.map((m, i) => (
          <div key={i} className={styles.metric}>
            <div className={styles.metricTop}>
              <span className={styles.metricLabel}>{m.label}</span>
              {m.change !== undefined && (
                <span className={`${styles.metricChange} ${m.change >= 0 ? styles.sparkUp : styles.sparkDown}`}>
                  {m.change >= 0 ? "\u2191" : "\u2193"} {Math.abs(m.change)}%
                </span>
              )}
            </div>
            <div className={styles.metricVal} style={{ color: m.color || "var(--ink-900)" }}>
              {m.prefix || ""}<AnimatedNumber value={m.value} />{m.suffix || ""}
            </div>
            {m.sub && <div className={styles.metricSub}>{m.sub}</div>}
            {m.sparkline && (
              <svg className={styles.metricSpark} viewBox="0 0 60 20" preserveAspectRatio="none">
                <polyline points={m.sparkline.map((v, vi) => {
                  const max = Math.max(...m.sparkline!);
                  return `${(vi / (m.sparkline!.length - 1)) * 60},${20 - (v / max) * 16 - 2}`;
                }).join(" ")} fill="none" stroke={m.color || "var(--ember)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
