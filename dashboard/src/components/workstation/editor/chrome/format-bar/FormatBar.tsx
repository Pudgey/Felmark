"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./FormatBar.module.css";

interface FormatBarProps {
  top: number;
  left: number;
}

export default function FormatBar({ top, left }: FormatBarProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const exec = (cmd: string, value?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand(cmd, false, value);
  };

  // Focus input when link mode opens
  useEffect(() => {
    if (!showLinkInput) return;
    // Pre-fill with existing link if selection is inside one — deferred to avoid synchronous setState
    const frame = requestAnimationFrame(() => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const anchor = sel.anchorNode?.parentElement?.closest("a");
        if (anchor) setLinkUrl(anchor.getAttribute("href") || "");
      }
    });
    setTimeout(() => linkInputRef.current?.focus(), 50);
    return () => cancelAnimationFrame(frame);
  }, [showLinkInput]);

  const insertLink = () => {
    const url = linkUrl.trim();
    if (!url) {
      // Remove link if URL is empty
      document.execCommand("unlink");
    } else {
      // Add https if no protocol
      const fullUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      document.execCommand("createLink", false, fullUrl);
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const removeLink = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("unlink");
    setShowLinkInput(false);
    setLinkUrl("");
  };

  // Check if selection is inside a link
  const isLinked = (() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    return !!sel.anchorNode?.parentElement?.closest("a");
  })();

  if (showLinkInput) {
    return (
      <div className={styles.bar} style={{ top, left }}>
        <div className={styles.linkRow}>
          <svg className={styles.linkIcon} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 8a3 3 0 004 .5l1.5-1.5a3 3 0 00-4.2-4.2L6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M8 6a3 3 0 00-4-.5L2.5 7a3 3 0 004.2 4.2L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            ref={linkInputRef}
            className={styles.linkInput}
            placeholder="Paste or type URL..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") { e.preventDefault(); insertLink(); }
              if (e.key === "Escape") { e.preventDefault(); setShowLinkInput(false); setLinkUrl(""); }
            }}
          />
          <button className={styles.linkApply} onMouseDown={e => { e.preventDefault(); insertLink(); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {isLinked && (
            <button className={styles.linkRemove} onMouseDown={removeLink} title="Remove link">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bar} style={{ top, left }}>
      <button className={styles.btn} onMouseDown={exec("bold")} style={{ fontWeight: 700 }}>B</button>
      <button className={styles.btn} onMouseDown={exec("italic")} style={{ fontStyle: "italic" }}>I</button>
      <button className={styles.btn} onMouseDown={exec("underline")} style={{ textDecoration: "underline" }}>U</button>
      <button className={styles.btn} onMouseDown={exec("strikethrough")} style={{ textDecoration: "line-through" }}>S</button>
      <div className={styles.sep} />
      <button className={styles.btn} onMouseDown={exec("formatBlock", "pre")} style={{ fontFamily: "monospace", fontSize: 11 }}>{"<>"}</button>
      <div className={styles.sep} />
      <button className={`${styles.btn} ${isLinked ? styles.btnActive : ""}`} onMouseDown={e => { e.preventDefault(); setShowLinkInput(true); }} title="Insert link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M6 8a3 3 0 004 .5l1.5-1.5a3 3 0 00-4.2-4.2L6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8 6a3 3 0 00-4-.5L2.5 7a3 3 0 004.2 4.2L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
