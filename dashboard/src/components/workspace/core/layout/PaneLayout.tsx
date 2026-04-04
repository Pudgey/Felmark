"use client";

import { useEffect, useState } from "react";
import Pane from "./Pane";
import styles from "./PaneLayout.module.css";
import type { SurfaceId } from "../surfaces/registry";

interface PaneState {
  id: string;
  surface: SurfaceId;
}

type HeaderTreatment = "default" | "tinted";

const HEADER_TREATMENT_STORAGE_KEY = "felmark-workspace-pane-header-treatment";

interface StackRow {
  left: PaneState;
  right: PaneState | null;
}

interface WorkspacePaneLayout {
  fLeft: PaneState | null;
  fRight: PaneState | null;
  stack: StackRow[];
}

interface LayoutPreset {
  id: string;
  label: string;
  key: string;
  top: SurfaceId;
  bottom?: SurfaceId;
}

const PRESETS: LayoutPreset[] = [
  { id: "daily", label: "Daily", key: "1", top: "money", bottom: "work" },
  { id: "finance", label: "Finance", key: "2", top: "money", bottom: "pipeline" },
  { id: "hustle", label: "Hustle", key: "3", top: "work", bottom: "time" },
  { id: "signals", label: "Signals", key: "4", top: "signals", bottom: "clients" },
  { id: "focus", label: "Focus", key: "5", top: "work" },
];

let paneCounter = 0;

function nextPaneId() {
  paneCounter += 1;
  return `pane-${paneCounter}`;
}

function cloneLayout(layout: WorkspacePaneLayout): WorkspacePaneLayout {
  return {
    fLeft: layout.fLeft ? { ...layout.fLeft } : null,
    fRight: layout.fRight ? { ...layout.fRight } : null,
    stack: layout.stack.map((row) => ({
      left: { ...row.left },
      right: row.right ? { ...row.right } : null,
    })),
  };
}

function countPanes(layout: WorkspacePaneLayout) {
  let total = 0;
  if (layout.fLeft) total += 1;
  if (layout.fRight) total += 1;
  for (const row of layout.stack) {
    total += 1;
    if (row.right) total += 1;
  }
  return total;
}

function allPanes(layout: WorkspacePaneLayout) {
  const panes: PaneState[] = [];
  if (layout.fLeft) panes.push(layout.fLeft);
  for (const row of layout.stack) {
    panes.push(row.left);
    if (row.right) panes.push(row.right);
  }
  if (layout.fRight) panes.push(layout.fRight);
  return panes;
}

function createPane(surface: SurfaceId) {
  return { id: nextPaneId(), surface };
}

export default function PaneLayout() {
  const [layout, setLayout] = useState<WorkspacePaneLayout>({
    fLeft: null,
    fRight: null,
    stack: [
      { left: createPane("money"), right: null },
      { left: createPane("work"), right: null },
    ],
  });
  const [activeId, setActiveId] = useState<string>(() => layout.stack[0].left.id);
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState("daily");
  const [headerTreatment, setHeaderTreatment] = useState<HeaderTreatment>(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem(HEADER_TREATMENT_STORAGE_KEY) === "tinted" ? "tinted" : "default";
  });

  useEffect(() => {
    window.localStorage.setItem(HEADER_TREATMENT_STORAGE_KEY, headerTreatment);
  }, [headerTreatment]);

  const maxPanes = 4;
  const totalPanes = countPanes(layout);
  const canSplitMore = totalPanes < maxPanes;
  const hasFullLeft = layout.fLeft !== null;
  const hasFullRight = layout.fRight !== null;

  const focusPane = (paneId: string) => {
    window.dispatchEvent(new Event("felmark:dismiss-ctx"));
    setActiveId(paneId);
  };

  const changeSurface = (paneId: string, surface: SurfaceId) => {
    setLayout((currentLayout) => ({
      ...currentLayout,
      fLeft: currentLayout.fLeft?.id === paneId ? { ...currentLayout.fLeft, surface } : currentLayout.fLeft,
      fRight: currentLayout.fRight?.id === paneId ? { ...currentLayout.fRight, surface } : currentLayout.fRight,
      stack: currentLayout.stack.map((row) => ({
        left: row.left.id === paneId ? { ...row.left, surface } : row.left,
        right: row.right?.id === paneId ? { ...row.right, surface } : row.right,
      })),
    }));
  };

  const splitPane = (targetId: string, direction: "above" | "below" | "left" | "right" | "f-left" | "f-right") => {
    if (!canSplitMore) return;

    const nextLayout = cloneLayout(layout);
    const newPane = createPane("signals");

    if (direction === "f-left") {
      if (nextLayout.fLeft) return;
      nextLayout.fLeft = newPane;
    } else if (direction === "f-right") {
      if (nextLayout.fRight) return;
      nextLayout.fRight = newPane;
    } else {
      const rowIndex = nextLayout.stack.findIndex((row) => row.left.id === targetId || row.right?.id === targetId);
      if (rowIndex === -1) return;

      if (direction === "above") {
        nextLayout.stack.splice(rowIndex, 0, { left: newPane, right: null });
      } else if (direction === "below") {
        nextLayout.stack.splice(rowIndex + 1, 0, { left: newPane, right: null });
      } else if (direction === "left") {
        const row = nextLayout.stack[rowIndex];
        if (row.right) return;
        nextLayout.stack[rowIndex] = { left: newPane, right: row.left };
      } else if (direction === "right") {
        const row = nextLayout.stack[rowIndex];
        if (row.right) return;
        nextLayout.stack[rowIndex] = { left: row.left, right: newPane };
      }
    }

    setLayout(nextLayout);
    setActiveId(newPane.id);
    setZoomedId(null);
    setActivePreset("");
  };

  const closePane = (paneId: string) => {
    if (totalPanes <= 1) return;

    const nextLayout = cloneLayout(layout);

    if (nextLayout.fLeft?.id === paneId) {
      nextLayout.fLeft = null;
    } else if (nextLayout.fRight?.id === paneId) {
      nextLayout.fRight = null;
    } else {
      for (let index = 0; index < nextLayout.stack.length; index += 1) {
        const row = nextLayout.stack[index];
        if (row.left.id === paneId) {
          if (row.right) {
            nextLayout.stack[index] = { left: row.right, right: null };
          } else {
            nextLayout.stack.splice(index, 1);
          }
          break;
        }

        if (row.right?.id === paneId) {
          nextLayout.stack[index] = { left: row.left, right: null };
          break;
        }
      }
    }

    setLayout(nextLayout);
    if (activeId === paneId) {
      setActiveId(allPanes(nextLayout)[0]?.id ?? "");
    }
    if (zoomedId === paneId) {
      setZoomedId(null);
    }
    setActivePreset("");
  };

  const applyPreset = (preset: LayoutPreset) => {
    const nextLayout: WorkspacePaneLayout = preset.bottom
      ? {
          fLeft: null,
          fRight: null,
          stack: [{ left: createPane(preset.top), right: null }, { left: createPane(preset.bottom), right: null }],
        }
      : {
          fLeft: null,
          fRight: null,
          stack: [{ left: createPane(preset.top), right: null }],
        };

    setLayout(nextLayout);
    setActiveId(nextLayout.stack[0].left.id);
    setZoomedId(null);
    setActivePreset(preset.id);
  };

  const renderPane = (pane: PaneState, rowHasRight: boolean) => {
    const zoomed = zoomedId === pane.id;
    const hidden = zoomedId !== null && zoomedId !== pane.id;

    return (
      <div key={pane.id} className={styles.paneSlot} style={{ flex: zoomed ? "1" : hidden ? "0 0 0px" : "1 1 0px", opacity: hidden ? 0 : 1 }}>
        <Pane
          surface={pane.surface}
          onSurfaceChange={(surface) => changeSurface(pane.id, surface)}
          headerTreatment={headerTreatment}
          onHeaderTreatmentChange={setHeaderTreatment}
          focused={activeId === pane.id}
          onFocus={() => focusPane(pane.id)}
          zoomed={zoomed}
          onZoom={() => setZoomedId(zoomed ? null : pane.id)}
          onSplit={(direction) => splitPane(pane.id, direction)}
          onClose={() => closePane(pane.id)}
          canClose={totalPanes > 1}
          canSplit={canSplitMore}
          canFSplit={canSplitMore && !hasFullLeft && !hasFullRight}
          canRowSplit={canSplitMore && !rowHasRight}
        />
      </div>
    );
  };

  const renderZoomedPane = () => {
    if (!zoomedId) return null;

    if (layout.fLeft?.id === zoomedId) {
      return <div className={styles.panesOuter}><div className={styles.panesInner}>{renderPane(layout.fLeft, false)}</div></div>;
    }

    if (layout.fRight?.id === zoomedId) {
      return <div className={styles.panesOuter}><div className={styles.panesInner}>{renderPane(layout.fRight, false)}</div></div>;
    }

    for (const row of layout.stack) {
      if (row.left.id === zoomedId) {
        return <div className={styles.panesOuter}><div className={styles.panesInner}><div className={styles.paneSlot} style={{ flex: "1 1 0px" }}>{renderPane(row.left, false)}</div></div></div>;
      }
      if (row.right?.id === zoomedId) {
        return <div className={styles.panesOuter}><div className={styles.panesInner}><div className={styles.paneSlot} style={{ flex: "1 1 0px" }}>{renderPane(row.right, false)}</div></div></div>;
      }
    }

    return null;
  };

  return (
    <div className={styles.panes}>
      {zoomedId ? renderZoomedPane() : (
        <div className={styles.panesOuter}>
          {layout.fLeft && <div className={styles.fColumn}>{renderPane(layout.fLeft, false)}</div>}

          <div className={styles.panesInner}>
            {layout.stack.map((row, index) => (
              <div key={row.left.id} className={styles.paneSlot} style={{ flex: "1 1 0px" }}>
                {index > 0 && (
                  <div className={styles.splitHandle}>
                    <div className={styles.splitHandleLine} />
                  </div>
                )}

                {row.right ? (
                  <div className={styles.rowPair}>
                    {renderPane(row.left, true)}
                    <div className={styles.vSplitHandle} />
                    {renderPane(row.right, true)}
                  </div>
                ) : renderPane(row.left, false)}
              </div>
            ))}
          </div>

          {layout.fRight && <div className={styles.fColumn}>{renderPane(layout.fRight, false)}</div>}
        </div>
      )}

      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusDot} />
          <span className={styles.statusActive}>Connected</span>
          <span className={styles.statusSep}>{"\u00b7"}</span>
          {PRESETS.map((preset) => (
            <span key={preset.id} className={`${styles.presetPill} ${activePreset === preset.id ? styles.presetPillOn : ""}`} onClick={() => applyPreset(preset)}>
              {preset.label}
              <span className={styles.presetKey}>{preset.key}</span>
            </span>
          ))}
        </div>
        <div className={styles.statusRight}>
          <span style={{ color: "rgba(239,83,80,.6)" }}>1 overdue</span>
          <span>4 clients</span>
          <span>7 tasks</span>
        </div>
      </div>
    </div>
  );
}
