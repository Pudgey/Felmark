"use client";

import type { RenderBlock } from "../types";
import styles from "./BlockContent.module.css";

const PLACEHOLDER_TIMES = ["2m", "3h", "1d", "2d", "5d", "1w"];

export default function PlaceholderBlock({ block }: { block: RenderBlock }) {
  const lines =
    block.type === "tasks"
      ? 5
      : block.type === "activity"
        ? 6
        : block.type === "health"
          ? 4
          : 3;

  return (
    <div className={styles.placeholderContent}>
      <div className={styles.placeholderLabel}>{block.label}</div>
      <div className={styles.placeholderRows}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={styles.placeholderRow}>
            <div
              className={styles.placeholderDot}
              style={{
                background: block.color,
                opacity: 0.25 + (i < 2 ? 0.2 : 0),
              }}
            />
            <div className={styles.placeholderBar}>
              <div
                className={styles.placeholderBarFill}
                style={{
                  background: block.color,
                  width: `${65 + Math.sin(i * 1.8) * 25}%`,
                }}
              />
            </div>
            <div className={styles.placeholderTime}>
              {PLACEHOLDER_TIMES[i % PLACEHOLDER_TIMES.length]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
