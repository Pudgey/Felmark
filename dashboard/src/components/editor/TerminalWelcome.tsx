"use client";

import { useState, useEffect } from "react";
import styles from "./TerminalWelcome.module.css";

interface StatusLine {
  type: "greeting" | "blank" | "section" | "stat" | "alert" | "event" | "comment" | "prompt";
  text?: string;
  label?: string;
  value?: string;
  color?: string;
  icon?: string;
  time?: string;
  author?: string;
  authorColor?: string;
  delay: number;
}

const QUICK_ACTIONS = [
  { id: "cmd-palette", label: "Command palette", shortcut: "⌘K", icon: "⌕" },
  { id: "new-doc", label: "New document", shortcut: "+", icon: "◆" },
  { id: "new-workspace", label: "New workspace", shortcut: "", icon: "→" },
];

function TypingLine({ text, speed = 18, delay = 0, onDone }: { text: string; speed?: number; delay?: number; onDone?: () => void }) {
  const [chars, setChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || !text) { if (started) onDone?.(); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setChars(i);
      if (i >= text.length) { clearInterval(interval); onDone?.(); }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed, onDone]);

  if (!started) return null;
  return <>{text.slice(0, chars)}</>;
}

interface TerminalWelcomeProps {
  activeCount: number;
  reviewCount: number;
  overdueCount: number;
  totalEarned: number;
  totalPending: number;
  pipeline: number;
  onOpenCmdPalette?: () => void;
  onNewDoc?: () => void;
  onNewWorkspace?: () => void;
}

export default function TerminalWelcome({ activeCount, reviewCount, overdueCount, totalEarned, totalPending, pipeline, onOpenCmdPalette, onNewDoc, onNewWorkspace }: TerminalWelcomeProps) {
  const STATUS_LINES: StatusLine[] = [
    { type: "greeting", text: "", delay: 0 },
    { type: "blank", delay: 0 },
    { type: "section", text: "STATUS", delay: 200 },
    { type: "stat", label: "active projects", value: String(activeCount), color: "#5a9a3c", delay: 400 },
    { type: "stat", label: "in review", value: String(reviewCount), color: "#b07d4f", delay: 550 },
    { type: "stat", label: "overdue", value: String(overdueCount), color: overdueCount > 0 ? "#c24b38" : "var(--ink-400)", delay: 700 },
    { type: "blank", delay: 800 },
    { type: "section", text: "REVENUE", delay: 900 },
    { type: "stat", label: "earned this month", value: `$${(totalEarned / 1000).toFixed(1)}k`, color: "#5a9a3c", delay: 1050 },
    { type: "stat", label: "pending payment", value: `$${(totalPending / 1000).toFixed(1)}k`, color: "#b07d4f", delay: 1200 },
    { type: "stat", label: "total pipeline", value: `$${(pipeline / 1000).toFixed(1)}k`, color: "var(--ink-800)", delay: 1350 },
    { type: "blank", delay: 1450 },
    { type: "section", text: "ATTENTION", delay: 1550 },
    { type: "alert", icon: "!", text: "Bolt Fitness — App Onboarding UX is 4 days overdue", color: "#c24b38", delay: 1700 },
    { type: "alert", icon: "→", text: "Brand Guidelines v2 — due in 5 days (65% complete)", color: "#b07d4f", delay: 1900 },
    { type: "alert", icon: "$", text: "Invoice #047 — $2,400 sent, awaiting payment", color: "#5a9a3c", delay: 2100 },
    { type: "blank", delay: 2250 },
    { type: "section", text: "RECENT COMMENTS", delay: 2350 },
    { type: "comment", author: "Sarah Chen", authorColor: "#8a7e63", text: "Can we make the logo usage section more specific?", time: "2m ago", delay: 2500 },
    { type: "comment", author: "Jamie Park", authorColor: "#7c8594", text: "I'd suggest adding a 'don't' section with misuse examples.", time: "15m ago", delay: 2700 },
    { type: "blank", delay: 2850 },
    { type: "section", text: "TODAY", delay: 2950 },
    { type: "event", time: "09:00", text: "Brand review call — Meridian Studio", delay: 3100 },
    { type: "event", time: "11:30", text: "Now — deep work block", delay: 3250 },
    { type: "event", time: "14:00", text: "Nora kickoff call — Course Landing Page", delay: 3400 },
    { type: "blank", delay: 3550 },
    { type: "prompt", text: "Ready when you are.", delay: 3650 },
  ];

  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";

  useEffect(() => {
    STATUS_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => new Set([...prev, i]));
        if (i === STATUS_LINES.length - 1) {
          setTimeout(() => setAllRevealed(true), 600);
        }
      }, line.delay);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = (id: string) => {
    if (id === "cmd-palette") onOpenCmdPalette?.();
    else if (id === "new-doc") onNewDoc?.();
    else if (id === "new-workspace") onNewWorkspace?.();
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        {STATUS_LINES.map((line, i) => {
          if (!visibleLines.has(i)) return null;

          if (line.type === "greeting") {
            return (
              <div key={i} className={styles.greeting}>
                <TypingLine text={`${greeting}. `} speed={30} delay={100} />
                <em className={styles.greetingEm}><TypingLine text="let's build." speed={40} delay={600} /></em>
              </div>
            );
          }

          if (line.type === "blank") return <div key={i} style={{ height: 8 }} />;

          if (line.type === "section") {
            return <div key={i} className={styles.section}>{line.text}</div>;
          }

          if (line.type === "stat") {
            return (
              <div key={i} className={styles.stat}>
                <span className={styles.statLabel}>{line.label}</span>
                <span className={styles.statVal} style={{ color: line.color }}>{line.value}</span>
              </div>
            );
          }

          if (line.type === "alert") {
            return (
              <div key={i} className={styles.alert}>
                <div className={styles.alertIcon} style={{ background: (line.color || "#b07d4f") + "10", color: line.color }}>{line.icon}</div>
                <span className={styles.alertText}>{line.text}</span>
              </div>
            );
          }

          if (line.type === "comment") {
            return (
              <div key={i} className={styles.comment}>
                <div className={styles.commentAv} style={{ background: line.authorColor }}>{line.author?.[0]}</div>
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>{line.author}</span>
                    <span className={styles.commentTime}>{line.time}</span>
                  </div>
                  <span className={styles.commentText}>{line.text}</span>
                </div>
              </div>
            );
          }

          if (line.type === "event") {
            const isNow = line.text?.startsWith("Now");
            return (
              <div key={i} className={`${styles.event} ${isNow ? styles.eventNow : ""}`}>
                <span className={styles.eventTime}>{line.time}</span>
                <span className={styles.eventDot} />
                <span className={styles.eventText}>{line.text}</span>
              </div>
            );
          }

          if (line.type === "prompt") {
            return (
              <div key={i} className={styles.promptText}>
                <TypingLine text={line.text || ""} speed={25} delay={200} />
              </div>
            );
          }

          return null;
        })}

        {/* Input */}
        {allRevealed && (
          <div className={styles.actionsArea}>
            {QUICK_ACTIONS.map(a => (
              <button key={a.id} className={styles.actionBtn} onClick={() => handleAction(a.id)}>
                <span className={styles.actionIcon}>{a.icon}</span>
                <span className={styles.actionLabel}>{a.label}</span>
                {a.shortcut && <span className={styles.actionShortcut}>{a.shortcut}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
