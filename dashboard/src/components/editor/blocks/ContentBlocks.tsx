"use client";

import { useState, useRef } from "react";
import type { TableBlockData, AccordionBlockData, MathBlockData, GalleryBlockData, SwatchesBlockData, BeforeAfterBlockData, BookmarkBlockData } from "@/lib/types";
import styles from "./ContentBlocks.module.css";

// ── TABLE ──
export function TableBlock({ data, onChange }: { data: TableBlockData; onChange: (d: TableBlockData) => void }) {
  const [editCell, setEditCell] = useState<string | null>(null);
  const updateCell = (r: number, c: number, val: string) => {
    onChange({ rows: data.rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? val : cell) : row) });
  };
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr>{data.rows[0]?.map((h, ci) => <th key={ci}>{h}</th>)}</tr></thead>
        <tbody>
          {data.rows.slice(1).map((row, ri) => (
            <tr key={ri}>{row.map((cell, ci) => (
              <td key={ci} className={editCell === `${ri+1}-${ci}` ? styles.editing : ""} onClick={() => setEditCell(`${ri+1}-${ci}`)}>
                {editCell === `${ri+1}-${ci}` ? (
                  <input className={styles.tableInput} value={cell} autoFocus onChange={e => updateCell(ri+1, ci, e.target.value)} onBlur={() => setEditCell(null)} onKeyDown={e => { if (e.key === "Enter") setEditCell(null); }} />
                ) : <span className={ci >= 1 ? styles.mono : ""}>{cell}</span>}
              </td>
            ))}</tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tableFooter}><span>Click cell to edit</span><span>{data.rows.length - 1} rows × {data.rows[0]?.length || 0} cols</span></div>
    </div>
  );
}

// ── ACCORDION ──
export function AccordionBlock({ data, onChange }: { data: AccordionBlockData; onChange: (d: AccordionBlockData) => void }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className={styles.accordion}>
      {data.items.map((item, i) => (
        <div key={i} className={`${styles.accItem} ${openIdx === i ? styles.accOpen : ""}`}>
          <button className={styles.accTrigger} onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
            <span className={styles.accArrow}>{openIdx === i ? "▾" : "▸"}</span>
            <span className={styles.accTitle}>{item.title}</span>
          </button>
          {openIdx === i && <div className={styles.accContent}>{item.content}</div>}
        </div>
      ))}
    </div>
  );
}

// ── MATH ──
export function MathBlock({ data }: { data: MathBlockData }) {
  return (
    <div className={styles.math}>
      <div className={styles.mathHead}><span className={styles.mathIcon}>∑</span><span className={styles.mathLabel}>Formula</span></div>
      <div className={styles.mathFormula}>{data.formula}</div>
      {data.variables.length > 0 && (
        <div className={styles.mathVars}>
          {data.variables.map((v, i) => (
            <div key={i} className={styles.mathVar}><span className={styles.mathVarName}>{v.name}</span><span className={styles.mathVarEq}>=</span><span className={styles.mathVarVal}>{v.value}</span></div>
          ))}
        </div>
      )}
      {data.result && (
        <div className={styles.mathResult}><span className={styles.mathResultLabel}>Result</span><span className={styles.mathResultVal}>{data.result}</span></div>
      )}
    </div>
  );
}

// ── GALLERY ──
export function GalleryBlock({ data }: { data: GalleryBlockData }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const colors = ["#d5d1c8", "#e5e2db", "#b8b3a8", "#f0eee9", "#c8c3ba", "#ddd9d1"];
  return (
    <>
      <div className={styles.gallery}>
        {data.images.map((img, i) => (
          <div key={i} className={styles.galleryItem} onClick={() => setLightbox(i)} style={{ background: colors[i % colors.length] }}>
            <div className={styles.galleryPlaceholder}>{img.icon || "◇"}</div>
            <div className={styles.galleryCaption}>{img.caption}</div>
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxInner} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxImg} style={{ background: colors[lightbox % colors.length] }}>
              <span style={{ fontSize: 48, color: "var(--ink-300)" }}>{data.images[lightbox].icon}</span>
            </div>
            <div className={styles.lightboxInfo}>
              <span className={styles.lightboxCaption}>{data.images[lightbox].caption}</span>
              <span className={styles.lightboxMeta}>{data.images[lightbox].meta}</span>
            </div>
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>×</button>
            {lightbox > 0 && <button className={`${styles.lightboxNav} ${styles.left}`} onClick={() => setLightbox(lightbox - 1)}>‹</button>}
            {lightbox < data.images.length - 1 && <button className={`${styles.lightboxNav} ${styles.right}`} onClick={() => setLightbox(lightbox + 1)}>›</button>}
          </div>
        </div>
      )}
    </>
  );
}

// ── COLOR SWATCHES ──
export function SwatchesBlock({ data }: { data: SwatchesBlockData }) {
  const [selected, setSelected] = useState<number | null>(null);
  const getLuminance = (hex: string) => {
    const rgb = hex.match(/[a-f\d]{2}/gi)!.map(v => { const c = parseInt(v, 16) / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const getContrast = (h1: string, h2: string) => { const l1 = getLuminance(h1), l2 = getLuminance(h2); return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2); };
  const sel = selected !== null ? data.colors[selected] : null;

  return (
    <div className={styles.swatches}>
      <div className={styles.swatchGrid}>
        {data.colors.map((c, i) => (
          <div key={i} className={`${styles.swatch} ${selected === i ? styles.swatchOn : ""}`} onClick={() => setSelected(selected === i ? null : i)}>
            <div className={styles.swatchCircle} style={{ background: c.hex }} />
            <span className={styles.swatchName}>{c.name}</span>
            <span className={styles.swatchHex}>{c.hex}</span>
          </div>
        ))}
      </div>
      {sel && (
        <div className={styles.contrastPanel}>
          <div className={styles.contrastLabel}>Contrast against {sel.name}</div>
          {data.colors.filter((_, i) => i !== selected).map((c, i) => {
            const ratio = parseFloat(getContrast(sel.hex, c.hex));
            return (
              <div key={i} className={styles.contrastRow}>
                <span className={styles.contrastDot} style={{ background: sel.hex }} />
                <span className={styles.contrastDot} style={{ background: c.hex }} />
                <span className={styles.contrastName}>{c.name}</span>
                <span className={styles.contrastRatio}>{ratio}:1</span>
                <span className={`${styles.contrastBadge} ${ratio >= 4.5 ? styles.pass : styles.fail}`}>{ratio >= 4.5 ? "AA ✓" : "Fail"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── BEFORE/AFTER ──
export function BeforeAfterBlock({ data }: { data: BeforeAfterBlockData }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const handleMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div className={styles.ba} ref={ref}
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onMouseMove={e => { if (dragging.current) handleMove(e.clientX); }}>
      <div className={styles.baBefore}><span className={styles.baPlaceholder}>Before</span></div>
      <div className={styles.baAfter} style={{ clipPath: `inset(0 0 0 ${pos}%)` }}><span className={styles.baPlaceholder}>After</span></div>
      <div className={styles.baSlider} style={{ left: `${pos}%` }}><div className={styles.baHandle}><span>‹›</span></div></div>
      <span className={`${styles.baLabel} ${styles.baLabelLeft}`}>{data.beforeLabel}</span>
      <span className={`${styles.baLabel} ${styles.baLabelRight}`}>{data.afterLabel}</span>
    </div>
  );
}

// ── BOOKMARK ──
export function BookmarkBlock({ data }: { data: BookmarkBlockData }) {
  return (
    <div className={styles.bookmark}>
      <div className={styles.bookmarkBody}>
        <div className={styles.bookmarkSource}><span className={styles.bookmarkFavicon}>{data.favicon}</span>{data.source}</div>
        <div className={styles.bookmarkTitle}>{data.title}</div>
        <div className={styles.bookmarkDesc}>{data.description}</div>
        <div className={styles.bookmarkUrl}>{data.url}</div>
      </div>
      <div className={styles.bookmarkArrow}>↗</div>
    </div>
  );
}
