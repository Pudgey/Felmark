# 2026-04-03 — Split Pane Architecture

## Summary

Created a conductor design document for Felmark's future split-pane workspace system based on tmux's layout-tree architecture.

## What Changed

- Added `conductor/FELMARK_SPLIT_PANE_ARCHITECTURE.md`
- Captured the core separation of concerns:
  - layout engine for structure and geometry
  - surface manager for pane lifecycle and focus
  - workspace commands for user intent
- Defined the proposed layout tree, pane lifecycle, resize model, zoom behavior, presets, and phased implementation plan

## Notes

- This was a documentation-only pass. No runtime code changed.
- The document is intended as a reference before any split-pane build work begins in `dashboard/`.

## Tags

- `architecture`
- `conductor`
