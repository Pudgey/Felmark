import React from "react";
import styles from "./WorkstationSidebar.module.css";

/* ── Props ── */
interface WorkstationSidebarProps {
  open: boolean;
  width: number;
  isResizing: boolean;
}

/* ── Utility: color tone mapping ── */
function tone(color: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    ember:   { bg: "rgba(176,125,79,0.08)",  text: "var(--ember)" },
    success: { bg: "rgba(95,148,114,0.08)",   text: "var(--success)" },
    info:    { bg: "rgba(127,136,191,0.08)",   text: "var(--info)" },
    danger:  { bg: "rgba(195,108,90,0.08)",    text: "var(--danger)" },
    warning: { bg: "rgba(200,147,96,0.08)",    text: "var(--warning)" },
    purple:  { bg: "rgba(124,107,158,0.08)",   text: "var(--purple)" },
    brown:   { bg: "rgba(138,126,99,0.08)",    text: "var(--brown)" },
    teal:    { bg: "rgba(111,159,158,0.08)",   text: "var(--teal)" },
    stone:   { bg: "rgba(155,166,184,0.08)",   text: "var(--stone)" },
  };
  return map[color] || map.ember;
}

/* ── Utility: split shortcut string into key array ── */
function splitShortcutKeys(str: string): string[] {
  return str.split("+").map((k) => k.trim());
}

/* ── Sub-components ── */

function Shortcut({ label, keys }: { label: string; keys: string }) {
  const parts = splitShortcutKeys(keys);
  return (
    <div className={styles.shortcut}>
      <span className={styles.shortcutLabel}>{label}</span>
      <span className={styles.shortcutKeys}>
        {parts.map((k, i) => (
          <kbd key={i} className={styles.kbd}>{k}</kbd>
        ))}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className={styles.sectionLabel}>{children}</div>;
}

function DocRow({
  icon,
  name,
  meta,
  badge,
  badgeColor,
  active,
}: {
  icon: string;
  name: string;
  meta?: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
}) {
  const t = tone(badgeColor || "ember");
  return (
    <div className={`${styles.docRow} ${active ? styles.docRowActive : ""}`}>
      <span className={styles.docIcon}>{icon}</span>
      <div className={styles.docInfo}>
        <div className={styles.docName}>{name}</div>
        {meta && <div className={styles.docMeta}>{meta}</div>}
      </div>
      {badge && (
        <span className={styles.docBadge} style={{ background: t.bg, color: t.text }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function ReviewRow({ color, name, meta }: { color: string; name: string; meta?: string }) {
  return (
    <div className={styles.reviewRow}>
      <span className={styles.reviewDot} style={{ background: color }} />
      <div className={styles.reviewInfo}>
        <div className={styles.reviewName}>{name}</div>
        {meta && <div className={styles.reviewMeta}>{meta}</div>}
      </div>
    </div>
  );
}

function SharedRow({
  initials,
  bgColor,
  name,
  meta,
}: {
  initials: string;
  bgColor: string;
  name: string;
  meta?: string;
}) {
  return (
    <div className={styles.sharedRow}>
      <span className={styles.sharedAvatar} style={{ background: bgColor }}>
        {initials}
      </span>
      <div className={styles.sharedInfo}>
        <div className={styles.sharedName}>{name}</div>
        {meta && <div className={styles.sharedMeta}>{meta}</div>}
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor: string;
}) {
  return (
    <div className={styles.signalRow}>
      <span className={styles.signalIcon}>{icon}</span>
      <div className={styles.signalInfo}>
        <span className={styles.signalLabel}>{label}</span>
      </div>
      <span className={styles.signalValue} style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  const t = tone(color || "ember");
  return (
    <span className={styles.badge} style={{ background: t.bg, color: t.text }}>
      {children}
    </span>
  );
}

function Avatar({
  initials,
  size = 28,
  radius = 6,
  bgColor,
}: {
  initials: string;
  size?: number;
  radius?: number;
  bgColor?: string;
}) {
  return (
    <span
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bgColor || "var(--ember)",
        fontSize: Math.round(size * 0.42),
      }}
    >
      {initials}
    </span>
  );
}

/* ── Main component ── */
export default function WorkstationSidebar({ open, width, isResizing }: WorkstationSidebarProps) {
  return (
    <aside
      className={`${styles.sidebar} ${!open ? styles.closed : ""} ${isResizing ? styles.resizing : ""}`}
      style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}
    >
      {/* Switcher head */}
      <div className={styles.switcherHead}>
        <span className={styles.switcherAvatar} style={{ background: "#b07d4f" }}>
          M
        </span>
        <div className={styles.switcherInfo}>
          <div className={styles.switcherName}>Meridian Studio</div>
          <div className={styles.switcherMeta}>
            <span>4 projects</span>
            <span style={{ color: "var(--warm-300)" }}>|</span>
            <span>$8.4k earned</span>
          </div>
        </div>
        <button className={styles.switcherChevron} title="Switch workstation">
          &#8645;
        </button>
      </div>

      {/* Scrollable inner */}
      <div className={styles.sidebarInner}>
        {/* Quick actions */}
        <div className={styles.quickActions}>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>+</span> New Doc
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>&#9201;</span> Log Time
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>$</span> Invoice
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>&#9993;</span> Message
          </button>
        </div>

        {/* Documents */}
        <SectionLabel>Documents</SectionLabel>
        <DocRow icon="&#128196;" name="Brand Guidelines v2" meta="Edited 2h ago" badge="Active" badgeColor="success" active />
        <DocRow icon="&#128196;" name="Q2 Proposal" meta="Edited 1d ago" badge="Draft" badgeColor="warning" />
        <DocRow icon="&#128196;" name="Meeting Notes — Mar 28" meta="Edited 3d ago" />
        <DocRow icon="&#128196;" name="Retainer Agreement" meta="Edited 1w ago" badge="Signed" badgeColor="info" />

        {/* Pending review */}
        <SectionLabel>Pending Review</SectionLabel>
        <ReviewRow color="var(--danger)" name="Logo revisions round 3" meta="Due tomorrow" />
        <ReviewRow color="var(--warning)" name="Social templates feedback" meta="Due Apr 5" />

        {/* Shared with me */}
        <SectionLabel>Shared With Me</SectionLabel>
        <SharedRow initials="JL" bgColor="var(--info)" name="Brand mood board" meta="From Jordan Lee" />
        <SharedRow initials="AK" bgColor="var(--teal)" name="Asset library link" meta="From Anika K." />

        {/* Signals */}
        <SectionLabel>Signals</SectionLabel>
        <SignalRow icon="&#128337;" label="Hours this week" value="12.5h" valueColor="var(--ink-700)" />
        <SignalRow icon="&#128176;" label="Budget remaining" value="$1,200" valueColor="var(--success)" />
        <SignalRow icon="&#128197;" label="Next deadline" value="Apr 3" valueColor="var(--danger)" />

        {/* Shortcuts */}
        <SectionLabel>Shortcuts</SectionLabel>
        <Shortcut label="New document" keys="&#8984;+N" />
        <Shortcut label="Search workspace" keys="&#8984;+K" />
        <Shortcut label="Toggle sidebar" keys="&#8984;+\\" />
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <span className={styles.bottomDot} style={{ background: "var(--success)" }} />
          <span>Last synced 2m ago</span>
        </div>
        <span>Pro plan</span>
      </div>
    </aside>
  );
}
