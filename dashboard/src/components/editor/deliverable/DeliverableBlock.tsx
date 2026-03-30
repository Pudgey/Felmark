"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { DeliverableData, DeliverableStatus, DeliverableFile, DeliverableComment, DeliverableActivity, DeliverableSubtask } from "@/lib/types";
import styles from "./DeliverableBlock.module.css";

const uid = () => Math.random().toString(36).slice(2, 10);

const STATUS_CONFIG: Record<DeliverableStatus, { label: string; color: string; bg: string; icon: string }> = {
  "todo": { label: "To Do", color: "#9b988f", bg: "rgba(155,152,143,0.06)", icon: "○" },
  "in-progress": { label: "In Progress", color: "#b07d4f", bg: "rgba(176,125,79,0.06)", icon: "◐" },
  "review": { label: "In Review", color: "#5b7fa4", bg: "rgba(91,127,164,0.06)", icon: "◎" },
  "changes": { label: "Changes Req.", color: "#c24b38", bg: "rgba(194,75,56,0.06)", icon: "↻" },
  "approved": { label: "Approved", color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", icon: "✓" },
};

const STATUSES: DeliverableStatus[] = ["todo", "in-progress", "review", "changes", "approved"];

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: "📄",
  image: "🖼",
  doc: "📝",
  spreadsheet: "📊",
  code: "💻",
  generic: "📎",
};

function inferFileType(name: string): "pdf" | "image" | "doc" | "spreadsheet" | "code" | "generic" {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext)) return "image";
  if (["doc", "docx", "txt", "rtf", "odt"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (["js", "ts", "tsx", "jsx", "py", "go", "rs", "html", "css", "json"].includes(ext)) return "code";
  return "generic";
}

interface DeliverableBlockProps {
  data: DeliverableData;
  onChange: (data: DeliverableData) => void;
  onCommentAdded?: (text: string, deliverableTitle: string) => void;
}

export default function DeliverableBlock({ data, onChange, onCommentAdded }: DeliverableBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"files" | "comments" | "approvals">("files");
  const [commentText, setCommentText] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [titleDraft, setTitleDraft] = useState(data.title);
  const [descDraft, setDescDraft] = useState(data.description);
  const [dropHighlight, setDropHighlight] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [subtasksOpen, setSubtasksOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const cfg = STATUS_CONFIG[data.status];
  const activities = data.activities || [];
  const subtasks = data.subtasks || [];

  // Focus title input on edit
  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.select();
  }, [editingTitle]);

  useEffect(() => {
    if (editingDesc && descRef.current) descRef.current.focus();
  }, [editingDesc]);

  // Close status menu on outside click
  useEffect(() => {
    if (!showStatusMenu) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${styles.statusIcon}`) && !target.closest(`.${styles.statusMenu}`)) setShowStatusMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStatusMenu]);

  const addActivity = useCallback((text: string, current: DeliverableActivity[]) => {
    const entry: DeliverableActivity = { id: uid(), text, time: "Just now" };
    return [...current, entry];
  }, []);

  const commitTitle = () => {
    onChange({ ...data, title: titleDraft.trim() || "Untitled" });
    setEditingTitle(false);
  };

  const commitDesc = () => {
    onChange({ ...data, description: descDraft });
    setEditingDesc(false);
  };

  const updateStatus = (status: DeliverableStatus) => {
    const label = STATUS_CONFIG[status].label;
    const newActivities = addActivity(`Status changed to ${label}`, activities);
    onChange({ ...data, status, activities: newActivities });
    setShowStatusMenu(false);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment: DeliverableComment = {
      id: uid(), user: "You", avatar: "A", color: "#b07d4f",
      text: commentText.trim(), time: "now",
    };
    onChange({ ...data, comments: [...data.comments, newComment] });
    onCommentAdded?.(commentText.trim(), data.title);
    setCommentText("");
  };

  const addMockFile = () => {
    const newFile: DeliverableFile = {
      id: uid(), name: "uploaded-file.pdf", size: "2.4 MB",
      fileType: "pdf", uploadedBy: "You", uploadedAt: "Just now",
    };
    onChange({
      ...data,
      files: [...data.files, newFile],
      status: data.status === "todo" ? "in-progress" : data.status,
      activities: addActivity("File uploaded: uploaded-file.pdf", activities),
    });
  };

  const removeFile = (fileId: string) => {
    onChange({ ...data, files: data.files.filter(f => f.id !== fileId) });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(true);
  };

  const handleDragLeave = () => {
    setDropHighlight(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropHighlight(false);
    addMockFile();
  };

  const approve = () => {
    const existing = data.approvals.find(a => a.user === "You");
    const updatedApprovals = existing
      ? data.approvals.map(a => a.user === "You" ? { ...a, status: "approved" as const, time: "now" } : a)
      : [...data.approvals, { user: "You", avatar: "A", color: "#b07d4f", status: "approved" as const, time: "now" }];

    const allApproved = updatedApprovals.length > 0 && updatedApprovals.every(a => a.status === "approved");
    const newActivities = addActivity("Approved by You", activities);
    onChange({
      ...data,
      approvals: updatedApprovals,
      status: allApproved ? "approved" : data.status,
      activities: newActivities,
    });
  };

  // Subtask helpers
  const addSubtask = () => {
    if (!newTaskTitle.trim()) return;
    const task: DeliverableSubtask = { id: uid(), title: newTaskTitle.trim(), column: "todo" };
    onChange({ ...data, subtasks: [...subtasks, task] });
    setNewTaskTitle("");
  };

  const handleTaskDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleTaskDrop = (column: "todo" | "doing" | "done") => {
    if (!draggedTask) return;
    const updated = subtasks.map(t => t.id === draggedTask ? { ...t, column } : t);
    onChange({ ...data, subtasks: updated });
    setDraggedTask(null);
  };

  const getFileTypeIcon = (file: DeliverableFile) => {
    const ft = file.fileType || inferFileType(file.name);
    return FILE_TYPE_ICONS[ft] || "📎";
  };

  return (
    <div className={`${styles.block} ${expanded ? styles.blockExpanded : ""} ${styles[`status_${data.status.replace("-", "_")}`]}`}>
      {/* Collapsed row */}
      <div className={styles.row} onClick={() => setExpanded(!expanded)}>
        <div className={styles.statusIcon} style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}
          role="button" aria-label={`Status: ${cfg.label}. Click to change`}
          onClick={e => { e.stopPropagation(); setShowStatusMenu(!showStatusMenu); }}>
          {cfg.icon}
          {showStatusMenu && (
            <div className={styles.statusMenu} onClick={e => e.stopPropagation()}>
              {STATUSES.map(s => {
                const sc = STATUS_CONFIG[s];
                return (
                  <div key={s} className={styles.statusOption} onClick={() => updateStatus(s)}>
                    <span style={{ color: sc.color }}>{sc.icon}</span>
                    <span style={{ color: sc.color }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.info}>
          {editingTitle ? (
            <input
              ref={titleRef}
              className={styles.titleInput}
              value={titleDraft}
              onChange={e => setTitleDraft(e.target.value)}
              onBlur={commitTitle}
              onKeyDown={e => { if (e.key === "Enter") commitTitle(); if (e.key === "Escape") { setTitleDraft(data.title); setEditingTitle(false); } }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div className={styles.title} onDoubleClick={e => { e.stopPropagation(); setEditingTitle(true); setTitleDraft(data.title); }}>
              {data.title}
            </div>
          )}
          <div className={styles.meta}>
            <span className={styles.assignee}>
              <span className={styles.assigneeAv} style={{ background: data.assigneeColor }}>{data.assigneeAvatar}</span>
              {data.assignee}
            </span>
            <span className={styles.due}>Due {data.dueDate}</span>
            {data.files.length > 0 && <span className={styles.count}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.5 2.5v4.5a1.5 1.5 0 01-3 0V3a2 2 0 014 0v4.5a.5.5 0 01-1 0V3.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" /></svg>
              {data.files.length}
            </span>}
            {data.comments.length > 0 && <span className={styles.count}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M8.5 6.5c0 .4-.3.8-.6.8H3.5l-1.7 1.7V2.8c0-.4.3-.8.6-.8h5.5c.3 0 .6.4.6.8v3.7z" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" /></svg>
              {data.comments.length}
            </span>}
          </div>
        </div>

        <div className={styles.right}>
          {data.approvals.length > 0 && (
            <div className={styles.approvalDots}>
              {data.approvals.map((a, i) => (
                <div key={i} className={`${styles.approvalDot} ${styles[`approvalDot_${a.status}`]}`}>
                  {a.status === "approved" ? "✓" : "·"}
                </div>
              ))}
            </div>
          )}
          <span className={styles.arrow} style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className={styles.expanded}>
          {/* Editable description */}
          {editingDesc ? (
            <div className={styles.descEdit}>
              <textarea
                ref={descRef}
                className={styles.descTextarea}
                value={descDraft}
                onChange={e => setDescDraft(e.target.value)}
                onBlur={commitDesc}
                onKeyDown={e => { if (e.key === "Escape") { setDescDraft(data.description); setEditingDesc(false); } }}
                onClick={e => e.stopPropagation()}
                rows={3}
              />
            </div>
          ) : (
            <div className={styles.desc} onClick={() => { setEditingDesc(true); setDescDraft(data.description); }}>
              {data.description || <span style={{ color: "var(--warm-400)", fontStyle: "italic" }}>Click to add a description...</span>}
            </div>
          )}

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === "files" ? styles.tabOn : ""}`} onClick={() => setActiveTab("files")}>
              Files <span className={styles.tabCount}>{data.files.length}</span>
            </button>
            <button className={`${styles.tab} ${activeTab === "comments" ? styles.tabOn : ""}`} onClick={() => setActiveTab("comments")}>
              Discussion <span className={styles.tabCount}>{data.comments.length}</span>
            </button>
            <button className={`${styles.tab} ${activeTab === "approvals" ? styles.tabOn : ""}`} onClick={() => setActiveTab("approvals")}>
              Approvals <span className={styles.tabCount}>{data.approvals.length === 0 ? "—" : `${data.approvals.filter(a => a.status === "approved").length}/${data.approvals.length}`}</span>
            </button>
          </div>

          <div className={styles.panel}>
            {/* Files — rich cards */}
            {activeTab === "files" && (
              <>
                {data.files.map(f => (
                  <div key={f.id} className={styles.fileCard}>
                    <div className={styles.fileCardIcon}>{getFileTypeIcon(f)}</div>
                    <div className={styles.fileCardInfo}>
                      <div className={styles.fileCardName}>{f.name}</div>
                      <div className={styles.fileCardMeta}>{f.size} · {f.uploadedBy} · {f.uploadedAt}</div>
                    </div>
                    <button className={styles.fileCardRemove} title="Remove" onClick={() => removeFile(f.id)}>×</button>
                  </div>
                ))}
                {/* Drop zone */}
                <div
                  className={`${styles.dropZone} ${dropHighlight ? styles.dropZoneActive : ""}`}
                  onClick={addMockFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  Drop files here or click to add
                </div>
              </>
            )}

            {/* Comments */}
            {activeTab === "comments" && (
              <>
                {data.comments.length === 0 && <div className={styles.empty}>No comments yet</div>}
                {data.comments.map(c => (
                  <div key={c.id} className={styles.comment}>
                    <div className={styles.commentAv} style={{ background: c.color }}>{c.avatar}</div>
                    <div className={styles.commentBody}>
                      <div className={styles.commentHead}>
                        <span className={styles.commentAuthor}>{c.user}</span>
                        <span className={styles.commentTime}>{c.time}</span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  </div>
                ))}
                <div className={styles.commentInput}>
                  <input className={styles.commentField} placeholder="Add a comment..." value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") addComment(); }} />
                  <button className={styles.commentSend} onClick={addComment} disabled={!commentText.trim()}>Post</button>
                </div>
              </>
            )}

            {/* Approvals */}
            {activeTab === "approvals" && (
              <>
                {data.approvals.length === 0 && <div className={styles.empty}>No approvals requested</div>}
                {data.approvals.map((a, i) => (
                  <div key={i} className={styles.approvalRow}>
                    <div className={styles.approvalAv} style={{ background: a.color }}>{a.avatar}</div>
                    <div className={styles.approvalInfo}>
                      <div className={styles.approvalName}>{a.user}</div>
                      {a.time && <div className={styles.approvalTime}>{a.time}</div>}
                    </div>
                    <span className={`${styles.approvalStatus} ${styles[`approvalStatus_${a.status}`]}`}>
                      {a.status === "approved" ? "✓ Approved" : "Pending"}
                    </span>
                  </div>
                ))}
                {data.status === "review" && (
                  <button className={styles.approveBtn} onClick={approve}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Approve
                  </button>
                )}
              </>
            )}
          </div>

          {/* Activity log — collapsible */}
          <div className={styles.collapsibleSection}>
            <div className={styles.collapsibleHeader} onClick={() => setActivityOpen(!activityOpen)}>
              <span className={styles.collapsibleTitle}>Activity</span>
              <span className={styles.collapsibleCount}>{activities.length}</span>
              <span className={`${styles.collapsibleArrow} ${activityOpen ? styles.collapsibleArrowOpen : ""}`}>▶</span>
            </div>
            {activityOpen && (
              <div className={styles.collapsibleBody}>
                {activities.length === 0 && <div className={styles.empty}>No activity yet</div>}
                {activities.map(a => (
                  <div key={a.id} className={styles.activityEntry}>
                    <span className={styles.activityBullet}>•</span>
                    <span className={styles.activityText}>{a.text}</span>
                    <span className={styles.activityTime}>{a.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kanban mini-board — collapsible */}
          <div className={styles.collapsibleSection}>
            <div className={styles.collapsibleHeader} onClick={() => setSubtasksOpen(!subtasksOpen)}>
              <span className={styles.collapsibleTitle}>Sub-tasks</span>
              <span className={styles.collapsibleCount}>{subtasks.length}</span>
              <span className={`${styles.collapsibleArrow} ${subtasksOpen ? styles.collapsibleArrowOpen : ""}`}>▶</span>
            </div>
            {subtasksOpen && (
              <div className={styles.kanban}>
                {(["todo", "doing", "done"] as const).map(col => (
                  <div
                    key={col}
                    className={styles.kanbanCol}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleTaskDrop(col)}
                  >
                    <div className={styles.kanbanColHeader}>
                      {col === "todo" ? "To Do" : col === "doing" ? "Doing" : "Done"}
                    </div>
                    {subtasks.filter(t => t.column === col).map(t => (
                      <div
                        key={t.id}
                        className={styles.kanbanCard}
                        draggable
                        onDragStart={() => handleTaskDragStart(t.id)}
                      >
                        {t.title}
                      </div>
                    ))}
                    {col === "todo" && (
                      <div className={styles.kanbanAdd}>
                        <input
                          className={styles.kanbanAddInput}
                          placeholder="New task..."
                          value={newTaskTitle}
                          onChange={e => setNewTaskTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") addSubtask(); }}
                          onClick={e => e.stopPropagation()}
                        />
                        <button className={styles.kanbanAddBtn} onClick={addSubtask} disabled={!newTaskTitle.trim()}>+</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
