"use client";

import type { MoodBoardData } from "@/lib/types";
import styles from "./MoodBoardBlock.module.css";

export function getDefaultMoodBoard(): MoodBoardData {
  return {
    title: "Visual Direction \u2014 Warm Minimalism",
    cells: [
      { color: "#2c2a25", icon: "\u25C6", label: "Dark Base", span: "large", lightText: true },
      { color: "#b07d4f", icon: "\u25C7", label: "Warm Accent", lightText: true },
      { color: "#faf9f7", icon: "\u25CB", label: "Light" },
      { color: "#5b7fa4", icon: "\u25CE", label: "Calm Tone", span: "wide", lightText: true },
      { color: "#e8e3db", icon: "\u25B3", label: "Neutral" },
      { color: "#5a9a3c", icon: "\u2726", label: "Natural", lightText: true },
    ],
    keywords: ["Minimalism", "Warmth", "Texture", "Organic", "Intentional"],
  };
}

export default function MoodBoardBlock({ data, onChange: _onChange }: { data: MoodBoardData; onChange: (d: MoodBoardData) => void }) {
  return (
    <div className={styles.mood}>
      <div className={styles.moodHeader}>
        <div className={styles.moodIcon}>&#x25C7;</div>
        <span className={styles.moodLabel}>Mood Board</span>
        <span className={styles.blockMeta}>{data.cells.length} cells</span>
      </div>
      <div className={styles.moodBody}>
        <div className={styles.moodGrid}>
          {data.cells.map((cell, i) => (
            <div
              key={i}
              className={`${styles.moodCell} ${cell.span === "large" ? styles.moodCellLarge : ""} ${cell.span === "wide" ? styles.moodCellWide : ""}`}
              style={{ background: cell.color, color: cell.lightText ? "#fff" : "#2c2a25" }}
            >
              <span className={styles.moodCellIcon}>{cell.icon}</span>
              <span className={styles.moodCellLabel}>{cell.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.moodKeywords}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.moodKeyword}>{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { MoodBoardBlock };
