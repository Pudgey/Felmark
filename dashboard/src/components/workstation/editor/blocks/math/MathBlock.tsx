"use client";

import type { MathBlockData } from "@/lib/types";
import styles from "./MathBlock.module.css";

export default function MathBlock({ data }: { data: MathBlockData }) {
  return (
    <div className={styles.math}>
      <div className={styles.mathHead}><span className={styles.mathIcon}>&sum;</span><span className={styles.mathLabel}>Formula</span></div>
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

export { MathBlock };
