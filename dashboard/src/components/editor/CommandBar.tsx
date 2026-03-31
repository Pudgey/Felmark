"use client";

import { useState, useRef } from "react";
import styles from "./CommandBar.module.css";

interface CommandBarProps {
  charCount: number;
}

export default function CommandBar({ charCount }: CommandBarProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.bar}>
      <span className={styles.prompt}>❯</span>
      <input
        ref={inputRef}
        className={styles.input}
        placeholder="Type a command or search..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape") { setValue(""); inputRef.current?.blur(); }
        }}
      />
      <div className={styles.hints}>
        <span className={styles.hint}><kbd className={styles.kbd}>⌘K</kbd> palette</span>
        <span className={styles.hint}><kbd className={styles.kbd}>/</kbd> blocks</span>
        <span className={styles.hint}>
          <span className={styles.connectedDot} /> {charCount}c
        </span>
        <span className={styles.forge}>⚒ forge</span>
      </div>
    </div>
  );
}
