"use client";

import type { MentionData } from "@/lib/types";
import styles from "./MentionBlock.module.css";

export function getDefaultMention(): MentionData {
  return { person: "", message: "", notified: false };
}

export default function MentionBlock({ data, onChange }: { data: MentionData; onChange: (d: MentionData) => void }) {
  return (
    <div className={styles.mention}>
      <div className={styles.mentionHeader}>
        <div className={styles.mentionIcon}>@</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Mention</span>
        {data.notified && <span className={styles.mentionNotified}>Notified</span>}
      </div>
      <div className={styles.blockBody}>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input className={styles.blockInput} placeholder="@person" value={data.person} onChange={e => onChange({ ...data, person: e.target.value })} style={{ flex: 1 }} />
          <button className={`${styles.blockBtn} ${styles.blockBtnPrimary} ${styles.blockBtnSmall}`} onClick={() => onChange({ ...data, notified: true })}>
            Notify
          </button>
        </div>
        <textarea className={styles.blockTextarea} placeholder="Add a message..." value={data.message} onChange={e => onChange({ ...data, message: e.target.value })} />
      </div>
    </div>
  );
}

export { MentionBlock };
