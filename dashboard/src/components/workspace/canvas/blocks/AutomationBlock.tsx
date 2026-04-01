"use client";

import type { RenderBlock } from "../types";
import styles from "./AutomationBlock.module.css";

const RULES = [
  {
    icon: "\u26A1",
    badgeColor: "#b07d4f",
    badgeBg: "rgba(176,125,79,0.06)",
    trigger: "Invoice overdue 7+ days",
    action: "Send reminder email to client",
    status: "fired",
    statusColor: "#c07a6a",
  },
  {
    icon: "\u2709",
    badgeColor: "#8b8bba",
    badgeBg: "rgba(139,139,186,0.06)",
    trigger: "New inquiry received",
    action: "Create lead + notify Slack",
    status: "ready",
    statusColor: "#6b9a6b",
  },
  {
    icon: "\u23F0",
    badgeColor: "#6b9a6b",
    badgeBg: "rgba(107,154,107,0.06)",
    trigger: "Weekly on Friday 5 PM",
    action: "Generate hours summary report",
    status: "scheduled",
    statusColor: "#8b8bba",
  },
  {
    icon: "\u25CE",
    badgeColor: "#c07a6a",
    badgeBg: "rgba(192,122,106,0.06)",
    trigger: "Client health drops below 60",
    action: "Flag for review + send check-in",
    status: "watching",
    statusColor: "#b07d4f",
  },
];

export default function AutomationBlock({ block }: { block: RenderBlock }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Automations</span>
        <span className={styles.count}>{RULES.length} rules</span>
        <button className={styles.addBtn}>+ Add Rule</button>
      </div>

      <div className={styles.rules}>
        {RULES.map((r, i) => (
          <div key={i} className={styles.rule}>
            <div
              className={styles.ruleBadge}
              style={{ color: r.badgeColor, background: r.badgeBg }}
            >
              {r.icon}
            </div>
            <div className={styles.ruleInfo}>
              <div className={styles.ruleTrigger}>{r.trigger}</div>
              <div className={styles.ruleAction}>{r.action}</div>
            </div>
            <span
              className={styles.ruleStatus}
              style={{
                color: r.statusColor,
                borderColor: r.statusColor + "15",
                background: r.statusColor + "06",
              }}
            >
              {r.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
