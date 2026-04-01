"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { Tab } from "@/lib/types";

interface UseTabOverflowOptions {
  tabs: Tab[];
  manuallyRenamed: React.MutableRefObject<Set<string>>;
  overflowPillClass: string;
  overflowDropdownClass: string;
}

export function useTabOverflow({ tabs, manuallyRenamed, overflowPillClass, overflowDropdownClass }: UseTabOverflowOptions) {
  const tabZoneRef = useRef<HTMLDivElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const knownTabs = useRef<Set<string>>(new Set());

  // Track tabs opened with a real name (sidebar) -- they skip auto-naming
  useEffect(() => {
    for (const tab of tabs) {
      if (!knownTabs.current.has(tab.id)) {
        knownTabs.current.add(tab.id);
        if (tab.name !== "Untitled") manuallyRenamed.current.add(tab.id);
      }
    }
  }, [tabs, manuallyRenamed]);

  // Measure which tabs fit in the zone
  const measureOverflow = useCallback(() => {
    const zone = tabZoneRef.current;
    if (!zone) return;
    const children = Array.from(zone.querySelectorAll('[data-tab]')) as HTMLElement[];
    if (children.length === 0) { setOverflowCount(0); return; }

    const zoneWidth = zone.clientWidth;
    const newTabWidth = 36;
    let usedWidth = newTabWidth;
    let fittingCount = 0;

    for (const child of children) {
      const minW = child.dataset.active === "true" ? 140 : 100;
      if (usedWidth + minW <= zoneWidth) {
        usedWidth += minW;
        fittingCount++;
      } else {
        break;
      }
    }

    // If not all fit, account for overflow pill width
    if (fittingCount < children.length) {
      const pillWidth = 50;
      usedWidth = newTabWidth + pillWidth;
      fittingCount = 0;
      for (const child of children) {
        const minW = child.dataset.active === "true" ? 140 : 100;
        if (usedWidth + minW <= zoneWidth) {
          usedWidth += minW;
          fittingCount++;
        } else {
          break;
        }
      }
    }

    const hidden = Math.max(0, children.length - fittingCount);
    setOverflowCount(hidden);
  }, []);

  useEffect(() => {
    measureOverflow();
  }, [tabs, measureOverflow]);

  useEffect(() => {
    const zone = tabZoneRef.current;
    if (!zone) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(zone);
    return () => ro.disconnect();
  }, [measureOverflow]);

  // Close overflow dropdown on outside click
  useEffect(() => {
    if (!overflowOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`.${overflowPillClass}`) && !target.closest(`.${overflowDropdownClass}`)) {
        setOverflowOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [overflowOpen, overflowPillClass, overflowDropdownClass]);

  // Compute visible vs. overflowed tabs
  const computeVisibleTabs = useCallback(() => {
    if (overflowCount === 0) return { visible: tabs, overflow: [] as Tab[] };
    const visibleCount = tabs.length - overflowCount;

    const activeIdx = tabs.findIndex(t => t.active);
    const ordered = [...tabs];
    if (activeIdx >= visibleCount) {
      const [active] = ordered.splice(activeIdx, 1);
      ordered.splice(visibleCount - 1, 0, active);
    }
    return {
      visible: ordered.slice(0, visibleCount),
      overflow: ordered.slice(visibleCount),
    };
  }, [overflowCount, tabs]);

  const visibleTabs = computeVisibleTabs();

  return {
    tabZoneRef,
    overflowCount,
    overflowOpen,
    setOverflowOpen,
    editingTabId,
    setEditingTabId,
    editingTabName,
    setEditingTabName,
    visibleTabs,
  };
}
