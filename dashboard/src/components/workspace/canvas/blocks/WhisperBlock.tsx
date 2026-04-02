"use client";

import type { RenderBlock } from "../types";
import styles from "./BlockContent.module.css";

export default function WhisperBlock({ block: _block }: { block: RenderBlock }) {
  return (
    <div className={styles.whisperContent}>
      <span className={styles.whisperBadge}>{"\u2726"} AI</span>
      <span className={styles.whisperDot} />
      <span className={styles.whisperText}>
        Sarah hasn&apos;t responded to color palette in 2 days
      </span>
      <button className={styles.whisperAction}>Send Nudge</button>
    </div>
  );
}
