"use client";

import styles from "./Rail.module.css";

interface RailProps {
  activeItem: string;
  overdueCount: number;
  onItemClick: (item: string) => void;
}

export default function Rail({ activeItem, overdueCount, onItemClick }: RailProps) {
  return (
    <div className={styles.rail} role="navigation" aria-label="Main navigation">
      <button className={`${styles.logo} ${activeItem === "home" ? styles.logoActive : ""}`} onClick={() => onItemClick("home")} aria-label="Dashboard Home">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember-light)" strokeWidth="1.2" />
          <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember-light)" opacity="0.15" />
          <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember-light)" strokeWidth="0.8" />
        </svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "workspaces" ? styles.active : ""}`} onClick={() => onItemClick("workspaces")} aria-label="Workspaces">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "search" ? styles.active : ""}`} onClick={() => onItemClick("search")} aria-label="Search">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "calendar" ? styles.active : ""}`} onClick={() => onItemClick("calendar")} aria-label="Calendar">
        {overdueCount > 0 && <span className={styles.badge} />}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 7h13M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "pipeline" ? styles.active : ""}`} onClick={() => onItemClick("pipeline")} aria-label="Pipeline">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14V8h3v6H2zM7.5 14V5h3v9h-3zM13 14V2h3v12h-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "services" ? styles.active : ""}`} onClick={() => onItemClick("services")} aria-label="Services">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3h6l7 7-6 6-7-7V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="6" cy="7" r="1.2" fill="currentColor"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "templates" ? styles.active : ""}`} onClick={() => onItemClick("templates")} aria-label="Templates">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 6h6M6 9h4M6 12h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "finance" ? styles.active : ""}`} onClick={() => onItemClick("finance")} aria-label="Finance">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 5.5v7M7 7.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5-.9 1.5-2 1.5-2 .7-2 1.5.9 1.5 2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "wire" ? styles.active : ""}`} onClick={() => onItemClick("wire")} aria-label="The Wire">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h3l2-5 2 10 2-7 2 4h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className={styles.sep} />

      <button className={styles.btn} aria-label="Contacts">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 6l3-3h6l3 3v6l-3 3H6l-3-3V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 14c0-2 1.1-3 2.5-3s2.5 1 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
      </button>

      <div className={styles.spacer} />

      <button className={styles.btn} aria-label="Settings">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}
