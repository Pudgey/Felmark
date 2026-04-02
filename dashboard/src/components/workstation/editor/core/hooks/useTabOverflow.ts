"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { Tab } from "@/lib/types";

interface UseTabOverflowOptions {
  tabs: Tab[];
  manuallyRenamed: React.MutableRefObject<Set<string>>;
  overflowPillClass: string;
  overflowDropdownClass: string;
}

export function useTabOverflow({ tabs, manuallyRenamed, overflowPillClass, overflowDropdownClass }: UseTabOverflowOptions) {
  const tabZoneRef = useRef<HTMLDivElement>(null);
  const [zoneWidth, setZoneWidth] = useState(0);
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

  const overflowCount = useMemo(() => {
    if (zoneWidth <= 0 || tabs.length === 0) return 0;
    const newTabWidth = 36;
    let usedWidth = newTabWidth;
    let fittingCount = 0;

    for (const tab of tabs) {
      const minW = tab.active ? 140 : 100;
      if (usedWidth + minW <= zoneWidth) {
        usedWidth += minW;
        fittingCount++;
      } else {
        break;
      }
    }

    // If not all fit, account for overflow pill width
    if (fittingCount < tabs.length) {
      const pillWidth = 50;
      usedWidth = newTabWidth + pillWidth;
      fittingCount = 0;
      for (const tab of tabs) {
        const minW = tab.active ? 140 : 100;
        if (usedWidth + minW <= zoneWidth) {
          usedWidth += minW;
          fittingCount++;
        } else {
          break;
        }
      }
    }

    return Math.max(0, tabs.length - fittingCount);
  }, [tabs, zoneWidth]);

  useEffect(() => {
    const zone = tabZoneRef.current;
    if (!zone) return;
    const syncWidth = () => setZoneWidth(zone.clientWidth);
    const frameId = requestAnimationFrame(syncWidth);
    const ro = new ResizeObserver(syncWidth);
    ro.observe(zone);
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, []);

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
  const visibleTabs = useMemo(() => {
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
