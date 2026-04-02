"use client";

import type { Notification } from "../../../../../notifications/NotificationPanel";
import styles from "./Toolbar.module.css";

const TERMINAL_SPLIT_ID = "__terminal__";

interface ToolbarProps {
  breathe: boolean;
  setBreathe: (fn: (prev: boolean) => boolean) => void;
  splitProject?: string | null;
  onSplitOpen?: (projectId: string) => void;
  onSplitClose?: () => void;
  splitPickerOpen: boolean;
  setSplitPickerOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  splitPickerRef: React.RefObject<HTMLDivElement | null>;
  notifPanelOpen: boolean;
  setNotifPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  notifications: Notification[];
  commentPanelOpen: boolean;
  setCommentPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  shareOpen: boolean;
  setShareOpen: (open: boolean) => void;
  splitPickerContent: React.ReactNode;
}

export default function Toolbar({
  breathe,
  setBreathe,
  splitProject,
  onSplitOpen,
  onSplitClose,
  splitPickerOpen,
  setSplitPickerOpen,
  splitPickerRef,
  notifPanelOpen,
  setNotifPanelOpen,
  notifications,
  commentPanelOpen,
  setCommentPanelOpen,
  setHistoryOpen,
  setShareOpen,
  splitPickerContent,
}: ToolbarProps) {
  return (
    <div className={styles.tabBarRight}>
      <button
        className={`${styles.tabBarAction} ${breathe ? styles.tabBarActionActive : ""}`}
        title={breathe ? "Default width" : "Full width"}
        aria-label={breathe ? "Default width" : "Full width"}
        onClick={() => setBreathe((prev) => !prev)}
      >
        {breathe ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 2.25v3h3M6 13.75v-3H3M10 13.75v-3h3M6 2.25v3H3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 5.75v-3h3M13 5.75v-3h-3M3 10.25v3h3M13 10.25v3h-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <button
        className={`${styles.tabBarAction} ${splitProject === TERMINAL_SPLIT_ID ? styles.tabBarActionActive : ""}`}
        title="Terminal"
        aria-label="Terminal"
        onClick={() => {
          setSplitPickerOpen(false);
          if (splitProject === TERMINAL_SPLIT_ID) {
            onSplitClose?.();
          } else {
            onSplitOpen?.(TERMINAL_SPLIT_ID);
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1.75" y="2.5" width="12.5" height="11" rx="1.75" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.75 6.25L6.75 8L4.75 9.75" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.5 10.25H11.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <div style={{ position: "relative" }} ref={splitPickerRef}>
        <button
          className={`${styles.tabBarAction} ${splitPickerOpen || (splitProject !== null && splitProject !== TERMINAL_SPLIT_ID) ? styles.tabBarActionActive : ""}`}
          title="Split view"
          aria-label="Split view"
          onClick={() => {
            setSplitPickerOpen((p: boolean) => !p);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M8 2.5v11" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>
        {splitPickerOpen && splitPickerContent}
      </div>
      <button className={`${styles.tabBarAction} ${notifPanelOpen ? styles.tabBarActionActive : ""}`} title="Notifications" aria-label="Notifications" onClick={() => setNotifPanelOpen((p: boolean) => !p)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6.5a4 4 0 018 0v2.5l1.5 2H2.5L4 9V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className={styles.tabBarBadge}>{notifications.filter(n => !n.read).length}</span>
        )}
      </button>
      <button className={`${styles.tabBarAction} ${commentPanelOpen ? styles.tabBarActionActive : ""}`} title="Comments" aria-label="Comments" onClick={() => setCommentPanelOpen((p: boolean) => !p)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 10.5c0 .7-.5 1.2-1 1.2H5l-3 3V4.5c0-.7.5-1.2 1-1.2h9.5c.5 0 1 .5 1 1.2v6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5.5 6.5h5M5.5 9h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>
      <button className={styles.tabBarAction} title="History" aria-label="Version history" onClick={() => setHistoryOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 5.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 5.5L4 3.5M2.5 5.5H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className={styles.tabBarAction} title="Share" aria-label="Share document" onClick={() => setShareOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M15 6.5v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M10 10l2 2 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={styles.profileAvatar} title="Profile">A</div>
    </div>
  );
}
