"use client";

import styles from "./Insertions.module.css";

interface ColInsertionBarProps {
  left: number;
  top: number;
  height: number;
  onInsert: () => void;
}

export default function ColInsertionBar({ left, top, height, onInsert }: ColInsertionBarProps) {
  return (
    <div
      className={styles.colInsertionZone}
      style={{ left, top, height }}
    >
      <div className={styles.colInsertionLine} />
      <button
        className={styles.insertionBtn}
        onClick={(e) => {
          e.stopPropagation();
          onInsert();
        }}
      >
        +
      </button>
    </div>
  );
}
