import type { Project } from "@/lib/types";
import type { StateUpdater } from "../types";
import { uid } from "@/lib/utils";
import { resolveDefaultTab } from "./tabs";

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

    /** Create a new project in a workstation */
    createInWorkstation(wsId: string): string | null {
      const ws = state.getState().workstations.find(w => w.id === wsId);
      if (!ws) return null;
      const newId = uid();
      const newProject: Project = {
        id: newId, name: "Untitled", status: "active",
        due: null, amount: "—", progress: 0, pinned: false,
      };
      state.setWorkstations(prev => prev.map(w =>
        w.id === wsId ? { ...w, open: true, projects: [...w.projects, newProject] } : w
      ));
      state.setBlocksMap(prev => ({ ...prev, [newId]: makeEmptyBlocks() }));
      state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
        id: newId, name: "Untitled", client: ws.client, active: true,
      }]);
      state.setActiveProject(newId);
      state.setActiveWorkstationId(wsId);
      return newId;
    },

    /** Rename a project (and its tab) */
    rename(projectId: string, name: string) {
      state.setTabs(prev => prev.map(t => t.id === projectId ? { ...t, name } : t));
      state.setWorkstations(prev => prev.map(w => ({
        ...w,
        projects: w.projects.map(p => p.id === projectId ? { ...p, name } : p),
      })));
    },

    /** Toggle pin */
    togglePin(projectId: string) {
      state.setWorkstations(prev => prev.map(w => ({
        ...w, projects: w.projects.map(p => p.id === projectId ? { ...p, pinned: !p.pinned } : p),
      })));
    },

    /** Cycle status: active → review → paused → completed */
    cycleStatus(projectId: string) {
      const statuses: Array<"active" | "review" | "paused" | "completed"> = ["active", "review", "paused", "completed"];
      state.setWorkstations(prev => prev.map(w => ({
        ...w, projects: w.projects.map(p => {
          if (p.id !== projectId) return p;
          const idx = statuses.indexOf(p.status as typeof statuses[number]);
          return { ...p, status: statuses[(idx + 1) % statuses.length] };
        }),
      })));
    },

    /** Update due date */
    setDue(projectId: string, due: string | null) {
      state.setWorkstations(prev => prev.map(w => ({
        ...w,
        projects: w.projects.map(p => p.id === projectId ? { ...p, due } : p),
      })));
    },

    /** Duplicate a project (with its blocks) */
    duplicate(projectId: string) {
      const { workstations, blocksMap } = state.getState();
      const ws = workstations.find(w => w.projects.some(p => p.id === projectId));
      const project = ws?.projects.find(p => p.id === projectId);
      if (!ws || !project) return;

      const newId = uid();
      const newProject: Project = {
        ...project,
        id: newId,
        name: `${project.name} (copy)`,
        pinned: false,
      };
      const sourceBlocks = blocksMap[projectId] ?? [];
      const newBlocks = sourceBlocks.map(b => ({ ...b, id: uid() }));

      state.setWorkstations(prev => prev.map(w =>
        w.id === ws.id
          ? { ...w, projects: [...w.projects.slice(0, w.projects.findIndex(p => p.id === projectId) + 1), newProject, ...w.projects.slice(w.projects.findIndex(p => p.id === projectId) + 1)] }
          : w
      ));
      state.setBlocksMap(prev => ({ ...prev, [newId]: newBlocks }));
      state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
        id: newId, name: newProject.name, client: ws.client, active: true,
      }]);
      state.setActiveProject(newId);
      state.setActiveWorkstationId(ws.id);
    },

    /** Archive a single project */
    archive(projectId: string) {
      const { workstations } = state.getState();
      const ws = workstations.find((w: { id: string; projects: { id: string }[] }) => w.projects.some((p: { id: string }) => p.id === projectId));
      const project = ws?.projects.find(p => p.id === projectId);
      if (!ws || !project) return;
      const nextWorkstations = workstations.map(w =>
        w.id === ws.id ? { ...w, projects: w.projects.filter(p => p.id !== projectId) } : w
      );

      state.setArchived(prev => [...prev, {
        project, workstationId: ws.id, workstationName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }]);
      state.setWorkstations(() => nextWorkstations);
      state.setTabs(prev => {
        const n = prev.filter(t => t.id !== projectId);
        if (n.length > 0 && !n.some(t => t.active)) {
          n[n.length - 1].active = true;
          state.setActiveProject(n[n.length - 1].id);
          const owner = nextWorkstations.find(w => w.projects.some(p => p.id === n[n.length - 1].id));
          state.setActiveWorkstationId(owner?.id ?? null);
        }
        if (n.length === 0) {
          const fallback = resolveDefaultTab(nextWorkstations);
          if (fallback) {
            n.push(fallback.tab);
            state.setActiveProject(fallback.tab.id);
            state.setActiveWorkstationId(fallback.workstationId);
          } else {
            state.setActiveProject("");
            state.setActiveWorkstationId(null);
          }
        }
        return n;
      });
    },

    /** Restore an archived project */
    restore(archivedIdx: number) {
      const { archived } = state.getState();
      const item = archived[archivedIdx];
      if (!item) return;

      state.setWorkstations(prev => {
        const existing = prev.find(w => w.id === item.workstationId);
        if (existing) {
          return prev.map(w => w.id === item.workstationId ? { ...w, projects: [...w.projects, item.project] } : w);
        }
        return [...prev, { id: item.workstationId, client: item.workstationName, avatar: item.workstationName[0], avatarBg: "#7c8594", open: true, lastActive: "now", projects: [item.project] }];
      });
      state.setArchived(prev => prev.filter((_, i) => i !== archivedIdx));
    },

    /** Permanently delete an archived project and its blocks */
    permanentDelete(archivedIdx: number) {
      const { archived } = state.getState();
      const item = archived[archivedIdx];
      if (!item) return;
      state.setBlocksMap(prev => {
        const next = { ...prev };
        delete next[item.project.id];
        return next;
      });
      state.setArchived(prev => prev.filter((_, i) => i !== archivedIdx));
    },
  };
}
