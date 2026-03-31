import type { Block } from "@/lib/types";

/** Basic block types — no special data, just type change */
export const BASIC_DEFAULTS: Record<string, () => Partial<Block>> = {
  paragraph: () => ({}),
  h1: () => ({}),
  h2: () => ({}),
  h3: () => ({}),
  bullet: () => ({}),
  numbered: () => ({}),
  todo: () => ({}),
  quote: () => ({}),
  code: () => ({}),
  callout: () => ({}),
  divider: () => ({}),
};
