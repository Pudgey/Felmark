"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { INITIAL_WORKSPACES } from "@/lib/constants";
import type { Block, Workspace, Project, Tab, ArchivedProject, WorkspaceTemplate, Service, Invoice } from "@/lib/types";
import { uid, makeBlocks } from "@/lib/utils";
import Rail from "@/components/rail/Rail";
import Sidebar from "@/components/sidebar/Sidebar";
import Editor from "@/components/editor/Editor";
import WorkspaceOnboarding from "@/components/onboarding/WorkspaceOnboarding";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { INITIAL_COMMENTS, type Comment } from "@/components/comments/CommentPanel";
import { INITIAL_ACTIVITIES, type BlockActivity } from "@/components/activity/ActivityMargin";
import CreationAnimation from "@/components/onboarding/CreationAnimation";
import Launchpad from "@/components/launchpad/Launchpad";
import type { DocumentTemplate } from "@/lib/types";
import { STARTER_TEMPLATES } from "@/lib/starter-templates";
import SaveTemplateModal from "@/components/templates/SaveTemplateModal";
import TemplatePicker from "@/components/templates/TemplatePicker";

const INITIAL_TABS: Tab[] = [
  { id: "p1", name: "Brand Guidelines v2", client: "Meridian Studio", active: true },
];

const INITIAL_BLOCKS: Record<string, Block[]> = {
  p1: [
    { id: uid(), type: "h1", content: "Brand Guidelines v2", checked: false },
    { id: uid(), type: "callout", content: "Client: Meridian Studio — Due Apr 3 — Budget: $2,400", checked: false },
    { id: uid(), type: "h2", content: "Deliverables", checked: false },
    { id: uid(), type: "todo", content: "Primary & secondary logo usage rules", checked: true },
    { id: uid(), type: "todo", content: "Color palette with hex/RGB/CMYK values", checked: true },
    { id: uid(), type: "todo", content: "Typography scale & font pairings", checked: false },
    { id: uid(), type: "todo", content: "Imagery & photography direction", checked: false },
    { id: uid(), type: "todo", content: "Social media templates (IG, LinkedIn)", checked: false },
    { id: uid(), type: "divider", content: "", checked: false },
    { id: uid(), type: "h2", content: "Notes", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ],
};

const INITIAL_SERVICES: Service[] = [
  {
    id: "s1", name: "Brand Identity", emoji: "\u25C6", color: "#b07d4f",
    desc: "Full brand identity system including logo, colors, typography, and guidelines",
    category: "Design", builtIn: true,
    tiers: [
      { id: "t1", name: "Essential", price: 2400, unit: "flat", hours: 24, includes: ["Logo (2 concepts)", "Color palette", "Typography", "Basic guidelines PDF"] },
      { id: "t2", name: "Complete", price: 4800, unit: "flat", hours: 48, popular: true, includes: ["Logo (4 concepts)", "Color palette", "Typography scale", "Full guidelines doc", "Social templates", "Business card design"] },
      { id: "t3", name: "Premium", price: 8500, unit: "flat", hours: 80, includes: ["Everything in Complete", "Brand strategy workshop", "Competitor audit", "Brand voice guide", "Presentation template", "Ongoing support (30 days)"] },
    ],
    timesUsed: 8, totalEarned: 28600, avgRating: 4.9, lastUsed: "Mar 20",
  },
  {
    id: "s2", name: "Website Design", emoji: "\u25C7", color: "#5b7fa4",
    desc: "Custom website design from wireframes to polished mockups, ready for development",
    category: "Design", builtIn: true,
    tiers: [
      { id: "t4", name: "Landing Page", price: 1800, unit: "flat", hours: 16, includes: ["1 page design", "Mobile responsive", "2 rounds of revisions"] },
      { id: "t5", name: "Multi-page", price: 4200, unit: "flat", hours: 40, popular: true, includes: ["Up to 5 pages", "Mobile responsive", "Design system", "3 rounds of revisions"] },
      { id: "t6", name: "Full Site", price: 7500, unit: "flat", hours: 72, includes: ["Up to 12 pages", "Design system", "Interactive prototypes", "Developer handoff", "Unlimited revisions"] },
    ],
    timesUsed: 5, totalEarned: 21000, avgRating: 4.8, lastUsed: "Mar 15",
  },
  {
    id: "s3", name: "Content & Copy", emoji: "\u270E", color: "#5a9a3c",
    desc: "Strategic copywriting for websites, emails, and marketing materials",
    category: "Writing", builtIn: true,
    tiers: [
      { id: "t7", name: "Per page", price: 350, unit: "per page", hours: 3, includes: ["SEO-optimized copy", "1 round of revisions", "Meta descriptions"] },
      { id: "t8", name: "Email sequence", price: 1200, unit: "flat", hours: 12, popular: true, includes: ["6-part email sequence", "Subject line variants", "A/B test suggestions"] },
      { id: "t9", name: "Full website", price: 3500, unit: "flat", hours: 32, includes: ["All page copy", "CTAs and microcopy", "SEO strategy", "Content calendar"] },
    ],
    timesUsed: 12, totalEarned: 18400, avgRating: 5.0, lastUsed: "Mar 28",
  },
  {
    id: "s4", name: "Strategy Session", emoji: "\u25CE", color: "#7c6b9e",
    desc: "Deep-dive consulting on brand, marketing, or product strategy",
    category: "Consulting", builtIn: true,
    tiers: [
      { id: "t10", name: "Discovery", price: 500, unit: "flat", hours: 2, includes: ["90-min call", "Summary doc", "3 action items"] },
      { id: "t11", name: "Half-day", price: 1500, unit: "flat", hours: 4, popular: true, includes: ["4-hour workshop", "Strategic brief", "Roadmap", "Follow-up call"] },
      { id: "t12", name: "Retainer", price: 3000, unit: "per month", hours: 12, includes: ["Weekly 1:1 calls", "Async support", "Monthly report", "Priority access"] },
    ],
    timesUsed: 15, totalEarned: 22500, avgRating: 4.7, lastUsed: "Mar 25",
  },
  {
    id: "s5", name: "Social Media Kit", emoji: "\u2B21", color: "#8a7e63",
    desc: "Template sets for Instagram, LinkedIn, and other platforms",
    category: "Design", builtIn: true,
    tiers: [
      { id: "t13", name: "Starter", price: 600, unit: "flat", hours: 6, includes: ["5 templates", "1 platform", "Brand-matched"] },
      { id: "t14", name: "Pro", price: 1400, unit: "flat", hours: 14, popular: true, includes: ["15 templates", "2 platforms", "Story + feed", "Canva files"] },
    ],
    timesUsed: 6, totalEarned: 7800, avgRating: 4.9, lastUsed: "Mar 10",
  },
];

function makeEmptyBlocks(): Block[] {
  return [
    { id: uid(), type: "h1", content: "", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ];
}

// ── localStorage persistence ──
const STORAGE_KEY = "felmark_workspace";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupted data — use fallback */ }
  return fallback;
}

function saveToStorage(key: string, data: unknown) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data));
  } catch { /* storage full — silent fail */ }
}

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS.map(t => ({ ...t, active: false })));
  const [activeProject, setActiveProject] = useState("");
  const [blocksMap, setBlocksMap] = useState<Record<string, Block[]>>(INITIAL_BLOCKS);
  const [archived, setArchived] = useState<ArchivedProject[]>([]);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, BlockActivity[]>>({ p1: INITIAL_ACTIVITIES });
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // ── Hydrate from localStorage after mount (avoids SSR mismatch) ──
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const ws = loadFromStorage("workspaces", null);
    if (ws) setWorkspaces(ws);
    const t = loadFromStorage("tabs", null);
    if (t) setTabs(t);
    const ap = loadFromStorage("activeProject", null);
    if (ap !== null) setActiveProject(ap);
    const bm = loadFromStorage("blocksMap", null);
    if (bm) setBlocksMap(bm);
    const ar = loadFromStorage("archived", null);
    if (ar) setArchived(ar);
    const cm = loadFromStorage("comments", null);
    if (cm) setComments(cm);
    const am = loadFromStorage("activitiesMap", null);
    if (am) setActivitiesMap(am);
    const sv = loadFromStorage("services", null);
    if (sv) setServices(sv);
    const inv = loadFromStorage("invoices", null);
    if (inv) setInvoices(inv);
    setHydrated(true);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [railActive, setRailActive] = useState("workspaces");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [onboardingName, setOnboardingName] = useState<string | null>(null);
  const [creationAnim, setCreationAnim] = useState<{ name: string; template: string; color: string; pendingData: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkspaceTemplate } } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [calendarScrollTarget, setCalendarScrollTarget] = useState<string | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [docTemplates, setDocTemplates] = useState<DocumentTemplate[]>(STARTER_TEMPLATES);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [splitProject, setSplitProject] = useState<string | null>(null);
  const resizeRef = useRef<{ startX: number; startW: number } | null>(null);

  const overdueCount = workspaces.reduce((s, w) => s + w.projects.filter(p => p.status === "overdue").length, 0);

  // ── Auto-save to localStorage (debounced 500ms) ──
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToStorage("workspaces", workspaces);
      saveToStorage("blocksMap", blocksMap);
      saveToStorage("tabs", tabs);
      saveToStorage("archived", archived);
      saveToStorage("comments", comments);
      saveToStorage("activitiesMap", activitiesMap);
      saveToStorage("activeProject", activeProject);
      saveToStorage("services", services);
      saveToStorage("invoices", invoices);
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [workspaces, blocksMap, tabs, archived, comments, activitiesMap, activeProject, services, invoices]);

  // Zen mode: Escape to exit
  useEffect(() => {
    if (!zenMode) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZenMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [zenMode]);


  // Single click — pure expand/collapse toggle
  const toggleWorkspace = (wid: string) =>
    setWorkspaces(prev => prev.map(w => w.id === wid ? { ...w, open: !w.open } : w));

  // Double click — navigate to workspace home
  const selectWorkspaceHome = (wid: string) => {
    setActiveWorkspaceId(wid);
    setTabs(prev => prev.map(t => ({ ...t, active: false })));
    setActiveProject("");
    // Ensure workspace is expanded
    setWorkspaces(prev => prev.map(w => w.id === wid ? { ...w, open: true } : w));
  };

  const selectProject = (project: Project, client: string) => {
    setActiveWorkspaceId(null);
    setActiveProject(project.id);
    if (!tabs.find(t => t.id === project.id)) {
      setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: project.id, name: project.name, client, active: true }]);
    } else {
      setTabs(prev => prev.map(t => ({ ...t, active: t.id === project.id })));
    }
    // Ensure blocks exist for this project
    if (!blocksMap[project.id]) {
      setBlocksMap(prev => ({ ...prev, [project.id]: makeEmptyBlocks() }));
    }
  };

  // Double-click calendar event → open the first project in that workspace
  const calendarOpenProject = (workspaceId: string) => {
    const wsIdx = parseInt(workspaceId.replace("w", "")) - 1;
    const ws = workspaces[wsIdx];
    if (!ws || ws.projects.length === 0) return;
    const project = ws.projects[0];
    setRailActive("workspaces");
    selectProject(project, ws.client);
  };

  const handleTabClick = (id: string) => {
    setActiveWorkspaceId(null);
    setActiveProject(id);
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
  };

  const handleTabClose = (id: string) => {
    setTabs(prev => {
      const n = prev.filter(t => t.id !== id);
      if (n.length > 0 && !n.some(t => t.active)) {
        n[n.length - 1].active = true;
        setActiveProject(n[n.length - 1].id);
      }
      if (n.length === 0) {
        setActiveProject("");
        setActiveWorkspaceId(null);
      }
      return n;
    });
  };

  const handleTabRename = (id: string, name: string) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    setWorkspaces(prev => prev.map(w => ({
      ...w,
      projects: w.projects.map(p => p.id === id ? { ...p, name } : p),
    })));
  };

  const togglePin = (projectId: string) => {
    setWorkspaces(prev => prev.map(w => ({
      ...w, projects: w.projects.map(p => p.id === projectId ? { ...p, pinned: !p.pinned } : p),
    })));
  };

  const cycleStatus = (projectId: string) => {
    const statuses: Array<"active" | "review" | "paused" | "completed"> = ["active", "review", "paused", "completed"];
    setWorkspaces(prev => prev.map(w => ({
      ...w, projects: w.projects.map(p => {
        if (p.id !== projectId) return p;
        const idx = statuses.indexOf(p.status as typeof statuses[number]);
        return { ...p, status: statuses[(idx + 1) % statuses.length] };
      }),
    })));
  };

  const addWorkspace = (name: string) => {
    // Show onboarding card instead of creating immediately
    setOnboardingName(name);
  };

  const TEMPLATE_LABELS: Record<WorkspaceTemplate, string> = {
    blank: "Blank Project", proposal: "Proposal", meeting: "Meeting Notes",
    brief: "Project Brief", retainer: "Retainer", invoice: "Invoice",
  };

  const completeOnboarding = (data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkspaceTemplate }) => {
    setOnboardingName(null);
    setCreationAnim({ name: data.name, template: TEMPLATE_LABELS[data.template], color: data.color, pendingData: data });
  };

  const finishCreation = () => {
    if (!creationAnim) return;
    const data = creationAnim.pendingData;
    const wsId = uid();
    const projectId = uid();
    const { blocks, projectName } = makeBlocks(data.template, data.name);

    const newProject: Project = {
      id: projectId,
      name: projectName,
      status: "active",
      due: null,
      amount: "—",
      progress: 0,
      pinned: false,
    };

    setWorkspaces(prev => [...prev, {
      id: wsId,
      client: data.name,
      avatar: data.name[0].toUpperCase(),
      avatarBg: data.color,
      open: true,
      lastActive: "now",
      contact: data.contact || undefined,
      rate: data.rate || undefined,
      projects: [newProject],
    }]);

    setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));

    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
      id: projectId, name: projectName, client: data.name, active: true,
    }]);
    setActiveProject(projectId);
    setCreationAnim(null);
  };

  const skipOnboarding = () => {
    if (!onboardingName) return;
    const wsId = uid();
    const projectId = uid();
    const { blocks } = makeBlocks("blank", onboardingName);

    setWorkspaces(prev => [...prev, {
      id: wsId,
      client: onboardingName,
      avatar: onboardingName[0].toUpperCase(),
      avatarBg: "#7c8594",
      open: true,
      lastActive: "now",
      projects: [{
        id: projectId, name: "Untitled", status: "active",
        due: null, amount: "—", progress: 0, pinned: false,
      }],
    }]);

    setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
      id: projectId, name: "Untitled", client: onboardingName, active: true,
    }]);
    setActiveProject(projectId);
    setOnboardingName(null);
  };

  const updateProjectDue = (projectId: string, due: string | null) => {
    setWorkspaces(prev => prev.map(w => ({
      ...w,
      projects: w.projects.map(p => p.id === projectId ? { ...p, due } : p),
    })));
  };

  const archiveProject = (projectId: string) => {
    const ws = workspaces.find(w => w.projects.some(p => p.id === projectId));
    const project = ws?.projects.find(p => p.id === projectId);
    if (!ws || !project) return;

    setArchived(prev => [...prev, {
      project, workspaceId: ws.id, workspaceName: ws.client,
      archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }]);
    setWorkspaces(prev => prev.map(w =>
      w.id === ws.id ? { ...w, projects: w.projects.filter(p => p.id !== projectId) } : w
    ));
    // Close tab if open
    setTabs(prev => {
      const n = prev.filter(t => t.id !== projectId);
      if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; setActiveProject(n[n.length - 1].id); }
      if (n.length === 0) setActiveProject("");
      return n;
    });
  };

  const archiveCompletedInWorkspace = (wsId: string) => {
    const ws = workspaces.find(w => w.id === wsId);
    if (!ws) return;
    const completed = ws.projects.filter(p => p.status === "completed");
    if (completed.length === 0) return;

    setArchived(prev => [...prev, ...completed.map(project => ({
      project, workspaceId: ws.id, workspaceName: ws.client,
      archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }))]);
    const completedIds = new Set(completed.map(p => p.id));
    setWorkspaces(prev => prev.map(w =>
      w.id === wsId ? { ...w, projects: w.projects.filter(p => !completedIds.has(p.id)) } : w
    ));
    setTabs(prev => {
      const n = prev.filter(t => !completedIds.has(t.id));
      if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; setActiveProject(n[n.length - 1].id); }
      if (n.length === 0) setActiveProject("");
      return n;
    });
  };

  const archiveWorkspace = (wsId: string) => {
    const ws = workspaces.find(w => w.id === wsId);
    if (!ws) return;
    // Prevent archiving the last personal workspace
    if (ws.personal && workspaces.filter(w => w.personal).length <= 1) return;

    setArchived(prev => [...prev, ...ws.projects.map(project => ({
      project, workspaceId: ws.id, workspaceName: ws.client,
      archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }))]);
    const projectIds = new Set(ws.projects.map(p => p.id));
    setWorkspaces(prev => prev.filter(w => w.id !== wsId));
    setTabs(prev => {
      const n = prev.filter(t => !projectIds.has(t.id));
      if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; setActiveProject(n[n.length - 1].id); }
      if (n.length === 0) setActiveProject("");
      return n;
    });
  };

  const restoreProject = (archivedIdx: number) => {
    const item = archived[archivedIdx];
    if (!item) return;

    // Restore to original workspace, or create it if it was archived
    setWorkspaces(prev => {
      const existing = prev.find(w => w.id === item.workspaceId);
      if (existing) {
        return prev.map(w => w.id === item.workspaceId ? { ...w, projects: [...w.projects, item.project] } : w);
      }
      // Workspace was archived — recreate it
      return [...prev, { id: item.workspaceId, client: item.workspaceName, avatar: item.workspaceName[0], avatarBg: "#7c8594", open: true, lastActive: "now", projects: [item.project] }];
    });
    setArchived(prev => prev.filter((_, i) => i !== archivedIdx));
  };

  const handleNewTab = () => {
    // Find the active workspace (or default to first)
    const activeWs = workspaces.find(w => w.projects.some(p => p.id === activeProject)) || workspaces[0];
    const newId = uid();
    const newProject: Project = {
      id: newId,
      name: "Untitled",
      status: "active",
      due: null,
      amount: "—",
      progress: 0,
      pinned: false,
    };

    // Add project to workspace
    setWorkspaces(prev => prev.map(w =>
      w.id === activeWs.id ? { ...w, open: true, projects: [...w.projects, newProject] } : w
    ));

    // Create empty blocks
    setBlocksMap(prev => ({ ...prev, [newId]: makeEmptyBlocks() }));

    // Open as new active tab
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
      id: newId, name: "Untitled", client: activeWs.client, active: true,
    }]);
    setActiveProject(newId);
  };

  const handleNewTabInWorkspace = (wsId: string) => {
    const ws = workspaces.find(w => w.id === wsId);
    if (!ws) return;
    const newId = uid();
    const newProject: Project = {
      id: newId, name: "Untitled", status: "active",
      due: null, amount: "—", progress: 0, pinned: false,
    };
    setWorkspaces(prev => prev.map(w =>
      w.id === wsId ? { ...w, open: true, projects: [...w.projects, newProject] } : w
    ));
    setBlocksMap(prev => ({ ...prev, [newId]: makeEmptyBlocks() }));
    setActiveWorkspaceId(null);
    setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
      id: newId, name: "Untitled", client: ws.client, active: true,
    }]);
    setActiveProject(newId);
    setRailActive("workspaces");
  };

  const handleBlocksChange = useCallback((projectId: string, blocks: Block[]) => {
    setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));
  }, []);

  const handleWordCountChange = useCallback((words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  }, []);

  // ── Service handlers ──
  const handleAddService = useCallback((service: Service) => {
    setServices(prev => [...prev, service]);
  }, []);

  const handleUpdateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const handleDeleteService = useCallback((id: string) => {
    setServices(prev => {
      const svc = prev.find(s => s.id === id);
      if (svc?.builtIn) return prev; // cannot delete built-in
      return prev.filter(s => s.id !== id);
    });
  }, []);

  const handleAddInvoice = useCallback((invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
  }, []);

  const activeBlocks = blocksMap[activeProject] || makeEmptyBlocks();

  return (
    <ErrorBoundary>
    <div style={{ display: "flex", height: "100dvh", background: "var(--parchment)" }}>
      {!zenMode && <Rail
        activeItem={railActive}
        overdueCount={overdueCount}
        onItemClick={(item) => {
          if (item === "workspaces") {
            setLaunchpadOpen(true);
            return;
          }
          setRailActive(item);
          if (item === "home") {
            setActiveWorkspaceId(null);
            setTabs(prev => prev.map(t => ({ ...t, active: false })));
            setActiveProject("");
            setSidebarOpen(true);
          }
        }}
        zenMode={zenMode}
        onToggleZen={() => setZenMode(true)}
      />}
      {!zenMode && <Sidebar
        workspaces={workspaces}
        archived={archived}
        activeProject={activeProject}
        open={sidebarOpen}
        width={sidebarWidth}
        isResizing={isResizing}
        wordCount={wordCount}
        railActive={railActive}
        onClose={() => setSidebarOpen(false)}
        onToggleWorkspace={toggleWorkspace}
        onSelectWorkspaceHome={selectWorkspaceHome}
        onSelectProject={selectProject}
        onArchiveProject={archiveProject}
        onArchiveCompleted={archiveCompletedInWorkspace}
        onArchiveWorkspace={archiveWorkspace}
        onRestoreProject={restoreProject}
        onRenameProject={handleTabRename}
        onUpdateProjectDue={updateProjectDue}
        onRenameWorkspace={(wsId, name) => {
          setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
          setTabs(prev => prev.map(t => {
            const ws = workspaces.find(w => w.id === wsId);
            if (ws && ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
            return t;
          }));
        }}
        onReorderWorkspaces={(fromIdx, toIdx) => {
          setWorkspaces(prev => {
            const next = [...prev];
            const [moved] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, moved);
            return next;
          });
        }}
        onAddWorkspace={addWorkspace}
        onTogglePin={togglePin}
        onCycleStatus={cycleStatus}
        onScrollToCalendarEvent={(projectId) => setCalendarScrollTarget(projectId)}
      />}
      {/* Resize handle */}
      {sidebarOpen && !zenMode && (
        <div
          style={{
            width: 5,
            cursor: "col-resize",
            flexShrink: 0,
            position: "relative",
            zIndex: 10,
            marginLeft: -3,
            marginRight: -2,
          }}
          onMouseDown={e => {
            e.preventDefault();
            resizeRef.current = { startX: e.clientX, startW: sidebarWidth };
            setIsResizing(true);

            const onMouseMove = (ev: MouseEvent) => {
              if (!resizeRef.current) return;
              const delta = ev.clientX - resizeRef.current.startX;
              const newW = Math.min(520, Math.max(220, resizeRef.current.startW + delta));
              setSidebarWidth(newW);
            };

            const onMouseUp = () => {
              resizeRef.current = null;
              setIsResizing(false);
              document.removeEventListener("mousemove", onMouseMove);
              document.removeEventListener("mouseup", onMouseUp);
              document.body.style.cursor = "";
              document.body.style.userSelect = "";
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 2,
            width: 1,
            background: isResizing ? "var(--ember)" : "transparent",
            transition: isResizing ? "none" : "background 0.15s",
          }} />
        </div>
      )}
      {creationAnim ? (
        <CreationAnimation
          clientName={creationAnim.name}
          templateName={creationAnim.template}
          color={creationAnim.color}
          onComplete={finishCreation}
        />
      ) : onboardingName !== null ? (
        <div style={{ flex: 1, overflow: "auto", background: "var(--parchment)" }}>
          <WorkspaceOnboarding
            initialName={onboardingName}
            workspaces={workspaces}
            onComplete={completeOnboarding}
            onSkip={skipOnboarding}
          />
        </div>
      ) : (
        <Editor
          workspaces={workspaces}
          tabs={tabs}
          activeProject={activeProject}
          activeWorkspaceId={activeWorkspaceId}
          blocks={activeBlocks}
          sidebarOpen={sidebarOpen}
          wordCount={wordCount}
          charCount={charCount}
          onOpenSidebar={() => setSidebarOpen(true)}
          onTabClick={handleTabClick}
          onTabClose={handleTabClose}
          onNewTab={handleNewTab}
          onTabRename={handleTabRename}
          onBlocksChange={handleBlocksChange}
          onWordCountChange={handleWordCountChange}
          onSelectProject={selectProject}
          onNewWorkspace={() => setOnboardingName("New Client")}
          onNewTabInWorkspace={handleNewTabInWorkspace}
          onSelectWorkspaceHome={selectWorkspaceHome}
          onSaveAsTemplate={() => setShowSaveTemplate(true)}
          docTemplates={docTemplates}
          railActive={railActive}
          calendarScrollTarget={calendarScrollTarget}
          onCalendarScrollComplete={() => setCalendarScrollTarget(null)}
          onCalendarOpenProject={calendarOpenProject}
          onRenameWorkspace={(wsId, name) => {
            setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
            setTabs(prev => prev.map(t => {
              const ws = workspaces.find(w => w.id === wsId);
              if (ws && ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
              return t;
            }));
          }}
          onUpdateProjectDue={updateProjectDue}
          comments={comments}
          onCommentsChange={setComments}
          activities={activitiesMap[activeProject] || []}
          onActivitiesChange={(newActivities) => setActivitiesMap(prev => ({ ...prev, [activeProject]: newActivities }))}
          zenMode={zenMode}
          onToggleZen={() => setZenMode(prev => !prev)}
          splitProject={splitProject}
          splitBlocks={splitProject ? blocksMap[splitProject] || [] : undefined}
          splitProjectName={splitProject ? (() => { for (const w of workspaces) { const p = w.projects.find(p => p.id === splitProject); if (p) return p.name; } return "Untitled"; })() : undefined}
          splitClientName={splitProject ? (() => { for (const w of workspaces) { if (w.projects.some(p => p.id === splitProject)) return w.client; } return ""; })() : undefined}
          onSplitOpen={(id) => setSplitProject(id)}
          onSplitClose={() => setSplitProject(null)}
          services={services}
          invoices={invoices}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onAddInvoice={handleAddInvoice}
          onSplitMakePrimary={() => {
            if (!splitProject) return;
            const ws = workspaces.find(w => w.projects.some(p => p.id === splitProject));
            const proj = ws?.projects.find(p => p.id === splitProject);
            if (ws && proj) {
              selectProject(proj, ws.client);
              setSplitProject(null);
            }
          }}
        />
      )}
    </div>

    <Launchpad
      open={launchpadOpen}
      onClose={() => setLaunchpadOpen(false)}
      workspaces={workspaces}
      onNavigate={(screenId) => {
        setRailActive(screenId);
        if (screenId === "home") {
          setActiveWorkspaceId(null);
          setTabs(prev => prev.map(t => ({ ...t, active: false })));
          setActiveProject("");
        }
        setSidebarOpen(true);
      }}
      onSelectWorkspace={(wsId) => {
        selectWorkspaceHome(wsId);
        setRailActive("workspaces");
      }}
      onOpenCommandPalette={() => {
        // Editor manages command palette state internally
        // This is a placeholder — in the future, lift cmdPalette state to page.tsx
      }}
    />

    <SaveTemplateModal
      open={showSaveTemplate}
      onClose={() => setShowSaveTemplate(false)}
      blocks={blocksMap[activeProject] || []}
      onSave={(template) => setDocTemplates(prev => [...prev, template])}
    />

    <TemplatePicker
      open={showTemplatePicker}
      onClose={() => setShowTemplatePicker(false)}
      templates={docTemplates}
      onSelectBlank={() => {
        // Just close — the new tab is already created with blank blocks
      }}
      onSelectTemplate={(blocks) => {
        if (activeProject) {
          setBlocksMap(prev => ({ ...prev, [activeProject]: blocks }));
        }
      }}
    />
    </ErrorBoundary>
  );
}
