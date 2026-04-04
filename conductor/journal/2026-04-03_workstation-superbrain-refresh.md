# Journal — 2026-04-03 — Workstation Super-Brain Refresh

## Tags
`codex`, `architecture`, `editor`, `workstation`

## What happened

Ran a Workstation-specific super-brain pass against the live dashboard stack and current open-source references to decide which structural ideas are worth borrowing without forcing a rewrite.

## Stack fingerprint

- `dashboard/` is a single Next.js `16.2.1` + React `19.2.4` app with TypeScript `strict`
- App Router is in use, but the shell still centers on [`dashboard/src/app/page.tsx`](/Users/donteennis/Felmark/dashboard/src/app/page.tsx)
- Workstation is mostly CSS Modules plus heavy inline styling, local hooks, and localStorage persistence
- No external state library is in play; the shell uses prop threading and feature hooks instead

## External references used

- `steven-tey/novel` — small editor shell, editor complexity lives below the page boundary
- `dubinc/dub` — strong route-group and provider separation, app shell stays thin
- `formbricks/formbricks` — clear root layout/provider split and disciplined app/package boundaries
- `vercel/platforms` — minimal page entrypoints and obvious route segmentation
- `mfts/papermark` — relevant SaaS/document-product shape, still keeps top-level concerns legible

## Key conclusions

- Keep the current Workstation feature folder split; the repo already has real component boundaries worth preserving
- Do not import monorepo complexity or global state just because larger repos use it
- The highest-value change is thinning [`dashboard/src/app/page.tsx`](/Users/donteennis/Felmark/dashboard/src/app/page.tsx), not reimagining the editor internals
- Router/view wrappers should justify their prop surfaces or get thinner
- Manifest accuracy matters because Felmark already uses manifests as a navigation and safety tool

## Local findings

- [`dashboard/src/app/page.tsx`](/Users/donteennis/Felmark/dashboard/src/app/page.tsx) still owns shell state, hydration, resize behavior, modal mounting, and large route prop objects
- [`dashboard/src/views/editor.tsx`](/Users/donteennis/Felmark/dashboard/src/views/editor.tsx) and [`dashboard/src/views/routers/WorkstationRouter.tsx`](/Users/donteennis/Felmark/dashboard/src/views/routers/WorkstationRouter.tsx) are mostly pass-through seams with expensive prop threading
- [`dashboard/src/components/workstation/MANIFEST.md`](/Users/donteennis/Felmark/dashboard/src/components/workstation/MANIFEST.md) is stale and still references removed root files
- Workstation currently has `71` CSS module files but `427` inline `style={{...}}` usages across `app/`, `views/`, and `components/workstation/`, so the styling strategy is drifting

## Recommendations

### Fix now

- Extract shell composition from [`dashboard/src/app/page.tsx`](/Users/donteennis/Felmark/dashboard/src/app/page.tsx) before adding more surface logic there
- Repair [`dashboard/src/components/workstation/MANIFEST.md`](/Users/donteennis/Felmark/dashboard/src/components/workstation/MANIFEST.md) so the inventory matches reality
- Replace inline split-project lookups in [`dashboard/src/views/editor.tsx`](/Users/donteennis/Felmark/dashboard/src/views/editor.tsx) with a single derived selector upstream

### Fix next

- Reduce router/view prop threading if a wrapper is only forwarding data one level down
- Move resize-handle DOM wiring out of [`dashboard/src/app/page.tsx`](/Users/donteennis/Felmark/dashboard/src/app/page.tsx) into a shell primitive
- Standardize which Workstation visuals belong in CSS Modules versus inline tokens

### Monitor

- `EditorCore.tsx`, `CalendarFull.tsx`, `AiBlock.tsx`, `ConversationPanel.tsx`, and `TerminalWelcome.tsx` are large enough to drift back toward monolith status
- Avoid “best-in-class” cargo culting from Dub, Cal.com, or Formbricks; those repos solve bigger operational problems than Felmark has today
- Keep route boundaries honest: thin page files are good only if they remove responsibility instead of moving prop noise around
