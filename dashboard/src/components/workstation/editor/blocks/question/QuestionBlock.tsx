"use client";

import type { QuestionData } from "@/lib/types";
import styles from "./QuestionBlock.module.css";

export function getDefaultQuestion(): QuestionData {
  return { question: "", assignee: "", answered: false, answer: "" };
}

export default function QuestionBlock({ data, onChange }: { data: QuestionData; onChange: (d: QuestionData) => void }) {
  return (
    <div className={`${styles.question} ${data.answered ? styles.questionAnswered : ""}`}>
      <div className={styles.questionHeader}>
        <div className={styles.questionIcon}>?</div>
        <span className={styles.questionLabel}>Question</span>
        {data.assignee && <span className={styles.questionAssignee}>for {data.assignee}</span>}
        {data.answered && <span className={styles.questionAnswerBadge}>Answered</span>}
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="What's the question?" value={data.question} onChange={e => onChange({ ...data, question: e.target.value })} style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }} />
        <input className={styles.blockInput} placeholder="Assign to (e.g. client name)" value={data.assignee} onChange={e => onChange({ ...data, assignee: e.target.value })} style={{ fontSize: 13 }} />
        {data.answered && data.answer && (
          <div className={styles.questionAnswer}>
            <div className={styles.questionAnswerLabel}>Answer</div>
            <div style={{ fontSize: 14, color: "var(--ink-700)" }}>{data.answer}</div>
          </div>
        )}
        {!data.answered && (
          <div className={styles.blockActions}>
            <textarea className={styles.blockTextarea} placeholder="Type an answer..." value={data.answer} onChange={e => onChange({ ...data, answer: e.target.value })} />
          </div>
        )}
        <div className={styles.blockActions}>
          <button className={styles.blockBtn} onClick={() => onChange({ ...data, answered: !data.answered })}>
            {data.answered ? "Reopen" : "Mark Answered"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { QuestionBlock };
