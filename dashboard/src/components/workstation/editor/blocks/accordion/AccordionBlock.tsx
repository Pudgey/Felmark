"use client";

import { useState } from "react";
import type { AccordionBlockData } from "@/lib/types";
import styles from "./AccordionBlock.module.css";

export default function AccordionBlock({ data, onChange: _onChange }: { data: AccordionBlockData; onChange: (d: AccordionBlockData) => void }) {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <div className={styles.accordion}>
      {data.items.map((item, i) => (
        <div key={i} className={`${styles.accItem} ${openIdx === i ? styles.accOpen : ""}`}>
          <button className={styles.accTrigger} onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
            <span className={styles.accArrow}>{openIdx === i ? "\u25be" : "\u25b8"}</span>
            <span className={styles.accTitle}>{item.title}</span>
          </button>
          {openIdx === i && <div className={styles.accContent}>{item.content}</div>}
        </div>
      ))}
    </div>
  );
}

export { AccordionBlock };
