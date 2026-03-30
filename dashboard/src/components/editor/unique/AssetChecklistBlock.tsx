"use client";

import type { AssetChecklistData, AssetItem } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: AssetChecklistData;
  onUpdate: (data: AssetChecklistData) => void;
}

const STATUS_CFG: Record<string, { color: string; icon: string; label: string }> = {
  received: { color: "#5a9a3c", icon: "✓", label: "Received" },
  partial: { color: "#c89360", icon: "◐", label: "Partial" },
  missing: { color: "#c24b38", icon: "!", label: "Missing" },
  "not-needed": { color: "#9b988f", icon: "—", label: "Not needed" },
};

export function getDefaultAssetChecklistData(): AssetChecklistData {
  return {
    items: [
      { id: "a1", name: "Company logo (vector)", desc: "SVG, EPS, or AI format preferred", status: "received", receivedDate: "Mar 18", fileType: "SVG" },
      { id: "a2", name: "Brand colors (if existing)", desc: "Hex codes or Pantone references", status: "received", receivedDate: "Mar 18", fileType: "PDF" },
      { id: "a3", name: "Competitor URLs", desc: "3–5 competitors for analysis", status: "received", receivedDate: "Mar 20", fileType: "Link" },
      { id: "a4", name: "Photography assets", desc: "Team photos, office, products", status: "partial", note: "3 of 8 uploaded" },
      { id: "a5", name: "Content copy", desc: "Homepage, about, and services text", status: "missing", daysWaiting: 5 },
      { id: "a6", name: "Social media access", desc: "Admin access to IG, LinkedIn, X", status: "missing", daysWaiting: 5 },
      { id: "a7", name: "Target audience brief", desc: "Demographics, psychographics, personas", status: "not-needed", note: "We'll create this in discovery" },
    ],
  };
}

export default function AssetChecklistBlock({ data, onUpdate }: Props) {
  const cycleStatus = (id: string) => {
    const order: AssetItem["status"][] = ["missing", "partial", "received", "not-needed"];
    const items = data.items.map(item => {
      if (item.id !== id) return item;
      const next = order[(order.indexOf(item.status) + 1) % order.length];
      return { ...item, status: next };
    });
    onUpdate({ items });
  };

  const received = data.items.filter(i => i.status === "received").length;
  const total = data.items.filter(i => i.status !== "not-needed").length;
  const pct = total > 0 ? Math.round((received / total) * 100) : 0;
  const missingCount = data.items.filter(i => i.status === "missing").length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#8a7e63", background: "rgba(138,126,99,0.06)", borderColor: "rgba(138,126,99,0.1)" }}>Assets</span>
        <span className={styles.title}>What I need from you</span>
        <span className={styles.subtitle}>{received} of {total} received</span>
      </div>

      {/* Progress bar */}
      <div className={styles.assetsProgress}>
        <div className={styles.assetsProgressBar}>
          <div className={styles.assetsProgressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.assetsProgressLabel}>{pct}%</span>
      </div>

      <div className={styles.assetsList}>
        {data.items.map(item => {
          const st = STATUS_CFG[item.status];
          return (
            <div key={item.id} className={`${styles.assetItem} ${item.status === "missing" ? styles.assetMissing : ""}`}>
              <div className={styles.assetStatus} style={{ color: st.color, background: st.color + "08", borderColor: st.color + "15" }} onClick={() => cycleStatus(item.id)} title="Click to cycle status">
                {st.icon}
              </div>
              <div className={styles.assetInfo}>
                <div className={styles.assetName}>{item.name}</div>
                <div className={styles.assetDesc}>{item.desc}</div>
              </div>
              <div className={styles.assetRight}>
                {item.status === "received" && <span className={`${styles.assetTag} ${styles.assetTagReceived}`}>{item.fileType} · {item.receivedDate}</span>}
                {item.status === "partial" && <span className={`${styles.assetTag} ${styles.assetTagPartial}`}>{item.note}</span>}
                {item.status === "missing" && <span className={`${styles.assetTag} ${styles.assetTagMissing}`}>{item.daysWaiting}d waiting</span>}
                {item.status === "not-needed" && <span className={`${styles.assetTag} ${styles.assetTagNotNeeded}`}>{item.note}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {missingCount > 0 && (
        <div className={styles.assetsNudge}>
          <span className={styles.assetsNudgeIcon}>⚡</span>
          <span>{missingCount} item{missingCount > 1 ? "s are" : " is"} blocking progress.</span>
          <button className={styles.assetsNudgeBtn}>Send Reminder</button>
        </div>
      )}
    </div>
  );
}
