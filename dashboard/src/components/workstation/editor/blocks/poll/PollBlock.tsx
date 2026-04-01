"use client";

import { useState } from "react";
import type { PollData } from "@/lib/types";
import styles from "./PollBlock.module.css";

export function getDefaultPoll(): PollData {
  return { question: "", options: [{ id: "o1", label: "Option A", votes: 0 }, { id: "o2", label: "Option B", votes: 0 }], closed: false, totalVotes: 0 };
}

export default function PollBlock({ data, onChange }: { data: PollData; onChange: (d: PollData) => void }) {
  const [voted, setVoted] = useState<string | null>(null);
  const maxVotes = Math.max(...data.options.map(o => o.votes), 1);

  const vote = (id: string) => {
    if (data.closed || voted) return;
    setVoted(id);
    const opts = data.options.map(o => o.id === id ? { ...o, votes: o.votes + 1 } : o);
    onChange({ ...data, options: opts, totalVotes: data.totalVotes + 1 });
  };

  const addOption = () => {
    onChange({ ...data, options: [...data.options, { id: `o${Date.now()}`, label: "", votes: 0 }] });
  };

  const updateLabel = (id: string, label: string) => {
    onChange({ ...data, options: data.options.map(o => o.id === id ? { ...o, label } : o) });
  };

  return (
    <div className={styles.poll}>
      <div className={styles.pollHeader}>
        <div className={styles.pollIcon}>{"\u25A3"}</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Poll</span>
        {data.closed && <span className={styles.pollClosed}>Closed</span>}
        <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} style={{ marginLeft: "auto" }} onClick={() => onChange({ ...data, closed: !data.closed })}>
          {data.closed ? "Reopen" : "Close Poll"}
        </button>
      </div>
      <div className={styles.blockBody}>
        <input className={styles.blockInput} placeholder="What's the question?" value={data.question} onChange={e => onChange({ ...data, question: e.target.value })} style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }} />
        {data.options.map(opt => {
          const pct = data.totalVotes > 0 ? Math.round((opt.votes / data.totalVotes) * 100) : 0;
          const isVoted = voted === opt.id;
          return (
            <div key={opt.id} className={styles.pollOption} onClick={() => vote(opt.id)}>
              <div className={`${styles.pollCheck} ${isVoted ? styles.pollCheckVoted : ""}`}>
                {isVoted && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <input className={styles.blockInput} placeholder="Option..." value={opt.label} onChange={e => { e.stopPropagation(); updateLabel(opt.id, e.target.value); }} onClick={e => e.stopPropagation()} style={{ flex: 1, fontSize: 14, padding: "6px 10px" }} />
              <div className={styles.pollBar}>
                <div className={styles.pollBarFill} style={{ width: `${pct}%`, background: isVoted ? "var(--ember)" : "var(--warm-200)" }} />
                {data.totalVotes > 0 && <span className={styles.pollBarPct}>{pct}%</span>}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <button className={`${styles.blockBtn} ${styles.blockBtnSmall}`} onClick={addOption}>+ Add option</button>
          <span className={styles.pollTotal}>{data.totalVotes} vote{data.totalVotes !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}

export { PollBlock };
