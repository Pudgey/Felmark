import type { CommandRegistryEntry } from "../types";
import { statusCommand } from "./status";
import { rateCommand } from "./rate";
import { clientCommand } from "./client";
import { pipelineCommand } from "./pipeline";
import { wireCommand } from "./wire";
import { clearCommand } from "./clear";
import { themeCommand } from "./theme";

export const COMMAND_REGISTRY: Record<string, CommandRegistryEntry> = {
  status: statusCommand,
  rate: rateCommand,
  client: clientCommand,
  pipeline: pipelineCommand,
  wire: wireCommand,
  clear: clearCommand,
  theme: themeCommand,
};
