"use client";

import { useState, useEffect, useRef } from "react";
import type { DeliverableData, DeliverableStatus, DeliverableFile, DeliverableComment } from "@/lib/types";
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

const FILE_ICONS: Record<string, { label: string; color: string }> = {
  pdf: { label: "PDF", color: "#c24b38" },
  fig: { label: "FIG", color: "#a259ff" },
  png: { label: "PNG", color: "#5b7fa4" },
  jpg: { label: "JPG", color: "#5b7fa4" },
  doc: { label: "DOC", color: "#2b579a" },
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || { label: "FILE", color: "#9b988f" };
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
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const cfg = STATUS_CONFIG[data.status];

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

  const commitTitle = () => {
    onChange({ ...data, title: titleDraft.trim() || "Untitled" });
    setEditingTitle(false);
  };

  const commitDesc = () => {
    onChange({ ...data, description: descDraft });
    setEditingDesc(false);
  };

  const updateStatus = (status: DeliverableStatus) => {
    onChange({ ...data, status });
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

  const simulateUpload = () => {
    const names = ["deliverable-draft.pdf", "design-v2.fig", "mockup.png", "brand-assets.zip"];
    const name = names[Math.floor(Math.random() * names.length)];
    const newFile: DeliverableFile = {
      id: uid(), name, size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedBy: "You", uploadedAt: "now",
    };
    onChange({
      ...data,
      files: [...data.files, newFile],
      status: data.status === "todo" ? "in-progress" : data.status,
    });
  };

  const approve = () => {
    const existing = data.approvals.find(a => a.user === "You");
    const updatedApprovals = existing
      ? data.approvals.map(a => a.user === "You" ? { ...a, status: "approved" as const, time: "now" } : a)
      : [...data.approvals, { user: "You", avatar: "A", color: "#b07d4f", status: "approved" as const, time: "now" }];

    // Auto-transition to approved if all approvals are in (and there is at least one)
    const allApproved = updatedApprovals.length > 0 && updatedApprovals.every(a => a.status === "approved");
    onChange({
      ...data,
      approvals: updatedApprovals,
      status: allApproved ? "approved" : data.status,
    });
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
            {/* Files */}
            {activeTab === "files" && (
              <>
                {data.files.map(f => {
                  const fi = getFileIcon(f.name);
                  return (
                    <div key={f.id} className={styles.file}>
                      <div className={styles.fileIcon} style={{ background: fi.color }}>{fi.label}</div>
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName}>{f.name}</div>
                        <div className={styles.fileMeta}>{f.size} · {f.uploadedBy} · {f.uploadedAt}</div>
                      </div>
                      <button className={styles.fileAct} title="Download">↓</button>
                    </div>
                  );
                })}
                <div className={styles.uploadZone} onClick={simulateUpload}>
                  <span className={styles.uploadIcon}>↑</span>
                  <span className={styles.uploadText}>Drop files or click to upload</span>
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
        </div>
      )}
    </div>
  );
}
