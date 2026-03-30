"use client";

import { useState } from "react";
import type { Block } from "@/lib/types";
import styles from "./ShareView.module.css";

interface ShareViewProps {
  projectName: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  blocks: Block[];
  createdAt: string;
}

function renderTable(rows: string[][]) {
  if (!rows || rows.length === 0) return null;
  const [header, ...body] = rows;
  return (
    <table className={styles.table}>
      <thead><tr>{header.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
      <tbody>{body.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci}>{cell}</td>)}</tr>)}</tbody>
    </table>
  );
}

function BlockRenderer({ block, index }: { block: Block; index: number }) {
  const [approved, setApproved] = useState(false);

  switch (block.type) {
    case "h1":
      return <h1 className={styles.h1} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "h2":
      return <h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "h3":
      return <h3 className={styles.h3} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "paragraph":
      return block.content ? <p className={styles.para} dangerouslySetInnerHTML={{ __html: block.content }} /> : <p className={styles.paraEmpty}>&nbsp;</p>;
    case "bullet":
      return (
        <div className={styles.bullet}>
          <span className={styles.bulletDot} />
          <span dangerouslySetInnerHTML={{ __html: block.content }} />
        </div>
      );
    case "numbered":
      return (
        <div className={styles.numbered}>
          <span className={styles.numIdx}>{index + 1}.</span>
          <span dangerouslySetInnerHTML={{ __html: block.content }} />
        </div>
      );
    case "todo":
      return (
        <div className={`${styles.todo} ${block.checked ? styles.todoDone : ""}`}>
          <span className={`${styles.todoCheck} ${block.checked ? styles.todoChecked : ""}`}>
            {block.checked && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
          </span>
          <span dangerouslySetInnerHTML={{ __html: block.content }} />
        </div>
      );
    case "quote":
      return <blockquote className={styles.quote} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "callout":
      return <div className={styles.callout} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "code":
      return <pre className={styles.code} dangerouslySetInnerHTML={{ __html: block.content }} />;
    case "divider":
      return <hr className={styles.divider} />;
    case "table":
      return block.tableData ? <div className={styles.tableWrap}>{renderTable(block.tableData.rows)}</div> : null;
    case "deliverable":
      if (!block.deliverableData) return null;
      return (
        <div className={styles.deliverable}>
          <div className={styles.delivHead}>
            <span className={styles.delivStatus} style={{ background: approved ? "rgba(90,154,60,0.08)" : "rgba(176,125,79,0.08)", color: approved ? "#5a9a3c" : "#b07d4f" }}>
              {approved ? "Approved" : block.deliverableData.status}
            </span>
            <span className={styles.delivTitle}>{block.deliverableData.title}</span>
            {block.deliverableData.dueDate && <span className={styles.delivDue}>{block.deliverableData.dueDate}</span>}
          </div>
          {block.deliverableData.description && <p className={styles.delivDesc}>{block.deliverableData.description}</p>}
          {!approved && (
            <button className={styles.approveBtn} onClick={() => setApproved(true)}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Approve
            </button>
          )}
        </div>
      );
    default:
      return block.content ? <div className={styles.para} dangerouslySetInnerHTML={{ __html: block.content }} /> : null;
  }
}

export default function ShareView({ projectName, clientName, clientAvatar, clientColor, blocks, createdAt }: ShareViewProps) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ name: string; text: string; time: string }[]>([]);
  const [commentSent, setCommentSent] = useState(false);

  const date = new Date(createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Track numbered list indices
  let numIdx = 0;
  const getNumIdx = (type: string) => {
    if (type === "numbered") { numIdx++; return numIdx; }
    numIdx = 0;
    return 0;
  };

  const handleComment = () => {
    if (!commentName.trim() || !commentText.trim()) return;
    setComments(prev => [...prev, { name: commentName, text: commentText, time: "just now" }]);
    setCommentText("");
    setCommentSent(true);
    setTimeout(() => setCommentSent(false), 2000);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.avatar} style={{ background: clientColor }}>{clientAvatar}</div>
          <div className={styles.headerInfo}>
            <span className={styles.headerClient}>{clientName}</span>
            <span className={styles.headerProject}>{projectName}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.headerDate}>{date}</span>
        </div>
      </header>

      {/* Document body */}
      <main className={styles.body}>
        <article className={styles.doc}>
          {blocks.map((block, i) => {
            const idx = getNumIdx(block.type);
            return <BlockRenderer key={block.id || i} block={block} index={idx - 1} />;
          })}
        </article>
      </main>

      {/* Comment section */}
      {comments.length > 0 && (
        <div className={styles.commentsSection}>
          <div className={styles.commentsInner}>
            <div className={styles.commentsLabel}>Comments</div>
            {comments.map((c, i) => (
              <div key={i} className={styles.commentItem}>
                <div className={styles.commentAvatar}>{c.name.charAt(0).toUpperCase()}</div>
                <div className={styles.commentBody}>
                  <span className={styles.commentName}>{c.name}</span>
                  <span className={styles.commentTime}>{c.time}</span>
                  <p className={styles.commentText}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          {!commentOpen ? (
            <>
              <button className={styles.commentBtn} onClick={() => setCommentOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 10.5c0 .7-.5 1.2-1 1.2H5l-3 3V4.5c0-.7.5-1.2 1-1.2h9.5c.5 0 1 .5 1 1.2v6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                Leave feedback
              </button>
              <div className={styles.powered}>
                <svg width="14" height="14" viewBox="0 0 28 28" fill="none" style={{ opacity: 0.4 }}>
                  <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="currentColor" opacity="0.15" />
                </svg>
                <span>Shared via Felmark</span>
              </div>
            </>
          ) : (
            <div className={styles.commentForm}>
              <input
                className={styles.commentInput}
                placeholder="Your name"
                value={commentName}
                onChange={e => setCommentName(e.target.value)}
              />
              <input
                className={styles.commentInput}
                placeholder="Leave a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleComment()}
                style={{ flex: 2 }}
              />
              <button className={styles.commentSend} onClick={handleComment}>
                {commentSent ? "Sent!" : "Send"}
              </button>
              <button className={styles.commentCancel} onClick={() => setCommentOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
