---
date: 2026-04-04
slug: editor-image-block
tags: [codex, editor, feature, workstation]
agent: codex-main
---

# Workstation Editor Image Block

## What happened

Built a dedicated `image/` block for the workstation editor so users can add a single image without expanding the editor core hotspots. It now surfaces in the slash menu as `Single Image`.

## Built

**`dashboard/src/components/workstation/editor/blocks/image/`** — New isolated block folder with a self-contained image component, CSS module, and folder manifest.

**Block behavior** — Supports local image upload and direct image URLs, stores uploaded files as data URLs, exposes caption and alt-text fields, and lets the user switch between `contain` and `cover` presentation.

**Editor wiring** — Registered `image` in `lib/types.ts`, `lib/constants.ts`, the editor block defaults, the content block registry, forge block defaults, and `EditorMargin` summaries so slash insertion, rendering, and persistence all stay aligned.

## Verification

- `npm run lint` passes in `dashboard/` from the worktree
- `npm run build` passes in `dashboard/` from the worktree

## Notes

- The feature was built in branch `codex-editor-image-block`, verified there, and then cherry-picked onto `main`.
- Turbopack rejected a symlinked `node_modules` that pointed outside the worktree root, so final build verification used a local `npm install` inside the worktree dashboard directory.
