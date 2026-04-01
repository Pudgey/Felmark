"use client";

import { useState } from "react";
import type { ColumnsBlockData, ColumnLayout, ColumnData } from "@/lib/types";
import styles from "./ColumnsBlock.module.css";

interface ColumnsBlockProps {
  data: ColumnsBlockData;
  onUpdate: (data: ColumnsBlockData) => void;
}

const LAYOUTS: { id: ColumnLayout; label: string; icon: string; cols: number }[] = [
  { id: "2-col", label: "2 Columns", icon: "▐▌", cols: 2 },
  { id: "3-col", label: "3 Columns", icon: "▐▌▐", cols: 3 },
  { id: "sidebar", label: "Sidebar", icon: "▐│", cols: 2 },
];

export function getDefaultColumnsData(layout: ColumnLayout = "2-col"): ColumnsBlockData {
  const cols = layout === "3-col" ? 3 : 2;
  return {
    layout,
    columns: Array.from({ length: cols }, (_, i) => ({
      label: layout === "sidebar" && i === 1 ? "Sidebar" : `Column ${i + 1}`,
      content: "",
    })),
  };
}

export default function ColumnsBlock({ data, onUpdate }: ColumnsBlockProps) {
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);

  const gridTemplate = data.layout === "3-col"
    ? "1fr 1fr 1fr"
    : data.layout === "sidebar"
      ? "2fr 1fr"
      : "1fr 1fr";

  const updateColumn = (idx: number, field: keyof ColumnData, value: string) => {
    const updated = data.columns.map((col, i) => i === idx ? { ...col, [field]: value } : col);
    onUpdate({ ...data, columns: updated });
  };

  const switchLayout = (layout: ColumnLayout) => {
    const targetCols = layout === "3-col" ? 3 : 2;
    let columns = [...data.columns];

    if (targetCols > columns.length) {
      while (columns.length < targetCols) {
        columns.push({ label: `Column ${columns.length + 1}`, content: "" });
      }
    } else if (targetCols < columns.length) {
      // Merge extra column content into the last kept column
      const extra = columns.slice(targetCols).map(c => c.content).filter(Boolean).join("\n\n");
      columns = columns.slice(0, targetCols);
      if (extra && columns.length > 0) {
        columns[columns.length - 1] = { ...columns[columns.length - 1], content: columns[columns.length - 1].content + (columns[columns.length - 1].content ? "\n\n" : "") + extra };
      }
    }

    if (layout === "sidebar" && columns.length >= 2) {
      columns[1] = { ...columns[1], label: columns[1].label === `Column 2` ? "Sidebar" : columns[1].label };
    }

    onUpdate({ layout, columns });
    setShowLayoutPicker(false);
  };

  return (
    <div className={styles.block}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.layoutPicker}>
          <button className={styles.layoutBtn} onClick={() => setShowLayoutPicker(p => !p)}>
            <span className={styles.layoutIcon}>{LAYOUTS.find(l => l.id === data.layout)?.icon}</span>
            <span>{LAYOUTS.find(l => l.id === data.layout)?.label}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 4l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
          </button>
          {showLayoutPicker && (
            <div className={styles.layoutDrop}>
              {LAYOUTS.map(l => (
                <button key={l.id} className={`${styles.layoutDropItem} ${data.layout === l.id ? styles.layoutDropOn : ""}`} onClick={() => switchLayout(l.id)}>
                  <span className={styles.layoutDropIcon}>{l.icon}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Columns grid */}
      <div className={styles.grid} style={{ gridTemplateColumns: gridTemplate }}>
        {data.columns.map((col, i) => (
          <div key={i} className={styles.col}>
            <input
              className={styles.colLabel}
              value={col.label}
              onChange={e => updateColumn(i, "label", e.target.value)}
              placeholder="Label"
            />
            <div
              className={styles.colContent}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateColumn(i, "content", (e.target as HTMLElement).innerText)}
              data-placeholder="Type here..."
              dangerouslySetInnerHTML={{ __html: col.content.replace(/\n/g, "<br>") || "" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
