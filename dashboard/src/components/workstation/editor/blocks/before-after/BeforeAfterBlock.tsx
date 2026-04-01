"use client";

import { useState, useRef } from "react";
import type { BeforeAfterBlockData } from "@/lib/types";
import styles from "./BeforeAfterBlock.module.css";

export default function BeforeAfterBlock({ data }: { data: BeforeAfterBlockData }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const handleMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div className={styles.ba} ref={ref}
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}>
      <div className={styles.baBefore}><span className={styles.baPlaceholder}>Before</span></div>
      <div className={styles.baAfter} style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><span className={styles.baPlaceholder}>After</span></div>
      <div className={styles.baSlider} style={{ left: `${pos}%` }}><div className={styles.baHandle}><span>&lsaquo;&rsaquo;</span></div></div>
      <span className={`${styles.baLabel} ${styles.baLabelLeft}`}>{data.beforeLabel}</span>
      <span className={`${styles.baLabel} ${styles.baLabelRight}`}>{data.afterLabel}</span>
    </div>
  );
}

export { BeforeAfterBlock };
