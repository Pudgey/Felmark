# Active Context — 2026-03-30

## Product Snapshot

Felmark is actively building the browser-native dashboard experience in `dashboard/`. The block editor now has 50+ block types including the new `/drawing` block with 8 visual component types. Editor infrastructure was significantly hardened this session (drag-drop, slash menu, focus management).

## Current Focus

- Block editor polish and hardening (drag-drop, slash menu viewport awareness, empty block handling)
- Workspace home, sidebar, and calendar integration
- Services, Templates, and The Wire surfaces wiring
- Codex running parallel polish packs (autosave feedback, block focus clarity, insert cues)

## Architecture Status

| Area | Status |
|------|--------|
| Dashboard app | In active local development |
| Chrome extension shell | Not started |
| Shared conductor skill library | Updated for Felmark's current stack |
| GUARDRAIL.md | New — feature/block registry + codebase pulse thresholds |

## Recent Completed Work

- `/drawing` block with 8 component types (flowchart, user flow, device frames, sitemap, sticky notes, sketch chart, stamps, wireframe kit)
- Drag-and-drop hardened for ALL block types via `wrapBlock` helper (was only working on text blocks)
- Slash menu repositioned to viewport-aware fixed positioning (flips above when near bottom)
- Empty block focus race condition fixed with `focusNew` retry pattern
- Placeholder system hardened: CSS `:empty` replaced with JS-managed `is-empty` class
- Outline sidebar right-click context menu added (Go to block, Delete block)
- Click-on-empty-space creates new block behavior added
- Codex parallel: slash menu ranking, template card hover, share modal hardening, rail icon tooltips, micro-polish audit

## Pending Manual Actions

- Decide when to wire Services, Templates, and The Wire to production components
- Review GUARDRAIL.md thresholds as codebase grows
