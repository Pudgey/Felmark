"use client";

import type { RenderBlock } from "../types";
import styles from "./BlockContent.module.css";

export default function MetricBlock({ block }: { block: RenderBlock }) {
  const pct =
    block.type === "goal"
      ? parseInt(block.value!)
      : block.type === "rate"
        ? 72
        : null;

  return (
    <div className={styles.metricContent}>
      <div className={styles.metricLabel}>{block.label}</div>
      <div
        className={`${styles.metricValue} ${block.w >= 2 ? styles.metricValueLarge : styles.metricValueSmall}`}
        style={{ color: block.color }}
      >
        {block.value}
      </div>
      <div className={styles.metricSub}>{block.sub}</div>
      {pct != null && (
        <div className={styles.metricProgress}>
          <div
            className={styles.metricProgressFill}
            style={{ width: `${pct}%`, background: block.color }}
          />
        </div>
      )}
    </div>
  );
}
