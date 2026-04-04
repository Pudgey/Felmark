"use client";

import styles from "./SignalsPane.module.css";

const SIGNAL_DATA = [
  {
    av: "MS",
    title: "Invoice #044 viewed",
    desc: "Sarah stayed 2m 14s on payment page",
    time: "3m",
    avatarTone: "slate" as const,
    urgentTone: "red" as const,
    primaryAction: { label: "Follow up", tone: "follow" as const },
    secondaryAction: "Dismiss",
  },
  {
    av: "AC",
    title: "Contract signed",
    desc: "Aster & Co. completed signature",
    time: "18m",
    avatarTone: "money" as const,
    primaryAction: { label: "Send invoice", tone: "invoice" as const },
  },
  {
    av: "NK",
    title: "No reply in 46 hours",
    desc: "Nora Kim \u00b7 feedback window narrowing",
    time: "46h",
    avatarTone: "warning" as const,
    urgentTone: "amber" as const,
    primaryAction: { label: "Send nudge", tone: "nudge" as const },
    secondaryAction: "Snooze",
  },
  {
    av: "NK",
    title: "Payment received",
    amount: "$2,200",
    desc: "Invoice #045 closed \u00b7 deposited",
    time: "2h",
    avatarTone: "money" as const,
  },
  {
    av: "LB",
    title: "Proposal opened",
    desc: "Luna Boutique viewed 4 pages \u00b7 3m read time",
    time: "1h",
    avatarTone: "info" as const,
    primaryAction: { label: "Follow up", tone: "follow" as const },
  },
];

export default function SignalsPane() {
  return (
    <div className={styles.signals}>
      {SIGNAL_DATA.map((signal) => (
        <div
          key={`${signal.av}-${signal.title}`}
          className={`${styles.signalCard} ${signal.urgentTone ? styles.signalUrgent : ""} ${signal.urgentTone === "red" ? styles.signalUrgentRed : ""} ${signal.urgentTone === "amber" ? styles.signalUrgentAmber : ""}`}
        >
          <div className={styles.signalTop}>
            <div className={`${styles.signalAvatar} ${styles[`signalAvatar${signal.avatarTone.charAt(0).toUpperCase()}${signal.avatarTone.slice(1)}`]}`}>{signal.av}</div>
            <div className={styles.signalBody}>
              <div className={styles.signalTitleRow}>
                <span className={styles.signalTitle}>
                  {signal.title}
                  {signal.amount && <span className={styles.signalAmount}>{signal.amount}</span>}
                </span>
              </div>
              <div className={styles.signalDesc}>{signal.desc}</div>
            </div>
            <span className={styles.signalTime}>{signal.time}</span>
          </div>

          {(signal.primaryAction || signal.secondaryAction) && (
            <div className={styles.signalActions}>
              {signal.primaryAction && <button className={`${styles.signalBtn} ${styles[`signalBtn${signal.primaryAction.tone.charAt(0).toUpperCase()}${signal.primaryAction.tone.slice(1)}`]}`}>{signal.primaryAction.label}</button>}
              {signal.secondaryAction && <button className={`${styles.signalBtn} ${styles.signalBtnGhost}`}>{signal.secondaryAction}</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
