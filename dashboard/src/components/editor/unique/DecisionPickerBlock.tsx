"use client";

import type { DecisionPickerData } from "@/lib/types";
import styles from "./UniqueBlocks.module.css";

interface Props {
  data: DecisionPickerData;
  onUpdate: (data: DecisionPickerData) => void;
}

export function getDefaultDecisionPickerData(): DecisionPickerData {
  return {
    options: [
      { id: "a", label: "Direction A", subtitle: "Organic & Warm", desc: "Earth tones, serif typography, hand-drawn textures. Feels artisanal, approachable, and premium.", colors: ["#2c2a25", "#b07d4f", "#d5d1c8", "#faf9f7", "#5a9a3c"], font: "Cormorant Garamond", timeline: "3 weeks", price: 4200, pros: ["Unique & memorable", "Warm & approachable", "Trending aesthetic"] },
      { id: "b", label: "Direction B", subtitle: "Clean & Modern", desc: "Monochrome with accent, geometric sans-serif, sharp lines. Professional, scalable, tech-forward.", colors: ["#1a1a1a", "#3b82f6", "#e5e5e5", "#fafafa", "#10b981"], font: "Inter", timeline: "2 weeks", price: 3600, pros: ["Highly versatile", "Scales easily", "Modern & clean"] },
      { id: "c", label: "Direction C", subtitle: "Bold & Expressive", desc: "High contrast, oversized type, dynamic color palette. Energetic, confident, impossible to ignore.", colors: ["#0f0f0f", "#ff5722", "#ffd600", "#ffffff", "#7c4dff"], font: "Space Grotesk", timeline: "4 weeks", price: 4800, pros: ["Standout presence", "Highly expressive", "Strong brand recall"] },
    ],
    choice: null,
  };
}

export default function DecisionPickerBlock({ data, onUpdate }: Props) {
  const setChoice = (id: string) => onUpdate({ ...data, choice: data.choice === id ? null : id });
  const chosen = data.options.find(o => o.id === data.choice);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge} style={{ color: "#7c6b9e", background: "rgba(124,107,158,0.06)", borderColor: "rgba(124,107,158,0.1)" }}>Decision</span>
        <span className={styles.title}>Choose a direction</span>
        <span className={styles.subtitle}>Click to select</span>
      </div>
      <div className={styles.decisionGrid}>
        {data.options.map(opt => (
          <div key={opt.id} className={`${styles.decisionCard} ${data.choice === opt.id ? styles.decisionChosen : ""}`} onClick={() => setChoice(opt.id)}>
            {data.choice === opt.id && <div className={styles.decisionChosenBadge}>✓ Selected</div>}
            <div className={styles.decisionLabel}>{opt.label}</div>
            <div className={styles.decisionSubtitle}>{opt.subtitle}</div>
            <div className={styles.decisionColors}>
              {opt.colors.map((c, i) => <div key={i} className={styles.decisionColor} style={{ background: c, border: ["#fafafa", "#faf9f7", "#ffffff", "#e5e5e5"].includes(c) ? "1px solid #e5e2db" : "none" }} />)}
            </div>
            <div className={styles.decisionFont} style={{ fontFamily: opt.font === "Cormorant Garamond" ? "'Cormorant Garamond', serif" : "inherit" }}>{opt.font}</div>
            <div className={styles.decisionDesc}>{opt.desc}</div>
            <div className={styles.decisionPros}>
              {opt.pros.map((p, i) => <span key={i} className={styles.decisionPro}>✓ {p}</span>)}
            </div>
            <div className={styles.decisionMeta}>
              <span>${opt.price.toLocaleString()}</span>
              <span className={styles.decisionMetaSep}>·</span>
              <span>{opt.timeline}</span>
            </div>
          </div>
        ))}
      </div>
      {chosen && (
        <div className={styles.decisionConfirm}>
          You selected <strong>{chosen.label}</strong> — {chosen.subtitle} · ${chosen.price.toLocaleString()} · {chosen.timeline}
        </div>
      )}
    </div>
  );
}
