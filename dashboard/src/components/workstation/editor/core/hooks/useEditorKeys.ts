"use client";

import { useEffect } from "react";

interface UseEditorKeysOptions {
  getSelectedBlockId: () => string | null;
  setCmdPalette: React.Dispatch<React.SetStateAction<boolean>>;
  cmdPaletteSourceBlockId: React.MutableRefObject<string | null>;
  deleteBlock: (blockId: string) => void;
  blockElMap: React.MutableRefObject<Record<string, HTMLDivElement>>;
}

export function useEditorKeys({
  getSelectedBlockId,
  setCmdPalette,
  cmdPaletteSourceBlockId,
  deleteBlock,
  blockElMap,
}: UseEditorKeysOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        cmdPaletteSourceBlockId.current = getSelectedBlockId();
        setCmdPalette(p => !p);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        const sel = window.getSelection();
        if (!sel || !sel.anchorNode) return;
        const entries = Object.entries(blockElMap.current);
        for (const [id, el] of entries) {
          if (el && el.contains(sel.anchorNode)) {
            deleteBlock(id);
            break;
          }
        }
      }
      if (e.key === "Escape") setCmdPalette(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [getSelectedBlockId, setCmdPalette, cmdPaletteSourceBlockId, deleteBlock, blockElMap]);
}
