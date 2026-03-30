"use client";

import { useState, useEffect, useRef } from "react";
import type { HeroSpotlightData, KineticTypeData, NumberCascadeData, StatRevealData, ValueCounterData } from "@/lib/types";
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

/* ═══════════════════════════════════════════
   4. Stat Reveal Block
   ═══════════════════════════════════════════ */

export function getDefaultStatReveal(): StatRevealData {
  return {
    stats: [
      { value: 340, prefix: "", suffix: "%", label: "ROI", sub: "Return on brand investment", color: "#5a9a3c" },
      { value: 23, prefix: "", suffix: "×", label: "Revenue", sub: "Multiplier from identity work", color: "var(--ember)" },
      { value: 71, prefix: "", suffix: "%", label: "Recognition", sub: "Brand recall improvement", color: "#5b7fa4" },
    ],
    footer: "Why brand identity is a revenue investment, not a cost.",
  };
}

interface StatRevealProps {
  data: StatRevealData;
  onChange: (d: StatRevealData) => void;
}

export function StatRevealBlock({ data, onChange }: StatRevealProps) {
  const { ref, visible } = useInView(0.3);
  const [editField, setEditField] = useState<{ idx: number; field: "label" | "sub" | "footer" } | null>(null);
  const [draft, setDraft] = useState("");

  const startEdit = (idx: number, field: "label" | "sub") => {
    setEditField({ idx, field });
    setDraft(data.stats[idx][field]);
  };

  const startEditFooter = () => {
    setEditField({ idx: -1, field: "footer" });
    setDraft(data.footer);
  };

  const commitEdit = () => {
    if (!editField) return;
    if (editField.field === "footer") {
      onChange({ ...data, footer: draft });
    } else {
      const stats = [...data.stats];
      stats[editField.idx] = { ...stats[editField.idx], [editField.field]: draft };
      onChange({ ...data, stats });
    }
    setEditField(null);
  };

  return (
    <div className={styles.statReveal} ref={ref}>
      <div className={styles.statRevealGrid}>
        {data.stats.map((stat, i) => (
          <StatRevealCard key={i} stat={stat} index={i} visible={visible} editField={editField} draft={draft} setDraft={setDraft} startEdit={startEdit} commitEdit={commitEdit} />
        ))}
      </div>
      <div className={visible ? styles.statRevealFooterVisible : styles.statRevealFooter}>
        {editField?.field === "footer" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={startEditFooter}>{data.footer}</span>
        )}
      </div>
    </div>
  );
}

interface StatRevealCardProps {
  stat: StatRevealData["stats"][number];
  index: number;
  visible: boolean;
  editField: { idx: number; field: string } | null;
  draft: string;
  setDraft: (v: string) => void;
  startEdit: (idx: number, field: "label" | "sub") => void;
  commitEdit: () => void;
}

function StatRevealCard({ stat, index, visible, editField, draft, setDraft, startEdit, commitEdit }: StatRevealCardProps) {
  const [displayVal, setDisplayVal] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!visible) return;
    const delay = index * 200;
    const duration = 1800;
    let start: number | null = null;
    let running = true;

    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!running) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // quartic ease-out: 1 - (1-t)^4
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplayVal(Math.round(eased * stat.value));
        if (t < 1) { rafRef.current = requestAnimationFrame(step); }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      running = false;
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, stat.value, index]);

  const circumference = 2 * Math.PI * 20;
  const progress = visible ? displayVal / stat.value : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className={visible ? styles.statCardVisible : styles.statCard} style={{ transitionDelay: `${index * 200}ms` }}>
      <svg width="48" height="48" viewBox="0 0 48 48" className={styles.statRing}>
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--warm-200)" strokeWidth="3" />
        <circle cx="24" cy="24" r="20" fill="none" stroke={stat.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.1s linear" }} />
      </svg>
      <div className={styles.statValue} style={{ color: stat.color }}>
        {stat.prefix}{displayVal}{stat.suffix}
      </div>
      <div className={styles.statLabel}>
        {editField?.idx === index && editField.field === "label" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEdit(index, "label")}>{stat.label}</span>
        )}
      </div>
      <div className={styles.statSub}>
        {editField?.idx === index && editField.field === "sub" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEdit(index, "sub")}>{stat.sub}</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   5. Value Counter Block
   ═══════════════════════════════════════════ */

export function getDefaultValueCounter(): ValueCounterData {
  return {
    topLabel: "Estimated brand value over 3 years",
    targetValue: 147200,
    rows: [
      { label: "Initial investment", amount: "-$4,800", positive: false },
      { label: "Revenue from new clients", amount: "+$82,000", positive: true },
      { label: "Client retention value", amount: "+$46,000", positive: true },
      { label: "Premium pricing uplift", amount: "+$24,000", positive: true },
    ],
    bottomLine: "That\u2019s a 30\u00d7 return on your brand investment.",
  };
}

interface ValueCounterProps {
  data: ValueCounterData;
  onChange: (d: ValueCounterData) => void;
}

export function ValueCounterBlock({ data, onChange }: ValueCounterProps) {
  const { ref, visible } = useInView(0.3);
  const [phase, setPhase] = useState(0);
  const [displayVal, setDisplayVal] = useState(0);
  const [editField, setEditField] = useState<"topLabel" | "bottomLine" | { idx: number; field: "label" | "amount" } | null>(null);
  const [draft, setDraft] = useState("");
  const rafRef = useRef<number>(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!visible) return;
    // Phase 1: top label (immediate)
    setPhase(1);
    // Phase 2: amount area prepares
    const t2 = setTimeout(() => setPhase(2), 800);
    // Phase 3: counter starts + rows
    const t3 = setTimeout(() => {
      setPhase(3);
      const duration = 2400;
      let start: number | null = null;
      let running = true;
      const step = (ts: number) => {
        if (!running) return;
        if (!start) start = ts;
        const elapsed = ts - start;
        const t = Math.min(elapsed / duration, 1);
        // quintic ease-out: 1 - (1-t)^5
        const eased = 1 - Math.pow(1 - t, 5);
        setDisplayVal(Math.round(eased * data.targetValue));
        if (t < 1) { rafRef.current = requestAnimationFrame(step); }
      };
      rafRef.current = requestAnimationFrame(step);
      timerRefs.current.push(t3);
      // Cleanup RAF on unmount handled below
      return () => { running = false; };
    }, 1600);
    timerRefs.current = [t2, t3];

    return () => {
      timerRefs.current.forEach(t => clearTimeout(t));
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, data.targetValue]);

  const startEditSimple = (field: "topLabel" | "bottomLine") => {
    setEditField(field);
    setDraft(data[field]);
  };

  const startEditRow = (idx: number, field: "label" | "amount") => {
    setEditField({ idx, field });
    setDraft(data.rows[idx][field]);
  };

  const commitEdit = () => {
    if (!editField) return;
    if (editField === "topLabel" || editField === "bottomLine") {
      onChange({ ...data, [editField]: draft });
    } else {
      const rows = [...data.rows];
      rows[editField.idx] = { ...rows[editField.idx], [editField.field]: draft };
      onChange({ ...data, rows });
    }
    setEditField(null);
  };

  const formatted = displayVal.toLocaleString("en-US");

  return (
    <div className={styles.valueCounter} ref={ref}>
      {/* Top label */}
      <div className={phase >= 1 ? styles.vcTopLabelVisible : styles.vcTopLabel}>
        {editField === "topLabel" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEditSimple("topLabel")}>{data.topLabel}</span>
        )}
      </div>

      {/* Big number */}
      <div className={phase >= 2 ? styles.vcAmountVisible : styles.vcAmount}>
        ${formatted}
      </div>

      {/* Breakdown rows */}
      <div className={styles.vcRows}>
        {data.rows.map((row, i) => (
          <div key={i} className={phase >= 3 ? styles.vcRowVisible : styles.vcRow} style={{ transitionDelay: `${i * 150}ms` }}>
            <span className={styles.vcRowLabel}>
              {typeof editField === "object" && editField?.idx === i && editField.field === "label" ? (
                <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
              ) : (
                <span onDoubleClick={() => startEditRow(i, "label")}>{row.label}</span>
              )}
            </span>
            <span className={row.positive ? styles.vcRowAmountPos : styles.vcRowAmountNeg}>
              {typeof editField === "object" && editField?.idx === i && editField.field === "amount" ? (
                <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
              ) : (
                <span onDoubleClick={() => startEditRow(i, "amount")}>{row.amount}</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom line */}
      <div className={phase >= 3 ? styles.vcBottomVisible : styles.vcBottom}>
        {editField === "bottomLine" ? (
          <input className={styles.inlineInput} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commitEdit} onKeyDown={e => { if (e.key === "Enter") commitEdit(); }} autoFocus />
        ) : (
          <span onDoubleClick={() => startEditSimple("bottomLine")}>{data.bottomLine}</span>
        )}
      </div>
    </div>
  );
}
