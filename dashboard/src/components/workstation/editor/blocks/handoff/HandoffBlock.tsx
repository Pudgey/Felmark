"use client";

import { useState } from "react";
import type { HandoffData } from "@/lib/types";
import styles from "./HandoffBlock.module.css";

export function getDefaultHandoff(): HandoffData {
  return { from: "You", to: "", notes: "", status: "pending", items: [] };
}

export default function HandoffBlock({ data, onChange }: { data: HandoffData; onChange: (d: HandoffData) => void }) {
  const [newItem, setNewItem] = useState("");
  const statusStyle = data.status === "completed" ? styles.handoffStatusCompleted : data.status === "accepted" ? styles.handoffStatusAccepted : styles.handoffStatusPending;

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange({ ...data, items: [...data.items, newItem.trim()] });
    setNewItem("");
  };

  return (
    <div className={styles.handoff}>
      <div className={styles.handoffHeader}>
        <div className={styles.handoffIcon}>{"\u2192"}</div>
        <span className={styles.handoffLabel}>Handoff</span>
        <span className={statusStyle}>{data.status}</span>
      </div>
      <div className={styles.blockBody}>
        <div className={styles.handoffFlow}>
          <input className={styles.blockInput} placeholder="From" value={data.from} onChange={e => onChange({ ...data, from: e.target.value })} style={{ flex: 1 }} />
          <span className={styles.handoffArrow}>{"\u2192"}</span>
          <input className={styles.blockInput} placeholder="To" value={data.to} onChange={e => onChange({ ...data, to: e.target.value })} style={{ flex: 1 }} />
        </div>
        <textarea className={styles.blockTextarea} placeholder="Handoff notes..." value={data.notes} onChange={e => onChange({ ...data, notes: e.target.value })} />
        {data.items.length > 0 && (
          <div className={styles.handoffItems}>
            {data.items.map((item, i) => (
              <div key={i} className={styles.handoffItem}>
                <div className={styles.handoffItemDot} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input className={styles.blockInput} placeholder="Add checklist item..." value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addItem(); }} style={{ flex: 1, fontSize: 13 }} />
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addItem}>Add</button>
        </div>
        <div className={styles.blockActions}>
          {(["pending", "accepted", "completed"] as const).map(s => (
            <button key={s} className={`${styles.blockBtn} ${styles.blockBtnSmall} ${data.status === s ? styles.blockBtnPrimary : ""}`} onClick={() => onChange({ ...data, status: s })}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { HandoffBlock };
