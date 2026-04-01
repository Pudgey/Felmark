import type { Block } from "@/lib/types";
import { getDefaultAiActionData } from "@/components/workstation/editor/blocks/ai-action/AiActionBlock";

export const AI_DEFAULTS: Record<string, () => Partial<Block>> = {
  ai: () => ({}),
  "ai-action": () => ({ aiActionData: getDefaultAiActionData() }),
};
