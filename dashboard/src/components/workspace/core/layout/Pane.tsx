"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import { SURFACES, SURFACE_COMPONENTS, SURFACE_CONTEXT, getSurfaceMeta, type SurfaceId } from "../surfaces/registry";
import styles from "./Pane.module.css";

interface PaneProps {
  surface: SurfaceId;
  onSurfaceChange: (surface: SurfaceId) => void;
  focused?: boolean;
  onFocus?: () => void;
  zoomed?: boolean;
  onZoom?: () => void;
  onSplit?: (direction: "above" | "below" | "left" | "right" | "f-left" | "f-right") => void;
  onClose?: () => void;
  canClose?: boolean;
  canSplit?: boolean;
  canFSplit?: boolean;
  canRowSplit?: boolean;
}

function EmptyPane({ surfaceId }: { surfaceId: SurfaceId }) {
  const surface = getSurfaceMeta(surfaceId);

  return (
    <div className={styles.emptyPane}>
      <div className={styles.emptyInner}>
        <div className={styles.emptyGlyph}>{surface.icon}</div>
        <div className={styles.emptyTitle}>{surface.label}</div>
        <div className={styles.emptySub}>{surface.desc}</div>
        <button className={styles.emptyAction}>{surface.action}</button>
        <div className={styles.emptyShortcut}>Press {surface.shortcut}</div>
      </div>
    </div>
  );
}

export default function Pane({
  surface,
  onSurfaceChange,
  focused = false,
  onFocus,
  zoomed = false,
  onZoom,
  onSplit,
  onClose,
  canClose = false,
  canSplit = false,
  canFSplit = false,
  canRowSplit = false,
}: PaneProps) {
  const [surfaceMenuOpen, setSurfaceMenuOpen] = useState(false);
  const [splitMenuOpen, setSplitMenuOpen] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [splitMenuPosition, setSplitMenuPosition] = useState({ top: 0, left: 0 });
  const [surfaceMenuPosition, setSurfaceMenuPosition] = useState({ top: 0, left: 0 });
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const nav = useWorkspaceNav();
  const Content = SURFACE_COMPONENTS[surface];
  const surfaceMeta = getSurfaceMeta(surface);

  const closeAllMenus = () => {
    setSurfaceMenuOpen(false);
    setSplitMenuOpen(false);
    setContextMenuOpen(false);
  };

  useEffect(() => {
    const handleDismiss = () => closeAllMenus();
    window.addEventListener("felmark:dismiss-ctx", handleDismiss);
    return () => window.removeEventListener("felmark:dismiss-ctx", handleDismiss);
  }, []);

  const handlePaneContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (!focused) return;
    event.preventDefault();
    event.stopPropagation();
    nav.dismissGlobalCtx();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    setContextMenuOpen(true);
    setSurfaceMenuOpen(false);
    setSplitMenuOpen(false);
  };

  return (
    <div className={`${styles.pane} ${focused ? styles.paneFocused : styles.paneInactive}`} onClick={onFocus}>
      <div className={styles.paneHd} onContextMenu={handlePaneContextMenu}>
        <div
          className={styles.paneHdLeft}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setSurfaceMenuPosition({ top: rect.bottom + 2, left: rect.left });
            setSurfaceMenuOpen(!surfaceMenuOpen);
            setSplitMenuOpen(false);
          }}
        >
          <span className={styles.paneIcon}>{surfaceMeta.icon}</span>
          <span className={styles.paneLabel}>{surfaceMeta.label}</span>
          <span className={styles.paneChevron}>{"\u25be"}</span>
        </div>
        <div className={styles.paneHdSep} />
        <span className={styles.paneHdContext}>{SURFACE_CONTEXT[surface]}</span>

        {surfaceMenuOpen && (
          <div className={styles.paneDrop} style={{ position: "fixed", top: surfaceMenuPosition.top, left: surfaceMenuPosition.left }}>
            {SURFACES.map((surfaceOption, index) => (
              <div
                key={surfaceOption.id}
                className={`${styles.paneDropOpt} ${surfaceOption.id === surface ? styles.paneDropOn : ""}`}
                onClick={() => {
                  onSurfaceChange(surfaceOption.id);
                  closeAllMenus();
                }}
              >
                <div className={`${styles.paneDropIconBox} ${surfaceOption.id === surface ? styles.paneDropIconBoxOn : ""}`}>{surfaceOption.icon}</div>
                <div className={styles.paneDropInfo}>
                  <span className={styles.paneDropName}>{surfaceOption.label}</span>
                  <span className={styles.paneDropDesc}>{surfaceOption.desc}</span>
                </div>
                <div className={styles.paneDropState}>
                  <span className={styles.paneDropStateVal} style={{ color: surfaceOption.color }}>{surfaceOption.stateVal}</span>
                  <span className={styles.paneDropStateLb}>{surfaceOption.stateLb}</span>
                </div>
                <span className={styles.paneDropKey}>{index + 1}</span>
              </div>
            ))}
          </div>
        )}

        {splitMenuOpen && canSplit && (
          <div className={styles.splitDrop} style={{ position: "fixed", top: splitMenuPosition.top, left: splitMenuPosition.left }}>
            <div className={styles.splitDropOpt} onClick={() => { onSplit?.("above"); closeAllMenus(); }}>
              <div className={styles.splitDropPreview}><div className={styles.splitDropNew} /><div className={styles.splitDropCur}>{surfaceMeta.icon}</div></div>
              <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Split above</span><span className={styles.splitDropKey}>{"\u21e7\u2191"}</span></div>
            </div>
            <div className={styles.splitDropOpt} onClick={() => { onSplit?.("below"); closeAllMenus(); }}>
              <div className={styles.splitDropPreview}><div className={styles.splitDropCur}>{surfaceMeta.icon}</div><div className={styles.splitDropNew} /></div>
              <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Split below</span><span className={styles.splitDropKey}>{"\u21e7\u2193"}</span></div>
            </div>

            {canRowSplit && (
              <>
                <div className={styles.splitDropSep} />
                <div className={styles.splitDropOpt} onClick={() => { onSplit?.("left"); closeAllMenus(); }}>
                  <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}><div className={styles.splitDropNew} /><div className={styles.splitDropCur}>{surfaceMeta.icon}</div></div>
                  <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Split left</span><span className={styles.splitDropKey}>{"\u21e7\u2190"}</span></div>
                </div>
                <div className={styles.splitDropOpt} onClick={() => { onSplit?.("right"); closeAllMenus(); }}>
                  <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}><div className={styles.splitDropCur}>{surfaceMeta.icon}</div><div className={styles.splitDropNew} /></div>
                  <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Split right</span><span className={styles.splitDropKey}>{"\u21e7\u2192"}</span></div>
                </div>
              </>
            )}

            {canFSplit && (
              <>
                <div className={styles.splitDropSep} />
                <div className={styles.splitDropOpt} onClick={() => { onSplit?.("f-left"); closeAllMenus(); }}>
                  <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                    <div className={styles.splitDropNew} />
                    <div className={styles.splitDropCurStack}><div className={styles.splitDropCurMini} /><div className={styles.splitDropCurMini} /></div>
                  </div>
                  <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Full left</span><span className={styles.splitDropKey}>F{"\u2190"}</span></div>
                </div>
                <div className={styles.splitDropOpt} onClick={() => { onSplit?.("f-right"); closeAllMenus(); }}>
                  <div className={`${styles.splitDropPreview} ${styles.splitDropPreviewH}`}>
                    <div className={styles.splitDropCurStack}><div className={styles.splitDropCurMini} /><div className={styles.splitDropCurMini} /></div>
                    <div className={styles.splitDropNew} />
                  </div>
                  <div className={styles.splitDropInfo}><span className={styles.splitDropLabel}>Full right</span><span className={styles.splitDropKey}>F{"\u2192"}</span></div>
                </div>
              </>
            )}
          </div>
        )}

        <div className={styles.paneHdRight}>
          <div className={styles.paneBeacon}>
            <span className={`${styles.paneBeaconLabel} ${focused ? styles.paneBeaconLabelOn : styles.paneBeaconLabelOff}`}>{focused ? "active" : "idle"}</span>
            <div className={`${styles.paneBeaconDot} ${focused ? styles.paneBeaconDotOn : styles.paneBeaconDotOff}`} />
          </div>
          <span className={`${styles.paneHdAction} ${zoomed ? styles.paneHdActionActive : ""}`} onClick={(event) => { event.stopPropagation(); onZoom?.(); }} title={zoomed ? "Restore" : "Maximize"}>{zoomed ? "\u2923" : "\u2922"}</span>
          {canSplit && !zoomed && <span className={styles.paneHdAction} onClick={(event) => { event.stopPropagation(); const rect = event.currentTarget.getBoundingClientRect(); setSplitMenuPosition({ top: rect.bottom + 2, left: rect.right - 180 }); setSplitMenuOpen(!splitMenuOpen); setSurfaceMenuOpen(false); }} title="Split pane">{"\u2295"}</span>}
          {canClose && <span className={`${styles.paneHdAction} ${styles.paneHdActionClose}`} onClick={(event) => { event.stopPropagation(); onClose?.(); }} title="Close pane">{"\u00d7"}</span>}
        </div>

        {contextMenuOpen && (
          <div className={styles.ctxMenu} style={{ position: "fixed", top: contextMenuPosition.top, left: contextMenuPosition.left }}>
            <div className={styles.ctxGroup}>
              <span className={styles.ctxGroupLabel}>Switch surface</span>
              {SURFACES.map((surfaceOption) => (
                <div key={surfaceOption.id} className={`${styles.ctxItem} ${surfaceOption.id === surface ? styles.ctxItemOn : ""}`} onClick={() => { onSurfaceChange(surfaceOption.id); closeAllMenus(); }}>
                  <span className={styles.ctxItemIcon}>{surfaceOption.icon}</span>
                  <span className={styles.ctxItemLabel}>{surfaceOption.label}</span>
                  {surfaceOption.id === surface && <span className={styles.ctxItemCheck}>{"\u2713"}</span>}
                </div>
              ))}
            </div>

            <div className={styles.ctxSep} />

            <div className={styles.ctxItem} onClick={() => { onZoom?.(); closeAllMenus(); }}>
              <span className={styles.ctxItemIcon}>{zoomed ? "\u2923" : "\u2922"}</span>
              <span className={styles.ctxItemLabel}>{zoomed ? "Restore pane" : "Maximize pane"}</span>
              <span className={styles.ctxItemKey}>{"\u21e7"}F</span>
            </div>

            {canSplit && !zoomed && (
              <>
                <div className={styles.ctxItem} onClick={() => { onSplit?.("above"); closeAllMenus(); }}>
                  <span className={styles.ctxItemIcon}>{"\u2191"}</span>
                  <span className={styles.ctxItemLabel}>Split above</span>
                  <span className={styles.ctxItemKey}>{"\u21e7\u2191"}</span>
                </div>
                <div className={styles.ctxItem} onClick={() => { onSplit?.("below"); closeAllMenus(); }}>
                  <span className={styles.ctxItemIcon}>{"\u2193"}</span>
                  <span className={styles.ctxItemLabel}>Split below</span>
                  <span className={styles.ctxItemKey}>{"\u21e7\u2193"}</span>
                </div>
                {canRowSplit && (
                  <>
                    <div className={styles.ctxItem} onClick={() => { onSplit?.("left"); closeAllMenus(); }}>
                      <span className={styles.ctxItemIcon}>{"\u2190"}</span>
                      <span className={styles.ctxItemLabel}>Split left</span>
                      <span className={styles.ctxItemKey}>{"\u21e7\u2190"}</span>
                    </div>
                    <div className={styles.ctxItem} onClick={() => { onSplit?.("right"); closeAllMenus(); }}>
                      <span className={styles.ctxItemIcon}>{"\u2192"}</span>
                      <span className={styles.ctxItemLabel}>Split right</span>
                      <span className={styles.ctxItemKey}>{"\u21e7\u2192"}</span>
                    </div>
                  </>
                )}
              </>
            )}

            {canClose && (
              <>
                <div className={styles.ctxSep} />
                <div className={`${styles.ctxItem} ${styles.ctxItemDanger}`} onClick={() => { onClose?.(); closeAllMenus(); }}>
                  <span className={styles.ctxItemIcon}>{"\u00d7"}</span>
                  <span className={styles.ctxItemLabel}>Close pane</span>
                  <span className={styles.ctxItemKey}>{"\u21e7"}W</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.paneBody} onClick={() => { if (contextMenuOpen) closeAllMenus(); }} onContextMenu={handlePaneContextMenu}>
        {Content ? <Content /> : <EmptyPane surfaceId={surface} />}
      </div>
    </div>
  );
}
