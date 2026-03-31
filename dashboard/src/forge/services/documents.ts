import type { Block } from "@/lib/types";
import type { StateUpdater } from "../types";

export function createDocumentServices(state: StateUpdater) {
  return {
    /** Get blocks for a project */
    getBlocks(projectId: string): Block[] {
      return state.getState().blocksMap[projectId] || [];
    },

    /** Set blocks for a project */
    setBlocks(projectId: string, blocks: Block[]) {
      state.setBlocksMap(prev => ({ ...prev, [projectId]: blocks }));
    },

    /** Append a block to a project's document */
    appendBlock(projectId: string, block: Block) {
      state.setBlocksMap(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), block],
      }));
    },

    /** Remove a block from a project's document */
    removeBlock(projectId: string, blockId: string) {
      state.setBlocksMap(prev => ({
        ...prev,
        [projectId]: (prev[projectId] || []).filter(b => b.id !== blockId),
      }));
    },
  };
}
