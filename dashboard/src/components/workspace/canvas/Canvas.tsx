"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import type { CanvasBlock, CanvasRow, BlockTypeDef, LayoutBlock, GhostPosition, CellPosition } from "./types";
import { layoutRows } from "./layout";
import styles from "./Canvas.module.css";

/* ── Constants ── */

const CELL = 110;
const COLS = 8;
const GAP = 12;
const GRID_W = COLS * CELL + (COLS - 1) * GAP;
const MAX_PER_ROW = 3;

/* ── Block type definitions (16 types) ── */

const BLOCK_DEFS: BlockTypeDef[] = [
  { type: "revenue", label: "Revenue Counter", icon: "$", color: "#6b9a6b", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "outstanding", label: "Outstanding", icon: "!", color: "#c07a6a", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "tasks", label: "Task Board", icon: "\u229E", color: "#8b8bba", defaultW: 4, minW: 2, maxW: 8, defaultH: 3, minH: 2, expandAxis: "both" },
  { type: "activity", label: "Activity Feed", icon: "\u25C7", color: "#b07d4f", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "health", label: "Client Health", icon: "\u2665", color: "#8b8bba", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "timer", label: "Active Timer", icon: "\u25B6", color: "#6b9a6b", defaultW: 2, minW: 1, maxW: 4, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "calendar", label: "Calendar", icon: "\u25CE", color: "#8b8bba", defaultW: 4, minW: 2, maxW: 8, defaultH: 3, minH: 2, expandAxis: "both" },
  { type: "chat", label: "Quick Chat", icon: "\u2709", color: "#8b8bba", defaultW: 2, minW: 2, maxW: 4, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "invoices", label: "Invoice List", icon: "\u2630", color: "#6b9a6b", defaultW: 4, minW: 2, maxW: 8, defaultH: 2, minH: 2, expandAxis: "width" },
  { type: "files", label: "File Gallery", icon: "\u25FB", color: "#b07d4f", defaultW: 2, minW: 2, maxW: 6, defaultH: 2, minH: 2, expandAxis: "both" },
  { type: "pipeline", label: "Pipeline", icon: "\u2192", color: "#8b8bba", defaultW: 4, minW: 3, maxW: 8, defaultH: 3, minH: 2, expandAxis: "width" },
  { type: "automation", label: "Automations", icon: "\u26A1", color: "#b07d4f", defaultW: 3, minW: 2, maxW: 6, defaultH: 2, minH: 2, expandAxis: "width" },
  { type: "whisper", label: "AI Whisper", icon: "\u2726", color: "#b07d4f", defaultW: 8, minW: 4, maxW: 8, defaultH: 1, minH: 1, expandAxis: "width" },
  { type: "rate", label: "Rate Tracker", icon: "\u2197", color: "#8b8bba", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "goal", label: "Goal Ring", icon: "\u25C9", color: "#b07d4f", defaultW: 2, minW: 1, maxW: 8, defaultH: 2, minH: 1, expandAxis: "width" },
  { type: "note", label: "Sticky Note", icon: "\u25FB", color: "#b5b2a9", defaultW: 2, minW: 1, maxW: 4, defaultH: 2, minH: 1, expandAxis: "both" },
];

/* ── Initial data (row-based) ── */

const INITIAL_BLOCK_MAP: Record<string, CanvasBlock> = {
  b1: { id: "b1", type: "revenue", label: "Revenue", color: "#6b9a6b", w: 2, value: "$14,800", sub: "+12% this month" },
  b2: { id: "b2", type: "outstanding", label: "Outstanding", color: "#c07a6a", w: 2, value: "$9,600", sub: "3 invoices" },
  b3: { id: "b3", type: "rate", label: "Effective Rate", color: "#8b8bba", w: 2, value: "$108/hr", sub: "Target: $150" },
  b4: { id: "b4", type: "goal", label: "Monthly Goal", color: "#b07d4f", w: 2, value: "74%", sub: "of $20,000" },
  b5: { id: "b5", type: "whisper", label: "AI Whisper", color: "#b07d4f", w: 8 },
  b6: { id: "b6", type: "tasks", label: "Active Tasks", color: "#8b8bba", w: 4 },
  b7: { id: "b7", type: "activity", label: "Activity Feed", color: "#b07d4f", w: 2 },
  b8: { id: "b8", type: "health", label: "Client Health", color: "#8b8bba", w: 2 },
};

const INITIAL_ROWS: CanvasRow[] = [
  { id: "r0", blockIds: ["b1", "b2", "b3", "b4"] },
  { id: "r1", blockIds: ["b5"] },
  { id: "r2", blockIds: ["b6", "b7", "b8"] },
];

/* ── Block Content Renderer ── */

interface RenderBlock {
  id: string;
  type: string;
  label: string;
  color: string;
  w: number;
  h: number;
  value?: string;
  sub?: string;
}

const PLACEHOLDER_TIMES = ["2m", "3h", "1d", "2d", "5d", "1w"];

function BlockContent({ block }: { block: RenderBlock }) {
  if (block.type === "whisper") {
    return (
      <div className={styles.whisperContent}>
        <span className={styles.whisperBadge}>{"\u2726"} AI</span>
        <span className={styles.whisperDot} />
        <span className={styles.whisperText}>
          Sarah hasn&apos;t responded to color palette in 2 days
        </span>
        <button className={styles.whisperAction}>Send Nudge</button>
      </div>
    );
  }

  if (block.value) {
    const pct =
      block.type === "goal"
        ? parseInt(block.value)
        : block.type === "rate"
          ? 72
          : null;

    return (
      <div className={styles.metricContent}>
        <div className={styles.metricLabel}>{block.label}</div>
        <div
          className={`${styles.metricValue} ${block.w >= 2 ? styles.metricValueLarge : styles.metricValueSmall}`}
          style={{ color: block.color }}
        >
          {block.value}
        </div>
        <div className={styles.metricSub}>{block.sub}</div>
        {pct != null && (
          <div className={styles.metricProgress}>
            <div
              className={styles.metricProgressFill}
              style={{ width: `${pct}%`, background: block.color }}
            />
          </div>
        )}
      </div>
    );
  }

  /* Placeholder blocks (tasks, activity, health, etc.) */
  const lines =
    block.type === "tasks"
      ? 5
      : block.type === "activity"
        ? 6
        : block.type === "health"
          ? 4
          : 3;

  return (
    <div className={styles.placeholderContent}>
      <div className={styles.placeholderLabel}>{block.label}</div>
      <div className={styles.placeholderRows}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={styles.placeholderRow}>
            <div
              className={styles.placeholderDot}
              style={{
                background: block.color,
                opacity: 0.25 + (i < 2 ? 0.2 : 0),
              }}
            />
            <div className={styles.placeholderBar}>
              <div
                className={styles.placeholderBarFill}
                style={{
                  background: block.color,
                  width: `${65 + Math.sin(i * 1.8) * 25}%`,
                }}
              />
            </div>
            <div className={styles.placeholderTime}>
              {PLACEHOLDER_TIMES[i % PLACEHOLDER_TIMES.length]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Helpers ── */

interface TargetRowResult {
  rowIdx: number;
  rowY: number;
  rowH: number;
  totalH: number;
}

function findTargetRow(gridRow: number, layout: LayoutBlock[], rows: CanvasRow[]): TargetRowResult {
  let yAccum = 0;
  for (let i = 0; i < rows.length; i++) {
    const rowBlocks = layout.filter((lb) => rows[i].blockIds.includes(lb.id));
    const rowH = rowBlocks.length > 0 ? rowBlocks[0].h : 2;
    if (gridRow < yAccum + rowH) {
      return { rowIdx: i, rowY: yAccum, rowH, totalH: yAccum + rowH };
    }
    yAccum += rowH;
  }
  const lastH = layout.length > 0 ? layout[layout.length - 1].h : 2;
  return { rowIdx: Math.max(0, rows.length - 1), rowY: Math.max(0, yAccum - lastH), rowH: 2, totalH: yAccum };
}

/* ── Main Canvas Component ── */

export default function Canvas() {
  const [blocks, setBlocks] = useState<Record<string, CanvasBlock>>(INITIAL_BLOCK_MAP);
  const [rows, setRows] = useState<CanvasRow[]>(INITIAL_ROWS);
  const [editing, setEditing] = useState(false);
  const [ghostPos, setGhostPos] = useState<GhostPosition | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [placingBlock, setPlacingBlock] = useState<string | null>(null);
  const [hoverCell, setHoverCell] = useState<CellPosition | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragCursor, setDragCursor] = useState<{ x: number; y: number } | null>(null);
  const [previewLayout, setPreviewLayout] = useState<LayoutBlock[] | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [insertTarget, setInsertTarget] = useState<number | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dragTypeRef = useRef<string | null>(null);

  /* ── Computed layout ── */

  const layout = useMemo(
    () => layoutRows(rows, blocks, BLOCK_DEFS, COLS),
    [rows, blocks],
  );

  /* ── Row boundaries (for insertion bars) ── */

  const rowBoundaries = useMemo(() => {
    const bounds: { y: number; afterRowIdx: number }[] = [];
    bounds.push({ y: 0, afterRowIdx: -1 });
    let yAccum = 0;
    for (let i = 0; i < rows.length; i++) {
      const rowBlocks = layout.filter(lb => rows[i].blockIds.includes(lb.id));
      const rowH = rowBlocks.length > 0 ? rowBlocks[0].h : 2;
      yAccum += rowH;
      bounds.push({ y: yAccum, afterRowIdx: i });
    }
    return bounds;
  }, [layout, rows]);

  /* ── Grid math ── */

  const canvasToGrid = useCallback(
    (clientX: number, clientY: number): CellPosition | null => {
      if (!gridRef.current) return null;
      const rect = gridRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < -20 || y < -20) return null;
      const col = Math.round(x / (CELL + GAP));
      const row = Math.round(y / (CELL + GAP));
      return { col: Math.max(0, Math.min(COLS - 1, col)), row: Math.max(0, row) };
    },
    [],
  );

  const blockRect = (b: { x: number; y: number; w: number; h: number }) => ({
    left: b.x * (CELL + GAP),
    top: b.y * (CELL + GAP),
    width: b.w * CELL + (b.w - 1) * GAP,
    height: b.h * CELL + (b.h - 1) * GAP,
  });

  /* ── Canvas mouse handlers ── */

  const handleCanvasMove = (e: React.MouseEvent) => {
    const cell = canvasToGrid(e.clientX, e.clientY);
    if (!cell) return;
    setHoverCell(cell);
    if (dragging && dragTypeRef.current) {
      const def = BLOCK_DEFS.find((bt) => bt.type === dragTypeRef.current);
      if (def) {
        const target = findTargetRow(cell.row, layout, rows);
        const targetRow = rows[target.rowIdx];
        const rowWidth = targetRow ? targetRow.blockIds.reduce((sum, bid) => sum + (blocks[bid]?.w ?? 0), 0) : 0;
        const fitsInRow = targetRow && rowWidth + def.defaultW <= COLS && targetRow.blockIds.length < MAX_PER_ROW;
        const ghostY = fitsInRow ? target.rowY : target.totalH;
        const ghostH = fitsInRow ? target.rowH : def.defaultH;
        const ghostX = fitsInRow ? Math.min(rowWidth, COLS - def.defaultW) : 0;
        setGhostPos({ x: ghostX, y: ghostY, w: def.defaultW, h: ghostH });
      }
    }
  };

  const startDrag = (type: string) => {
    dragTypeRef.current = type;
    setDragging(true);
    setPlacingBlock(type);
    setShowLibrary(false);
  };

  /* ── Global drag listeners ── */

  // Use a ref to track the latest layout/rows/blocks for event handlers
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const insertTargetRef = useRef(insertTarget);
  insertTargetRef.current = insertTarget;

  // Stable drag handler using useCallback
  const onMoveRef = useRef<((e: MouseEvent) => void) | null>(null);
  const onUpRef = useRef<((e: MouseEvent) => void) | null>(null);

  const attachDragListeners = useCallback(() => {
    const onMove = (e: MouseEvent) => {
      setDragCursor({ x: e.clientX, y: e.clientY });
      if (!dragTypeRef.current) return;
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (cell) {
        const def = BLOCK_DEFS.find((bt) => bt.type === dragTypeRef.current);
        if (def) {
          const currentLayout = layoutRef.current;
          const currentRows = rowsRef.current;
          const currentBlocks = blocksRef.current;

          const target = findTargetRow(cell.row, currentLayout, currentRows);
          const targetRow = currentRows[target.rowIdx];
          const rowWidth = targetRow ? targetRow.blockIds.reduce((sum, bid) => sum + (currentBlocks[bid]?.w ?? 0), 0) : 0;
          const fitsInRow = targetRow && rowWidth + def.defaultW <= COLS && targetRow.blockIds.length < MAX_PER_ROW;
          const ghostY = fitsInRow ? target.rowY : target.totalH;
          const ghostH = fitsInRow ? target.rowH : def.defaultH;
          const ghostX = fitsInRow ? Math.min(rowWidth, COLS - def.defaultW) : 0;
          setGhostPos({ x: ghostX, y: ghostY, w: def.defaultW, h: ghostH });

          // Compute preview layout
          const newId = "__preview__";
          const previewBlock: CanvasBlock = { id: newId, type: def.type, label: def.label, color: def.color, w: def.defaultW };

          let previewRows: CanvasRow[];
          if (fitsInRow) {
            previewRows = currentRows.map((r, i) =>
              i === target.rowIdx ? { ...r, blockIds: [...r.blockIds, newId] } : r,
            );
          } else {
            const newRow: CanvasRow = { id: "rpreview", blockIds: [newId] };
            previewRows = [...currentRows.slice(0, target.rowIdx + 1), newRow, ...currentRows.slice(target.rowIdx + 1)];
          }

          const previewBlockMap = { ...currentBlocks, [newId]: previewBlock };
          const computed = layoutRows(previewRows, previewBlockMap, BLOCK_DEFS, COLS);
          setPreviewLayout(computed.filter((lb) => lb.id !== newId));
        }
      } else {
        setGhostPos(null);
        setPreviewLayout(null);
      }
    };

    const onUp = (e: MouseEvent) => {
      if (!dragTypeRef.current) return;
      const cell = canvasToGrid(e.clientX, e.clientY);
      if (cell) {
        const def = BLOCK_DEFS.find((bt) => bt.type === dragTypeRef.current);
        if (def) {
          const currentLayout = layoutRef.current;
          const currentRows = rowsRef.current;
          const currentBlocks = blocksRef.current;

          const newId = `b${Date.now()}`;
          const newBlock: CanvasBlock = {
            id: newId, type: def.type, label: def.label, color: def.color, w: def.defaultW,
          };

          // If insertTarget is set and that row is empty, place into it
          const curInsertTarget = insertTargetRef.current;
          if (curInsertTarget !== null && currentRows[curInsertTarget]?.blockIds.length === 0) {
            setRows((prev) => prev.map((r, i) =>
              i === curInsertTarget ? { ...r, blockIds: [newId] } : r,
            ));
            setInsertTarget(null);
          } else {
            const target = findTargetRow(cell.row, currentLayout, currentRows);
            const targetRow = currentRows[target.rowIdx];
            const rowWidth = targetRow ? targetRow.blockIds.reduce((sum, bid) => sum + (currentBlocks[bid]?.w ?? 0), 0) : 0;

            if (targetRow && rowWidth + def.defaultW <= COLS && targetRow.blockIds.length < MAX_PER_ROW) {
              setRows((prev) => prev.map((r, i) =>
                i === target.rowIdx ? { ...r, blockIds: [...r.blockIds, newId] } : r,
              ));
            } else {
              const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [newId] };
              setRows((prev) => [...prev.slice(0, target.rowIdx + 1), newRow, ...prev.slice(target.rowIdx + 1)]);
            }
          }

          setBlocks((prev) => ({ ...prev, [newId]: newBlock }));
        }
      }
      setDragging(false);
      setDragCursor(null);
      setPreviewLayout(null);
      dragTypeRef.current = null;
      setGhostPos(null);
      setPlacingBlock(null);

      // Clean up listeners
      if (onMoveRef.current) window.removeEventListener("mousemove", onMoveRef.current);
      if (onUpRef.current) window.removeEventListener("mouseup", onUpRef.current);
      onMoveRef.current = null;
      onUpRef.current = null;
    };

    onMoveRef.current = onMove;
    onUpRef.current = onUp;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [canvasToGrid]);

  const startDragWithListeners = (type: string) => {
    startDrag(type);
    // Defer listener attachment to next tick so state is set
    requestAnimationFrame(() => attachDragListeners());
  };

  /* ── Block actions ── */

  const removeBlock = (id: string) => {
    setBlocks((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setRows((prev) => {
      const updated = prev.map((r) => ({
        ...r,
        blockIds: r.blockIds.filter((bid) => bid !== id),
      }));
      // Remove empty rows
      return updated.filter((r) => r.blockIds.length > 0);
    });
    setSelectedBlock(null);
  };

  /* ── Grid dimensions ── */

  const maxRow = layout.reduce((max, lb) => Math.max(max, lb.y + lb.h), 0);
  const gridRows = Math.max(maxRow + 3, 6);
  const isEditOrPlacing = editing || !!placingBlock;

  /* ── Block count for footer ── */

  const blockCount = Object.keys(blocks).length;

  return (
    <div className={styles.canvas}>
      {/* ── Toolbar ── */}
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
            onClick={() => {
              const entering = !editing;
              setEditing(entering);
              setShowLibrary(entering);
              setPlacingBlock(null);
              setGhostPos(null);
              setSelectedBlock(null);
              setReplaceTarget(null);
            }}
          >
            {editing ? "\u2713 Done" : "\u270E Edit Canvas"}
          </button>
          {editing && (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => setShowLibrary(!showLibrary)}
            >
              + Add Block
            </button>
          )}
          <div className={styles.avatar}>A</div>
        </div>
      </div>

      {/* ── Grid Area ── */}
      <div
        className={styles.gridArea}
        ref={canvasRef}
        onMouseMove={handleCanvasMove}
        onClick={() => { setReplaceTarget(null); }}
        style={{ cursor: dragging ? "grabbing" : "default" }}
      >
        <div
          className={styles.gridContainer}
          ref={gridRef}
          style={{
            width: GRID_W + 48,
            minHeight: gridRows * (CELL + GAP) + 48,
          }}
        >
          {/* Dot grid */}
          <div className={styles.dots}>
            {Array.from({ length: (COLS + 1) * (gridRows + 1) }).map((_, i) => {
              const col = i % (COLS + 1);
              const row = Math.floor(i / (COLS + 1));
              const isOccupied = layout.some(
                (lb) =>
                  col >= lb.x && col <= lb.x + lb.w && row >= lb.y && row <= lb.y + lb.h,
              );
              return (
                <div
                  key={i}
                  className={styles.dot}
                  style={{
                    left: col * (CELL + GAP) - 1.5,
                    top: row * (CELL + GAP) - 1.5,
                    width: isEditOrPlacing ? 3 : 2,
                    height: isEditOrPlacing ? 3 : 2,
                    background: isEditOrPlacing
                      ? isOccupied
                        ? "rgba(139,139,186,0.06)"
                        : "rgba(139,139,186,0.18)"
                      : "rgba(0,0,0,0.04)",
                    transform: isEditOrPlacing ? "scale(1)" : "scale(0.7)",
                  }}
                />
              );
            })}
          </div>

          {/* Cell highlight (edit mode, not during placing) */}
          {isEditOrPlacing && hoverCell && !placingBlock && (
            <div
              className={styles.cellHighlight}
              style={{
                left: hoverCell.col * (CELL + GAP),
                top: hoverCell.row * (CELL + GAP),
                width: CELL,
                height: CELL,
              }}
            />
          )}

          {/* Ghost block during drag-to-place */}
          {placingBlock && ghostPos && (
            <div
              className={styles.ghost}
              style={{
                left: ghostPos.x * (CELL + GAP),
                top: ghostPos.y * (CELL + GAP),
                width: ghostPos.w * CELL + (ghostPos.w - 1) * GAP,
                height: ghostPos.h * CELL + (ghostPos.h - 1) * GAP,
              }}
            >
              <div className={styles.ghostLabel}>
                {BLOCK_DEFS.find((bt) => bt.type === placingBlock)?.label}
                <div className={styles.ghostMeta}>
                  {ghostPos.w}&times;{ghostPos.h} &middot; Release to place
                </div>
              </div>
            </div>
          )}

          {/* Blocks */}
          {layout.map((lb) => {
            const block = blocks[lb.id];
            if (!block) return null;
            const renderBlock: RenderBlock = { ...block, w: lb.w, h: lb.h };
            // Use preview position during drag if available
            const displayLb = previewLayout?.find((p) => p.id === lb.id) ?? lb;
            const isMoved = previewLayout && (displayLb.x !== lb.x || displayLb.y !== lb.y || displayLb.w !== lb.w || displayLb.h !== lb.h);
            const rect = blockRect(displayLb);
            const isSelected = selectedBlock === block.id;
            return (
              <div
                key={block.id}
                className={`${styles.block} ${isSelected ? styles.blockSelected : ""} ${editing ? styles.blockEditing : ""} ${isMoved ? styles.blockPreview : ""}`}
                style={rect}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!placingBlock) setSelectedBlock(isSelected ? null : block.id);
                }}
              >
                {/* Chrome bar (edit mode) */}
                {editing && (
                  <div className={styles.blockChrome}>
                    <span className={styles.blockHandle}>{"\u205E\u205E"}</span>
                    <span className={styles.blockType}>{block.label}</span>
                    <span className={styles.blockSize}>
                      {displayLb.w}&times;{displayLb.h}
                    </span>
                    <button className={styles.blockEditBtn} title="Configure"
                      onClick={(e) => { e.stopPropagation(); setReplaceTarget(replaceTarget === block.id ? null : block.id); }}>
                      {"\u2699"}
                    </button>
                    <button
                      className={`${styles.blockEditBtn} ${styles.blockEditBtnDanger}`}
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                    >
                      {"\u2715"}
                    </button>
                  </div>
                )}

                {/* Replace popover */}
                {replaceTarget === block.id && (
                  <div className={styles.replacePopover}>
                    <div className={styles.replacePopoverHeader}>Replace Block</div>
                    {BLOCK_DEFS.map(def => (
                      <div key={def.type} className={`${styles.replacePopoverItem} ${block.type === def.type ? styles.replacePopoverActive : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (def.type !== block.type) {
                            setBlocks(prev => ({
                              ...prev,
                              [block.id]: { ...prev[block.id], type: def.type, label: def.label, color: def.color, value: undefined, sub: undefined }
                            }));
                          }
                          setReplaceTarget(null);
                        }}>
                        <div className={styles.replacePopoverIcon} style={{ color: def.color, background: def.color + "12" }}>{def.icon}</div>
                        <span className={styles.replacePopoverName}>{def.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resize handles (edit mode) */}
                {editing && (
                  <>
                    <div className={`${styles.resize} ${styles.resizeRight}`}>
                      <div className={styles.resizeDot} />
                    </div>
                    <div className={`${styles.resize} ${styles.resizeBottom}`}>
                      <div className={styles.resizeDot} />
                    </div>
                    <div className={`${styles.resize} ${styles.resizeCorner}`}>
                      <div className={styles.resizeDot} />
                    </div>
                  </>
                )}

                {/* Block content */}
                <BlockContent block={renderBlock} />

                {/* Accent line (NOT in edit mode) */}
                {!editing && (
                  <div
                    className={styles.blockLine}
                    style={{ background: block.color }}
                  />
                )}
              </div>
            );
          })}

          {/* Column insertion zones — vertical "+" between blocks within a row (edit mode, not during drag) */}
          {editing && !dragging && rows.map((row, rowIdx) => {
            if (row.blockIds.length >= MAX_PER_ROW || row.blockIds.length === 0) return null;
            const rowLayoutBlocks = layout.filter(lb => row.blockIds.includes(lb.id));
            if (rowLayoutBlocks.length === 0) return null;
            const rowY = rowLayoutBlocks[0].y;
            const rowH = rowLayoutBlocks[0].h;
            // Insertion points: between blocks + after last block (if row has room)
            const points: { x: number; afterIdx: number }[] = [];
            for (let bi = 0; bi < rowLayoutBlocks.length - 1; bi++) {
              const left = rowLayoutBlocks[bi];
              points.push({ x: left.x + left.w, afterIdx: bi });
            }
            // Also show after the last block (right edge) — the row can accept more
            const last = rowLayoutBlocks[rowLayoutBlocks.length - 1];
            points.push({ x: last.x + last.w, afterIdx: rowLayoutBlocks.length - 1 });
            return points.map((pt) => {
              return (
                <div
                  key={`colins-${rowIdx}-${pt.afterIdx}`}
                  className={styles.colInsertionZone}
                  style={{
                    left: Math.min(pt.x * (CELL + GAP) - 12, GRID_W - 12),
                    top: rowY * (CELL + GAP),
                    height: rowH * CELL + (rowH - 1) * GAP,
                  }}
                >
                  <div className={styles.colInsertionLine} />
                  <button
                    className={styles.insertionBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Insert a new block into this row at this position
                      const newId = `b${Date.now()}`;
                      const firstDef = BLOCK_DEFS[0];
                      const newBlock: CanvasBlock = { id: newId, type: firstDef.type, label: firstDef.label, color: firstDef.color, w: firstDef.defaultW };
                      setBlocks(prev => ({ ...prev, [newId]: newBlock }));
                      // Insert after the block on the left side of this gap
                      setRows(prev => prev.map((r, i) => {
                        if (i !== rowIdx) return r;
                        const newIds = [...r.blockIds];
                        newIds.splice(pt.afterIdx + 1, 0, newId);
                        return { ...r, blockIds: newIds };
                      }));
                      // Open replace popover on the new block so user can pick the type
                      setReplaceTarget(newId);
                    }}
                  >
                    +
                  </button>
                </div>
              );
            });
          })}

          {/* Row insertion zones (edit mode, not during drag) */}
          {editing && !dragging && rowBoundaries.map((bound, i) => (
            <div
              key={`ins-${i}`}
              className={styles.insertionZone}
              style={{ top: bound.y * (CELL + GAP) - 12, width: GRID_W }}
            >
              <div className={styles.insertionLine} />
              <button
                className={styles.insertionBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  const insertIdx = bound.afterRowIdx + 1;
                  const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [] };
                  setRows(prev => [...prev.slice(0, insertIdx), newRow, ...prev.slice(insertIdx)]);
                  setInsertTarget(insertIdx);
                  setShowLibrary(true);
                }}
              >
                +
              </button>
            </div>
          ))}

          {/* Empty row placeholders */}
          {rows.map((row, rowIdx) => {
            if (row.blockIds.length > 0) return null;
            let y = 0;
            for (let i = 0; i < rowIdx; i++) {
              const rb = layout.filter(lb => rows[i].blockIds.includes(lb.id));
              y += rb.length > 0 ? rb[0].h : 2;
            }
            return (
              <div
                key={`empty-${row.id}`}
                className={styles.emptyRow}
                style={{
                  left: 0, top: y * (CELL + GAP),
                  width: GRID_W,
                  height: 2 * CELL + GAP,
                }}
              >
                <span className={styles.emptyRowText}>Drag a block here or click + to choose</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <span>
          {"\u25C6"} {blockCount} blocks &middot; {COLS}-column grid &middot;
          Dashboard
        </span>
        <span>
          {editing
            ? "\u270E Editing \u2014 drag, resize, + to add"
            : "Powered by @felmark/forge"}
        </span>
      </div>

      {/* ── Library Panel ── */}
      {showLibrary && (
        <div className={styles.library}>
          <div className={styles.libraryHead}>
            <span className={styles.libraryTitle}>Space Blocks</span>
            <button
              className={styles.libraryClose}
              onClick={() => {
                setShowLibrary(false);
                setInsertTarget(null);
                setRows(prev => prev.filter(r => r.blockIds.length > 0));
              }}
            >
              {"\u2715"}
            </button>
          </div>
          <div className={styles.libraryHint}>
            Drag a block onto the canvas to place it.
          </div>
          <div className={styles.libraryList}>
            {BLOCK_DEFS.map((bt) => (
              <div
                key={bt.type}
                className={styles.libraryItem}
                onMouseDown={(e) => {
                  e.preventDefault();
                  startDragWithListeners(bt.type);
                }}
                style={{ cursor: "grab" }}
              >
                <div
                  className={styles.libraryItemIcon}
                  style={{
                    color: bt.color,
                    background: bt.color + "06",
                    borderColor: bt.color + "12",
                  }}
                >
                  {bt.icon}
                </div>
                <div>
                  <div className={styles.libraryItemName}>{bt.label}</div>
                  <div className={styles.libraryItemMeta}>
                    {bt.defaultW}&times;{bt.defaultH}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Drag cursor preview (follows mouse everywhere) ── */}
      {dragging && dragCursor && placingBlock && (() => {
        const def = BLOCK_DEFS.find((bt) => bt.type === placingBlock);
        if (!def) return null;
        return (
          <div
            className={styles.dragPreview}
            style={{
              left: dragCursor.x + 14,
              top: dragCursor.y + 14,
            }}
          >
            <div
              className={styles.dragPreviewIcon}
              style={{ color: def.color, background: def.color + "12" }}
            >
              {def.icon}
            </div>
            <div>
              <div className={styles.dragPreviewName}>{def.label}</div>
              <div className={styles.dragPreviewSize}>
                {def.defaultW}&times;{def.defaultH}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Placing bar ── */}
      {dragging && placingBlock && (
        <div className={styles.placing}>
          <span className={styles.placingLabel}>PLACING</span>
          <span>{BLOCK_DEFS.find((bt) => bt.type === placingBlock)?.label}</span>
          <span className={styles.placingHint}>Drop on grid to place</span>
        </div>
      )}
    </div>
  );
}
