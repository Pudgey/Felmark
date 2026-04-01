"use client";

import styles from "./Insertions.module.css";

interface RowInsertionBarProps {
  y: number;
  width: number;
  onInsert: () => void;
}

export default function RowInsertionBar({ y, width, onInsert }: RowInsertionBarProps) {
  return (
    <div
      className={styles.insertionZone}
      style={{ top: y - 12, width }}
    >
      <div className={styles.insertionLine} />
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
