# Journal — 2026-04-02 — Super-Brain Audit

## Tags
`architecture`, `dashboard`, `quality`

## What happened

Ran the `superbrain` protocol against Felmark's active `dashboard/` app and benchmarked it against current open source references:
- BlockNote for block-editor ergonomics and typed editor boundaries
- Dub for clean Next.js product structure and package hygiene
- Formbricks for large SaaS module discipline and quality gates
- Cal.com for mature monorepo/product scaling patterns
- Vercel Commerce for a lean App Router baseline when the product is still a single deployable

## Stack fingerprint

- Next.js `16.2.1`, React `19.2.4`, strict TypeScript, App Router
- Single active app in `dashboard/`; no real package split yet
- Styling is primarily CSS Modules, with Tailwind 4 present through `globals.css`
- `dashboard/src` is currently `429` files and about `60,800` lines of TS/TSX/CSS
- `25` TS/TSX files are already `400+` lines; `44` are `300+`

## What the audit said

### 1. Keep the deployable flat for now
The best reference repos only pay the monorepo complexity tax when they have multiple real apps or shared packages to justify it. Felmark still has one active product surface in `dashboard/`. The right move is not "extract packages"; it is "reduce concentration inside the existing app."

### 2. `app/page.tsx` is the biggest shell-level concentration risk
`dashboard/src/app/page.tsx` is still carrying hydration, local persistence, save state, keyboard shortcuts, resize logic, workstations state, view routing, and shell wiring in one route file. That is the main architectural gap versus the cleaner Next.js references.

### 3. `workspace/canvas/Canvas.tsx` is still a monolith
`dashboard/src/components/workspace/canvas/Canvas.tsx` owns storage, grid math, drag modes, insertion targeting, footer status derivation, and render output. The editor-core refactor was the right move; the workspace canvas now needs the same treatment.

### 4. Graph block typing is still prototype-grade
`dashboard/src/components/workstation/editor/blocks/graphs/GraphDataEditor.tsx` still relies on `any`-based mappers and an exhaustive-deps suppression to keep data-shape switching working. That is fine for a prototype, but it is the sharpest code-quality gap left in the editor.

### 5. Documentation density is higher than the reference repos
Felmark has `98` `MANIFEST.md` files under `dashboard/src/components/`. The intent is good, but the density is high enough that the docs can become maintenance overhead unless they stay at subsystem boundaries instead of every leaf folder.

## Recommended order

1. Extract dashboard shell state and persistence out of `dashboard/src/app/page.tsx`
2. Split `dashboard/src/components/workspace/canvas/Canvas.tsx` into storage, derived state, and render pieces
3. Normalize graph block schemas and remove `any`/lint-suppression paths
4. Keep manifests only where a boundary actually matters
5. Defer any package or monorepo push until the extension and web app truly share runtime code

## Verification

- Ran `npm run lint` in `dashboard/`
- Result: existing baseline failures remain: `97` problems (`40` errors, `57` warnings)
- No application code was changed during this session; only conductor files were updated
