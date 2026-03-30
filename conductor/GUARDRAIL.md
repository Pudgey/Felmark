# Guardrail — Feature and File Inventory

This document is the living reference for Felmark's feature surface and the primary files that implement it. Its job is simple: keep humans and agents from losing track of what exists, where it lives, and what else must be updated when features are added, renamed, moved, or removed.

## Rules

1. Update this file whenever a feature is added, deleted, renamed, split, merged, or retired.
2. Update this file whenever the primary file path for a feature changes.
3. If a feature is removed, note the deletion here in the same pass that removes the code.
4. If a new route, API surface, or major component directory becomes part of a feature, add it here.
5. `AGENTS.md` and `CLAUDE.md` should treat this file as the first inventory check before making structural feature changes.

## How to Update It

For every meaningful feature change:

- Update the relevant row in the Feature Registry
- Update the Primary Files or Routes if paths changed
- Add or remove dependent surfaces if the feature boundary changed
- Keep notes short and factual

If the change is a deletion:

- Remove or mark the feature as retired
- Note the replacement feature if one exists
- Verify any linked routes, APIs, or shared components were also updated

## Current Top-Level Surfaces

| Surface | Primary Entry | Notes |
|--------|---------------|-------|
| Dashboard shell | `dashboard/src/app/page.tsx` | Main client-side app composition point |
| Share route | `dashboard/src/app/share/[id]/page.tsx` | Public/shared project surface |
| AI generation API | `dashboard/src/app/api/generate/route.ts` | AI request endpoint |
| Share API | `dashboard/src/app/api/share/route.ts` | Share lookup/create/update endpoint |

## Feature Registry

| Feature | Status | Primary Files / Directories | Notes |
|--------|--------|------------------------------|-------|
| Workspace shell and navigation | Active | `dashboard/src/app/page.tsx`, `dashboard/src/components/rail/`, `dashboard/src/components/sidebar/`, `dashboard/src/components/dashboard/` | Core app frame, workspace switching, shell state |
| Editor core | Active | `dashboard/src/components/editor/`, `dashboard/src/lib/types.ts`, `dashboard/src/lib/constants.ts` | Main document/editor experience and block system |
| Editor margin and activity/comments | Active | `dashboard/src/components/editor/margin/`, `dashboard/src/components/activity/`, `dashboard/src/components/comments/` | Outline, activity, and comment side surfaces |
| Calendar | Active | `dashboard/src/components/calendar/` | Calendar view and date-linked project navigation |
| Templates | Active | `dashboard/src/components/templates/` | Template picker and save-template flow |
| Services | Active but needs wiring | `dashboard/src/components/services/` | Surface exists; final integration still in progress |
| Share system | Active | `dashboard/src/components/share/`, `dashboard/src/components/editor/ShareModal.tsx`, `dashboard/src/app/share/[id]/page.tsx`, `dashboard/src/app/api/share/route.ts` | Share creation, lookup, and public view |
| AI block | Active | `dashboard/src/components/editor/ai/`, `dashboard/src/app/api/generate/route.ts` | Editor AI generation surface |
| Audio block | Active | `dashboard/src/components/editor/audio/` | In-editor audio capture/transcript surface |
| Team screen | Active | `dashboard/src/components/team/` | Team-oriented collaboration surface |
| The Wire | Active but needs wiring | `dashboard/src/components/wire/` | Dedicated Wire surface exists; full shell integration still in progress |
| Finance | Active | `dashboard/src/components/finance/`, `dashboard/src/components/editor/money/` | Financial blocks and finance-facing surfaces |
| Search | Active | `dashboard/src/components/search/` | Cross-workspace/content search surface |
| Notifications | Active | `dashboard/src/components/notifications/` | Notification panel and related UI |
| Onboarding / launchpad | Active | `dashboard/src/components/onboarding/`, `dashboard/src/components/launchpad/` | First-run and workspace creation flows |

## Shared File Hotspots

These files have broad blast radius and should be checked whenever features are added or deleted:

- `dashboard/src/app/page.tsx`
- `dashboard/src/lib/types.ts`
- `dashboard/src/lib/constants.ts`
- `dashboard/src/components/rail/Rail.tsx`
- `dashboard/src/components/sidebar/Sidebar.tsx`
- `conductor/ACTIVE_CONTEXT.md`
- `conductor/HANDOFF.md`

## Change Checklist

Before closing any feature-add or feature-delete task, confirm:

- The feature is represented correctly in this file
- Primary file paths are up to date
- Replaced or retired features are marked clearly
- Related routes, APIs, and shared surfaces were checked
- `AGENTS.md` and `CLAUDE.md` still point agents here as the structural reference
