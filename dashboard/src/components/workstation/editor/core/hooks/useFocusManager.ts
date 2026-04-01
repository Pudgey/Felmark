"use client";

import { useState, useRef, useCallback } from "react";
import { cursorTo } from "@/lib/utils";

export function useFocusManager() {
  const blockElMap = useRef<Record<string, HTMLDivElement>>({});
  const editorRef = useRef<HTMLDivElement>(null);
  const [freshBlockId, setFreshBlockId] = useState<string | null>(null);
  const freshBlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerRef = useCallback((id: string, el: HTMLDivElement) => {
    blockElMap.current[id] = el;
  }, []);

  const getBlockScrollTarget = useCallback((id: string) => {
    const selector = `[data-block-id="${id}"]`;
    return editorRef.current?.querySelector<HTMLElement>(selector) || blockElMap.current[id] || null;
  }, []);

  const scrollToBlock = useCallback((id: string, block: ScrollLogicalPosition = "start") => {
    const el = getBlockScrollTarget(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block });
  }, [getBlockScrollTarget]);

  const getSelectedBlockId = useCallback(() => {
    const sel = window.getSelection();
    if (!sel?.anchorNode) return null;
    for (const [id, el] of Object.entries(blockElMap.current)) {
      if (el && el.contains(sel.anchorNode)) return id;
    }
    return null;
  }, []);

  const focusNew = useCallback((id: string, retries = 5) => {
    setFreshBlockId(id);
    if (freshBlockTimer.current) clearTimeout(freshBlockTimer.current);
    freshBlockTimer.current = setTimeout(() => setFreshBlockId(current => current === id ? null : current), 1400);
    const el = blockElMap.current[id];
    if (el) { cursorTo(el, false); return; }
    if (retries > 0) setTimeout(() => focusNew(id, retries - 1), 20);
  }, []);

  return {
    blockElMap,
    editorRef,
    freshBlockId,
    setFreshBlockId,
    freshBlockTimer,
    registerRef,
    getBlockScrollTarget,
    scrollToBlock,
    getSelectedBlockId,
    focusNew,
  };
}
