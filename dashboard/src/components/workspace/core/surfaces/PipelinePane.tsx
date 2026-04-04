"use client";

import styles from "./ListPane.module.css";

const PIPELINE_DEALS = [
  { client: "Luna Boutique", project: "Brand Identity", value: 6500, stage: "proposal" as const, dots: 1 },
  { client: "Meridian", project: "Guidelines v2 Phase 2", value: 4800, stage: "contract" as const, dots: 2 },
  { client: "Nora Kim", project: "Course Landing Page", value: 3200, stage: "invoice" as const, dots: 3 },
  { client: "Bolt Fitness", project: "App Onboarding UX", value: 4000, stage: "paid" as const, dots: 4 },
];

const STAGE_LABELS: Record<(typeof PIPELINE_DEALS)[number]["stage"], string> = {
  proposal: "Proposal",
  contract: "Contract",
  invoice: "Invoice",
  paid: "Paid",
};

export default function PipelinePane() {
  return (
    <div>
      <div className={styles.pipeBar}>
        {(["proposal", "contract", "invoice", "paid"] as const).map((stage, index) => {
          const count = PIPELINE_DEALS.filter((deal) => deal.stage === stage).length;

          return (
            <div key={stage} className={styles.pipeSeg}>
              <div className={`${styles.pipeSegBar} ${styles[`pipe${stage.charAt(0).toUpperCase() + stage.slice(1)}`]}`} />
              <div className={styles.pipeSegInfo}><span className={styles.pipeSegLb}>{STAGE_LABELS[stage]}</span><span className={styles.pipeSegN}>{count}</span></div>
              {index < 3 && <span className={styles.pipeArr}>&rarr;</span>}
            </div>
          );
        })}
      </div>

      {PIPELINE_DEALS.map((deal, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.rowMain}>
            <div className={styles.dots}>
              {[0, 1, 2, 3].map((dotIndex) => (
                <div
                  key={dotIndex}
                  className={`${styles.dot} ${dotIndex < deal.dots ? styles.dotOn : ""}`}
                  style={dotIndex < deal.dots ? { background: deal.stage === "paid" ? "#26a69a" : deal.stage === "invoice" ? "#2962ff" : deal.stage === "contract" ? "#ff9800" : "#9598a1" } : undefined}
                />
              ))}
            </div>
            <div className={styles.rowInfo}><span className={styles.rowName}>{deal.client}</span><span className={styles.rowMeta}>{deal.project}</span></div>
            <span className={styles.rowMono}>${deal.value.toLocaleString()}</span>
            <span className={`${styles.pill} ${deal.stage === "paid" ? styles.paid : deal.stage === "invoice" ? styles.pending : styles.neutral}`}>{STAGE_LABELS[deal.stage]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
