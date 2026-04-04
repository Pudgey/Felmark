import type { Block, BlockType } from "@/lib/types";
import { uid } from "@/lib/utils";
import { BASIC_DEFAULTS } from "./basic";
import { CONTENT_DEFAULTS } from "./content";
import { VISUAL_DEFAULTS } from "./visual";
import { MONEY_DEFAULTS } from "./money";
import { COLLABORATION_DEFAULTS } from "./collaboration";
import { AI_DEFAULTS } from "./ai";
import { UNIQUE_DEFAULTS } from "./unique";

// ── Merge all defaults into one registry ──
const ALL_DEFAULTS: Record<string, () => Partial<Block>> = {
  ...BASIC_DEFAULTS,
  ...CONTENT_DEFAULTS,
  ...VISUAL_DEFAULTS,
  ...MONEY_DEFAULTS,
  ...COLLABORATION_DEFAULTS,
  ...AI_DEFAULTS,
  ...UNIQUE_DEFAULTS,
};

/** Get default data for a block type */
export function getBlockDefaults(type: BlockType): Partial<Block> {
  const factory = ALL_DEFAULTS[type];
  return factory ? factory() : {};
}

/** Check if a block type needs a trailing paragraph after insertion */
export function needsTrailingParagraph(type: BlockType): boolean {
  // These types are "full-width" blocks that shouldn't be typed into directly
  const fullBlocks = new Set([
    "divider",
    "graph",
    "money",
    "deliverable",
    "deadline",
    "canvas",
    "audio",
    "table",
    "accordion",
    "math",
    "image",
    "gallery",
    "swatches",
    "beforeafter",
    "bookmark",
    "timeline",
    "flow",
    "brandboard",
    "moodboard",
    "wireframe",
    "pullquote",
    "hero-spotlight",
    "kinetic-type",
    "number-cascade",
    "comment-thread",
    "mention",
    "question",
    "feedback",
    "decision",
    "poll",
    "handoff",
    "signoff",
    "annotation",
    "ai-action",
    "pricing-config",
    "scope-boundary",
    "asset-checklist",
    "decision-picker",
    "availability-picker",
    "progress-stream",
    "dependency-map",
    "revision-heatmap",
    "stat-reveal",
    "value-counter",
  ]);
  return fullBlocks.has(type);
}

/** Check if a block type needs a secondary picker (graph type, money type) */
export function needsPicker(type: BlockType): "graph" | "money" | "drawing" | null {
  if (type === "graph") return "graph";
  if (type === "money") return "money";
  if (type === "drawing") return "drawing";
  return null;
}

/** Create an empty block */
export function createEmptyBlock(type: BlockType = "paragraph"): Block {
  return { id: uid(), type, content: "", checked: false, ...getBlockDefaults(type) };
}

/** Create the default empty document (h1 + paragraph) */
export function createEmptyDocument(): Block[] {
  return [
    { id: uid(), type: "h1", content: "", checked: false },
    { id: uid(), type: "paragraph", content: "", checked: false },
  ];
}

/**
 * Convert an existing block to a new type.
 * Returns the updated blocks array and the ID of any new trailing block.
 */
export function convertBlock(
  blocks: Block[],
  blockId: string,
  type: BlockType,
): { blocks: Block[]; newBlockId: string | null } {
  const idx = blocks.findIndex((b) => b.id === blockId);
  if (idx === -1) return { blocks, newBlockId: null };

  const next = [...blocks];
  const defaults = getBlockDefaults(type);
  next[idx] = { ...next[idx], type, content: "", ...defaults };

  let newBlockId: string | null = null;

  // Add trailing paragraph for full-width blocks
  if (needsTrailingParagraph(type)) {
    const nid = uid();
    next.splice(idx + 1, 0, { id: nid, type: "paragraph", content: "", checked: false });
    newBlockId = nid;
  }

  return { blocks: next, newBlockId };
}

/**
 * Insert a new block after a given block.
 * Returns the updated blocks array and the new block's ID.
 */
export function insertAfter(
  blocks: Block[],
  afterId: string,
  type: BlockType = "paragraph",
): { blocks: Block[]; newBlockId: string } {
  const idx = blocks.findIndex((b) => b.id === afterId);
  const newBlock = createEmptyBlock(type);
  const next = [...blocks];
  next.splice(idx + 1, 0, newBlock);
  return { blocks: next, newBlockId: newBlock.id };
}

/**
 * Remove a block. Returns the updated blocks array.
 * If it's the last block, resets to an empty paragraph instead of removing.
 */
export function removeBlock(blocks: Block[], blockId: string): { blocks: Block[]; focusId: string | null } {
  if (blocks.length <= 1) {
    const empty = createEmptyBlock();
    return { blocks: [{ ...empty, id: blocks[0].id }], focusId: blocks[0].id };
  }
  const idx = blocks.findIndex((b) => b.id === blockId);
  const next = blocks.filter((b) => b.id !== blockId);
  const focusIdx = Math.max(0, idx - 1);
  return { blocks: next, focusId: next[focusIdx]?.id || null };
}
