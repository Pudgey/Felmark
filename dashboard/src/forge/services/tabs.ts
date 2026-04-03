import type { StateUpdater } from "../types";

export function createTabServices(state: StateUpdater) {
  /** Find the workstation that owns a project */
  const findOwner = (projectId: string) =>
    state.getState().workstations.find(w => w.projects.some(p => p.id === projectId));

  /** Fall back to personal workstation's first project */
  const fallbackToPersonal = () => {
    const { workstations } = state.getState();
    const personal = workstations.find(w => w.personal);
    const fallback = personal?.projects[0];
    if (personal && fallback) {
      state.setActiveProject(fallback.id);
      state.setActiveWorkstationId(personal.id);
      return { id: fallback.id, name: fallback.name, client: personal.client, active: true as const };
    }
    state.setActiveProject("");
    state.setActiveWorkstationId(null);
    return null;
  };

  return {
    /** Click a tab — make it active */
    select(tabId: string) {
      state.setActiveProject(tabId);
      state.setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
      const ws = findOwner(tabId);
      if (ws) state.setActiveWorkstationId(ws.id);
    },

    /** Close a tab */
    close(tabId: string) {
      state.setTabs(prev => {
        const n = prev.filter(t => t.id !== tabId);
        if (n.length > 0 && !n.some(t => t.active)) {
          n[n.length - 1].active = true;
          state.setActiveProject(n[n.length - 1].id);
          const ws = findOwner(n[n.length - 1].id);
          if (ws) state.setActiveWorkstationId(ws.id);
        }
        if (n.length === 0) {
          const tab = fallbackToPersonal();
          if (tab) n.push(tab);
        }
        return n;
      });
    },

    /** Rename a tab */
    rename(tabId: string, name: string) {
      state.setTabs(prev => prev.map(t => t.id === tabId ? { ...t, name } : t));
    },

    /** Reorder tabs via drag */
    reorder(sourceId: string, targetId: string, position: "before" | "after") {
      if (sourceId === targetId) return;
      state.setTabs(prev => {
        const sourceIndex = prev.findIndex(t => t.id === sourceId);
        if (sourceIndex === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(sourceIndex, 1);
        const targetIndex = next.findIndex(t => t.id === targetId);
        if (!moved || targetIndex === -1) return prev;
        const insertIndex = position === "after" ? targetIndex + 1 : targetIndex;
        next.splice(insertIndex, 0, moved);
        return next;
      });
    },

    /** Deactivate all tabs — falls back to personal */
    deactivateAll() {
      state.setTabs(prev => prev.map(t => ({ ...t, active: false })));
      fallbackToPersonal();
    },
  };
}
