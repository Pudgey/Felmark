"use client";

import styles from "./Insertions.module.css";

interface RowInsertionBarProps {
  y: number;
  width: number;
  onInsert: () => void;
}

export default function RowInsertionBar({ y, width, onInsert }: RowInsertionBarProps) {
  const handleInsert = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onInsert();
  };

  return (
    <div
      className={styles.insertionZone}
      style={{ top: y - 12, width }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={handleInsert}
    >
      <div className={styles.insertionLine} />
      <button
        type="button"
        className={styles.insertionBtn}
        aria-label="Insert row"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleInsert}
      >
        +
      </button>
    </div>
  );
}
