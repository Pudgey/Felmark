"use client";

import type { Tab, Workstation } from "@/lib/types";
import { STATUS } from "@/lib/constants";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbProps {
  tabs: Tab[];
  activeProject: string;
  workstations: Workstation[];
  onSelectWorkstation?: (wsId: string) => void;
}

export default function Breadcrumb({ tabs, activeProject, workstations, onSelectWorkstation }: BreadcrumbProps) {
  const activeTab = tabs.find(t => t.active);
  const activeWs = workstations.find(w => w.projects.some(p => p.id === activeProject));
  const canGoToWorkstation = Boolean(activeWs?.id && onSelectWorkstation);

  const handleClick = () => {
    if (!activeWs?.id || !onSelectWorkstation) return;
    onSelectWorkstation(activeWs.id);
  };

  if (!tabs.some(t => t.active)) return null;

  return (
    <div className={styles.bread}>
      <button
        className={styles.breadNav}
        type="button"
        aria-label="Back to workstation"
        title="Back to workstation"
        onClick={handleClick}
        disabled={!canGoToWorkstation}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8 3L4 7l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <span className={styles.breadChevron} aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      <button
        className={styles.breadLink}
        type="button"
        onClick={handleClick}
        disabled={!canGoToWorkstation}
      >
        {activeWs?.client || "Workstation"}
      </button>
      <span style={{ color: "var(--warm-300)" }}>/</span>
      <span style={{ color: "var(--ink-700)", margin: "0 4px", fontWeight: 500 }}>{activeTab?.name || "Untitled"}</span>
      {(() => {
        const pj = workstations.flatMap(w => w.projects).find(p => p.id === activeProject);
        if (!pj) return null;
        const st = STATUS[pj.status];
        return <span className={styles.breadStatus} style={{ background: `${st.color}12`, color: st.color, border: `1px solid ${st.color}20` }}>{st.label}</span>;
      })()}
    </div>
  );
}
