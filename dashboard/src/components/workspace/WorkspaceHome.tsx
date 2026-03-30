"use client";

import { useState, useEffect, useRef } from "react";
import type { Workspace, Project } from "@/lib/types";
import { STATUS } from "@/lib/constants";
import { getDaysLeft as daysLeft, formatDueShort as formatDue, getDueLabel as getDueLabelFromDate, getDueColor as getDueColorFromDate } from "@/lib/due-dates";
import styles from "./WorkspaceHome.module.css";

interface WorkspaceHomeProps {
  workspace: Workspace;
  onSelectProject: (project: Project, client: string) => void;
  onNewTab: () => void;
  onUpdateProjectDue?: (projectId: string, due: string | null) => void;
  onRenameWorkspace?: (wsId: string, name: string) => void;
}

const ACTIVITY = [
  { id: 1, type: "payment", text: "Payment received — $2,400", detail: "Invoice #047 · Brand Guidelines deposit", time: "11:30am", icon: "$", color: "#5a9a3c" },
  { id: 2, type: "view", text: "Sarah opened Invoice #047", detail: "2nd view · 1m 45s", time: "11:15am", icon: "◎", color: "#7c8594" },
  { id: 3, type: "message", text: "Jamie: \"Got it, I'll set up the scale with Outfit variable\"", detail: "Brand Guidelines v2", time: "9:35am", icon: "→", color: "#5b7fa4" },
  { id: 4, type: "edit", text: "You edited Brand Guidelines v2", detail: "Typography section · 12 changes", time: "9:20am", icon: "✎", color: "#b07d4f" },
  { id: 5, type: "invoice", text: "Invoice #047 sent", detail: "$2,400 · Net 15 · Due Apr 13", time: "9:45am", icon: "◇", color: "#8a7e63" },
  { id: 6, type: "approval", text: "Sarah approved mood board direction", detail: "Brand Guidelines v2 · Milestone", time: "Yesterday", icon: "✓", color: "#5a9a3c" },
];

const MONTHS = [
  { m: "Oct", v: 3200 }, { m: "Nov", v: 2800 }, { m: "Dec", v: 4100 },
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 2400 },
];

const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: "#5a9a3c", bg: "rgba(90,154,60,0.06)", label: "Active" },
  review: { color: "#b07d4f", bg: "rgba(176,125,79,0.06)", label: "In Review" },
  completed: { color: "#7c8594", bg: "rgba(124,133,148,0.06)", label: "Done" },
  overdue: { color: "#c24b38", bg: "rgba(194,75,56,0.06)", label: "Overdue" },
  paused: { color: "#9b988f", bg: "rgba(155,152,143,0.06)", label: "Paused" },
};

export default function WorkspaceHome({ workspace, onSelectProject, onNewTab, onRenameWorkspace, onUpdateProjectDue }: WorkspaceHomeProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(workspace.client);

  const saveName = () => {
    const trimmed = nameValue.trim() || workspace.client;
    if (onRenameWorkspace && trimmed !== workspace.client) onRenameWorkspace(workspace.id, trimmed);
    setEditingName(false);
  };
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [notes, setNotes] = useState("");
  const animRef = useRef<number | null>(null);

  const activeProjects = workspace.projects.filter(p => p.status !== "completed");
  const completedProjects = workspace.projects.filter(p => p.status === "completed");
  const activeValue = activeProjects.reduce((s, p) => {
    const m = p.amount.match(/[\d,]+/);
    return s + (m ? parseInt(m[0].replace(",", "")) : 0);
  }, 0);
  const totalEarned = workspace.projects.reduce((s, p) => {
    const m = p.amount.match(/[\d,]+/);
    return s + (m ? parseInt(m[0].replace(",", "")) : 0);
  }, 0);
  const maxMonth = Math.max(...MONTHS.map(m => m.v), 1);

  const avgProgress = activeProjects.length > 0
    ? Math.round(activeProjects.reduce((s, p) => s + (p.progress || 0), 0) / activeProjects.length)
    : 0;

  const nextDeadline = activeProjects
    .filter(p => { const dl = daysLeft(p.due); return dl !== null && dl > 0; })
    .sort((a, b) => (daysLeft(a.due) ?? 999) - (daysLeft(b.due) ?? 999))[0];

  // Animate revenue counter
  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const target = totalEarned;
    const frame = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedRevenue(Math.round(eased * target));
      if (progress < 1) animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [totalEarned]);

  const upcoming = activeProjects
    .filter(p => daysLeft(p.due) !== null)
    .sort((a, b) => (daysLeft(a.due) ?? 999) - (daysLeft(b.due) ?? 999))
    .slice(0, 4)
    .map(p => ({ label: `${p.name} due`, date: formatDue(p.due), daysNum: daysLeft(p.due)!, color: STATUS[p.status]?.color || "#b07d4f" }));

  return (
    <div className={styles.root}>
      {/* Identity bar */}
      <div className={styles.identity}>
        <div className={styles.avatar} style={{ background: workspace.avatarBg }}>{workspace.avatar}</div>
        <div className={styles.info}>
          {editingName ? (
            <input
              className={styles.clientName}
              value={nameValue}
              autoFocus
              style={{ border: "none", borderBottom: "1px solid var(--ember)", outline: "none", background: "transparent", width: "100%" }}
              onChange={e => setNameValue(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setNameValue(workspace.client); setEditingName(false); } }}
            />
          ) : (
            <h1 className={styles.clientName} onDoubleClick={() => { setNameValue(workspace.client); setEditingName(true); }} style={{ cursor: "default" }}>{workspace.client}</h1>
          )}
          <div className={styles.clientMeta}>
            {workspace.contact && <><span>{workspace.contact}</span><span className={styles.metaDot} /></>}
            <span>{workspace.projects.length} projects</span>
            <span className={styles.metaDot} />
            {workspace.rate && <><span>{workspace.rate}</span><span className={styles.metaDot} /></>}
            <span>Since {workspace.lastActive || "—"}</span>
          </div>
        </div>
        <div className={styles.quickActions}>
          <button className={`${styles.qa} ${styles.qaPrimary}`} onClick={onNewTab}>
            <span className={styles.qaIcon}>◆</span>
            New note
            <span className={styles.qaShortcut}>⌘N</span>
          </button>
          <button className={styles.qa}>
            <span className={styles.qaIcon}>$</span>
            New invoice
            <span className={styles.qaShortcut}>⌘⇧I</span>
          </button>
          <button className={styles.qa}>
            <span className={styles.qaIcon}>→</span>
            Message
            <span className={styles.qaShortcut}>⌘M</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statValGreen}`}>${(animatedRevenue / 1000).toFixed(1)}k</div>
          <div className={styles.statLabel}>total value</div>
          <div className={styles.statSub}>{workspace.projects.length} projects</div>
          <div className={styles.statBars}>
            {MONTHS.map((m, i) => (
              <div key={i} className={styles.statBar} style={{
                height: `${Math.max(4, (m.v / maxMonth) * 100)}%`,
                background: i === MONTHS.length - 1 ? "var(--ember)" : m.v > 0 ? "#5a9a3c" : "var(--warm-200)",
                opacity: i === MONTHS.length - 1 ? 1 : 0.4,
              }} />
            ))}
          </div>
        </div>
        <div className={styles.stat}>
          <div className={`${styles.statVal} ${styles.statValEmber}`}>${(activeValue / 1000).toFixed(1)}k</div>
          <div className={styles.statLabel}>in progress</div>
          <div className={styles.statSub}>{activeProjects.length} active</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{avgProgress}%</div>
          <div className={styles.statLabel}>avg completion</div>
          <div className={styles.statSub}>across active work</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: nextDeadline && (daysLeft(nextDeadline.due) ?? 999) <= 5 ? "#c89360" : "var(--ink-800)" }}>
            {nextDeadline ? `${daysLeft(nextDeadline.due)}d` : "\u2014"}
          </div>
          <div className={styles.statLabel}>next deadline</div>
          <div className={styles.statSub}>{nextDeadline?.name || "—"}</div>
        </div>
      </div>

      {/* Content grid */}
      <div className={styles.grid}>
        {/* Main area */}
        <div className={styles.main}>
          <div className={styles.sectionLabel}>
            active projects
            <span className={styles.sectionCount}>{activeProjects.length}</span>
          </div>

          <div className={styles.projects}>
            {activeProjects.map(pj => {
              const st = STATUS_CFG[pj.status] || STATUS_CFG.active;
              const dueColor = getDueColorFromDate(pj.due);
              const dueText = getDueLabelFromDate(pj.due);

              return (
                <div
                  key={pj.id}
                  className={`${styles.pj} ${hoveredProject === pj.id ? styles.pjHovered : ""}`}
                  onMouseEnter={() => setHoveredProject(pj.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => onSelectProject(pj, workspace.client)}
                >
                  <div className={styles.pjAccent} style={{ background: st.color }} />
                  <div className={styles.pjIcon} style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}15` }}>
                    ◆
                  </div>
                  <div className={styles.pjInfo}>
                    <div className={styles.pjName}>{pj.name}</div>
                    <div className={styles.pjRow}>
                      <span className={styles.pjStatus} style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      <label className={styles.pjDue} style={{ color: dueColor, cursor: "pointer" }} onClick={e => e.stopPropagation()}>
                        {dueText}
                        <input type="date" value={pj.due || ""} onChange={e => onUpdateProjectDue?.(pj.id, e.target.value || null)} style={{ position: "absolute", opacity: 0, width: 0, height: 0, overflow: "hidden" }} />
                      </label>
                    </div>
                  </div>
                  <div className={styles.pjRight}>
                    <span className={styles.pjValue}>{pj.amount}</span>
                    <div className={styles.pjProgress}>
                      <div className={styles.pjProgressFill} style={{ width: `${pj.progress || 0}%`, background: st.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {completedProjects.length > 0 && (
            <>
              <div className={styles.sectionLabel}>
                completed
                <span className={styles.sectionCount}>{completedProjects.length}</span>
              </div>
              <div className={styles.completed}>
                {completedProjects.map(pj => (
                  <div key={pj.id} className={styles.compItem} style={{ cursor: "pointer" }} onClick={() => onSelectProject(pj, workspace.client)}>
                    <span className={styles.compCheck}>✓</span>
                    <span className={styles.compName}>{pj.name}</span>
                    <span className={styles.compVal}>{pj.amount}</span>
                    <span className={styles.compDate}>{formatDue(pj.due)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className={styles.sectionLabel}>workspace notes</div>
          <textarea
            className={styles.notesInput}
            placeholder="Quick notes about this client... meeting preferences, brand voice, quirks, anything useful..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Sidebar */}
        <div className={styles.side}>
          <div>
            <div className={styles.sectionLabel}>activity</div>
            <div className={styles.activity}>
              {ACTIVITY.map(act => (
                <div key={act.id} className={styles.act}>
                  <div className={styles.actIcon} style={{ background: act.color + "0a", color: act.color, border: `1px solid ${act.color}12` }}>{act.icon}</div>
                  <div className={styles.actBody}>
                    <div className={styles.actText}>{act.text}</div>
                    <div className={styles.actDetail}>{act.detail}</div>
                  </div>
                  <span className={styles.actTime}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {upcoming.length > 0 && (
            <div>
              <div className={styles.sectionLabel}>upcoming</div>
              <div className={styles.upcoming}>
                {upcoming.map((up, i) => (
                  <div key={i} className={styles.upItem}>
                    <div className={styles.upBar} style={{ background: up.color }} />
                    <div className={styles.upInfo}>
                      <div className={styles.upLabel}>{up.label}</div>
                      <div className={styles.upDate}>{up.date}</div>
                    </div>
                    <span className={styles.upDays} style={{ color: up.daysNum <= 7 ? up.color : "var(--ink-400)" }}>{up.daysNum}d</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className={styles.sectionLabel}>client details</div>
            <div className={styles.clientCard}>
              {workspace.contact && <div className={styles.ccRow}><span className={styles.ccLabel}>Contact</span><span className={styles.ccVal}>{workspace.contact}</span></div>}
              <div className={styles.ccRow}><span className={styles.ccLabel}>Projects</span><span className={styles.ccVal}>{workspace.projects.length}</span></div>
              {workspace.rate && <div className={styles.ccRow}><span className={styles.ccLabel}>Rate</span><span className={styles.ccVal}>{workspace.rate}</span></div>}
              <div className={styles.ccRow}><span className={styles.ccLabel}>Total value</span><span className={styles.ccVal} style={{ color: "#5a9a3c" }}>${totalEarned.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
