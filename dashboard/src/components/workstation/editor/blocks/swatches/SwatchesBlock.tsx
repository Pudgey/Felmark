"use client";

import { useState } from "react";
import type { SwatchesBlockData } from "@/lib/types";
import styles from "./SwatchesBlock.module.css";

const getLuminance = (hex: string) => {
  const rgb = hex.match(/[a-f\d]{2}/gi)!.map(v => { const c = parseInt(v, 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

const getContrast = (h1: string, h2: string) => { const l1 = getLuminance(h1), l2 = getLuminance(h2); return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2); };

export default function SwatchesBlock({ data }: { data: SwatchesBlockData }) {
  const [selected, setSelected] = useState<number | null>(null);
  const sel = selected !== null ? data.colors[selected] : null;

  return (
    <div className={styles.swatches}>
      <div className={styles.swatchGrid}>
        {data.colors.map((c, i) => (
          <div key={i} className={`${styles.swatch} ${selected === i ? styles.swatchOn : ""}`} onClick={() => setSelected(selected === i ? null : i)}>
            <div className={styles.swatchCircle} style={{ background: c.hex }} />
            <span className={styles.swatchName}>{c.name}</span>
            <span className={styles.swatchHex}>{c.hex}</span>
          </div>
        ))}
      </div>
      {sel && (
        <div className={styles.contrastPanel}>
          <div className={styles.contrastLabel}>Contrast against {sel.name}</div>
          {data.colors.filter((_, i) => i !== selected).map((c, i) => {
            const ratio = parseFloat(getContrast(sel.hex, c.hex));
            return (
              <div key={i} className={styles.contrastRow}>
                <span className={styles.contrastDot} style={{ background: sel.hex }} />
                <span className={styles.contrastDot} style={{ background: c.hex }} />
                <span className={styles.contrastName}>{c.name}</span>
                <span className={styles.contrastRatio}>{ratio}:1</span>
                <span className={`${styles.contrastBadge} ${ratio >= 4.5 ? styles.pass : styles.fail}`}>{ratio >= 4.5 ? "AA \u2713" : "Fail"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { SwatchesBlock };
