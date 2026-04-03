"use client";

import styles from "./BlockChrome.module.css";

interface BlockChromeProps {
  blockId: string;
  label: string;
  displayW: number;
  displayH: number;
  visible: boolean;
  onAdd: (blockId: string) => void;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onMoveLeft: (blockId: string) => void;
  onMoveRight: (blockId: string) => void;
  onStartMove: (blockId: string, clientX: number, clientY: number) => void;
  onReplace: (blockId: string) => void;
  onRemove: (blockId: string) => void;
  replaceOpen: boolean;
}

export default function BlockChrome({
  blockId, label, displayW, displayH,
  visible,
  onAdd,
  canMoveLeft, canMoveRight,
  onMoveLeft, onMoveRight,
  onStartMove, onReplace, onRemove,
}: BlockChromeProps) {
  const compact = displayW <= 1;

  return (
    <div className={`${styles.blockChrome} ${visible ? styles.blockChromeVisible : ""} ${compact ? styles.blockChromeCompact : ""}`}>
      <span
        className={styles.blockHandle}
        onMouseDown={(e) => {
          e.preventDefault();
          onStartMove(blockId, e.clientX, e.clientY);
        }}
      >
        {"\u205E\u205E"}
      </span>
      {!compact && <span className={styles.blockType}>{label}</span>}
      {!compact && (
        <span className={styles.blockSize}>
          {displayW}&times;{displayH}
        </span>
      )}
      <button
        className={styles.blockEditBtn}
        title="Move left"
        disabled={!canMoveLeft}
        onClick={(e) => {
          e.stopPropagation();
          onMoveLeft(blockId);
        }}
      >
        {"\u2190"}
      </button>
      <button
        className={styles.blockEditBtn}
        title="Move right"
        disabled={!canMoveRight}
        onClick={(e) => {
          e.stopPropagation();
          onMoveRight(blockId);
        }}
      >
        {"\u2192"}
      </button>
      <button
        className={`${styles.blockEditBtn} ${styles.blockAddBtn}`}
        title="Add block"
        onClick={(e) => {
          e.stopPropagation();
          onAdd(blockId);
        }}
      >
        {"+"}
      </button>
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
