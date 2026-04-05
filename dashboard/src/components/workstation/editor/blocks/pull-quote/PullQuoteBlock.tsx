"use client";

import type { PullQuoteData } from "@/lib/types";
import styles from "./PullQuoteBlock.module.css";

export function getDefaultPullQuote(): PullQuoteData {
  return {
    text: "Working with this team transformed our brand. The attention to detail and strategic thinking exceeded every expectation.",
    author: "Sarah Chen",
    role: "Founder, Meridian Studio",
    avatarLetter: "S",
    avatarColor: "var(--info)",
    rating: 5,
  };
}

export default function PullQuoteBlock({
  data,
  onChange: _onChange,
}: {
  data: PullQuoteData;
  onChange: (d: PullQuoteData) => void;
}) {
  return (
    <div className={styles.pq}>
      <div className={styles.pqHeader}>
        <div className={styles.pqIcon}>&#x275D;</div>
        <span className={styles.pqLabel}>Pull Quote</span>
      </div>
      <div className={styles.pqBody}>
        <div className={styles.pqQuoteMark}>&ldquo;</div>
        <div className={styles.pqText}>{data.text}</div>
        <div className={styles.pqAttribution}>
          <div className={styles.pqAvatar} style={{ background: data.avatarColor }}>
            {data.avatarLetter}
          </div>
          <div>
            <div className={styles.pqAuthor}>{data.author}</div>
            <div className={styles.pqRole}>{data.role}</div>
          </div>
          <div className={styles.pqStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`${styles.pqStar} ${star <= data.rating ? styles.pqStarFilled : ""}`}>
                &#x2605;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { PullQuoteBlock };
