"use client";

import type { BrandBoardData } from "@/lib/types";
import styles from "./BrandBoardBlock.module.css";

export function getDefaultBrandBoard(): BrandBoardData {
  return {
    title: "Meridian Studio \u2014 Brand Board",
    logoLetter: "M",
    logoName: "Meridian",
    logoSub: "Design Studio",
    colors: [
      { hex: "#2c2a25", name: "Charcoal", type: "Primary" },
      { hex: "#b07d4f", name: "Amber", type: "Accent" },
      { hex: "#5b7fa4", name: "Slate Blue", type: "Secondary" },
      { hex: "#faf9f7", name: "Parchment", type: "Background" },
      { hex: "#5a9a3c", name: "Forest", type: "Success" },
    ],
    fonts: [
      { family: "Cormorant Garamond", role: "Heading", weight: "700" },
      { family: "Outfit", role: "Body", weight: "400" },
      { family: "JetBrains Mono", role: "Mono", weight: "400" },
    ],
    keywords: ["Elevated", "Warm", "Intentional", "Craft", "Timeless"],
  };
}

export default function BrandBoardBlock({ data, onChange }: { data: BrandBoardData; onChange: (d: BrandBoardData) => void }) {
  return (
    <div className={styles.brand}>
      <div className={styles.brandHeader}>
        <div className={styles.brandIcon}>&#x2726;</div>
        <span className={styles.brandLabel}>Brand Board</span>
        <span className={styles.blockMeta}>{data.title}</span>
      </div>
      <div className={styles.brandBody}>
        <div className={styles.brandLogo}>
          <div className={styles.brandLogoMark}>{data.logoLetter}</div>
          <div className={styles.brandLogoText}>
            <div className={styles.brandLogoName}>{data.logoName}</div>
            <div className={styles.brandLogoSub}>{data.logoSub}</div>
            <div className={styles.brandLogoVariants}>
              <div className={styles.brandLogoVariant} style={{ background: "#2c2a25", color: "#fff" }}>{data.logoLetter}</div>
              <div className={styles.brandLogoVariant} style={{ background: "#faf9f7", color: "#2c2a25", border: "1px solid #e8e3db" }}>{data.logoLetter}</div>
              <div className={styles.brandLogoVariant} style={{ background: "#b07d4f", color: "#fff" }}>{data.logoLetter}</div>
            </div>
          </div>
        </div>
        <div className={styles.brandColors}>
          <div className={styles.brandColorsLabel}>Color Palette</div>
          <div className={styles.brandColorRow}>
            {data.colors.map((c, i) => (
              <div key={i} className={styles.brandSwatch}>
                <div className={styles.brandSwatchColor} style={{ background: c.hex }} />
                <div className={styles.brandSwatchName}>{c.name}</div>
                <div className={styles.brandSwatchHex}>{c.hex}</div>
                <div className={styles.brandSwatchType}>{c.type}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandTypo}>
          <div className={styles.brandTypoLabel}>Typography</div>
          <div className={styles.brandTypoRow}>
            {data.fonts.map((f, i) => (
              <div key={i} className={styles.brandTypoSample}>
                <span className={styles.brandTypoRole}>{f.role}</span>
                <span className={styles.brandTypoText} style={{ fontFamily: f.family, fontWeight: Number(f.weight) }}>
                  {f.family}
                </span>
                <span className={styles.brandTypoWeight}>{f.weight}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.brandKeywords}>
          {data.keywords.map((kw, i) => (
            <span key={i} className={styles.brandKeyword}>{kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export { BrandBoardBlock };
