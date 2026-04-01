"use client";

import type { Workstation } from "@/lib/types";
import styles from "./SplitPicker.module.css";

interface SplitPickerProps {
  workstations: Workstation[];
  activeProject: string;
  onSplitOpen?: (projectId: string) => void;
  onClose: () => void;
}

export default function SplitPicker({ workstations, activeProject, onSplitOpen, onClose }: SplitPickerProps) {
  const allProjects = workstations.flatMap(w => w.projects.map(p => ({ ...p, client: w.client })));
  const available = allProjects.filter(p => p.id !== activeProject);
  return (
    <div className={styles.splitPicker}>
      <div className={styles.splitPickerLabel}>Documents</div>
      {available.length === 0 && <div className={styles.splitPickerEmpty}>No other docs</div>}
      {available.map(p => (
        <button key={p.id} className={styles.splitPickerItem} onClick={() => { onSplitOpen?.(p.id); onClose(); }}>
          <span className={styles.splitPickerName}>{p.name}</span>
          <span className={styles.splitPickerClient}>{p.client}</span>
        </button>
      ))}
    </div>
  );
}
