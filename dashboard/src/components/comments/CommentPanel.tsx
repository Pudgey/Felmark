"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./CommentPanel.module.css";

const uid = () => Math.random().toString(36).slice(2, 10);

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
  resolved: boolean;
  highlight?: string;
  blockId?: string;
  replies: Reply[];
}

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: uid(), author: "Sarah Chen", avatar: "S", color: "#8a7e63",
    text: "Can we make the logo usage section more specific? I want exact minimum sizes.",
    time: "2m ago", resolved: false, highlight: "Primary & secondary logo usage rules",
    replies: [],
  },
  {
    id: uid(), author: "Jamie Park", avatar: "J", color: "#7c8594",
    text: "I'd suggest adding a 'don't' section with examples of incorrect usage.",
    time: "15m ago", resolved: false,
    replies: [
      { id: uid(), author: "You", avatar: "A", color: "#b07d4f", text: "Good call — I'll add a misuse grid.", time: "8m ago" },
    ],
  },
  {
    id: uid(), author: "You", avatar: "A", color: "#b07d4f",
    text: "Need to confirm hex values with the client before finalizing.",
    time: "1h ago", resolved: true, highlight: "Color palette with hex/RGB/CMYK",
    replies: [],
  },
];

interface CommentPanelProps {
  open: boolean;
  onClose: () => void;
  pendingHighlight?: string | null;
  onHighlightConsumed?: () => void;
  comments: Comment[];
  onCommentsChange: (comments: Comment[]) => void;
}

export default function CommentPanel({ open, onClose, pendingHighlight, onHighlightConsumed, comments, onCommentsChange }: CommentPanelProps) {
  const setComments = (updater: Comment[] | ((prev: Comment[]) => Comment[])) => {
    const next = typeof updater === "function" ? updater(comments) : updater;
    onCommentsChange(next);
  };
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [showResolved, setShowResolved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const newInputRef = useRef<HTMLInputElement>(null);

  const openComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  useEffect(() => {
    if (showNew && newInputRef.current) newInputRef.current.focus();
  }, [showNew]);

  // Auto-open new comment form when a block highlight arrives
  useEffect(() => {
    if (!pendingHighlight || !open) return;
    const frame = requestAnimationFrame(() => {
      setActiveHighlight(pendingHighlight);
      setShowNew(true);
      onHighlightConsumed?.();
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingHighlight, open, onHighlightConsumed]);

  const resolve = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: true } : c));
    setExpandedId(null);
  };

  const unresolve = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: false } : c));
  };

  const addReply = (commentId: string) => {
    const text = replyDrafts[commentId]?.trim();
    if (!text) return;
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, {
        id: uid(), author: "You", avatar: "A", color: "#b07d4f", text, time: "now",
      }]} : c
    ));
    setReplyDrafts(prev => ({ ...prev, [commentId]: "" }));
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [{
      id: uid(), author: "You", avatar: "A", color: "#b07d4f",
      text: newComment.trim(), time: "now", resolved: false,
      highlight: activeHighlight || undefined,
      replies: [],
    }, ...prev]);
    setNewComment("");
    setActiveHighlight(null);
    setShowNew(false);
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    setExpandedId(null);
  };

  if (!open) return null;

  const renderCard = (c: Comment, isResolved: boolean) => {
    const isExpanded = expandedId === c.id;
    return (
      <div
        key={c.id}
        className={`${styles.card} ${isExpanded ? styles.cardExpanded : ""} ${isResolved ? styles.cardResolved : ""}`}
        onClick={() => setExpandedId(isExpanded ? null : c.id)}
      >
        <div className={styles.cardHeader}>
          <div className={styles.avatar} style={{ background: c.color }}>{c.avatar}</div>
          <div className={styles.headerInfo}>
            <span className={styles.author}>{c.author}</span>
            <span className={styles.time}>{c.time}</span>
          </div>
          {!isResolved && <div className={styles.openDot} />}
          {isResolved && <span className={styles.resolvedBadge}>resolved</span>}
        </div>

        <p className={styles.text}>{c.text}</p>

        {c.highlight && (
          <span className={styles.ref}>&ldquo;{c.highlight}&rdquo;</span>
        )}

        {/* Replies */}
        {c.replies.length > 0 && (isExpanded || c.replies.length <= 1) && c.replies.map(r => (
          <div key={r.id} className={styles.reply}>
            <div className={styles.replyAv} style={{ background: r.color }}>{r.avatar}</div>
            <div>
              <span className={styles.replyAuthor}>{r.author}</span>
              <p className={styles.replyText}>{r.text}</p>
            </div>
          </div>
        ))}

        {!isExpanded && c.replies.length > 1 && (
          <span className={styles.replyCount}>{c.replies.length} replies</span>
        )}

        {/* Expanded actions */}
        {isExpanded && (
          <div onClick={e => e.stopPropagation()}>
            <div className={styles.inputRow}>
              <input
                className={styles.replyInput}
                placeholder="Reply..."
                value={replyDrafts[c.id] || ""}
                onChange={e => setReplyDrafts(prev => ({ ...prev, [c.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter") addReply(c.id); }}
              />
              <button className={styles.sendBtn} onClick={() => addReply(c.id)} disabled={!replyDrafts[c.id]?.trim()}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M3.5 5L6 2.5 8.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <div className={styles.actions}>
              {!isResolved ? (
                <button className={styles.resolveBtn} onClick={() => resolve(c.id)}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Resolve
                </button>
              ) : (
                <button className={styles.unresolveBtn} onClick={() => unresolve(c.id)}>Reopen</button>
              )}
              <button className={styles.deleteBtn} onClick={() => deleteComment(c.id)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3h6M3 3v5a.8.8 0 00.8.8h2.4a.8.8 0 00.8-.8V3M4 3V2h2v1" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Comments</span>
        <span className={styles.count}>{openComments.length} open</span>
        <div className={styles.headerActions}>
          <button className={styles.iconBtn} onClick={() => setShowNew(!showNew)} title="New comment">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <button className={styles.iconBtn} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* New comment input */}
      {showNew && (
        <div className={styles.newComment}>
          {activeHighlight && (
            <div className={styles.newHighlight}>
              <span className={styles.newHighlightLabel}>commenting on</span>
              <p className={styles.newHighlightText}>&ldquo;{activeHighlight}&rdquo;</p>
              <button className={styles.newHighlightClear} onClick={() => setActiveHighlight(null)}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
              </button>
            </div>
          )}
          <div className={styles.newInputRow}>
            <input
              ref={newInputRef}
              className={styles.newInput}
              placeholder="Add a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") addComment();
                if (e.key === "Escape") { setShowNew(false); setActiveHighlight(null); }
              }}
            />
            <button className={styles.newSend} onClick={addComment} disabled={!newComment.trim()}>
              Post
            </button>
          </div>
        </div>
      )}

      {/* Open comments */}
      <div className={styles.list}>
        {openComments.map(c => renderCard(c, false))}

        {openComments.length === 0 && (
          <div className={styles.empty}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: "var(--warm-300)", marginBottom: 8 }}>
              <path d="M22 16c0 1-1 2-2 2H8l-4 4V6c0-1 1-2 2-2h14c1 0 2 1 2 2v10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span>No open comments</span>
          </div>
        )}

        {/* Resolved toggle */}
        {resolvedComments.length > 0 && (
          <>
            <button className={styles.resolvedToggle} onClick={() => setShowResolved(!showResolved)}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: showResolved ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.12s" }}>
                <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {resolvedComments.length} resolved
            </button>
            {showResolved && resolvedComments.map(c => renderCard(c, true))}
          </>
        )}
      </div>
    </div>
  );
}
