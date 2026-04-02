"use client";

import styles from "./Insertions.module.css";

interface EmptyRowProps {
  top: number;
  width: number;
  height: number;
}

export default function EmptyRow({ top, width, height }: EmptyRowProps) {
  return (
    <div
      className={styles.emptyRow}
      style={{ left: 0, top, width, height }}
    >
      <span className={styles.emptyRowBadge}>+</span>
      <span className={styles.emptyRowText}>Drop a block here to start a new row</span>
    </div>
  );
}
