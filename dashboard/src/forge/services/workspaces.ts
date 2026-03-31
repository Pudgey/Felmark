import type { Workspace, Project, WorkspaceTemplate } from "@/lib/types";
import type { StateUpdater, ForgeResult } from "../types";
import { uid, makeBlocks } from "@/lib/utils";

export function createWorkspaceServices(state: StateUpdater) {
  return {
    /** Toggle workspace expand/collapse */
    toggle(wsId: string) {
      state.setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, open: !w.open } : w));
    },

    /** Rename a workspace */
    rename(wsId: string, name: string) {
      state.setWorkspaces(prev => prev.map(w => w.id === wsId ? { ...w, client: name, avatar: name[0].toUpperCase() } : w));
      // Also update any open tabs that reference this workspace
      const ws = state.getState().workspaces.find(w => w.id === wsId);
      if (ws) {
        state.setTabs(prev => prev.map(t => {
          if (ws.projects.some(p => p.id === t.id)) return { ...t, client: name };
          return t;
        }));
      }
    },

    /** Reorder workspaces via drag */
    reorder(fromIdx: number, toIdx: number) {
      state.setWorkspaces(prev => {
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        return next;
      });
    },

    /** Create a new workspace with a project from onboarding data */
    create(data: { name: string; contact: string; rate: string; budget: string; color: string; template: WorkspaceTemplate }): { wsId: string; projectId: string; projectName: string } {
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

      state.setWorkspaces(prev => [...prev, {
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

    /** Quick-create workspace (skip onboarding) */
    quickCreate(name: string): { wsId: string; projectId: string } {
      const wsId = uid();
      const projectId = uid();
      const { blocks } = makeBlocks("blank", name);

      state.setWorkspaces(prev => [...prev, {
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

    /** Archive an entire workspace */
    archive(wsId: string): ForgeResult {
      const ws = state.getState().workspaces.find(w => w.id === wsId);
      if (!ws) return { ok: false, error: "Workspace not found" };
      if (ws.personal && state.getState().workspaces.filter(w => w.personal).length <= 1) {
        return { ok: false, error: "Cannot archive the last personal workspace" };
      }

      state.setArchived(prev => [...prev, ...ws.projects.map(project => ({
        project, workspaceId: ws.id, workspaceName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }))]);

      const projectIds = new Set(ws.projects.map(p => p.id));
      state.setWorkspaces(prev => prev.filter(w => w.id !== wsId));
      state.setTabs(prev => {
        const n = prev.filter(t => !projectIds.has(t.id));
        if (n.length > 0 && !n.some(t => t.active)) { n[n.length - 1].active = true; state.setActiveProject(n[n.length - 1].id); }
        if (n.length === 0) state.setActiveProject("");
        return n;
      });

      return { ok: true, data: undefined };
    },

    /** Archive all completed projects in a workspace */
    archiveCompleted(wsId: string) {
      const ws = state.getState().workspaces.find(w => w.id === wsId);
      if (!ws) return;
      const completed = ws.projects.filter(p => p.status === "completed");
      if (completed.length === 0) return;

      state.setArchived(prev => [...prev, ...completed.map(project => ({
        project, workspaceId: ws.id, workspaceName: ws.client,
        archivedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }))]);

      const completedIds = new Set(completed.map(p => p.id));
      state.setWorkspaces(prev => prev.map(w =>
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
