"use client";

import { useState } from "react";
import styles from "./MoneyBlock.module.css";

export interface PaymentData { amount: number; label: string; client: string }

export default function PaymentButton({ data }: { data: PaymentData }) {
  const [state, setState] = useState<"idle" | "processing" | "success">("idle");
  const { amount, label, client } = data;
  const fee = Math.round(amount * 0.029);
  const net = amount - fee;

  const handlePay = () => { setState("processing"); setTimeout(() => setState("success"), 2000); };

  return (
    <div className={styles.mb}>
      <div className={styles.head}>
        <span className={styles.icon} style={{ color: "#5a9a3c" }}>$</span>
        <span className={styles.label}>Payment</span>
        {state === "success" && <span className={styles.headBadgeGreen}>&check; Paid</span>}
      </div>
      <div className={styles.payBody}>
        <div className={styles.payInfo}>
          <span className={styles.payLabel}>{label}</span>
          <span className={styles.payClient}>{client}</span>
        </div>
        <div className={styles.payAmount}>${amount.toLocaleString()}</div>
        <div className={styles.payBreakdown}>
          <div className={styles.payBdRow}><span>Processing fee (2.9%)</span><span>-${fee.toLocaleString()}</span></div>
          <div className={`${styles.payBdRow} ${styles.payBdNet}`}><span>You receive</span><span>${net.toLocaleString()}</span></div>
        </div>
        {state === "idle" && (
          <button className={styles.payBtn} onClick={handlePay}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.2"/></svg>
            Pay ${amount.toLocaleString()} via Stripe
          </button>
        )}
        {state === "processing" && <div className={styles.payProcessing}><span className={styles.paySpinner} /> Processing payment...</div>}
        {state === "success" && (
          <div className={styles.paySuccess}>
            <span className={styles.paySuccessIcon}>&check;</span>
            <div><span className={styles.paySuccessTitle}>Payment successful</span><span className={styles.paySuccessDetail}>Receipt sent to {client}</span></div>
          </div>
        )}
        <div className={styles.payFooter}>Secured by Stripe &middot; 256-bit encryption</div>
      </div>
    </div>
  );
}
