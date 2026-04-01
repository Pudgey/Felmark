"use client";

import type { WireframeBlockData } from "@/lib/types";
import styles from "./WireframeBlock.module.css";

export function getDefaultWireframe(): WireframeBlockData {
  return {
    title: "Landing Page Layout",
    viewport: "Desktop 1440px",
    sections: [
      { label: "Nav", content: "Logo left, nav links center, CTA button right" },
      { label: "Hero", content: "Full-width hero with headline, subtext, and primary CTA. Background image or gradient." },
      { label: "Features", content: "3-column grid: icon + heading + description per feature card" },
      { label: "Testimonials", content: "Carousel or single pull-quote with avatar, name, and role" },
      { label: "CTA", content: "Centered heading + email capture form + trust badges" },
      { label: "Footer", content: "4-column: links, social icons, newsletter signup, copyright" },
    ],
  };
}

export default function WireframeBlock({ data, onChange }: { data: WireframeBlockData; onChange: (d: WireframeBlockData) => void }) {
  return (
    <div className={styles.wire}>
      <div className={styles.wireHeader}>
        <div className={styles.wireIcon}>&#x2610;</div>
        <span className={styles.wireLabel}>Wireframe</span>
        <span className={styles.blockMeta}>{data.title}</span>
      </div>
      <div className={styles.wireBody}>
        <div className={styles.wireCanvas}>
          {data.sections.map((sec, i) => (
            <div key={i} className={styles.wireSection}>
              <span className={styles.wireSectionLabel}>{sec.label}</span>
              <div className={styles.wireSectionContent}>{sec.content}</div>
            </div>
          ))}
        </div>
        <div className={styles.wireFooter}>
          <span className={styles.wireHint}>Dashed borders = layout zones</span>
          <span className={styles.wireViewport}>{data.viewport}</span>
        </div>
      </div>
    </div>
  );
}

export { WireframeBlock };
