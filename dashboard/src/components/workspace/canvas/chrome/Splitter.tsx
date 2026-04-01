"use client";

import styles from "./Splitter.module.css";

interface SplitterProps {
  position: "left" | "right";
  onStartResize: (e: React.MouseEvent) => void;
}

export default function Splitter({ position, onStartResize }: SplitterProps) {
  return (
    <div
      className={`${styles.splitter} ${position === "right" ? styles.splitterRight : styles.splitterLeft}`}
      onMouseDown={onStartResize}
    >
      <div className={styles.splitterLine} />
    </div>
  );
}
