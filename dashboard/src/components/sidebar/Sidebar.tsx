"use client";

import { useState, useRef, useEffect } from "react";
import { STATUS } from "@/lib/constants";
import type { Workstation, Project, ArchivedProject } from "@/lib/types";
import styles from "./Sidebar.module.css";
import CalendarView from "./CalendarView";

interface SidebarProps {
  workstations: Workstation[];
  archived: ArchivedProject[];
  activeProject: string;
  open: boolean;
  width: number;
  isResizing: boolean;
  wordCount: number;
  railActive: string;
  onClose: () => void;
  onToggleWorkstation: (id: string) => void;
  onSelectWorkstation: (id: string) => void;
  onSelectProject: (project: Project, client: string) => void;
  onArchiveProject: (projectId: string) => void;
  onArchiveCompleted: (wsId: string) => void;
  onArchiveWorkstation: (wsId: string) => void;
  onRestoreProject: (archivedIdx: number) => void;
  onReorderWorkstations: (fromIndex: number, toIndex: number) => void;
  onRenameWorkstation: (wsId: string, name: string) => void;
  onRenameProject: (projectId: string, name: string) => void;
  onUpdateProjectDue: (projectId: string, due: string | null) => void;
  onAddWorkstation: (name: string) => void;
  onTogglePin: (projectId: string) => void;
  onCycleStatus: (projectId: string) => void;
  saveIndicatorState: "saved" | "saving";
  saveStatusLabel: string;
  onSaveNow: () => void;
  onScrollToCalendarEvent?: (projectId: string) => void;
}

const STATUSES = ["active", "review", "paused", "completed"] as const;

import { getDueLabel as getDueLabelFromDate, getDueColor as getDueColorFromDate } from "@/lib/due-dates";

export default function Sidebar({ workstations, archived, activeProject, open, width, isResizing, wordCount, railActive, onClose, onToggleWorkstation, onSelectWorkstation, onSelectProject, onArchiveProject, onArchiveCompleted, onArchiveWorkstation, onRestoreProject, onReorderWorkstations, onRenameWorkstation, onRenameProject, onUpdateProjectDue, onAddWorkstation, onTogglePin, onCycleStatus, saveIndicatorState, saveStatusLabel, onSaveNow, onScrollToCalendarEvent }: SidebarProps) {
  const [wsMenu, setWsMenu] = useState<string | null>(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [showAddWs, setShowAddWs] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [dragWsId, setDragWsId] = useState<string | null>(null);
  const [dropWsId, setDropWsId] = useState<string | null>(null);
  const dragRef = useRef<number | null>(null);
  const [editingWsId, setEditingWsId] = useState<string | null>(null);
  const [editingWsName, setEditingWsName] = useState("");
  const [editingPjId, setEditingPjId] = useState<string | null>(null);
  const [editingPjName, setEditingPjName] = useState("");
  const [pjMenuOpen, setPjMenuOpen] = useState<string | null>(null);
  const [pjMenuPos, setPjMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [search, setSearch] = useState("");

  // Close workspace menu on outside click
  useEffect(() => {
    if (!wsMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.wsDropdown}`) && !target.closest(`.${styles.wsMenuBtn}`)) {
        setWsMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [wsMenu]);

  // Close project menu on outside click
  useEffect(() => {
    if (!pjMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.pjMenu}`) && !target.closest(`.${styles.pjMenuBtn}`)) {
        setPjMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pjMenuOpen]);

  const totalProjects = workstations.reduce((s, w) => s + w.projects.length, 0);

  const completedCount = (wsId: string) =>
    workstations.find(w => w.id === wsId)?.projects.filter(p => p.status === "completed").length || 0;

  // Pinned projects
  const pinnedProjects = workstations.flatMap(w =>
    w.projects.filter(p => p.pinned).map(p => ({ ...p, wsName: w.client, wsColor: w.avatarBg }))
  );

  // Filtered workspaces
  const filtered = search
    ? workstations.map(w => ({
        ...w,
        projects: w.projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
        open: true,
      })).filter(w => w.client.toLowerCase().includes(search.toLowerCase()) || w.projects.length > 0)
    : workstations;

  const clientWorkstations = filtered.filter(w => !w.personal);
  const personalWorkstations = filtered.filter(w => w.personal);

  const renderProjects = (ws: Workstation, showAmount: boolean) => (
    <div className={`${styles.projectList} ${ws.open ? styles.projectListOpen : ""}`} aria-hidden={!ws.open}>
      <div className={styles.projectListInner}>
        {ws.projects.map(pj => {
          const st = STATUS[pj.status];
          return (
            <div
              key={pj.id}
              className={`${styles.project} ${activeProject === pj.id ? styles.projectActive : ""}`}
              onClick={() => { if (editingPjId !== pj.id) onSelectProject(pj, ws.client); }}
            >
              <div
                className={styles.projectStatusDot}
                style={{ background: st.color }}
                onClick={e => { e.stopPropagation(); onCycleStatus(pj.id); }}
                title={`${st.label} — click to change`}
              />
              <div className={styles.projectContent}>
                {editingPjId === pj.id ? (
                  <input className={styles.pjRenameInput} value={editingPjName} autoFocus
                    onChange={e => setEditingPjName(e.target.value)}
                    onBlur={() => { onRenameProject(pj.id, editingPjName.trim() || pj.name); setEditingPjId(null); }}
                    onKeyDown={e => { if (e.key === "Enter") { onRenameProject(pj.id, editingPjName.trim() || pj.name); setEditingPjId(null); } if (e.key === "Escape") setEditingPjId(null); }}
                    onClick={e => e.stopPropagation()} />
                ) : (
                  <span className={styles.projectName} onDoubleClick={e => { e.stopPropagation(); setEditingPjId(pj.id); setEditingPjName(pj.name); }}>{pj.name}</span>
                )}
                <div className={styles.projectBottom}>
                  <label className={styles.projectDue} style={{ color: getDueColorFromDate(pj.due), cursor: "pointer" }} onClick={e => e.stopPropagation()}>
                    {getDueLabelFromDate(pj.due)}
                    <input type="date" value={pj.due || ""} onChange={e => onUpdateProjectDue(pj.id, e.target.value || null)} style={{ position: "absolute", opacity: 0, width: 0, height: 0, overflow: "hidden" }} />
                  </label>
                  {showAmount && pj.amount !== "—" && <span className={styles.projectAmount}>{pj.amount}</span>}
                  <div className={styles.projectProgressBar}>
                    <div className={styles.projectProgressFill} style={{ width: `${pj.progress}%`, background: st.color }} />
                  </div>
                  <span className={styles.projectProgressPct}>{pj.progress}%</span>
                </div>
              </div>
              <div className={styles.projectActions}>
                <button className={`${styles.pjMenuBtn} ${pjMenuOpen === pj.id ? styles.pjMenuBtnOpen : ""}`} onClick={e => { e.stopPropagation(); const rect = (e.currentTarget as HTMLElement).getBoundingClientRect(); setPjMenuPos({ top: rect.bottom + 2, left: rect.right - 170 }); setPjMenuOpen(pjMenuOpen === pj.id ? null : pj.id); }}>···</button>
                {pjMenuOpen === pj.id && (
                  <div className={styles.pjMenu} style={{ top: pjMenuPos.top, left: pjMenuPos.left }}>
                    <button className={styles.pjMenuItem} onClick={e => { e.stopPropagation(); onTogglePin(pj.id); setPjMenuOpen(null); }}>
                      <span className={styles.pjMenuIcon}><svg width="12" height="12" viewBox="0 0 10 10" fill="none"><path d="M4 8L2 10M7 1.5l2 2-1.5 2-.5-.5L4 8l-1.5-1.5L5.5 3.5 5 3z" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill={pj.pinned ? "currentColor" : "none"} /></svg></span>
                      {pj.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button className={styles.pjMenuItem} onClick={e => { e.stopPropagation(); setEditingPjId(pj.id); setEditingPjName(pj.name); setPjMenuOpen(null); }}>
                      <span className={styles.pjMenuIcon}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5V8.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                      Rename
                    </button>
                    <button className={styles.pjMenuItem} onClick={e => { e.stopPropagation(); onCycleStatus(pj.id); setPjMenuOpen(null); }}>
                      <span className={styles.pjMenuIcon}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1" /><circle cx="6" cy="6" r="1.5" fill="currentColor" /></svg></span>
                      Cycle status
                    </button>
                    <div className={styles.pjMenuSep} />
                    <button className={`${styles.pjMenuItem} ${styles.pjMenuDanger}`} onClick={e => { e.stopPropagation(); onArchiveProject(pj.id); setPjMenuOpen(null); }}>
                      <span className={styles.pjMenuIcon}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 5.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg></span>
                      Archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`${styles.sidebar} ${open ? "" : styles.closed} ${isResizing ? styles.resizing : ""}`} style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}>
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.head}>
          <span className={styles.title}>{railActive === "calendar" ? "calendar" : "workstations"}</span>
          <div className={styles.headActions}>
            {railActive !== "calendar" && (
              <button className={styles.iconBtn} title="Add workstation" aria-label="Add workstation" onClick={() => setShowAddWs(true)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
            <button className={styles.iconBtn} onClick={onClose} aria-label="Close sidebar">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Calendar view */}
        {railActive === "calendar" && <CalendarView workstations={workstations} onSelectProject={onSelectProject} onScrollToEvent={onScrollToCalendarEvent} />}

        {/* Navigation content */}
        {railActive !== "calendar" && <>
        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" /><path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          <input className={styles.search} placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Pinned */}
        {pinnedProjects.length > 0 && !search && (
          <div className={styles.pinnedSection}>
            <div className={styles.sectionLabel}>pinned</div>
            {pinnedProjects.map(p => (
              <div key={p.id} className={`${styles.pinnedItem} ${activeProject === p.id ? styles.pinnedItemOn : ""}`} onClick={() => {
                const ws = workstations.find(w => w.projects.some(pr => pr.id === p.id));
                if (ws) onSelectProject(p, ws.client);
              }}>
                <div className={styles.pinnedDot} style={{ background: p.wsColor }} />
                <div className={styles.pinnedInfo}>
                  <div className={styles.pinnedName}>{p.name}</div>
                  <div className={styles.pinnedWs}>{p.wsName}</div>
                </div>
                <div className={styles.pinnedProgress}>
                  <div className={styles.pinnedProgressFill} style={{ width: `${p.progress}%`, background: STATUS[p.status].color }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Workspace list */}
        <div className={styles.scroll}>
          {!search && <div className={styles.sectionLabel}>clients</div>}

          {clientWorkstations.map((ws, wsIdx) => (
            <div
              key={ws.id}
              className={`${styles.wsBlock} ${dropWsId === ws.id ? styles.wsDropTarget : ""} ${dragWsId === ws.id ? styles.wsDragging : ""}`}
              onDragOver={e => { e.preventDefault(); if (dragWsId && dragWsId !== ws.id) setDropWsId(ws.id); }}
              onDragLeave={() => { if (dropWsId === ws.id) setDropWsId(null); }}
              onDrop={e => { e.preventDefault(); if (dragRef.current !== null && dragRef.current !== wsIdx) onReorderWorkstations(dragRef.current, wsIdx); setDragWsId(null); setDropWsId(null); dragRef.current = null; }}
            >
              <div
                className={styles.wsHead}
                draggable
                onDragStart={e => { setDragWsId(ws.id); dragRef.current = wsIdx; e.dataTransfer.effectAllowed = "move"; }}
                onDragEnd={() => { setDragWsId(null); setDropWsId(null); dragRef.current = null; }}
              >
                <div className={styles.wsHeadClick} onClick={() => { if (editingWsId !== ws.id) onToggleWorkstation(ws.id); }}>
                  <div className={styles.wsAvatar} style={{ background: ws.avatarBg }} onDoubleClick={e => { e.stopPropagation(); onSelectWorkstation(ws.id); }}>{ws.avatar}</div>
                  <div className={styles.wsInfo}>
                    {editingWsId === ws.id ? (
                      <input className={styles.wsRenameInput} value={editingWsName} autoFocus
                        onChange={e => setEditingWsName(e.target.value)}
                        onBlur={() => { onRenameWorkstation(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); }}
                        onKeyDown={e => { if (e.key === "Enter") { onRenameWorkstation(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); } if (e.key === "Escape") setEditingWsId(null); }}
                        onClick={e => e.stopPropagation()} />
                    ) : (
                      <span className={styles.wsName} onDoubleClick={e => { e.stopPropagation(); setEditingWsId(ws.id); setEditingWsName(ws.client); }}>{ws.client}</span>
                    )}
                    <div className={styles.wsMeta}>
                      <span className={styles.wsLastActive}>{ws.lastActive}</span>
                    </div>
                  </div>
                  <span className={styles.wsCount}>{ws.projects.length}</span>
                  <span className={styles.wsArrow} style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
                </div>
                <button className={styles.wsMenuBtn} onClick={e => { e.stopPropagation(); setWsMenu(wsMenu === ws.id ? null : ws.id); }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" /></svg>
                </button>
              </div>

              {/* Workspace dropdown */}
              {wsMenu === ws.id && (
                <div className={styles.wsDropdown}>
                  <button className={styles.wsDropItem} onClick={() => { setEditingWsId(ws.id); setEditingWsName(ws.client); setWsMenu(null); }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Rename</span>
                  </button>
                  {completedCount(ws.id) > 0 && (
                    <button className={styles.wsDropItem} onClick={() => { onArchiveCompleted(ws.id); setWsMenu(null); }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                      <span>Archive completed</span>
                      <span className={styles.wsDropBadge}>{completedCount(ws.id)}</span>
                    </button>
                  )}
                  <button className={styles.wsDropItem} onClick={() => { onArchiveWorkstation(ws.id); setWsMenu(null); }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>Archive workstation</span>
                  </button>
                </div>
              )}

              {renderProjects(ws, true)}
            </div>
          ))}

          {/* Personal */}
          {personalWorkstations.length > 0 && (
            <>
              {!search && <div className={styles.sectionLabel} style={{ marginTop: 12 }}>personal</div>}
              {personalWorkstations.map((ws, wsIdx) => (
                <div
                  key={ws.id}
                  className={`${styles.wsBlock} ${dropWsId === ws.id ? styles.wsDropTarget : ""} ${dragWsId === ws.id ? styles.wsDragging : ""}`}
                >
                  <div className={styles.wsHead}>
                    <div className={styles.wsHeadClick} onClick={() => { if (editingWsId !== ws.id) onToggleWorkstation(ws.id); }}>
                      <div className={styles.wsAvatar} style={{ background: ws.avatarBg }} onDoubleClick={e => { e.stopPropagation(); onSelectWorkstation(ws.id); }}>{ws.avatar}</div>
                      <div className={styles.wsInfo}>
                        {editingWsId === ws.id ? (
                          <input className={styles.wsRenameInput} value={editingWsName} autoFocus
                            onChange={e => setEditingWsName(e.target.value)}
                            onBlur={() => { onRenameWorkstation(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); }}
                            onKeyDown={e => { if (e.key === "Enter") { onRenameWorkstation(ws.id, editingWsName.trim() || ws.client); setEditingWsId(null); } if (e.key === "Escape") setEditingWsId(null); }}
                            onClick={e => e.stopPropagation()} />
                        ) : (
                          <span className={styles.wsName} onDoubleClick={e => { e.stopPropagation(); setEditingWsId(ws.id); setEditingWsName(ws.client); }}>{ws.client}</span>
                        )}
                        <div className={styles.wsMeta}>
                          <span className={styles.wsLastActive}>{ws.lastActive}</span>
                        </div>
                      </div>
                      <span className={styles.wsCount}>{ws.projects.length}</span>
                      <span className={styles.wsArrow} style={{ transform: ws.open ? "rotate(90deg)" : "rotate(0deg)" }}>{"\u25b6"}</span>
                    </div>
                    <button className={styles.wsMenuBtn} onClick={e => { e.stopPropagation(); setWsMenu(wsMenu === ws.id ? null : ws.id); }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="7" r="1" fill="currentColor" /><circle cx="7" cy="7" r="1" fill="currentColor" /><circle cx="11" cy="7" r="1" fill="currentColor" /></svg>
                    </button>
                  </div>

                  {wsMenu === ws.id && (
                    <div className={styles.wsDropdown}>
                      <button className={styles.wsDropItem} onClick={() => { setEditingWsId(ws.id); setEditingWsName(ws.client); setWsMenu(null); }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5v-2l7-7z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>Rename</span>
                      </button>
                      {personalWorkstations.length > 1 && <button className={styles.wsDropItem} onClick={() => { onArchiveWorkstation(ws.id); setWsMenu(null); }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 6l1.5 1.5L8 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>Archive workstation</span>
                      </button>}
                    </div>
                  )}

                  {renderProjects(ws, false)}
                </div>
              ))}
            </>
          )}

          {/* Add workspace */}
          {!search && !showAddWs && (
            <div className={styles.addWsRow} onClick={() => setShowAddWs(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
              <span>Add workstation</span>
            </div>
          )}
          {showAddWs && (
            <div className={styles.addWsInputRow}>
              <input className={styles.addWsInput} placeholder="Client name..." value={newWsName} autoFocus
                onChange={e => setNewWsName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && newWsName.trim()) { onAddWorkstation(newWsName.trim()); setNewWsName(""); setShowAddWs(false); } if (e.key === "Escape") { setNewWsName(""); setShowAddWs(false); } }} />
              <button className={styles.addWsConfirm} onClick={() => { if (newWsName.trim()) { onAddWorkstation(newWsName.trim()); setNewWsName(""); setShowAddWs(false); } }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className={styles.addWsCancel} onClick={() => { setNewWsName(""); setShowAddWs(false); }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
              </button>
            </div>
          )}

          {/* Archive drawer */}
          {archived.length > 0 && !search && (
            <div className={styles.archiveSection}>
              <div className={styles.archiveHead} onClick={() => setArchiveOpen(!archiveOpen)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h9M2.5 3.5v6a1 1 0 001 1h5a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 6h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
                <span className={styles.archiveLabel}>archive</span>
                <span className={styles.archiveBadge}>{archived.length}</span>
                <span className={styles.archiveArrow} style={{ transform: archiveOpen ? "rotate(90deg)" : "rotate(0deg)" }}>&#9654;</span>
              </div>
              <div className={`${styles.archiveList} ${archiveOpen ? styles.archiveListOpen : ""}`} aria-hidden={!archiveOpen}>
                <div className={styles.archiveListInner}>
                  {archived.map((item, idx) => (
                    <div key={`${item.project.id}-${idx}`} className={styles.archiveItem}>
                      <div className={styles.archiveItemDot} />
                      <div className={styles.archiveItemInfo}>
                        <span className={styles.archiveItemName}>{item.project.name}</span>
                        <span className={styles.archiveItemMeta}>{item.workstationName} · {item.archivedAt}</span>
                      </div>
                      <button className={styles.archiveRestoreBtn} onClick={() => onRestoreProject(idx)} title="Restore">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6.5a4 4 0 017.5-1.5M10 2v3H7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 5.5a4 4 0 01-7.5 1.5M2 10V7h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        </>}

        {/* Footer */}
        <div className={styles.footer}>
          <span className={styles.footerMeta}>{railActive === "calendar" ? `${workstations.flatMap(w => w.projects).filter(p => p.due != null).length} deadlines` : `${totalProjects} projects · ${workstations.length} clients`}</span>
          <button
            type="button"
            className={`${styles.savedIndicator} ${saveIndicatorState === "saving" ? styles.savedIndicatorSaving : ""}`}
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
