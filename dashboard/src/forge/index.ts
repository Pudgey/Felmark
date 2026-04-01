import type { StateUpdater, ForgeContext } from "./types";
import { createWorkspaceServices } from "./services/workspaces";
import { createProjectServices } from "./services/projects";
import { createDocumentServices } from "./services/documents";
import { createTabServices } from "./services/tabs";

export type { ForgeState, ForgeContext, ForgeResult, ForgeSource, StateUpdater } from "./types";

// Block operations — shared between Editor and Forge Paper
export {
  getBlockDefaults,
  needsTrailingParagraph,
  needsPicker,
  createEmptyBlock,
  createEmptyDocument,
  convertBlock,
  insertAfter,
  removeBlock,
} from "./services/blocks";

export interface Forge {
  workspaces: ReturnType<typeof createWorkspaceServices>;
  projects: ReturnType<typeof createProjectServices>;
  documents: ReturnType<typeof createDocumentServices>;
  tabs: ReturnType<typeof createTabServices>;
}

/** Create a forge instance from a state updater */
export function createForge(state: StateUpdater): Forge {
  return {
    workspaces: createWorkspaceServices(state),
    projects: createProjectServices(state),
    documents: createDocumentServices(state),
    tabs: createTabServices(state),
  };
}
