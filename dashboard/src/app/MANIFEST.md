# app/ — Next.js App Router Entry

The root app router directory. Owns the shell entry point, global styles, and co-located shell utilities.

## Files

| File | Description |
|------|-------------|
| `page.tsx` | App shell — owns all top-level state, hydration, layout (Rail, Sidebar), and passes props into `ViewRouter` |
| `layout.tsx` | Next.js root layout — HTML wrapper, font loading, global providers |
| `loading.tsx` | Next.js loading UI — shown during route transitions |
| `globals.css` | Global CSS reset and design tokens |
| `ShellModals.tsx` | Render-only aggregator for the three floating shell modals: Launchpad, SaveTemplateModal, TemplatePicker |
| `favicon.ico` | App favicon |

## Subdirectories

| Directory | Description |
|-----------|-------------|
| `api/` | Next.js API routes (generate, share, wire, terminal) |
| `share/` | Public shared-document route (`/share/[id]`) |

## Exports

| File | Export | Description |
|------|--------|-------------|
| `ShellModals.tsx` | `ShellModals` | Modal aggregator component — imported only by `page.tsx` |

## Imported By

| Consumer | What |
|----------|------|
| Next.js runtime | `layout.tsx`, `page.tsx`, `loading.tsx` |
| `page.tsx` | `ShellModals` |
