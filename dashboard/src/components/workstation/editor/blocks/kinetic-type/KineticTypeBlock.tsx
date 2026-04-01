"use client";

import { useState } from "react";
import type { KineticTypeData } from "@/lib/types";
import { useInView } from "../shared/useInView";
import styles from "./KineticTypeBlock.module.css";

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

interface KineticTypeProps {
  data: KineticTypeData;
  onChange: (d: KineticTypeData) => void;
}

export default function KineticTypeBlock({ data, onChange }: KineticTypeProps) {
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

export { KineticTypeBlock };
