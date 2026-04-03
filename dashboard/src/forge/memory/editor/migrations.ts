import type { Block } from "@/lib/types";
import {
  EDITOR_MEMORY_SCHEMA_VERSION,
  type EditorMemoryFallbackConversion,
  type EditorMemoryMigrationResult,
  type EditorMemorySnapshot,
} from "./types";

type UnknownRecord = Record<string, unknown>;

type LegacyColumnsBlock = {
  id?: string;
  type: "columns";
  content?: string;
  checked?: boolean;
  columnsData?: {
    columns?: Array<{
      label?: string;
      content?: string;
    }>;
  };
};

type LegacyDataChipsBlock = {
  id?: string;
  type: "data-chips";
  content?: string;
  checked?: boolean;
  dataChipsData?: {
    chips?: Array<{
      label?: string;
      type?: string;
    }>;
  };
};

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createFallbackConversion(
  projectId: string,
  blockId: string,
  fromType: string,
): EditorMemoryFallbackConversion {
  return {
    projectId,
    blockId,
    fromType,
    toType: "callout",
    reason: "Legacy block type is no longer mounted by the workstation editor.",
  };
}

function migrateColumnsBlock(
  projectId: string,
  block: LegacyColumnsBlock,
  index: number,
): { block: Block; conversion: EditorMemoryFallbackConversion } {
  const blockId = block.id || `legacy-columns-${projectId}-${index}`;
  const sections = (block.columnsData?.columns ?? [])
    .map((column, columnIndex) => {
      const label = escapeHtml(column.label?.trim() || `Column ${columnIndex + 1}`);
      const content = escapeHtml(column.content?.trim() || "");
      return content ? `<strong>${label}</strong><br>${content}` : `<strong>${label}</strong>`;
    })
    .filter(Boolean);

  return {
    block: {
      id: blockId,
      type: "callout",
      checked: Boolean(block.checked),
      content: sections.join("<br><br>") || block.content || "Legacy columns block",
    },
    conversion: createFallbackConversion(projectId, blockId, "columns"),
  };
}

function migrateDataChipsBlock(
  projectId: string,
  block: LegacyDataChipsBlock,
  index: number,
): { block: Block; conversion: EditorMemoryFallbackConversion } {
  const blockId = block.id || `legacy-data-chips-${projectId}-${index}`;
  const chips = (block.dataChipsData?.chips ?? [])
    .map((chip) => chip.label?.trim() || chip.type?.trim() || "")
    .filter(Boolean)
    .map((label) => `<strong>${escapeHtml(label)}</strong>`);

  return {
    block: {
      id: blockId,
      type: "callout",
      checked: Boolean(block.checked),
      content: chips.join(" • ") || block.content || "Legacy data chips block",
    },
    conversion: createFallbackConversion(projectId, blockId, "data-chips"),
  };
}

function coerceStoredBlock(block: UnknownRecord): Block | null {
  if (
    typeof block.id !== "string" ||
    typeof block.type !== "string" ||
    typeof block.content !== "string"
  ) {
    return null;
  }

  return {
    ...(block as unknown as Block),
    checked: Boolean(block.checked),
  };
}

function normalizeProjectBlocks(
  projectId: string,
  rawBlocks: unknown,
  migrationsApplied: Set<string>,
  deprecatedBlockTypes: Set<string>,
  fallbackConversions: EditorMemoryFallbackConversion[],
): Block[] {
  if (!Array.isArray(rawBlocks)) return [];

  return rawBlocks.flatMap((rawBlock, index) => {
    if (!isObject(rawBlock) || typeof rawBlock.type !== "string") return [];

    if (rawBlock.type === "columns") {
      const migrated = migrateColumnsBlock(projectId, rawBlock as LegacyColumnsBlock, index);
      migrationsApplied.add("legacy-columns-to-callout");
      deprecatedBlockTypes.add("columns");
      fallbackConversions.push(migrated.conversion);
      return [migrated.block];
    }

    if (rawBlock.type === "data-chips") {
      const migrated = migrateDataChipsBlock(projectId, rawBlock as LegacyDataChipsBlock, index);
      migrationsApplied.add("legacy-data-chips-to-callout");
      deprecatedBlockTypes.add("data-chips");
      fallbackConversions.push(migrated.conversion);
      return [migrated.block];
    }

    const block = coerceStoredBlock(rawBlock);
    return block ? [block] : [];
  });
}

export function createEditorMemorySnapshot(
  blocksMap: Record<string, Block[]>,
  savedAt: number | null = null,
): EditorMemorySnapshot {
  return {
    schemaVersion: EDITOR_MEMORY_SCHEMA_VERSION,
    savedAt,
    blocksMap,
  };
}

export function normalizeEditorMemoryBlocks(
  rawBlocksMap: unknown,
  savedAt: number | null = null,
): EditorMemoryMigrationResult {
  const migrationsApplied = new Set<string>();
  const deprecatedBlockTypes = new Set<string>();
  const fallbackConversions: EditorMemoryFallbackConversion[] = [];

  if (!isObject(rawBlocksMap)) {
    return {
      snapshot: createEditorMemorySnapshot({}, savedAt),
      migrationsApplied: [],
      deprecatedBlockTypes: [],
      fallbackConversions,
    };
  }

  const blocksMap = Object.fromEntries(
    Object.entries(rawBlocksMap).map(([projectId, rawBlocks]) => [
      projectId,
      normalizeProjectBlocks(
        projectId,
        rawBlocks,
        migrationsApplied,
        deprecatedBlockTypes,
        fallbackConversions,
      ),
    ]),
  );

  return {
    snapshot: createEditorMemorySnapshot(blocksMap, savedAt),
    migrationsApplied: [...migrationsApplied],
    deprecatedBlockTypes: [...deprecatedBlockTypes],
    fallbackConversions,
  };
}
