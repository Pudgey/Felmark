"use client";

import { BLOCK_DEFS } from "../registry";
import styles from "./ReplacePopover.module.css";

interface ReplacePopoverProps {
  currentType: string;
  onReplace: (type: string, label: string, color: string) => void;
  onClose: () => void;
}

export default function ReplacePopover({ currentType, onReplace, onClose }: ReplacePopoverProps) {
  return (
    <div className={styles.replacePopover}>
      <div className={styles.replacePopoverHeader}>Replace Block</div>
      {BLOCK_DEFS.map((def) => (
        <div
          key={def.type}
          className={`${styles.replacePopoverItem} ${currentType === def.type ? styles.replacePopoverActive : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (def.type !== currentType) {
              onReplace(def.type, def.label, def.color);
            }
            onClose();
          }}
        >
          <div
            className={styles.replacePopoverIcon}
            style={{ color: def.color, background: def.color + "12" }}
          >
            {def.icon}
          </div>
          <span className={styles.replacePopoverName}>{def.label}</span>
        </div>
      ))}
    </div>
  );
}
