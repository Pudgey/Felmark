"use client";

import { useState, useEffect, useRef } from "react";
import type { StatRevealData } from "@/lib/types";
import { useInView } from "../shared/useInView";
import styles from "./StatRevealBlock.module.css";

export function getDefaultStatReveal(): StatRevealData {
  return {
    stats: [
      { value: 340, prefix: "", suffix: "%", label: "ROI", sub: "Return on brand investment", color: "#5a9a3c" },
      { value: 23, prefix: "", suffix: "\u00d7", label: "Revenue", sub: "Multiplier from identity work", color: "var(--ember)" },
      { value: 71, prefix: "", suffix: "%", label: "Recognition", sub: "Brand recall improvement", color: "#5b7fa4" },
    ],
    footer: "Why brand identity is a revenue investment, not a cost.",
  };
}

interface StatRevealProps {
  data: StatRevealData;
  onChange: (d: StatRevealData) => void;
}

export default function StatRevealBlock({ data, onChange }: StatRevealProps) {
  const { ref, visible } = useInView(0.3);
  const [editField, setEditField] = useState<{ idx: number; field: "label" | "sub" | "footer" } | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (idx: number, field: "label" | "sub") => {
    setEditField({ idx, field });
    setDraft(data.stats[idx][field]);
  };

  const startEditFooter = () => {
    setEditField({ idx: -1, field: "footer" });
    setDraft(data.footer);
  };

  const commitEdit = () => {
    if (!editField) return;
    if (editField.field === "footer") {
      onChange({ ...data, footer: draft });
    } else {
      const stats = [...data.stats];
      stats[editField.idx] = { ...stats[editField.idx], [editField.field]: draft };
      onChange({ ...data, stats });
    }
    setEditField(null);
  };

  return (
    <div className={styles.statReveal} ref={ref}>
      <div className={styles.statRevealGrid}>
        {data.stats.map((stat, i) => (
          <StatRevealCard key={i} stat={stat} index={i} visible={visible} editField={editField} draft={draft} setDraft={setDraft} startEdit={startEdit} commitEdit={commitEdit} />
        ))}
      </div>
      <div className={visible ? styles.statRevealFooterVisible : styles.statRevealFooter}>
        {editField?.field === "footer" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={startEditFooter}>{data.footer}</span>
        )}
      </div>
    </div>
  );
}

interface StatRevealCardProps {
  stat: StatRevealData["stats"][number];
  index: number;
  visible: boolean;
  editField: { idx: number; field: string } | null;
  draft: string;
  setDraft: (v: string) => void;
  startEdit: (idx: number, field: "label" | "sub") => void;
  commitEdit: () => void;
}

function StatRevealCard({ stat, index, visible, editField, draft, setDraft, startEdit, commitEdit }: StatRevealCardProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    const delay = index * 200;
    const duration = 1800;
    let start: number | null = null;
    let running = true;

    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!running) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // quartic ease-out: 1 - (1-t)^4
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplayVal(Math.round(eased * stat.value));
        if (t < 1) { rafRef.current = requestAnimationFrame(step); }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      running = false;
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, stat.value, index]);

  const circumference = 2 * Math.PI * 20;
  const progress = visible ? displayVal / stat.value : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={visible ? styles.statCardVisible : styles.statCard} style={{ transitionDelay: `${index * 200}ms` }}>
      <svg width="48" height="48" viewBox="0 0 48 48" className={styles.statRing}>
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--warm-200)" strokeWidth="3" />
        <circle cx="24" cy="24" r="20" fill="none" stroke={stat.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.1s linear" }} />
      </svg>
      <div className={styles.statValue} style={{ color: stat.color }}>
        {stat.prefix}{displayVal}{stat.suffix}
      </div>
      <div className={styles.statLabel}>
        {editField?.idx === index && editField.field === "label" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEdit(index, "label")}>{stat.label}</span>
        )}
      </div>
      <div className={styles.statSub}>
        {editField?.idx === index && editField.field === "sub" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEdit(index, "sub")}>{stat.sub}</span>
        )}
      </div>
    </div>
  );
}

export { StatRevealBlock };
