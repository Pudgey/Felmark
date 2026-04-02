"use client";

import React from "react";

/* ── Inline CSS — ported directly from prototype to guarantee visual parity ── */
const CSS = `
.fws2-sidebar {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 14px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--warm-300) transparent;
}
.fws2-sidebar::-webkit-scrollbar { width: 10px; }
.fws2-sidebar::-webkit-scrollbar-track { background: transparent; margin: 8px 0; }
.fws2-sidebar::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, transparent 3px, var(--warm-300) 3px, var(--warm-300) 7px, transparent 7px);
  border-radius: 0;
  min-height: 40px;
}
.fws2-sidebar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, transparent 3px, var(--warm-400) 3px, var(--warm-400) 7px, transparent 7px);
}
.fws2-sidebar::-webkit-scrollbar-thumb:active {
  background: linear-gradient(to right, transparent 3px, var(--ember) 3px, var(--ember) 7px, transparent 7px);
}
  border-right: 1px solid var(--warm-200);
  background:
    radial-gradient(circle at top left, rgba(255,255,255,0.78), transparent 30%),
    linear-gradient(180deg, rgba(247,246,243,0.98) 0%, rgba(244,242,238,0.96) 100%);
  height: 100%;
  flex-shrink: 0;
  width: clamp(520px, var(--sidebar-w, 520px), 720px);
  min-width: clamp(520px, var(--sidebar-w, 520px), 720px);
  transition: width 0.24s cubic-bezier(0.22,1,0.36,1), min-width 0.24s cubic-bezier(0.22,1,0.36,1), border-color 0.18s ease;
}
.fws2-sidebar.fws2-resizing { transition: none; }
.fws2-sidebar.fws2-closed { width: 0 !important; min-width: 0 !important; border-right-color: transparent; overflow: hidden; }

.fws2-sidebar::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(44,42,37,0.026) 0.8px, transparent 0.8px);
  background-size: 18px 18px;
  opacity: 0.24;
}

.fws2-sidebar-inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 14px;
}

.fws2-topbar,
.fws2-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fws2-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.fws2-brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  background: linear-gradient(180deg, var(--ink-900) 0%, var(--ink-800) 100%);
  color: var(--ember);
  display: grid;
  place-items: center;
  font-size: 16px;
  box-shadow: 0 14px 30px rgba(44,42,37,0.18);
  flex-shrink: 0;
}

.fws2-meta {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-400);
}

.fws2-title-sm {
  margin-top: 4px;
  font-family: var(--font-heading);
  font-size: 28px;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--ink-900);
}

.fws2-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid var(--warm-200);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,238,233,0.9) 100%);
  color: var(--ink-500);
  display: grid;
  place-items: center;
  box-shadow: 0 1px 0 rgba(255,255,255,0.92) inset;
}

.fws2-switcher {
  position: relative;
  overflow: hidden;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid rgba(176,125,79,0.14);
  background:
    radial-gradient(circle at top left, rgba(176,125,79,0.08), transparent 32%),
    radial-gradient(circle at bottom right, rgba(127,136,191,0.06), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,246,243,0.94) 100%);
  box-shadow: 0 18px 40px rgba(44,42,37,0.06), 0 1px 0 rgba(255,255,255,0.94) inset;
}

.fws2-switcher::before,
.fws2-hero::before,
.fws2-terminal::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.38), transparent 28%);
}

.fws2-switcher-inner,
.fws2-hero-inner,
.fws2-terminal-inner {
  position: relative;
  z-index: 1;
}

.fws2-switcher-head {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.fws2-chevron {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--warm-200);
  background: rgba(255,255,255,0.82);
  color: var(--ink-500);
  display: grid;
  place-items: center;
  box-shadow: 0 1px 0 rgba(255,255,255,0.92) inset;
}

.fws2-avatar {
  width: var(--avatar-size, 48px);
  height: var(--avatar-size, 48px);
  border-radius: var(--avatar-radius, 14px);
  display: grid;
  place-items: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 14px 28px rgba(44,42,37,0.14);
}

.fws2-avatar-dot {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid white;
  background: var(--success);
}

.fws2-switcher-name {
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: var(--ink-900);
}

.fws2-switcher-sub {
  margin-top: 5px;
  color: var(--ink-500);
  font-size: 13px;
  line-height: 1.56;
}

.fws2-chiprow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.fws2-chip,
.fws2-tab-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid var(--warm-200);
  background: rgba(255,255,255,0.82);
  color: var(--ink-600);
  font-size: 12px;
}

.fws2-tab-chip[data-active="true"] {
  border-color: rgba(176,125,79,0.16);
  background: rgba(176,125,79,0.08);
  color: var(--ink-800);
}

.fws2-tab-chip[data-split="true"] {
  border-color: rgba(127,136,191,0.14);
  background: rgba(127,136,191,0.06);
}

.fws2-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}

.fws2-hero {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border-color: rgba(127,136,191,0.14);
  background:
    radial-gradient(circle at top left, rgba(127,136,191,0.08), transparent 30%),
    radial-gradient(circle at bottom right, rgba(176,125,79,0.06), transparent 26%),
    linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,246,243,0.94) 100%);
  box-shadow: 0 18px 42px rgba(44,42,37,0.06), 0 1px 0 rgba(255,255,255,0.94) inset;
}

.fws2-hero-inner {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.fws2-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.fws2-hero-title {
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: var(--ink-900);
}

.fws2-hero-copy,
.fws2-item-meta,
.fws2-doc-meta,
.fws2-terminal-copy,
.fws2-signal-copy,
.fws2-file-copy {
  color: var(--ink-500);
  font-size: 13px;
  line-height: 1.56;
}

.fws2-context-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.fws2-mini {
  padding: 12px;
  border-radius: 18px;
  border: 1px solid rgba(229,226,219,0.92);
  background: rgba(255,255,255,0.82);
}

.fws2-mini-value {
  margin-top: 6px;
  font-family: var(--font-heading);
  font-size: 24px;
  line-height: 0.94;
  letter-spacing: -0.03em;
  color: var(--ink-900);
}

.fws2-mini-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-400);
}

.fws2-mini-sub {
  margin-top: 6px;
  color: var(--ink-500);
  font-size: 12px;
  line-height: 1.46;
}

.fws2-command {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 20px;
  border: 1px solid var(--warm-200);
  background: rgba(255,255,255,0.84);
  box-shadow: 0 1px 0 rgba(255,255,255,0.92) inset;
}

.fws2-command-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid var(--warm-200);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,238,233,0.9) 100%);
  color: var(--ink-500);
  display: grid;
  place-items: center;
  box-shadow: 0 1px 0 rgba(255,255,255,0.92) inset;
}

.fws2-command-copy {
  min-width: 0;
  flex: 1;
  color: var(--ink-500);
  font-size: 13px;
}

.fws2-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fws2-shortcut-key {
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 8px;
  border: 1px solid var(--warm-200);
  background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,238,233,0.9) 100%);
  color: var(--ink-500);
  display: grid;
  place-items: center;
  font-size: 10px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset;
}

.fws2-shortcut-plus {
  color: var(--ink-300);
  font-size: 10px;
}

.fws2-section {
  display: grid;
  gap: 10px;
}

.fws2-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-400);
}

.fws2-section-label::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--warm-200);
}

.fws2-doc-stack,
.fws2-signal-stack {
  display: grid;
  gap: 10px;
}

.fws2-doc-row,
.fws2-review-row,
.fws2-shared-row,
.fws2-signal-row {
  position: relative;
  overflow: hidden;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(229,226,219,0.92);
  background: rgba(255,255,255,0.84);
  box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset;
}

.fws2-doc-row::before,
.fws2-review-row::before {
  content: "";
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 999px;
  background: var(--rail, var(--warm-300));
}

.fws2-doc-row[data-active="true"] {
  border-color: rgba(176,125,79,0.14);
  background: linear-gradient(180deg, rgba(176,125,79,0.07) 0%, rgba(255,255,255,0.86) 100%);
}

.fws2-doc-head,
.fws2-review-head,
.fws2-file-head,
.fws2-signal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.fws2-doc-copy,
.fws2-review-copy,
.fws2-file-copy-wrap,
.fws2-signal-copy-wrap {
  min-width: 0;
  flex: 1;
}

.fws2-doc-label {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-400);
}

.fws2-doc-title,
.fws2-review-title,
.fws2-file-title,
.fws2-signal-title {
  color: var(--ink-900);
  font-size: 14px;
  font-weight: 500;
}

.fws2-doc-meta,
.fws2-item-meta,
.fws2-file-copy,
.fws2-signal-copy {
  margin-top: 5px;
}

.fws2-doc-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fws2-meta-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.fws2-count-pill,
.fws2-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid var(--warm-200);
  background: rgba(247,246,243,0.86);
  color: var(--ink-500);
}

.fws2-count-pill {
  font-family: var(--mono);
  font-size: 10px;
}

.fws2-pill {
  font-size: 11px;
  font-family: var(--mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.fws2-mini-track {
  width: 84px;
  height: 6px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(44,42,37,0.06);
}

.fws2-mini-track-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--rail, var(--ember)) 0%, rgba(255,255,255,0.16) 120%);
}

.fws2-review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.fws2-review-row {
  padding-left: 14px;
}

.fws2-review-row[data-urgent="true"] {
  border-color: rgba(195,108,90,0.14);
  background: linear-gradient(180deg, rgba(195,108,90,0.07) 0%, rgba(255,255,255,0.86) 100%);
}

.fws2-file-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.fws2-shared-row,
.fws2-signal-row {
  display: grid;
  gap: 8px;
}

.fws2-terminal {
  position: relative;
  overflow: hidden;
  margin-top: 2px;
  border-radius: 24px;
  border: 1px solid rgba(95,148,114,0.14);
  background:
    radial-gradient(circle at top left, rgba(95,148,114,0.08), transparent 28%),
    linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(247,246,243,0.94) 100%);
  box-shadow: 0 18px 42px rgba(44,42,37,0.06), 0 1px 0 rgba(255,255,255,0.94) inset;
}

.fws2-terminal-inner {
  display: grid;
  gap: 14px;
  padding: 16px;
}

.fws2-terminal-screen {
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(95,148,114,0.12);
  background: linear-gradient(180deg, rgba(38,41,38,0.98) 0%, rgba(28,30,29,0.98) 100%);
  color: rgba(235,240,234,0.86);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
}

.fws2-terminal-line {
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.8;
  color: rgba(235,240,234,0.82);
  word-break: break-word;
}

.fws2-terminal-line .path { color: #8ec5a0; }
.fws2-terminal-line .cmd { color: #e7c39a; }
.fws2-terminal-line .muted { color: rgba(235,240,234,0.42); }
.fws2-terminal-copy { color: var(--ink-500); }

.fws2-bottom {
  position: sticky;
  bottom: 0;
  margin: 4px -14px 0;
  padding: 10px 14px;
  border-top: 1px solid var(--warm-200);
  background: linear-gradient(180deg, rgba(247,246,243,0.82) 0%, rgba(244,242,238,0.96) 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fws2-bottom-copy {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: var(--ink-500);
  font-size: 12px;
}

.fws2-bottom-copy .mono {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
`;

/* ── Types ── */
interface WorkstationSidebarProps {
  open: boolean;
  width: number;
  isResizing: boolean;
}

/* ── Tone helper — exact port from prototype ── */
function tone(name: string) {
  const map: Record<string, { color: string; background: string; border: string }> = {
    neutral: { color: "var(--ink-500)", background: "var(--warm-50)", border: "var(--warm-200)" },
    ember: { color: "var(--ember)", background: "var(--ember-bg)", border: "rgba(176,125,79,0.12)" },
    success: { color: "var(--success)", background: "rgba(95,148,114,0.06)", border: "rgba(95,148,114,0.12)" },
    info: { color: "var(--info)", background: "rgba(127,136,191,0.06)", border: "rgba(127,136,191,0.12)" },
    warning: { color: "var(--warning)", background: "rgba(200,147,96,0.06)", border: "rgba(200,147,96,0.12)" },
    danger: { color: "var(--danger)", background: "rgba(195,108,90,0.06)", border: "rgba(195,108,90,0.12)" },
    purple: { color: "var(--purple)", background: "rgba(124,107,158,0.06)", border: "rgba(124,107,158,0.12)" },
    brown: { color: "var(--brown)", background: "rgba(138,126,99,0.06)", border: "rgba(138,126,99,0.12)" },
    teal: { color: "var(--teal)", background: "rgba(111,159,158,0.06)", border: "rgba(111,159,158,0.12)" },
    stone: { color: "var(--stone)", background: "rgba(155,166,184,0.06)", border: "rgba(155,166,184,0.12)" },
  };
  return map[name] || map.neutral;
}

/* ── Shortcut keys splitter — exact port ── */
function splitShortcutKeys(input: string): string[] {
  const raw = String(input ?? "").trim();
  if (!raw) return [];
  const specialKeys = new Set(["⌘", "⇧", "⌥", "⌃", "↵", "⎋", "↑", "↓", "←", "→", "⇥", "/"]);
  const output: string[] = [];
  let buffer = "";
  for (const char of raw) {
    if (char === " ") { if (buffer) { output.push(buffer.toUpperCase()); buffer = ""; } continue; }
    if (specialKeys.has(char)) { if (buffer) { output.push(buffer.toUpperCase()); buffer = ""; } output.push(char); continue; }
    if (/[A-Za-z0-9]/.test(char)) { buffer += char; continue; }
    if (buffer) { output.push(buffer.toUpperCase()); buffer = ""; }
    output.push(char);
  }
  if (buffer) output.push(buffer.toUpperCase());
  return output;
}

/* ── Sub-components — exact port from prototype ── */

function Badge({ toneName = "neutral", dot, children, style }: { toneName?: string; dot?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const token = tone(toneName);
  return (
    <span className="fws2-badge" style={{ color: token.color, background: token.background, borderColor: token.border, ...style }}>
      {dot ? <span className="fws2-dot" style={{ background: token.color }} /> : null}
      {children}
    </span>
  );
}

function Avatar({ initials = "MS", color = "var(--brown)", online = false, size = 48, radius = 14 }: { initials?: string; color?: string; online?: boolean; size?: number; radius?: number }) {
  return (
    <div className="fws2-avatar" style={{ background: color, "--avatar-size": `${size}px`, "--avatar-radius": `${radius}px` } as React.CSSProperties} aria-label={initials}>
      {initials}
      {online ? <span className="fws2-avatar-dot" /> : null}
    </div>
  );
}

function Shortcut({ keys = "⌘K" }: { keys?: string }) {
  const parts = splitShortcutKeys(keys);
  return (
    <span className="fws2-shortcut">
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          <span className="fws2-shortcut-key">{part}</span>
          {index < parts.length - 1 ? <span className="fws2-shortcut-plus">+</span> : null}
        </React.Fragment>
      ))}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="fws2-section-label"><span>{children}</span></div>;
}

function DocRow({ rail, title, meta, badge, toneName = "info", active = false, blocks, comments, split, progress }: { rail?: string; title: string; meta: string; badge: string; toneName?: string; active?: boolean; blocks: number; comments: number; split?: boolean; progress: number }) {
  const token = tone(toneName);
  return (
    <div className="fws2-doc-row" data-active={active ? "true" : "false"} style={{ "--rail": rail || token.color } as React.CSSProperties}>
      <div className="fws2-doc-head">
        <div className="fws2-doc-copy">
          <div className="fws2-doc-label">Document</div>
          <div className="fws2-doc-title" style={{ marginTop: 4 }}>{title}</div>
          <div className="fws2-doc-meta">{meta}</div>
        </div>
        <Badge toneName={toneName}>{badge}</Badge>
      </div>
      <div className="fws2-doc-footer">
        <div className="fws2-meta-cluster">
          <span className="fws2-count-pill">{blocks} blocks</span>
          <span className="fws2-count-pill">{comments} comments</span>
          {split ? <span className="fws2-count-pill">split</span> : null}
        </div>
        <div className="fws2-mini-track">
          <div className="fws2-mini-track-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ rail, type, title, meta, badge, toneName = "warning", urgent = false }: { rail?: string; type: string; title: string; meta: string; badge: string; toneName?: string; urgent?: boolean }) {
  const token = tone(toneName);
  return (
    <div className="fws2-review-row" data-urgent={urgent ? "true" : "false"} style={{ "--rail": rail || token.color } as React.CSSProperties}>
      <div className="fws2-review-head">
        <div className="fws2-review-copy">
          <div className="fws2-doc-label">{type}</div>
          <div className="fws2-review-title" style={{ marginTop: 4 }}>{title}</div>
          <div className="fws2-item-meta">{meta}</div>
        </div>
        <Badge toneName={toneName}>{badge}</Badge>
      </div>
    </div>
  );
}

function SharedRow({ title, meta, badge, toneName = "stone" }: { title: string; meta: string; badge: string; toneName?: string }) {
  return (
    <div className="fws2-shared-row">
      <div className="fws2-file-head">
        <div className="fws2-file-copy-wrap">
          <div className="fws2-file-title">{title}</div>
          <div className="fws2-file-copy">{meta}</div>
        </div>
        <Badge toneName={toneName}>{badge}</Badge>
      </div>
    </div>
  );
}

function SignalRow({ title, meta, badge, toneName = "info", dot = true }: { title: string; meta: string; badge: string; toneName?: string; dot?: boolean }) {
  return (
    <div className="fws2-signal-row">
      <div className="fws2-signal-head">
        <div className="fws2-signal-copy-wrap">
          <div className="fws2-signal-title">{title}</div>
          <div className="fws2-signal-copy">{meta}</div>
        </div>
        <Badge toneName={toneName} dot={dot}>{badge}</Badge>
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function WorkstationSidebar({ open, width, isResizing }: WorkstationSidebarProps) {
  const cls = `fws2-sidebar${!open ? " fws2-closed" : ""}${isResizing ? " fws2-resizing" : ""}`;

  return (
    <>
      <style>{CSS}</style>
      <aside className={cls} style={{ "--sidebar-w": `${width}px` } as React.CSSProperties}>
        <div className="fws2-sidebar-inner">
          <div className="fws2-topbar">
            <div className="fws2-brand">
              <div className="fws2-brand-mark">◆</div>
              <div>
                <div className="fws2-meta">Workstation v2</div>
                <div className="fws2-title-sm">Meridian Studio</div>
              </div>
            </div>
            <div className="fws2-topbar" style={{ gap: 8 }}>
              <div className="fws2-icon-btn">⌘</div>
              <div className="fws2-icon-btn">⋯</div>
            </div>
          </div>

          <div className="fws2-switcher">
            <div className="fws2-switcher-inner">
              <div className="fws2-switcher-head">
                <Avatar initials="MS" color="var(--brown)" online />
                <div>
                  <div className="fws2-meta">Current workstation</div>
                  <div className="fws2-switcher-name" style={{ marginTop: 4 }}>Meridian Studio</div>
                  <div className="fws2-switcher-sub">Client-scoped production environment with docs, review flows, shared assets, and terminal control.</div>
                </div>
                <div className="fws2-chevron">⌄</div>
              </div>
              <div className="fws2-chiprow" style={{ marginTop: 14 }}>
                <div className="fws2-chip"><span className="fws2-dot" style={{ background: "var(--success)" }} />5 open docs</div>
                <div className="fws2-chip"><span className="fws2-dot" style={{ background: "var(--info)" }} />split view on</div>
                <div className="fws2-chip"><span className="fws2-dot" style={{ background: "var(--teal)" }} />theme · sage</div>
              </div>
            </div>
          </div>

          <div className="fws2-hero">
            <div className="fws2-hero-inner">
              <div className="fws2-row-between">
                <div>
                  <div className="fws2-meta">Focus</div>
                  <div className="fws2-hero-title" style={{ marginTop: 4 }}>Brand Guidelines v2</div>
                </div>
                <Badge toneName="success" dot>Live draft</Badge>
              </div>
              <div className="fws2-hero-copy">The active workstation should feel like an instrument panel for real production: tabs, blocks, review state, shared assets, and commandable context.</div>
              <div className="fws2-chiprow">
                <div className="fws2-tab-chip" data-active="true"><span className="fws2-dot" style={{ background: "var(--ember)" }} />Brand Guidelines</div>
                <div className="fws2-tab-chip" data-split="true"><span className="fws2-dot" style={{ background: "var(--info)" }} />Website Copy</div>
                <div className="fws2-tab-chip"><span className="fws2-dot" style={{ background: "var(--purple)" }} />Scope &amp; Pricing</div>
              </div>
              <div className="fws2-context-grid">
                <div className="fws2-mini">
                  <div className="fws2-mini-label">Block power</div>
                  <div className="fws2-mini-value">55+</div>
                  <div className="fws2-mini-sub">Text, visual, collaboration, AI, and workstation-native decision blocks.</div>
                </div>
                <div className="fws2-mini">
                  <div className="fws2-mini-label">Review state</div>
                  <div className="fws2-mini-value">04</div>
                  <div className="fws2-mini-sub">Decision, poll, signoff, and scope boundary waiting on resolution.</div>
                </div>
                <div className="fws2-mini">
                  <div className="fws2-mini-label">Synced assets</div>
                  <div className="fws2-mini-value">09</div>
                  <div className="fws2-mini-sub">Shared folder references available to active documents and visual blocks.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="fws2-command">
            <div className="fws2-command-icon">⌕</div>
            <div className="fws2-command-copy">Jump to doc, block, asset, comment thread, or terminal command…</div>
            <Shortcut keys="⌘K" />
          </div>

          <div className="fws2-section">
            <SectionLabel>Open stack</SectionLabel>
            <div className="fws2-doc-stack">
              <DocRow rail="var(--ember)" active title="Brand Guidelines v2" meta="Current canvas · decision and poll blocks are active · 2 unresolved comments in the color system section." badge="Main draft" toneName="ember" blocks={55} comments={4} split progress={72} />
              <DocRow rail="var(--info)" title="Website Copy" meta="Open in split view · hero spotlight, pullquote, and stat-reveal blocks are in active revision." badge="Split" toneName="info" blocks={31} comments={2} split progress={48} />
              <DocRow rail="var(--purple)" title="Scope & Pricing" meta="pricing-config and scope-boundary blocks need one final client decision before signoff." badge="Review" toneName="purple" blocks={18} comments={1} progress={84} />
            </div>
          </div>

          <div className="fws2-section">
            <SectionLabel>Review queue</SectionLabel>
            <div className="fws2-review-grid">
              <ReviewRow rail="var(--purple)" type="Decision" title="Color system approval" meta="decision-picker is waiting on the final brand accent direction." badge="Needs reply" toneName="purple" />
              <ReviewRow rail="var(--warning)" type="Poll" title="Hero lockup options" meta="poll block has 2 client votes but still needs a final selection." badge="Open" toneName="warning" />
              <ReviewRow rail="var(--danger)" type="Scope" title="Boundary changed" meta="scope-boundary block was edited and should be acknowledged before handoff." badge="Urgent" toneName="danger" urgent />
              <ReviewRow rail="var(--teal)" type="Revision" title="Heatmap spike" meta="revision-heatmap shows the hero section taking the most churn this week." badge="Watch" toneName="teal" />
            </div>
          </div>

          <div className="fws2-section">
            <SectionLabel>Shared context</SectionLabel>
            <div className="fws2-file-grid">
              <SharedRow title="Shared folder sync" meta="6 new exports available across logo marks, social kit assets, and favicon variants." badge="Up to date" toneName="success" />
              <SharedRow title="Reference captures" meta="3 insight clips and 2 bookmark cards were pulled into the workstation this morning." badge="Ready" toneName="info" />
              <SharedRow title="Asset checklist" meta="1 missing preview image is blocking the final review bundle from packaging cleanly." badge="Missing" toneName="warning" />
              <SharedRow title="Handoff packet" meta="handoff block can now pull the export set, approvals, and dependency notes into one document." badge="Primed" toneName="ember" />
            </div>
          </div>

          <div className="fws2-section">
            <SectionLabel>Live signals</SectionLabel>
            <div className="fws2-signal-stack">
              <SignalRow title="Client viewed Brand Guidelines v2" meta="Meridian opened the current draft three minutes ago and paused on the color system decision block." badge="Fresh" toneName="info" />
              <SignalRow title="New annotation thread" meta="An inline annotation landed inside the hero spotlight block and now sits at the top of the review queue." badge="Action" toneName="ember" />
              <SignalRow title="AI action prepared" meta="The workstation has a ready ai-action suggestion for summarizing revisions into a client-safe note." badge="Ready" toneName="purple" />
            </div>
          </div>

          <div className="fws2-terminal">
            <div className="fws2-terminal-inner">
              <div className="fws2-row-between">
                <div>
                  <div className="fws2-meta">Terminal</div>
                  <div className="fws2-hero-title" style={{ marginTop: 4, fontSize: 22 }}>Command rail</div>
                </div>
                <Badge toneName="success" dot>Session ready</Badge>
              </div>
              <div className="fws2-terminal-copy">Terminal belongs in the workstation because the user controls the workflow, the surface, and the next move.</div>
              <div className="fws2-terminal-screen">
                <div className="fws2-terminal-line"><span className="path">meridian/brand-guidelines</span> <span className="muted">›</span> <span className="cmd">/jump scope-boundary</span></div>
                <div className="fws2-terminal-line"><span className="muted">→ opened block · section 04 · comments attached</span></div>
                <div className="fws2-terminal-line"><span className="path">meridian/brand-guidelines</span> <span className="muted">›</span> <span className="cmd">/insert signoff</span></div>
              </div>
              <div className="fws2-chiprow">
                <span className="fws2-pill">/jump</span>
                <span className="fws2-pill">/insert</span>
                <span className="fws2-pill">/sync assets</span>
                <span className="fws2-pill">/summarize review</span>
              </div>
            </div>
          </div>

          <div className="fws2-bottom">
            <div className="fws2-bottom-copy">
              <span className="mono">5 docs open</span>
              <span>•</span>
              <span>4 review items waiting</span>
              <span>•</span>
              <span>9 synced assets</span>
            </div>
            <div className="fws2-bottom-copy">
              <span className="fws2-dot" style={{ background: "var(--success)" }} />
              <span>saved just now</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
