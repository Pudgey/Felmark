"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./Toasts.module.css";

export type ToastType = "success" | "alert" | "info" | "neutral";

export interface Toast {
  id: string;
  type: ToastType;
  icon: string;
  title: string;
  desc: string;
  action?: string;
  time?: string;
  autoDismiss?: number; // ms, 0 = manual only
}

interface ToastsProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  onAction?: (id: string) => void;
}

export default function Toasts({ toasts, onDismiss, onAction }: ToastsProps) {
  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} onAction={onAction} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss, onAction }: { toast: Toast; onDismiss: (id: string) => void; onAction?: (id: string) => void }) {
  const [exiting, setExiting] = useState(false);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    if (!toast.autoDismiss) return;
    const t = setTimeout(dismiss, toast.autoDismiss);
    return () => clearTimeout(t);
  }, [toast.autoDismiss, dismiss]);

  return (
    <div className={`${styles.toast} ${styles[toast.type]} ${exiting ? styles.toastExit : styles.toastEnter}`}>
      <div className={`${styles.toastIcon} ${styles[`icon${toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}`]}`}>
        {toast.icon}
      </div>
      <div className={styles.toastBody}>
        <div className={styles.toastTitle}>{toast.title}</div>
        <div className={styles.toastDesc}>{toast.desc}</div>
        {toast.action && (
          <button className={styles.toastAction} onClick={() => onAction?.(toast.id)}>
            {toast.action}
          </button>
        )}
        {toast.time && <div className={styles.toastTime}>{toast.time}</div>}
      </div>
      <div className={styles.toastClose} onClick={dismiss}>&times;</div>
    </div>
  );
}

/* ── Demo toasts for workspace ── */
export const DEMO_TOASTS: Toast[] = [
  { id: "t1", type: "success", icon: "$", title: "Payment received", desc: "Nora Kim paid $2,200 for Invoice #045", time: "just now", autoDismiss: 8000 },
  { id: "t2", type: "alert", icon: "!", title: "Invoice overdue", desc: "Bolt Fitness #047 is 4 days late \u2014 $4,000", action: "Send Reminder", autoDismiss: 0 },
  { id: "t3", type: "info", icon: "\u25ce", title: "Proposal opened", desc: "Maria at Luna Boutique viewed 4 pages", action: "Follow up \u2192", autoDismiss: 10000 },
];
