"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Block } from "@/lib/types";

interface UseContentCacheOptions {
  onWordCountChange: (words: number, chars: number) => void;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  activeProject: string;
}

export function useContentCache({ onWordCountChange, onBlocksChange, activeProject }: UseContentCacheOptions) {
  const contentCache = useRef<Record<string, string>>({});
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const saveStateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const restoreContentCache = useCallback((nextBlocks: Block[]) => {
    contentCache.current = Object.fromEntries(nextBlocks.map(block => [block.id, block.content || ""]));
  }, []);

  const mergeCachedContent = useCallback((source: Block[]) => {
    let changed = false;
    const merged = source.map(block => {
      const cached = contentCache.current[block.id];
      if (typeof cached === "string" && cached !== block.content) {
        changed = true;
        return { ...block, content: cached };
      }
      return block;
    });
    return changed ? merged : source;
  }, []);

  const settleSaveState = useCallback(() => {
    if (saveStateTimer.current) clearTimeout(saveStateTimer.current);
    saveStateTimer.current = setTimeout(() => setSaveState("saved"), 650);
  }, []);

  const commitBlocks = useCallback((nextBlocks: Block[]) => {
    restoreContentCache(nextBlocks);
    queueMicrotask(() => onBlocksChange(activeProject, nextBlocks));
  }, [activeProject, onBlocksChange, restoreContentCache]);

  const emitWordCounts = useCallback((currentBlocks: Block[]) => {
    let text = "";
    currentBlocks.forEach(block => {
      const html = contentCache.current[block.id] || block.content || "";
      const parsed = document.createElement("div");
      parsed.innerHTML = html;
      text += " " + (parsed.textContent || "");
    });
    const trimmed = text.trim();
    onWordCountChange(trimmed.split(/\s+/).filter(Boolean).length, trimmed.length);
  }, [onWordCountChange]);

  const flushCachedContent = useCallback((
    setBlocksLocal: React.Dispatch<React.SetStateAction<Block[]>>,
  ) => {
    setBlocksLocal(prev => {
      const merged = mergeCachedContent(prev);
      if (merged !== prev) {
        commitBlocks(merged);
        queueMicrotask(() => emitWordCounts(merged));
        return merged;
      }
      queueMicrotask(() => emitWordCounts(prev));
      return prev;
    });
    typingSaveTimer.current = null;
    settleSaveState();
  }, [commitBlocks, emitWordCounts, mergeCachedContent, settleSaveState]);

  // Cleanup timers on unmount
  useEffect(() => () => {
    if (typingSaveTimer.current) clearTimeout(typingSaveTimer.current);
    if (saveStateTimer.current) clearTimeout(saveStateTimer.current);
  }, []);

  return {
    contentCache,
    saveState,
    setSaveState,
    saveStateTimer,
    typingSaveTimer,
    restoreContentCache,
    mergeCachedContent,
    settleSaveState,
    commitBlocks,
    emitWordCounts,
    flushCachedContent,
  };
}
