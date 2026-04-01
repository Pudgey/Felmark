"use client";

import type { DecisionData } from "@/lib/types";
import styles from "./DecisionBlock.module.css";

export function getDefaultDecision(): DecisionData {
  return { title: "", decision: "", alternatives: [], context: "", decidedBy: "", decidedAt: null };
}

export default function DecisionBlock({ data, onChange }: { data: DecisionData; onChange: (d: DecisionData) => void }) {
  const addAlt = () => onChange({ ...data, alternatives: [...data.alternatives, { label: "", reason: "" }] });
  const updateAlt = (i: number, field: "label" | "reason", val: string) => {
    const alts = [...data.alternatives];
    alts[i] = { ...alts[i], [field]: val };
    onChange({ ...data, alternatives: alts });
  };
  const removeAlt = (i: number) => onChange({ ...data, alternatives: data.alternatives.filter((_, idx) => idx !== i) });

  return (
    <div className={styles.decision}>
      <div className={styles.decisionHeader}>
        <div className={styles.decisionIcon}>{"\u2696"}</div>
        <span className={styles.decisionLabel}>Decision</span>
        {data.decidedBy && <span className={styles.blockMeta}>by {data.decidedBy}</span>}
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="Decision title" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }} />
        <div className={styles.decisionResult}>
          <div className={styles.decisionResultLabel}>Decision</div>
          <textarea className={styles.blockTextarea} placeholder="What was decided?" value={data.decision} onChange={e => onChange({ ...data, decision: e.target.value })} style={{ background: "transparent", border: "none", padding: 0, minHeight: 36 }} />
        </div>
        <div style={{ marginBottom: 8 }}>
          <span className={styles.feedbackFieldLabel}>Alternatives considered</span>
          {data.alternatives.map((alt, i) => (
            <div key={i} className={styles.decisionAlt}>
              <div className={styles.decisionAltDot} />
              <div style={{ flex: 1 }}>
                <input className={styles.blockInput} placeholder="Alternative" value={alt.label} onChange={e => updateAlt(i, "label", e.target.value)} style={{ fontSize: 13, marginBottom: 4 }} />
                <input className={styles.blockInput} placeholder="Why not chosen" value={alt.reason} onChange={e => updateAlt(i, "reason", e.target.value)} style={{ fontSize: 12, color: "var(--ink-400)" }} />
              </div>
              <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={() => removeAlt(i)}>&times;</button>
            </div>
          ))}
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addAlt} style={{ marginTop: 6 }}>+ Add alternative</button>
        </div>
        <textarea className={styles.blockTextarea} placeholder="Context and reasoning..." value={data.context} onChange={e => onChange({ ...data, context: e.target.value })} />
        <div className={styles.blockActions}>
          <input className={styles.blockInput} placeholder="Decided by" value={data.decidedBy} onChange={e => onChange({ ...data, decidedBy: e.target.value })} style={{ flex: 1, fontSize: 13 }} />
        </div>
      </div>
    </div>
  );
}

export { DecisionBlock };
