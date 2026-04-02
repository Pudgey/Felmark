"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { STATUS } from "@/lib/constants";
import type { Workstation, Project, Tab, Block } from "@/lib/types";
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
  onSelectWorkstationHome: (wsId: string) => void;
  onSaveNow: () => void;
}

/* ── Helpers ── */

interface OutlineItem {
  id: string;
  text: string;
  depth: number; // 0 = h1, 1 = h2, 2 = h3
}

function countWords(blocks: Block[]): number {
  return blocks.reduce((total, b) => {
    if (!b.content) return total;
    const words = b.content.trim().split(/\s+/).filter(Boolean);
    return total + words.length;
  }, 0);
}

function buildOutline(blocks: Block[]): OutlineItem[] {
  const items: OutlineItem[] = [];
  for (const b of blocks) {
    if (b.type === "h1") items.push({ id: b.id, text: b.content || "Untitled", depth: 0 });
    else if (b.type === "h2") items.push({ id: b.id, text: b.content || "Untitled", depth: 1 });
    else if (b.type === "h3") items.push({ id: b.id, text: b.content || "Untitled", depth: 2 });
  }
  return items;
}

function todoProgress(blocks: Block[]): { checked: number; total: number } {
  let checked = 0;
  let total = 0;
  for (const b of blocks) {
    if (b.type === "todo") {
      total++;
      if (b.checked) checked++;
    }
  }
  return { checked, total };
}

/* ── Component ── */

export default function EditorSidebar({
  workstation,
  workstations,
  activeProject,
  activeTab,
  blocks,
  tabs,
  blocksMap,
  open,
  width,
  isResizing,
  saveIndicatorState,
  saveStatusLabel,
  onClose,
  onTabClick,
  onNewTab,
  onSelectProject,
  onSelectWorkstationHome,
  onSaveNow,
}: EditorSidebarProps) {
  const [docsOpen, setDocsOpen] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
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
  const outline = useMemo(() => buildOutline(blocks), [blocks]);
  const todos = useMemo(() => todoProgress(blocks), [blocks]);
  const todoPercent = todos.total > 0 ? Math.round((todos.checked / todos.total) * 100) : 0;

  const projects = workstation?.projects ?? [];
  const clientName = workstation?.client ?? "Workspace";

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
                  onClick={() => { onSelectWorkstationHome(ws.id); setSwitcherOpen(false); }}
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
                          {project.progress > 0 && ` · ${project.progress}%`}
                        </span>
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

          {/* Outline section */}
          <div className={styles.section}>
            <div className={styles.sectionHead} onClick={() => setOutlineOpen(!outlineOpen)}>
              <span className={styles.sectionArrow} style={{ transform: outlineOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
              <span className={styles.sectionLabel}>outline</span>
              <span className={styles.sectionCount}>{outline.length}</span>
            </div>
            {outlineOpen && outline.length > 0 && (
              <div className={styles.outline}>
                {outline.map(item => (
                  <div
                    key={item.id}
                    className={`${styles.outlineItem} ${item.depth === 1 ? styles.outlineDepth1 : ""} ${item.depth === 2 ? styles.outlineDepth2 : ""}`}
                  >
                    <div className={styles.outlineCb}>
                      {item.depth === 0 && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="2.5" fill="var(--ink-400)" /></svg>
                      )}
                    </div>
                    <span className={styles.outlineText}>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
            {outlineOpen && outline.length === 0 && (
              <div className={styles.outline}>
                <span className={styles.docRowMeta} style={{ padding: "2px 0" }}>Add headings to see an outline</span>
              </div>
            )}
          </div>

          {/* Document progress */}
          {todos.total > 0 && (
            <div className={styles.progress}>
              <div className={styles.progressTop}>
                <span className={styles.progressLabel}>progress</span>
                <span className={styles.progressVal}>{todos.checked}/{todos.total}</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${todoPercent}%` }} />
              </div>
              <div className={styles.progressMeta}>
                <span>{words} words</span>
                <span>{outline.length} sections</span>
                <span>{todoPercent}% complete</span>
              </div>
            </div>
          )}

          {/* Terminal strip */}
          <div
            className={`${styles.terminal} ${terminalOpen ? styles.terminalOpen : ""}`}
            onClick={() => setTerminalOpen(!terminalOpen)}
          >
            <div className={styles.terminalDot} />
            <span className={styles.terminalText}>terminal</span>
            <span className={styles.terminalKey}>&#8984;`</span>
          </div>
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
            <span className={styles.savedText}>{saveStatusLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
