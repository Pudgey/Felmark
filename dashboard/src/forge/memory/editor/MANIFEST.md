# forge/memory/editor/

Editor block snapshot persistence — loads, saves, migrates, and debugs persisted editor state in localStorage.

## Exports

| Export | Type | File | Description |
|--------|------|------|-------------|
| `loadEditorMemory` | function | `memory.ts` | Load editor state from storage, migrate legacy format |
| `saveEditorMemory` | function | `memory.ts` | Persist a blocks map snapshot to storage |
| `createEditorMemorySnapshot` | function | `migrations.ts` | Create a typed snapshot object from a blocks map |
| `normalizeEditorMemoryBlocks` | function | `migrations.ts` | Normalize raw stored blocks, run schema migrations |
| `createLocalStorageAdapter` | function | `storage.ts` | Create an `EditorMemoryStorageAdapter` backed by `window.localStorage` |
| `getEditorMemoryStorageSlot` | function | `storage.ts` | Compute the namespaced localStorage key |
| `buildEditorMemoryDebugReport` | function | `debug.ts` | Produce a `EditorMemoryDebugReport` from a migration result |
| `EDITOR_MEMORY_NAMESPACE` | const | `types.ts` | Storage namespace prefix (`felmark_workspace`) |
| `EDITOR_MEMORY_STORAGE_KEY` | const | `types.ts` | Primary storage key (`editorMemory`) |
| `EDITOR_MEMORY_SCHEMA_VERSION` | const | `types.ts` | Current schema version number |
| `LEGACY_BLOCKS_STORAGE_KEY` | const | `types.ts` | Legacy blocks key (`blocksMap`) |
| `LEGACY_SAVED_AT_STORAGE_KEY` | const | `types.ts` | Legacy savedAt key (`lastSavedAt`) |
| `EditorMemoryConfig` | type | `types.ts` | Config options for load/save |
| `EditorMemoryDebugReport` | type | `types.ts` | Diagnostic report shape |
| `EditorMemoryFallbackConversion` | type | `types.ts` | Record of a legacy block conversion |
| `EditorMemoryLoadResult` | type | `types.ts` | Return shape for `loadEditorMemory` |
| `EditorMemoryMigrationResult` | type | `types.ts` | Internal migration pipeline result |
| `EditorMemorySnapshot` | type | `types.ts` | Persisted snapshot shape |
| `EditorMemoryStorageAdapter` | type | `types.ts` | Storage abstraction interface |

## Dependencies

- `@/lib/types` — `Block`

## Imported By

- `forge/memory/index.ts` — parent barrel re-exports everything

## Files

| File | Purpose |
|------|---------|
| `types.ts` | Constants + all TypeScript interfaces for the memory system |
| `storage.ts` | `localStorage` adapter + storage slot helper |
| `migrations.ts` | Schema migration pipeline (columns, data-chips → callout) |
| `memory.ts` | Public `loadEditorMemory` / `saveEditorMemory` API |
| `debug.ts` | `buildEditorMemoryDebugReport` diagnostic utility |
| `index.ts` | Barrel — re-exports everything above |
