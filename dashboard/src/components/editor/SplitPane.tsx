"use client";

import type { Block } from "@/lib/types";
import styles from "./SplitPane.module.css";

interface SplitPaneProps {
  blocks: Block[];
  projectName: string;
  clientName: string;
  onClose: () => void;
  onMakePrimary: () => void;
}

function renderBlockContent(block: Block) {
  const tagMap: Record<string, string> = {
    h1: "h1", h2: "h2", h3: "h3",
    paragraph: "p", bullet: "li", numbered: "li",
    todo: "div", quote: "blockquote", callout: "div",
    code: "pre",
  };
  const tag = tagMap[block.type] || "div";

  const classMap: Record<string, string> = {
    h1: styles.h1, h2: styles.h2, h3: styles.h3,
    paragraph: styles.para, bullet: styles.bullet, numbered: styles.numbered,
    todo: styles.todo, quote: styles.quote, callout: styles.callout,
    code: styles.code, divider: styles.divider,
  };

  if (block.type === "divider") {
    return <div key={block.id} className={styles.divider}><hr /></div>;
  }

  return (
    <div key={block.id} className={`${styles.block} ${classMap[block.type] || ""}`}>
      {block.type === "todo" && (
        <input type="checkbox" checked={block.checked} readOnly className={styles.check} />
      )}
      {block.type === "bullet" && <span className={styles.bulletDot} />}
      {block.type === "numbered" && <span className={styles.numDot} />}
      {tag === "pre" ? (
        <pre className={styles.codeInner} dangerouslySetInnerHTML={{ __html: block.content || "" }} />
      ) : (
        <span dangerouslySetInnerHTML={{ __html: block.content || "\u200B" }} />
      )}
    </div>
  );
}

export default function SplitPane({ blocks, projectName, clientName, onClose, onMakePrimary }: SplitPaneProps) {
  return (
    <div className={styles.pane}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerClient}>{clientName}</span>
          <span className={styles.headerSep}>/</span>
          <span className={styles.headerName}>{projectName}</span>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.headerBtn} onClick={onMakePrimary} title="Make primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className={styles.headerBtn} onClick={onClose} title="Close split">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.page}>
          {blocks.map(renderBlockContent)}
          {blocks.length === 0 && (
            <div className={styles.empty}>Empty document</div>
          )}
        </div>
      </div>
    </div>
  );
}
