"use client";

import styles from "./ZenHint.module.css";

interface ZenHintProps {
  onToggleZen?: () => void;
}

export default function ZenHint({ onToggleZen }: ZenHintProps) {
  return (
    <div className={styles.zenHint}>
      <span>Zen Mode</span>
      <button className={styles.zenExit} onClick={onToggleZen}>Exit</button>
      <span className={styles.zenKey}>Esc</span>
    </div>
  );
}
