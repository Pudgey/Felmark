"use client";

import { useState, useEffect } from "react";
import type { DataChipsBlockData, DataChip, DataChipType, Workspace } from "@/lib/types";
import styles from "./DataChipsBlock.module.css";

interface DataChipsBlockProps {
  data: DataChipsBlockData;
  onUpdate: (data: DataChipsBlockData) => void;
  workspace?: Workspace | null;
  projectId?: string;
}

const CHIP_CATALOG: { type: DataChipType; label: string; icon: string; desc: string }[] = [
  { type: "revenue", label: "Revenue", icon: "$", desc: "Current month earnings" },
  { type: "deadline", label: "Deadline", icon: "⏱", desc: "Next project deadline" },
  { type: "status", label: "Status", icon: "●", desc: "Project status badge" },
  { type: "progress", label: "Progress", icon: "◎", desc: "Completion ring" },
  { type: "timer", label: "Timer", icon: "▶", desc: "Live running timer" },
  { type: "effective-rate", label: "Eff. Rate", icon: "↗", desc: "Your actual hourly rate" },
  { type: "hours", label: "Hours", icon: "#", desc: "Hours logged" },
  { type: "budget-burn", label: "Budget", icon: "█", desc: "Budget consumed" },
];

export function getDefaultDataChipsData(): DataChipsBlockData {
  return {
    chips: [
      { type: "progress", label: "Progress" },
      { type: "status", label: "Status" },
      { type: "deadline", label: "Deadline" },
    ],
  };
}

// Resolve live values from workspace/project context
function resolveChipValue(chip: DataChip, workspace?: Workspace | null, projectId?: string): { value: string; color: string; secondary?: string } {
  const project = workspace?.projects.find(p => p.id === projectId);

  switch (chip.type) {
    case "revenue": {
      const amount = project?.amount || "—";
      return { value: amount, color: "#5a9a3c" };
    }
    case "deadline": {
      if (!project?.due) return { value: "No deadline", color: "var(--ink-400)" };
      const due = new Date(project.due);
      const now = new Date();
      const days = Math.ceil((due.getTime() - now.getTime()) / 86400000);
      const label = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (days < 0) return { value: label, color: "#c24b38", secondary: `${Math.abs(days)}d overdue` };
      if (days <= 3) return { value: label, color: "#c89360", secondary: `${days}d left` };
      return { value: label, color: "var(--ink-600)", secondary: `${days}d left` };
    }
    case "status": {
      const status = project?.status || "active";
      const map: Record<string, { label: string; color: string }> = {
        active: { label: "Active", color: "#5a9a3c" },
        review: { label: "In Review", color: "#b07d4f" },
        completed: { label: "Completed", color: "#9b988f" },
        paused: { label: "Paused", color: "#7d7a72" },
        overdue: { label: "Overdue", color: "#c24b38" },
      };
      const s = map[status] || map.active;
      return { value: s.label, color: s.color };
    }
    case "progress": {
      const pct = project?.progress || 0;
      return { value: `${pct}%`, color: pct >= 60 ? "#5a9a3c" : pct >= 30 ? "#b07d4f" : "var(--ink-400)" };
    }
    case "timer": {
      return { value: "0:00:00", color: "#5a9a3c", secondary: "running" };
    }
    case "effective-rate": {
      return { value: "$105/hr", color: "#5b7fa4" };
    }
    case "hours": {
      return { value: "—", color: "var(--ink-600)" };
    }
    case "budget-burn": {
      const pct = project?.progress || 0;
      return { value: `${pct}%`, color: pct >= 80 ? "#c24b38" : pct >= 50 ? "#b07d4f" : "#5a9a3c", secondary: "of budget" };
    }
    default:
      return { value: "—", color: "var(--ink-400)" };
  }
}

function ProgressRing({ value, color, size = 16 }: { value: number; color: string; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--warm-200)" strokeWidth="2" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="2" strokeDasharray={circ} strokeDashoffset={offset} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />
    </svg>
  );
}

function BudgetBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className={styles.budgetBar}>
      <div className={styles.budgetFill} style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

function LiveTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, [running]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const display = `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  return (
    <span className={styles.timerWrap} onClick={e => { e.stopPropagation(); setRunning(r => !r); }}>
      <span className={`${styles.timerDot} ${running ? styles.timerDotOn : ""}`} />
      <span className={styles.chipVal} style={{ color: running ? "#5a9a3c" : "var(--ink-400)" }}>{display}</span>
    </span>
  );
}

function ChipRenderer({ chip, workspace, projectId }: { chip: DataChip; workspace?: Workspace | null; projectId?: string }) {
  const resolved = resolveChipValue(chip, workspace, projectId);

  return (
    <div className={styles.chip}>
      {chip.type === "progress" && <ProgressRing value={parseInt(resolved.value)} color={resolved.color} />}
      {chip.type === "status" && <span className={styles.chipDot} style={{ background: resolved.color }} />}
      {chip.type === "budget-burn" && <BudgetBar pct={parseInt(resolved.value)} color={resolved.color} />}
      {chip.type === "timer" ? (
        <LiveTimer />
      ) : (
        <>
          <span className={styles.chipLabel}>{chip.label}</span>
          <span className={styles.chipVal} style={{ color: resolved.color }}>{resolved.value}</span>
          {resolved.secondary && <span className={styles.chipSecondary}>{resolved.secondary}</span>}
        </>
      )}
    </div>
  );
}

export default function DataChipsBlock({ data, onUpdate, workspace, projectId }: DataChipsBlockProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const addChip = (type: DataChipType) => {
    if (data.chips.some(c => c.type === type)) return;
    const catalog = CHIP_CATALOG.find(c => c.type === type);
    onUpdate({ chips: [...data.chips, { type, label: catalog?.label || type }] });
    setPickerOpen(false);
  };

  const removeChip = (idx: number) => {
    onUpdate({ chips: data.chips.filter((_, i) => i !== idx) });
  };

  const availableChips = CHIP_CATALOG.filter(c => !data.chips.some(ch => ch.type === c.type));

  return (
    <div className={styles.block}>
      <div className={styles.chips}>
        {data.chips.map((chip, i) => (
          <div key={`${chip.type}-${i}`} className={styles.chipWrap}>
            <ChipRenderer chip={chip} workspace={workspace} projectId={projectId} />
            <button className={styles.chipRemove} onClick={() => removeChip(i)} title="Remove">×</button>
          </div>
        ))}

        {/* Add chip button */}
        <div className={styles.addWrap}>
          <button className={styles.addBtn} onClick={() => setPickerOpen(p => !p)}>
            + data
          </button>
          {pickerOpen && (
            <div className={styles.picker}>
              <div className={styles.pickerLabel}>Add live data</div>
              {availableChips.length === 0 && <div className={styles.pickerEmpty}>All chips added</div>}
              {availableChips.map(c => (
                <button key={c.type} className={styles.pickerItem} onClick={() => addChip(c.type)}>
                  <span className={styles.pickerIcon}>{c.icon}</span>
                  <span className={styles.pickerInfo}>
                    <span className={styles.pickerName}>{c.label}</span>
                    <span className={styles.pickerDesc}>{c.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
