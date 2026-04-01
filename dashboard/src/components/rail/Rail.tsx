"use client";

import styles from "./Rail.module.css";

interface RailProps {
  activeItem: string;
  overdueCount: number;
  onItemClick: (item: string) => void;
  zenMode?: boolean;
  onToggleZen?: () => void;
}

export default function Rail({ activeItem, overdueCount, onItemClick, zenMode, onToggleZen }: RailProps) {
  return (
    <div className={styles.rail} role="navigation" aria-label="Main navigation">
      <button className={`${styles.logo} ${activeItem === "home" ? styles.logoActive : ""}`} onClick={() => onItemClick("home")} aria-label="Dashboard Home" title="home">
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember-light)" strokeWidth="1.2" />
          <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember-light)" opacity="0.15" />
          <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember-light)" strokeWidth="0.8" />
        </svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "workspace" ? styles.active : ""}`} onClick={() => onItemClick("workspace")} aria-label="Workspace" title="workspace">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.2"/><ellipse cx="9" cy="9" rx="5.5" ry="2" stroke="currentColor" strokeWidth="0.8" transform="rotate(-30 9 9)"/><circle cx="13" cy="5.5" r="1" fill="currentColor"/><circle cx="5.5" cy="12" r="0.6" fill="currentColor"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "workstations" ? styles.active : ""}`} onClick={() => onItemClick("workstations")} aria-label="Workstations" title="workstations">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="7" x2="22" y2="7"/><circle cx="5" cy="5" r="0.75" fill="currentColor" stroke="none"/><circle cx="7.5" cy="5" r="0.75" fill="currentColor" stroke="none"/><circle cx="10" cy="5" r="0.75" fill="currentColor" stroke="none"/><polyline points="6,11 8.5,13 6,15"/><line x1="10" y1="15" x2="18" y2="15"/><line x1="10" y1="11" x2="16" y2="11"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "search" ? styles.active : ""}`} onClick={() => onItemClick("search")} aria-label="Search" title="search">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "calendar" ? styles.active : ""}`} onClick={() => onItemClick("calendar")} aria-label="Calendar" title="calendar">
        {overdueCount > 0 && <span className={styles.badge} />}
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2.5 7h13M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "pipeline" ? styles.active : ""}`} onClick={() => onItemClick("pipeline")} aria-label="Pipeline" title="pipeline">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M2 14V8h3v6H2zM7.5 14V5h3v9h-3zM13 14V2h3v12h-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "services" ? styles.active : ""}`} onClick={() => onItemClick("services")} aria-label="Services" title="services">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M2 3h6l7 7-6 6-7-7V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="6" cy="7" r="1.2" fill="currentColor"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "templates" ? styles.active : ""}`} onClick={() => onItemClick("templates")} aria-label="Templates" title="templates">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 6h6M6 9h4M6 12h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "finance" ? styles.active : ""}`} onClick={() => onItemClick("finance")} aria-label="Finance" title="finance">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 5.5v7M7 7.5c0-.8.9-1.5 2-1.5s2 .7 2 1.5-.9 1.5-2 1.5-2 .7-2 1.5.9 1.5 2 1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "forge" ? styles.active : ""}`} onClick={() => onItemClick("forge")} aria-label="Forge Paper" title="forge">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M4.5 2h6l4 4v9a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 15V3.5A1.5 1.5 0 014.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M10 2v4.5h4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6.5 10h5M6.5 12.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "wire" ? styles.active : ""}`} onClick={() => onItemClick("wire")} aria-label="The Wire" title="wire">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M2 9h3l2-5 2 10 2-7 2 4h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "team" ? styles.active : ""}`} onClick={() => onItemClick("team")} aria-label="Team" title="team">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3 14c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5"/><path d="M12 14c0-1.7 1-3 2.5-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/></svg>
      </button>

      <div className={styles.sep} />

      <button className={styles.btn} aria-label="Contacts" title="contacts">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M3 6l3-3h6l3 3v6l-3 3H6l-3-3V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M6.5 14c0-2 1.1-3 2.5-3s2.5 1 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
      </button>

      <div className={styles.spacer} />

      <button className={`${styles.btn} ${zenMode ? styles.active : ""}`} aria-label="Zen Mode" title="zen" onClick={onToggleZen}>
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M9 3C5 3 2 9 2 9s3 6 7 6 7-6 7-6-3-6-7-6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "settings" ? styles.active : ""}`} onClick={() => onItemClick("settings")} aria-label="Settings" title="settings">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}
