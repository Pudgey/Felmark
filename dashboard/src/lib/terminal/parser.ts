import type { ParsedCommand } from "./types";

/**
 * Parse a terminal command string into structured data.
 * Handles:
 *   /command action --key "quoted value" --flag positional args
 *   command (without slash)
 */
export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim();
  const stripped = raw.startsWith("/") ? raw.slice(1) : raw;

  if (!stripped) {
    return { raw, command: "", action: "", args: {}, positional: [] };
  }

  const tokens = tokenize(stripped);
  const command = (tokens.shift() || "").toLowerCase();
  const args: Record<string, string> = {};
  const positional: string[] = [];
  let action = "";

  let i = 0;
  // First non-flag token after command is the action
  if (tokens.length > 0 && !tokens[0].startsWith("--")) {
    action = tokens[0];
    i = 1;
  }

  while (i < tokens.length) {
    const token = tokens[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      // Next token is the value (if it exists and is not another flag)
      if (i + 1 < tokens.length && !tokens[i + 1].startsWith("--")) {
        args[key] = tokens[i + 1];
        i += 2;
      } else {
        args[key] = "true";
        i += 1;
      }
    } else {
      positional.push(token);
      i += 1;
    }
  }

  return { raw, command, action, args, positional };
}

/** Tokenize respecting quoted strings */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  if (current) tokens.push(current);
  return tokens;
}
