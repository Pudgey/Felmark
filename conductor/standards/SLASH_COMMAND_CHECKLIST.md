# Slash Command Integration Checklist

**Created**: 2026-03-29
**Last Reviewed**: 2026-03-29
**Next Review**: 2026-04-12

---

## Rule

When adding a new slash command block type (any block a user can insert via `/` in the editor), **every** touchpoint below must be updated in the same PR. No partial integrations.

---

## Checklist

| # | File / System | What to update |
|---|---|---|
| 1 | `lib/types.ts` | Add to `BlockType` union. If the block carries data beyond `content`, add an interface and optional field on `Block`. |
| 2 | `lib/constants.ts` → `BLOCK_TYPES` | Add entry with `type`, `label`, `icon` (text-only, no emoji), `desc`, `section`, `shortcut`. |
| 3 | `Editor.tsx` → `renderBlock` | Add rendering branch. Non-editable blocks (graph, divider) get their own `<div>` with gutter. Editable blocks go through `<EditableBlock>`. |
| 4 | `Editor.tsx` → `selectSlashItem` | Handle the new type — does it need a sub-picker? Does it insert a paragraph after (like divider/graph)? |
| 5 | `EditableBlock.tsx` → `PLACEHOLDERS` | Add placeholder text if the block is editable. |
| 6 | `EditableBlock.tsx` → `STYLES` | Add inline styles if the block is editable. |
| 7 | `margin/EditorMargin.tsx` → `BLOCK_LABELS` | Add label character (minimalist, matches existing style). |
| 8 | `margin/EditorMargin.tsx` → `BLOCK_LABEL_COLORS` | Add color for the outline gutter icon. |
| 9 | `margin/EditorMargin.tsx` → gutter preview | Handle preview text (e.g., graph shows its title, divider shows "divider"). |
| 10 | `Editor.module.css` | Add styles if the block has custom container rendering (callout border, quote border-left, etc.). |

## AI Prompt Sync (MANDATORY)

| # | File / System | What to update |
|---|---|---|
| 11 | `app/api/generate/route.ts` → `SYSTEM_PROMPT` | Add the new block type to the BLOCK TYPES section with its JSON schema. Add intent mapping keywords. |
| 12 | `components/editor/ai/AiBlock.tsx` → `getFallbackBlocks` | Add a pattern match for the new block type so offline/fallback generation works. |
| 13 | `components/editor/ai/AiBlock.tsx` → `streamBlocks` | Add type mapping in the block mapper if the new block carries special data (graphData, moneyData, etc.). |

**Why this is mandatory:** If the AI doesn't know a block type exists, it will describe it in text instead of generating it. Every new block must be added to the system prompt so `/ai create a [new block]` actually produces the block.

---

## Optional (if applicable)

| # | System | When needed |
|---|---|---|
| 14 | `lib/utils.ts` → `makeBlocks` | If the new block type should appear in workspace templates (proposal, brief, etc.). |
| 15 | `onBackspace` handler | If the block needs special backspace behavior (e.g., convert to paragraph before deleting). |
| 16 | Keyboard shortcuts | If the block has a markdown-style trigger (e.g., `---` for divider, `>` for quote). |
| 17 | Export (Markdown/JSON/plain text) | If the block needs custom serialization for export. |
| 18 | Dark mode | If the block has custom colors, ensure dark mode variants exist. |

---

## Example: Adding `/graph`

1. `types.ts` — Added `"graph"` to BlockType, created `GraphType`, `GraphBlockData`, added `graphData?` to Block
2. `constants.ts` — Added `{ type: "graph", label: "Graph", icon: "▥", ... }`
3. `Editor.tsx` → `renderBlock` — Graph branch renders `<GraphBlockComponent>`, sub-picker branch renders type selector
4. `Editor.tsx` → `selectSlashItem` — Graph opens sub-picker instead of inserting directly
5. `EditableBlock` — N/A (graph is non-editable)
6. `EditableBlock` — N/A
7. `EditorMargin` → `BLOCK_LABELS` — Added `graph: "▥"`
8. `EditorMargin` → `BLOCK_LABEL_COLORS` — Added `graph: "#5b7fa4"`
9. `EditorMargin` → preview — Shows `graphData.title` or fallback `"chart"`
10. `Editor.module.css` — N/A (graph uses its own CSS module)
