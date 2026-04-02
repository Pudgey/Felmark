"use client";

import styles from "./Insertions.module.css";

interface ColInsertionBarProps {
  left: number;
  top: number;
  height: number;
  onInsert: () => void;
}

export default function ColInsertionBar({ left, top, height, onInsert }: ColInsertionBarProps) {
  const handleInsert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInsert();
  };

  return (
    <div
      className={styles.colInsertionZone}
      style={{ left, top, height }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={handleInsert}
    >
      <div className={styles.colInsertionLine} />
      <button
        type="button"
        className={`${styles.insertionBtn} ${styles.colInsertionBtn}`}
        aria-label="Insert block"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleInsert}
      >
        <span className={styles.insertionPlus} aria-hidden="true">+</span>
      </button>
    </div>
  );
}
