# Debrief -- Manifest

> Auto-maintained by AI. Updated on every file change in this folder.

## Exports
- `WelcomeSetup` -- First-time guided setup screen (Welcome A)
- `DebriefAgenda` -- Daily agenda with AI-sorted to-do list (Debrief C)
- `DebriefPulse` -- Repeat-visit pulse with key metrics (Debrief B)

## Dependencies
- `../TerminalProvider` -- useTerminalContext (DebriefAgenda uses workstations for client names)
- CSS variables: `--ember-light`, `--ink-300`, `--ink-400`, `--error`, `--warning`, `--success`, `--font-heading`, `--font-mono`

## Imported By
- `../Terminal.tsx` -- renders debrief screens when blocks are empty

## Files
- `debrief.module.css` -- shared styles for all three debrief components
- `WelcomeSetup.tsx` -- first-time welcome with setup steps (~90 lines)
- `DebriefAgenda.tsx` -- daily agenda with demo data (~175 lines)
- `DebriefPulse.tsx` -- minimal pulse view (~95 lines)
- `MANIFEST.md` -- this file
