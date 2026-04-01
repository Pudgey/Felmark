"use client";

import type { ScopeBoundaryData, ScopeItem } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: ScopeBoundaryData;
  onUpdate: (data: ScopeBoundaryData) => void;
}

const STATUS_CFG: Record<string, { color: string; icon: string }> = {
  done: { color: "#5a9a3c", icon: "✓" },
  active: { color: "#b07d4f", icon: "●" },
  upcoming: { color: "#9b988f", icon: "○" },
};

export function getDefaultScopeBoundaryData(): ScopeBoundaryData {
  return {
    inScope: [
      { item: "Logo design — primary + secondary + icon", status: "done" },
      { item: "Color palette — 5 colors with accessibility", status: "done" },
      { item: "Typography system — 3 fonts, full scale", status: "active" },
      { item: "Brand guidelines document — 40+ pages", status: "active" },
      { item: "Social media templates — IG + LinkedIn", status: "upcoming" },
    ],
    outScope: [
      { item: "Website design or development", reason: "Separate engagement" },
      { item: "Copywriting or content creation", reason: "Client provides copy" },
      { item: "Photography or video production", reason: "Vendor list provided" },
      { item: "Print production or manufacturing", reason: "Files print-ready" },
      { item: "Ongoing social media management", reason: "Templates provided only" },
    ],
    note: "Changes to scope require a signed Change Order with adjusted timeline and budget.",
  };
}

export default function ScopeBoundaryBlock({ data }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#5a9a3c", background: "rgba(90,154,60,0.06)", borderColor: "rgba(90,154,60,0.1)" }}>Scope</span>
        <span className={styles.title}>Scope boundary</span>
      </div>
      <div className={styles.scopeGrid}>
        <div className={styles.scopeCol}>
          <div className={`${styles.scopeColHeader} ${styles.scopeIn}`}>
            <span className={styles.scopeColIcon}>✓</span>
            <span>Included in this project</span>
          </div>
          {data.inScope.map((s, i) => {
            const st = STATUS_CFG[s.status || "upcoming"];
            return (
              <div key={i} className={styles.scopeItem}>
                <span className={styles.scopeStatus} style={{ color: st.color }}>{st.icon}</span>
                <span className={styles.scopeText}>{s.item}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.scopeDivider}>
          <div className={styles.scopeDividerLine} />
          <span className={styles.scopeDividerLabel}>Boundary</span>
          <div className={styles.scopeDividerLine} />
        </div>
        <div className={styles.scopeCol}>
          <div className={`${styles.scopeColHeader} ${styles.scopeOut}`}>
            <span className={styles.scopeColIcon}>✕</span>
            <span>Not included</span>
          </div>
          {data.outScope.map((s, i) => (
            <div key={i} className={styles.scopeItem}>
              <span className={styles.scopeX}>✕</span>
              <div className={styles.scopeOutInfo}>
                <span className={styles.scopeText}>{s.item}</span>
                {s.reason && <span className={styles.scopeReason}>{s.reason}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.scopeFooter}>{data.note}</div>
    </div>
  );
}
