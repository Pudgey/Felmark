"use client";

import type { TimelineBlockData } from "@/lib/types";
import styles from "./TimelineBlock.module.css";

export function getDefaultTimeline(): TimelineBlockData {
  return {
    title: "Brand Guidelines v2 Timeline",
    phases: [
      {
        label: "Discovery",
        date: "Mar 1 - 7",
        status: "done",
        items: ["Client questionnaire", "Competitor audit", "Mood board review"],
        color: "var(--success)",
      },
      {
        label: "Concept",
        date: "Mar 8 - 18",
        status: "done",
        items: ["3 logo directions", "Color palette exploration", "Typography shortlist"],
        color: "var(--success)",
      },
      {
        label: "Design",
        date: "Mar 19 - 28",
        status: "current",
        items: ["Primary logo refinement", "Brand board assembly", "Collateral templates"],
        color: "var(--ember)",
      },
      {
        label: "Review",
        date: "Mar 29 - Apr 3",
        status: "upcoming",
        items: ["Client presentation", "Revision round 1", "Final sign-off"],
        color: "var(--muted)",
      },
      {
        label: "Deliver",
        date: "Apr 4 - 7",
        status: "upcoming",
        items: ["Export all assets", "Style guide PDF", "Handoff meeting"],
        color: "var(--muted)",
      },
    ],
  };
}

export default function TimelineBlock({
  data,
  onChange,
}: {
  data: TimelineBlockData;
  onChange: (d: TimelineBlockData) => void;
}) {
  const toggleItem = (phaseIdx: number, itemIdx: number) => {
    const phases = data.phases.map((p, pi) => {
      if (pi !== phaseIdx) return p;
      const items = [...p.items];
      if (items[itemIdx].startsWith("[x] ")) {
        items[itemIdx] = items[itemIdx].slice(4);
      } else {
        items[itemIdx] = "[x] " + items[itemIdx];
      }
      return { ...p, items };
    });
    onChange({ ...data, phases });
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineIcon}>&#x23F1;</div>
        <span className={styles.timelineLabel}>Timeline</span>
        <span className={styles.blockMeta}>{data.phases.length} phases</span>
      </div>
      <div className={styles.timelineBody}>
        <div className={styles.timelinePhases}>
          {data.phases.map((phase, pi) => {
            const dotClass =
              phase.status === "done"
                ? styles.timelineDotDone
                : phase.status === "current"
                  ? styles.timelineDotCurrent
                  : styles.timelineDotUpcoming;
            const phaseClass = phase.status === "upcoming" ? styles.timelinePhaseUpcoming : "";
            return (
              <div key={pi} className={`${styles.timelinePhase} ${phaseClass}`}>
                <div className={`${styles.timelineDot} ${dotClass}`}>{phase.status === "done" && "\u2713"}</div>
                <div className={styles.timelineLine} />
                <span className={styles.timelinePhaseLabel}>{phase.label}</span>
                <span className={styles.timelinePhaseDate}>{phase.date}</span>
                <ul className={styles.timelineItems}>
                  {phase.items.map((item, ii) => {
                    const isDone = item.startsWith("[x] ");
                    const text = isDone ? item.slice(4) : item;
                    return (
                      <li key={ii} className={styles.timelineItem} onClick={() => toggleItem(pi, ii)}>
                        <span className={`${styles.timelineItemCheck} ${isDone ? styles.timelineItemCheckDone : ""}`}>
                          {isDone && "\u2713"}
                        </span>
                        <span className={`${styles.timelineItemText} ${isDone ? styles.timelineItemTextDone : ""}`}>
                          {text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { TimelineBlock };
