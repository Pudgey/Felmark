import type { Block } from "@/lib/types";

export const AI_DEFAULTS: Record<string, () => Partial<Block>> = {
  ai: () => ({}), // AI block has no default data — it shows the prompt input
  "ai-action": () => ({
    aiActionData: { mode: "summarize", output: "", targetLabel: "", ran: false },
  }),
};
