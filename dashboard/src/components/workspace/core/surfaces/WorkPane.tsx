"use client";

import { useState } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import styles from "./WorkPane.module.css";

type TaskStatus = "overdue" | "active" | "todo";
type TaskPriority = "urgent" | "high" | "medium" | "low";

interface TaskSubtask {
  title: string;
  done?: boolean;
}

interface Task {
  id: string;
  title: string;
  clientKey: keyof typeof CLIENT_MAP;
  clientLabel: string;
  due: string;
  status: TaskStatus;
  priority: TaskPriority;
  logged: string;
  estimate: string;
  progressColor: string;
  subtasks: TaskSubtask[];
  timer?: {
    inline: string;
    full: string;
    rate: string;
  };
}

const TASKS: Task[] = [
  {
    id: "t1",
    title: "Client review & revisions",
    clientKey: "Meridian",
    clientLabel: "Meridian",
    due: "Apr 1",
    status: "overdue",
    priority: "urgent",
    logged: "1.5h",
    estimate: "4h",
    progressColor: "#ef5350",
    subtasks: [
      { title: "Address color feedback" },
      { title: "Revise teal -> warmer" },
      { title: "CEO sign-off" },
    ],
  },
  {
    id: "t2",
    title: "Color palette & typography",
    clientKey: "Meridian",
    clientLabel: "Meridian",
    due: "Apr 2",
    status: "active",
    priority: "high",
    logged: "3h 12m",
    estimate: "6h",
    progressColor: "#26a69a",
    timer: {
      inline: "1:22",
      full: "1:22:14",
      rate: "$120/hr · $164",
    },
    subtasks: [
      { title: "Primary palette", done: true },
      { title: "Secondary & accents" },
      { title: "Heading fonts", done: true },
      { title: "Body & mono" },
    ],
  },
  {
    id: "t3",
    title: "Blog post #1 draft",
    clientKey: "Bolt Fitness",
    clientLabel: "Bolt",
    due: "Apr 3",
    status: "active",
    priority: "medium",
    logged: "4h",
    estimate: "6h",
    progressColor: "#2962ff",
    subtasks: [
      { title: "Outline approved", done: true },
      { title: "Draft body" },
      { title: "CTA section" },
    ],
  },
  {
    id: "t4",
    title: "Brand guidelines document",
    clientKey: "Meridian",
    clientLabel: "Meridian",
    due: "Apr 5",
    status: "todo",
    priority: "medium",
    logged: "0h",
    estimate: "16h",
    progressColor: "#2962ff",
    subtasks: [
      { title: "Logo usage" },
      { title: "Color system" },
      { title: "Typography" },
      { title: "Voice" },
      { title: "Examples" },
      { title: "Export deck" },
    ],
  },
  {
    id: "t5",
    title: "Landing page wireframes",
    clientKey: "Nora Kim",
    clientLabel: "Nora",
    due: "Apr 8",
    status: "todo",
    priority: "low",
    logged: "0h",
    estimate: "10h",
    progressColor: "#a5a49f",
    subtasks: [
      { title: "Hero layout" },
      { title: "Proof block" },
      { title: "Offer section" },
      { title: "Footer layout" },
    ],
  },
];

const CLIENT_MAP = {
  Meridian: { id: "c1", name: "Meridian Studio", avatar: "MS", color: "#7c8594" },
  "Bolt Fitness": { id: "c3", name: "Bolt Fitness", avatar: "BF", color: "#8a7e63" },
  "Nora Kim": { id: "c2", name: "Nora Kim", avatar: "NK", color: "#a08472" },
} as const;

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  urgent: styles.taskPriorityUrgent,
  high: styles.taskPriorityHigh,
  medium: styles.taskPriorityMedium,
  low: styles.taskPriorityLow,
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function formatHours(task: Task) {
  return `${task.logged}/${task.estimate}`;
}

function getCompletedCount(task: Task) {
  return task.subtasks.filter((subtask) => subtask.done).length;
}

function getProgressPercent(task: Task) {
  if (task.subtasks.length === 0) return 0;
  return Math.round((getCompletedCount(task) / task.subtasks.length) * 100);
}

export default function WorkPane() {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>("t2");
  const nav = useWorkspaceNav();

  const openClientHub = (clientKey: keyof typeof CLIENT_MAP) => {
    const client = CLIENT_MAP[clientKey];
    nav.openHub({
      clientId: client.id,
      clientName: client.name,
      clientAvatar: client.avatar,
      clientColor: client.color,
    });
  };

  return (
    <div className={styles.work}>
      {TASKS.map((task) => {
        const isExpanded = expandedTaskId === task.id;
        const completedCount = getCompletedCount(task);
        const progressPercent = getProgressPercent(task);

        return (
          <div key={task.id}>
            <div
              className={[
                styles.taskRow,
                task.status === "overdue" ? styles.taskRowOverdue : "",
                isExpanded || task.timer ? styles.taskRowExpanded : "",
              ].join(" ").trim()}
              onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            >
              <div className={`${styles.taskPriority} ${PRIORITY_CLASS[task.priority]}`} />
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={styles.taskClient}>{task.clientLabel}</span>
              <span className={styles.taskSubs}>{completedCount}/{task.subtasks.length}</span>
              {task.timer ? (
                <span className={styles.taskTimerInline}>
                  <span className={styles.taskTimerDot} />
                  {task.timer.inline}
                </span>
              ) : null}
              <span className={styles.taskDue}>{task.due}</span>
              <span className={styles.taskHours}>{formatHours(task)}</span>
              <div className={styles.taskProgress}>
                <div className={styles.taskProgressFill} style={{ width: `${progressPercent}%`, background: task.progressColor }} />
              </div>
            </div>

            {isExpanded ? (
              <div className={styles.taskExpand}>
                <div className={styles.taskExpandBody}>
                  {task.timer ? (
                    <div className={styles.taskTimerBar}>
                      <span className={styles.taskTimerDot} />
                      <span className={styles.taskTimerValue}>{task.timer.full}</span>
                      <span className={styles.taskTimerRate}>{task.timer.rate}</span>
                      <button type="button" className={`${styles.taskAction} ${styles.taskActionGreen}`}>
                        ■ Stop
                      </button>
                    </div>
                  ) : null}

                  <div className={styles.taskFields}>
                    {task.status === "overdue" ? (
                      <div className={styles.taskField}>
                        <span className={styles.taskFieldLabel}>Status</span>
                        <span className={`${styles.taskPill} ${styles.taskPillOverdue}`}>Overdue</span>
                      </div>
                    ) : null}

                    <div className={styles.taskField}>
                      <span className={styles.taskFieldLabel}>Priority</span>
                      <span
                        className={[
                          styles.taskPill,
                          task.priority === "urgent"
                            ? styles.taskPillUrgent
                            : task.priority === "high"
                              ? styles.taskPillHigh
                              : task.timer
                                ? styles.taskPillActive
                                : styles.taskPillHigh,
                        ].join(" ")}
                      >
                        {PRIORITY_LABEL[task.priority]}
                      </span>
                    </div>

                    <div className={styles.taskField}>
                      <span className={styles.taskFieldLabel}>Client</span>
                      <span className={styles.taskFieldValue}>{task.clientLabel}</span>
                    </div>

                    <div className={styles.taskField}>
                      <span className={styles.taskFieldLabel}>Time</span>
                      <span
                        className={[
                          styles.taskFieldValue,
                          styles.taskFieldValueMono,
                          task.timer ? styles.taskFieldValueTimer : "",
                        ].join(" ").trim()}
                      >
                        {task.logged} / {task.estimate}
                      </span>
                    </div>

                    <div className={styles.taskField}>
                      <span className={styles.taskFieldLabel}>Due</span>
                      <span className={`${styles.taskFieldValue} ${styles.taskFieldValueMono}`}>{task.due}</span>
                    </div>
                  </div>

                  <div className={styles.taskSubsWrap}>
                    <div className={styles.taskSubsHeader}>
                      <span className={styles.taskSubsLabel}>Subtasks</span>
                      <div className={styles.taskPbar}>
                        <div className={styles.taskPbarFill} style={{ width: `${progressPercent}%` }} />
                      </div>
                      <span className={styles.taskProgressCount}>{completedCount}/{task.subtasks.length}</span>
                    </div>

                    {task.subtasks.map((subtask) => (
                      <div key={subtask.title} className={`${styles.taskSubtask} ${subtask.done ? styles.taskSubtaskDone : ""}`}>
                        <span className={`${styles.taskCheckbox} ${subtask.done ? styles.taskCheckboxDone : ""}`}>
                          {subtask.done ? "✓" : ""}
                        </span>
                        <span className={styles.taskSubtaskText}>{subtask.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.taskActions}>
                    {task.timer ? (
                      <button type="button" className={`${styles.taskAction} ${styles.taskActionGreen}`}>
                        ■ Stop Timer
                      </button>
                    ) : (
                      <button type="button" className={styles.taskNeutralAction}>
                        ▶ Start Timer
                      </button>
                    )}

                    <button type="button" className={styles.taskNeutralAction}>
                      + Subtask
                    </button>

                    <button
                      type="button"
                      className={`${styles.taskAction} ${styles.taskActionPrimary}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        openClientHub(task.clientKey);
                      }}
                    >
                      Open Hub →
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
