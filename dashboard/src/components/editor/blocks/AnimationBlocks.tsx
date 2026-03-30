"use client";

import { useState, useEffect, useRef } from "react";
import type { HeroSpotlightData, KineticTypeData, NumberCascadeData } from "@/lib/types";
import styles from "./AnimationBlocks.module.css";

/* ── Default data factories ── */

export function getDefaultHeroSpotlight(): HeroSpotlightData {
  return { preLine: "Exclusively prepared for", name: "MERIDIAN", postLine: "Brand Identity Proposal \u00b7 April 2026" };
}

export function getDefaultKineticType(): KineticTypeData {
  return {
    lines: [
      { text: "Your brand", weight: 300, size: 18, color: "var(--ink-400)", serif: false },
      { text: "is not a logo.", weight: 600, size: 44, color: "var(--ink-900)", serif: true },
      { text: "It\u2019s the feeling people get", weight: 300, size: 18, color: "var(--ink-400)", serif: false },
      { text: "before they even", weight: 400, size: 22, color: "var(--ink-500)", serif: false },
      { text: "read a word.", weight: 700, size: 52, color: "var(--ember)", serif: true },
    ],
  };
}

export function getDefaultNumberCascade(): NumberCascadeData {
  return {
    stats: [
      { num: "8+", label: "years of brand design experience" },
      { num: "47", label: "brand identity projects delivered" },
      { num: "100%", label: "client satisfaction rate" },
      { num: "$2.4M", label: "revenue generated for clients" },
      { num: "12", label: "industry awards for brand work" },
      { num: "4.9", label: "average client rating (out of 5)" },
    ],
  };
}

/* ── IntersectionObserver hook ── */

function useInView(threshold: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ═══════════════════════════════════════════
   1. Hero Spotlight Block
   ═══════════════════════════════════════════ */

interface HeroSpotlightProps {
  data: HeroSpotlightData;
  onChange: (d: HeroSpotlightData) => void;
}

export function HeroSpotlightBlock({ data, onChange }: HeroSpotlightProps) {
  const { ref, visible } = useInView(0.4);
  const [editField, setEditField] = useState<"preLine" | "name" | "postLine" | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (field: "preLine" | "name" | "postLine") => {
    setEditField(field);
    setDraft(data[field]);
  };

  const commitEdit = () => {
    if (editField) {
      onChange({ ...data, [editField]: draft });
      setEditField(null);
    }
  };

  return (
    <div className={styles.spotlight} ref={ref}>
      {/* Pre-line */}
      <div className={visible ? styles.spotlightPreVisible : styles.spotlightPre}>
        {editField === "preLine" ? (
          <input
            className={styles.inlineInput}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => startEdit("preLine")}>{data.preLine}</span>
        )}
      </div>

      {/* Name with letter-by-letter reveal */}
      <div className={styles.spotlightName}>
        {editField === "name" ? (
          <input
            className={styles.inlineInputLarge}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => startEdit("name")}>
            {data.name.split("").map((letter, i) => (
              <span
                key={i}
                className={visible ? styles.spotlightLetterVisible : styles.spotlightLetter}
                style={{ transitionDelay: `${400 + i * 100}ms` }}
              >
                {letter}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Ember underline */}
      <div className={visible ? styles.spotlightLineVisible : styles.spotlightLine} />

      {/* Post-line */}
      <div className={visible ? styles.spotlightPostVisible : styles.spotlightPost}>
        {editField === "postLine" ? (
          <input
            className={styles.inlineInput}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => startEdit("postLine")}>{data.postLine}</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. Kinetic Type Block
   ═══════════════════════════════════════════ */

interface KineticTypeProps {
  data: KineticTypeData;
  onChange: (d: KineticTypeData) => void;
}

export function KineticTypeBlock({ data, onChange }: KineticTypeProps) {
  const { ref, visible } = useInView(0.3);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setDraft(data.lines[idx].text);
  };

  const commitEdit = () => {
    if (editIdx !== null) {
      const lines = [...data.lines];
      lines[editIdx] = { ...lines[editIdx], text: draft };
      onChange({ lines });
      setEditIdx(null);
    }
  };

  return (
    <div className={styles.kinetic} ref={ref}>
      <div className={styles.kineticInner}>
        {data.lines.map((line, i) => (
          <div
            key={i}
            className={visible ? styles.kineticLineVisible : styles.kineticLine}
            style={{
              transitionDelay: `${i * 280}ms`,
              fontFamily: line.serif ? "'Cormorant Garamond', var(--font-heading), serif" : "'Outfit', var(--mono), sans-serif",
              fontWeight: line.weight,
              fontSize: `${line.size}px`,
              color: line.color,
            }}
          >
            {editIdx === i ? (
              <input
                className={styles.inlineInput}
                style={{ fontSize: `${line.size}px`, fontWeight: line.weight, fontFamily: "inherit" }}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
                autoFocus
              />
            ) : (
              <span onDoubleClick={() => startEdit(i)}>{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. Number Cascade Block
   ═══════════════════════════════════════════ */

interface NumberCascadeProps {
  data: NumberCascadeData;
  onChange: (d: NumberCascadeData) => void;
}

export function NumberCascadeBlock({ data, onChange }: NumberCascadeProps) {
  const { ref, visible } = useInView(0.3);
  const [editField, setEditField] = useState<{ idx: number; field: "num" | "label" } | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (idx: number, field: "num" | "label") => {
    setEditField({ idx, field });
    setDraft(data.stats[idx][field]);
  };

  const commitEdit = () => {
    if (editField) {
      const stats = [...data.stats];
      stats[editField.idx] = { ...stats[editField.idx], [editField.field]: draft };
      onChange({ stats });
      setEditField(null);
    }
  };

  const addStat = () => {
    if (data.stats.length < 9) {
      onChange({ stats: [...data.stats, { num: "0", label: "New stat" }] });
    }
  };

  return (
    <div className={styles.cascade} ref={ref}>
      <div className={styles.cascadeGrid}>
        {data.stats.map((stat, i) => (
          <div
            key={i}
            className={visible ? styles.cascadeItemVisible : styles.cascadeItem}
            style={{ transitionDelay: `${i * 150}ms` }}
          >
            <div className={styles.cascadeNum}>
              {editField?.idx === i && editField.field === "num" ? (
                <input
                  className={styles.inlineInputNum}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => startEdit(i, "num")}>{stat.num}</span>
              )}
            </div>
            <div className={styles.cascadeLabel}>
              {editField?.idx === i && editField.field === "label" ? (
                <input
                  className={styles.inlineInputLabel}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={e => { if (e.key === "Enter") commitEdit(); }}
                  autoFocus
                />
              ) : (
                <span onDoubleClick={() => startEdit(i, "label")}>{stat.label}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {data.stats.length < 9 && (
        <button className={styles.cascadeAdd} onClick={addStat}>+ Add stat</button>
      )}
    </div>
  );
}
