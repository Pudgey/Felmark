"use client";

import type { RevisionHeatmapData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: RevisionHeatmapData;
  onUpdate: (data: RevisionHeatmapData) => void;
}

const AUTHOR_COLORS: Record<string, string> = { A: "#b07d4f", J: "#7c8594", S: "#8a7e63", Y: "#5b7fa4" };

export function getDefaultRevisionHeatmapData(): RevisionHeatmapData {
  return {
    sections: [
      { name: "Logo Usage Rules", edits: 14, lastEdit: "2h ago", authors: ["A", "J"], heat: 95, lines: 42 },
      { name: "Color Palette", edits: 8, lastEdit: "3h ago", authors: ["A"], heat: 70, lines: 28 },
      { name: "Typography System", edits: 22, lastEdit: "15m ago", authors: ["A", "J", "S"], heat: 100, lines: 56 },
      { name: "Imagery Direction", edits: 3, lastEdit: "2d ago", authors: ["A"], heat: 25, lines: 18 },
      { name: "Social Templates", edits: 1, lastEdit: "5d ago", authors: ["A"], heat: 10, lines: 12 },
      { name: "Brand Voice", edits: 6, lastEdit: "Yesterday", authors: ["A"], heat: 50, lines: 34 },
      { name: "Usage Guidelines", edits: 11, lastEdit: "4h ago", authors: ["A", "S"], heat: 80, lines: 48 },
    ],
  };
}

function heatColor(heat: number) {
  if (heat >= 80) return "#c24b38";
  if (heat >= 50) return "#c89360";
  if (heat >= 25) return "#5b7fa4";
  return "#b8b3a8";
}

function heatBg(heat: number) {
  if (heat >= 80) return "rgba(194,75,56,0.04)";
  if (heat >= 50) return "rgba(200,147,96,0.04)";
  return "transparent";
}

export default function RevisionHeatmapBlock({ data }: Props) {
  const maxEdits = Math.max(...data.sections.map(s => s.edits));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#c24b38", background: "rgba(194,75,56,0.04)", borderColor: "rgba(194,75,56,0.08)" }}>Revisions</span>
        <span className={styles.title}>Edit heatmap</span>
        <span className={styles.subtitle}>Hotter = more recent edits</span>
      </div>
      <div className={styles.heatBody}>
        {data.sections.map((s, i) => {
          const color = heatColor(s.heat);
          return (
            <div key={i} className={styles.heatRow} style={{ background: heatBg(s.heat) }}>
              <div className={styles.heatBar} style={{ width: `${(s.edits / maxEdits) * 100}%`, background: color }} />
              <div className={styles.heatStrip} style={{ background: color, opacity: s.heat / 100 }} />
              <div className={styles.heatContent}>
                <div className={styles.heatName}>{s.name}</div>
                <div className={styles.heatMeta}>
                  <span>{s.edits} edits</span>
                  <span>·</span>
                  <span>{s.lines} lines</span>
                  <span>·</span>
                  <span>{s.lastEdit}</span>
                </div>
              </div>
              <div className={styles.heatAuthors}>
                {s.authors.map((a, j) => (
                  <span key={j} className={styles.heatAuthor} style={{ background: AUTHOR_COLORS[a] || "#9b988f" }}>{a}</span>
                ))}
              </div>
              <div className={styles.heatCount} style={{ color }}>{s.edits}</div>
            </div>
          );
        })}
      </div>
      <div className={styles.heatLegend}>
        <span className={styles.heatLegendItem}><span className={styles.heatLegendDot} style={{ background: "#c24b38" }} />Hot (active now)</span>
        <span className={styles.heatLegendItem}><span className={styles.heatLegendDot} style={{ background: "#c89360" }} />Warm (today)</span>
        <span className={styles.heatLegendItem}><span className={styles.heatLegendDot} style={{ background: "#5b7fa4" }} />Cool (this week)</span>
        <span className={styles.heatLegendItem}><span className={styles.heatLegendDot} style={{ background: "#b8b3a8" }} />Cold (stale)</span>
      </div>
    </div>
  );
}
