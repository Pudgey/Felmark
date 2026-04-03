/* Hook — derived layout labels, dimensions, and boolean flags */

import { useMemo } from "react";
import type { CanvasBlock, LayoutBlock } from "../types";
import { BLOCK_DEFS, spanHeightPx } from "../registry";

interface UseCanvasLabelsOptions {
  blocks: Record<string, CanvasBlock>;
  layout: LayoutBlock[];
  editing: boolean;
  modifierReveal: boolean;
  hoveredBlock: string | null;
  hoverRevealBlock: string | null;
  selectedBlock: string | null;
  replaceTarget: string | null;
  showLibrary: boolean;
  dragPlace: { dragging: boolean; placingBlock: string | null };
  dragMove: { movingBlock: string | null };
  dragResize: { resizing: boolean };
}

export function useCanvasLabels(opts: UseCanvasLabelsOptions) {
  const {
    blocks, layout, editing, modifierReveal,
    hoveredBlock, hoverRevealBlock, selectedBlock, replaceTarget,
    showLibrary, dragPlace, dragMove, dragResize,
  } = opts;

  return useMemo(() => {
    const maxRow = layout.reduce((max, lb) => Math.max(max, lb.y + lb.h), 0);
    const contentHeight = maxRow > 0 ? spanHeightPx(maxRow) : 0;
    const dotRows = Math.max(maxRow + 1, 6);
    const minCanvasHeight = spanHeightPx(6);
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

    return {
      maxRow, contentHeight, dotRows, minCanvasHeight, gridMinHeight,
      isEditOrPlacing, blockCount, focusedBlockId, helperLeadBlockId,
      showInsertionControls, showEdgeAnchors,
      placingBlockLabel, movingBlockLabel, selectedBlockLabel, replaceBlockLabel,
    };
  }, [
    blocks, layout, editing, modifierReveal,
    hoveredBlock, hoverRevealBlock, selectedBlock, replaceTarget,
    showLibrary, dragPlace, dragMove, dragResize,
  ]);
}
