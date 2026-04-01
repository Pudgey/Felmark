"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Block, BlockType } from "@/lib/types";
import { uid, cursorTo } from "@/lib/utils";

interface UseBlockOperationsOptions {
  blocksProp: Block[];
  activeProject: string;
  contentCache: React.MutableRefObject<Record<string, string>>;
  blockElMap: React.MutableRefObject<Record<string, HTMLDivElement>>;
  restoreContentCache: (nextBlocks: Block[]) => void;
  mergeCachedContent: (source: Block[]) => Block[];
  commitBlocks: (nextBlocks: Block[]) => void;
  settleSaveState: () => void;
  setSaveState: React.Dispatch<React.SetStateAction<"saved" | "saving">>;
  typingSaveTimer: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  emitWordCounts: (blocks: Block[]) => void;
  flushCachedContent: (setBlocksLocal: React.Dispatch<React.SetStateAction<Block[]>>) => void;
  focusNew: (id: string, retries?: number) => void;
  pushUndoAction: (label: string, snapshot: Block[], focusId?: string) => void;
  setFreshBlockId: React.Dispatch<React.SetStateAction<string | null>>;
  setUndoAction: React.Dispatch<React.SetStateAction<{ label: string; snapshot: Block[]; focusId?: string } | null>>;
  tabs: { id: string; name: string; active: boolean; client?: string }[];
  onTabRename: (id: string, name: string) => void;
  manuallyRenamed: React.MutableRefObject<Set<string>>;
  onBlocksChange: (projectId: string, blocks: Block[]) => void;
  editingGraphId: string | null;
  setEditingGraphId: React.Dispatch<React.SetStateAction<string | null>>;
  onActivitiesChange: (activities: import("../../../../activity/ActivityMargin").BlockActivity[]) => void;
  activities: import("../../../../activity/ActivityMargin").BlockActivity[];
}

export function useBlockOperations({
  blocksProp,
  activeProject,
  contentCache,
  blockElMap,
  restoreContentCache,
  mergeCachedContent,
  commitBlocks,
  settleSaveState,
  setSaveState,
  typingSaveTimer,
  emitWordCounts,
  flushCachedContent,
  focusNew,
  pushUndoAction,
  setFreshBlockId,
  setUndoAction,
  tabs,
  onTabRename,
  manuallyRenamed,
  onBlocksChange,
  editingGraphId,
  setEditingGraphId,
  onActivitiesChange,
  activities,
}: UseBlockOperationsOptions) {
  const [blocks, setBlocksLocal] = useState<Block[]>(blocksProp);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Wrap focusNew to also set activeBlockId (in the original monolith they were combined)
  const focusNewAndActivate = useCallback((id: string, retries?: number) => {
    setActiveBlockId(id);
    focusNew(id, retries);
  }, [focusNew]);

  // Sync blocks only when switching tabs (activeProject changes)
  const prevProjectRef = useRef(activeProject);
  useEffect(() => {
    if (prevProjectRef.current !== activeProject) {
      setBlocksLocal(blocksProp);
      restoreContentCache(blocksProp);
      blockElMap.current = {};
      setActiveBlockId(null);
      setFreshBlockId(null);
      setUndoAction(null);
      setSaveState("saved");
      prevProjectRef.current = activeProject;
    }
  }, [activeProject, blocksProp, restoreContentCache, blockElMap, setFreshBlockId, setUndoAction, setSaveState]);

  useEffect(() => {
    restoreContentCache(blocksProp);
  }, [blocksProp, restoreContentCache]);

  // Propagate block changes to parent (deferred to avoid setState-during-render)
  const setBlocks = useCallback((updater: Block[] | ((prev: Block[]) => Block[])) => {
    if (typingSaveTimer.current) {
      clearTimeout(typingSaveTimer.current);
      typingSaveTimer.current = null;
    }
    setSaveState("saving");
    setBlocksLocal(prev => {
      const base = mergeCachedContent(prev);
      const next = typeof updater === "function" ? updater(base) : updater;
      if (next !== prev) commitBlocks(next);
      else if (base !== prev) commitBlocks(base);
      return next;
    });
    settleSaveState();
  }, [commitBlocks, mergeCachedContent, settleSaveState, setSaveState, typingSaveTimer]);

  useEffect(() => {
    emitWordCounts(blocks);
  }, [blocks, emitWordCounts]);

  const snapshotCurrentBlocks = useCallback(() => structuredClone(mergeCachedContent(blocks)), [blocks, mergeCachedContent]);

  const onContentChange = useCallback((id: string, html: string, text: string) => {
    contentCache.current[id] = html;
    emitWordCounts(blocks);
    setSaveState("saving");
    if (typingSaveTimer.current) clearTimeout(typingSaveTimer.current);
    typingSaveTimer.current = setTimeout(() => flushCachedContent(setBlocksLocal), 550);

    // Auto-name: mirror first h1 text as tab name, unless user manually renamed via tab UI
    if (manuallyRenamed.current.has(activeProject)) return;
    const firstH1 = blocks.find(b => b.type === "h1");
    if (!firstH1 || firstH1.id !== id) return;
    const trimmed = text.trim();
    const currentTab = tabs.find(t => t.id === activeProject);
    if (!currentTab) return;
    const newName = trimmed || "Untitled";
    if (currentTab.name !== newName) onTabRename(activeProject, newName);
  }, [activeProject, blocks, emitWordCounts, flushCachedContent, tabs, onTabRename, contentCache, setSaveState, typingSaveTimer, manuallyRenamed]);

  const onEnter = useCallback((id: string, bH: string, aH: string) => {
    contentCache.current[id] = bH;
    const nid = uid();
    contentCache.current[nid] = aH;
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      const bl = prev[idx];
      const carry = (["bullet", "numbered", "todo"] as BlockType[]).includes(bl.type) ? bl.type : "paragraph";
      const n = [...prev];
      n[idx] = { ...bl, content: bH };
      n.splice(idx + 1, 0, { id: nid, type: carry, content: aH, checked: false });
      return n;
    });
    const focusEnter = (id: string, html: string, retries = 5) => {
      const el = blockElMap.current[id];
      if (el) { el.innerHTML = html; cursorTo(el, false); return; }
      if (retries > 0) setTimeout(() => focusEnter(id, html, retries - 1), 20);
    };
    focusEnter(nid, aH);
  }, [blockElMap, contentCache, setBlocks]);

  const onBackspace = useCallback((id: string) => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      const block = prev[idx];

      // Last block -- reset to empty paragraph, don't delete
      if (prev.length <= 1) {
        if (block.type !== "paragraph") {
          contentCache.current[id] = "";
          setTimeout(() => {
            const el = blockElMap.current[id];
            if (el) { el.textContent = ""; cursorTo(el, false); }
          }, 20);
          return [{ ...block, type: "paragraph" as const, content: "", checked: false }];
        }
        return prev;
      }

      // Non-paragraph empty block -- convert to paragraph first, don't delete
      if (block.type !== "paragraph" && block.type !== "divider") {
        contentCache.current[id] = "";
        setTimeout(() => {
          const el = blockElMap.current[id];
          if (el) { el.textContent = ""; cursorTo(el, false); }
        }, 20);
        return prev.map(b => b.id === id ? { ...b, type: "paragraph" as const, content: "", checked: false } : b);
      }

      // Paragraph or divider -- delete and focus previous
      const n = prev.filter(b => b.id !== id);
      delete contentCache.current[id];
      setTimeout(() => {
        const el = blockElMap.current[n[Math.max(0, idx - 1)].id];
        if (el) cursorTo(el, true);
      }, 20);
      return n;
    });
  }, [blockElMap, contentCache, setBlocks]);

  const addBlockAfter = useCallback((afterId: string) => {
    const nid = uid();
    contentCache.current[nid] = "";
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === afterId);
      const n = [...prev];
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      return n;
    });
    focusNewAndActivate(nid);
  }, [contentCache, focusNewAndActivate, setBlocks]);

  const deleteBlock = useCallback((blockId: string) => {
    pushUndoAction("Deleted block", snapshotCurrentBlocks(), blockId);
    setBlocks(prev => {
      // Last block -- reset to empty paragraph instead of removing
      if (prev.length <= 1) {
        delete contentCache.current[blockId];
        const el = blockElMap.current[blockId];
        if (el) { el.textContent = ""; }
        return [{ id: prev[0].id, type: "paragraph" as const, content: "", checked: false }];
      }
      const idx = prev.findIndex(b => b.id === blockId);
      const n = prev.filter(b => b.id !== blockId);
      delete contentCache.current[blockId];
      // Focus the previous block (or next if deleting first)
      const focusIdx = Math.max(0, idx - 1);
      setTimeout(() => {
        const el = blockElMap.current[n[focusIdx]?.id];
        if (el) cursorTo(el, true);
      }, 20);
      return n;
    });
    // Clear editing states if the deleted block was being edited
    if (editingGraphId === blockId) setEditingGraphId(null);
  }, [blockElMap, contentCache, editingGraphId, pushUndoAction, setBlocks, setEditingGraphId, snapshotCurrentBlocks]);

  const deleteBlocks = useCallback((ids: string[]) => {
    pushUndoAction(ids.length === 1 ? "Deleted block" : `Deleted ${ids.length} blocks`, snapshotCurrentBlocks(), ids[0]);
    setBlocks(prev => {
      const idSet = new Set(ids);
      const remaining = prev.filter(b => !idSet.has(b.id));
      ids.forEach(id => { delete contentCache.current[id]; });
      // If all blocks deleted, keep one empty paragraph
      if (remaining.length === 0) {
        return [{ id: prev[0].id, type: "paragraph" as const, content: "", checked: false }];
      }
      return remaining;
    });
    if (editingGraphId && ids.includes(editingGraphId)) setEditingGraphId(null);
  }, [contentCache, editingGraphId, pushUndoAction, setBlocks, setEditingGraphId, snapshotCurrentBlocks]);

  const duplicateBlockById = useCallback((sourceId: string) => {
    const source = blocks.find(block => block.id === sourceId);
    if (!source) return false;
    pushUndoAction("Duplicated block", snapshotCurrentBlocks(), sourceId);
    const cloned = structuredClone(source) as Block;
    cloned.id = uid();
    setBlocks(prev => {
      const idx = prev.findIndex(block => block.id === sourceId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx + 1, 0, cloned);
      return next;
    });
    focusNewAndActivate(cloned.id);
    return true;
  }, [blocks, focusNewAndActivate, pushUndoAction, setBlocks, snapshotCurrentBlocks]);

  const handlePageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only fire if clicking the page container itself, not a child block
    if (e.target !== e.currentTarget) return;

    const lastBlock = blocks[blocks.length - 1];
    if (!lastBlock) return;

    // If last block is an empty paragraph, just focus it
    if (lastBlock.type === "paragraph" && !lastBlock.content) {
      const el = blockElMap.current[lastBlock.id];
      if (el) cursorTo(el, false);
      return;
    }

    // Create a new empty paragraph after the last block
    addBlockAfter(lastBlock.id);
  }, [blocks, blockElMap, addBlockAfter]);

  const handleAiGenerate = useCallback((blockId: string, generatedBlocks: Block[]) => {
    pushUndoAction(generatedBlocks.length === 0 ? "Removed AI block" : "Inserted AI content", snapshotCurrentBlocks(), blockId);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      if (idx === -1) return prev;
      const n = [...prev];
      if (generatedBlocks.length === 0) {
        // Cancelled -- revert to paragraph
        n[idx] = { ...n[idx], type: "paragraph" as BlockType, content: "" };
        focusNewAndActivate(blockId);
        return n;
      }
      // Replace the AI block with generated blocks + trailing paragraph
      n.splice(idx, 1, ...generatedBlocks);
      const trailingId = uid();
      contentCache.current[trailingId] = "";
      n.splice(idx + generatedBlocks.length, 0, { id: trailingId, type: "paragraph", content: "", checked: false });
      focusNewAndActivate(trailingId);
      return n;
    });
  }, [contentCache, focusNewAndActivate, pushUndoAction, setBlocks, snapshotCurrentBlocks]);

  const restoreUndoSnapshot = useCallback((undoAction: { label: string; snapshot: Block[]; focusId?: string }) => {
    const restored = structuredClone(undoAction.snapshot);
    if (typingSaveTimer.current) {
      clearTimeout(typingSaveTimer.current);
      typingSaveTimer.current = null;
    }
    restoreContentCache(restored);
    setBlocksLocal(restored);
    queueMicrotask(() => onBlocksChange(activeProject, restored));
    emitWordCounts(restored);
    setUndoAction(null);
    setSaveState("saving");
    settleSaveState();
    if (undoAction.focusId) setTimeout(() => focusNewAndActivate(undoAction.focusId!), 20);
  }, [activeProject, emitWordCounts, focusNewAndActivate, onBlocksChange, restoreContentCache, settleSaveState, setSaveState, setUndoAction, typingSaveTimer]);

  const getNum = useCallback((bid: string) => {
    let c = 0;
    for (const b of blocks) { if (b.type === "numbered") c++; if (b.id === bid) return c; }
    return 1;
  }, [blocks]);

  return {
    blocks,
    setBlocksLocal,
    setBlocks,
    activeBlockId,
    setActiveBlockId,
    snapshotCurrentBlocks,
    onContentChange,
    onEnter,
    onBackspace,
    addBlockAfter,
    deleteBlock,
    deleteBlocks,
    duplicateBlockById,
    handlePageClick,
    handleAiGenerate,
    restoreUndoSnapshot,
    getNum,
  };
}
