"use client";

import styles from "./BlockChrome.module.css";

interface BlockChromeProps {
  blockId: string;
  label: string;
  displayW: number;
  displayH: number;
  onStartMove: (blockId: string, clientX: number, clientY: number) => void;
  onReplace: (blockId: string) => void;
  onRemove: (blockId: string) => void;
  replaceOpen: boolean;
}

export default function BlockChrome({
  blockId, label, displayW, displayH,
  onStartMove, onReplace, onRemove,
}: BlockChromeProps) {
  return (
    <div className={styles.blockChrome}>
      <span
        className={styles.blockHandle}
        onMouseDown={(e) => {
          e.preventDefault();
          onStartMove(blockId, e.clientX, e.clientY);
        }}
      >
        {"\u205E\u205E"}
      </span>
      <span className={styles.blockType}>{label}</span>
      <span className={styles.blockSize}>
        {displayW}&times;{displayH}
      </span>
      <button
        className={styles.blockEditBtn}
        title="Configure"
        onClick={(e) => {
          e.stopPropagation();
          onReplace(blockId);
        }}
      >
        {"\u2699"}
      </button>
      <button
        className={`${styles.blockEditBtn} ${styles.blockEditBtnDanger}`}
        title="Remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(blockId);
        }}
      >
        {"\u2715"}
      </button>
    </div>
  );
}
