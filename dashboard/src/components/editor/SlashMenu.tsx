"use client";

import { useEffect } from "react";
import { BLOCK_TYPES } from "@/lib/constants";
import type { BlockType, BlockTypeInfo } from "@/lib/types";
import styles from "./SlashMenu.module.css";

interface SlashMenuProps {
  top: number;
  left: number;
  filter: string;
  selectedIndex: number;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function SlashMenu({ top, left, filter, selectedIndex, onSelect, onClose, onIndexChange }: SlashMenuProps) {
  const filtered = BLOCK_TYPES.filter(t => t.label.toLowerCase().includes(filter.toLowerCase()));

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${styles.menu}`)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (filtered.length === 0) return null;

  const sections = ["Basic", "Blocks"] as const;

  return (
    <div className={styles.menu} style={{ top, left }}>
      {sections.map(section => {
        const items = filtered.filter(t => t.section === section);
        if (!items.length) return null;
        return (
          <div key={section}>
            <div className={styles.section}>{section}</div>
            {items.map(t => {
              const gi = filtered.indexOf(t);
              return (
                <div
                  key={t.type}
                  className={`${styles.item} ${gi === selectedIndex ? styles.itemActive : ""}`}
                  onClick={() => onSelect(t.type)}
                >
                  <div className={styles.icon}>{t.icon}</div>
                  <div>
                    <div className={styles.label}>{t.label}</div>
                    <div className={styles.desc}>{t.desc}</div>
                  </div>
                  <span className={styles.shortcut}>{t.shortcut}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
