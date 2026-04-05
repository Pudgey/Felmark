"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CanvasBlock, CanvasRow, RenderBlock, CellPosition } from "./types";
import { layoutRows } from "./layout";
import { BLOCK_DEFS, COLS, CELL, GAP, GRID_W, MAX_PER_ROW, INITIAL_BLOCK_MAP, INITIAL_ROWS, blockRect } from "./registry";
import { useDragPlace } from "./hooks/useDragPlace";
import { useDragMove } from "./hooks/useDragMove";
import { useDragResize } from "./hooks/useDragResize";
import Toolbar from "./toolbar/Toolbar";
import BlockChrome from "./chrome/BlockChrome";
import ReplacePopover from "./chrome/ReplacePopover";
import Splitter from "./chrome/Splitter";
import BlockContent from "./blocks/BlockContent";
import Library from "./library/Library";
import RowInsertionBar from "./insertions/RowInsertionBar";
import ColInsertionBar from "./insertions/ColInsertionBar";
import EmptyRow from "./insertions/EmptyRow";
import styles from "./Canvas.module.css";

/* ── Main Canvas Component ── */

type LibraryTarget =
  | { kind: "row"; insertIdx: number }
  | { kind: "column"; rowIdx: number; afterIdx: number }
  | null;

const METRIC_BLOCK_TYPES = new Set(["revenue", "outstanding", "rate", "goal"]);
const CHAT_BLOCK_TYPES = new Set(["chat"]);
const UTILITY_BLOCK_TYPES = new Set(["whisper", "pipeline", "calendar", "automation", "files", "revenue-chart"]);

export default function Canvas() {
  const [blocks, setBlocks] = useState<Record<string, CanvasBlock>>(INITIAL_BLOCK_MAP);
  const [rows, setRows] = useState<CanvasRow[]>(INITIAL_ROWS);
  const [editing, setEditing] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [hoverCell, setHoverCell] = useState<CellPosition | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [hoverRevealBlock, setHoverRevealBlock] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [insertTarget, setInsertTarget] = useState<number | null>(null);
  const [libraryTarget, setLibraryTarget] = useState<LibraryTarget>(null);
  const [modifierReveal, setModifierReveal] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hoverRevealTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

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

  /* ── Refs for hooks ── */

  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const insertTargetRef = useRef(insertTarget);
  insertTargetRef.current = insertTarget;

  /* ── Drag hooks ── */

  const dragPlace = useDragPlace({
    layoutRef, rowsRef, blocksRef, insertTargetRef, gridRef,
    setBlocks, setRows, setInsertTarget, setShowLibrary,
  });

  const dragMove = useDragMove({
    layoutRef,
    rowsRef,
    blocksRef,
    gridRef,
    setRows,
  });
  const dragResize = useDragResize(blocksRef, setBlocks);

  useEffect(() => {
    if (!editing) {
      setModifierReveal(false);
      setHoverRevealBlock(null);
      if (hoverRevealTimerRef.current) {
        window.clearTimeout(hoverRevealTimerRef.current);
        hoverRevealTimerRef.current = null;
      }
      return;
    }

    const handleKeyChange = (event: KeyboardEvent) => {
      setModifierReveal(event.altKey);
    };

    const handleWindowBlur = () => {
      setModifierReveal(false);
    };

    window.addEventListener("keydown", handleKeyChange);
    window.addEventListener("keyup", handleKeyChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyChange);
      window.removeEventListener("keyup", handleKeyChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [editing]);

  /* ── Preview layout merging ── */

  const activePreview = dragPlace.previewLayout ?? dragMove.previewLayout ?? null;

  /* ── Grid math ── */

  const canvasToGrid = (clientX: number, clientY: number): CellPosition | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < -20 || y < -20) return null;
    const col = Math.round(x / (CELL + GAP));
    const row = Math.round(y / (CELL + GAP));
    return { col: Math.max(0, Math.min(COLS - 1, col)), row: Math.max(0, row) };
  };

  /* ── Handlers ── */

  const handleCanvasMove = (e: React.MouseEvent) => {
    const cell = canvasToGrid(e.clientX, e.clientY);
    if (cell) setHoverCell(cell);
  };

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
      return updated.filter((r) => r.blockIds.length > 0);
    });
    setSelectedBlock(null);
  };

  const moveBlockWithinRow = (blockId: string, direction: "left" | "right") => {
    setRows((prev) => prev.map((row) => {
      const index = row.blockIds.indexOf(blockId);
      if (index < 0) return row;

      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= row.blockIds.length) return row;

      const nextIds = [...row.blockIds];
      const [moved] = nextIds.splice(index, 1);
      nextIds.splice(targetIndex, 0, moved);
      return { ...row, blockIds: nextIds };
    }));
  };

  const handleToggleEdit = () => {
    const entering = !editing;
    setEditing(entering);
    setShowLibrary(false);
    setHoveredBlock(null);
    setHoverRevealBlock(null);
    setSelectedBlock(null);
    setReplaceTarget(null);
    setLibraryTarget(null);
    setModifierReveal(false);
  };

  const handleToggleLibrary = () => {
    setShowLibrary((prev) => !prev);
    setLibraryTarget(null);
  };

  const handleLibraryClose = () => {
    setShowLibrary(false);
    setInsertTarget(null);
    setLibraryTarget(null);
    setRows(prev => prev.filter(r => r.blockIds.length > 0));
  };

  const handleContextualAdd = (blockId: string) => {
    const rowIdx = rows.findIndex((row) => row.blockIds.includes(blockId));
    if (rowIdx < 0) {
      setLibraryTarget(null);
      setShowLibrary(true);
      return;
    }

    const row = rows[rowIdx];
    const afterIdx = row.blockIds.indexOf(blockId);

    if (afterIdx < 0) {
      setLibraryTarget(null);
      setShowLibrary(true);
      return;
    }

    setReplaceTarget(null);
    setLibraryTarget(
      row.blockIds.length < MAX_PER_ROW
        ? { kind: "column", rowIdx, afterIdx }
        : { kind: "row", insertIdx: rowIdx + 1 },
    );
    setShowLibrary(true);
  };

  const handleLibrarySelect = (type: string) => {
    const def = BLOCK_DEFS.find((bt) => bt.type === type);
    if (!def) return;

    const newId = `b${Date.now()}`;
    const newBlock: CanvasBlock = {
      id: newId,
      type: def.type,
      label: def.label,
      color: def.color,
      w: def.defaultW,
    };

    setBlocks((prev) => ({ ...prev, [newId]: newBlock }));
    setRows((prev) => {
      if (!libraryTarget) {
        return [...prev, { id: `r${Date.now()}`, blockIds: [newId] }];
      }

      if (libraryTarget.kind === "row") {
        const newRow: CanvasRow = { id: `r${Date.now()}`, blockIds: [newId] };
        return [
          ...prev.slice(0, libraryTarget.insertIdx),
          newRow,
          ...prev.slice(libraryTarget.insertIdx),
        ];
      }

      return prev.map((row, index) => {
        if (index !== libraryTarget.rowIdx) return row;
        const nextIds = [...row.blockIds];
        nextIds.splice(libraryTarget.afterIdx + 1, 0, newId);
        return { ...row, blockIds: nextIds };
      });
    });

    setSelectedBlock(newId);
    setReplaceTarget(null);
    setShowLibrary(false);
    setLibraryTarget(null);
    setInsertTarget(null);
  };

  /* ── Grid dimensions ── */

  const maxRow = layout.reduce((max, lb) => Math.max(max, lb.y + lb.h), 0);
  const contentHeight = maxRow > 0
    ? maxRow * CELL + Math.max(0, maxRow - 1) * GAP
    : 0;
  const dotRows = Math.max(maxRow + 1, 6);
  const minCanvasHeight = 6 * CELL + 5 * GAP;
  const gridMinHeight = Math.max(contentHeight + 18, minCanvasHeight);
  const isEditOrPlacing = editing || !!dragPlace.placingBlock;
  const blockCount = Object.keys(blocks).length;
  const focusedBlockId = replaceTarget ?? selectedBlock;
  const helperLeadBlockId = replaceTarget ?? selectedBlock ?? (modifierReveal ? hoveredBlock : hoverRevealBlock);
  const showInsertionControls = editing
    && modifierReveal
    && !dragPlace.dragging
    && !dragMove.movingBlock
    && !dragResize.resizing
    && hoveredBlock === null
    && focusedBlockId === null
    && !showLibrary;
  const showEdgeAnchors = editing
    && modifierReveal
    && !dragPlace.dragging
    && !dragMove.movingBlock
    && !dragResize.resizing
    && !showLibrary;
  const placingBlockLabel = dragPlace.placingBlock
    ? BLOCK_DEFS.find((bt) => bt.type === dragPlace.placingBlock)?.label ?? "Block"
    : "Block";
  const movingBlockLabel = dragMove.movingBlock
    ? blocks[dragMove.movingBlock]?.label ?? "Block"
    : "Block";
  const selectedBlockLabel = selectedBlock
    ? blocks[selectedBlock]?.label ?? "Block"
    : "Block";
  const replaceBlockLabel = replaceTarget
    ? blocks[replaceTarget]?.label ?? "Block"
    : "Block";

  let footerStatus = "Canvas live";
  if (editing) {
    if (dragPlace.dragging) {
      footerStatus = `Placing ${placingBlockLabel}`;
    } else if (dragMove.movingBlock) {
      footerStatus = dragMove.moveTarget?.kind === "row"
        ? `Moving ${movingBlockLabel} to a new row`
        : dragMove.moveTarget?.kind === "column"
          ? `Moving ${movingBlockLabel} into place`
          : `Moving ${movingBlockLabel}`;
    } else if (dragResize.resizing) {
      footerStatus = "Resizing layout";
    } else if (showLibrary) {
      footerStatus = libraryTarget?.kind === "row"
        ? "Choose a block for the new row"
        : libraryTarget?.kind === "column"
          ? "Choose a block for this slot"
          : "Choose a block to add";
    } else if (replaceTarget) {
      footerStatus = `Replacing ${replaceBlockLabel}`;
    } else if (selectedBlock) {
      footerStatus = `${selectedBlockLabel} active`;
    } else if (modifierReveal) {
      footerStatus = "Helpers revealed";
    } else {
      footerStatus = "Presentation mode · hover to reveal controls or hold Alt/Option for guides";
    }
  }
  const movingBlockData = dragMove.movingBlock
    ? blocks[dragMove.movingBlock] ?? null
    : null;
  const movingLayoutBlock = dragMove.movingBlock
    ? layout.find((lb) => lb.id === dragMove.movingBlock) ?? null
    : null;
  const movingRenderBlock = movingBlockData && movingLayoutBlock
    ? { ...movingBlockData, w: movingLayoutBlock.w, h: movingLayoutBlock.h }
    : null;
  const movingBlockFrame = movingLayoutBlock ? blockRect(movingLayoutBlock) : null;

  return (
    <div className={styles.canvas}>
      <Toolbar
        editing={editing}
        onToggleEdit={handleToggleEdit}
        onToggleLibrary={handleToggleLibrary}
      />

      {/* ── Grid Area ── */}
      <div
        className={styles.gridArea}
        ref={canvasRef}
        onMouseMove={handleCanvasMove}
        onClick={() => {
          setReplaceTarget(null);
          setSelectedBlock(null);
          setHoverRevealBlock(null);
        }}
        style={{ cursor: dragPlace.dragging ? "grabbing" : "default" }}
      >
        <div
          className={`${styles.gridContainer} ${editing ? styles.gridContainerEditing : ""}`}
          ref={gridRef}
          style={{
            width: GRID_W,
            minHeight: gridMinHeight,
          }}
        >
          {showEdgeAnchors && (
            <>
              <div className={`${styles.edgeAnchor} ${styles.edgeAnchorTop}`} />
              <div
                className={`${styles.edgeAnchor} ${styles.edgeAnchorBottom}`}
                style={{ top: contentHeight + 16 }}
              />
            </>
          )}

          {/* Dot grid */}
          <div className={styles.dots}>
            {Array.from({ length: (COLS + 1) * (dotRows + 1) }).map((_, i) => {
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
          {isEditOrPlacing && hoverCell && modifierReveal && !dragPlace.placingBlock && !dragMove.movingBlock && (
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

          {dragMove.previewSlot === null && dragMove.moveTarget?.kind === "row" && (
            <div
              className={styles.moveTargetRow}
              style={{ top: dragMove.moveTarget.top, width: dragMove.moveTarget.width }}
            >
              <span className={styles.moveTargetCapsule}>New Row</span>
            </div>
          )}

          {dragMove.previewSlot === null && dragMove.moveTarget?.kind === "column" && (
            <div
              className={styles.moveTargetColumn}
              style={{
                left: dragMove.moveTarget.left,
                top: dragMove.moveTarget.top,
                height: dragMove.moveTarget.height,
              }}
            >
              <span className={styles.moveTargetDot} />
            </div>
          )}

          {dragMove.previewSlot && movingBlockData && (
            <div
              className={styles.movePlaceholder}
              style={blockRect(dragMove.previewSlot)}
            >
              <span className={styles.movePlaceholderLabel}>
                {movingBlockData.label}
              </span>
            </div>
          )}

          {/* Ghost block during drag-to-place */}
          {dragPlace.placingBlock && dragPlace.ghostPos && (
            <div
              className={styles.ghost}
              style={{
                left: dragPlace.ghostPos.x * (CELL + GAP),
                top: dragPlace.ghostPos.y * (CELL + GAP),
                width: dragPlace.ghostPos.w * CELL + (dragPlace.ghostPos.w - 1) * GAP,
                height: dragPlace.ghostPos.h * CELL + (dragPlace.ghostPos.h - 1) * GAP,
              }}
            >
              <div className={styles.ghostLabel}>
                {BLOCK_DEFS.find((bt) => bt.type === dragPlace.placingBlock)?.label}
                <div className={styles.ghostMeta}>
                  {dragPlace.ghostPos.w}&times;{dragPlace.ghostPos.h} &middot; Release to place
                </div>
              </div>
            </div>
          )}

          {/* Blocks */}
          {layout.map((lb) => {
            const block = blocks[lb.id];
            if (!block) return null;
            const displayLb = activePreview?.find((p) => p.id === lb.id) ?? lb;
            const renderBlock: RenderBlock = { ...block, w: displayLb.w, h: displayLb.h };
            const isMoved = activePreview && (displayLb.x !== lb.x || displayLb.y !== lb.y || displayLb.w !== lb.w || displayLb.h !== lb.h);
            const rect = blockRect(displayLb);
            const isSelected = selectedBlock === block.id;
            const isMoveSource = dragMove.movingBlock === block.id;
            const isFocusedEditBlock = focusedBlockId === block.id;
            const showEditControls = !dragMove.movingBlock
              && (hoverRevealBlock === block.id || isSelected || replaceTarget === block.id || (modifierReveal && hoveredBlock === block.id));
            const quietForHoveredChrome = editing
              && helperLeadBlockId !== null
              && helperLeadBlockId !== block.id
              && focusedBlockId === null
              && !dragMove.movingBlock
              && !dragResize.resizing;
            const editIdentityClass = editing
              ? METRIC_BLOCK_TYPES.has(block.type)
                ? styles.blockMetricEdit
                : CHAT_BLOCK_TYPES.has(block.type)
                  ? styles.blockChatEdit
                  : UTILITY_BLOCK_TYPES.has(block.type)
                    ? styles.blockUtilityEdit
                    : styles.blockFeedEdit
              : "";
            const row = rows.find((currentRow) => currentRow.blockIds.includes(block.id));
            const blockIdx = row?.blockIds.indexOf(block.id) ?? -1;
            const canMoveLeft = blockIdx > 0;
            const canMoveRight = row !== undefined && blockIdx >= 0 && blockIdx < row.blockIds.length - 1;
            return (
              <div
                key={block.id}
                className={`${styles.block} ${editIdentityClass} ${isSelected ? styles.blockSelected : ""} ${editing ? styles.blockEditing : ""} ${editing && showInsertionControls ? styles.blockInsertionIdle : ""} ${showEditControls ? styles.blockChromeLead : ""} ${quietForHoveredChrome ? styles.blockLayerQuiet : ""} ${focusedBlockId !== null && !dragMove.movingBlock && !isFocusedEditBlock ? styles.blockSubdued : ""} ${isFocusedEditBlock && !dragMove.movingBlock ? styles.blockFocused : ""} ${isMoved ? styles.blockPreview : ""} ${isMoveSource ? styles.blockMoving : ""} ${isMoveSource ? styles.blockDragSource : ""} ${dragResize.resizing ? styles.blockNoTransition : ""}`}
                style={{ ...rect, ...((replaceTarget === block.id || dragMove.movingBlock === block.id) ? { zIndex: 15 } : {}) }}
                onMouseEnter={() => {
                  setHoveredBlock(block.id);
                  if (!editing || selectedBlock !== null || replaceTarget !== null || modifierReveal) return;
                  if (hoverRevealTimerRef.current) {
                    window.clearTimeout(hoverRevealTimerRef.current);
                  }
                  hoverRevealTimerRef.current = window.setTimeout(() => {
                    setHoverRevealBlock(block.id);
                    hoverRevealTimerRef.current = null;
                  }, 220);
                }}
                onMouseLeave={() => {
                  setHoveredBlock((current) => (current === block.id ? null : current));
                  setHoverRevealBlock((current) => (current === block.id ? null : current));
                  if (hoverRevealTimerRef.current) {
                    window.clearTimeout(hoverRevealTimerRef.current);
                    hoverRevealTimerRef.current = null;
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!dragPlace.placingBlock) setSelectedBlock(isSelected ? null : block.id);
                }}
              >
                {editing && !isMoveSource && (
                  <BlockChrome
                    blockId={block.id}
                    label={block.label}
                    displayW={displayLb.w}
                    displayH={displayLb.h}
                    visible={showEditControls}
                    onAdd={handleContextualAdd}
                    canMoveLeft={canMoveLeft}
                    canMoveRight={canMoveRight}
                    onMoveLeft={(id) => moveBlockWithinRow(id, "left")}
                    onMoveRight={(id) => moveBlockWithinRow(id, "right")}
                    onStartMove={dragMove.startMove}
                    onReplace={(id) => setReplaceTarget(replaceTarget === id ? null : id)}
                    onRemove={removeBlock}
                    replaceOpen={replaceTarget === block.id}
                  />
                )}

                {replaceTarget === block.id && (
                  <ReplacePopover
                    currentType={block.type}
                    onReplace={(type, label, color) => {
                      setBlocks(prev => ({
                        ...prev,
                        [block.id]: { ...prev[block.id], type, label, color, value: undefined, sub: undefined },
                      }));
                    }}
                    onClose={() => setReplaceTarget(null)}
                  />
                )}

                {/* Splitter handles (drag-to-resize) */}
                {editing && showEditControls && (() => {
                  if (!row) return null;
                  const rightNeighborId = row.blockIds[blockIdx + 1];
                  const leftNeighborId = blockIdx > 0 ? row.blockIds[blockIdx - 1] : null;
                  return (
                    <>
                      {rightNeighborId && (
                        <Splitter position="right" onStartResize={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          if (!blocks[rightNeighborId]) return;
                          dragResize.startResize(block.id, rightNeighborId, e.clientX, displayLb.w, layout.find(lb2 => lb2.id === rightNeighborId)?.w ?? 2);
                        }} />
                      )}
                      {leftNeighborId && (
                        <Splitter position="left" onStartResize={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          if (!blocks[leftNeighborId]) return;
                          dragResize.startResize(leftNeighborId, block.id, e.clientX, layout.find(lb2 => lb2.id === leftNeighborId)?.w ?? 2, displayLb.w);
                        }} />
                      )}
                    </>
                  );
                })()}

                <BlockContent block={renderBlock} />

                {!editing && (
                  <div
                    className={styles.blockLine}
                    style={{ background: block.color }}
                  />
                )}
              </div>
            );
          })}

          {/* Column insertion zones */}
          {showInsertionControls && rows.map((row, rowIdx) => {
            if (row.blockIds.length >= MAX_PER_ROW || row.blockIds.length === 0) return null;
            const rowLayoutBlocks = layout.filter(lb => row.blockIds.includes(lb.id));
            if (rowLayoutBlocks.length === 0) return null;
            const rowY = rowLayoutBlocks[0].y;
            const rowH = rowLayoutBlocks[0].h;
            const points: { x: number; afterIdx: number }[] = [];
            for (let bi = 0; bi < rowLayoutBlocks.length - 1; bi++) {
              const left = rowLayoutBlocks[bi];
              points.push({ x: left.x + left.w, afterIdx: bi });
            }
            const last = rowLayoutBlocks[rowLayoutBlocks.length - 1];
            points.push({ x: last.x + last.w, afterIdx: rowLayoutBlocks.length - 1 });
            return points.map((pt) => (
              <ColInsertionBar
                key={`colins-${rowIdx}-${pt.afterIdx}`}
                left={Math.min(pt.x * (CELL + GAP) - 12, GRID_W - 12)}
                top={rowY * (CELL + GAP)}
                height={rowH * CELL + (rowH - 1) * GAP}
                onInsert={() => {
                  setLibraryTarget({ kind: "column", rowIdx, afterIdx: pt.afterIdx });
                  setShowLibrary(true);
                }}
              />
            ));
          })}

          {/* Row insertion zones */}
          {showInsertionControls && rowBoundaries.map((bound, i) => (
            <RowInsertionBar
              key={`ins-${i}`}
              y={bound.y * (CELL + GAP)}
              width={GRID_W}
              onInsert={() => {
                setLibraryTarget({ kind: "row", insertIdx: bound.afterRowIdx + 1 });
                setShowLibrary(true);
              }}
            />
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
              <EmptyRow
                key={`empty-${row.id}`}
                top={y * (CELL + GAP)}
                width={GRID_W}
                height={2 * CELL + GAP}
              />
            );
          })}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={`${styles.footer} ${editing ? styles.footerEditing : ""}`}>
        <span className={styles.footerLeft}>
          <span className={styles.footerTag}>{editing ? "Editing" : "Canvas"}</span>
          <span className={styles.footerMeta}>{blockCount} blocks</span>
          <span className={styles.footerDivider}>&middot;</span>
          <span className={styles.footerMeta}>{COLS}-column grid</span>
        </span>
        <span className={styles.footerRight}>
          <span className={styles.footerStatus}>{footerStatus}</span>
        </span>
      </div>

      {/* ── Library Panel ── */}
      {showLibrary && (
        <Library
          onStartDrag={dragPlace.startDragWithListeners}
          onSelect={handleLibrarySelect}
          selectionMode={libraryTarget !== null}
          onClose={handleLibraryClose}
        />
      )}

      {dragMove.movingBlock && dragMove.moveCursor && dragMove.moveOffset && movingRenderBlock && movingBlockFrame && (
        <div
          className={styles.moveGhost}
          style={{
            left: dragMove.moveCursor.x - dragMove.moveOffset.x,
            top: dragMove.moveCursor.y - dragMove.moveOffset.y,
            width: movingBlockFrame.width,
            height: movingBlockFrame.height,
          }}
        >
          <div className={styles.moveGhostCard}>
            <BlockContent block={movingRenderBlock} />
          </div>
        </div>
      )}

      {/* ── Drag cursor preview ── */}
      {dragPlace.dragging && dragPlace.dragCursor && dragPlace.placingBlock && (() => {
        const def = BLOCK_DEFS.find((bt) => bt.type === dragPlace.placingBlock);
        if (!def) return null;
        return (
          <div
            className={styles.dragPreview}
            style={{
              left: dragPlace.dragCursor.x + 14,
              top: dragPlace.dragCursor.y + 14,
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
      {dragPlace.dragging && dragPlace.placingBlock && (
        <div className={styles.placing}>
          <span className={styles.placingLabel}>PLACING</span>
          <span>{BLOCK_DEFS.find((bt) => bt.type === dragPlace.placingBlock)?.label}</span>
          <span className={styles.placingHint}>Drop on grid to place</span>
        </div>
      )}
    </div>
  );
}
