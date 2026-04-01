"use client";

import { useState } from "react";
import type { CommentThreadData } from "@/lib/types";
import styles from "./CommentThreadBlock.module.css";

export function getDefaultCommentThread(): CommentThreadData {
  return { messages: [{ id: "m1", author: "You", text: "Starting a new thread here...", time: "Just now" }], resolved: false };
}

export default function CommentThreadBlock({ data, onChange }: { data: CommentThreadData; onChange: (d: CommentThreadData) => void }) {
  const [draft, setDraft] = useState("");

  const addMessage = () => {
    if (!draft.trim()) return;
    onChange({ ...data, messages: [...data.messages, { id: `m${Date.now()}`, author: "You", text: draft.trim(), time: "Just now" }] });
    setDraft("");
  };

  return (
    <div className={`${styles.thread} ${data.resolved ? styles.threadResolved : ""}`}>
      <div className={styles.threadHeader}>
        <div className={styles.threadIcon}>{"\uD83D\uDCAC"}</div>
        <span className={styles.blockLabel} style={{ color: "var(--ember)" }}>Thread</span>
        <span className={styles.blockMeta}>{data.messages.length} message{data.messages.length !== 1 ? "s" : ""}</span>
        <button className={styles.blockBtnSmall} style={{ marginLeft: "auto" }} onClick={() => onChange({ ...data, resolved: !data.resolved })}>
          {data.resolved ? "Reopen" : "Resolve"}
        </button>
      </div>
      {data.messages.map(msg => (
        <div key={msg.id} className={styles.threadMsg}>
          <div className={styles.threadAvatar}>{msg.author[0]}</div>
          <div>
            <span className={styles.threadAuthor}>{msg.author}</span>
            <span className={styles.threadTime}>{msg.time}</span>
            <div className={styles.threadText}>{msg.text}</div>
          </div>
        </div>
      ))}
      {!data.resolved && (
        <div className={styles.threadCompose}>
          <input className={styles.threadComposeInput} placeholder="Reply..." value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addMessage(); }} />
          <button className={styles.threadSendBtn} onClick={addMessage}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7L2 2v4l5 1-5 1v4l10-5z" fill="currentColor" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export { CommentThreadBlock };
