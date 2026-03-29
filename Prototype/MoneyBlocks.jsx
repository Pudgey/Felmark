import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   FELMARK MONEY BLOCKS — 6 financial blocks
   Billing, payments, calculations inside docs
   ═══════════════════════════════════════════ */

// ── 1. {rate-calculator} ──
function RateCalculator({ initialHours = 32, initialRate = 95 }) {
  const [hours, setHours] = useState(initialHours);
  const [rate, setRate] = useState(initialRate);
  const [editing, setEditing] = useState(false);
  const total = hours * rate;

  return (
    <div className="mb mb-calc">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "var(--ember)" }}>⊗</span>
        <span className="mb-label">Rate Calculator</span>
        <button className="mb-edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? "Done" : "Edit"}
        </button>
      </div>
      <div className="mb-calc-body">
        <div className="mb-calc-equation">
          <div className="mb-calc-input-group">
            <span className="mb-calc-input-label">hours</span>
            {editing ? (
              <input className="mb-calc-input" type="number" value={hours}
                onChange={e => setHours(Math.max(0, parseInt(e.target.value) || 0))} />
            ) : (
              <span className="mb-calc-value">{hours}</span>
            )}
          </div>
          <span className="mb-calc-op">x</span>
          <div className="mb-calc-input-group">
            <span className="mb-calc-input-label">rate</span>
            {editing ? (
              <input className="mb-calc-input" type="number" value={rate}
                onChange={e => setRate(Math.max(0, parseInt(e.target.value) || 0))} />
            ) : (
              <span className="mb-calc-value">${rate}</span>
            )}
          </div>
          <span className="mb-calc-op">=</span>
          <div className="mb-calc-total-group">
            <span className="mb-calc-input-label">total</span>
            <span className="mb-calc-total">${total.toLocaleString()}</span>
          </div>
        </div>
        <div className="mb-calc-breakdown">
          <span className="mb-calc-breakdown-item">
            <span className="mb-calc-bd-label">Daily (8h)</span>
            <span className="mb-calc-bd-val">${(rate * 8).toLocaleString()}</span>
          </span>
          <span className="mb-calc-bd-sep" />
          <span className="mb-calc-breakdown-item">
            <span className="mb-calc-bd-label">Weekly (40h)</span>
            <span className="mb-calc-bd-val">${(rate * 40).toLocaleString()}</span>
          </span>
          <span className="mb-calc-bd-sep" />
          <span className="mb-calc-breakdown-item">
            <span className="mb-calc-bd-label">Effective / deliverable</span>
            <span className="mb-calc-bd-val">${Math.round(total / 5).toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── 2. {payment-schedule} ──
function PaymentSchedule({ total = 4800, schedule }) {
  const defaultSchedule = schedule || [
    { id: 1, label: "Deposit", pct: 50, amount: total * 0.5, status: "paid", date: "Mar 15", trigger: "On signing" },
    { id: 2, label: "Milestone", pct: 25, amount: total * 0.25, status: "upcoming", date: "Apr 1", trigger: "After deliverables 1-3" },
    { id: 3, label: "Final", pct: 25, amount: total * 0.25, status: "upcoming", date: "Apr 10", trigger: "On delivery" },
  ];

  const paid = defaultSchedule.filter(s => s.status === "paid").reduce((sum, s) => sum + s.amount, 0);
  const remaining = total - paid;

  const statusCfg = {
    paid: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", icon: "check", label: "Paid" },
    invoiced: { color: "#5b7fa4", bg: "rgba(91,127,164,0.06)", icon: "->", label: "Invoiced" },
    upcoming: { color: "var(--ink-400)", bg: "var(--warm-50)", icon: "o", label: "Upcoming" },
    overdue: { color: "#c24b38", bg: "rgba(194,75,56,0.06)", icon: "!", label: "Overdue" },
  };

  return (
    <div className="mb mb-schedule">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "var(--ember)" }}>*</span>
        <span className="mb-label">Payment Schedule</span>
        <span className="mb-head-val">${total.toLocaleString()} total</span>
      </div>

      <div className="mb-sched-timeline">
        <div className="mb-sched-track">
          <div className="mb-sched-fill" style={{ width: `${(paid / total) * 100}%` }} />
        </div>
        <div className="mb-sched-dots">
          {defaultSchedule.map((s, i) => {
            const leftPct = defaultSchedule.slice(0, i).reduce((sum, x) => sum + x.pct, 0) + s.pct / 2;
            const cfg = statusCfg[s.status];
            return (
              <div key={s.id} className="mb-sched-dot-wrap" style={{ left: `${leftPct}%` }}>
                <div className={`mb-sched-dot ${s.status}`} style={{ background: s.status === "paid" ? cfg.color : "#fff", borderColor: cfg.color }}>
                  {s.status === "paid" && <span style={{ color: "#fff", fontSize: 8 }}>ok</span>}
                </div>
                <span className="mb-sched-dot-label">{s.pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-sched-rows">
        {defaultSchedule.map(s => {
          const cfg = statusCfg[s.status];
          return (
            <div key={s.id} className={`mb-sched-row ${s.status}`}>
              <div className="mb-sched-row-icon" style={{ color: cfg.color, background: cfg.bg }}>{cfg.icon}</div>
              <div className="mb-sched-row-info">
                <span className="mb-sched-row-label">{s.label}</span>
                <span className="mb-sched-row-trigger">{s.trigger}</span>
              </div>
              <div className="mb-sched-row-right">
                <span className="mb-sched-row-amount" style={{ color: s.status === "paid" ? "#5a9a3c" : "var(--ink-800)" }}>${s.amount.toLocaleString()}</span>
                <span className="mb-sched-row-date">{s.date}</span>
              </div>
              <span className="mb-sched-row-status" style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color + "20" }}>{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mb-sched-summary">
        <div className="mb-sched-sum-item">
          <span className="mb-sched-sum-label">Received</span>
          <span className="mb-sched-sum-val green">${paid.toLocaleString()}</span>
        </div>
        <div className="mb-sched-sum-item">
          <span className="mb-sched-sum-label">Remaining</span>
          <span className="mb-sched-sum-val">${remaining.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ── 3. {expense} ──
function ExpenseBlock({ expenses: initExpenses }) {
  const [expenses, setExpenses] = useState(initExpenses || [
    { id: 1, name: "Outfit Variable font license", amount: 45, category: "Software", date: "Mar 12" },
    { id: 2, name: "Stock photography (5 images)", amount: 75, category: "Assets", date: "Mar 18" },
    { id: 3, name: "Subcontractor - icon set", amount: 200, category: "Contractor", date: "Mar 22" },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const projectRevenue = 2400;
  const netProfit = projectRevenue - totalExpenses;
  const marginPct = Math.round((netProfit / projectRevenue) * 100);

  const addExpense = () => {
    if (!newName.trim() || !newAmount) return;
    setExpenses(prev => [...prev, { id: Date.now(), name: newName, amount: parseFloat(newAmount), category: "Other", date: "Today" }]);
    setNewName(""); setNewAmount(""); setShowAdd(false);
  };

  const catColors = { Software: "#5b7fa4", Assets: "#7c6b9e", Contractor: "#8a7e63", Other: "#9b988f" };

  return (
    <div className="mb mb-expense">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "#c24b38" }}>v</span>
        <span className="mb-label">Project Expenses</span>
        <span className="mb-head-val" style={{ color: "#c24b38" }}>-${totalExpenses.toLocaleString()}</span>
      </div>

      <div className="mb-expense-rows">
        {expenses.map(e => (
          <div key={e.id} className="mb-expense-row">
            <span className="mb-expense-cat-dot" style={{ background: catColors[e.category] || "#9b988f" }} />
            <span className="mb-expense-name">{e.name}</span>
            <span className="mb-expense-cat">{e.category}</span>
            <span className="mb-expense-date">{e.date}</span>
            <span className="mb-expense-amount">-${e.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="mb-expense-add-form">
          <input className="mb-expense-input" placeholder="Expense name..." value={newName}
            onChange={e => setNewName(e.target.value)} autoFocus
            onKeyDown={e => { if (e.key === "Enter") addExpense(); if (e.key === "Escape") setShowAdd(false); }} />
          <input className="mb-expense-input small" placeholder="$" type="number" value={newAmount}
            onChange={e => setNewAmount(e.target.value)} />
          <button className="mb-expense-add-btn" onClick={addExpense}>Add</button>
          <button className="mb-expense-cancel-btn" onClick={() => setShowAdd(false)}>x</button>
        </div>
      ) : (
        <button className="mb-expense-add-trigger" onClick={() => setShowAdd(true)}>+ Add expense</button>
      )}

      <div className="mb-expense-summary">
        <div className="mb-expense-sum-row">
          <span className="mb-expense-sum-label">Revenue</span>
          <span className="mb-expense-sum-val green">${projectRevenue.toLocaleString()}</span>
        </div>
        <div className="mb-expense-sum-row">
          <span className="mb-expense-sum-label">Expenses</span>
          <span className="mb-expense-sum-val red">-${totalExpenses.toLocaleString()}</span>
        </div>
        <div className="mb-expense-sum-row total">
          <span className="mb-expense-sum-label">Net Profit</span>
          <span className="mb-expense-sum-val" style={{ color: netProfit >= 0 ? "#5a9a3c" : "#c24b38" }}>${netProfit.toLocaleString()}</span>
        </div>
        <div className="mb-expense-margin">
          <span className="mb-expense-margin-label">Margin</span>
          <div className="mb-expense-margin-bar">
            <div className="mb-expense-margin-fill" style={{ width: `${Math.max(marginPct, 0)}%`, background: marginPct >= 70 ? "#5a9a3c" : marginPct >= 40 ? "#b07d4f" : "#c24b38" }} />
          </div>
          <span className="mb-expense-margin-pct" style={{ color: marginPct >= 70 ? "#5a9a3c" : marginPct >= 40 ? "#b07d4f" : "#c24b38" }}>{marginPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ── 4. {milestone-payment} ──
function MilestonePayment({ milestones: initMilestones }) {
  const [milestones, setMilestones] = useState(initMilestones || [
    { id: 1, deliverable: "Logo usage rules", amount: 960, status: "paid", completedDate: "Mar 17", invoiceNum: "#045" },
    { id: 2, deliverable: "Color palette", amount: 960, status: "ready", completedDate: "Mar 21", invoiceNum: null },
    { id: 3, deliverable: "Typography scale", amount: 960, status: "pending", completedDate: null, invoiceNum: null },
    { id: 4, deliverable: "Social templates", amount: 960, status: "pending", completedDate: null, invoiceNum: null },
    { id: 5, deliverable: "Final delivery + review", amount: 960, status: "pending", completedDate: null, invoiceNum: null },
  ]);

  const total = milestones.reduce((s, m) => s + m.amount, 0);
  const paidTotal = milestones.filter(m => m.status === "paid").reduce((s, m) => s + m.amount, 0);
  const readyTotal = milestones.filter(m => m.status === "ready").reduce((s, m) => s + m.amount, 0);

  const triggerInvoice = (id) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: "invoiced", invoiceNum: `#${48 + id}` } : m));
  };

  const statusIcons = {
    paid: { icon: "ok", color: "#5a9a3c", label: "Paid" },
    invoiced: { icon: "->", color: "#5b7fa4", label: "Invoiced" },
    ready: { icon: "*", color: "#b07d4f", label: "Ready to invoice" },
    pending: { icon: "o", color: "var(--ink-300)", label: "Pending" },
  };

  return (
    <div className="mb mb-milestone">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "#5a9a3c" }}>F</span>
        <span className="mb-label">Milestone Payments</span>
        <span className="mb-head-val">${total.toLocaleString()}</span>
      </div>

      <div className="mb-mile-progress">
        {milestones.map(m => {
          const cfg = statusIcons[m.status];
          return <div key={m.id} className="mb-mile-seg" style={{ background: cfg.color, opacity: m.status === "pending" ? 0.15 : m.status === "ready" ? 0.4 : 0.7 }} />;
        })}
      </div>

      <div className="mb-mile-rows">
        {milestones.map((m, i) => {
          const cfg = statusIcons[m.status];
          return (
            <div key={m.id} className={`mb-mile-row ${m.status}`}>
              <div className="mb-mile-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="mb-mile-icon" style={{ color: cfg.color }}>{cfg.icon}</div>
              <div className="mb-mile-info">
                <span className="mb-mile-name">{m.deliverable}</span>
                <span className="mb-mile-meta">
                  {m.completedDate && <span>Completed {m.completedDate}</span>}
                  {m.invoiceNum && <span> - {m.invoiceNum}</span>}
                </span>
              </div>
              <span className="mb-mile-amount" style={{ color: m.status === "paid" ? "#5a9a3c" : "var(--ink-700)" }}>${m.amount.toLocaleString()}</span>
              {m.status === "ready" && (
                <button className="mb-mile-trigger" onClick={() => triggerInvoice(m.id)}>
                  Send Invoice
                </button>
              )}
              {m.status === "paid" && <span className="mb-mile-badge paid">Paid</span>}
              {m.status === "invoiced" && <span className="mb-mile-badge invoiced">Invoiced</span>}
            </div>
          );
        })}
      </div>

      <div className="mb-mile-summary">
        <span className="mb-mile-sum-item"><span className="mb-mile-sum-dot" style={{ background: "#5a9a3c" }} /> ${paidTotal.toLocaleString()} received</span>
        {readyTotal > 0 && <span className="mb-mile-sum-item"><span className="mb-mile-sum-dot" style={{ background: "#b07d4f" }} /> ${readyTotal.toLocaleString()} ready to invoice</span>}
        <span className="mb-mile-sum-item"><span className="mb-mile-sum-dot" style={{ background: "var(--warm-300)" }} /> ${(total - paidTotal - readyTotal).toLocaleString()} remaining</span>
      </div>
    </div>
  );
}

// ── 5. {tax-estimate} ──
function TaxEstimate({ annualEarnings = 142000, taxRate = 0.28, quarterlyPayments = [9940, 9940, 0, 0] }) {
  const estimatedTax = Math.round(annualEarnings * taxRate);
  const quarterly = Math.round(estimatedTax / 4);
  const paidSoFar = quarterlyPayments.reduce((s, p) => s + p, 0);
  const remaining = estimatedTax - paidSoFar;
  const currentQ = 1;

  const quarters = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];

  return (
    <div className="mb mb-tax">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "#7c6b9e" }}>S</span>
        <span className="mb-label">Tax Estimate</span>
        <span className="mb-head-val">{Math.round(taxRate * 100)}% rate</span>
      </div>

      <div className="mb-tax-top">
        <div className="mb-tax-big">
          <span className="mb-tax-big-label">Estimated annual tax</span>
          <span className="mb-tax-big-val">${estimatedTax.toLocaleString()}</span>
        </div>
        <div className="mb-tax-big">
          <span className="mb-tax-big-label">Quarterly set-aside</span>
          <span className="mb-tax-big-val ember">${quarterly.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-tax-quarters">
        {quarters.map((q, i) => {
          const paid = quarterlyPayments[i];
          const due = quarterly;
          const isPast = i < currentQ;
          const isCurrent = i === currentQ;
          const status = paid >= due ? "paid" : isCurrent ? "due" : isPast ? "overdue" : "upcoming";
          const statusCfg = {
            paid: { color: "#5a9a3c", label: "Paid", icon: "ok" },
            due: { color: "#b07d4f", label: "Due Apr 15", icon: "!" },
            overdue: { color: "#c24b38", label: "Overdue", icon: "!" },
            upcoming: { color: "var(--ink-300)", label: "Upcoming", icon: "o" },
          }[status];

          return (
            <div key={i} className={`mb-tax-q ${status}`}>
              <div className="mb-tax-q-head">
                <span className="mb-tax-q-name">{q}</span>
                <span className="mb-tax-q-status" style={{ color: statusCfg.color }}>{statusCfg.icon} {statusCfg.label}</span>
              </div>
              <div className="mb-tax-q-bar">
                <div className="mb-tax-q-fill" style={{ width: `${Math.min((paid / due) * 100, 100)}%`, background: statusCfg.color }} />
              </div>
              <div className="mb-tax-q-vals">
                <span>${paid.toLocaleString()} paid</span>
                <span>${due.toLocaleString()} due</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-tax-footer">
        <span className="mb-tax-footer-item">Based on ${annualEarnings.toLocaleString()} projected annual income</span>
        <span className="mb-tax-footer-item" style={{ color: remaining > 0 ? "#c24b38" : "#5a9a3c" }}>
          {remaining > 0 ? `$${remaining.toLocaleString()} remaining this year` : "Fully paid for the year"}
        </span>
      </div>
    </div>
  );
}

// ── 6. {payment} ──
function PaymentButton({ amount = 2400, label = "Brand Guidelines v2 - 50% Deposit", client = "Meridian Studio" }) {
  const [state, setState] = useState("idle");
  const fee = Math.round(amount * 0.029);
  const net = amount - fee;

  const handlePay = () => {
    setState("processing");
    setTimeout(() => setState("success"), 2000);
  };

  return (
    <div className="mb mb-payment">
      <div className="mb-head">
        <span className="mb-icon" style={{ color: "#5a9a3c" }}>$</span>
        <span className="mb-label">Payment</span>
        {state === "success" && <span className="mb-head-badge green">Paid</span>}
      </div>

      <div className="mb-pay-body">
        <div className="mb-pay-info">
          <span className="mb-pay-label-text">{label}</span>
          <span className="mb-pay-client">{client}</span>
        </div>

        <div className="mb-pay-amount-row">
          <span className="mb-pay-amount">${amount.toLocaleString()}</span>
        </div>

        <div className="mb-pay-breakdown">
          <div className="mb-pay-bd-row">
            <span>Processing fee (2.9%)</span>
            <span>-${fee.toLocaleString()}</span>
          </div>
          <div className="mb-pay-bd-row net">
            <span>You receive</span>
            <span>${net.toLocaleString()}</span>
          </div>
        </div>

        {state === "idle" && (
          <button className="mb-pay-btn" onClick={handlePay}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/></svg>
            Pay ${amount.toLocaleString()} via Stripe
          </button>
        )}

        {state === "processing" && (
          <div className="mb-pay-processing">
            <span className="mb-pay-spinner" />
            Processing payment...
          </div>
        )}

        {state === "success" && (
          <div className="mb-pay-success">
            <span className="mb-pay-success-icon">ok</span>
            <div>
              <span className="mb-pay-success-title">Payment successful</span>
              <span className="mb-pay-success-detail">Receipt sent to {client}</span>
            </div>
          </div>
        )}

        <div className="mb-pay-footer">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><rect x="1" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="0.8"/><path d="M3 5h4M5 3v4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/></svg>
          Secured by Stripe - 256-bit encryption
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════
   SHOWCASE — Design reference for money blocks
   ═══════════════════════════ */
export default function MoneyBlocks() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      <div className="page">
        <div className="canvas">
          <h1 className="doc-h1">Money Blocks</h1>
          <div className="doc-meta">
            <span>Felmark Block Library</span>
            <span>-</span>
            <span>6 financial blocks</span>
            <span>-</span>
            <span>Type /money to insert</span>
          </div>

          <p className="doc-p">
            Money blocks handle billing, payments, and financial calculations right inside your documents. They connect to your real Stripe account, project data, and time tracking.
          </p>

          <h2 className="doc-h2">Rate Calculator</h2>
          <p className="doc-p">Click Edit to adjust hours and rate. The total updates live with daily, weekly, and per-deliverable breakdowns.</p>
          <RateCalculator />

          <div className="doc-divider" />

          <h2 className="doc-h2">Payment Schedule</h2>
          <p className="doc-p">Visual timeline of when money is due. Green means received. The track fills as payments come in.</p>
          <PaymentSchedule />

          <div className="doc-divider" />

          <h2 className="doc-h2">Project Expenses</h2>
          <p className="doc-p">Track costs that eat into your profit. Click + Add expense to log font licenses, stock photos, subcontractor fees. The margin bar shows your real profitability.</p>
          <ExpenseBlock />

          <div className="doc-divider" />

          <h2 className="doc-h2">Milestone Payments</h2>
          <p className="doc-p">Tie payments to deliverables. When a deliverable is marked complete, the Send Invoice button appears. Click it and an invoice is generated automatically.</p>
          <MilestonePayment />

          <div className="doc-divider" />

          <h2 className="doc-h2">Tax Estimate</h2>
          <p className="doc-p">Based on your projected annual income, this block calculates your estimated quarterly tax payments and tracks what you have set aside.</p>
          <TaxEstimate />

          <div className="doc-divider" />

          <h2 className="doc-h2">Payment Button</h2>
          <p className="doc-p">Embed a Stripe checkout directly in your proposal or invoice. The client clicks, pays, and you see the confirmation — all without leaving the document. Click the button below to see the flow.</p>
          <PaymentButton />

          <div className="doc-note">
            All money blocks connect to your real Stripe account when configured. Processing fees, payment statuses, and tax calculations update automatically as invoices are sent and payments received.
          </div>
        </div>
      </div>
    </>
  );
}
