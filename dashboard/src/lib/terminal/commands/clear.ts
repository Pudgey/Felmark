import type { CommandRegistryEntry } from "../types";

export const clearCommand: CommandRegistryEntry = {
  description: "Clear terminal output",
  icon: "⌫",
  category: "System",
  usage: "clear",
  handler: () => {
    // Special case: handled by Terminal component directly (clears blocks)
    return null;
  },
};
