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
      <button
        className={`${styles.logo} ${activeItem === "home" ? styles.logoActive : ""}`}
        onClick={() => onItemClick("home")}
        aria-label="Dashboard Home"
        title="home"
      >
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember-light)" strokeWidth="1.2" />
          <path d="M14 8l-6 3.5v7L14 22l6-3.5v-7L14 8z" fill="var(--ember-light)" opacity="0.15" />
          <path d="M14 8v14M8 11.5l6 3.5 6-3.5" stroke="var(--ember-light)" strokeWidth="0.8" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "workspace" ? styles.active : ""}`}
        onClick={() => onItemClick("workspace")}
        aria-label="Workspace"
        title="workspace"
      >
        <svg className={styles.planetIcon} width="20" height="20" viewBox="0 0 18 18" fill="none">
          <circle className={styles.planetBody} cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.2" />
          <g className={styles.orbit}>
            <ellipse cx="9" cy="9" rx="5.5" ry="2" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="14.5" cy="9" r="1" fill="currentColor" />
            <circle cx="3.5" cy="9" r="0.6" fill="currentColor" />
          </g>
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "workstations" ? styles.active : ""}`}
        onClick={() => onItemClick("workstations")}
        aria-label="Workstations"
        title="workstations"
      >
        <svg className={styles.anvilIcon} width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path d="M3 7h12c0-3-2.5-5-6-5S3 4 3 7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <line x1="2" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M8 7v6M10 7v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="6" y="13" width="6" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="4" y1="16" x2="14" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <g className={styles.spark}>
            <line x1="9" y1="1" x2="9" y2="0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="6" y1="1.5" x2="5" y2="0.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="12" y1="1.5" x2="13" y2="0.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <line x1="4.5" y1="3" x2="3.5" y2="2.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="13.5" y1="3" x2="14.5" y2="2.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </g>
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "search" ? styles.active : ""}`}
        onClick={() => onItemClick("search")}
        aria-label="Search"
        title="search"
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "calendar" ? styles.active : ""}`}
        onClick={() => onItemClick("calendar")}
        aria-label="Calendar"
        title="calendar"
      >
        {overdueCount > 0 && <span className={styles.badge} />}
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <rect x="2.5" y="3" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.5 7h13M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "forge" ? styles.active : ""}`}
        onClick={() => onItemClick("forge")}
        aria-label="Forge Paper"
        title="forge"
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path
            d="M4.5 2h6l4 4v9a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 15V3.5A1.5 1.5 0 014.5 2z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M10 2v4.5h4.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M6.5 10h5M6.5 12.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "team" ? styles.active : ""}`}
        onClick={() => onItemClick("team")}
        aria-label="Team"
        title="team"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="7" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 14c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M12 14c0-1.7 1-3 2.5-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "terminal" ? styles.active : ""}`}
        onClick={() => onItemClick("terminal")}
        aria-label="Terminal"
        title="terminal"
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M5.5 7.5l3 2-3 2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="10" y1="12" x2="13" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      <button className={`${styles.btn} ${activeItem === "cloud" ? styles.active : ""}`} onClick={() => onItemClick("cloud")} aria-label="Cloud" title="cloud">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><path d="M4.5 13h9a2.5 2.5 0 000-5h-.1a4 4 0 00-7.8 0H5.5a3 3 0 100 5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
      </button>

      <div className={styles.sep} />

      <button className={styles.btn} aria-label="Contacts" title="contacts">
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path d="M3 6l3-3h6l3 3v6l-3 3H6l-3-3V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="9" cy="8" r="2" stroke="currentColor" strokeWidth="1.1" />
          <path d="M6.5 14c0-2 1.1-3 2.5-3s2.5 1 2.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.spacer} />

      <button
        className={`${styles.btn} ${zenMode ? styles.active : ""}`}
        aria-label="Zen Mode"
        title="zen"
        onClick={onToggleZen}
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 3C5 3 2 9 2 9s3 6 7 6 7-6 7-6-3-6-7-6z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      <button
        className={`${styles.btn} ${activeItem === "settings" ? styles.active : ""}`}
        onClick={() => onItemClick("settings")}
        aria-label="Settings"
        title="settings"
      >
        <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path
            d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
