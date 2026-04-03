"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { STATUS } from "@/lib/constants";
import type { Workstation, Project, Tab, Block, ArchivedProject } from "@/lib/types";
import styles from "./EditorSidebar.module.css";

interface EditorSidebarProps {
  workstation: Workstation | null;
  workstations: Workstation[];
  activeProject: string;
  activeTab: Tab | null;
  blocks: Block[];
  tabs: Tab[];
  blocksMap: Record<string, Block[]>;
  open: boolean;
  width: number;
  isResizing: boolean;
  saveIndicatorState: "saved" | "saving";
  saveStatusLabel: string;
  onClose: () => void;
  onTabClick: (id: string) => void;
  onNewTab: () => void;
  onSelectProject: (project: Project, client: string) => void;
  onSelectWorkstation: (wsId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onArchiveProject: (projectId: string) => void;
  archived: ArchivedProject[];
  onRestoreProject: (archivedIdx: number) => void;
  onPermanentDelete: (archivedIdx: number) => void;
  onSaveNow: () => void;
}

/* ── Helpers ── */

function countWords(blocks: Block[]): number {
  return blocks.reduce((total, b) => {
    if (!b.content) return total;
    const words = b.content.trim().split(/\s+/).filter(Boolean);
    return total + words.length;
  }, 0);
}

/* ── Component ── */

export default function EditorSidebar({
  workstation,
  workstations,
  activeProject,
  activeTab,
  blocks,
  open,
  width,
  isResizing,
  saveIndicatorState,
  saveStatusLabel,
  onClose,
  onNewTab,
  onSelectProject,
  onSelectWorkstation,
  onDuplicateProject,
  onArchiveProject,
  archived,
  onRestoreProject,
  onPermanentDelete,
  onSaveNow,
}: EditorSidebarProps) {
  const [docsOpen, setDocsOpen] = useState(true);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [holdIdx, setHoldIdx] = useState<number | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close switcher on outside click
  useEffect(() => {
    if (!switcherOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.switcherDropdown}`) && !target.closest(`.${styles.clientBadge}`)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [switcherOpen]);

  const words = useMemo(() => countWords(blocks), [blocks]);

  const projects = workstation?.projects ?? [];
  const clientName = workstation?.client ?? "";
  const wsArchived = workstation
    ? archived.map((a, idx) => ({ ...a, globalIdx: idx })).filter(a => a.workstationId === workstation.id)
    : [];

  return (
    <div
      className={`${styles.sidebar} ${open ? "" : styles.closed} ${isResizing ? styles.resizing : ""}`}
      style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}
    >
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.head}>
          <div className={styles.clientBadge} onClick={() => setSwitcherOpen(!switcherOpen)}>
            {workstation && (
              <div className={styles.clientAvatar} style={{ background: workstation.avatarBg }}>
                {workstation.avatar}
              </div>
            )}
            <span className={styles.clientName}>{clientName}</span>
            <span className={styles.clientChevron} style={{ transform: switcherOpen ? "rotate(180deg)" : undefined }}>&#9662;</span>
          </div>
          <div className={styles.headActions}>
            <button className={styles.iconBtn} title="New document" aria-label="New document" onClick={onNewTab}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <button className={styles.iconBtn} onClick={onClose} aria-label="Close sidebar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
          </div>
          {switcherOpen && (
            <div className={styles.switcherDropdown} ref={switcherRef}>
              {workstations.map(ws => (
                <div
                  key={ws.id}
                  className={`${styles.switcherItem} ${ws.id === workstation?.id ? styles.switcherItemActive : ""}`}
                  onClick={() => { onSelectWorkstation(ws.id); setSwitcherOpen(false); }}
                >
                  <div className={styles.switcherAvatar} style={{ background: ws.avatarBg }}>{ws.avatar}</div>
                  <div className={styles.switcherInfo}>
                    <span className={styles.switcherName}>{ws.client}</span>
                    <span className={styles.switcherMeta}>{ws.projects.length} projects</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current document indicator */}
        {activeTab && (
          <div className={styles.docIndicator}>
            <div className={`${styles.docDot} ${saveIndicatorState === "saving" ? styles.docDotSaving : styles.docDotSaved}`} />
            <div className={styles.docInfo}>
              <span className={styles.docName}>{activeTab.name}</span>
              <span className={styles.docMeta}>{blocks.length} blocks · {words} words</span>
            </div>
            <span
              className={styles.docStatus}
              style={{
                color: saveIndicatorState === "saving" ? "var(--ember)" : "#5a9a3c",
                background: saveIndicatorState === "saving" ? "rgba(194, 75, 56, 0.08)" : "rgba(90, 154, 60, 0.08)",
              }}
            >
              {saveIndicatorState === "saving" ? "saving" : "saved"}
            </span>
          </div>
        )}

        {/* Search (visual placeholder) */}
        <div className={styles.search}>
          <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input className={styles.searchInput} placeholder="Search documents..." readOnly />
          <div className={styles.searchKeys}>
            <span className={styles.searchKey}>&#8984;</span>
            <span className={styles.searchKey}>K</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className={styles.scroll}>
          {/* Documents section */}
          <div className={styles.section}>
            <div className={styles.sectionHead} onClick={() => setDocsOpen(!docsOpen)}>
              <span className={styles.sectionArrow} style={{ transform: docsOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
              <span className={styles.sectionLabel}>documents</span>
              <span className={styles.sectionCount}>{projects.length}</span>
            </div>
            {docsOpen && (
              <>
                {projects.map(project => {
                  const st = STATUS[project.status];
                  const isActive = project.id === activeProject;
                  return (
                    <div
                      key={project.id}
                      className={`${styles.doc} ${isActive ? styles.docOn : ""}`}
                      onClick={() => onSelectProject(project, clientName)}
                    >
                      <div className={styles.docStatusDot} style={{ background: st?.color || "var(--ink-300)" }} />
                      <div className={styles.docRowInfo}>
                        <span className={styles.docRowName}>{project.name}</span>
                        <span className={styles.docRowMeta}>
                          {st?.label || "draft"}
                        </span>
                      </div>
                      <div className={styles.docActions}>
                        <button
                          className={styles.docActionBtn}
                          title="Duplicate"
                          onClick={e => { e.stopPropagation(); onDuplicateProject(project.id); }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 1.5h4.5a1 1 0 011 1V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><rect x="1.5" y="3.5" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" /><path d="M3.5 7h3M4.5 6v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                        </button>
                        <button
                          className={`${styles.docActionBtn} ${styles.docActionDanger}`}
                          title="Archive"
                          onClick={e => { e.stopPropagation(); onArchiveProject(project.id); }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 5.5h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.docNew} onClick={onNewTab}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  <span>New document</span>
                </div>
              </>
            )}
          </div>

          {/* Archive section — only when this workstation has archived items */}
          {wsArchived.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHead} onClick={() => setArchiveOpen(!archiveOpen)}>
                <span className={styles.sectionArrow} style={{ transform: archiveOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
                <span className={styles.sectionLabel}>archive</span>
                <span className={styles.sectionCount}>{wsArchived.length}</span>
              </div>
              {archiveOpen && wsArchived.map(item => {
                const isHeld = holdIdx === item.globalIdx;
                return (
                  <div
                    key={`${item.project.id}-${item.globalIdx}`}
                    className={`${styles.archiveItem} ${isHeld ? styles.archiveItemHeld : ""}`}
                    onMouseDown={() => {
                      holdTimer.current = setTimeout(() => setHoldIdx(item.globalIdx), 500);
                    }}
                    onMouseUp={() => {
                      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
                    }}
                    onMouseLeave={() => {
                      if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
                      if (isHeld) setHoldIdx(null);
                    }}
                  >
                    {isHeld ? (
                      <>
                        <span className={styles.archiveHeldName}>{item.project.name}</span>
                        <button
                          className={styles.archiveDelete}
                          title="Permanently delete"
                          onClick={() => { onPermanentDelete(item.globalIdx); setHoldIdx(null); }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4.5 3V2h3v1M3 3v7a1 1 0 001 1h4a1 1 0 001-1V3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 5.5v3M7 5.5v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className={styles.archiveDot} />
                        <div className={styles.archiveInfo}>
                          <span className={styles.archiveName}>{item.project.name}</span>
                          <span className={styles.archiveMeta}>{item.archivedAt}</span>
                        </div>
                        <button
                          className={styles.archiveRestore}
                          title="Restore"
                          onClick={() => onRestoreProject(item.globalIdx)}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5a4 4 0 017.5-1.5M10 2v3H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 5.5a4 4 0 01-7.5 1.5M2 10V7h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            {blocks.length} blocks · {words} words
          </span>
          <button
            type="button"
            className={styles.savedIndicator}
            onClick={onSaveNow}
            title="Save now"
            aria-label="Save now"
          >
            <span className={`${styles.savedDot} ${saveIndicatorState === "saving" ? styles.savedDotSaving : ""}`} />
            <span className={styles.savedText} suppressHydrationWarning>{saveStatusLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
