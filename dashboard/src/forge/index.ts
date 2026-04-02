import type { StateUpdater } from "./types";
import { createWorkstationServices } from "./services/workstations";
import { createProjectServices } from "./services/projects";
import { createDocumentServices } from "./services/documents";
import { createTabServices } from "./services/tabs";
import { createFinanceServices } from "./domains/finance/service";
import { createSidebarReadModels } from "./read-models/sidebar";

export type { ForgeState, ForgeContext, ForgeResult, ForgeSource, StateUpdater } from "./types";
export type { FinanceAmountSummary, FinanceShellSummary, FinanceWorkstationSummary } from "./domains/finance/types";
export type { SidebarShellSummary, SidebarWorkstationSummary } from "./read-models/sidebar";

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
  workstations: ReturnType<typeof createWorkstationServices>;
  projects: ReturnType<typeof createProjectServices>;
  documents: ReturnType<typeof createDocumentServices>;
  tabs: ReturnType<typeof createTabServices>;
  finance: ReturnType<typeof createFinanceServices>;
  readModels: {
    sidebar: ReturnType<typeof createSidebarReadModels>;
  };
}

/** Create a forge instance from a state updater */
export function createForge(state: StateUpdater): Forge {
  const finance = createFinanceServices(state);

  return {
    workstations: createWorkstationServices(state),
    projects: createProjectServices(state),
    documents: createDocumentServices(state),
    tabs: createTabServices(state),
    finance,
    readModels: {
      sidebar: createSidebarReadModels(state),
    },
  };
}
