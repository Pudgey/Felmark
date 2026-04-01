"use client";

import { BLOCK_DEFS } from "../registry";
import styles from "./Library.module.css";

interface LibraryProps {
  onStartDrag: (type: string) => void;
  onClose: () => void;
}

export default function Library({ onStartDrag, onClose }: LibraryProps) {
  return (
    <div className={styles.library}>
      <div className={styles.libraryHead}>
        <span className={styles.libraryTitle}>Space Blocks</span>
        <button className={styles.libraryClose} onClick={onClose}>
          {"\u2715"}
        </button>
      </div>
      <div className={styles.libraryHint}>
        Drag a block onto the canvas to place it.
      </div>
      <div className={styles.libraryList}>
        {BLOCK_DEFS.map((bt) => (
          <div
            key={bt.type}
            className={styles.libraryItem}
            onMouseDown={(e) => {
              e.preventDefault();
              onStartDrag(bt.type);
            }}
            style={{ cursor: "grab" }}
          >
            <div
              className={styles.libraryItemIcon}
              style={{
                color: bt.color,
                background: bt.color + "06",
                borderColor: bt.color + "12",
              }}
            >
              {bt.icon}
            </div>
            <div>
              <div className={styles.libraryItemName}>{bt.label}</div>
              <div className={styles.libraryItemMeta}>
                {bt.defaultW}&times;{bt.defaultH}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
