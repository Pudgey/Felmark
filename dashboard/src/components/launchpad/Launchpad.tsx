"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Workstation } from "@/lib/types";
import styles from "./Launchpad.module.css";

// ── Data ──

interface Screen {
  id: string;
  name: string;
  icon: string;
  shortcut: string;
  desc: string;
  section: "core" | "tools";
  pro?: boolean;
}

interface RecentItem {
  id: string;
  name: string;
  workstation: string;
  type: string;
  icon: string;
  color: string;
  time: string;
  progress: number | null;
  status?: string;
}

interface PinnedItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
}

const SCREENS: Screen[] = [
  { id: "home", name: "Dashboard", icon: "⊞", shortcut: "⌘1", desc: "Overview & stats", section: "core" },
  { id: "pipeline", name: "Pipeline", icon: "◆", shortcut: "⌘2", desc: "Deals & opportunities", section: "core" },
  { id: "calendar", name: "Calendar", icon: "◇", shortcut: "⌘3", desc: "Schedule & events", section: "core" },
  { id: "services", name: "Services", icon: "$", shortcut: "⌘4", desc: "Your offerings", section: "core" },
  { id: "templates", name: "Templates", icon: "§", shortcut: "⌘5", desc: "Contracts & proposals", section: "core" },
  { id: "wire", name: "The Wire", icon: "↗", shortcut: "⌘6", desc: "Industry signals", section: "core", pro: true },
  { id: "search", name: "Search", icon: "◎", shortcut: "⌘/", desc: "Find anything", section: "tools" },
  { id: "command", name: "Command Palette", icon: "❯", shortcut: "⌘K", desc: "Quick actions", section: "tools" },
  { id: "settings", name: "Settings", icon: "⚙", shortcut: "⌘,", desc: "Preferences", section: "tools" },
];

const RECENTS: RecentItem[] = [
  { id: "r1", name: "Brand Guidelines v2", workstation: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "2m ago", progress: 65 },
  { id: "r2", name: "Course Landing Page Proposal", workstation: "Nora Kim", type: "proposal", icon: "◆", color: "#a08472", time: "1h ago", progress: null },
  { id: "r3", name: "Invoice #047", workstation: "Meridian Studio", type: "invoice", icon: "$", color: "#7c8594", time: "3h ago", progress: null, status: "sent" },
  { id: "r4", name: "App Onboarding UX", workstation: "Bolt Fitness", type: "doc", icon: "☰", color: "#8a7e63", time: "Yesterday", progress: 70 },
  { id: "r5", name: "Typography Scale v3", workstation: "Meridian Studio", type: "doc", icon: "☰", color: "#7c8594", time: "Yesterday", progress: 45 },
];

const PINNED: PinnedItem[] = [
  { id: "p1", name: "Freelance Service Agreement", type: "template", icon: "§", color: "#b07d4f" },
  { id: "p2", name: "Rate Calculator", type: "tool", icon: "⊗", color: "#5a9a3c" },
  { id: "p3", name: "Brand Identity — Pricing", type: "service", icon: "$", color: "#b07d4f" },
];

const TYPE_CFG: Record<string, { label: string; tagColor: string }> = {
  doc: { label: "Document", tagColor: "var(--ink-400)" },
  proposal: { label: "Proposal", tagColor: "#b07d4f" },
  invoice: { label: "Invoice", tagColor: "#5a9a3c" },
  template: { label: "Template", tagColor: "#7c6b9e" },
  tool: { label: "Tool", tagColor: "#5b7fa4" },
  service: { label: "Service", tagColor: "#b07d4f" },
};

// ── Component ──

interface LaunchpadProps {
  open: boolean;
  onClose: () => void;
  workstations: Workstation[];
  onNavigate: (screenId: string) => void;
  onSelectWorkstation: (wsId: string) => void;
  onOpenCommandPalette: () => void;
}

export default function Launchpad({ open, onClose, workstations, onNavigate, onSelectWorkstation, onOpenCommandPalette }: LaunchpadProps) {
  const [search, setSearch] = useState("");
  const [hoveredScreen, setHoveredScreen] = useState<string | null>(null);
  const [hoveredRecent, setHoveredRecent] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setSearch("");
        inputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (search) setSearch("");
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, search, onClose]);

  const filteredScreens = useMemo(() =>
    search
      ? SCREENS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
      : SCREENS,
    [search]
  );

  const filteredRecents = useMemo(() =>
    search
      ? RECENTS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.workstation.toLowerCase().includes(search.toLowerCase()))
      : RECENTS,
    [search]
  );

  const coreScreens = filteredScreens.filter(s => s.section === "core");
  const toolScreens = filteredScreens.filter(s => s.section === "tools");

  const handleScreenClick = (id: string) => {
    if (id === "command") {
      onClose();
      onOpenCommandPalette();
    } else {
      onNavigate(id);
      onClose();
    }
  };

  const handleWsClick = (wsId: string) => {
    onSelectWorkstation(wsId);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <div className={`${styles.searchRow} ${search ? styles.searchRowFocused : ""}`}>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
            </span>
            <input
              ref={inputRef}
              className={styles.searchInput}
              placeholder="Jump to anything..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className={styles.kbd}>esc</span>
          </div>
        </div>

        <div className={styles.body}>
          {/* Screens */}
          {coreScreens.length > 0 && (
            <>
              <div className={styles.sec}>screens</div>
              <div className={styles.tiles}>
                {coreScreens.map(s => (
                  <div
                    key={s.id}
                    className={`${styles.tile} ${hoveredScreen === s.id ? styles.tileHovered : ""}`}
                    onMouseEnter={() => setHoveredScreen(s.id)}
                    onMouseLeave={() => setHoveredScreen(null)}
                    onClick={() => handleScreenClick(s.id)}
                  >
                    <div className={styles.tileIcon}>{s.icon}</div>
                    <div className={styles.tileInfo}>
                      <div className={styles.tileName}>
                        {s.name}
                        {s.pro && <span className={styles.tilePro}>PRO</span>}
                      </div>
                      <div className={styles.tileDesc}>{s.desc}</div>
                    </div>
                    <span className={styles.tileShortcut}>{s.shortcut}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Tools */}
          {toolScreens.length > 0 && (
            <>
              <div className={styles.sec}>tools</div>
              <div className={styles.tools}>
                {toolScreens.map(s => (
                  <div key={s.id} className={styles.tool} onClick={() => handleScreenClick(s.id)}>
                    <span className={styles.toolIcon}>{s.icon}</span>
                    <span className={styles.toolName}>{s.name}</span>
                    <span className={styles.toolKey}>{s.shortcut}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Workspaces */}
          {!search && (
            <>
              <div className={styles.sec}>workstations</div>
              <div className={styles.wsRow}>
                {workstations.slice(0, 5).map(ws => (
                  <div key={ws.id} className={styles.ws} onClick={() => handleWsClick(ws.id)}>
                    <div className={styles.wsAv} style={{ background: ws.avatarBg }}>
                      {ws.avatar}
                    </div>
                    <span className={styles.wsName}>{ws.client}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recents */}
          {filteredRecents.length > 0 && (
            <>
              <div className={styles.sec}>recent</div>
              <div className={styles.recents}>
                {filteredRecents.map(r => {
                  const tc = TYPE_CFG[r.type] || TYPE_CFG.doc;
                  return (
                    <div
                      key={r.id}
                      className={`${styles.recent} ${hoveredRecent === r.id ? styles.recentHovered : ""}`}
                      onMouseEnter={() => setHoveredRecent(r.id)}
                      onMouseLeave={() => setHoveredRecent(null)}
                    >
                      <div className={styles.recentIcon} style={{ background: r.color + "0a", color: r.color, border: `1px solid ${r.color}15` }}>{r.icon}</div>
                      <div className={styles.recentInfo}>
                        <div className={styles.recentName}>{r.name}</div>
                        <div className={styles.recentMeta}>
                          <span className={styles.recentType} style={{ color: tc.tagColor, background: tc.tagColor + "08" }}>{tc.label}</span>
                          <span>{r.workstation}</span>
                        </div>
                      </div>
                      <div className={styles.recentRight}>
                        {r.progress !== null && (
                          <div className={styles.recentProgress}>
                            <div className={styles.recentProgressFill} style={{ width: `${r.progress}%`, background: r.progress >= 60 ? "#5a9a3c" : "#b07d4f" }} />
                          </div>
                        )}
                        {r.status && <span className={styles.recentStatus}>{r.status}</span>}
                        <span className={styles.recentTime}>{r.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pinned */}
          {!search && (
            <>
              <div className={styles.sec}>pinned</div>
              <div className={styles.pinned}>
                {PINNED.map(p => {
                  const tc = TYPE_CFG[p.type] || TYPE_CFG.doc;
                  return (
                    <div key={p.id} className={styles.pin}>
                      <span className={styles.pinIcon} style={{ color: p.color }}>{p.icon}</span>
                      <div className={styles.pinInfo}>
                        <div className={styles.pinName}>{p.name}</div>
                        <div className={styles.pinType}>{tc.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 8v12l10 6 10-6V8L14 2z" stroke="var(--ember)" strokeWidth="1.5" /></svg>
            Felmark
          </div>
          <div className={styles.footerRight}>
            <span className={styles.footerHint}><span className={styles.kbd}>↑↓</span> navigate</span>
            <span className={styles.footerHint}><span className={styles.kbd}>⏎</span> open</span>
            <span className={styles.footerHint}><span className={styles.kbd}>esc</span> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
