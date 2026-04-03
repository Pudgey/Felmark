import type { Block } from "@/lib/types";

export const EDITOR_MEMORY_NAMESPACE = "felmark_workspace";
export const EDITOR_MEMORY_STORAGE_KEY = "editorMemory";
export const LEGACY_BLOCKS_STORAGE_KEY = "blocksMap";
export const LEGACY_SAVED_AT_STORAGE_KEY = "lastSavedAt";
export const EDITOR_MEMORY_SCHEMA_VERSION = 1;

export interface EditorMemorySnapshot {
  schemaVersion: number;
  savedAt: number | null;
  blocksMap: Record<string, Block[]>;
}

export interface EditorMemoryFallbackConversion {
  projectId: string;
  blockId: string;
  fromType: string;
  toType: Block["type"];
  reason: string;
}

export interface EditorMemoryMigrationResult {
  snapshot: EditorMemorySnapshot;
  migrationsApplied: string[];
  deprecatedBlockTypes: string[];
  fallbackConversions: EditorMemoryFallbackConversion[];
}

export interface EditorMemoryDebugReport {
  schemaVersion: number;
  projectCount: number;
  blockCount: number;
  migrationsApplied: string[];
  unknownBlockTypes: string[];
  deprecatedBlockTypes: string[];
  fallbackConversions: EditorMemoryFallbackConversion[];
}

export interface EditorMemoryLoadResult {
  source: "snapshot" | "legacy" | "empty";
  snapshot: EditorMemorySnapshot;
  report: EditorMemoryDebugReport;
}

export interface EditorMemoryStorageAdapter {
  load(key: string): unknown;
  save(key: string, value: unknown): void;
}

export interface EditorMemoryConfig {
  storageKey?: string;
  supportedBlockTypes?: ReadonlySet<string>;
}
