"use client";

import { useState } from "react";
import type { RenderBlock } from "../types";
import styles from "./FileBlock.module.css";

interface FileItem {
  name: string;
  ext: string;
  color: string;
  size: string;
  date: string;
}

const FILES: FileItem[] = [
  { name: "Brand Guidelines v2", ext: "PDF", color: "#c07a6a", size: "4.2 MB", date: "Mar 28" },
  { name: "Color Palette", ext: "FIG", color: "#8b8bba", size: "1.8 MB", date: "Mar 27" },
  { name: "Logo_Final", ext: "SVG", color: "#6b9a6b", size: "240 KB", date: "Mar 25" },
  { name: "Proposal_Meridian", ext: "DOC", color: "#b07d4f", size: "890 KB", date: "Mar 22" },
  { name: "Invoice_047", ext: "PDF", color: "#c07a6a", size: "120 KB", date: "Mar 20" },
  { name: "Moodboard_v3", ext: "PNG", color: "#8b8bba", size: "6.1 MB", date: "Mar 18" },
];

export default function FileBlock({ block: _block }: { block: RenderBlock }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Files</span>
        <span className={styles.count}>{FILES.length}</span>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${view === "grid" ? styles.toggleBtnActive : ""}`}
            onClick={() => setView("grid")}
          >
            {"\u25A6"}
          </button>
          <button
            className={`${styles.toggleBtn} ${view === "list" ? styles.toggleBtnActive : ""}`}
            onClick={() => setView("list")}
          >
            {"\u2630"}
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className={styles.grid}>
          {FILES.map((f, i) => (
            <div key={i} className={styles.gridCard}>
              <div className={styles.gridThumb} style={{ background: f.color + "08" }}>
                <span className={styles.gridBadge} style={{ background: f.color }}>
                  {f.ext}
                </span>
              </div>
              <div className={styles.gridInfo}>
                <div className={styles.gridName}>{f.name}</div>
                <div className={styles.gridMeta}>{f.size} &middot; {f.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {FILES.map((f, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.listIcon} style={{ background: f.color }}>
                {f.ext}
              </div>
              <div className={styles.listInfo}>
                <div className={styles.listName}>{f.name}</div>
                <div className={styles.listMeta}>{f.size} &middot; {f.date}</div>
              </div>
              <button className={styles.listDownload}>{"\u2193"}</button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.dropZone}>
        Drop files here or click to upload
      </div>
    </div>
  );
}
