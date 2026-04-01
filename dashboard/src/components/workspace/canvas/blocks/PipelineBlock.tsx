"use client";

import type { RenderBlock } from "../types";
import styles from "./PipelineBlock.module.css";

const STAGES = [
  { key: "lead", label: "Lead", color: "#8b8bba" },
  { key: "proposal", label: "Proposal", color: "#b07d4f" },
  { key: "active", label: "Active", color: "#6b9a6b" },
  { key: "complete", label: "Complete", color: "#b5b2a9" },
] as const;

const DEALS = [
  { name: "Meridian Studio", sub: "Brand redesign", value: "$12,400", stage: "active", progress: 68, days: 14, views: 3 },
  { name: "Bolt Fitness", sub: "App UI kit", value: "$6,000", stage: "active", progress: 35, days: 7, views: 1 },
  { name: "Nora Kim", sub: "Portfolio site", value: "$4,200", stage: "proposal", progress: 0, days: 3, views: 5 },
  { name: "Luna Boutique", sub: "Logo & identity", value: "$3,800", stage: "lead", progress: 0, days: 1, views: 0 },
  { name: "Apex Consulting", sub: "Pitch deck", value: "$2,200", stage: "complete", progress: 100, days: 22, views: 8 },
];

const STAGE_VALUES: Record<string, number> = {
  lead: 3800,
  proposal: 4200,
  active: 18400,
  complete: 2200,
};

const TOTAL = Object.values(STAGE_VALUES).reduce((s, v) => s + v, 0);

export default function PipelineBlock({ block }: { block: RenderBlock }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Pipeline</span>
        <span className={styles.count}>{DEALS.length} deals</span>
        <span className={styles.total}>${(TOTAL / 1000).toFixed(1)}k</span>
      </div>

      <div className={styles.funnel}>
        {STAGES.map((s) => (
          <div
            key={s.key}
            className={styles.funnelSeg}
            style={{
              flex: STAGE_VALUES[s.key] / TOTAL,
              background: s.color,
            }}
            title={`${s.label}: $${(STAGE_VALUES[s.key] / 1000).toFixed(1)}k`}
          />
        ))}
      </div>

      <div className={styles.deals}>
        {DEALS.map((d, i) => {
          const stageColor = STAGES.find((s) => s.key === d.stage)?.color ?? "#b5b2a9";
          return (
            <div key={i} className={styles.deal}>
              <div className={styles.dealBar} style={{ background: stageColor }} />
              <div className={styles.dealInfo}>
                <div className={styles.dealName}>{d.name}</div>
                <div className={styles.dealSub}>{d.sub}</div>
              </div>
              <span className={styles.dealValue}>{d.value}</span>
              {d.stage === "active" && (
                <div className={styles.dealProgress}>
                  <div
                    className={styles.dealProgressFill}
                    style={{ width: `${d.progress}%`, background: stageColor }}
                  />
                </div>
              )}
              <div className={styles.dealMeta}>
                <span>{d.days}d</span>
                {d.views > 0 && <span>{d.views}x</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
