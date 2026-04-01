"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { BLOCK_TYPES, BLOCK_CATEGORIES } from "@/lib/constants";
import type { BlockType } from "@/lib/types";
import styles from "./SlashMenu.module.css";

interface SlashMenuProps {
  top: number;
  left: number;
  filter: string;
  selectedIndex: number;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  allowedTypes?: BlockType[];
}

type MatchResult = {
  score: number;
  order: number;
  type: typeof BLOCK_TYPES[number];
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreMatch(query: string, value: string, base: number) {
  const normalized = value.toLowerCase();
  if (!normalized) return -1;
  if (normalized === query) return base + 400;
  if (normalized.startsWith(query)) return base + 300;
  const tokens = tokenize(value);
  if (tokens.includes(query)) return base + 250;
  if (tokens.some(token => token.startsWith(query))) return base + 200;
  if (normalized.includes(query)) return base + 100;
  return -1;
}

function getFilteredBlocks(filter: string, blocks: typeof BLOCK_TYPES) {
  const query = filter.trim().toLowerCase();
  if (!query) return blocks;

  const matches: MatchResult[] = blocks.map((type, order) => {
    const bestScore = Math.max(
      scoreMatch(query, type.label, 1000),
      scoreMatch(query, type.type, 900),
      scoreMatch(query, type.shortcut?.replace(/^\//, "") || "", 850),
      scoreMatch(query, type.section, 600),
      scoreMatch(query, type.desc, 300)
    );
    return { score: bestScore, order, type };
  }).filter(match => match.score >= 0);

  return matches
    .sort((a, b) => (b.score - a.score) || (a.order - b.order))
    .map(match => match.type);
}

function highlightMatch(value: string, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return value;
  const index = value.toLowerCase().indexOf(needle);
  if (index === -1) return value;
  const end = index + needle.length;
  return (
    <>
      {value.slice(0, index)}
      <mark className={styles.match}>{value.slice(index, end)}</mark>
      {value.slice(end)}
    </>
  );
}

export default function SlashMenu({ top, left, filter, selectedIndex, onSelect, onClose, onIndexChange, allowedTypes }: SlashMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const effectiveCategory = filter ? null : activeCategory;
  const availableBlocks = useMemo(() => {
    if (!allowedTypes || allowedTypes.length === 0) return BLOCK_TYPES;
    const allowed = new Set(allowedTypes);
    return BLOCK_TYPES.filter(block => allowed.has(block.type));
  }, [allowedTypes]);
  const visibleCategories = useMemo(
    () => BLOCK_CATEGORIES.filter(category => availableBlocks.some(block => block.section === category.id)),
    [availableBlocks]
  );

  // Build filtered list
  const filtered = filter
    ? getFilteredBlocks(filter, availableBlocks)
    : effectiveCategory
      ? availableBlocks.filter(t => t.section === effectiveCategory)
      : availableBlocks;

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onIndexChange(Math.min(selectedIndex + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onIndexChange(Math.max(selectedIndex - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) onSelect(filtered[selectedIndex].type);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [selectedIndex, filtered, onSelect, onClose, onIndexChange]);

  // Outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.menu}`)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Scroll selected into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`.${styles.itemActive}`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (filtered.length === 0) return null;

  // Group by section for "All" view (no filter, no active category)
  const showGrouped = !filter && !effectiveCategory;
  const sections = visibleCategories.map(c => c.id);

  return createPortal(
    <div className={styles.menu} style={{ top, left }}>
      {/* Header with search info */}
      <div className={styles.header}>
        <div className={styles.searchRow}>
          <span className={styles.prompt}>/</span>
          <span className={styles.searchText}>{filter || "blocks"}</span>
          <span className={styles.count}>{filtered.length}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className={styles.categories}>
        <button
          className={`${styles.cat} ${!effectiveCategory && !filter ? styles.catOn : ""}`}
          onClick={() => { setActiveCategory(null); onIndexChange(0); }}
        >All</button>
        {visibleCategories.map(c => (
          <button
            key={c.id}
            className={`${styles.cat} ${effectiveCategory === c.id ? styles.catOn : ""}`}
            onClick={() => { setActiveCategory(activeCategory === c.id ? null : c.id); onIndexChange(0); }}
          >
            <span className={styles.catIcon}>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Block list */}
      <div className={styles.list} ref={listRef}>
        {showGrouped ? (
          // Grouped view — show 3 per category
          sections.map(section => {
            const items = availableBlocks.filter(t => t.section === section);
            if (!items.length) return null;
            const cat = visibleCategories.find(c => c.id === section);
            return (
              <div key={section}>
                <div className={styles.group}>{cat?.icon} {cat?.label}</div>
                {items.slice(0, 3).map(t => {
                  const gi = filtered.indexOf(t);
                  return (
                    <div
                      key={t.type}
                      className={`${styles.item} ${gi === selectedIndex ? styles.itemActive : ""}`}
                      onClick={() => onSelect(t.type)}
                      onMouseEnter={() => onIndexChange(gi)}
                    >
                      <div className={styles.icon}>{t.icon}</div>
                      <div className={styles.info}>
                        <div className={styles.label}>{t.label}</div>
                        <div className={styles.desc}>{t.desc}</div>
                      </div>
                      {t.shortcut && <span className={styles.shortcut}>{t.shortcut}</span>}
                    </div>
                  );
                })}
                {items.length > 3 && (
                  <button className={styles.moreBtn} onClick={() => { setActiveCategory(section); onIndexChange(0); }}>
                    +{items.length - 3} more in {cat?.label}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          // Flat filtered or category view
          filtered.map((t, i) => (
            <div
              key={t.type}
              className={`${styles.item} ${i === selectedIndex ? styles.itemActive : ""}`}
              onClick={() => onSelect(t.type)}
              onMouseEnter={() => onIndexChange(i)}
            >
              <div className={styles.icon}>{t.icon}</div>
              <div className={styles.info}>
                <div className={styles.label}>{highlightMatch(t.label, filter)}</div>
                <div className={styles.desc}>{highlightMatch(t.desc, filter)}</div>
              </div>
              {t.shortcut && <span className={styles.shortcut}>{t.shortcut}</span>}
              {filter && <span className={styles.itemCat}>{t.section}</span>}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span>{availableBlocks.length} blocks · {visibleCategories.length} categories</span>
        <div className={styles.hints}>
          <span><span className={styles.kbd}>↑↓</span> navigate</span>
          <span><span className={styles.kbd}>⏎</span> insert</span>
          <span><span className={styles.kbd}>⎋</span> close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
