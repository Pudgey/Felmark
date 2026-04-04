"use client";

import { useState } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import styles from "./ListPane.module.css";

const TASKS = [
  { id: "t0", title: "Client review & revisions", client: "Meridian", due: "Apr 1", status: "overdue" as const, pri: "urgent" as const, logged: "1.5h", est: "4h", subs: 3, subsDone: 0 },
  { id: "t1", title: "Color palette & typography", client: "Meridian", due: "Apr 2", status: "active" as const, pri: "high" as const, logged: "3h", est: "6h", subs: 4, subsDone: 2, timer: true },
  { id: "t2", title: "Blog post #1 draft", client: "Bolt Fitness", due: "Apr 3", status: "active" as const, pri: "medium" as const, logged: "4h", est: "6h", subs: 3, subsDone: 1 },
  { id: "t3", title: "Brand guidelines document", client: "Meridian", due: "Apr 5", status: "todo" as const, pri: "medium" as const, logged: "0h", est: "16h", subs: 6, subsDone: 0 },
  { id: "t4", title: "Landing page wireframes", client: "Nora Kim", due: "Apr 8", status: "todo" as const, pri: "medium" as const, logged: "0h", est: "10h", subs: 4, subsDone: 0 },
];

const CLIENT_MAP: Record<string, { id: string; name: string; av: string; color: string }> = {
  Meridian: { id: "c1", name: "Meridian Studio", av: "MS", color: "#7c8594" },
  "Bolt Fitness": { id: "c3", name: "Bolt Fitness", av: "BF", color: "#8a7e63" },
  "Nora Kim": { id: "c2", name: "Nora Kim", av: "NK", color: "#a08472" },
};

export default function WorkPane() {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("t1");
  const nav = useWorkspaceNav();

  const openClientHub = (clientKey: string) => {
    const client = CLIENT_MAP[clientKey];
    if (client) {
      nav.openHub({ clientId: client.id, clientName: client.name, clientAvatar: client.av, clientColor: client.color });
    }
  };

  return (
    <div>
      {TASKS.map((task) => {
        const expanded = expandedTaskId === task.id;

        return (
          <div key={task.id} className={`${styles.row} ${task.status === "overdue" ? styles.rowOv : ""} ${expanded ? styles.rowOn : ""}`}>
            <div className={styles.rowMain} onClick={() => setExpandedTaskId(expanded ? null : task.id)}>
              <div className={`${styles.priLine} ${styles[task.pri]}`} />
              <div className={styles.rowInfo}>
                <div className={styles.rowNameWrap}>
                  <span className={styles.rowName}>{task.title}</span>
                  {task.timer && <span className={styles.timerTag}>&#9679; 1:22</span>}
                </div>
                <span className={styles.rowMeta}>{task.client}{task.subs > 0 ? ` \u00b7 ${task.subsDone}/${task.subs}` : ""}</span>
              </div>
              <span className={`${styles.rowMono} ${styles.sm} ${task.status === "overdue" ? styles.ov : ""}`}>{task.due}</span>
              <span className={`${styles.rowMono} ${styles.sm} ${styles.dim}`}>{task.logged}<span className={styles.dim2}>/{task.est}</span></span>
              <span className={styles.chev}>{expanded ? "\u25be" : "\u203a"}</span>
            </div>

            {expanded && (
              <div className={styles.rowExp}>
                <div className={styles.expRow}>
                  <div className={styles.expKv}><span className={styles.expL}>Priority</span><span className={styles.expV}>{task.pri}</span></div>
                  <div className={styles.expKv}><span className={styles.expL}>Time</span><span className={styles.expV}>{task.logged} / {task.est}</span></div>
                  {task.subs > 0 && <div className={styles.expKv}><span className={styles.expL}>Subtasks</span><span className={styles.expV}>{task.subsDone}/{task.subs}</span></div>}
                </div>
                <div className={styles.expActions}>
                  {!task.timer && <button className={styles.btn}>&#9654; Timer</button>}
                  {task.timer && <button className={`${styles.btn} ${styles.btnTimer}`}>&#9632; Stop</button>}
                  <button className={styles.btn}>+ Subtask</button>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={(event) => { event.stopPropagation(); openClientHub(task.client); }}>Open Hub {"\u2192"}</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
