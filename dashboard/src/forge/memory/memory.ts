import type { Block } from "@/lib/types";
import { buildEditorMemoryDebugReport } from "./debug";
import { createEditorMemorySnapshot, normalizeEditorMemoryBlocks } from "./migrations";
import { createLocalStorageAdapter } from "./storage";
import {
  EDITOR_MEMORY_SCHEMA_VERSION,
  EDITOR_MEMORY_STORAGE_KEY,
  LEGACY_BLOCKS_STORAGE_KEY,
  LEGACY_SAVED_AT_STORAGE_KEY,
  type EditorMemoryConfig,
  type EditorMemoryLoadResult,
  type EditorMemorySnapshot,
  type EditorMemoryStorageAdapter,
} from "./types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEditorMemorySnapshot(value: unknown): value is EditorMemorySnapshot {
  return (
    isObject(value) &&
    typeof value.schemaVersion === "number" &&
    value.schemaVersion <= EDITOR_MEMORY_SCHEMA_VERSION &&
    "blocksMap" in value
  );
}

function coerceSavedAt(value: unknown): number | null {
  return typeof value === "number" ? value : null;
}

export function loadEditorMemory(
  config: EditorMemoryConfig = {},
  adapter: EditorMemoryStorageAdapter = createLocalStorageAdapter(),
): EditorMemoryLoadResult {
  const storageKey = config.storageKey ?? EDITOR_MEMORY_STORAGE_KEY;
  const rawSnapshot = adapter.load(storageKey);
  const migrationResult = isEditorMemorySnapshot(rawSnapshot)
    ? normalizeEditorMemoryBlocks(rawSnapshot.blocksMap, coerceSavedAt(rawSnapshot.savedAt))
    : normalizeEditorMemoryBlocks(
      adapter.load(LEGACY_BLOCKS_STORAGE_KEY),
      coerceSavedAt(adapter.load(LEGACY_SAVED_AT_STORAGE_KEY)),
    );

  return {
    snapshot: migrationResult.snapshot,
    report: buildEditorMemoryDebugReport(
      migrationResult,
      config.supportedBlockTypes,
    ),
  };
}

export function saveEditorMemory(
  blocksMap: Record<string, Block[]>,
  savedAt: number | null,
  config: EditorMemoryConfig = {},
  adapter: EditorMemoryStorageAdapter = createLocalStorageAdapter(),
): EditorMemorySnapshot {
  const storageKey = config.storageKey ?? EDITOR_MEMORY_STORAGE_KEY;
  const snapshot = createEditorMemorySnapshot(blocksMap, savedAt);
  adapter.save(storageKey, snapshot);
  return snapshot;
}
