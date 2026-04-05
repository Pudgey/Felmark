# 2026-04-05 — Theme Color Migration + Rail Terminal Surface

## What happened

Two major pieces of work in one session.

### 1. Theme Color Migration — SHIPPED

Replaced 380+ hardcoded color instances across 66 editor block files (36 CSS modules + 28 TSX files) with theme-aware CSS variables and `color-mix()` expressions. Extended the theme system with 5 new surface tokens (`card`, `cardTint`, `bg`, `border`, `borderLight`) across all 10 themes. Also added workspace semantic fields (`positive`, `urgent`, `signal`, `caution`, `muted`) that were previously unstaged.

Blocks now adapt to all 10 themes. White backgrounds use `var(--card)`, semantic colors use `var(--success/error/info)`, shadows use `color-mix(in srgb, var(--ink-900) N%, transparent)`. ~100 instances intentionally kept hardcoded (drawing sticky notes, decision palettes, block identity accents, contrast text).

### 2. Rail Terminal Surface — SHIPPED

Built a dedicated rail-level terminal with split layout: command terminal left, feature preview right. 13 new files. Terminal has macOS-style chrome bar (traffic light dots), dark `var(--rail-bg)` window embedded in a light parchment surface with dot grid background. Preview pane uses compact list design (Style A) — dense rows, amber hover, keyboard shortcut keys, surfaces as nav rows.

Added debrief/welcome system: Welcome A (Guided Setup) for first-time users, Debrief C (Agenda) for daily visits, Debrief B (Pulse) for repeat visits same day. All with demo data and `✦ forge` AI recommendation blocks.

Moved terminal icon to fixed bottom position in rail (replacing zen mode). Zen mode removed from rail — can be accessed via keyboard shortcut or settings.

## Decisions

- `color-mix()` over new CSS variables for opacity tints — matches workspace pane pattern, zero new theme properties needed
- Block identity colors (AI purple, Question amber) stay hardcoded — intentional per-block branding
- Terminal surface reuses SharedTerminalProvider — same session across workspace pane and rail terminal
- FeatureGrid uses compact list (no cards) — reads from COMMAND_REGISTRY dynamically
- Debrief detection via localStorage (`felmark_terminal_welcomed`, `felmark_terminal_last_debrief`)
- Zen mode removed from rail, terminal takes its fixed bottom spot

## Tags

`theme`, `terminal`, `feature`, `architecture`, `refactor`
