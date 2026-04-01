"use client";

import { useState } from "react";
import styles from "./MoneyBlock.module.css";

export interface ExpenseItem { id: string; name: string; amount: number; category: string; date: string }
export interface ExpenseData { projectRevenue: number; expenses: ExpenseItem[] }

const CAT_COLORS: Record<string, string> = { Software: "#5b7fa4", Assets: "#7c6b9e", Contractor: "#8a7e63", Other: "#9b988f" };

export default function ExpenseTracker({ data, onUpdate }: { data: ExpenseData; onUpdate?: (d: ExpenseData) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const { projectRevenue, expenses } = data;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = projectRevenue - totalExpenses;
  const marginPct = projectRevenue > 0 ? Math.round((netProfit / projectRevenue) * 100) : 0;

  const addExpense = () => {
    if (!newName.trim() || !newAmount) return;
    const next: ExpenseData = { ...data, expenses: [...expenses, { id: String(Date.now()), name: newName, amount: parseFloat(newAmount) || 0, category: "Other", date: "Today" }] };
    onUpdate?.(next);
    setNewName(""); setNewAmount(""); setShowAdd(false);
  };

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "#c24b38" }}>&darr;</span>
        <span className={styles.label}>Project Expenses</span>
        <span className={styles.headVal} style={{ color: "#c24b38" }}>-${totalExpenses.toLocaleString()}</span>
      </div>
      <div className={styles.expRows}>
        {expenses.map(e => (
          <div key={e.id} className={styles.expRow}>
            <span className={styles.expDot} style={{ background: CAT_COLORS[e.category] || "#9b988f" }} />
            <span className={styles.expName}>{e.name}</span>
            <span className={styles.expCat}>{e.category}</span>
            <span className={styles.expDate}>{e.date}</span>
            <span className={styles.expAmt}>-${e.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {showAdd ? (
        <div className={styles.expAddForm}>
          <input className={styles.expInput} placeholder="Expense name..." value={newName} onChange={e => setNewName(e.target.value)} autoFocus
            onKeyDown={e => { if (e.key === "Enter") addExpense(); if (e.key === "Escape") setShowAdd(false); }} />
          <input className={`${styles.expInput} ${styles.expInputSmall}`} placeholder="$" type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} />
          <button className={styles.expAddBtn} onClick={addExpense}>Add</button>
          <button className={styles.expCancelBtn} onClick={() => setShowAdd(false)}>&times;</button>
        </div>
      ) : (
        <button className={styles.expAddTrigger} onClick={() => setShowAdd(true)}>+ Add expense</button>
      )}
      <div className={styles.expSummary}>
        <div className={styles.expSumRow}><span>Revenue</span><span className={`${styles.mono} ${styles.green}`}>${projectRevenue.toLocaleString()}</span></div>
        <div className={styles.expSumRow}><span>Expenses</span><span className={`${styles.mono} ${styles.red}`}>-${totalExpenses.toLocaleString()}</span></div>
        <div className={`${styles.expSumRow} ${styles.expSumTotal}`}><span>Net Profit</span><span className={styles.mono} style={{ color: netProfit >= 0 ? "#5a9a3c" : "#c24b38" }}>${netProfit.toLocaleString()}</span></div>
        <div className={styles.expMargin}>
          <span className={styles.expMarginLabel}>Margin</span>
          <div className={styles.expMarginBar}><div className={styles.expMarginFill} style={{ width: `${Math.max(marginPct, 0)}%`, background: marginPct >= 70 ? "#5a9a3c" : marginPct >= 40 ? "#b07d4f" : "#c24b38" }} /></div>
          <span className={styles.expMarginPct} style={{ color: marginPct >= 70 ? "#5a9a3c" : marginPct >= 40 ? "#b07d4f" : "#c24b38" }}>{marginPct}%</span>
        </div>
      </div>
    </div>
  );
}
