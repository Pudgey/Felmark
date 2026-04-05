"use client";

import type { RenderBlock } from "../types";
import styles from "./BlockContent.module.css";

type ToneKey = "success" | "danger" | "info" | "goal";

function toneStyles(tone: ToneKey) {
  const map = {
    success: {
      color: "var(--success)",
      soft: "rgba(110, 159, 114, 0.12)",
      border: "rgba(110, 159, 114, 0.14)",
      shadow: "rgba(110, 159, 114, 0.18)",
    },
    danger: {
      color: "#c57a69",
      soft: "rgba(197, 122, 105, 0.12)",
      border: "rgba(197, 122, 105, 0.14)",
      shadow: "rgba(197, 122, 105, 0.18)",
    },
    info: {
      color: "#8481bd",
      soft: "rgba(132, 129, 189, 0.12)",
      border: "rgba(132, 129, 189, 0.14)",
      shadow: "rgba(132, 129, 189, 0.18)",
    },
    goal: {
      color: "var(--ember)",
      soft: "rgba(176, 125, 79, 0.12)",
      border: "rgba(176, 125, 79, 0.14)",
      shadow: "rgba(176, 125, 79, 0.18)",
    },
  };

  return map[tone];
}

function Kicker({
  tone,
  dot = false,
  children,
}: {
  tone: ToneKey;
  dot?: boolean;
  children: string;
}) {
  const token = toneStyles(tone);

  return (
    <span
      className={styles.metricKicker}
      style={{
        color: token.color,
        background: token.soft,
        borderColor: token.border,
      }}
    >
      {dot ? <span className={styles.metricDot} style={{ background: token.color }} /> : null}
      {children}
    </span>
  );
}

function SparkBars({
  values,
  tone,
  compact = false,
}: {
  values: number[];
  tone: ToneKey;
  compact?: boolean;
}) {
  const token = toneStyles(tone);

  return (
    <div className={compact ? styles.metricSparkCompact : styles.metricSpark}>
      {values.map((value, index) => (
        <div
          key={`${value}-${index}`}
          className={styles.metricSparkBar}
          style={{
            height: `${value}%`,
            background: `linear-gradient(180deg, ${token.color} 0%, ${token.soft} 100%)`,
            opacity: 0.64 + index * 0.03,
          }}
        />
      ))}
    </div>
  );
}

function SimpleMetricBlock({
  block,
  pct,
}: {
  block: RenderBlock;
  pct: number | null;
}) {
  return (
    <div className={styles.metricContent}>
      <div className={styles.metricLabel}>{block.label}</div>
      <div
        className={`${styles.metricValue} ${block.w >= 2 ? styles.metricValueLarge : styles.metricValueSmall}`}
        style={{ color: block.color }}
      >
        {block.value}
      </div>
      <div className={styles.metricSub}>{block.sub}</div>
      {pct != null && (
        <div className={styles.metricProgress}>
          <div
            className={styles.metricProgressFill}
            style={{ width: `${pct}%`, background: block.color }}
          />
        </div>
      )}
    </div>
  );
}

export default function MetricBlock({ block }: { block: RenderBlock }) {
  const pct =
    block.type === "goal"
      ? parseInt(block.value ?? "0", 10)
      : block.type === "rate"
        ? 72
        : null;
  const isTiny = block.w < 2 || block.h < 2;
  const isRich = block.h >= 3;

  if (isTiny) {
    return <SimpleMetricBlock block={block} pct={pct} />;
  }

  if (block.type === "revenue") {
    if (!isRich) {
      return (
        <div className={`${styles.metricCompact} ${styles.metricToneSuccess}`}>
          <div className={styles.metricCompactInner}>
            <div className={styles.metricTop}>
              <div className={styles.metricLabelRich}>Revenue</div>
              <Kicker tone="success" dot>Growing</Kicker>
            </div>

            <div>
              <div className={styles.metricValueDisplayCompact} style={{ color: "var(--success)" }}>{block.value}</div>
              <div className={styles.metricSupportCompact}>{block.sub}</div>
            </div>

            <div className={styles.metricCompactDetail}>
              <SparkBars tone="success" compact values={[24, 42, 38, 56, 64, 58, 78, 72, 90, 84]} />

              <div className={styles.metricCompactStats}>
                <div className={styles.metricCompactStat}>
                  <div className={styles.metricCompactStatValue}>$3.7k</div>
                  <div className={styles.metricCompactStatLabel}>Average week</div>
                </div>
                <div className={styles.metricCompactStat}>
                  <div className={styles.metricCompactStatValue}>$13.9k</div>
                  <div className={styles.metricCompactStatLabel}>After fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.metricRich} ${styles.metricToneSuccess}`}>
        <div className={styles.metricRichInner}>
          <div className={styles.metricTop}>
            <div className={styles.metricLabelRich}>Revenue</div>
            <Kicker tone="success" dot>Growing</Kicker>
          </div>

          <div>
            <div className={styles.metricValueDisplay} style={{ color: "var(--success)" }}>{block.value}</div>
            <div className={styles.metricSupport}>{block.sub}</div>
          </div>

          <SparkBars tone="success" values={[24, 42, 38, 56, 64, 58, 78, 72, 90, 84]} />

          <div className={styles.metricMiniGrid}>
            <div className={styles.metricMiniCard}>
              <div className={styles.metricMiniValue}>$3.7k</div>
              <div className={styles.metricMiniLabel}>Average week</div>
            </div>
            <div className={styles.metricMiniCard}>
              <div className={styles.metricMiniValue}>$13.9k</div>
              <div className={styles.metricMiniLabel}>After fees</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "outstanding") {
    if (!isRich) {
      return (
        <div className={`${styles.metricCompact} ${styles.metricToneDanger}`}>
          <div className={styles.metricCompactInner}>
            <div className={styles.metricTop}>
              <div className={styles.metricLabelRich}>Outstanding</div>
              <Kicker tone="danger">Actionable</Kicker>
            </div>

            <div>
              <div className={styles.metricValueDisplayCompact} style={{ color: "#c57a69" }}>{block.value}</div>
              <div className={styles.metricSupportCompact}>{block.sub}</div>
            </div>

            <div className={styles.metricCompactDetail}>
              <div className={styles.metricAgingRowCompact}>
                <div>
                  <div className={styles.metricAgingTitle}>Invoice #044 · Meridian</div>
                  <div className={styles.metricAgingMetaCompact}>$1,800 · payment page visited today</div>
                </div>
                <div
                  className={styles.metricAgingBadge}
                  style={{ color: "#c57a69", background: "rgba(197, 122, 105, 0.08)", borderColor: "rgba(197, 122, 105, 0.12)" }}
                >
                  Due soon
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.metricRich} ${styles.metricToneDanger}`}>
        <div className={styles.metricRichInner}>
          <div className={styles.metricTop}>
            <div className={styles.metricLabelRich}>Outstanding</div>
            <Kicker tone="danger">Actionable</Kicker>
          </div>

          <div>
            <div className={styles.metricValueDisplay} style={{ color: "#c57a69" }}>{block.value}</div>
            <div className={styles.metricSupport}>{block.sub}</div>
          </div>

          <div className={styles.metricAging}>
            <div className={styles.metricAgingRow}>
              <div>
                <div className={styles.metricAgingTitle}>Invoice #044 · Meridian</div>
                <div className={styles.metricAgingMeta}>$1,800 · payment page visited today</div>
              </div>
              <div
                className={styles.metricAgingBadge}
                style={{ color: "#c57a69", background: "rgba(197, 122, 105, 0.08)", borderColor: "rgba(197, 122, 105, 0.12)" }}
              >
                Due soon
              </div>
            </div>

            <div className={styles.metricAgingRow}>
              <div>
                <div className={styles.metricAgingTitle}>Invoice #041 · North Kite</div>
                <div className={styles.metricAgingMeta}>$4,300 · 4 days overdue</div>
              </div>
              <div
                className={styles.metricAgingBadge}
                style={{ color: "#c57a69", background: "rgba(197, 122, 105, 0.08)", borderColor: "rgba(197, 122, 105, 0.12)" }}
              >
                Overdue
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "rate") {
    if (!isRich) {
      return (
        <div className={`${styles.metricCompact} ${styles.metricToneInfo}`}>
          <div className={styles.metricCompactInner}>
            <div className={styles.metricTop}>
              <div className={styles.metricLabelRich}>Effective rate</div>
              <Kicker tone="info">Targeted</Kicker>
            </div>

            <div>
              <div className={styles.metricValueDisplayCompact} style={{ color: "#8481bd" }}>{block.value}</div>
              <div className={styles.metricSupportCompact}>{block.sub}</div>
            </div>

            <div className={styles.metricCompactDetail}>
              <div>
                <div className={styles.metricBarMeta}>
                  <span>72% of target</span>
                  <span className={styles.metricSubMeta}>Needs +$42/hr</span>
                </div>
                <div className={styles.metricTrack} style={{ background: "rgba(132, 129, 189, 0.12)" }}>
                  <div className={styles.metricFill} style={{ width: "72%", background: "linear-gradient(90deg, #8481bd 0%, rgba(132, 129, 189, 0.42) 100%)" }} />
                </div>
              </div>

              <div className={styles.metricCompactStats}>
                <div className={styles.metricCompactStat}>
                  <div className={styles.metricCompactStatValue}>32h</div>
                  <div className={styles.metricCompactStatLabel}>Tracked hours</div>
                </div>
                <div className={styles.metricCompactStat}>
                  <div className={styles.metricCompactStatValue}>$96/hr</div>
                  <div className={styles.metricCompactStatLabel}>Last month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.metricRich} ${styles.metricToneInfo}`}>
        <div className={styles.metricRichInner}>
          <div className={styles.metricTop}>
            <div className={styles.metricLabelRich}>Effective rate</div>
            <Kicker tone="info">Targeted</Kicker>
          </div>

          <div>
            <div className={styles.metricValueDisplay} style={{ color: "#8481bd" }}>{block.value}</div>
            <div className={styles.metricSupport}>{block.sub}</div>
          </div>

          <div>
            <div className={styles.metricBarMeta}>
              <span>72% of target</span>
              <span className={styles.metricSubMeta}>Needs +$42/hr</span>
            </div>
            <div className={styles.metricTrack} style={{ background: "rgba(132, 129, 189, 0.12)" }}>
              <div className={styles.metricFill} style={{ width: "72%", background: "linear-gradient(90deg, #8481bd 0%, rgba(132, 129, 189, 0.42) 100%)" }} />
            </div>
          </div>

          <div className={styles.metricMiniGrid}>
            <div className={styles.metricMiniCard}>
              <div className={styles.metricMiniValue}>32h</div>
              <div className={styles.metricMiniLabel}>Tracked hours</div>
            </div>
            <div className={styles.metricMiniCard}>
              <div className={styles.metricMiniValue}>$96/hr</div>
              <div className={styles.metricMiniLabel}>Last month</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "goal") {
    const goalPct = pct ?? 74;
    const goalTone = toneStyles("goal");

    if (!isRich) {
      return (
        <div className={`${styles.metricCompact} ${styles.metricToneGoal}`}>
          <div className={styles.metricCompactInner}>
            <div className={styles.metricTop}>
              <div className={styles.metricLabelRich}>Monthly goal</div>
              <Kicker tone="goal" dot>On track</Kicker>
            </div>

            <div>
              <div className={styles.metricValueDisplayCompact} style={{ color: "var(--ember)" }}>{block.value}</div>
              <div className={styles.metricSupportCompact}>{block.sub}</div>
            </div>

            <div className={styles.metricCompactDetail}>
              <div>
                <div className={styles.metricBarMeta}>
                  <span>$14,800 booked</span>
                  <span className={styles.metricSubMeta}>$5,200 left</span>
                </div>
                <div className={styles.metricTrack} style={{ background: "rgba(176, 125, 79, 0.12)" }}>
                  <div className={styles.metricFill} style={{ width: `${goalPct}%`, background: "linear-gradient(90deg, var(--ember) 0%, rgba(176, 125, 79, 0.42) 100%)" }} />
                </div>
              </div>

              <div className={styles.metricCompactNote}>
                <span className={styles.metricDot} style={{ background: "var(--ember)" }} />
                Forecast says reachable
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${styles.metricRich} ${styles.metricToneGoal}`}>
        <div className={styles.metricRichInner}>
          <div className={styles.metricTop}>
            <div className={styles.metricLabelRich}>Monthly goal</div>
            <Kicker tone="goal" dot>On track</Kicker>
          </div>

          <div
            className={styles.metricGoalHero}
            style={{
              ["--goal-progress" as string]: String(goalPct),
              ["--tone-color" as string]: goalTone.color,
              ["--tone-shadow" as string]: goalTone.shadow,
            }}
          >
            <div>
              <div className={styles.metricValueDisplay} style={{ color: "var(--ember)" }}>{block.value}</div>
              <div className={styles.metricSupport}>{block.sub}</div>
            </div>

            <div className={styles.metricGoalRing}>
              <div className={styles.metricGoalRingCore}>
                <div>
                  <div className={styles.metricGoalRingValue}>{goalPct}%</div>
                  <div className={styles.metricGoalRingLabel}>complete</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className={styles.metricBarMeta}>
              <span>$14,800 booked</span>
              <span className={styles.metricSubMeta}>$5,200 left</span>
            </div>
            <div className={styles.metricTrack} style={{ background: "rgba(176, 125, 79, 0.12)" }}>
              <div className={styles.metricFill} style={{ width: `${goalPct}%`, background: "linear-gradient(90deg, var(--ember) 0%, rgba(176, 125, 79, 0.42) 100%)" }} />
            </div>
          </div>

          <div className={styles.metricChipRow}>
            <div className={styles.metricChip}>
              <span className={styles.metricDot} style={{ background: "var(--ember)" }} />
              Forecast says reachable
            </div>
            <div className={styles.metricChip}>
              <span className={styles.metricDot} style={{ background: "var(--success)" }} />
              2 invoices could close it
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <SimpleMetricBlock block={block} pct={pct} />;
}
