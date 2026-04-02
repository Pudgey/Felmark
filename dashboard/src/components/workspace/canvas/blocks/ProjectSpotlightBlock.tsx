"use client";

import { Fragment } from "react";
import type { RenderBlock } from "../types";
import styles from "./ProjectSpotlightBlock.module.css";

type Tone = "neutral" | "ember" | "success" | "info" | "warning" | "danger" | "purple" | "brown" | "stone";

const PROJECT = {
  title: "Meridian Rebrand",
  client: "Meridian Studio",
  phase: "Identity system",
  status: "In review",
  dueLabel: "Apr 8",
  daysLeft: 4,
  progress: 68,
  budgetBurn: 82,
  effectiveRate: "$112/hr",
  contractValue: "$6.5k",
  workspaceShortcut: "⌘J",
};

const PROJECT_CHIPS = [
  { tone: "ember" as Tone, text: "Delivery lane · Core brand system" },
  { tone: "info" as Tone, text: "Last client signal · 42m ago" },
  { tone: "success" as Tone, text: "Risk level · Stable" },
];

const PROJECT_MILESTONES = [
  { label: "Discovery", meta: "Locked" },
  { label: "Design", meta: "Active" },
  { label: "Review", meta: "Client" },
  { label: "Invoice", meta: "Queued" },
];

const PROJECT_ACTIONS = [
  {
    title: "Open workspace",
    meta: "Jump directly into the live client space.",
    shortcut: "⌘J",
    tone: "info" as Tone,
  },
  {
    title: "Create project note",
    meta: "Capture next steps without breaking flow.",
    shortcut: "⌘N",
    tone: "purple" as Tone,
  },
];

const SHORTCUT_ROWS = [
  {
    title: "Command palette",
    meta: "Search, jump, and execute actions from one command surface.",
    shortcut: "⌘K",
    tone: "ember" as Tone,
  },
  {
    title: "Switch workspace",
    meta: "Move between clients without touching the sidebar.",
    shortcut: "⌘J",
    tone: "info" as Tone,
  },
  {
    title: "New proposal",
    meta: "Open the fastest high-intent revenue flow in the product.",
    shortcut: "⌘⇧P",
    tone: "purple" as Tone,
  },
  {
    title: "Global search",
    meta: "Pull documents, invoices, and client signals into view instantly.",
    shortcut: "⌘/",
    tone: "success" as Tone,
  },
];

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
    stone: { color: "#a08472", background: "rgba(160, 132, 114, 0.06)", border: "rgba(160, 132, 114, 0.1)" },
  };

  return map[tone] ?? map.neutral;
}

function splitShortcutKeys(input?: string | string[]) {
  if (Array.isArray(input)) {
    return input.map((part) => String(part).trim()).filter(Boolean);
  }

  const raw = String(input ?? "").trim();
  if (!raw) return [];

  const specialKeys = new Set(["⌘", "⇧", "⌥", "⌃", "↵", "⎋", "↑", "↓", "←", "→", "⇥"]);
  const output: string[] = [];
  let buffer = "";

  for (const char of raw) {
    if (char === " ") {
      if (buffer) {
        output.push(buffer.toUpperCase());
        buffer = "";
      }
      continue;
    }

    if (specialKeys.has(char)) {
      if (buffer) {
        output.push(buffer.toUpperCase());
        buffer = "";
      }
      output.push(char);
      continue;
    }

    if (/[A-Za-z0-9]/.test(char)) {
      buffer += char;
      continue;
    }

    if (buffer) {
      output.push(buffer.toUpperCase());
      buffer = "";
    }

    output.push(char);
  }

  if (buffer) output.push(buffer.toUpperCase());
  return output;
}

function Badge({ tone = "neutral", dot = false, children }: { tone?: Tone; dot?: boolean; children: string }) {
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
      {dot ? <span className={styles.badgeDot} style={{ background: token.color }} /> : null}
      {children}
    </span>
  );
}

function Avatar({
  initials,
  color,
  online = false,
  size = 40,
  radius = 12,
}: {
  initials: string;
  color: string;
  online?: boolean;
  size?: number;
  radius?: number;
}) {
  return (
    <div
      className={styles.avatar}
      style={{
        background: color,
        width: size,
        height: size,
        borderRadius: radius,
      }}
      aria-label={initials}
    >
      {initials}
      {online ? <span className={styles.avatarDot} /> : null}
    </div>
  );
}

function Shortcut({
  children,
  keys,
  label,
  tone = "neutral",
}: {
  children?: string;
  keys?: string | string[];
  label?: string;
  tone?: Tone;
}) {
  const token = semanticTone(tone);
  const parts = splitShortcutKeys(keys ?? children);

  if (!parts.length) return null;

  return (
    <span
      className={styles.shortcut}
      style={{
        borderColor: token.border,
      }}
    >
      {label ? <span className={styles.shortcutLabel}>{label}</span> : null}
      <span className={styles.shortcutKeys}>
        {parts.map((part, index) => {
          const accent = index === parts.length - 1;

          return (
            <Fragment key={`${part}-${index}`}>
              <span
                className={styles.shortcutKey}
                style={accent ? { color: token.color, borderColor: token.border, background: token.background } : undefined}
              >
                {part}
              </span>
              {index < parts.length - 1 ? <span className={styles.shortcutPlus}>+</span> : null}
            </Fragment>
          );
        })}
      </span>
    </span>
  );
}

export function ProjectSummaryBlock({ block }: { block: RenderBlock }) {
  const ringBackground = `conic-gradient(var(--ember) ${PROJECT.progress}%, rgba(176, 125, 79, 0.12) 0)`;

  return (
    <div className={styles.surface} aria-label={block.label}>
      <section className={styles.projectCard}>
        <div className={styles.projectStack}>
          <div className={styles.projectTop}>
            <div className={styles.projectHead}>
              <div className={styles.projectMark}>◆</div>
              <div className={styles.projectCopy}>
                <div className={styles.brandMeta}>Project</div>
                <div className={styles.headingLg}>{PROJECT.title}</div>
                <div className={styles.projectTagline}>
                  A denser project surface with stronger hierarchy, richer depth, and a shortcut-native action layer.
                </div>
              </div>
            </div>

            <div className={styles.topActions}>
              <Badge tone="info" dot>{PROJECT.status}</Badge>
              <Shortcut tone="ember" label="Jump">{PROJECT.workspaceShortcut}</Shortcut>
            </div>
          </div>

          <div className={styles.projectClient}>
            <Avatar initials="MS" color="var(--brown, #8a7e63)" online />
            <div className={styles.projectClientCopy}>
              <div className={styles.bodyStrong}>{PROJECT.client}</div>
              <div className={styles.muted}>{PROJECT.phase} · proposal to production handoff</div>
            </div>
            <div className={styles.phaseChip}>Phase 03</div>
          </div>

          <div className={styles.projectChipRow}>
            {PROJECT_CHIPS.map((chip) => (
              <div key={chip.text} className={styles.projectChip}>
                <span className={styles.projectChipDot} style={{ background: semanticTone(chip.tone).color }} />
                <span>{chip.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.projectHero}>
            <div>
              <div className={styles.projectKicker}>Next milestone</div>
              <div className={styles.projectDate}>{PROJECT.dueLabel}</div>
              <div className={styles.body}>
                {PROJECT.daysLeft} days left in the current review window. The strongest signal right now is feedback latency, not scope creep.
              </div>
            </div>

            <div className={styles.projectRing} style={{ background: ringBackground }}>
              <div className={styles.projectRingInner}>
                <div>
                  <div className={styles.projectRingValue}>{PROJECT.progress}%</div>
                  <div className={styles.projectRingLabel}>Complete</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.projectMetrics}>
            <div className={styles.projectMetric}>
              <div className={styles.projectMetricValue}>{PROJECT.contractValue}</div>
              <div className={styles.projectMetricLabel}>Contract value</div>
              <div className={styles.projectMetricMeta}>Primary scope remains locked.</div>
            </div>

            <div className={styles.projectMetric}>
              <div className={styles.projectMetricValue}>{PROJECT.effectiveRate}</div>
              <div className={styles.projectMetricLabel}>Effective rate</div>
              <div className={styles.projectMetricMeta}>Tracking above target margin.</div>
            </div>

            <div className={styles.projectMetric}>
              <div className={styles.projectMetricValue} style={{ color: PROJECT.budgetBurn >= 80 ? "#c89360" : "var(--ink-900)" }}>
                {PROJECT.budgetBurn}%
              </div>
              <div className={styles.projectMetricLabel}>Budget burn</div>
              <div className={styles.projectMetricMeta}>{100 - PROJECT.budgetBurn}% runway remaining.</div>
            </div>
          </div>

          <div className={styles.projectProgress}>
            <div className={styles.rowBetween}>
              <div>
                <div className={styles.headingMd}>Milestone progression</div>
                <div className={styles.mutedCompact}>Brand system, landing page, proposal handoff, invoice prep.</div>
              </div>
              <Badge tone={PROJECT.daysLeft <= 3 ? "warning" : "success"}>
                {PROJECT.daysLeft <= 3 ? "Urgent window" : "Healthy pace"}
              </Badge>
            </div>

            <div className={styles.projectProgressTrack}>
              <div className={styles.projectProgressFill} style={{ width: `${PROJECT.progress}%` }} />
            </div>

            <div className={styles.projectProgressGrid}>
              {PROJECT_MILESTONES.map((milestone, index) => (
                <div
                  key={milestone.label}
                  className={styles.projectMilestone}
                  style={{ opacity: PROJECT.progress > index * 25 ? 1 : 0.55 }}
                >
                  <div className={styles.projectMilestoneTitle}>{milestone.label}</div>
                  <div className={styles.projectMilestoneMeta}>{milestone.meta}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.projectActions}>
            {PROJECT_ACTIONS.map((action) => (
              <div key={action.title} className={styles.projectAction}>
                <div>
                  <div className={styles.projectActionTitle}>{action.title}</div>
                  <div className={styles.projectActionMeta}>{action.meta}</div>
                </div>
                <Shortcut tone={action.tone}>{action.shortcut}</Shortcut>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function CommandSurfaceBlock({ block }: { block: RenderBlock }) {
  return (
    <div className={styles.surface} aria-label={block.label}>
      <aside className={styles.shortcutPanel}>
        <div className={styles.shortcutPanelStack}>
          <div className={styles.rowBetween}>
            <div>
              <div className={styles.brandMeta}>Shortcut</div>
              <div className={styles.headingLg}>Command surface</div>
            </div>
            <Badge tone="purple">Keyboard-first</Badge>
          </div>

          <div className={styles.shortcutSpotlight}>
            <div className={styles.projectKicker}>Most used</div>
            <div className={styles.shortcutSpotlightTitle}>Open the command palette instantly.</div>
            <div className={styles.shortcutSpotlightMeta}>
              The shortcut itself should feel premium — closer to a crafted instrument than a flat badge.
            </div>
            <div className={styles.shortcutSpotlightAction}>
              <Shortcut tone="ember" label="Run">⌘K</Shortcut>
            </div>
          </div>

          <div className={styles.shortcutRows}>
            {SHORTCUT_ROWS.map((row) => (
              <div key={row.title} className={styles.shortcutRow}>
                <div className={styles.shortcutRowCopy}>
                  <div className={styles.shortcutRowTitle}>{row.title}</div>
                  <div className={styles.shortcutRowMeta}>{row.meta}</div>
                </div>
                <Shortcut tone={row.tone}>{row.shortcut}</Shortcut>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
