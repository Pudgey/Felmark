"use client";

import { useState } from "react";
import type { AnnotationData } from "@/lib/types";
import styles from "./AnnotationBlock.module.css";

export function getDefaultAnnotation(): AnnotationData {
  return { imageUrl: "", pins: [] };
}

export default function AnnotationBlock({ data, onChange }: { data: AnnotationData; onChange: (d: AnnotationData) => void }) {
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [pinComment, setPinComment] = useState("");

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pendingPin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPendingPin({ x, y });
    setPinComment("");
  };

  const confirmPin = () => {
    if (!pendingPin || !pinComment.trim()) return;
    onChange({
      ...data,
      pins: [...data.pins, { id: `pin${Date.now()}`, x: pendingPin.x, y: pendingPin.y, comment: pinComment.trim(), author: "You", resolved: false }],
    });
    setPendingPin(null);
    setPinComment("");
  };

  const cancelPin = () => {
    setPendingPin(null);
    setPinComment("");
  };

  const resolvePin = (id: string) => {
    onChange({ ...data, pins: data.pins.map(p => p.id === id ? { ...p, resolved: !p.resolved } : p) });
  };

  return (
    <div className={styles.annotation}>
      <div className={styles.annotationHeader}>
        <div className={styles.annotationIcon}>{"\uD83D\uDCCC"}</div>
        <span className={styles.annotationLabel}>Annotation</span>
        <span className={styles.blockMeta}>{data.pins.length} pin{data.pins.length !== 1 ? "s" : ""}</span>
      </div>
      <div className={styles.annotationCanvas} onClick={handleCanvasClick}>
        {data.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-provided dynamic URL
          <img className={styles.annotationImg} src={data.imageUrl} alt="Annotated" />
        ) : (
          <div className={styles.annotationPlaceholder}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="3" y="3" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" /><circle cx="11" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" /><path d="M3 22l7-7 5 5 4-3 10 8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            <span>Click to add pins &mdash; paste an image URL below</span>
          </div>
        )}
        {data.pins.map((pin, i) => (
          <div
            key={pin.id}
            className={`${styles.annotationPin} ${pin.resolved ? styles.annotationPinResolved : ""}`}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            onClick={e => e.stopPropagation()}
            title={pin.comment}
          >
            {i + 1}
          </div>
        ))}
        {pendingPin && (
          <div className={styles.annotationPin} style={{ left: `${pendingPin.x}%`, top: `${pendingPin.y}%`, opacity: 0.6 }} onClick={e => e.stopPropagation()}>
            ?
          </div>
        )}
      </div>
      {pendingPin && (
        <div className={styles.annotationCompose}>
          <input className={styles.blockInput} placeholder="Add a comment for this pin..." value={pinComment} onChange={e => setPinComment(e.target.value)} onKeyDown={e => { if (e.key === "Enter") confirmPin(); if (e.key === "Escape") cancelPin(); }} autoFocus />
          <button className={`${styles.blockBtn} ${styles.blockBtnPrimary} ${styles.blockBtnSmall}`} onClick={confirmPin}>Add</button>
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={cancelPin}>Cancel</button>
        </div>
      )}
      <div style={{ padding: "8px 16px" }}>
        <input className={styles.blockInput} placeholder="Image URL..." value={data.imageUrl} onChange={e => onChange({ ...data, imageUrl: e.target.value })} style={{ fontSize: 12 }} />
      </div>
      {data.pins.length > 0 && (
        <div className={styles.annotationPinList}>
          {data.pins.map((pin, i) => (
            <div key={pin.id} className={styles.annotationPinItem}>
              <div className={`${styles.annotationPinNum} ${pin.resolved ? styles.annotationPinNumResolved : ""}`}>{i + 1}</div>
              <div className={styles.annotationPinBody}>
                <div className={styles.annotationPinAuthor}>{pin.author}</div>
                <div className={styles.annotationPinComment}>{pin.comment}</div>
                <button className={styles.annotationPinResolve} onClick={() => resolvePin(pin.id)}>
                  {pin.resolved ? "Unresolve" : "Resolve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { AnnotationBlock };
