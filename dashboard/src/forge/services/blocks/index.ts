export {
  getBlockDefaults,
  needsTrailingParagraph,
  needsPicker,
  createEmptyBlock,
  createEmptyDocument,
  convertBlock,
  insertAfter,
  removeBlock,
} from "./core";

// Re-export category defaults for direct access if needed
export { BASIC_DEFAULTS } from "./basic";
export { CONTENT_DEFAULTS } from "./content";
export { VISUAL_DEFAULTS } from "./visual";
export { MONEY_DEFAULTS } from "./money";
export { COLLABORATION_DEFAULTS } from "./collaboration";
export { AI_DEFAULTS } from "./ai";
export { UNIQUE_DEFAULTS } from "./unique";
