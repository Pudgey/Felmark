# 2026-03-30 — Massive Feature Sprint

**Tags**: graph-blocks, money-blocks, deadline-blocks, date-system, block-deletion, competitive-intel, sidebar, calendar, terminal-welcome, outline-margin

## Summary

Two-day sprint that transformed Felmark from a basic block editor into a full freelancer operating system. Built 7 graph chart types with inline editing, 6 financial block types, deadline blocks with date pickers, inline @date chips, block deletion, real ISO dates replacing hardcoded strings, personal workspace segments, notification bell, drag-to-reorder from outline, and competitive intelligence reports.

## Key Decisions

1. **Graph/money blocks use sub-picker pattern** — single BlockType with a sub-type field, same as deliverable. Prevents type union bloat.
2. **Dates are ISO strings, not display strings** — `Project.due` is now `"2026-04-03"` not `"Apr 3"`. `daysLeft` computed dynamically.
3. **Personal workspace is permanent** — can't archive the last one. Sidebar has dedicated "personal" section.
4. **Slash Command Checklist** created as an engineering standard — 10 required touchpoints for any new block type.
5. **@date inline chip stored as HTML span** with `data-felmark-date` attribute — not a block type, lives inside paragraph content.

## Patterns Observed

- Block types are proliferating fast (now 20+). The sub-picker pattern (graph, money) scales better than individual BlockType entries.
- The outline margin is becoming a real control surface (color-coded, draggable) — may need its own mission doc soon.
- Hydration mismatches from Date/time rendering are a recurring issue with SSR — always defer to client with `mounted` state.

## Files Changed

~40+ files modified across types, constants, components, CSS modules, prototypes, missions, standards, and competitive intel.
