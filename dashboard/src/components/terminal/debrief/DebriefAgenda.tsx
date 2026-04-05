"use client";

import { useMemo } from "react";
import { useTerminalContext } from "../TerminalProvider";
import styles from "./debrief.module.css";

interface DebriefAgendaProps {
  onRunCommand: (cmd: string) => void;
}

interface AgendaItem {
  badge: "OVERDUE" | "TODAY" | string;
  title: string;
  client: string;
  context: string;
  estimate: string;
  cmd: string;
  progress: [number, number]; // [filled, total]
}

const DEMO_ITEMS: AgendaItem[] = [
  {
    badge: "OVERDUE",
    title: "Client review & revisions",
    client: "Meridian",
    context: "Overdue since Apr 1. 3 subtasks: address color feedback, revise, sign-off.",
    estimate: "~2 hr",
    cmd: "/timer start meridian",
    progress: [1, 3],
  },
  {
    badge: "TODAY",
    title: "Color palette & typography",
    client: "Meridian",
    context: "Due today. 2/4 subtasks done. 3h 12m logged. Continue.",
    estimate: "~3 hr",
    cmd: '/timer start meridian "palette"',
    progress: [2, 3],
  },
  {
    badge: "TODAY",
    title: "Follow up on Invoice #044",
    client: "\u2014",
    context: "Sarah viewed 3\u00d7, no payment. Day 4 of avg 6-day cycle. Gentle nudge.",
    estimate: "~5 min",
    cmd: "/invoice nudge 044",
    progress: [3, 3],
  },
  {
    badge: "3 DAYS",
    title: "Reply to Nora Kim",
    client: "Nora",
    context: "46h no reply. Feedback window closing.",
    estimate: "~10 min",
    cmd: "/client nora",
    progress: [2, 3],
  },
  {
    badge: "3 DAYS",
    title: "Scope check \u2014 Bolt Fitness",
    client: "Bolt",
    context: "$4k overdue, 18h unscoped work. Have the conversation.",
    estimate: "~15 min",
    cmd: "/scope bolt",
    progress: [0, 3],
  },
];

const AI_INSIGHT =
  "Nudge Sarah on Invoice #044 first \u2014 highest conversion probability. Then tackle the Meridian review, it\u2019s blocking everything downstream. Bolt Fitness needs a scope conversation before more hours.";

function formatDateHeader(): string {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const month = now.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const date = now.getDate();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} ${month} ${date} \u00b7 ${time}`;
}

function badgeClass(badge: string): string {
  const upper = badge.toUpperCase();
  if (upper === "OVERDUE") return styles.agendaBadgeOverdue;
  if (upper === "TODAY") return styles.agendaBadgeToday;
  return styles.agendaBadgeDefault;
}

function ProgressBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div className={styles.agendaProgressBar}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={i < filled ? styles.agendaProgressFilled : styles.agendaProgressEmpty} />
      ))}
    </div>
  );
}

export default function DebriefAgenda({ onRunCommand }: DebriefAgendaProps) {
  const { workstations } = useTerminalContext();

  // Use real client names if workstations exist
  const items = useMemo(() => {
    if (!workstations || workstations.length === 0) return DEMO_ITEMS;

    // Map demo client names to real workstation names where possible
    const clientNames = workstations.map((ws) => ws.client).filter(Boolean);
    if (clientNames.length === 0) return DEMO_ITEMS;

    return DEMO_ITEMS.map((item, idx) => {
      if (item.client === "\u2014") return item;
      const realName = clientNames[idx % clientNames.length];
      return { ...item, client: realName || item.client };
    });
  }, [workstations]);

  const totalEstimate = "~6 hr";

  return (
    <div className={styles.debrief}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className={styles.mark} style={{ fontSize: 16 }}>
          &#9670;
        </span>
        <span className={styles.dateHeader}>{formatDateHeader()}</span>
      </div>

      <div>
        <div className={styles.agendaTitle}>Today&apos;s agenda</div>
        <div className={styles.agendaSubtitle}>Sorted by urgency &times; impact. Top item first.</div>
      </div>

      <div className={styles.agendaItems}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.agendaItem}>
            <span className={`${styles.agendaNum} ${idx === 0 ? styles.agendaNumFirst : ""}`}>{idx + 1}</span>
            <div className={styles.agendaItemBody}>
              <div className={styles.agendaItemHeader}>
                <span className={`${styles.agendaBadge} ${badgeClass(item.badge)}`}>{item.badge}</span>
                <span className={styles.agendaItemTitle}>{item.title}</span>
                <span className={styles.agendaClient}>{item.client}</span>
                <ProgressBar filled={item.progress[0]} total={item.progress[1]} />
              </div>
              <div className={styles.agendaContext}>{item.context}</div>
              <div className={styles.agendaItemMeta}>
                <span className={styles.agendaTime}>{item.estimate}</span>
                <button className={styles.agendaCmd} onClick={() => onRunCommand(item.cmd)}>
                  {item.cmd}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.aiInsight}>
        <span className={styles.aiLabel}>&#10022; forge</span>
        {AI_INSIGHT}
      </div>

      <div className={styles.summaryFooter}>
        {items.length} items &middot; {totalEstimate} estimated
      </div>
    </div>
  );
}
