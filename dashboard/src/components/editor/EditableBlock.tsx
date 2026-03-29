"use client";

import { useRef, useEffect } from "react";
import type { Block } from "@/lib/types";

interface EditableBlockProps {
  block: Block;
  onContentChange: (id: string, html: string, text: string) => void;
  onEnter: (id: string, beforeHtml: string, afterHtml: string) => void;
  onBackspace: (id: string) => void;
  onSlash: (blockId: string, filter?: string) => void;
  onSlashClose: () => void;
  onSelect: () => void;
  registerRef: (id: string, el: HTMLDivElement) => void;
}

const PLACEHOLDERS: Record<string, string> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  code: "// code",
  quote: "Quote",
  paragraph: "Type '/' for commands, ⌘K for palette",
  bullet: "List",
  numbered: "List",
  todo: "To-do",
  callout: "Type here…",
};

const STYLES: Record<string, React.CSSProperties> = {
  h1: { fontSize: "1.75em", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.02em", marginTop: 28, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  h2: { fontSize: "1.35em", fontWeight: 600, lineHeight: 1.3, marginTop: 20, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  h3: { fontSize: "1.12em", fontWeight: 600, lineHeight: 1.35, marginTop: 14, fontFamily: "var(--font-heading)", color: "var(--ink-900)" },
  paragraph: { lineHeight: 1.65, color: "var(--ink-700)" },
  bullet: { lineHeight: 1.65, color: "var(--ink-700)" },
  numbered: { lineHeight: 1.65, color: "var(--ink-700)" },
  todo: { lineHeight: 1.65, color: "var(--ink-700)" },
  quote: { lineHeight: 1.65, color: "var(--ink-500)" },
  callout: { lineHeight: 1.65, color: "var(--ink-700)" },
  code: { fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: "0.84em", background: "var(--warm-100)", border: "1px solid var(--warm-200)", borderRadius: 5, padding: "14px 16px", lineHeight: 1.65, whiteSpace: "pre-wrap", tabSize: 2, color: "var(--ink-700)" },
};

export default function EditableBlock({ block, onContentChange, onEnter, onBackspace, onSlash, onSlashClose, onSelect, registerRef }: EditableBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) registerRef(block.id, ref.current);
  }, [block.id, registerRef]);

  useEffect(() => {
    if (ref.current && block.content && ref.current.innerHTML !== block.content) {
      ref.current.innerHTML = block.content;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When block type changes (e.g. backspace converts h1 → paragraph), sync the DOM
  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("data-placeholder", PLACEHOLDERS[block.type] || "Type '/' for commands");
    }
  }, [block.type]);

  const handleInput = () => {
    if (!ref.current) return;
    const text = ref.current.textContent || "";
    const html = ref.current.innerHTML;
    onContentChange(block.id, html, text);
    if (text === "/") onSlash(block.id);
    else if (text.startsWith("/") && text.length <= 20) onSlash(block.id, text.slice(1));
    else onSlashClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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

      ref.current.innerHTML = bD.innerHTML;
      onEnter(block.id, bD.innerHTML, aD.innerHTML);
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
        // If deleting back to just "/" or empty after "/", let handleInput close the menu naturally
      }
    }

    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "  ");
    }
  };

  return (
    <div
      ref={ref}
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
      spellCheck
    />
  );
}
