# Journal — 2026-04-02 — Editor Core Refactor + Architecture Decisions

## Tags
`refactor`, `editor`, `architecture`, `home`, `skills`

## What happened

Major session with three distinct outcomes:

### 1. Editor Core Refactor (the big one)
Decomposed the 1,779-line Editor.tsx monolith into a modular `editor/core/` architecture:
- **8 custom hooks**: useFocusManager, useContentCache, useUndoStack, useBlockOperations, useSlashMenu, useTabOverflow, usePanelState, useEditorKeys
- **7 UI components**: TabBar, Toolbar, SplitPicker, Breadcrumb, DocumentSurface, BlockRenderer, ZenHint
- **Block registry**: blockRegistry.ts + blockDefaults.ts (centralized imports and defaults)
- **EditorCore.tsx**: 494-line skeleton that composes hooks and renders layout
- **Editor.tsx**: 2-line re-export for import stability
- **13 MANIFEST.md files**: every folder documented with mandatory update rules
- CSS split from 1,017-line Editor.module.css into 8 scoped component modules

### 2. Architecture Decision: Home is its own surface
- Identified conflict between TerminalWelcome (workstation dead state) and DashboardHome (logo click) competing at the home screen layer
- Decision: **Home is app-level, not workstation-level**
- Moved DashboardHome from `workstation/dashboard/` to `components/home/`
- Cleaned up: deleted orphaned `views/terminal-welcome.tsx` and unused `TerminalWelcome.module.css`
- TerminalWelcome remains in `workstation/terminal-welcome/` as the no-workstation onboarding state
- Workspace home and Logo home are two different surfaces that will diverge as features grow

### 3. Workspace toolbar cleanup
- Removed redundant "Felmark [WORKSPACE]" logo+badge from workspace toolbar
- Replaced with clean "Workspace" title (13px mono, matches workstation breadcrumb style)

### 4. Deep Debug skill added
- Created `/deep-debug` skill with full protocol covering web, iOS, Android, hybrid
- Includes special playbooks for decoding, loops, concurrency, release-only bugs
- Structured output format with root cause, evidence, fix, validation, regression guard

## Patterns observed
- Editor.tsx was the single biggest technical debt item — now resolved
- The "competing home screens" issue was a routing identity problem, not a component problem
- Moving DashboardHome out of workstation/ was the correct structural fix

## Decisions made
- `editor/core/` is the folder name (aligns with existing mission naming)
- Home dashboard lives at `components/home/` (app-level, not workstation)
- Workspace and Home are separate surfaces that will diverge
- EditorCore at 494 lines is acceptable (target was <200, but composition overhead is real)
