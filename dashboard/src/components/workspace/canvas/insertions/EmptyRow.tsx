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
      <span className={styles.emptyRowText}>Drag a block here or click + to choose</span>
    </div>
  );
}
