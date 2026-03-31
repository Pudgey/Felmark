import type { StateUpdater } from "../types";

export function createTabServices(state: StateUpdater) {
  return {
    /** Click a tab — make it active */
    select(tabId: string) {
      state.setActiveProject(tabId);
      state.setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
    },

    /** Close a tab */
    close(tabId: string) {
      state.setTabs(prev => {
        const n = prev.filter(t => t.id !== tabId);
        if (n.length > 0 && !n.some(t => t.active)) {
          n[n.length - 1].active = true;
          state.setActiveProject(n[n.length - 1].id);
        }
        if (n.length === 0) {
          state.setActiveProject("");
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

    /** Deactivate all tabs (e.g. when going to home) */
    deactivateAll() {
      state.setTabs(prev => prev.map(t => ({ ...t, active: false })));
      state.setActiveProject("");
    },
  };
}
