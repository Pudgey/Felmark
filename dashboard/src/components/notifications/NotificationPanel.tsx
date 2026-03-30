"use client";

import { useState } from "react";
import styles from "./NotificationPanel.module.css";

export interface Notification {
  id: string;
  type: "payment" | "comment" | "view" | "signed" | "overdue" | "edit" | "deadline" | "proposal" | "wire" | "milestone";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  action: string;
  project?: string;
  projectColor?: string;
  workspace?: string;
  avatar?: string;
  avatarBg?: string;
  pro?: boolean;
}

const TYPE_CONFIG: Record<string, { icon: string; bg: string; color: string }> = {
  payment:   { icon: "$",  bg: "rgba(90, 154, 60, 0.08)",   color: "#5a9a3c" },
  comment:   { icon: "→",  bg: "rgba(138, 126, 99, 0.08)",  color: "#8a7e63" },
  view:      { icon: "◎",  bg: "rgba(91, 127, 164, 0.08)",  color: "#5b7fa4" },
  signed:    { icon: "✓",  bg: "rgba(90, 154, 60, 0.08)",   color: "#5a9a3c" },
  overdue:   { icon: "!",  bg: "rgba(194, 75, 56, 0.08)",   color: "#c24b38" },
  edit:      { icon: "✎",  bg: "rgba(124, 133, 148, 0.08)", color: "#7c8594" },
  deadline:  { icon: "⏱",  bg: "rgba(200, 147, 96, 0.08)",  color: "#c89360" },
  proposal:  { icon: "↗",  bg: "rgba(176, 125, 79, 0.08)",  color: "#b07d4f" },
  wire:      { icon: "◆",  bg: "rgba(176, 125, 79, 0.08)",  color: "#b07d4f" },
  milestone: { icon: "⬡",  bg: "rgba(90, 154, 60, 0.08)",   color: "#5a9a3c" },
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onNotificationClick?: (notif: Notification) => void;
  onNotificationAction?: (notif: Notification) => void;
}

type Filter = "all" | "unread" | "payments" | "comments" | "deadlines" | "clients";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  unread: "Unread",
  payments: "Payments",
  comments: "Comments",
  deadlines: "Deadlines",
  clients: "Clients",
};

export default function NotificationPanel({ open, onClose, notifications, onMarkAllRead, onMarkRead, onNotificationClick, onNotificationAction }: NotificationPanelProps) {
  const [filter, setFilter] = useState<Filter>("all");

  if (!open) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "payments") return n.type === "payment";
    if (filter === "comments") return n.type === "comment" || n.type === "edit";
    if (filter === "deadlines") return n.type === "deadline" || n.type === "overdue";
    if (filter === "clients") return n.type === "signed" || n.type === "view";
    return true;
  });

  // Group by relative time
  const groups: { label: string; items: Notification[] }[] = [];
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  for (const n of filtered) {
    if (n.time.includes("m ago") || n.time.includes("h ago") || n.time === "Just now" || n.time === "Today") {
      today.push(n);
    } else if (n.time.includes("Yesterday")) {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  }

  if (today.length > 0) groups.push({ label: "Today", items: today });
  if (yesterday.length > 0) groups.push({ label: "Yesterday", items: yesterday });
  if (earlier.length > 0) groups.push({ label: "Earlier", items: earlier });

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Notifications</span>
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close notifications">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Filters + mark all */}
      <div className={styles.actions}>
        <div className={styles.filters}>
          {(["all", "unread", "payments", "comments", "deadlines", "clients"] as Filter[]).map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={onMarkAllRead}>Mark all read</button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M12 16a8 8 0 0116 0v5l3 4H9l3-4v-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M16 29a4 4 0 008 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>
            {filter === "all" ? "All caught up" : filter === "unread" ? "No unread notifications" : `No ${FILTER_LABELS[filter].toLowerCase()}`}
          </div>
          <div className={styles.emptySub}>
            {filter === "all" ? "You're on top of everything. Nice." : "Check back later for new updates."}
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {groups.map(group => (
            <div key={group.label}>
              <div className={styles.groupLabel}>{group.label}</div>
              {group.items.map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.edit;
                return (
                  <div
                    key={n.id}
                    className={`${styles.item} ${!n.read ? styles.itemUnread : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (!n.read) onMarkRead(n.id);
                      onNotificationClick?.(n);
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (!n.read) onMarkRead(n.id);
                        onNotificationClick?.(n);
                      }
                    }}
                  >
                    {/* Icon or Avatar */}
                    {n.avatar ? (
                      <div className={styles.itemIconAvatar} style={{ background: n.avatarBg || "var(--ink-400)" }}>
                        {n.avatar}
                      </div>
                    ) : (
                      <div className={styles.itemIcon} style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon}
                      </div>
                    )}

                    <div className={styles.itemBody}>
                      <div className={styles.itemTitle}>{n.title}</div>
                      <div className={styles.itemDesc}>{n.desc}</div>
                      <div className={styles.itemFooter}>
                        <span className={styles.itemTime}>{n.time}</span>
                        {n.workspace && (
                          <span className={styles.itemWs}>{n.workspace}</span>
                        )}
                        {n.pro && (
                          <span className={styles.itemPro}>PRO</span>
                        )}
                      </div>
                      {n.project && (
                        <span className={styles.itemProject}>
                          <span className={styles.itemProjectDot} style={{ background: n.projectColor || "var(--warm-300)" }} />
                          {n.project}
                        </span>
                      )}
                    </div>

                    {/* Action button */}
                    <button
                      className={styles.itemAction}
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotificationAction?.(n);
                      }}
                    >
                      {n.action}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>You&apos;re up to date</div>
    </div>
  );
}
