"use client";

import type { Tab } from "@/lib/types";
import styles from "./TabBar.module.css";

interface TabBarProps {
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  convoPanelOpen: boolean;
  onToggleConvo: () => void;
  onOpenTemplates?: () => void;
  unreadTotal: number;
  tabZoneRef: React.RefObject<HTMLDivElement | null>;
  visibleTabs: { visible: Tab[]; overflow: Tab[] };
  editingTabId: string | null;
  editingTabName: string;
  setEditingTabId: (id: string | null) => void;
  setEditingTabName: (name: string) => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabRename: (id: string, name: string) => void;
  onNewTab: () => void;
  overflowOpen: boolean;
  setOverflowOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  manuallyRenamed: React.MutableRefObject<Set<string>>;
  children?: React.ReactNode; // Toolbar goes here
}

export default function TabBar({
  sidebarOpen,
  onOpenSidebar,
  onOpenTemplates,
  convoPanelOpen,
  onToggleConvo,
  unreadTotal,
  tabZoneRef,
  visibleTabs,
  editingTabId,
  editingTabName,
  setEditingTabId,
  setEditingTabName,
  onTabClick,
  onTabClose,
  onTabRename,
  onNewTab,
  overflowOpen,
  setOverflowOpen,
  manuallyRenamed,
  children,
}: TabBarProps) {
  return (
    <>
      {!sidebarOpen && (
        <button className={styles.sidebarToggle} onClick={onOpenSidebar} aria-label="Open sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
        </button>
      )}
      <button className={`${styles.toolsBtn} ${convoPanelOpen ? styles.toolsBtnActive : ""}`} onClick={onToggleConvo} title="Conversations" aria-label="Conversations">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 3h11a1 1 0 011 1v7a1 1 0 01-1 1H5l-2.5 2V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M5.5 7h5M5.5 9.5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
        {!convoPanelOpen && unreadTotal > 0 && <span className={styles.toolsBadge}>{unreadTotal}</span>}
      </button>
      {onOpenTemplates && (
        <button className={styles.toolsBtn} onClick={onOpenTemplates} title="Templates" aria-label="Templates">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2.5" y="1.5" width="11" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M5 5.5h6M5 8h4M5 10.5h5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Tab zone -- shrinks tabs, overflows into pill */}
      <div className={styles.tabZone} ref={tabZoneRef}>
        {visibleTabs.visible.map(tab => (
          <div key={tab.id} data-tab data-active={tab.active ? "true" : "false"} className={`${styles.tab} ${tab.active ? styles.tabActive : ""}`} onClick={() => onTabClick(tab.id)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" /></svg>
            {editingTabId === tab.id ? (
              <input
                className={styles.tabRenameInput}
                value={editingTabName}
                autoFocus
                onChange={e => setEditingTabName(e.target.value)}
                onBlur={() => { const n = editingTabName.trim() || "Untitled"; onTabRename(tab.id, n); if (n !== "Untitled") manuallyRenamed.current.add(tab.id); setEditingTabId(null); }}
                onKeyDown={e => {
                  if (e.key === "Enter") { const n = editingTabName.trim() || "Untitled"; onTabRename(tab.id, n); if (n !== "Untitled") manuallyRenamed.current.add(tab.id); setEditingTabId(null); }
                  if (e.key === "Escape") setEditingTabId(null);
                }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                onDoubleClick={e => { e.stopPropagation(); setEditingTabId(tab.id); setEditingTabName(tab.name); }}
              >
                {tab.name}
              </span>
            )}
            <button className={styles.tabClose} onClick={e => { e.stopPropagation(); onTabClose(tab.id); }}>&times;</button>
          </div>
        ))}

        {/* Overflow pill */}
        {visibleTabs.overflow.length > 0 && (
          <div className={styles.overflowPill} onClick={() => setOverflowOpen((p: boolean) => !p)}>
            +{visibleTabs.overflow.length}
            {overflowOpen && (
              <div className={styles.overflowDropdown}>
                {visibleTabs.overflow.map(tab => (
                  <button
                    key={tab.id}
                    className={`${styles.overflowItem} ${tab.active ? styles.overflowItemActive : ""}`}
                    onClick={e => { e.stopPropagation(); onTabClick(tab.id); setOverflowOpen(false); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}><path d="M2.5 1h4l3 3v6.5a1 1 0 01-1 1h-6a1 1 0 01-1-1v-8.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1" /></svg>
                    {tab.name}
                    <span className={styles.overflowClient}>{tab.client}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button className={styles.tabNew} title="New tab" onClick={onNewTab}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      {/* Sacred right column (toolbar) */}
      {children}
    </>
  );
}
