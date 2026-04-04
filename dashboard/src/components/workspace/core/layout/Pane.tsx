"use client";

import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { useWorkspaceNav } from "@/views/routers/WorkspaceRouter";
import { SURFACES, SURFACE_COMPONENTS, SURFACE_CONTEXT, getSurfaceMeta, type SurfaceId } from "../surfaces/registry";
import styles from "./Pane.module.css";

interface PaneProps {
  surface: SurfaceId;
  onSurfaceChange: (surface: SurfaceId) => void;
  headerTreatment?: "default" | "tinted";
  onHeaderTreatmentChange?: (treatment: "default" | "tinted") => void;
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

const PANE_ACCENT_OPTIONS = [
  { id: "default", label: "Default chrome", treatment: "default", description: "Monochrome dark headers with surface icon tint and an active seam." },
  { id: "tinted", label: "Tinted headers", treatment: "tinted", description: "Mix a small amount of each surface color into the dark header background." },
] as const;

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

function hexToRgbTriplet(hexColor: string) {
  const normalized = hexColor.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((char) => char + char).join("")
    : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `${red}, ${green}, ${blue}`;
}

export default function Pane({
  surface,
  onSurfaceChange,
  headerTreatment = "default",
  onHeaderTreatmentChange,
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
  const [paletteMenuOpen, setPaletteMenuOpen] = useState(false);
  const [splitMenuPosition, setSplitMenuPosition] = useState({ top: 0, left: 0 });
  const [surfaceMenuPosition, setSurfaceMenuPosition] = useState({ top: 0, left: 0 });
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [paletteMenuPosition, setPaletteMenuPosition] = useState({ top: 0, left: 0 });
  const nav = useWorkspaceNav();
  const Content = SURFACE_COMPONENTS[surface];
  const surfaceMeta = getSurfaceMeta(surface);
  const paneStyle = {
    "--pane-accent": surfaceMeta.color,
    "--pane-accent-rgb": hexToRgbTriplet(surfaceMeta.color),
  } as CSSProperties;

  const closeAllMenus = () => {
    setSurfaceMenuOpen(false);
    setSplitMenuOpen(false);
    setContextMenuOpen(false);
    setPaletteMenuOpen(false);
  };

  useEffect(() => {
    const handleDismiss = () => closeAllMenus();
    window.addEventListener("felmark:dismiss-ctx", handleDismiss);
    return () => window.removeEventListener("felmark:dismiss-ctx", handleDismiss);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    if (!surfaceMenuOpen && !splitMenuOpen && !contextMenuOpen && !paletteMenuOpen) return;
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(`.${styles.paneDrop}`) ||
        target.closest(`.${styles.splitDrop}`) ||
        target.closest(`.${styles.ctxMenu}`) ||
        target.closest(`.${styles.paletteDrop}`)
      ) return;
      closeAllMenus();
    };
    const timer = setTimeout(() => window.addEventListener("pointerdown", handleClickOutside), 0);
    return () => { clearTimeout(timer); window.removeEventListener("pointerdown", handleClickOutside); };
  }, [surfaceMenuOpen, splitMenuOpen, contextMenuOpen, paletteMenuOpen]);

  const handlePaneContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (!focused) return;
    event.preventDefault();
    event.stopPropagation();
    nav.dismissGlobalCtx();
    setContextMenuPosition({ top: event.clientY, left: event.clientX });
    setContextMenuOpen(true);
    setSurfaceMenuOpen(false);
    setSplitMenuOpen(false);
    setPaletteMenuOpen(false);
  };

  return (
    <div
      className={`${styles.pane} ${focused ? styles.paneFocused : styles.paneInactive} ${headerTreatment === "tinted" ? styles.paneTinted : ""}`}
      style={paneStyle}
      onClick={onFocus}
    >
      <div className={styles.paneHd} onContextMenu={handlePaneContextMenu}>
        <div
          className={styles.paneHdLeft}
          onClick={(event) => {
            event.stopPropagation();
            nav.dismissGlobalCtx();
            onFocus?.();
            const rect = event.currentTarget.getBoundingClientRect();
            setSurfaceMenuPosition({ top: rect.bottom + 2, left: rect.left });
            setSurfaceMenuOpen((open) => !open);
            setSplitMenuOpen(false);
            setContextMenuOpen(false);
            setPaletteMenuOpen(false);
          }}
        >
          <span className={styles.paneIcon}>{surfaceMeta.icon}</span>
          <span className={styles.paneLabel}>{surfaceMeta.label}</span>
          <span className={styles.paneChevron}>{"\u25be"}</span>
        </div>
        <div className={styles.paneHdSep} />
        <span className={styles.paneHdContext}>{SURFACE_CONTEXT[surface]}</span>

        {surfaceMenuOpen && (
          <div className={styles.paneDrop} style={{ position: "fixed", top: surfaceMenuPosition.top, left: surfaceMenuPosition.left }} onClick={(e) => e.stopPropagation()}>
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
          <div className={styles.splitDrop} style={{ position: "fixed", top: splitMenuPosition.top, left: splitMenuPosition.left }} onClick={(e) => e.stopPropagation()}>
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

        {paletteMenuOpen && (
          <div className={styles.paletteDrop} style={{ position: "fixed", top: paletteMenuPosition.top, left: paletteMenuPosition.left }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.paletteDropLabel}>Header style</div>
            {PANE_ACCENT_OPTIONS.map((option) => {
              const selected = headerTreatment === option.treatment;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.paletteOpt} ${selected ? styles.paletteOptActive : ""}`}
                  onClick={() => {
                    onHeaderTreatmentChange?.(option.treatment);
                    closeAllMenus();
                  }}
                >
                  <span className={styles.paletteSwatch} style={{ background: option.treatment === "tinted" ? surfaceMeta.color : "var(--ink-400, #9598a1)" }} />
                  <span className={styles.paletteMeta}>
                    <span className={styles.paletteName}>{option.label}</span>
                    <span className={styles.paletteDesc}>{option.description}</span>
                  </span>
                  {selected && <span className={styles.paletteCheck}>{"\u2713"}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.paneHdRight}>
          <div className={styles.paneBeacon}>
            <span className={`${styles.paneBeaconLabel} ${focused ? styles.paneBeaconLabelOn : styles.paneBeaconLabelOff}`}>{focused ? "active" : "idle"}</span>
            <div className={`${styles.paneBeaconDot} ${focused ? styles.paneBeaconDotOn : styles.paneBeaconDotOff}`} />
          </div>
          <span
            className={`${styles.paneHdAction} ${paletteMenuOpen ? styles.paneHdActionActive : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              nav.dismissGlobalCtx();
              onFocus?.();
              const rect = event.currentTarget.getBoundingClientRect();
              setPaletteMenuPosition({ top: rect.bottom + 2, left: rect.right - 220 });
              setPaletteMenuOpen((open) => !open);
              setSurfaceMenuOpen(false);
              setSplitMenuOpen(false);
              setContextMenuOpen(false);
            }}
            title="Header style"
          >
            {"\u25c9"}
          </span>
          <span className={`${styles.paneHdAction} ${zoomed ? styles.paneHdActionActive : ""}`} onClick={(event) => { event.stopPropagation(); onZoom?.(); }} title={zoomed ? "Restore" : "Maximize"}>{zoomed ? "\u2923" : "\u2922"}</span>
          {canSplit && !zoomed && <span className={styles.paneHdAction} onClick={(event) => { event.stopPropagation(); const rect = event.currentTarget.getBoundingClientRect(); setSplitMenuPosition({ top: rect.bottom + 2, left: rect.right - 180 }); setSplitMenuOpen(!splitMenuOpen); setSurfaceMenuOpen(false); setPaletteMenuOpen(false); }} title="Split pane">{"\u2295"}</span>}
          {canClose && <span className={`${styles.paneHdAction} ${styles.paneHdActionClose}`} onClick={(event) => { event.stopPropagation(); onClose?.(); }} title="Close pane">{"\u00d7"}</span>}
        </div>

        {contextMenuOpen && (
          <div className={styles.ctxMenu} style={{ position: "fixed", top: contextMenuPosition.top, left: contextMenuPosition.left }} onClick={(e) => e.stopPropagation()}>
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
