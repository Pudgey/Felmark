"use client";

import { useState, useEffect, useRef } from "react";
import type { Block } from "@/lib/types";
import styles from "./ShareModal.module.css";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  blocks: Block[];
}

export default function ShareModal({ open, onClose, projectId, projectName, clientName, clientAvatar, clientColor, blocks }: ShareModalProps) {
  const [pin, setPin] = useState("");
  const [expires, setExpires] = useState("never");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [existing, setExisting] = useState<{ id: string; url: string; views: number; lastViewedAt: string | null; updatedAt: string; hasPin: boolean } | null>(null);
  const [checking, setChecking] = useState(false);
  const [wasUpdated, setWasUpdated] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: "neutral" | "success" | "error"; message: string } | null>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Check for existing share when modal opens
  useEffect(() => {
    if (!open || !projectId) return;
    setChecking(true);
    setFeedback(null);
    setCopied(false);
    fetch(`/api/share?projectId=${projectId}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Couldn't load share details.");
        }
        return data;
      })
      .then(data => {
        if (data.exists) {
          setExisting(data);
          setShareUrl(window.location.origin + data.url);
        } else {
          setExisting(null);
          setShareUrl(null);
        }
      })
      .catch(() => {
        setExisting(null);
        setShareUrl(null);
        setFeedback({ tone: "error", message: "Couldn't load the current share status. You can still create a fresh link." });
      })
      .finally(() => setChecking(false));
  }, [open, projectId]);

  if (!open) return null;

  const selectShareUrl = () => {
    const input = urlInputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          projectName,
          clientName,
          clientAvatar,
          clientColor,
          blocks,
          pin: pin || null,
          expiresInDays: expires === "never" ? null : parseInt(expires),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Couldn't save the share link.");
      }
      if (!data.url) {
        throw new Error("Share link was not returned.");
      }
      if (data.url) {
        setShareUrl(window.location.origin + data.url);
        setWasUpdated(data.updated);
        if (data.updated) {
          setExisting(prev => prev ? { ...prev, updatedAt: new Date().toISOString() } : prev);
          setFeedback({ tone: "success", message: "Shared link updated." });
        } else {
          setExisting({ id: data.id, url: data.url, views: 0, lastViewedAt: null, updatedAt: new Date().toISOString(), hasPin: !!pin });
          setFeedback({ tone: "success", message: "Share link ready." });
        }
      }
    } catch (error) {
      setFeedback({ tone: "error", message: error instanceof Error ? error.message : "Couldn't save the share link. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setFeedback({ tone: "success", message: "Link copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      selectShareUrl();
      setFeedback({ tone: "neutral", message: "Clipboard access was blocked. The link is selected so you can copy it manually." });
    }
  };

  const handleClose = () => {
    setPin("");
    setExpires("never");
    setCopied(false);
    setWasUpdated(false);
    setExisting(null);
    setShareUrl(null);
    setFeedback(null);
    onClose();
  };

  const feedbackNode = feedback ? (
    <div
      className={`${styles.feedback} ${feedback.tone === "error" ? styles.feedbackError : feedback.tone === "success" ? styles.feedbackSuccess : styles.feedbackNeutral}`}
      role={feedback.tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <span className={styles.feedbackDot} />
      <span>{feedback.message}</span>
    </div>
  ) : null;

  if (checking) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.body} style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-300)" }}>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Existing share — show link + stats + update button
  if (existing && shareUrl && !wasUpdated) {
    const timeAgo = existing.lastViewedAt
      ? `Last viewed ${new Date(existing.lastViewedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : "No views yet";

    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 6.5v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 12l2.5 2.5L17 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className={styles.headTitle}>Shared</span>
            </div>
            <button className={styles.closeBtn} onClick={handleClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className={styles.body}>
            {/* Link */}
            <div className={styles.urlRow}>
              <input ref={urlInputRef} className={styles.urlInput} value={shareUrl} readOnly onClick={e => (e.target as HTMLInputElement).select()} />
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            {feedbackNode}

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statVal}>{existing.views}</span>
                <span className={styles.statLabel}>views</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statVal}>{timeAgo}</span>
              </div>
              {existing.hasPin && (
                <div className={styles.stat}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="3" y="5.5" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M4.5 5.5V4a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1"/></svg>
                  <span className={styles.statLabel}>PIN protected</span>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className={styles.options}>
              <div className={styles.field}>
                <label className={styles.label}>{existing.hasPin ? "Change PIN" : "Add PIN"}</label>
                <input className={styles.input} type="text" placeholder={existing.hasPin ? "New PIN (or empty to remove)" : "Leave empty for no PIN"} value={pin} onChange={e => setPin(e.target.value)} maxLength={8} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Expires</label>
                <select className={styles.select} value={expires} onChange={e => setExpires(e.target.value)}>
                  <option value="never">Never</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>

            {/* Update button */}
            <button className={styles.createBtn} onClick={handleCreateOrUpdate} disabled={loading}>
              {loading ? "Updating..." : "Update shared content"}
            </button>

            <button className={styles.doneBtn} onClick={handleClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // Just updated — show confirmation
  if (wasUpdated && shareUrl) {
    return (
      <div className={styles.overlay} onClick={handleClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.head}>
            <div className={styles.headLeft}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 6.5v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 12l2.5 2.5L17 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className={styles.headTitle}>Share</span>
            </div>
            <button className={styles.closeBtn} onClick={handleClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className={styles.body}>
            <div className={styles.success}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#5a9a3c" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="#5a9a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Share updated</span>
            </div>
            <div className={styles.urlRow}>
              <input ref={urlInputRef} className={styles.urlInput} value={shareUrl} readOnly onClick={e => (e.target as HTMLInputElement).select()} />
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            {feedbackNode}
            <div className={styles.info}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M7 5v4M7 10.5v0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span>Same link, updated content. Your client will see the latest version.</span>
            </div>
            <button className={styles.doneBtn} onClick={handleClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  // New share — show create form
  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M15 6.5v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 12l2.5 2.5L17 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className={styles.headTitle}>Share</span>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.preview}>
            <div className={styles.previewAvatar} style={{ background: clientColor }}>{clientAvatar}</div>
            <div className={styles.previewInfo}>
              <span className={styles.previewClient}>{clientName}</span>
              <span className={styles.previewProject}>{projectName}</span>
            </div>
            <span className={styles.previewBlocks}>{blocks.length} blocks</span>
          </div>

          <div className={styles.options}>
            <div className={styles.field}>
              <label className={styles.label}>PIN protection</label>
              <input className={styles.input} type="text" placeholder="Leave empty for no PIN" value={pin} onChange={e => setPin(e.target.value)} maxLength={8} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Expires</label>
              <select className={styles.select} value={expires} onChange={e => setExpires(e.target.value)}>
                <option value="never">Never</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
          </div>

          <div className={styles.info}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1"/><path d="M7 5v4M7 10.5v0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span>Your client will see a read-only, branded version of this document. They can leave comments and approve deliverables.</span>
          </div>
          {feedbackNode}

          <button className={styles.createBtn} onClick={handleCreateOrUpdate} disabled={loading}>
            {loading ? "Creating..." : "Create share link"}
          </button>
        </div>
      </div>
    </div>
  );
}
