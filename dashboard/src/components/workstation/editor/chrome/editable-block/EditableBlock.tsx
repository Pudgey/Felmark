"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { Block } from "@/lib/types";

interface EditableBlockProps {
  block: Block;
  onContentChange: (id: string, html: string, text: string) => void;
  onEnter: (id: string, beforeHtml: string, afterHtml: string) => void;
  onBackspace: (id: string) => void;
  onSlash: (blockId: string, filter?: string) => void;
  onSlashClose: () => void;
  onSelect: () => void;
  onFocusBlock?: (id: string) => void;
  registerRef: (id: string, el: HTMLDivElement) => void;
  onCat?: () => void;
}

const PLACEHOLDERS: Record<string, string> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  code: "// code",
  quote: "Quote",
  paragraph: "Type '/' for commands, @date for dates",
  bullet: "List",
  numbered: "List",
  todo: "To-do",
  callout: "Type here\u2026",
};

const STYLES: Record<string, React.CSSProperties> = {
  h1: { fontSize: "1.75em", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em", marginTop: 28, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  h2: { fontSize: "1.35em", fontWeight: 600, lineHeight: 1.3, marginTop: 20, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  h3: { fontSize: "1.12em", fontWeight: 600, lineHeight: 1.35, marginTop: 14, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  paragraph: { lineHeight: 1.65, color: "var(--ink-700)" },
  bullet: { lineHeight: 1.65, color: "var(--ink-700)" },
  numbered: { lineHeight: 1.65, color: "var(--ink-700)" },
  todo: { lineHeight: 1.3, color: "var(--ink-700)" },
  quote: { lineHeight: 1.65, color: "var(--ink-500)" },
  callout: { lineHeight: 1.65, color: "var(--ink-700)" },
  code: { fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: "0.84em", background: "var(--warm-100)", border: "1px solid var(--warm-200)", borderRadius: 5, padding: "14px 16px", lineHeight: 1.65, whiteSpace: "pre-wrap", tabSize: 2, color: "var(--ink-700)" },
};

// Date chip CSS injected once
const DATE_CHIP_STYLE = `
  .felmark-date-chip {
    display: inline-flex; align-items: center; gap: 3px;
    font-family: var(--font-mono), 'JetBrains Mono', monospace;
    font-size: 0.85em; font-weight: 500;
    color: var(--ember); background: var(--ember-bg);
    padding: 1px 7px; border-radius: 4px;
    border: 1px solid rgba(176,125,79,0.12);
    cursor: pointer; white-space: nowrap;
    transition: background 0.08s;
  }
  .felmark-date-chip:hover {
    background: rgba(176,125,79,0.12);
  }
  .felmark-date-chip::before {
    content: "\\25C7"; font-size: 0.8em;
  }
`;

function normalizeEditableHtml(html: string) {
  if (!html) return "";
  const collapsed = html
    .replace(/&nbsp;/gi, "")
    .replace(/[\u200B\uFEFF\xA0]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

  return /^(?:(?:<br\b[^>]*\/?>)|(?:<div><br\b[^>]*\/?><\/div>)|(?:<p><br\b[^>]*\/?><\/p>))*$/.test(collapsed)
    ? ""
    : html;
}

export default function EditableBlock({ block, onContentChange, onEnter, onBackspace, onSlash, onSlashClose, onSelect, onFocusBlock, registerRef, onCat }: EditableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [datePicker, setDatePicker] = useState<{ top: number; left: number } | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const pendingChipRef = useRef<HTMLSpanElement | null>(null);

  // Inject date chip styles once
  useEffect(() => {
    if (document.getElementById("felmark-date-chip-style")) return;
    const style = document.createElement("style");
    style.id = "felmark-date-chip-style";
    style.textContent = DATE_CHIP_STYLE;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (ref.current) registerRef(block.id, ref.current);
  }, [block.id, registerRef]);

  const syncEmpty = useCallback(() => {
    if (!ref.current) return;
    const text = (ref.current.textContent || "").replace(/[\u200B\uFEFF\xA0]/g, "").trim();
    ref.current.classList.toggle("is-empty", text.length === 0);
  }, []);

  useEffect(() => {
    if (ref.current) {
      const normalizedContent = block.content || "";
      if (ref.current.innerHTML !== normalizedContent) ref.current.innerHTML = normalizedContent;
    }
    syncEmpty();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("data-placeholder", PLACEHOLDERS[block.type] || "Type '/' for commands");
    }
    syncEmpty();
  }, [block.type, syncEmpty]);

  // Handle clicks on existing date chips to edit them
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("felmark-date-chip")) {
        e.preventDefault();
        e.stopPropagation();
        pendingChipRef.current = target as HTMLSpanElement;
        const rect = target.getBoundingClientRect();
        setDatePicker({ top: rect.bottom + 4, left: rect.left });
        setTimeout(() => dateInputRef.current?.showPicker?.(), 50);
      }
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, []);

  const insertDateChip = useCallback((isoDate: string) => {
    if (!ref.current) return;
    const d = new Date(isoDate + "T00:00:00");
    const display = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    if (pendingChipRef.current) {
      // Editing an existing chip
      pendingChipRef.current.setAttribute("data-felmark-date", isoDate);
      pendingChipRef.current.textContent = display;
      pendingChipRef.current = null;
    } else {
      // Inserting a new chip — replace @date text
      const chip = `<span class="felmark-date-chip" data-felmark-date="${isoDate}" contenteditable="false">${display}</span>&nbsp;`;
      document.execCommand("insertHTML", false, chip);
    }

    const html = ref.current.innerHTML;
    const text = ref.current.textContent || "";
    onContentChange(block.id, html, text);
    setDatePicker(null);
  }, [block.id, onContentChange]);

  const handleInput = () => {
    if (!ref.current) return;
    const rawText = ref.current.textContent || "";
    const text = rawText.replace(/[\u200B\uFEFF\xA0]/g, "").trim();
    const html = normalizeEditableHtml(ref.current.innerHTML);
    onContentChange(block.id, html, rawText);
    syncEmpty();

    // Visual feedback: color text ember when typing a command
    ref.current.classList.toggle("is-command", text.startsWith("/") || text.startsWith("$"));

    // Detect @date trigger
    if (text.includes("@date")) {
      // Find and select the @date text to replace it
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      // Walk text nodes to find @date
      const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const idx = node.textContent?.indexOf("@date") ?? -1;
        if (idx >= 0) {
          // Select @date text
          const range = document.createRange();
          range.setStart(node, idx);
          range.setEnd(node, idx + 5);
          sel.removeAllRanges();
          sel.addRange(range);

          // Show date picker at cursor position
          const rect = range.getBoundingClientRect();
          pendingChipRef.current = null; // new chip, not editing
          setDatePicker({ top: rect.bottom + 4, left: rect.left });
          setTimeout(() => dateInputRef.current?.showPicker?.(), 50);
          return;
        }
      }
    }

    // Easter egg: $cat
    if (text.toLowerCase() === "$cat" && onCat) {
      if (ref.current) ref.current.textContent = "";
      onContentChange(block.id, "", "");
      onCat();
      return;
    }

    if (text === "/") onSlash(block.id);
    else if (text.startsWith("/") && text.length <= 20) onSlash(block.id, text.slice(1));
    else onSlashClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && datePicker) {
      setDatePicker(null);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && block.type !== "code") {
      e.preventDefault();
      if (!ref.current) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      const bR = document.createRange();
      bR.setStart(ref.current, 0);
      bR.setEnd(range.startContainer, range.startOffset);
      const bD = document.createElement("div");
      bD.appendChild(bR.cloneContents());

      const aR = document.createRange();
      aR.setStart(range.endContainer, range.endOffset);
      aR.setEnd(ref.current, ref.current.childNodes.length);
      const aD = document.createElement("div");
      aD.appendChild(aR.cloneContents());

      const beforeHtml = normalizeEditableHtml(bD.innerHTML);
      const afterHtml = normalizeEditableHtml(aD.innerHTML);
      ref.current.innerHTML = beforeHtml;
      onEnter(block.id, beforeHtml, afterHtml);
    }

    if (e.key === "Backspace" && ref.current) {
      const sel = window.getSelection();
      if (sel && sel.isCollapsed) {
        const range = sel.getRangeAt(0);
        const tR = document.createRange();
        tR.setStart(ref.current, 0);
        tR.setEnd(range.startContainer, range.startOffset);
        const beforeCursor = tR.toString().length;
        const totalLen = ref.current.textContent?.length || 0;
        if (beforeCursor === 0 && totalLen === 0) {
          e.preventDefault();
          onBackspace(block.id);
        }
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "  ");
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="is-empty"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={PLACEHOLDERS[block.type] || "Type '/' for commands"}
        style={{
          outline: "none",
          width: "100%",
          ...STYLES[block.type],
          ...(block.type === "todo" && block.checked ? { textDecoration: "line-through", opacity: 0.35 } : {}),
        }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={onSelect}
        onFocus={() => { syncEmpty(); onFocusBlock?.(block.id); }}
        spellCheck
      />
      {/* Floating date picker for @date */}
      {datePicker && (
        <div style={{ position: "fixed", top: datePicker.top, left: datePicker.left, zIndex: 100 }}>
          <input
            ref={dateInputRef}
            type="date"
            autoFocus
            onChange={e => {
              if (e.target.value) insertDateChip(e.target.value);
            }}
            onBlur={() => {
              // Delay to allow onChange to fire first
              setTimeout(() => setDatePicker(null), 150);
            }}
            style={{
              padding: "6px 10px",
              border: "1px solid var(--ember)",
              borderRadius: 6,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 13,
              color: "var(--ink-800)",
              background: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              outline: "none",
            }}
          />
        </div>
      )}
    </>
  );
}
