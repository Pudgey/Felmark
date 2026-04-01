"use client";

import { useState } from "react";
import type { NumberCascadeData } from "@/lib/types";
import { useInView } from "../shared/useInView";
import styles from "./NumberCascadeBlock.module.css";

export function getDefaultNumberCascade(): NumberCascadeData {
  return {
    stats: [
      { num: "8+", label: "years of brand design experience" },
      { num: "47", label: "brand identity projects delivered" },
      { num: "100%", label: "client satisfaction rate" },
      { num: "$2.4M", label: "revenue generated for clients" },
      { num: "12", label: "industry awards for brand work" },
      { num: "4.9", label: "average client rating (out of 5)" },
    ],
  };
}

interface NumberCascadeProps {
  data: NumberCascadeData;
  onChange: (d: NumberCascadeData) => void;
}

export default function NumberCascadeBlock({ data, onChange }: NumberCascadeProps) {
  const { ref, visible } = useInView(0.3);
  const [editField, setEditField] = useState<{ idx: number; field: "num" | "label" } | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (idx: number, field: "num" | "label") => {
    setEditField({ idx, field });
    setDraft(data.stats[idx][field]);
  };

  const commitEdit = () => {
    if (editField) {
      const stats = [...data.stats];
      stats[editField.idx] = { ...stats[editField.idx], [editField.field]: draft };
      onChange({ stats });
      setEditField(null);
    }
  };

  const addStat = () => {
    if (data.stats.length < 9) {
      onChange({ stats: [...data.stats, { num: "0", label: "New stat" }] });
    }
  };

  return (
    <div className={styles.cascade} ref={ref}>
      <div className={styles.cascadeGrid}>
        {data.stats.map((stat, i) => (
          <div
            key={i}
            className={visible ? styles.cascadeItemVisible : styles.cascadeItem}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className={styles.cascadeNum}>
              {editField?.idx === i && editField.field === "num" ? (
                <input
                  className={styles.inlineInputNum}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => startEdit(i, "num")}>{stat.num}</span>
              )}
            </div>
            <div className={styles.cascadeLabel}>
              {editField?.idx === i && editField.field === "label" ? (
                <input
                  className={styles.inlineInputLabel}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => startEdit(i, "label")}>{stat.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {data.stats.length < 9 && (
        <button className={styles.cascadeAdd} onClick={addStat}>+ Add stat</button>
      )}
    </div>
  );
}

export { NumberCascadeBlock };
