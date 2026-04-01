"use client";

import { useState, useRef, useMemo } from "react";
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

export default function Canvas() {
  const [blocks, setBlocks] = useState<Record<string, CanvasBlock>>(INITIAL_BLOCK_MAP);
  const [rows, setRows] = useState<CanvasRow[]>(INITIAL_ROWS);
  const [editing, setEditing] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [hoverCell, setHoverCell] = useState<CellPosition | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<string | null>(null);
  const [insertTarget, setInsertTarget] = useState<number | null>(null);
  const [libraryTarget, setLibraryTarget] = useState<LibraryTarget>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  const dragMove = useDragMove();
  const dragResize = useDragResize(blocksRef, setBlocks, BLOCK_DEFS);

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

  const handleToggleEdit = () => {
    const entering = !editing;
    setEditing(entering);
    setShowLibrary(false);
    setSelectedBlock(null);
    setReplaceTarget(null);
    setLibraryTarget(null);
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
  const gridRows = Math.max(maxRow + 3, 6);
  const isEditOrPlacing = editing || !!dragPlace.placingBlock;
  const blockCount = Object.keys(blocks).length;

  return (
    <div className={styles.canvas}>
      <Toolbar
        editing={editing}
        showLibrary={showLibrary}
        onToggleEdit={handleToggleEdit}
        onToggleLibrary={handleToggleLibrary}
      />

      {/* ── Grid Area ── */}
      <div
        className={styles.gridArea}
        ref={canvasRef}
        onMouseMove={handleCanvasMove}
        onClick={() => { setReplaceTarget(null); }}
        style={{ cursor: dragPlace.dragging ? "grabbing" : "default" }}
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
          {isEditOrPlacing && hoverCell && !dragPlace.placingBlock && (
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
            const renderBlock: RenderBlock = { ...block, w: lb.w, h: lb.h };
            const displayLb = activePreview?.find((p) => p.id === lb.id) ?? lb;
            const isMoved = activePreview && (displayLb.x !== lb.x || displayLb.y !== lb.y || displayLb.w !== lb.w || displayLb.h !== lb.h);
            const rect = blockRect(displayLb);
            const isSelected = selectedBlock === block.id;
            return (
              <div
                key={block.id}
                className={`${styles.block} ${isSelected ? styles.blockSelected : ""} ${editing ? styles.blockEditing : ""} ${isMoved ? styles.blockPreview : ""} ${dragMove.movingBlock === block.id ? styles.blockMoving : ""} ${dragResize.resizing ? styles.blockNoTransition : ""}`}
                style={{ ...rect, ...(replaceTarget === block.id ? { zIndex: 15 } : {}) }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!dragPlace.placingBlock) setSelectedBlock(isSelected ? null : block.id);
                }}
              >
                {editing && (
                  <BlockChrome
                    blockId={block.id}
                    label={block.label}
                    displayW={displayLb.w}
                    displayH={displayLb.h}
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
                {editing && (() => {
                  const row = rows.find(r => r.blockIds.includes(block.id));
                  if (!row) return null;
                  const blockIdx = row.blockIds.indexOf(block.id);
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
          {editing && !dragPlace.dragging && rows.map((row, rowIdx) => {
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
          {editing && !dragPlace.dragging && rowBoundaries.map((bound, i) => (
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
      <div className={styles.footer}>
        <span className={styles.footerLeft}>
          {"\u25C6"} {blockCount} blocks &middot; {COLS}-column grid &middot;
          Dashboard
        </span>
        <span className={styles.footerRight}>
          {editing
            ? "\u270E Editing \u2014 drag, resize, + to add"
            : "Powered by @felmark/forge"}
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
