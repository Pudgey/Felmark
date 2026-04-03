import type { EditorMemoryDebugReport, EditorMemoryMigrationResult } from "./types";

export function buildEditorMemoryDebugReport(
  migrationResult: EditorMemoryMigrationResult,
  supportedBlockTypes: ReadonlySet<string> = new Set<string>(),
): EditorMemoryDebugReport {
  const projects = Object.values(migrationResult.snapshot.blocksMap);
  const blocks = projects.flat();
  const unknownBlockTypes = supportedBlockTypes.size === 0
    ? []
    : [...new Set(
      blocks
        .map((block) => block.type)
        .filter((type) => !supportedBlockTypes.has(type)),
    )].sort();

  return {
    schemaVersion: migrationResult.snapshot.schemaVersion,
    projectCount: projects.length,
    blockCount: blocks.length,
    migrationsApplied: migrationResult.migrationsApplied,
    unknownBlockTypes,
    deprecatedBlockTypes: migrationResult.deprecatedBlockTypes,
    fallbackConversions: migrationResult.fallbackConversions,
  };
}
