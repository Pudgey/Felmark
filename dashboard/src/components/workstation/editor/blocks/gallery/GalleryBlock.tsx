"use client";

import { useState } from "react";
import type { GalleryBlockData } from "@/lib/types";
import styles from "./GalleryBlock.module.css";

export default function GalleryBlock({ data }: { data: GalleryBlockData }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const colors = ["var(--warm-300)", "var(--warm-200)", "var(--warm-400)", "#f0eee9", "#c8c3ba", "#ddd9d1"];
  return (
    <>
      <div className={styles.gallery}>
        {data.images.map((img, i) => (
          <div
            key={i}
            className={styles.galleryItem}
            onClick={() => setLightbox(i)}
            style={{ background: colors[i % colors.length] }}
          >
            <div className={styles.galleryPlaceholder}>{img.icon || "\u25c7"}</div>
            <div className={styles.galleryCaption}>{img.caption}</div>
          </div>
        ))}
      </div>
      {lightbox !== null && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lightboxImg} style={{ background: colors[lightbox % colors.length] }}>
              <span style={{ fontSize: 48, color: "var(--ink-300)" }}>{data.images[lightbox].icon}</span>
            </div>
            <div className={styles.lightboxInfo}>
              <span className={styles.lightboxCaption}>{data.images[lightbox].caption}</span>
              <span className={styles.lightboxMeta}>{data.images[lightbox].meta}</span>
            </div>
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
              &times;
            </button>
            {lightbox > 0 && (
              <button className={`${styles.lightboxNav} ${styles.left}`} onClick={() => setLightbox(lightbox - 1)}>
                &lsaquo;
              </button>
            )}
            {lightbox < data.images.length - 1 && (
              <button className={`${styles.lightboxNav} ${styles.right}`} onClick={() => setLightbox(lightbox + 1)}>
                &rsaquo;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { GalleryBlock };
