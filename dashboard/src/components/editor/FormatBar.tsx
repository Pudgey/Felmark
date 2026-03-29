"use client";

import styles from "./FormatBar.module.css";

interface FormatBarProps {
  top: number;
  left: number;
}

export default function FormatBar({ top, left }: FormatBarProps) {
  const exec = (cmd: string, value?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand(cmd, false, value);
  };

  return (
    <div className={styles.bar} style={{ top, left }}>
      <button className={styles.btn} onMouseDown={exec("bold")} style={{ fontWeight: 700 }}>B</button>
      <button className={styles.btn} onMouseDown={exec("italic")} style={{ fontStyle: "italic" }}>I</button>
      <button className={styles.btn} onMouseDown={exec("underline")} style={{ textDecoration: "underline" }}>U</button>
      <button className={styles.btn} onMouseDown={exec("strikethrough")} style={{ textDecoration: "line-through" }}>S</button>
      <div className={styles.sep} />
      <button className={styles.btn} onMouseDown={exec("formatBlock", "pre")} style={{ fontFamily: "monospace", fontSize: 11 }}>{"<>"}</button>
    </div>
  );
}
