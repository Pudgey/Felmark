import type { StateUpdater } from "./types";
import { createWorkstationServices } from "./services/workstations";
import { createProjectServices } from "./services/projects";
import { createDocumentServices } from "./services/documents";
import { createTabServices } from "./services/tabs";

export type { ForgeState, ForgeContext, ForgeResult, ForgeSource, StateUpdater } from "./types";
export {
  loadEditorMemory,
  saveEditorMemory,
  createEditorMemorySnapshot,
  normalizeEditorMemoryBlocks,
  createLocalStorageAdapter,
  getEditorMemoryStorageSlot,
  buildEditorMemoryDebugReport,
  EDITOR_MEMORY_NAMESPACE,
  EDITOR_MEMORY_SCHEMA_VERSION,
  EDITOR_MEMORY_STORAGE_KEY,
  LEGACY_BLOCKS_STORAGE_KEY,
  LEGACY_SAVED_AT_STORAGE_KEY,
} from "./memory";
export type {
  EditorMemoryConfig,
  EditorMemoryDebugReport,
  EditorMemoryFallbackConversion,
  EditorMemoryLoadResult,
  EditorMemoryMigrationResult,
  EditorMemorySnapshot,
  EditorMemoryStorageAdapter,
} from "./memory";

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
}

/** Create a forge instance from a state updater */
export function createForge(state: StateUpdater): Forge {
  return {
    workstations: createWorkstationServices(state),
    projects: createProjectServices(state),
    documents: createDocumentServices(state),
    tabs: createTabServices(state),
  };
}
