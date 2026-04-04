"use client";

import { useState, useCallback } from "react";
import type { Block, BlockType, GraphType, MoneyBlockType, DrawingType } from "@/lib/types";
import { uid, cursorTo } from "@/lib/utils";
import { getDefaultGraphData } from "../../blocks/graphs/GraphBlock";
import { getDefaultMoneyData } from "../../blocks/money/MoneyBlock";
import { getDefaultDeadlineData } from "../../blocks/deadline/DeadlineBlock";
import { getDefaultAudioData } from "../../blocks/audio/AudioBlock";
import { getDefaultCanvasData } from "../../blocks/canvas/CanvasBlock";
import { getDefaultDrawingData } from "../../blocks/drawing/DrawingBlock";
import { CONTENT_DEFAULTS } from "../components/block-registry/blockDefaults";

interface UseSlashMenuOptions {
  blockElMap: React.MutableRefObject<Record<string, HTMLDivElement>>;
  contentCache: React.MutableRefObject<Record<string, string>>;
  setBlocks: (updater: Block[] | ((prev: Block[]) => Block[])) => void;
  focusNew: (id: string, retries?: number) => void;
  pushUndoAction: (label: string, snapshot: Block[], focusId?: string) => void;
  snapshotCurrentBlocks: () => Block[];
}

export function useSlashMenu({
  blockElMap: blockElMapRef,
  contentCache: contentCacheRef,
  setBlocks,
  focusNew,
  pushUndoAction,
  snapshotCurrentBlocks,
}: UseSlashMenuOptions) {
  const [slashMenu, setSlashMenu] = useState<{ blockId: string; top: number; left: number } | null>(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [slashIndex, setSlashIndex] = useState(0);
  const [graphPicker, setGraphPicker] = useState<{ blockId: string } | null>(null);
  const [moneyPicker, setMoneyPicker] = useState<{ blockId: string } | null>(null);
  const [drawingPicker, setDrawingPicker] = useState<{ blockId: string } | null>(null);
  const [editingGraphId, setEditingGraphId] = useState<string | null>(null);

  const onSlash = useCallback((blockId: string, filter?: string) => {
    const el = blockElMapRef.current[blockId];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const menuH = 440;
    const pad = 8;
    const spaceBelow = window.innerHeight - rect.bottom - pad;
    const top = spaceBelow >= menuH ? rect.bottom + 4 : Math.max(pad, rect.top - menuH - 4);
    setSlashMenu({ blockId, top, left: rect.left });
    setSlashFilter(filter || "");
    setSlashIndex(0);
  }, [blockElMapRef]);

  const selectSlashItem = useCallback((type: BlockType) => {
    if (!slashMenu) return;
    const { blockId } = slashMenu;
    const el = blockElMapRef.current[blockId];
    if (el) el.textContent = "";
    contentCacheRef.current[blockId] = "";
    const slashSnapshot = snapshotCurrentBlocks();
    const pushSlashUndo = (label: string, focusId?: string) => pushUndoAction(label, slashSnapshot, focusId ?? blockId);
    if (type === "graph") {
      setGraphPicker({ blockId });
      setSlashMenu(null);
      return;
    }
    if (type === "money") {
      setMoneyPicker({ blockId });
      setSlashMenu(null);
      return;
    }
    if (type === "drawing") {
      setDrawingPicker({ blockId });
      setSlashMenu(null);
      return;
    }
    if (type === "deadline") {
      pushSlashUndo("Inserted deadline block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "deadline" as BlockType, content: "", deadlineData: getDefaultDeadlineData() };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "ai") {
      pushSlashUndo("Inserted AI block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "ai" as BlockType, content: "" };
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "canvas") {
      pushSlashUndo("Inserted canvas block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "canvas" as BlockType, content: "", canvasData: getDefaultCanvasData() };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "audio") {
      pushSlashUndo("Inserted audio block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "audio" as BlockType, content: "", audioData: getDefaultAudioData() };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "deliverable") {
      pushSlashUndo("Inserted deliverable block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = {
          ...n[idx], type: "deliverable", content: "",
          deliverableData: {
            title: "New Deliverable", description: "Describe what needs to be delivered...",
            status: "todo", assignee: "You", assigneeAvatar: "A", assigneeColor: "#b07d4f",
            dueDate: "\u2014", files: [], comments: [], approvals: [],
            activities: [{ id: "a1", text: "Deliverable created", time: "Just now" }],
            subtasks: [],
          },
        };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    // Content blocks -- insert with default data
    if (CONTENT_DEFAULTS[type]) {
      pushSlashUndo("Changed block");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: type as import("@/lib/types").BlockType, content: "", ...CONTENT_DEFAULTS[type] };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
      setSlashMenu(null);
      return;
    }
    if (type === "divider") {
      pushSlashUndo("Inserted divider");
      setBlocks(prev => {
        const idx = prev.findIndex(b => b.id === blockId);
        const n = [...prev];
        n[idx] = { ...n[idx], type: "divider", content: "" };
        const nid = uid();
        contentCacheRef.current[nid] = "";
        n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
        focusNew(nid);
        return n;
      });
    } else {
      pushSlashUndo("Changed block");
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, type, content: "" } : b));
      setTimeout(() => { if (el) cursorTo(el, false); }, 20);
    }
    setSlashMenu(null);
  }, [blockElMapRef, contentCacheRef, focusNew, pushUndoAction, setBlocks, slashMenu, snapshotCurrentBlocks]);

  const selectGraphType = useCallback((graphType: GraphType) => {
    if (!graphPicker) return;
    const { blockId } = graphPicker;
    const graphData = getDefaultGraphData(graphType);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const n = [...prev];
      n[idx] = { ...n[idx], type: "graph" as BlockType, content: "", graphData };
      const nid = uid();
      contentCacheRef.current[nid] = "";
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      focusNew(nid);
      return n;
    });
    setGraphPicker(null);
  }, [contentCacheRef, focusNew, graphPicker, setBlocks]);

  const selectMoneyType = useCallback((moneyType: MoneyBlockType) => {
    if (!moneyPicker) return;
    const { blockId } = moneyPicker;
    const moneyData = getDefaultMoneyData(moneyType);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const n = [...prev];
      n[idx] = { ...n[idx], type: "money" as BlockType, content: "", moneyData };
      const nid = uid();
      contentCacheRef.current[nid] = "";
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      focusNew(nid);
      return n;
    });
    setMoneyPicker(null);
  }, [contentCacheRef, focusNew, moneyPicker, setBlocks]);

  const selectDrawingType = useCallback((drawingType: DrawingType) => {
    if (!drawingPicker) return;
    const { blockId } = drawingPicker;
    const drawingData = getDefaultDrawingData(drawingType);
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === blockId);
      const n = [...prev];
      n[idx] = { ...n[idx], type: "drawing" as BlockType, content: "", drawingData };
      const nid = uid();
      contentCacheRef.current[nid] = "";
      n.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
      focusNew(nid);
      return n;
    });
    setDrawingPicker(null);
  }, [contentCacheRef, focusNew, drawingPicker, setBlocks]);

  return {
    slashMenu,
    setSlashMenu,
    slashFilter,
    setSlashFilter,
    slashIndex,
    setSlashIndex,
    graphPicker,
    setGraphPicker,
    moneyPicker,
    setMoneyPicker,
    drawingPicker,
    setDrawingPicker,
    editingGraphId,
    setEditingGraphId,
    onSlash,
    selectSlashItem,
    selectGraphType,
    selectMoneyType,
    selectDrawingType,
  };
}
