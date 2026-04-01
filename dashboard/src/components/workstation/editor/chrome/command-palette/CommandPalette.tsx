"use client";

import { useState, useEffect, useRef } from "react";
import { COMMANDS } from "@/lib/constants";
import { useFocusTrap } from "../../../../shared/useFocusTrap";
import styles from "./CommandPalette.module.css";

interface CommandPaletteProps {
  onClose: () => void;
  onSelectCommand?: (commandId: string) => boolean;
}

export default function CommandPalette({ onClose, onSelectCommand }: CommandPaletteProps) {
  const [filter, setFilter] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(filter.toLowerCase()));
  const sections = ["Create", "Navigate", "Actions"] as const;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (commandId: string) => {
    const handled = onSelectCommand ? onSelectCommand(commandId) : true;
    if (handled !== false) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex(i => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") {
      const command = filtered[index];
      if (!command) return;
      runCommand(command.id);
    }
    else if (e.key === "Escape") { onClose(); }
  };

  const trapRef = useFocusTrap(true);

  return (
    <div className={styles.overlay} onClick={onClose} ref={trapRef}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className={styles.search}
            placeholder="Search commands..."
            value={filter}
            onChange={e => { setFilter(e.target.value); setIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <span className={styles.esc}>esc</span>
        </div>
        <div className={styles.list}>
          {sections.map(section => {
            const items = filtered.filter(c => c.section === section);
            if (!items.length) return null;
            return (
              <div key={section}>
                <div className={styles.section}>{section}</div>
                {items.map(c => {
                  const gi = filtered.indexOf(c);
                  return (
                    <div
                      key={c.id}
                      className={`${styles.item} ${gi === index ? styles.itemActive : ""}`}
                      onClick={() => runCommand(c.id)}
                    >
                      <div className={`${styles.itemIcon} ${gi === index ? styles.itemIconActive : ""}`}>{c.icon}</div>
                      <span className={`${styles.itemLabel} ${gi === index ? styles.itemLabelActive : ""}`}>{c.label}</span>
                      <span className={styles.itemShortcut}>{c.shortcut}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
