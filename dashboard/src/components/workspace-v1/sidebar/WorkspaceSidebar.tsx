"use client";

import { useState } from "react";
import styles from "./WorkspaceSidebar.module.css";

/* ═══════════════════════════════════════════
   FELMARK — WORKSPACE SIDEBAR
   Client navigation with sparklines, health rings, project tracking
   ═══════════════════════════════════════════ */

/* ── Types ── */

interface Project {
  id: string;
  name: string;
  status: "active" | "complete" | "pending" | "overdue";
  pct: number;
}

interface Client {
  id: string;
  name: string;
  av: string;
  color: string;
  status: "active" | "overdue" | "lead" | "complete" | "pending";
  contact: string;
  role: string;
  earned: number;
  owed: number;
  health: number;
  unread: number;
  sparkline: number[];
  projects: Project[];
  lastActive: string;
  tags: string[];
}

/* ── Demo data ── */

const CLIENTS: Client[] = [
  {
    id: "meridian", name: "Meridian Studio", av: "M", color: "#6a7b8a", status: "active",
    contact: "Sarah Chen", role: "Creative Director",
    earned: 12400, owed: 2400, health: 92, unread: 2,
    sparkline: [3200, 1800, 2400, 1200, 3800],
    projects: [
      { id: "p1", name: "Brand Guidelines v2", status: "active", pct: 65 },
      { id: "p2", name: "Social Templates", status: "complete", pct: 100 },
    ],
    lastActive: "2 min ago", tags: ["design", "branding"],
  },
  {
    id: "nora", name: "Nora Kim", av: "N", color: "#9a8472", status: "active",
    contact: "Nora Kim", role: "Life Coach",
    earned: 8200, owed: 3200, health: 88, unread: 0,
    sparkline: [2200, 0, 3200, 0, 2800],
    projects: [
      { id: "p3", name: "Course Landing Page", status: "active", pct: 25 },
      { id: "p4", name: "Email Sequence", status: "pending", pct: 0 },
    ],
    lastActive: "1 hour ago", tags: ["web", "copy"],
  },
  {
    id: "bolt", name: "Bolt Fitness", av: "B", color: "#8a7e5a", status: "overdue",
    contact: "Jake Torres", role: "Founder",
    earned: 6000, owed: 4000, health: 45, unread: 1,
    sparkline: [4000, 2000, 0, 0, 0],
    projects: [
      { id: "p5", name: "App Onboarding UX", status: "overdue", pct: 70 },
      { id: "p6", name: "Blog Content", status: "active", pct: 40 },
    ],
    lastActive: "3 days ago", tags: ["app", "content"],
  },
  {
    id: "luna", name: "Luna Boutique", av: "L", color: "#7a6a90", status: "lead",
    contact: "Maria Santos", role: "Owner",
    earned: 0, owed: 0, health: 0, unread: 1,
    sparkline: [0, 0, 0, 0, 0],
    projects: [],
    lastActive: "2 hours ago", tags: ["new"],
  },
];

/* ── Status helpers ── */

function sc(status: string): string {
  switch (status) {
    case "active": return "#6b9a6b";
    case "overdue": return "#c07a6a";
    case "lead": return "#8b8bba";
    case "complete": return "#6b9a6b";
    default: return "#9b988f";
  }
}

function sl(status: string): string {
  switch (status) {
    case "active": return "Active";
    case "overdue": return "Overdue";
    case "lead": return "New Lead";
    case "complete": return "Complete";
    case "pending": return "Pending";
    default: return status;
  }
}

/* ── MiniSparkline ── */

interface MiniSparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

function MiniSparkline({ data, color, width = 52, height = 18 }: MiniSparklineProps) {
  const max = Math.max(...data, 1);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * (height - 2) - 1}`)
    .join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polygon points={area} fill={color} opacity="0.06" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

/* ── HealthRing ── */

interface HealthRingProps {
  value: number;
  color: string;
  size?: number;
}

function HealthRing({ value, color, size = 28 }: HealthRingProps) {
  if (!value) {
    return (
      <div
        style={{
          width: size, height: size, borderRadius: "50%",
          border: "2px solid var(--border)", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontFamily: "var(--mono)", fontSize: 7, color: "var(--ink-300)",
        }}
      >
        —
      </div>
    );
  }
  const r = (size / 2) - 3;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.healthRing}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="2.5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={circ - (value / 100) * circ} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset .6s cubic-bezier(.16,1,.3,1)" }}
      />
      <text
        x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 8, fontWeight: 600, fill: color, fontFamily: "var(--mono)" }}
      >
        {value}
      </text>
    </svg>
  );
}

/* ═══ Sidebar Component ═══ */

export default function WorkspaceSidebar() {
  const [active, setActive] = useState("meridian");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["meridian"]));
  const [search, setSearch] = useState("");
  const [, setHovered] = useState<string | null>(null);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });

  const filtered = search
    ? CLIENTS.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.contact.toLowerCase().includes(search.toLowerCase()),
      )
    : CLIENTS;

  const totalEarned = CLIENTS.reduce((s, c) => s + c.earned, 0);
  const totalOwed = CLIENTS.reduce((s, c) => s + c.owed, 0);

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLogo}>
            <div className={styles.headerMark}>&#9670;</div>
            <span className={styles.headerName}>Clients</span>
          </div>
          <button className={styles.headerAdd}>+</button>
        </div>

        {/* Search */}
        <div className={styles.search}>
          <span className={styles.searchIcon}>&#8981;</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
          />
          <span className={styles.searchCount}>{filtered.length}</span>
        </div>

        {/* Summary */}
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryVal} style={{ color: "var(--sage)" }}>
              ${(totalEarned / 1000).toFixed(1)}k
            </div>
            <div className={styles.summaryLabel}>Earned</div>
          </div>
          <div className={styles.summaryItem}>
            <div
              className={styles.summaryVal}
              style={{ color: totalOwed > 0 ? "var(--rose)" : "var(--ink-300)" }}
            >
              ${(totalOwed / 1000).toFixed(1)}k
            </div>
            <div className={styles.summaryLabel}>Owed</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryVal} style={{ color: "var(--ink-800)" }}>
              {CLIENTS.length}
            </div>
            <div className={styles.summaryLabel}>Clients</div>
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className={styles.clientList}>
        {filtered.map((cl) => {
          const isActive = active === cl.id;
          const isExpanded = expanded.has(cl.id);
          const statusColor = sc(cl.status);
          const healthColor =
            cl.health >= 75 ? "var(--sage)" : cl.health >= 50 ? "var(--ember)" : cl.health > 0 ? "var(--rose)" : "var(--ink-300)";

          return (
            <div
              key={cl.id}
              className={`${styles.clientCard}${isActive ? ` ${styles.clientCardActive}` : ""}`}
              onMouseEnter={() => setHovered(cl.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { setActive(cl.id); toggleExpand(cl.id); }}
            >
              {/* Main row */}
              <div className={styles.clientMain}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar} style={{ background: cl.color }}>{cl.av}</div>
                  <div className={styles.statusDot} style={{ background: statusColor }} />
                  {cl.unread > 0 && <div className={styles.unreadBadge}>{cl.unread}</div>}
                </div>

                <div className={styles.clientInfo}>
                  <div className={styles.clientName}>{cl.name}</div>
                  <div className={styles.clientContact}>
                    <span>{cl.contact}</span>
                    <span
                      className={styles.statusLabel}
                      style={{
                        color: statusColor,
                        borderColor: statusColor + "18",
                        background: statusColor + "06",
                      }}
                    >
                      {sl(cl.status)}
                    </span>
                  </div>
                </div>

                <div className={styles.clientRight}>
                  <HealthRing value={cl.health} color={healthColor} size={28} />
                </div>
              </div>

              {/* Expanded detail */}
              <div className={`${styles.expandArea}${isExpanded ? ` ${styles.expandAreaOpen}` : ""}`}>
                <div className={styles.expandDetail}>
                  {/* Revenue stats */}
                  <div className={styles.statsRow}>
                    <div className={styles.stat}>
                      <div className={styles.statVal} style={{ color: "var(--sage)" }}>
                        ${(cl.earned / 1000).toFixed(1)}k
                      </div>
                      <div className={styles.statLabel}>Earned</div>
                    </div>
                    <div className={styles.stat}>
                      <div
                        className={styles.statVal}
                        style={{ color: cl.owed > 0 ? "var(--rose)" : "var(--ink-300)" }}
                      >
                        ${(cl.owed / 1000).toFixed(1)}k
                      </div>
                      <div className={styles.statLabel}>Owed</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statVal} style={{ color: "var(--ink-700)" }}>
                        {cl.projects.length}
                      </div>
                      <div className={styles.statLabel}>Projects</div>
                    </div>
                  </div>

                  {/* Sparkline */}
                  {cl.earned > 0 && (
                    <div className={styles.sparkRow}>
                      <span className={styles.sparkLabel}>5-month revenue</span>
                      <MiniSparkline data={cl.sparkline} color={cl.color} />
                    </div>
                  )}

                  {/* Projects */}
                  {cl.projects.length > 0 && (
                    <div className={styles.projects}>
                      <div className={styles.projectsTitle}>Projects</div>
                      {cl.projects.map((proj) => (
                        <div key={proj.id} className={styles.project} onClick={(e) => e.stopPropagation()}>
                          <div className={styles.projectDot} style={{ background: sc(proj.status) }} />
                          <div className={styles.projectInfo}>
                            <div className={styles.projectName}>{proj.name}</div>
                          </div>
                          <div className={styles.projectBar}>
                            <div className={styles.projectFill} style={{ width: `${proj.pct}%`, background: sc(proj.status) }} />
                          </div>
                          <span
                            className={styles.projectPct}
                            style={{ color: proj.pct === 100 ? "var(--sage)" : sc(proj.status) }}
                          >
                            {proj.pct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className={styles.tags}>
                    {cl.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                    <span className={`${styles.tag} ${styles.tagDashed}`}>{cl.lastActive}</span>
                  </div>

                  {/* Quick actions */}
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}>&#9993; Message</button>
                    <button className={styles.actionBtn}>$ Invoice</button>
                    <button className={`${styles.actionBtn} ${styles.actionPrimary}`}>Open &rarr;</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add client */}
        <button className={styles.addClient}>+ Add Client</button>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerStats}>
          <span>{CLIENTS.filter((c) => c.status === "active").length} active</span>
          <span>{CLIENTS.filter((c) => c.status === "lead").length} leads</span>
          <span>{CLIENTS.filter((c) => c.status === "overdue").length} overdue</span>
        </div>
        <div className={styles.footerBar}>
          {CLIENTS.map((cl) => (
            <div
              key={cl.id}
              className={styles.footerSeg}
              style={{
                width: `${Math.max((cl.earned / totalEarned) * 100, 8)}%`,
                background: cl.color,
                opacity: 0.4,
              }}
            />
          ))}
        </div>
        <div className={styles.footerLabel}>revenue distribution</div>
      </div>
    </div>
  );
}
