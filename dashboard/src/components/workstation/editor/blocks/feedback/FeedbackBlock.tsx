"use client";

import type { FeedbackData } from "@/lib/types";
import styles from "./FeedbackBlock.module.css";

export function getDefaultFeedback(): FeedbackData {
  return { description: "", reviewer: "", dueDate: null, status: "pending", comments: "" };
}

const FEEDBACK_STATUSES: { value: FeedbackData["status"]; label: string; style: string }[] = [
  { value: "pending", label: "Pending", style: styles.feedbackStatusPending },
  { value: "in-progress", label: "In Progress", style: styles.feedbackStatusInProgress },
  { value: "approved", label: "Approved", style: styles.feedbackStatusApproved },
  { value: "changes-requested", label: "Changes Requested", style: styles.feedbackStatusChanges },
];

export default function FeedbackBlock({ data, onChange }: { data: FeedbackData; onChange: (d: FeedbackData) => void }) {
  const statusCfg = FEEDBACK_STATUSES.find(s => s.value === data.status) || FEEDBACK_STATUSES[0];

  return (
    <div className={styles.feedback}>
      <div className={styles.feedbackHeader}>
        <div className={styles.feedbackIcon}>{"\u21BA"}</div>
        <span className={styles.feedbackLabel}>Feedback Request</span>
        <span className={`${styles.feedbackStatus} ${statusCfg.style}`}>{statusCfg.label}</span>
      </div>
      <div className={styles.blockBody}>
        <div className={styles.feedbackRow}>
          <div className={styles.feedbackField}>
            <span className={styles.feedbackFieldLabel}>Reviewer</span>
            <input className={styles.blockInput} placeholder="Who should review?" value={data.reviewer} onChange={e => onChange({ ...data, reviewer: e.target.value })} />
          </div>
          <div className={styles.feedbackField}>
            <span className={styles.feedbackFieldLabel}>Due</span>
            <input className={styles.blockInput} type="date" value={data.dueDate || ""} onChange={e => onChange({ ...data, dueDate: e.target.value || null })} />
          </div>
        </div>
        <textarea className={styles.blockTextarea} placeholder="What needs feedback?" value={data.description} onChange={e => onChange({ ...data, description: e.target.value })} />
        <div className={styles.blockActions}>
          {FEEDBACK_STATUSES.map(s => (
            <button key={s.value} className={`${styles.blockBtn} ${styles.blockBtnSmall} ${data.status === s.value ? styles.blockBtnPrimary : ""}`} onClick={() => onChange({ ...data, status: s.value })}>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { FeedbackBlock };
