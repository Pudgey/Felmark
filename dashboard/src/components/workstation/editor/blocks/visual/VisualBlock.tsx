"use client";

import { useState } from "react";
import type { VisualBlockData, VisualVariant, VisualStep, VisualPhase, VisualMoodItem } from "@/lib/types";
import styles from "./VisualBlock.module.css";

interface VisualBlockProps {
  data: VisualBlockData;
  onUpdate: (data: VisualBlockData) => void;
}

const VARIANTS: { id: VisualVariant; label: string; icon: string; desc: string }[] = [
  { id: "process-flow", label: "Process Flow", icon: "→", desc: "Step-by-step visual flow" },
  { id: "timeline", label: "Timeline", icon: "◇", desc: "Project roadmap with phases" },
  { id: "brand-board", label: "Brand Board", icon: "✦", desc: "Visual identity snapshot" },
  { id: "mood-board", label: "Mood Board", icon: "◆", desc: "Visual direction grid" },
  { id: "wireframe", label: "Wireframe", icon: "□", desc: "Page layout wireframe" },
];

export function getDefaultVisualData(variant: VisualVariant): VisualBlockData {
  switch (variant) {
    case "process-flow":
      return { variant, title: "Process Flow", steps: [
        { id: "s1", label: "Discovery", desc: "Research & strategy", status: "done" },
        { id: "s2", label: "Design", desc: "Visual concepts", status: "current" },
        { id: "s3", label: "Develop", desc: "Build & iterate", status: "upcoming" },
        { id: "s4", label: "Deliver", desc: "Launch & handoff", status: "upcoming" },
      ] };
    case "timeline":
      return { variant, title: "Project Timeline", phases: [
        { id: "p1", label: "Discovery", start: "Week 1", end: "Week 2", color: "#5a9a3c" },
        { id: "p2", label: "Design", start: "Week 3", end: "Week 5", color: "#b07d4f" },
        { id: "p3", label: "Development", start: "Week 5", end: "Week 8", color: "#5b7fa4" },
        { id: "p4", label: "Launch", start: "Week 9", end: "Week 10", color: "#7c6b9e" },
      ] };
    case "brand-board":
      return { variant, title: "Brand Board", brandColors: ["#2c2a25", "#b07d4f", "#faf9f7", "#5a9a3c", "#5b7fa4"], brandFonts: ["Cormorant Garamond", "Outfit", "JetBrains Mono"] };
    case "mood-board":
      return { variant, title: "Mood Board", moodItems: [
        { id: "m1", label: "Typography", placeholder: "Font pairing reference" },
        { id: "m2", label: "Color", placeholder: "Palette inspiration" },
        { id: "m3", label: "Texture", placeholder: "Material & pattern" },
        { id: "m4", label: "Photography", placeholder: "Art direction" },
        { id: "m5", label: "Layout", placeholder: "Composition reference" },
        { id: "m6", label: "Mood", placeholder: "Overall feeling" },
      ] };
    case "wireframe":
      return { variant, title: "Page Wireframe", wireframeSections: [
        { id: "w1", label: "Header / Nav", height: 48 },
        { id: "w2", label: "Hero Section", height: 120 },
        { id: "w3", label: "Content Area", height: 160 },
        { id: "w4", label: "Footer", height: 48 },
      ] };
  }
}

// ── Process Flow ──
function ProcessFlow({ data, onUpdate }: { data: VisualBlockData; onUpdate: (d: VisualBlockData) => void }) {
  const steps = data.steps || [];
  const cycleStatus = (idx: number) => {
    const order: VisualStep["status"][] = ["upcoming", "current", "done"];
    const updated = steps.map((s, i) => {
      if (i !== idx) return s;
      const next = order[(order.indexOf(s.status) + 1) % order.length];
      return { ...s, status: next };
    });
    onUpdate({ ...data, steps: updated });
  };

  return (
    <div className={styles.flow}>
      {steps.map((step, i) => (
        <div key={step.id} className={styles.flowStep}>
          <div className={`${styles.flowDot} ${styles[`flowDot_${step.status}`]}`} onClick={() => cycleStatus(i)}>
            {step.status === "done" && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            {step.status === "current" && <div className={styles.flowPulse} />}
          </div>
          {i < steps.length - 1 && <div className={`${styles.flowLine} ${step.status === "done" ? styles.flowLineDone : ""}`} />}
          <div className={styles.flowLabel}>{step.label}</div>
          <div className={styles.flowDesc}>{step.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ── Timeline ──
function Timeline({ data }: { data: VisualBlockData }) {
  const phases = data.phases || [];
  const total = phases.length;
  return (
    <div className={styles.timeline}>
      {phases.map((phase, i) => (
        <div key={phase.id} className={styles.tlPhase} style={{ flex: 1 }}>
          <div className={styles.tlBar} style={{ background: phase.color, opacity: 0.15, borderRadius: i === 0 ? "4px 0 0 4px" : i === total - 1 ? "0 4px 4px 0" : 0 }} />
          <div className={styles.tlBarFill} style={{ background: phase.color, borderRadius: i === 0 ? "4px 0 0 4px" : i === total - 1 ? "0 4px 4px 0" : 0 }} />
          <div className={styles.tlLabel} style={{ color: phase.color }}>{phase.label}</div>
          <div className={styles.tlRange}>{phase.start} – {phase.end}</div>
        </div>
      ))}
    </div>
  );
}

// ── Brand Board ──
function BrandBoard({ data }: { data: VisualBlockData }) {
  const colors = data.brandColors || [];
  const fonts = data.brandFonts || [];
  return (
    <div className={styles.brand}>
      <div className={styles.brandSection}>
        <div className={styles.brandSectionLabel}>Logo</div>
        <div className={styles.brandLogo}>
          <div className={styles.brandLogoLight}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#2c2a25" }}>M</span>
          </div>
          <div className={styles.brandLogoDark}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: "#b07d4f" }}>M</span>
          </div>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.brandSectionLabel}>Colors</div>
        <div className={styles.brandColors}>
          {colors.map((hex, i) => (
            <div key={i} className={styles.brandColor}>
              <div className={styles.brandColorSwatch} style={{ background: hex, border: hex === "#faf9f7" ? "1px solid var(--warm-200)" : "none" }} />
              <span className={styles.brandColorHex}>{hex}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.brandSectionLabel}>Typography</div>
        <div className={styles.brandFonts}>
          {fonts.map((font, i) => (
            <div key={i} className={styles.brandFont}>
              <span className={styles.brandFontSample} style={{ fontFamily: `'${font}', serif` }}>Aa</span>
              <span className={styles.brandFontName}>{font}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mood Board ──
function MoodBoard({ data }: { data: VisualBlockData }) {
  const items = data.moodItems || [];
  return (
    <div className={styles.mood}>
      {items.map(item => (
        <div key={item.id} className={styles.moodItem}>
          <div className={styles.moodPlaceholder}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" opacity="0.3"><rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.2" /><circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1" /><path d="M2 14l5-5 3 3 2.5-2L18 14" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></svg>
            <span>{item.placeholder}</span>
          </div>
          <div className={styles.moodLabel}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Wireframe ──
function WireframeBlock({ data }: { data: VisualBlockData }) {
  const sections = data.wireframeSections || [];
  return (
    <div className={styles.wireframe}>
      {sections.map(section => (
        <div key={section.id} className={styles.wireSection} style={{ height: section.height }}>
          <span className={styles.wireSectionLabel}>{section.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main ──
export default function VisualBlock({ data, onUpdate }: VisualBlockProps) {
  const [showPicker, setShowPicker] = useState(!data.variant);

  if (showPicker || !data.variant) {
    return (
      <div className={styles.picker}>
        <div className={styles.pickerLabel}>Choose a visual block</div>
        <div className={styles.pickerGrid}>
          {VARIANTS.map(v => (
            <button key={v.id} className={styles.pickerItem} onClick={() => { onUpdate(getDefaultVisualData(v.id)); setShowPicker(false); }}>
              <span className={styles.pickerIcon}>{v.icon}</span>
              <span className={styles.pickerName}>{v.label}</span>
              <span className={styles.pickerDesc}>{v.desc}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const variantInfo = VARIANTS.find(v => v.id === data.variant);

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span className={styles.headerIcon}>{variantInfo?.icon}</span>
        <input className={styles.headerTitle} value={data.title} onChange={e => onUpdate({ ...data, title: e.target.value })} />
        <button className={styles.headerSwitch} onClick={() => setShowPicker(true)} title="Switch type">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6a4 4 0 017.2-2.4M10 6a4 4 0 01-7.2 2.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9.5 1.5v2.5H7M2.5 10.5V8H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className={styles.body}>
        {data.variant === "process-flow" && <ProcessFlow data={data} onUpdate={onUpdate} />}
        {data.variant === "timeline" && <Timeline data={data} />}
        {data.variant === "brand-board" && <BrandBoard data={data} />}
        {data.variant === "mood-board" && <MoodBoard data={data} />}
        {data.variant === "wireframe" && <WireframeBlock data={data} />}
      </div>
    </div>
  );
}
