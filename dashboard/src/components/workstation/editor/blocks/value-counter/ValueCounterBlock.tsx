"use client";

import { useState, useEffect, useRef } from "react";
import type { ValueCounterData } from "@/lib/types";
import { useInView } from "../shared/useInView";
import styles from "./ValueCounterBlock.module.css";

export function getDefaultValueCounter(): ValueCounterData {
  return {
    topLabel: "Estimated brand value over 3 years",
    targetValue: 147200,
    rows: [
      { label: "Initial investment", amount: "-$4,800", positive: false },
      { label: "Revenue from new clients", amount: "+$82,000", positive: true },
      { label: "Client retention value", amount: "+$46,000", positive: true },
      { label: "Premium pricing uplift", amount: "+$24,000", positive: true },
    ],
    bottomLine: "That\u2019s a 30\u00d7 return on your brand investment.",
  };
}

interface ValueCounterProps {
  data: ValueCounterData;
  onChange: (d: ValueCounterData) => void;
}

export default function ValueCounterBlock({ data, onChange }: ValueCounterProps) {
  const { ref, visible } = useInView(0.3);
  const [phase, setPhase] = useState(0);
  const [displayVal, setDisplayVal] = useState(0);
  const [editField, setEditField] = useState<"topLabel" | "bottomLine" | { idx: number; field: "label" | "amount" } | null>(null);
  const [draft, setDraft] = useState("");
  const rafRef = useRef<number>(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!visible) return;
    // Phase 1: top label (immediate)
    setPhase(1);
    // Phase 2: amount area prepares
    const t2 = setTimeout(() => setPhase(2), 800);
    // Phase 3: counter starts + rows
    const t3 = setTimeout(() => {
      setPhase(3);
      const duration = 2400;
      let start: number | null = null;
      let running = true;
      const step = (ts: number) => {
        if (!running) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // quintic ease-out: 1 - (1-t)^5
        const eased = 1 - Math.pow(1 - t, 5);
        setDisplayVal(Math.round(eased * data.targetValue));
        if (t < 1) { rafRef.current = requestAnimationFrame(step); }
      };
      rafRef.current = requestAnimationFrame(step);
      timerRefs.current.push(t3);
      // Cleanup RAF on unmount handled below
      return () => { running = false; };
    }, 1600);
    timerRefs.current = [t2, t3];

    return () => {
      timerRefs.current.forEach(t => clearTimeout(t));
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, data.targetValue]);

  const startEditSimple = (field: "topLabel" | "bottomLine") => {
    setEditField(field);
    setDraft(data[field]);
  };

  const startEditRow = (idx: number, field: "label" | "amount") => {
    setEditField({ idx, field });
    setDraft(data.rows[idx][field]);
  };

  const commitEdit = () => {
    if (!editField) return;
    if (editField === "topLabel" || editField === "bottomLine") {
      onChange({ ...data, [editField]: draft });
    } else {
      const rows = [...data.rows];
      rows[editField.idx] = { ...rows[editField.idx], [editField.field]: draft };
      onChange({ ...data, rows });
    }
    setEditField(null);
  };

  const formatted = displayVal.toLocaleString("en-US");

  return (
    <div className={styles.valueCounter} ref={ref}>
      {/* Top label */}
      <div className={phase >= 1 ? styles.vcTopLabelVisible : styles.vcTopLabel}>
        {editField === "topLabel" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEditSimple("topLabel")}>{data.topLabel}</span>
        )}
      </div>

      {/* Big number */}
      <div className={phase >= 2 ? styles.vcAmountVisible : styles.vcAmount}>
        ${formatted}
      </div>

      {/* Breakdown rows */}
      <div className={styles.vcRows}>
        {data.rows.map((row, i) => (
          <div key={i} className={phase >= 3 ? styles.vcRowVisible : styles.vcRow} style={{ transitionDelay: `${i * 150}ms` }}>
            <span className={styles.vcRowLabel}>
              {typeof editField === "object" && editField?.idx === i && editField.field === "label" ? (
                <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
              ) : (
                <span onDoubleClick={() => startEditRow(i, "label")}>{row.label}</span>
              )}
            </span>
            <span className={row.positive ? styles.vcRowAmountPos : styles.vcRowAmountNeg}>
              {typeof editField === "object" && editField?.idx === i && editField.field === "amount" ? (
                <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
              ) : (
                <span onDoubleClick={() => startEditRow(i, "amount")}>{row.amount}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div className={phase >= 3 ? styles.vcBottomVisible : styles.vcBottom}>
        {editField === "bottomLine" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEditSimple("bottomLine")}>{data.bottomLine}</span>
        )}
      </div>
    </div>
  );
}

export { ValueCounterBlock };
