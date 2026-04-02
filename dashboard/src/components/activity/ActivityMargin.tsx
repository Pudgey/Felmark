"use client";

import { useState, useEffect } from "react";
import type { Block } from "@/lib/types";
import styles from "./ActivityMargin.module.css";

export interface BlockActivity {
  blockId: string;
  editedBy?: string;
  editedAt?: string;
  edits?: number;
  hot?: boolean;
  isNew?: boolean;
  typing?: boolean;
  note?: string;
  comment?: {
    user: string;
    text: string;
    time: string;
    unread?: boolean;
  };
}

interface TeamMember {
  id: string;
  name: string;
  short: string;
  avatar: string;
  color: string;
  online: boolean;
}

const TEAM: TeamMember[] = [
  { id: "u1", name: "You", short: "You", avatar: "A", color: "#b07d4f", online: true },
  { id: "u2", name: "Jamie Park", short: "Jamie", avatar: "J", color: "#7c8594", online: true },
  { id: "u3", name: "Sarah Chen", short: "Sarah", avatar: "S", color: "#8a7e63", online: false },
  { id: "u4", name: "Marcus Cole", short: "Marcus", avatar: "M", color: "#5a9a3c", online: true },
];

const getUser = (id: string) => TEAM.find(u => u.id === id) || TEAM[0];

export const INITIAL_ACTIVITIES: BlockActivity[] = [
  { blockId: "init-1", editedBy: "u1", editedAt: "2h ago", edits: 3 },
  { blockId: "init-2", editedBy: "u1", editedAt: "2h ago", edits: 1 },
  { blockId: "init-3", editedBy: "u3", editedAt: "Yesterday", note: "Sarah reviewed",
    comment: { user: "u3", text: "Can we make the logo section more specific? I want exact minimum sizes.", time: "2m ago", unread: true } },
  { blockId: "init-4", editedBy: "u2", editedAt: "15m ago", typing: true },
  { blockId: "init-5", editedBy: "u2", editedAt: "15m ago", edits: 8, hot: true },
  { blockId: "init-6", editedBy: "u2", editedAt: "12m ago", edits: 2,
    comment: { user: "u2", text: "I'd suggest adding a 'don't' section with misuse examples.", time: "15m ago" } },
  { blockId: "init-7", editedBy: "u2", editedAt: "10m ago", edits: 1, isNew: true },
];

const TIMELINE = [
  { time: "9:20", text: "You started editing", color: "#b07d4f" },
  { time: "9:35", text: "Jamie joined", color: "#7c8594" },
  { time: "10:15", text: "Jamie edited Typography", color: "#7c8594" },
  { time: "11:30", text: "Sarah commented on Scope", color: "#8a7e63" },
  { time: "now", text: "Jamie typing in Typography", color: "#7c8594", now: true },
];

interface ActivityMarginProps {
  open: boolean;
  onClose: () => void;
  blocks: Block[];
  activities: BlockActivity[];
  onActivitiesChange: (activities: BlockActivity[]) => void;
  hoveredBlock: string | null;
  onHoverBlock: (id: string | null) => void;
  pendingHighlight?: string | null;
  onHighlightConsumed?: () => void;
  onScrollToBlock?: (blockId: string) => void;
}

export default function ActivityMargin({ open, onClose, blocks: _blocks, activities, onActivitiesChange, hoveredBlock, onHoverBlock, pendingHighlight, onHighlightConsumed, onScrollToBlock }: ActivityMarginProps) {
  const [filter, setFilter] = useState<"all" | "comments" | "edits" | "active">("all");
  const [expandedComment, setExpandedComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Handle incoming highlight from block comment button
  useEffect(() => {
    if (pendingHighlight && open) {
      setActiveHighlight(pendingHighlight);
      setShowNew(true);
      onHighlightConsumed?.();
    }
  }, [pendingHighlight, open, onHighlightConsumed]);

  const activeBlockCount = activities.filter(a => a.typing || a.hot).length;
  const commentCount = activities.filter(a => a.comment).length;
  const onlineCount = TEAM.filter(u => u.online).length;

  const addComment = () => {
    if (!newComment.trim()) return;
    const newActivity: BlockActivity = {
      blockId: `new-${Math.random().toString(36).slice(2, 10)}`,
      editedBy: "u1",
      editedAt: "now",
      comment: { user: "u1", text: newComment.trim(), time: "now" },
    };
    onActivitiesChange([newActivity, ...activities]);
    setNewComment("");
    setShowNew(false);
    setActiveHighlight(null);
  };

  // Filter activities
  const filtered = activities.filter(a => {
    if (filter === "comments") return !!a.comment;
    if (filter === "edits") return !!a.editedBy && !a.comment;
    if (filter === "active") return a.typing || a.hot;
    return true;
  });

  if (!open) return null;

  return (
    <div className={styles.margin}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headTop}>
          <span className={styles.headTitle}>activity</span>
          <div className={styles.headStats}>
            <span className={styles.headStat}><span className={styles.headDot} style={{ background: "var(--ember)" }} />{activeBlockCount} live</span>
            <span className={styles.headStat}><span className={styles.headDot} style={{ background: "#5b7fa4" }} />{commentCount}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Presence */}
        <div className={styles.presence}>
          {TEAM.filter(u => u.online).map(u => (
            <div key={u.id} className={styles.presenceAv} style={{ background: u.color }}>{u.avatar}</div>
          ))}
          <span className={styles.presenceDot} />
          <span className={styles.presenceText}>{onlineCount} online</span>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          {(["all", "comments", "edits", "active"] as const).map(f => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterBtnOn : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "comments" ? "Comments" : f === "edits" ? "Edits" : "Live"}
            </button>
          ))}
        </div>
      </div>

      {/* New comment */}
      {showNew && (
        <div className={styles.newComment}>
          {activeHighlight && (
            <div className={styles.newHighlight}>
              <span className={styles.newHighlightLabel}>on</span>
              <span className={styles.newHighlightText}>"{activeHighlight}"</span>
            </div>
          )}
          <div className={styles.newInputRow}>
            <input className={styles.newInput} placeholder="Add a comment..." value={newComment}
              onChange={e => setNewComment(e.target.value)} autoFocus
              onKeyDown={e => { if (e.key === "Enter") addComment(); if (e.key === "Escape") { setShowNew(false); setActiveHighlight(null); } }} />
            <button className={styles.newSend} onClick={addComment} disabled={!newComment.trim()}>Post</button>
          </div>
        </div>
      )}

      {/* Activity list */}
      <div className={styles.scroll}>
        {filtered.length === 0 && (
          <div className={styles.empty}>No {filter === "all" ? "" : filter} activity on this document</div>
        )}

        {filtered.map(a => {
          const user = a.editedBy ? getUser(a.editedBy) : null;
          const commentUser = a.comment ? getUser(a.comment.user) : null;
          const isHighlighted = hoveredBlock === a.blockId;

          return (
            <div key={a.blockId}
              className={`${styles.item} ${isHighlighted ? styles.itemHighlighted : ""}`}
              onMouseEnter={() => onHoverBlock(a.blockId)}
              onMouseLeave={() => onHoverBlock(null)}
              onDoubleClick={() => onScrollToBlock?.(a.blockId)}
              title="Double-click to jump to block"
            >
              {/* Edit indicator */}
              {user && (
                <div className={styles.edit}>
                  <div className={styles.editAv} style={{ background: user.color }}>{user.avatar}</div>
                  <div className={styles.editInfo}>
                    <span className={styles.editWho}>{user.short}</span>
                    <div className={styles.editMeta}>
                      <span>{a.editedAt}</span>
                      {a.edits && <span className={styles.editCount}>· {a.edits} edits</span>}
                      {a.hot && <span className={styles.hotBadge}>ACTIVE</span>}
                      {a.isNew && <span className={styles.newBadge}>NEW</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* Typing */}
              {a.typing && user && (
                <div className={styles.typing}>
                  <span className={styles.typingDots}><span /><span /><span /></span>
                  {user.short} is typing...
                </div>
              )}

              {/* Note */}
              {a.note && <div className={styles.note}>{a.note}</div>}

              {/* Comment */}
              {a.comment && commentUser && (
                <div className={`${styles.comment} ${expandedComment === a.blockId ? styles.commentExpanded : ""} ${a.comment.unread ? styles.commentUnread : ""}`}
                  onClick={() => setExpandedComment(expandedComment === a.blockId ? null : a.blockId)}>
                  <div className={styles.commentHead}>
                    <div className={styles.commentAv} style={{ background: commentUser.color }}>{commentUser.avatar}</div>
                    <span className={styles.commentAuthor}>{commentUser.name}</span>
                    <span className={styles.commentTime}>{a.comment.time}</span>
                  </div>
                  <div className={styles.commentText}>{a.comment.text}</div>
                  {expandedComment === a.blockId && a.comment.user !== "u1" && (
                    <div className={styles.commentReply} onClick={e => e.stopPropagation()}>
                      <input placeholder="Reply..." value={replyText} onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && replyText.trim()) {
                            onActivitiesChange([{ blockId: a.blockId, editedBy: "u1", editedAt: "now", comment: { user: "u1", text: replyText.trim(), time: "now" } }, ...activities]);
                            setReplyText("");
                            setExpandedComment(null);
                          }
                        }} />
                      <button className={styles.replyBtn} onClick={() => {
                        if (!replyText.trim()) return;
                        onActivitiesChange([{ blockId: a.blockId, editedBy: "u1", editedAt: "now", comment: { user: "u1", text: replyText.trim(), time: "now" } }, ...activities]);
                        setReplyText("");
                        setExpandedComment(null);
                      }}>Reply</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Session timeline */}
      <div className={styles.timeline}>
        <div className={styles.timelineLabel}>session timeline</div>
        {TIMELINE.map((t, i) => (
          <div key={i} className={`${styles.timelineRow} ${t.now ? styles.timelineRowNow : ""}`}>
            <span className={styles.timelineTime}>{t.time}</span>
            <span className={styles.timelineDot} style={{ background: t.now ? undefined : t.color }} />
            <span className={styles.timelineText}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
