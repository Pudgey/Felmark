"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useTerminalContext } from "../TerminalProvider";
import { COMMAND_REGISTRY } from "@/lib/terminal/commands";
import styles from "./TerminalInput.module.css";

interface TerminalInputProps {
  currentInput: string;
  onInputChange: (val: string) => void;
}

export default function TerminalInput({ currentInput, onInputChange }: TerminalInputProps) {
  const { executeCommand, inputHistory } = useTerminalContext();
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandNames = useMemo(() => Object.keys(COMMAND_REGISTRY), []);

  const showPalette = currentInput.startsWith("/") && currentInput.length > 1;
  const searchTerm = currentInput.slice(1).toLowerCase();

  const matchingCommands = useMemo(
    () => (showPalette ? commandNames.filter((name) => name.startsWith(searchTerm)) : []),
    [showPalette, commandNames, searchTerm],
  );

  // Clamp palette index to valid range
  const safePaletteIndex = matchingCommands.length > 0 ? Math.min(paletteIndex, matchingCommands.length - 1) : 0;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (showPalette && matchingCommands.length > 0) {
          onInputChange("/" + matchingCommands[safePaletteIndex] + " ");
          setPaletteIndex(0);
          return;
        }
        e.preventDefault();
        const val = (e.target as HTMLInputElement).value.trim();
        if (!val) return;
        executeCommand(val);
        onInputChange("");
        setHistoryIndex(-1);
        return;
      }

      if (e.key === "Tab") {
        if (showPalette && matchingCommands.length > 0) {
          e.preventDefault();
          onInputChange("/" + matchingCommands[safePaletteIndex] + " ");
          setPaletteIndex(0);
          return;
        }
      }

      if (e.key === "Escape") {
        onInputChange("");
        setHistoryIndex(-1);
        setPaletteIndex(0);
        return;
      }

      if (e.key === "ArrowUp") {
        if (showPalette && matchingCommands.length > 0) {
          e.preventDefault();
          setPaletteIndex((prev) => (prev > 0 ? prev - 1 : matchingCommands.length - 1));
          return;
        }
        e.preventDefault();
        if (inputHistory.length === 0) return;
        const nextIndex = historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        onInputChange(inputHistory[nextIndex]);
        return;
      }

      if (e.key === "ArrowDown") {
        if (showPalette && matchingCommands.length > 0) {
          e.preventDefault();
          setPaletteIndex((prev) => (prev < matchingCommands.length - 1 ? prev + 1 : 0));
          return;
        }
        e.preventDefault();
        if (historyIndex === -1) return;
        const nextIndex = historyIndex + 1;
        if (nextIndex >= inputHistory.length) {
          setHistoryIndex(-1);
          onInputChange("");
        } else {
          setHistoryIndex(nextIndex);
          onInputChange(inputHistory[nextIndex]);
        }
        return;
      }
    },
    [executeCommand, inputHistory, historyIndex, onInputChange, showPalette, matchingCommands, safePaletteIndex],
  );

  return (
    <div className={styles.inputBar}>
      {showPalette && matchingCommands.length > 0 && (
        <div className={styles.palette}>
          {matchingCommands.map((name, i) => (
            <button
              key={name}
              className={`${styles.paletteItem} ${i === safePaletteIndex ? styles.paletteActive : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onInputChange("/" + name + " ");
                setPaletteIndex(0);
                inputRef.current?.focus();
              }}
            >
              <span className={styles.paletteIcon}>{COMMAND_REGISTRY[name].icon}</span>
              <span className={styles.paletteName}>/{name}</span>
              <span className={styles.paletteDesc}>{COMMAND_REGISTRY[name].description}</span>
            </button>
          ))}
        </div>
      )}
      <div className={styles.inputRow}>
        <span className={styles.promptChar}>&gt;</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          value={currentInput}
          onChange={(e) => {
            onInputChange(e.target.value);
            setHistoryIndex(-1);
            setPaletteIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or ask a question..."
          spellCheck={false}
          autoFocus
        />
      </div>
    </div>
  );
}
