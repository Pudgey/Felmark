/* Hook — footer status string derivation */

import { useMemo } from "react";

interface UseCanvasFooterOptions {
  editing: boolean;
  dragPlace: { dragging: boolean };
  dragMove: { movingBlock: string | null; moveTarget: { kind: string } | null };
  dragResize: { resizing: boolean };
  showLibrary: boolean;
  libraryTarget: { kind: string } | null;
  replaceTarget: string | null;
  selectedBlock: string | null;
  modifierReveal: boolean;
  placingBlockLabel: string;
  movingBlockLabel: string;
  selectedBlockLabel: string;
  replaceBlockLabel: string;
}

export function useCanvasFooter(opts: UseCanvasFooterOptions): string {
  const {
    editing, dragPlace, dragMove, dragResize,
    showLibrary, libraryTarget, replaceTarget, selectedBlock,
    modifierReveal, placingBlockLabel, movingBlockLabel,
    selectedBlockLabel, replaceBlockLabel,
  } = opts;

  return useMemo(() => {
    if (!editing) return "Canvas live";

    if (dragPlace.dragging) {
      return `Placing ${placingBlockLabel}`;
    }
    if (dragMove.movingBlock) {
      return dragMove.moveTarget?.kind === "row"
        ? `Moving ${movingBlockLabel} to a new row`
        : dragMove.moveTarget?.kind === "column"
          ? `Moving ${movingBlockLabel} into place`
          : `Moving ${movingBlockLabel}`;
    }
    if (dragResize.resizing) {
      return "Resizing layout";
    }
    if (showLibrary) {
      return libraryTarget?.kind === "row"
        ? "Choose a block for the new row"
        : libraryTarget?.kind === "column"
          ? "Choose a block for this slot"
          : "Choose a block to add";
    }
    if (replaceTarget) {
      return `Replacing ${replaceBlockLabel}`;
    }
    if (selectedBlock) {
      return `${selectedBlockLabel} active`;
    }
    if (modifierReveal) {
      return "Helpers revealed";
    }
    return "Presentation mode \u00b7 hover to reveal controls or hold Alt/Option for guides";
  }, [
    editing, dragPlace.dragging, dragMove.movingBlock, dragMove.moveTarget,
    dragResize.resizing, showLibrary, libraryTarget, replaceTarget,
    selectedBlock, modifierReveal, placingBlockLabel, movingBlockLabel,
    selectedBlockLabel, replaceBlockLabel,
  ]);
}
