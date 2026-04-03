"use client";

import { Fragment, type ReactNode } from "react";
import type { RenderBlock } from "../types";
import styles from "./PulseInvoiceBlocks.module.css";

type Tone = "neutral" | "ember" | "success" | "info" | "warning" | "danger" | "purple" | "brown";

function semanticTone(tone: Tone) {
  const map = {
    neutral: { color: "var(--ink-500)", background: "var(--warm-50)", border: "var(--warm-200)" },
    ember: { color: "var(--ember)", background: "var(--ember-bg)", border: "rgba(176, 125, 79, 0.12)" },
    success: { color: "var(--success)", background: "rgba(90, 154, 60, 0.06)", border: "rgba(90, 154, 60, 0.1)" },
    info: { color: "var(--info)", background: "rgba(91, 127, 164, 0.06)", border: "rgba(91, 127, 164, 0.1)" },
    warning: { color: "#c89360", background: "rgba(200, 147, 96, 0.06)", border: "rgba(200, 147, 96, 0.1)" },
    danger: { color: "#c24b38", background: "rgba(194, 75, 56, 0.06)", border: "rgba(194, 75, 56, 0.1)" },
    purple: { color: "#7c6b9e", background: "rgba(124, 107, 158, 0.06)", border: "rgba(124, 107, 158, 0.1)" },
    brown: { color: "#8a7e63", background: "rgba(138, 126, 99, 0.06)", border: "rgba(138, 126, 99, 0.1)" },
  };

  return map[tone] ?? map.neutral;
}

function Badge({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) {
  const token = semanticTone(tone);

  return (
    <span
      className={styles.badge}
      style={{
        color: token.color,
        background: token.background,
        borderColor: token.border,
      }}
    >
      {dot ? <span className={styles.dot} style={{ background: token.color }} /> : null}
      {children}
    </span>
  );
}

function Avatar({
  initials,
  color,
  online = false,
}: {
  initials: string;
  color: string;
  online?: boolean;
}) {
  return (
    <div className={styles.avatar} style={{ background: color }} aria-label={initials}>
      {initials}
      {online ? <span className={styles.avatarDot} /> : null}
    </div>
  );
}

function SignalMeter({ values = [88, 56, 78, 64, 92, 71] }: { values?: number[] }) {
  return (
    <div className={styles.meter}>
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={styles.meterBar}
          style={{ height: `${value}%`, opacity: 0.68 + index * 0.05 }}
        />
      ))}
    </div>
  );
}

function PulseFeedRow({
  avatar,
  tone = "info",
  title,
  meta,
  right,
}: {
  avatar: ReactNode;
  tone?: Tone;
  title: string;
  meta: string;
  right?: ReactNode;
}) {
  const token = semanticTone(tone);

  return (
    <div className={styles.feedRow}>
      <div className={styles.feedLead}>
        {avatar}
        <div className={styles.feedRail} style={{ background: token.color }} />
      </div>
      <div className={styles.feedCopy}>
        <div className={styles.feedTitle}>{title}</div>
        <div className={styles.feedMeta}>{meta}</div>
      </div>
      {right}
    </div>
  );
}

function InvoiceStep({
  label,
  meta,
  state = "idle",
  trailing,
}: {
  label: string;
  meta: string;
  state?: "idle" | "active" | "done";
  trailing?: ReactNode;
}) {
  return (
    <Fragment>
      <div className={styles.step} data-active={state === "active" ? "true" : "false"} data-done={state === "done" ? "true" : "false"}>
        <div className={styles.stepBullet}>{state === "done" ? "✓" : state === "active" ? "•" : "○"}</div>
        <div className={styles.stepCopy}>
          <div className={styles.stepTitle}>{label}</div>
          <div className={styles.stepMeta}>{meta}</div>
        </div>
        {trailing}
      </div>
      {state !== "idle" ? <div className={styles.stepLine} /> : null}
    </Fragment>
  );
}

export function ClientPulseBlock({ block }: { block: RenderBlock }) {
  return (
    <div className={styles.surface} aria-label={block.label}>
      <section className={styles.panel}>
        <div className={styles.stack}>
          <div className={styles.rowBetween}>
            <div>
              <div className={styles.brandMeta}>Pulse</div>
              <div className={styles.headingLg}>Client signal feed</div>
            </div>
            <div className={styles.livePill}>
              <span className={`${styles.dot} ${styles.livePillDot}`} style={{ background: "var(--success)" }} />
              Live now
            </div>
          </div>

          <div className={styles.pulseHero}>
            <div className={styles.spotlight}>
              <div className={styles.spotlightInner}>
                <div className={styles.brandMeta}>Strongest signal</div>
                <div className={styles.headingMd}>Meridian viewed Invoice #044 three minutes ago.</div>
                <div className={styles.body}>
                  Momentum is high. This is the kind of event that should feel expensive and alive, not like a flat notification row.
                </div>
                <div className={styles.chipRow}>
                  <div className={styles.chip}>
                    <span className={styles.dot} style={{ background: "var(--info)" }} />
                    Intent score · 84
                  </div>
                  <div className={styles.chip}>
                    <span className={styles.dot} style={{ background: "var(--success)" }} />
                    Response pace · healthy
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.signalCard}>
              <div className={styles.signalScore}>84</div>
              <div className={styles.signalLabel}>Pulse index</div>
              <SignalMeter />
            </div>
          </div>

          <div className={styles.feed}>
            <PulseFeedRow
              tone="info"
              avatar={<Avatar initials="MS" color="var(--brown, #8a7e63)" online />}
              title="Invoice viewed"
              meta="Meridian Studio opened the payment page and stayed for 2m 14s."
              right={<Badge tone="info">3m ago</Badge>}
            />
            <PulseFeedRow
              tone="success"
              avatar={<Avatar initials="AC" color="#a08472" />}
              title="Contract signed"
              meta="Aster & Co. completed the signature step and unlocked invoicing."
              right={<Badge tone="success">Ready</Badge>}
            />
            <PulseFeedRow
              tone="warning"
              avatar={<Avatar initials="NK" color="#7c6b9e" />}
              title="Feedback window narrowing"
              meta="North Kite has not replied in 46 hours. Follow-up timing is now important."
              right={<Badge tone="warning">Watch</Badge>}
            />
            <PulseFeedRow
              tone="ember"
              avatar={<Avatar initials="TL" color="var(--ember)" />}
              title="Proposal reshared"
              meta="The proposal link was reshared internally from one decision-maker to three."
              right={<Badge tone="ember">High intent</Badge>}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function InvoiceSurfaceBlock({ block }: { block: RenderBlock }) {
  return (
    <div className={styles.surface} aria-label={block.label}>
      <section className={styles.panel}>
        <div className={styles.stack}>
          <div className={styles.rowBetween}>
            <div>
              <div className={styles.brandMeta}>Invoice</div>
              <div className={styles.headingLg}>Revenue surface</div>
            </div>
            <Badge tone="ember">Stripe ready</Badge>
          </div>

          <div className={styles.ticket}>
            <div className={styles.ticketTop}>
              <div>
                <div className={styles.label}>Invoice #044</div>
                <div className={styles.amount}>$1.8k</div>
                <div className={styles.body}>
                  A premium invoice block should feel like a revenue instrument — part document, part payment terminal.
                </div>
              </div>
              <Badge tone="warning" dot>Due in 3 days</Badge>
            </div>

            <div className={styles.ticketGrid}>
              <div className={styles.ticketCard}>
                  <div className={styles.rowBetweenTop}>
                    <div className={styles.clientLead}>
                    <Avatar initials="MS" color="var(--brown, #8a7e63)" online />
                    <div>
                      <div className={styles.bodyStrong}>Meridian Studio</div>
                      <div className={styles.muted}>Brand system · final delivery invoice</div>
                    </div>
                  </div>
                  <Badge tone="info">Viewed</Badge>
                </div>

                <div className={styles.invoiceSteps}>
                  <InvoiceStep label="Draft finalized" meta="Line items approved and locked." state="done" trailing={<span className={styles.label}>done</span>} />
                  <InvoiceStep label="Invoice sent" meta="Client has opened the payment route." state="active" trailing={<span className={styles.label}>live</span>} />
                  <InvoiceStep label="Payment captured" meta="Awaiting Stripe confirmation." state="idle" trailing={<span className={styles.label}>next</span>} />
                </div>
              </div>

              <div className={styles.ticketCard}>
                <div className={styles.label}>Expected deposit</div>
                <div className={styles.headingLgTight}>$1,747.80</div>
                <div className={styles.mutedBlock}>
                  Net after 2.9% processing. Funds expected same day after payment capture.
                </div>
                <div className={styles.chipRow}>
                  <div className={styles.chip}>
                    <span className={styles.dot} style={{ background: "var(--success)" }} />
                    ACH + card accepted
                  </div>
                  <div className={styles.chip}>
                    <span className={styles.dot} style={{ background: "var(--ember)" }} />
                    Reminder window open
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.financeGrid}>
              <div className={styles.financeChip}>
                <div className={styles.financeValue}>$1,800</div>
                <div className={styles.financeMeta}>Gross total</div>
              </div>
              <div className={styles.financeChip}>
                <div className={styles.financeValue} style={{ color: "var(--error)" }}>-$52.20</div>
                <div className={styles.financeMeta}>Processing</div>
              </div>
              <div className={styles.financeChip}>
                <div className={styles.financeValue} style={{ color: "var(--success)" }}>$1,747.80</div>
                <div className={styles.financeMeta}>Net deposit</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
