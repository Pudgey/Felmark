"use client";

import type { BookmarkBlockData } from "@/lib/types";
import styles from "./BookmarkBlock.module.css";

export default function BookmarkBlock({ data }: { data: BookmarkBlockData }) {
  return (
    <div className={styles.bookmark}>
      <div className={styles.bookmarkBody}>
        <div className={styles.bookmarkSource}><span className={styles.bookmarkFavicon}>{data.favicon}</span>{data.source}</div>
        <div className={styles.bookmarkTitle}>{data.title}</div>
        <div className={styles.bookmarkDesc}>{data.description}</div>
        <div className={styles.bookmarkUrl}>{data.url}</div>
      </div>
      <div className={styles.bookmarkArrow}>&nearr;</div>
    </div>
  );
}

export { BookmarkBlock };
