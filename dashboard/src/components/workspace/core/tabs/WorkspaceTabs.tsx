"use client";

import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import styles from "./WorkspaceTabs.module.css";

interface WorkspaceTabsProps {
  activeTab?: string;
  topSurface: string;
  bottomSurface: string;
}

function formatSurfaceLabel(surface: string) {
  return surface.replace(/-/g, " ");
}

export default function WorkspaceTabs({ topSurface, bottomSurface }: WorkspaceTabsProps) {
  const nav = useWorkspaceNav();
  const topLabel = formatSurfaceLabel(topSurface);
  const bottomLabel = formatSurfaceLabel(bottomSurface);

  return (
    <div className={styles.header}>
      <div className={styles.headerRow1}>
        <div
          className={`${styles.headerTab} ${nav.activeView === "workspace" ? styles.headerTabOn : ""}`}
          onClick={() => nav.goToWorkspace()}
        >
          <span className={styles.headerTabIcon}>{"\u25c6"}</span>
          <span>Workspace</span>
        </div>

        {nav.hubTabs.map((hubTab) => (
          <div
            key={hubTab.clientId}
            className={`${styles.headerTab} ${nav.activeView === "hub" && nav.activeHubId === hubTab.clientId ? styles.headerTabOn : ""}`}
            onClick={() => nav.switchHub(hubTab.clientId)}
          >
            <span className={styles.headerTabIcon}>{"\u25c7"}</span>
            <span>{hubTab.clientName}</span>
            <span
              className={styles.headerTabClose}
              onClick={(event) => {
                event.stopPropagation();
                nav.closeHubTab(hubTab.clientId);
              }}
            >
              {"\u00d7"}
            </span>
          </div>
        ))}

        {nav.toolTabs.map((toolTab) => (
          <div
            key={toolTab.id}
            className={`${styles.headerTab} ${nav.activeView === "tool" && nav.activeToolId === toolTab.id ? styles.headerTabOn : ""}`}
            onClick={() => nav.switchTool(toolTab.id)}
          >
            <span className={styles.headerTabIcon}>{toolTab.icon}</span>
            <span>{toolTab.label}</span>
            <span
              className={styles.headerTabClose}
              onClick={(event) => {
                event.stopPropagation();
                nav.closeToolTab(toolTab.id);
              }}
            >
              {"\u00d7"}
            </span>
          </div>
        ))}

        {nav.activeView === "newtab" && (
          <div className={`${styles.headerTab} ${styles.headerTabOn}`}>
            <span className={styles.headerTabIcon}>+</span>
            <span>New Tab</span>
          </div>
        )}

        <div className={styles.headerNew} onClick={() => nav.openNewTab()}>
          +
        </div>
      </div>

      <div className={styles.headerRow2}>
        <span className={styles.promptMark}>{"\u25c6"}</span>
        <span className={styles.promptUser}>alex</span>
        <span className={styles.promptSep}>{"\u203a"}</span>
        <span className={styles.promptPath}>workspace</span>
        <span className={styles.promptSep}>{"\u203a"}</span>
        <span className={styles.promptBranch}>
          <span>{"\u2387"}</span> {topLabel} + {bottomLabel}
        </span>
        <div className={styles.promptInput}>
          <span>Search or command...</span>
          <span className={styles.promptCursor} />
        </div>
        <div className={styles.headerChips}>
          <span className={`${styles.headerChip} ${styles.headerChipOk}`}>{"\u25cf"} synced</span>
          <span className={`${styles.headerChip} ${styles.headerChipWarn}`}>1 overdue</span>
        </div>
      </div>
    </div>
  );
}
