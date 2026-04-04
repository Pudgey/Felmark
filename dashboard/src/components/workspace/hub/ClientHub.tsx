"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ClientHub.module.css";

interface ClientHubProps {
  clientId: string;
  clientName: string;
  clientAvatar: string;
  clientColor: string;
  onClose: () => void;
}

interface Sub {
  t: string;
  d: boolean;
}
interface Comment {
  user: string;
  av: string;
  time: string;
  text: string;
  reactions?: string[];
}
interface Task {
  id: string;
  title: string;
  section: "todo" | "active" | "done";
  pri: "urgent" | "high" | "medium" | "low";
  due: string;
  overdue?: boolean;
  assignee: string;
  subs: Sub[];
  est: string;
  actual: string;
  timer?: boolean;
  pct: number;
  desc: string;
  tags: string[];
  comments: Comment[];
}

const INIT_TASKS: Task[] = [
  {
    id: "t1",
    title: "Client review & revisions",
    section: "todo",
    pri: "urgent",
    due: "Apr 1",
    overdue: true,
    assignee: "You",
    subs: [
      { t: "Address color feedback", d: false },
      { t: "Revise teal \u2192 warmer", d: false },
      { t: "CEO sign-off", d: false },
    ],
    est: "4h",
    actual: "1h 51m",
    pct: 0,
    desc: "Review all brand assets with Sarah. Address feedback on color temperature.",
    tags: ["revision"],
    comments: [
      {
        user: "Sarah Chen",
        av: "SC",
        time: "2h ago",
        text: "Can we shift the teal to something warmer? The current palette feels too clinical.",
        reactions: ["\ud83d\udc4d 1"],
      },
      {
        user: "You",
        av: "AX",
        time: "1h ago",
        text: "Noted \u2014 I'll explore a warmer direction. Will have options by tomorrow.",
      },
    ],
  },
  {
    id: "t2",
    title: "Color palette & typography",
    section: "active",
    pri: "high",
    due: "Apr 2",
    assignee: "You",
    subs: [
      { t: "Primary palette", d: true },
      { t: "Secondary & accents", d: false },
      { t: "Heading fonts", d: true },
      { t: "Body & mono fonts", d: false },
    ],
    est: "6h",
    actual: "3h 12m",
    timer: true,
    pct: 50,
    desc: "Define the complete color system and typography scale.",
    tags: ["design", "active"],
    comments: [
      {
        user: "You",
        av: "AX",
        time: "3h ago",
        text: "Started with 3 palette directions. Leaning toward option B.",
        reactions: ["\ud83d\udd25 1"],
      },
    ],
  },
  {
    id: "t3",
    title: "Brand guidelines document",
    section: "todo",
    pri: "medium",
    due: "Apr 5",
    assignee: "You",
    subs: [
      { t: "Cover & TOC", d: false },
      { t: "Logo usage rules", d: false },
      { t: "Color specifications", d: false },
      { t: "Typography guide", d: false },
      { t: "Photography direction", d: false },
      { t: "Social guidelines", d: false },
    ],
    est: "16h",
    actual: "0m",
    pct: 0,
    desc: "Master brand guidelines PDF. 30-40 pages covering all visual identity standards.",
    tags: ["deliverable"],
    comments: [],
  },
  {
    id: "t4",
    title: "Typography scale & pairings",
    section: "todo",
    pri: "medium",
    due: "Apr 5",
    assignee: "You",
    subs: [],
    est: "4h",
    actual: "0m",
    pct: 0,
    desc: "",
    tags: [],
    comments: [],
  },
  {
    id: "t5",
    title: "Imagery direction & moodboard",
    section: "todo",
    pri: "low",
    due: "Apr 7",
    assignee: "You",
    subs: [],
    est: "6h",
    actual: "0m",
    pct: 0,
    desc: "",
    tags: ["research"],
    comments: [],
  },
  {
    id: "t6",
    title: "Social media templates",
    section: "done",
    pri: "low",
    due: "Mar 20",
    assignee: "You",
    subs: [],
    est: "8h",
    actual: "7h 45m",
    pct: 100,
    desc: "12 post templates + 4 story templates for Instagram and LinkedIn.",
    tags: ["deliverable"],
    comments: [
      {
        user: "Sarah Chen",
        av: "SC",
        time: "Mar 22",
        text: "These look amazing! Team loves them. \u2728",
        reactions: ["\u2764\ufe0f 2"],
      },
    ],
  },
  {
    id: "t7",
    title: "Kickoff meeting notes",
    section: "done",
    pri: "low",
    due: "Mar 15",
    assignee: "You",
    subs: [],
    est: "1h",
    actual: "1h 10m",
    pct: 100,
    desc: "",
    tags: [],
    comments: [],
  },
];

const SECTIONS = [
  { id: "todo" as const, label: "To Do", icon: "\u25cb" },
  { id: "active" as const, label: "In Progress", icon: "\u25d0" },
  { id: "done" as const, label: "Done", icon: "\u25cf" },
];

const HUB_NAV = [
  { id: "inbox", icon: "◆", label: "Inbox", ct: 3, ctType: "blue" as const },
  { id: "assigned", icon: "◎", label: "Assigned to Me", ct: 2, ctType: "grey" as const },
  { id: "tasks", icon: "▶", label: "My Tasks" },
  { id: "overdue", icon: "!", label: "Overdue", ct: 1, ctType: "red" as const },
  { id: "more", icon: "⋯", label: "More" },
];

const CLIENTS = [
  {
    id: "ms",
    av: "MS",
    name: "Meridian Studio",
    color: "#7c8594",
    bg: "rgba(124,133,148,.08)",
    meta: "$2.4k owed · 2m",
    projects: [
      { id: "brand", name: "Brand Guidelines v2", ct: 5 },
      { id: "website", name: "Website Copy", ct: 3 },
      { id: "social", name: "Social Media Kit", done: true },
    ],
  },
  {
    id: "bf",
    av: "BF",
    name: "Bolt Fitness",
    color: "#c89360",
    bg: "rgba(200,147,96,.06)",
    meta: "$4k owed · 4d late",
    projects: [
      { id: "onboarding", name: "Onboarding UX", ct: 4 },
      { id: "blog", name: "Blog Content", ct: 2 },
    ],
  },
  {
    id: "nk",
    av: "NK",
    name: "Nora Kim",
    color: "#2962ff",
    bg: "rgba(41,98,255,.04)",
    meta: "$3.2k owed · 7d",
    projects: [{ id: "landing", name: "Landing Page", ct: 2 }],
  },
];

const SIGNALS = [
  { icon: "◎", label: "Invoice #044 viewed", time: "3m", color: "#ef5350" },
  { icon: "◎", label: "Contract signed", time: "18m", color: "#26a69a" },
];

const priColor = (p: string) =>
  p === "urgent" ? "#ef5350" : p === "high" ? "#ff9800" : p === "medium" ? "#2962ff" : "#a5a49f";
const priLabel = (p: string) => (p === "urgent" ? "Urgent" : p === "high" ? "High" : p === "medium" ? "Medium" : "Low");

export default function ClientHub({
  clientId: _clientId,
  clientName: _clientName,
  clientAvatar: _clientAvatar,
  clientColor: _clientColor,
  onClose: _onClose,
}: ClientHubProps) {
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [selected, setSelected] = useState<string | null>("t1");
  const [navItem, setNavItem] = useState("tasks");
  const [commentText, setCommentText] = useState("");
  const [channels, setChannels] = useState([
    { id: "list", label: "List", icon: "≡", fixed: true },
    { id: "board", label: "Board", icon: "▦" },
    { id: "timeline", label: "Timeline", icon: "—" },
  ]);
  const [activeChannel, setActiveChannel] = useState("list");
  const [channelMenuOpen, setChannelMenuOpen] = useState(false);

  const CHANNEL_OPTIONS = [
    { id: "calendar", label: "Calendar", icon: "◫" },
    { id: "gantt", label: "Gantt", icon: "▬" },
    { id: "table", label: "Table", icon: "⊞" },
    { id: "docs", label: "Docs", icon: "◇" },
    { id: "chat", label: "Chat", icon: "◆" },
    { id: "dashboard", label: "Dashboard", icon: "◎" },
  ];

  const addChannel = (id: string) => {
    const opt = CHANNEL_OPTIONS.find((o) => o.id === id);
    if (opt && !channels.find((c) => c.id === id)) {
      setChannels((prev) => [...prev, { id: opt.id, label: opt.label, icon: opt.icon }]);
      setActiveChannel(id);
    }
    setChannelMenuOpen(false);
  };

  const removeChannel = (id: string) => {
    setChannels((prev) => prev.filter((c) => c.id !== id));
    if (activeChannel === id) setActiveChannel("list");
  };
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [dwTab, setDwTab] = useState<"detail" | "comments">("detail");
  const [timer, setTimer] = useState(4934);
  const hubRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [avatarFilter, setAvatarFilter] = useState<string | null>(null);
  const [stripSearch, setStripSearch] = useState(false);
  const [stripSearchVal, setStripSearchVal] = useState("");
  const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({ ms: true });
  const [selProject, setSelProject] = useState("brand");

  const toggleClient = (id: string) => setExpandedClients((prev) => ({ ...prev, [id]: !prev[id] }));

  const collaborators = [
    { id: "ax", initials: "AX", name: "You", color: "#26a69a", bg: "rgba(38,166,154,.06)" },
    { id: "sc", initials: "SC", name: "Sarah Chen", color: "#7c8594", bg: "rgba(124,133,148,.08)" },
    { id: "jm", initials: "JM", name: "Jake Morris", color: "#c89360", bg: "rgba(200,147,96,.08)" },
  ];

  useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const toggleSection = (id: string) =>
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const fmt = (s: number) =>
    `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const task = selected ? (tasks.find((t) => t.id === selected) ?? null) : null;

  const handleDrop = (targetSection: Task["section"]) => {
    if (!dragId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === dragId
          ? {
              ...t,
              section: targetSection,
              overdue: targetSection !== "todo" ? false : t.overdue,
              pct: targetSection === "done" ? 100 : t.pct,
            }
          : t,
      ),
    );
    setDragId(null);
  };
  const [dragId, setDragId] = useState<string | null>(null);

  return (
    <div className={styles.hub} ref={hubRef}>
      <div className={styles.layout}>
        {/* Hub sidebar */}
        <div className={styles.nav}>
          <div className={styles.navHd}>
            <span className={styles.navHdTitle}>Hub</span>
            <div className={styles.navHdTool}>⌕</div>
            <div className={styles.navHdTool}>≡</div>
            <div className={styles.navHdTool}>«</div>
            <button className={styles.navHdCreate}>+ Create</button>
          </div>
          <div className={styles.navScroll}>
            {/* Nav items */}
            <div className={styles.navItems}>
              {HUB_NAV.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.navItem} ${navItem === n.id ? styles.navItemOn : ""}`}
                  onClick={() => setNavItem(n.id)}
                >
                  <span className={styles.navItemIcon}>{n.icon}</span>
                  <span className={styles.navItemLabel}>{n.label}</span>
                  {n.ct && (
                    <span className={`${styles.navItemCt} ${n.ctType ? styles[`navCt_${n.ctType}`] : ""}`}>{n.ct}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Favorites */}
            <div className={styles.navSec}>
              <div className={styles.navSecHd}>
                <span className={styles.navSecLabel}>Favorites</span>
              </div>
              <div className={styles.navItem} style={{ opacity: 0.4 }}>
                <span className={styles.navItemIcon}>☆</span>
                <span className={styles.navItemLabel}>Add to sidebar</span>
              </div>
            </div>

            {/* Clients */}
            <div className={styles.navSec}>
              <div className={styles.navSecHd}>
                <span className={styles.navSecLabel}>Clients</span>
                <div className={styles.navSecBtn}>+</div>
              </div>
              {CLIENTS.map((cl) => (
                <div key={cl.id}>
                  <div className={styles.navClient} onClick={() => toggleClient(cl.id)}>
                    <div className={styles.navClientAv} style={{ background: cl.bg, color: cl.color }}>
                      {cl.av}
                    </div>
                    <div className={styles.navClientInfo}>
                      <div className={styles.navClientName}>{cl.name}</div>
                      <div className={styles.navClientMeta}>{cl.meta}</div>
                    </div>
                    <div className={styles.navClientTools}>
                      <span className={styles.navClientTool}>⋯</span>
                      <span className={styles.navClientTool}>+</span>
                    </div>
                    <span
                      className={styles.navClientArrow}
                      style={{ transform: expandedClients[cl.id] ? "rotate(90deg)" : "rotate(0)" }}
                    >
                      ▸
                    </span>
                  </div>
                  {expandedClients[cl.id] &&
                    cl.projects.map((p) => (
                      <div
                        key={p.id}
                        className={`${styles.navProj} ${selProject === p.id ? styles.navProjOn : ""}`}
                        onClick={() => setSelProject(p.id)}
                      >
                        <span className={styles.navProjIcon}>{p.done ? "✓" : "⊡"}</span>
                        <span className={styles.navProjName}>{p.name}</span>
                        {p.ct && p.ct > 0 && <span className={styles.navProjCt}>{p.ct}</span>}
                      </div>
                    ))}
                </div>
              ))}
              <div className={styles.navItem} style={{ paddingLeft: 14, opacity: 0.3, fontSize: 12 }}>
                <span className={styles.navItemIcon} style={{ fontSize: 10 }}>
                  +
                </span>
                <span className={styles.navItemLabel} style={{ fontSize: 12 }}>
                  New Client
                </span>
              </div>
            </div>

            {/* Signals */}
            <div className={styles.navSec}>
              <div className={styles.navSecHd}>
                <span className={styles.navSecLabel}>Signals</span>
              </div>
              {SIGNALS.map((s, i) => (
                <div key={i} className={styles.navItem} style={{ padding: "4px 14px" }}>
                  <span className={styles.navItemIcon} style={{ color: s.color, fontSize: 10 }}>
                    {s.icon}
                  </span>
                  <span className={styles.navItemLabel} style={{ fontSize: 11 }}>
                    {s.label}
                  </span>
                  <span className={styles.navSignalTime}>{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navFt}>
            <button className={styles.navFtBtn}>$ Invoice</button>
            <button className={styles.navFtBtn}>▶ Timer</button>
          </div>
        </div>

        {/* Task list */}
        <div className={styles.list}>
          <div className={styles.listHd}>
            <div className={styles.listHdAv} style={{ background: "rgba(124,133,148,.08)", color: "#7c8594" }}>
              MS
            </div>
            <div className={styles.listHdInfo}>
              <div className={styles.listTitle}>Brand Guidelines v2</div>
              <div className={styles.listMeta}>Meridian Studio · $120/hr · 65% complete</div>
            </div>
            <div className={styles.listMetrics}>
              {[
                { val: "$8.4k", label: "Billed", color: "#26a69a" },
                { val: "$2.4k", label: "Owed", color: "#ff9800" },
                { val: "12.5h", label: "Logged", color: "#1a1918" },
                { val: "1", label: "Overdue", color: "#ef5350" },
              ].map((m, i) => (
                <div
                  key={i}
                  className={styles.listMetric}
                  style={i > 0 ? { borderLeft: "1px solid #f0f0ee" } : undefined}
                >
                  <div className={styles.listMetricVal} style={{ color: m.color }}>
                    {m.val}
                  </div>
                  <div className={styles.listMetricLabel}>{m.label}</div>
                </div>
              ))}
            </div>
            <button className={`${styles.listBtn} ${styles.listBtnPrimary}`}>+ Add task</button>
          </div>
          <div className={styles.viewTabs}>
            {channels.map((ch) => (
              <div
                key={ch.id}
                className={`${styles.viewTab} ${activeChannel === ch.id ? styles.viewTabOn : ""}`}
                onClick={() => setActiveChannel(ch.id)}
              >
                <span className={styles.viewTabIcon}>{ch.icon}</span>
                {ch.label}
                {!ch.fixed && (
                  <span
                    className={styles.viewTabClose}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChannel(ch.id);
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            ))}
            <div className={styles.viewTabAdd} onClick={() => setChannelMenuOpen(!channelMenuOpen)}>
              +
            </div>
            {channelMenuOpen && (
              <div className={styles.channelMenu}>
                {CHANNEL_OPTIONS.filter((o) => !channels.find((c) => c.id === o.id)).map((o) => (
                  <div key={o.id} className={styles.channelMenuItem} onClick={() => addChannel(o.id)}>
                    <span className={styles.channelMenuIcon}>{o.icon}</span>
                    {o.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Context strip */}
          <div className={styles.strip}>
            <div
              className={`${styles.stripPill} ${statusFilter ? styles.stripPillOn : ""}`}
              onClick={() => setStatusFilter(statusFilter ? null : "status")}
            >
              Status <span className={styles.stripChev}>▾</span>
            </div>
            <div
              className={`${styles.stripPill} ${priorityFilter ? styles.stripPillOn : ""}`}
              onClick={() => setPriorityFilter(priorityFilter ? null : "priority")}
            >
              Priority <span className={styles.stripChev}>▾</span>
            </div>
            <div className={styles.stripPill}>
              Group: <span className={styles.stripPillVal}>Status</span> <span className={styles.stripChev}>▾</span>
            </div>
            {(statusFilter || priorityFilter) && (
              <div
                className={styles.stripClear}
                onClick={() => {
                  setStatusFilter(null);
                  setPriorityFilter(null);
                }}
              >
                × Clear
              </div>
            )}

            <div className={styles.stripSpacer} />

            <div className={styles.stripCount}>
              <span className={styles.stripCountVal}>{tasks.length}</span> tasks
              <span className={styles.stripDot} />
              <span>{tasks.filter((t) => t.section === "done").length} done</span>
              <span className={styles.stripDot} />
              <span className={styles.stripCountRed}>{tasks.filter((t) => t.overdue).length} overdue</span>
            </div>

            <div className={styles.stripSep} />

            <div className={styles.stripAvatars}>
              {collaborators.map((a) => (
                <div
                  key={a.id}
                  className={`${styles.stripAv} ${avatarFilter === a.id ? styles.stripAvOn : ""}`}
                  style={{ background: a.bg, color: a.color }}
                  onClick={() => setAvatarFilter(avatarFilter === a.id ? null : a.id)}
                  title={a.name}
                >
                  {a.initials}
                </div>
              ))}
            </div>

            <div className={styles.stripSep} />

            <div
              className={`${styles.stripSearch} ${stripSearch ? styles.stripSearchOpen : ""}`}
              onClick={() => !stripSearch && setStripSearch(true)}
            >
              <span className={styles.stripSearchIcon}>⌕</span>
              {stripSearch && (
                <input
                  autoFocus
                  placeholder="Search tasks..."
                  value={stripSearchVal}
                  onChange={(e) => setStripSearchVal(e.target.value)}
                  onBlur={() => {
                    if (!stripSearchVal) setStripSearch(false);
                  }}
                />
              )}
            </div>
            <div className={styles.stripTool}>⚙</div>
          </div>
          {/* Column headers */}
          <div className={styles.colHd}>
            <div className={`${styles.colCell} ${styles.colName}`}>
              Name <span className={styles.colSort}>▾</span>
            </div>
            <div className={`${styles.colCell} ${styles.colAssignee}`}>
              Assignee <span className={styles.colSort}>▾</span>
            </div>
            <div className={`${styles.colCell} ${styles.colDue}`}>
              Due <span className={styles.colSort}>▾</span>
            </div>
            <div className={`${styles.colCell} ${styles.colPriority}`}>
              Priority <span className={styles.colSort}>▾</span>
            </div>
            <div className={`${styles.colCell} ${styles.colStatus}`}>
              Status <span className={styles.colSort}>▾</span>
            </div>
            <div className={`${styles.colCell} ${styles.colHours}`}>Hours</div>
            <div className={`${styles.colCell} ${styles.colCmt}`}>💬</div>
            <div className={styles.colAdd}>+</div>
          </div>

          <div className={styles.listScroll}>
            {SECTIONS.map((sec) => {
              const secTasks = tasks.filter((t) => t.section === sec.id);
              return (
                <div
                  key={sec.id}
                  className={styles.section}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(sec.id)}
                >
                  <div className={styles.sectionHd} onClick={() => toggleSection(sec.id)}>
                    <span
                      className={`${styles.sectionArrow} ${!collapsedSections.has(sec.id) ? styles.sectionArrowOpen : ""}`}
                    >
                      {"▸"}
                    </span>
                    <span className={styles.sectionIcon}>{sec.icon}</span>
                    <span className={styles.sectionLabel}>{sec.label}</span>
                    <span className={styles.sectionCount}>{secTasks.length}</span>
                  </div>
                  {!collapsedSections.has(sec.id) &&
                    secTasks.map((t) => {
                      const subsDone = t.subs.filter((s) => s.d).length;
                      const isDone = t.section === "done";
                      return (
                        <div
                          key={t.id}
                          draggable
                          className={`${styles.taskRow} ${t.overdue ? styles.taskRowOv : ""} ${selected === t.id ? styles.taskRowSelected : ""} ${dragId === t.id ? styles.taskRowDragging : ""} ${isDone ? styles.taskRowDone : ""}`}
                          onClick={() => {
                            setSelected(selected === t.id ? null : t.id);
                            setDwTab("detail");
                          }}
                          onDragStart={() => setDragId(t.id)}
                          onDragEnd={() => setDragId(null)}
                        >
                          {/* Name */}
                          <div className={`${styles.tc} ${styles.colName}`}>
                            <div className={styles.taskPri} style={{ background: priColor(t.pri) }} />
                            <div
                              className={`${styles.taskCheck} ${isDone ? styles.taskCheckDone : ""}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {isDone ? "✓" : ""}
                            </div>
                            <span className={styles.taskTitleText}>{t.title}</span>
                            {t.subs.length > 0 && (
                              <span className={styles.taskSubs}>
                                ☐ {subsDone}/{t.subs.length}
                              </span>
                            )}
                          </div>
                          {/* Assignee */}
                          <div className={`${styles.tc} ${styles.colAssignee}`}>
                            <div
                              className={styles.tcAv}
                              style={{ background: "rgba(38,166,154,.06)", color: "#26a69a" }}
                            >
                              AX
                            </div>
                            <span className={styles.tcAvName}>{t.assignee}</span>
                          </div>
                          {/* Due */}
                          <div className={`${styles.tc} ${styles.colDue}`}>
                            {t.timer ? (
                              <span className={styles.taskTimer}>● 1:22</span>
                            ) : (
                              <span className={`${styles.tcDue} ${t.overdue ? styles.tcDueOv : ""}`}>{t.due}</span>
                            )}
                          </div>
                          {/* Priority */}
                          <div className={`${styles.tc} ${styles.colPriority}`}>
                            <span
                              className={styles.tcPriPill}
                              style={{ background: priColor(t.pri) + "14", color: priColor(t.pri) }}
                            >
                              ⚑ {priLabel(t.pri)}
                            </span>
                          </div>
                          {/* Status */}
                          <div className={`${styles.tc} ${styles.colStatus}`}>
                            <span
                              className={styles.tcStatusPill}
                              style={{
                                background:
                                  (isDone
                                    ? "#26a69a"
                                    : t.overdue
                                      ? "#ef5350"
                                      : t.section === "active"
                                        ? "#ff9800"
                                        : "#a5a49f") + "14",
                                color: isDone
                                  ? "#26a69a"
                                  : t.overdue
                                    ? "#ef5350"
                                    : t.section === "active"
                                      ? "#ff9800"
                                      : "#a5a49f",
                              }}
                            >
                              <span
                                className={styles.tcStatusDot}
                                style={{
                                  background: isDone
                                    ? "#26a69a"
                                    : t.overdue
                                      ? "#ef5350"
                                      : t.section === "active"
                                        ? "#ff9800"
                                        : "#a5a49f",
                                }}
                              />
                              {t.overdue ? "Overdue" : isDone ? "Done" : t.section === "active" ? "Active" : "To Do"}
                            </span>
                          </div>
                          {/* Hours */}
                          <div className={`${styles.tc} ${styles.colHours}`}>
                            <span className={styles.tcHours}>
                              {t.actual}
                              <span className={styles.tcHoursSep}>/{t.est}</span>
                            </span>
                          </div>
                          {/* Comments */}
                          <div className={`${styles.tc} ${styles.colCmt}`}>
                            {t.comments.length > 0 && <span className={styles.tcCmt}>💬 {t.comments.length}</span>}
                          </div>
                        </div>
                      );
                    })}
                  {!collapsedSections.has(sec.id) && <div className={styles.addTask}>+ Add task...</div>}
                </div>
              );
            })}
            <div className={styles.newStatus}>+ New status</div>
          </div>
        </div>

        {/* Dim overlay */}
        <div
          className={`${styles.drawerDim} ${selected ? styles.drawerDimShow : ""}`}
          onClick={() => setSelected(null)}
        />

        {/* Slide-out drawer */}
        <div className={`${styles.drawerWrap} ${selected ? styles.drawerWrapOpen : ""}`}>
          {task && (
            <div className={styles.drawer}>
              <div className={styles.dwHd}>
                <div className={`${styles.dwCheck} ${task.section === "done" ? styles.dwCheckDone : ""}`}>
                  {task.section === "done" ? "✓" : ""}
                </div>
                <div className={styles.dwHdInfo}>
                  <div className={styles.dwId}>FLM-{task.id.replace("t", "")}</div>
                  <div className={styles.dwTitle}>{task.title}</div>
                </div>
                <div className={styles.dwActions}>
                  <button className={styles.dwAction}>{"📎"}</button>
                  <button className={styles.dwAction}>{"⤢"}</button>
                  <button className={styles.dwAction}>{"⋯"}</button>
                  <button className={styles.dwAction} onClick={() => setSelected(null)}>
                    {"✕"}
                  </button>
                </div>
              </div>

              {task.timer && (
                <div className={styles.dwTimer}>
                  <div className={styles.dwTimerDot} />
                  <span className={styles.dwTimerVal}>{fmt(timer)}</span>
                  <span className={styles.dwTimerMoney}>${Math.floor((timer / 3600) * 120)}/hr</span>
                  <button className={styles.dwTimerBtn}>{"■"} Stop</button>
                </div>
              )}

              <div className={styles.dwTabs}>
                <div
                  className={`${styles.dwTab} ${dwTab === "detail" ? styles.dwTabOn : ""}`}
                  onClick={() => setDwTab("detail")}
                >
                  Detail
                </div>
                <div
                  className={`${styles.dwTab} ${dwTab === "comments" ? styles.dwTabOn : ""}`}
                  onClick={() => setDwTab("comments")}
                >
                  Comments{task.comments.length > 0 && <span className={styles.dwTabCt}>{task.comments.length}</span>}
                </div>
              </div>

              <div className={styles.dwScroll}>
                {dwTab === "detail" && (
                  <>
                    <div className={styles.dwProps}>
                      {[
                        {
                          icon: "◐",
                          label: "Status",
                          val: (
                            <span
                              className={styles.dwPill}
                              style={{
                                background: task.overdue
                                  ? "rgba(239,83,80,.08)"
                                  : task.section === "active"
                                    ? "rgba(255,152,0,.08)"
                                    : task.section === "done"
                                      ? "rgba(38,166,154,.08)"
                                      : "rgba(76,82,94,.06)",
                                color: task.overdue
                                  ? "#ef5350"
                                  : task.section === "active"
                                    ? "#ff9800"
                                    : task.section === "done"
                                      ? "#26a69a"
                                      : "#7c7b77",
                              }}
                            >
                              {task.overdue
                                ? "Overdue"
                                : task.section === "done"
                                  ? "Done"
                                  : task.section === "active"
                                    ? "In Progress"
                                    : "To Do"}
                            </span>
                          ),
                          key: "S",
                        },
                        {
                          icon: "◎",
                          label: "Priority",
                          val: (
                            <span
                              className={styles.dwPill}
                              style={{ background: priColor(task.pri) + "14", color: priColor(task.pri) }}
                            >
                              {priLabel(task.pri)}
                            </span>
                          ),
                          key: "P",
                        },
                        {
                          icon: "◉",
                          label: "Assignee",
                          val: (
                            <>
                              <div
                                className={styles.dwAv}
                                style={{ background: "rgba(38,166,154,.06)", color: "#26a69a" }}
                              >
                                AX
                              </div>
                              You
                            </>
                          ),
                          key: "A",
                        },
                        {
                          icon: "◻",
                          label: "Due",
                          val: (
                            <span
                              style={{
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: 12,
                                color: task.overdue ? "#ef5350" : undefined,
                              }}
                            >
                              {task.due}
                              {task.overdue ? " — overdue" : ""}
                            </span>
                          ),
                          key: "D",
                        },
                        {
                          icon: "⏱",
                          label: "Estimated",
                          val: (
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#a5a49f" }}>
                              {task.est}
                            </span>
                          ),
                        },
                        {
                          icon: "⏱",
                          label: "Tracked",
                          val: (
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#26a69a" }}>
                              {task.timer ? fmt(timer) : task.actual}
                            </span>
                          ),
                        },
                        ...(task.tags.length > 0
                          ? [
                              {
                                icon: "#",
                                label: "Labels",
                                val: (
                                  <div style={{ display: "flex", gap: 3 }}>
                                    {task.tags.map((tg) => (
                                      <span key={tg} className={styles.dwTag}>
                                        {tg}
                                      </span>
                                    ))}
                                  </div>
                                ),
                                key: "L",
                              },
                            ]
                          : []),
                      ].map((p, i) => (
                        <div key={i} className={styles.dwProp}>
                          <span className={styles.dwPropIcon}>{p.icon}</span>
                          <span className={styles.dwPropLabel}>{p.label}</span>
                          <div className={styles.dwPropVal}>{p.val}</div>
                          {p.key && <span className={styles.dwPropKey}>{p.key}</span>}
                        </div>
                      ))}
                    </div>

                    <div className={styles.dwDesc}>
                      <div className={styles.dwSecLabel}>Description</div>
                      {task.desc ? (
                        <div className={styles.dwDescText}>{task.desc}</div>
                      ) : (
                        <div className={styles.dwDescEmpty}>What is this task about?</div>
                      )}
                    </div>

                    <div className={styles.dwSubs}>
                      <div className={styles.dwSecLabel}>Subtasks</div>
                      {task.subs.length > 0 && (
                        <div className={styles.dwSubsBar}>
                          <div className={styles.dwPbar}>
                            <div
                              className={styles.dwPbarFill}
                              style={{ width: `${(task.subs.filter((s) => s.d).length / task.subs.length) * 100}%` }}
                            />
                          </div>
                          <span className={styles.dwPbarCt}>
                            {task.subs.filter((s) => s.d).length}/{task.subs.length}
                          </span>
                        </div>
                      )}
                      {task.subs.map((s, i) => (
                        <div key={i} className={`${styles.dwSub} ${s.d ? styles.dwSubDone : ""}`}>
                          <div className={`${styles.dwSubCb} ${s.d ? styles.dwSubCbDone : ""}`}>{s.d ? "✓" : ""}</div>
                          <span className={styles.dwSubText}>{s.t}</span>
                        </div>
                      ))}
                      <div className={styles.dwSubAdd}>+ Add subtask</div>
                    </div>
                  </>
                )}

                {dwTab === "comments" && (
                  <div className={styles.dwComments}>
                    <div className={styles.dwSecLabel}>Thread · {task.comments.length}</div>
                    {task.comments.map((c, i) => (
                      <div key={i} className={styles.dwComment}>
                        <div
                          className={styles.dwCommentAv}
                          style={{
                            background: c.user === "You" ? "rgba(38,166,154,.06)" : "rgba(124,133,148,.1)",
                            color: c.user === "You" ? "#26a69a" : "#7c8594",
                          }}
                        >
                          {c.av}
                        </div>
                        <div className={styles.dwCommentBody}>
                          <div className={styles.dwCommentMeta}>
                            <span className={styles.dwCommentUser}>{c.user}</span>
                            <span
                              className={styles.dwCommentRole}
                              style={{
                                background: c.user === "You" ? "rgba(38,166,154,.04)" : "rgba(124,133,148,.06)",
                                color: c.user === "You" ? "#26a69a" : "#7c8594",
                              }}
                            >
                              {c.user === "You" ? "you" : "client"}
                            </span>
                            <span className={styles.dwCommentTime}>{c.time}</span>
                          </div>
                          <div className={styles.dwCommentText}>{c.text}</div>
                          {c.reactions && c.reactions.length > 0 && (
                            <div className={styles.dwCommentReactions}>
                              {c.reactions.map((r, ri) => (
                                <span key={ri} className={styles.dwRx}>
                                  {r}
                                </span>
                              ))}
                              <span className={styles.dwRxAdd}>+</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {task.comments.length === 0 && <div className={styles.dwDescEmpty}>No comments yet</div>}
                    <div className={styles.dwInput}>
                      <div className={styles.dwInputAv}>AX</div>
                      <div className={styles.dwInputBox}>
                        <textarea
                          placeholder="Add a comment..."
                          rows={1}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className={styles.dwInputFt}>
                          <button className={styles.dwInputTool}>{"☺"}</button>
                          <button className={styles.dwInputTool}>{"@"}</button>
                          <button className={styles.dwInputTool}>{"📎"}</button>
                          <button className={styles.dwInputSend}>Send</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.dwFooter}>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterPrimary}`}>{"✓"} Complete</button>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterGhost}`}>{"→"} Editor</button>
                <button className={`${styles.dwFooterBtn} ${styles.dwFooterGhost}`}>{"$"} Invoice</button>
                <div className={styles.dwFooterSpacer} />
                <div className={styles.dwFooterCollab}>
                  <div
                    className={styles.dwFooterCav}
                    style={{ background: "rgba(38,166,154,.06)", color: "#26a69a", zIndex: 2 }}
                  >
                    AX
                  </div>
                  <div
                    className={styles.dwFooterCav}
                    style={{ background: "rgba(124,133,148,.1)", color: "#7c8594", zIndex: 1 }}
                  >
                    SC
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
