import type { Project } from "@/lib/types";
import type { StateUpdater } from "../types";
import { uid } from "@/lib/utils";

export function createProjectServices(state: StateUpdater) {
  const makeEmptyBlocks = () => [
    { id: uid(), type: "h1" as const, content: "", checked: false },
    { id: uid(), type: "paragraph" as const, content: "", checked: false },
  ];

  return {
    /** Select a project — open its tab */
    select(projectId: string, client: string, projectName: string) {
      state.setActiveProject(projectId);
      const tabs = state.getState().tabs;
      if (!tabs.find(t => t.id === projectId)) {
        state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), { id: projectId, name: projectName, client, active: true }]);
      } else {
        state.setTabs(prev => prev.map(t => ({ ...t, active: t.id === projectId })));
      }
      // Ensure blocks exist
      if (!state.getState().blocksMap[projectId]) {
        state.setBlocksMap(prev => ({ ...prev, [projectId]: makeEmptyBlocks() }));
      }
    },

    /** Create a new project in a workspace */
    createInWorkspace(wsId: string): string | null {
      const ws = state.getState().workspaces.find(w => w.id === wsId);
      if (!ws) return null;
      const newId = uid();
      const newProject: Project = {
        id: newId, name: "Untitled", status: "active",
        due: null, amount: "—", progress: 0, pinned: false,
      };
      state.setWorkspaces(prev => prev.map(w =>
        w.id === wsId ? { ...w, open: true, projects: [...w.projects, newProject] } : w
      ));
      state.setBlocksMap(prev => ({ ...prev, [newId]: makeEmptyBlocks() }));
      state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
        id: newId, name: "Untitled", client: ws.client, active: true,
      }]);
      state.setActiveProject(newId);
      return newId;
    },

    /** Rename a project (and its tab) */
    rename(projectId: string, name: string) {
      state.setTabs(prev => prev.map(t => t.id === projectId ? { ...t, name } : t));
      state.setWorkspaces(prev => prev.map(w => ({
        ...w,
        projects: w.projects.map(p => p.id === projectId ? { ...p, name } : p),
      })));
    },

    /** Toggle pin */
    togglePin(projectId: string) {
      state.setWorkspaces(prev => prev.map(w => ({
        ...w, projects: w.projects.map(p => p.id === projectId ? { ...p, pinned: !p.pinned } : p),
      })));
    },

    /** Cycle status: active → review → paused → completed */
    cycleStatus(projectId: string) {
      const statuses: Array<"active" | "review" | "paused" | "completed"> = ["active", "review", "paused", "completed"];
      state.setWorkspaces(prev => prev.map(w => ({
        ...w, projects: w.projects.map(p => {
          if (p.id !== projectId) return p;
          const idx = statuses.indexOf(p.status as typeof statuses[number]);
          return { ...p, status: statuses[(idx + 1) % statuses.length] };
        }),
      })));
    },

    /** Update due date */
    setDue(projectId: string, due: string | null) {
      state.setWorkspaces(prev => prev.map(w => ({
        ...w,
        projects: w.projects.map(p => p.id === projectId ? { ...p, due } : p),
      })));
    },

    /** Archive a single project */
    archive(projectId: string) {
      const { workspaces } = state.getState();
      const ws = workspaces.find(w => w.projects.some(p => p.id === projectId));
      const project = ws?.projects.find(p => p.id === projectId);
      if (!ws || !project) return;

      state.setArchived(prev => [...prev, {
        project, workspaceId: ws.id, workspaceName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }]);
      state.setWorkspaces(prev => prev.map(w =>
        w.id === ws.id ? { ...w, projects: w.projects.filter(p => p.id !== projectId) } : w
      ));
      state.setTabs(prev => {
        const n = prev.filter(t => t.id !== projectId);
        if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; state.setActiveProject(n[n.length - 1].id); }
        if (n.length === 0) state.setActiveProject("");
        return n;
      });
    },

    /** Restore an archived project */
    restore(archivedIdx: number) {
      const { archived } = state.getState();
      const item = archived[archivedIdx];
      if (!item) return;

      state.setWorkspaces(prev => {
        const existing = prev.find(w => w.id === item.workspaceId);
        if (existing) {
          return prev.map(w => w.id === item.workspaceId ? { ...w, projects: [...w.projects, item.project] } : w);
        }
        return [...prev, { id: item.workspaceId, client: item.workspaceName, avatar: item.workspaceName[0], avatarBg: "#7c8594", open: true, lastActive: "now", projects: [item.project] }];
      });
      state.setArchived(prev => prev.filter((_, i) => i !== archivedIdx));
    },
  };
}
