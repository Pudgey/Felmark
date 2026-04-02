import type { Project, WorkstationTemplate } from "@/lib/types";
import type { StateUpdater, ForgeResult } from "../types";
import { uid, makeBlocks } from "@/lib/utils";

export function createWorkstationServices(state: StateUpdater) {
  return {
    /** Toggle workstation expand/collapse */
    toggle(wsId: string) {
      state.setWorkstations(prev => prev.map(w => w.id === wsId ? { ...w, open: !w.open } : w));
    },

    /** Rename a workstation */
    rename(wsId: string, name: string) {
      state.setWorkstations(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
      // Also update any open tabs that reference this workstation
      const ws = state.getState().workstations.find(w => w.id === wsId);
      if (ws) {
        state.setTabs(prev => prev.map(t => {
          if (ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
          return t;
        }));
      }
    },

    /** Reorder workstations via drag */
    reorder(fromIdx: number, toIdx: number) {
      state.setWorkstations(prev => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
    },

    /** Create a new workstation with a project from onboarding data */
    create(data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkstationTemplate }): { wsId: string; projectId: string; projectName: string } {
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

      state.setWorkstations(prev => [...prev, {
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

      state.setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));

      state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
        id: projectId, name: projectName, client: data.name, active: true,
      }]);
      state.setActiveProject(projectId);

      return { wsId, projectId, projectName };
    },

    /** Quick-create workstation (skip onboarding) */
    quickCreate(name: string): { wsId: string; projectId: string } {
      const wsId = uid();
      const projectId = uid();
      const { blocks } = makeBlocks("blank", name);

      state.setWorkstations(prev => [...prev, {
        id: wsId,
        client: name,
        avatar: name[0].toUpperCase(),
        avatarBg: "#7c8594",
        open: true,
        lastActive: "now",
        projects: [{
          id: projectId, name: "Untitled", status: "active",
          due: null, amount: "—", progress: 0, pinned: false,
        }],
      }]);

      state.setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));
      state.setTabs(prev => [...prev.map(t => ({ ...t, active: false })), {
        id: projectId, name: "Untitled", client: name, active: true,
      }]);
      state.setActiveProject(projectId);

      return { wsId, projectId };
    },

    /** Archive an entire workstation */
    archive(wsId: string): ForgeResult {
      const ws = state.getState().workstations.find(w => w.id === wsId);
      if (!ws) return { ok: false, error: "Workstation not found" };
      if (ws.personal && state.getState().workstations.filter(w => w.personal).length <= 1) {
        return { ok: false, error: "Cannot archive the last personal workstation" };
      }

      state.setArchived(prev => [...prev, ...ws.projects.map(project => ({
        project, workstationId: ws.id, workstationName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }))]);

      const projectIds = new Set(ws.projects.map(p => p.id));
      state.setWorkstations(prev => prev.filter(w => w.id !== wsId));
      state.setTabs(prev => {
        const n = prev.filter(t => !projectIds.has(t.id));
        if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; state.setActiveProject(n[n.length - 1].id); }
        if (n.length === 0) state.setActiveProject("");
        return n;
      });

      return { ok: true, data: undefined };
    },

    /** Archive all completed projects in a workstation */
    archiveCompleted(wsId: string) {
      const ws = state.getState().workstations.find(w => w.id === wsId);
      if (!ws) return;
      const completed = ws.projects.filter(p => p.status === "completed");
      if (completed.length === 0) return;

      state.setArchived(prev => [...prev, ...completed.map(project => ({
        project, workstationId: ws.id, workstationName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }))]);

      const completedIds = new Set(completed.map(p => p.id));
      state.setWorkstations(prev => prev.map(w =>
        w.id === wsId ? { ...w, projects: w.projects.filter(p => !completedIds.has(p.id)) } : w
      ));
      state.setTabs(prev => {
        const n = prev.filter(t => !completedIds.has(t.id));
        if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; state.setActiveProject(n[n.length - 1].id); }
        if (n.length === 0) state.setActiveProject("");
        return n;
      });
    },
  };
}
