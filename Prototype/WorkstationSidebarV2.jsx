import React, { useMemo, useState } from "react";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap";

const CSS = `
.fws2-root {
  --parchment: #faf9f7;
  --warm-50: #f7f6f3;
  --warm-100: #f0eee9;
  --warm-200: #e5e2db;
  --warm-300: #d5d1c8;
  --warm-400: #b8b3a8;
  --ink-900: #2c2a25;
  --ink-800: #3d3a33;
  --ink-700: #4f4c44;
  --ink-600: #65625a;
  --ink-500: #7d7a72;
  --ink-400: #9b988f;
  --ink-300: #b5b2a9;
  --ember: #b07d4f;
  --ember-light: #c89360;
  --ember-bg: rgba(176,125,79,0.08);
  --success: #5f9472;
  --info: #7f88bf;
  --danger: #c36c5a;
  --warning: #c89360;
  --purple: #7c6b9e;
  --brown: #8a7e63;
  --teal: #6f9f9e;
  --stone: #9ba6b8;
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'Outfit', sans-serif;
  --mono: 'JetBrains Mono', monospace;

  min-height: 100vh;
  color: var(--ink-700);
  background:
    radial-gradient(circle at top left, rgba(176,125,79,0.06), transparent 26%),
    radial-gradient(circle at top right, rgba(127,136,191,0.05), transparent 24%),
    radial-gradient(circle at bottom left, rgba(111,159,158,0.04), transparent 22%),
    var(--parchment);
  font-family: var(--font-body);
}

/* ── Sidebar ── */
.fws2-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.78), transparent 70%),
    radial-gradient(circle at bottom right, rgba(176,125,79,0.04), transparent 50%),
    var(--warm-50);
  border-right: 1px solid var(--warm-200);
  position: relative;
}

.fws2-sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--warm-300) 0.5px, transparent 0.5px);
  background-size: 16px 16px;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}

.fws2-sidebar > * { position: relative; z-index: 1; }

.fws2-sidebar-inner {
  flex: 1;
  overflow-y: auto;
  padding: 0 14px 14px;
}

.fws2-sidebar-inner::-webkit-scrollbar { width: 3px; }
.fws2-sidebar-inner::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.06);
  border-radius: 99px;
}

/* Switcher head */
.fws2-switcher-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px 12px;
  flex-shrink: 0;
}

.fws2-switcher-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.fws2-switcher-info { flex: 1; min-width: 0; }

.fws2-switcher-name {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;
  color: var(--ink-900);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fws2-switcher-meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
  display: flex;
  align-items: center;
  gap: 6px;
}

.fws2-switcher-chevron {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-400);
  transition: all 0.08s;
}

.fws2-switcher-chevron:hover {
  background: var(--warm-200);
  color: var(--ink-600);
}

/* Quick actions */
.fws2-quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 0 0 12px;
}

.fws2-action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--warm-200);
  background: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.12s;
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--ink-600);
}

.fws2-action-btn:hover {
  background: #fff;
  border-color: var(--warm-300);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.fws2-action-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

/* Section labels */
.fws2-section-label {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--ink-400);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 12px 0 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.fws2-section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--warm-200);
}

/* Document rows */
.fws2-doc-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.06s;
}

.fws2-doc-row:hover { background: rgba(255,255,255,0.7); }
.fws2-doc-row-active { background: rgba(255,255,255,0.8); }

.fws2-doc-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--ink-400);
  flex-shrink: 0;
}

.fws2-doc-info { flex: 1; min-width: 0; }

.fws2-doc-name {
  font-size: 14px;
  color: var(--ink-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fws2-doc-meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
}

.fws2-doc-badge {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* Review rows */
.fws2-review-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.06s;
}

.fws2-review-row:hover { background: rgba(255,255,255,0.7); }

.fws2-review-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fws2-review-info { flex: 1; min-width: 0; }

.fws2-review-name {
  font-size: 14px;
  color: var(--ink-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fws2-review-meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
}

/* Shared rows */
.fws2-shared-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.06s;
}

.fws2-shared-row:hover { background: rgba(255,255,255,0.7); }

.fws2-shared-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.fws2-shared-info { flex: 1; min-width: 0; }

.fws2-shared-name {
  font-size: 14px;
  color: var(--ink-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fws2-shared-meta {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
}

/* Signal rows */
.fws2-signal-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  transition: background 0.06s;
}

.fws2-signal-row:hover { background: rgba(255,255,255,0.7); }

.fws2-signal-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.fws2-signal-info { flex: 1; min-width: 0; }

.fws2-signal-label {
  font-size: 13px;
  color: var(--ink-600);
}

.fws2-signal-value {
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
}

/* Shortcut pills */
.fws2-shortcut {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.06s;
}

.fws2-shortcut:hover { background: rgba(255,255,255,0.7); }

.fws2-shortcut-label {
  font-size: 13px;
  color: var(--ink-600);
  flex: 1;
}

.fws2-shortcut-keys {
  display: flex;
  align-items: center;
  gap: 2px;
}

.fws2-kbd {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
  background: var(--warm-100);
  border: 1px solid var(--warm-200);
  border-radius: 3px;
  padding: 0 4px;
  line-height: 18px;
  min-width: 18px;
  text-align: center;
}

/* Badge */
.fws2-badge {
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 500;
  padding: 1px 6px;
  border-radius: 4px;
}

/* Avatar */
.fws2-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

/* Bottom bar */
.fws2-bottom {
  padding: 10px 14px;
  border-top: 1px solid var(--warm-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ink-400);
  background: rgba(255,255,255,0.5);
  flex-shrink: 0;
}

.fws2-bottom-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fws2-bottom-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* ── Demo scaffolding (NOT for production) ── */
.fws2-shell {
  display: flex;
  height: 100vh;
}

.fws2-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.fws2-main-stub {
  max-width: 480px;
  text-align: center;
}

.fws2-main-copy {
  font-size: 15px;
  color: var(--ink-400);
  line-height: 1.6;
  margin-top: 12px;
}

.fws2-title-xl {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 700;
  color: var(--ink-900);
}

.fws2-kicker {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--ember);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 8px;
}
`;

/* ── Utility: color tone mapping ── */
function tone(color) {
  const map = {
    ember: { bg: "rgba(176,125,79,0.08)", text: "#b07d4f" },
    success: { bg: "rgba(95,148,114,0.08)", text: "#5f9472" },
    info: { bg: "rgba(127,136,191,0.08)", text: "#7f88bf" },
    danger: { bg: "rgba(195,108,90,0.08)", text: "#c36c5a" },
    warning: { bg: "rgba(200,147,96,0.08)", text: "#c89360" },
    purple: { bg: "rgba(124,107,158,0.08)", text: "#7c6b9e" },
    brown: { bg: "rgba(138,126,99,0.08)", text: "#8a7e63" },
    teal: { bg: "rgba(111,159,158,0.08)", text: "#6f9f9e" },
    stone: { bg: "rgba(155,166,184,0.08)", text: "#9ba6b8" },
  };
  return map[color] || map.ember;
}

/* ── Utility: split shortcut string into key array ── */
function splitShortcutKeys(str) {
  return str.split("+").map((k) => k.trim());
}

/* ── Sub-components ── */

function Shortcut({ label, keys }) {
  const parts = splitShortcutKeys(keys);
  return (
    <div className="fws2-shortcut">
      <span className="fws2-shortcut-label">{label}</span>
      <span className="fws2-shortcut-keys">
        {parts.map((k, i) => (
          <kbd key={i} className="fws2-kbd">{k}</kbd>
        ))}
      </span>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div className="fws2-section-label">{children}</div>;
}

function DocRow({ icon, name, meta, badge, badgeColor, active }) {
  const t = tone(badgeColor || "ember");
  return (
    <div className={`fws2-doc-row ${active ? "fws2-doc-row-active" : ""}`}>
      <span className="fws2-doc-icon">{icon}</span>
      <div className="fws2-doc-info">
        <div className="fws2-doc-name">{name}</div>
        {meta && <div className="fws2-doc-meta">{meta}</div>}
      </div>
      {badge && (
        <span className="fws2-doc-badge" style={{ background: t.bg, color: t.text }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function ReviewRow({ color, name, meta }) {
  return (
    <div className="fws2-review-row">
      <span className="fws2-review-dot" style={{ background: color }} />
      <div className="fws2-review-info">
        <div className="fws2-review-name">{name}</div>
        {meta && <div className="fws2-review-meta">{meta}</div>}
      </div>
    </div>
  );
}

function SharedRow({ initials, bgColor, name, meta }) {
  return (
    <div className="fws2-shared-row">
      <span className="fws2-shared-avatar" style={{ background: bgColor }}>
        {initials}
      </span>
      <div className="fws2-shared-info">
        <div className="fws2-shared-name">{name}</div>
        {meta && <div className="fws2-shared-meta">{meta}</div>}
      </div>
    </div>
  );
}

function SignalRow({ icon, label, value, valueColor }) {
  return (
    <div className="fws2-signal-row">
      <span className="fws2-signal-icon">{icon}</span>
      <div className="fws2-signal-info">
        <span className="fws2-signal-label">{label}</span>
      </div>
      <span className="fws2-signal-value" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function FelmarkSidebarV2Badge({ children, color }) {
  const t = tone(color || "ember");
  return (
    <span className="fws2-badge" style={{ background: t.bg, color: t.text }}>
      {children}
    </span>
  );
}

function FelmarkSidebarV2Avatar({ initials, size = 28, radius = 6, bgColor }) {
  return (
    <span
      className="fws2-avatar"
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

/* ── Main sidebar content ── */
export function FelmarkWorkstationSidebarV2() {
  return (
    <aside className="fws2-sidebar">
      {/* Switcher head */}
      <div className="fws2-switcher-head">
        <span className="fws2-switcher-avatar" style={{ background: "#b07d4f" }}>
          M
        </span>
        <div className="fws2-switcher-info">
          <div className="fws2-switcher-name">Meridian Studio</div>
          <div className="fws2-switcher-meta">
            <span>4 projects</span>
            <span style={{ color: "var(--warm-300)" }}>|</span>
            <span>$8.4k earned</span>
          </div>
        </div>
        <button className="fws2-switcher-chevron" title="Switch workstation">
          &#8645;
        </button>
      </div>

      {/* Scrollable inner */}
      <div className="fws2-sidebar-inner">
        {/* Quick actions */}
        <div className="fws2-quick-actions">
          <button className="fws2-action-btn">
            <span className="fws2-action-icon">+</span> New Doc
          </button>
          <button className="fws2-action-btn">
            <span className="fws2-action-icon">&#9201;</span> Log Time
          </button>
          <button className="fws2-action-btn">
            <span className="fws2-action-icon">$</span> Invoice
          </button>
          <button className="fws2-action-btn">
            <span className="fws2-action-icon">&#9993;</span> Message
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
      <div className="fws2-bottom">
        <div className="fws2-bottom-left">
          <span className="fws2-bottom-dot" style={{ background: "var(--success)" }} />
          <span>Last synced 2m ago</span>
        </div>
        <span>Pro plan</span>
      </div>
    </aside>
  );
}

/* ── Demo wrapper (not for production) ── */
export default function FelmarkWorkstationSidebarV2Demo() {
  return (
    <div className="fws2-root">
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{CSS}</style>
      <div className="fws2-shell">
        <div style={{ width: 396 }}>
          <FelmarkWorkstationSidebarV2 />
        </div>
        <div className="fws2-main">
          <div className="fws2-main-stub">
            <div className="fws2-kicker">Workstation Sidebar V2</div>
            <div className="fws2-title-xl">Command Center</div>
            <p className="fws2-main-copy">
              The workstation sidebar replaces the project tree when a workstation is active.
              It shows quick actions, documents, pending reviews, shared items, signals, and shortcuts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
