"use client";

import type { ProgressStreamData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: ProgressStreamData;
  onUpdate: (data: ProgressStreamData) => void;
}

export function getDefaultProgressStreamData(): ProgressStreamData {
  return {
    snapshots: [
      { id: "s1", date: "Mar 20", label: "Initial sketches", desc: "Exploring 4 different logo directions based on discovery workshop", items: 4, type: "sketch", color: "#b8b3a8" },
      { id: "s2", date: "Mar 23", label: "Direction selected", desc: "Client chose Direction A — organic, warm, serif-forward", items: 1, type: "decision", color: "#7c6b9e" },
      { id: "s3", date: "Mar 25", label: "Logo refinement", desc: "3 variants of chosen direction with typography pairings", items: 3, type: "design", color: "#b07d4f" },
      { id: "s4", date: "Mar 27", label: "Color exploration", desc: "5 palette options tested against accessibility standards", items: 5, type: "design", color: "#b07d4f" },
      { id: "s5", date: "Mar 29", label: "Typography system", desc: "Cormorant Garamond + Outfit + JetBrains Mono — full scale defined", items: 1, type: "design", color: "#b07d4f" },
      { id: "s6", date: "Today", label: "Guidelines draft", desc: "First 20 pages of brand guidelines document in progress", items: 1, type: "current", color: "#5a9a3c" },
    ],
  };
}

export default function ProgressStreamBlock({ data }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#5b7fa4", background: "rgba(91,127,164,0.06)", borderColor: "rgba(91,127,164,0.1)" }}>Progress</span>
        <span className={styles.title}>Work stream</span>
        <span className={styles.subtitle}>How we got here</span>
      </div>
      <div className={styles.streamTrack}>
        {data.snapshots.map((s, i) => {
          const isLast = i === data.snapshots.length - 1;
          return (
            <div key={s.id} className={`${styles.streamItem} ${isLast ? styles.streamCurrent : ""}`}>
              <div className={styles.streamConnector}>
                <div className={styles.streamDot} style={{ background: isLast ? s.color : "transparent", borderColor: s.color }}>
                  {!isLast && <span style={{ color: s.color, fontSize: 9 }}>{s.type === "decision" ? "◆" : "✓"}</span>}
                  {isLast && <span style={{ color: "#fff", fontSize: 9 }}>●</span>}
                </div>
                {i < data.snapshots.length - 1 && <div className={styles.streamLine} style={{ background: s.color + "30" }} />}
              </div>
              <div className={styles.streamContent}>
                <div className={styles.streamDate}>{s.date}</div>
                <div className={styles.streamLabel}>{s.label}</div>
                <div className={styles.streamDesc}>{s.desc}</div>
                {s.items > 1 && (
                  <div className={styles.streamThumbs}>
                    {Array.from({ length: Math.min(s.items, 4) }).map((_, j) => (
                      <div key={j} className={styles.streamThumb} style={{ background: s.color + "12", borderColor: s.color + "20" }}>
                        <span style={{ color: s.color + "60", fontSize: 12 }}>{s.type === "sketch" ? "✎" : "◆"}</span>
                      </div>
                    ))}
                    {s.items > 4 && <span className={styles.streamMore}>+{s.items - 4}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
