"use client";

import { useState } from "react";
import type { TableBlockData } from "@/lib/types";
import styles from "./TableBlock.module.css";

export default function TableBlock({ data, onChange }: { data: TableBlockData; onChange: (d: TableBlockData) => void }) {
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

export { TableBlock };
