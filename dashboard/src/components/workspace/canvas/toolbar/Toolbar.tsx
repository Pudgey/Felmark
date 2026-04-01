"use client";

import styles from "./Toolbar.module.css";

interface ToolbarProps {
  editing: boolean;
  showLibrary: boolean;
  onToggleEdit: () => void;
  onToggleLibrary: () => void;
}

export default function Toolbar({ editing, showLibrary, onToggleEdit, onToggleLibrary }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.logo}>
        <div className={styles.mark}>{"\u25C6"}</div>
        <span className={styles.logoName}>Felmark</span>
      </div>
      <span className={styles.workspaceBadge}>WORKSPACE</span>
      <span className={styles.toolbarSep} />
      <div className={styles.spaces}>
        <button className={`${styles.space} ${styles.spaceActive}`}>
          <span>{"\u25C6"}</span> Dashboard
        </button>
        <button className={styles.space}>
          <span>{"\u25CE"}</span> Triage
        </button>
        <button className={styles.space}>
          <span>$</span> Revenue
        </button>
        <button className={styles.spaceAdd}>+ New Space</button>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${editing ? styles.btnOn : ""}`}
          onClick={onToggleEdit}
        >
          {editing ? "\u2713 Done" : "\u270E Edit Canvas"}
        </button>
        {editing && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onToggleLibrary}
          >
            + Add Block
          </button>
        )}
        <div className={styles.avatar}>A</div>
      </div>
    </div>
  );
}
