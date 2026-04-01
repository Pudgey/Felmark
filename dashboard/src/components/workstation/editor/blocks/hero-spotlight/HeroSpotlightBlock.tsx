"use client";

import { useState } from "react";
import type { HeroSpotlightData } from "@/lib/types";
import { useInView } from "../shared/useInView";
import styles from "./HeroSpotlightBlock.module.css";

export function getDefaultHeroSpotlight(): HeroSpotlightData {
  return { preLine: "Exclusively prepared for", name: "MERIDIAN", postLine: "Brand Identity Proposal \u00b7 April 2026" };
}

interface HeroSpotlightProps {
  data: HeroSpotlightData;
  onChange: (d: HeroSpotlightData) => void;
}

export default function HeroSpotlightBlock({ data, onChange }: HeroSpotlightProps) {
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

export { HeroSpotlightBlock };
