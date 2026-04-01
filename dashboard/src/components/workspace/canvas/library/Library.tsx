"use client";

import { useEffect } from "react";
import { BLOCK_DEFS } from "../registry";
import styles from "./Library.module.css";

interface LibraryProps {
  onStartDrag: (type: string) => void;
  onSelect: (type: string) => void;
  selectionMode: boolean;
  onClose: () => void;
}

export default function Library({ onStartDrag, onSelect, selectionMode, onClose }: LibraryProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.library} onClick={(e) => e.stopPropagation()}>
        <div className={styles.libraryHead}>
          <div>
            <span className={styles.libraryTitle}>
              {selectionMode ? "Choose a block" : "Add a block"}
            </span>
            <div className={styles.libraryHint}>
              {selectionMode
                ? "Pick a block to insert into the canvas."
                : "Drag a block onto the canvas to place it."}
            </div>
          </div>
          <button className={styles.libraryClose} onClick={onClose}>
            {"\u2715"}
          </button>
        </div>
        <div className={styles.libraryList}>
          {BLOCK_DEFS.map((bt) => (
            <button
              key={bt.type}
              type="button"
              className={styles.libraryItem}
              onClick={() => {
                if (selectionMode) onSelect(bt.type);
              }}
              onMouseDown={(e) => {
                if (selectionMode) return;
                e.preventDefault();
                onStartDrag(bt.type);
              }}
              style={{ cursor: selectionMode ? "pointer" : "grab" }}
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
              <div className={styles.libraryItemInfo}>
                <div className={styles.libraryItemName}>{bt.label}</div>
                <div className={styles.libraryItemMeta}>
                  {selectionMode ? "Click to insert" : "Drag to place"}
                </div>
              </div>
              <div className={styles.libraryItemSize}>
                {bt.defaultW}&times;{bt.defaultH}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
